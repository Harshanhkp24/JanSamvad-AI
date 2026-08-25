"""
JanSamvad AI — Civic Intelligence & NLP microservice.

Implements SRS §18:
  18.1 Complaint classification (category, department, priority)
  18.2 Duplicate detection via text embeddings (never auto-deletes)
  18.3 Regional intelligence (region + category + time → insights)
  18.4 Grounded civic assistant (verified platform data only)

Also supports grouping similar issues and an independent evaluation set (SRS NFR: AI quality).
"""
from __future__ import annotations

import json
import os
import re
from collections import defaultdict
from datetime import datetime
from pathlib import Path
from typing import List, Optional

import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

MODEL_VERSION = "jansamvad-nlp-v3"
EVAL_PATH = Path(__file__).resolve().parent / "evaluation_dataset.json"

app = FastAPI(
    title="JanSamvadAI Civic Intelligence & NLP Service",
    description=(
        "Microservice for grievance classification, duplicate detection, "
        "similar-issue grouping, regional insights, and a grounded civic assistant."
    ),
    version="1.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    from sentence_transformers import SentenceTransformer, util as st_util

    model = SentenceTransformer("all-MiniLM-L6-v2")
except Exception as exc:
    print(f"Error loading SentenceTransformer: {exc}")
    model = None
    st_util = None

try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity as sk_cosine

    SKLEARN_AVAILABLE = True
except Exception as exc:
    print(f"scikit-learn unavailable: {exc}")
    SKLEARN_AVAILABLE = False
    TfidfVectorizer = None
    sk_cosine = None


# ---------------------------------------------------------------------------
# Taxonomy (English + Hindi / Hinglish civic language)
# ---------------------------------------------------------------------------

CATEGORY_TAXONOMY = [
    {
        "category": "ROAD_DAMAGE",
        "department": "Roads & Infrastructure",
        "prototype": "Damaged road, potholes, broken pavement, flyover or bridge repair needed.",
        "keywords": [
            "pothole", "road", "tar", "asphalt", "flyover", "bridge", "pavement",
            "footpath", "crater", "speed breaker", "traffic signal",
            "गड्ढा", "सड़क", "सडक", "डामर", "फ्लाईओवर", "पुल", "फुटपाथ",
        ],
        "base_conf": 0.88,
    },
    {
        "category": "WATER_SUPPLY",
        "department": "Water Supply",
        "prototype": "No drinking water, leaking pipeline, low pressure, tanker or contamination.",
        "keywords": [
            "water", "pipe", "pipeline", "drinking water", "supply", "leakage",
            "pressure", "tap", "tanker", "borewell", "contamination",
            "पानी", "पाइप", "पाइपलाइन", "नल", "टैंकर", "रिसाव", "पेयजल",
        ],
        "base_conf": 0.91,
    },
    {
        "category": "ELECTRICITY",
        "department": "Electricity",
        "prototype": "Power cut, transformer fault, broken wire, voltage drop or electric pole issue.",
        "keywords": [
            "power cut", "blackout", "transformer", "wire", "voltage", "cable",
            "electric pole", "spark", "electricity", "outage",
            "बिजली", "करंट", "ट्रांसफॉर्मर", "तार", "वोल्टेज", "पोल",
        ],
        "base_conf": 0.89,
    },
    {
        "category": "STREET_LIGHT",
        "department": "Electricity",
        "prototype": "Street light not working, dark road at night, pole lamp or LED lamp failure.",
        "keywords": [
            "street light", "streetlight", "dark road", "pole light", "sodium lamp",
            "led light", "स्ट्रीट लाइट", "स्ट्रीटलाइट", "अंधेरा", "लैंप",
        ],
        "base_conf": 0.92,
    },
    {
        "category": "DRAINAGE",
        "department": "Drainage",
        "prototype": "Clogged drain, overflowing sewer, manhole, gutter or waterlogging.",
        "keywords": [
            "drain", "drainage", "sewer", "sewage", "gutter", "manhole",
            "overflowing drain", "waterlogging", "clogged",
            "नाला", "नाली", "सीवर", "जलभराव", "मेनहोल",
        ],
        "base_conf": 0.89,
    },
    {
        "category": "SANITATION",
        "department": "Sanitation",
        "prototype": "Uncollected garbage, filthy dump, overflowing dustbin, dead animal or smell.",
        "keywords": [
            "garbage", "trash", "waste", "dump", "dustbin", "cleanliness",
            "sweeping", "dead animal", "smell", "filth",
            "कचरा", "कूड़ा", "सफाई", "गंदगी", "दुर्गंध",
        ],
        "base_conf": 0.87,
    },
    {
        "category": "WASTE_MANAGEMENT",
        "department": "Sanitation",
        "prototype": "Landfill overflow, missing recycle bins, littered market waste.",
        "keywords": [
            "landfill", "garbage bin", "litter", "recycle", "segregation",
            "लैंडफिल", "रीसायकल", "कचरा घर",
        ],
        "base_conf": 0.86,
    },
    {
        "category": "HEALTHCARE",
        "department": "Healthcare",
        "prototype": "Hospital, clinic, doctor, medicine, ambulance or public health issue.",
        "keywords": [
            "hospital", "clinic", "doctor", "medicine", "health center",
            "ambulance", "dispensary", "vaccine", "dengue", "malaria",
            "अस्पताल", "डॉक्टर", "दवाई", "एम्बुलेंस", "स्वास्थ्य",
        ],
        "base_conf": 0.86,
    },
    {
        "category": "EDUCATION",
        "department": "Education",
        "prototype": "Government school, teacher absence, classroom, midday meal or student facilities.",
        "keywords": [
            "school", "teacher", "classroom", "student", "midday meal", "desk",
            "books", "government school", "education",
            "स्कूल", "शिक्षक", "कक्षा", "छात्र", "मध्याह्न", "शिक्षा",
        ],
        "base_conf": 0.85,
    },
]

URGENCY_KEYWORDS = [
    "emergency", "urgent", "danger", "accident", "hazard", "burst", "spark",
    "collapsed", "flooding", "risk", "आपातकाल", "जरूरी", "खतरा", "दुर्घटना",
]
HIGH_KEYWORDS = [
    "broken", "severe", "overflow", "contaminated", "no water", "dark",
    "deep hole", "blocked", "गंभीर", "टूटा", "बंद", "दूषित",
]


# ---------------------------------------------------------------------------
# Request / response models
# ---------------------------------------------------------------------------

class TextPayload(BaseModel):
    text: str


class DuplicateCheckPayload(BaseModel):
    new_text: str
    existing_texts: List[str]
    threshold: Optional[float] = 0.65


class ComplaintData(BaseModel):
    id: int
    region: str
    category: str
    created_at: str


class RegionalInsightsPayload(BaseModel):
    complaints: List[ComplaintData]


class ProjectContext(BaseModel):
    id: int
    name: str
    status: str
    budget_cr: float
    department: str
    location: str


class ComplaintContext(BaseModel):
    id: int
    complaint_number: str
    title: str
    status: str
    priority: str
    category: str


class AssistantMessagePayload(BaseModel):
    message: str
    projects_context: Optional[List[ProjectContext]] = None
    complaints_context: Optional[List[ComplaintContext]] = None


class ClusterItem(BaseModel):
    id: Optional[int] = None
    text: str


class ClusterPayload(BaseModel):
    items: List[ClusterItem]
    threshold: Optional[float] = 0.70


class EvaluatePayload(BaseModel):
    samples: Optional[List[dict]] = None


# ---------------------------------------------------------------------------
# Similarity helpers
# ---------------------------------------------------------------------------

def _normalize(text: str) -> str:
    return (text or "").strip().lower()


def get_similarities(new_text: str, existing_texts: List[str]) -> List[float]:
    if not existing_texts:
        return []

    if model is not None and st_util is not None:
        try:
            new_emb = model.encode(new_text, convert_to_tensor=True)
            exist_embs = model.encode(existing_texts, convert_to_tensor=True)
            similarities = st_util.cos_sim(new_emb, exist_embs)[0].tolist()
            return [float(s) for s in similarities]
        except Exception as ex:
            print(f"Embedding error: {ex}")

    if SKLEARN_AVAILABLE and TfidfVectorizer is not None:
        try:
            vectorizer = TfidfVectorizer()
            matrix = vectorizer.fit_transform([new_text] + list(existing_texts))
            scores = sk_cosine(matrix[0:1], matrix[1:]).flatten().tolist()
            return [float(s) for s in scores]
        except Exception as ex:
            print(f"TF-IDF error: {ex}")

    import difflib

    new_norm = _normalize(new_text)
    return [
        float(difflib.SequenceMatcher(None, new_norm, _normalize(ext)).ratio())
        for ext in existing_texts
    ]


def recommend_priority(text: str) -> str:
    lowered = _normalize(text)
    if any(k in lowered for k in URGENCY_KEYWORDS):
        return "Critical"
    if any(k in lowered for k in HIGH_KEYWORDS):
        return "High"
    return "Medium"


def classify_text(raw_text: str) -> dict:
    text = _normalize(raw_text)
    priority = recommend_priority(raw_text)

    keyword_scores = {}
    for rule in CATEGORY_TAXONOMY:
        matched = sum(1 for kw in rule["keywords"] if kw.lower() in text)
        if matched:
            keyword_scores[rule["category"]] = rule["base_conf"] + min(0.08, matched * 0.02)

    semantic_scores = {}
    if model is not None:
        prototypes = [rule["prototype"] for rule in CATEGORY_TAXONOMY]
        sims = get_similarities(raw_text, prototypes)
        for rule, sim in zip(CATEGORY_TAXONOMY, sims):
            semantic_scores[rule["category"]] = float(sim)

    combined = {}
    for rule in CATEGORY_TAXONOMY:
        cat = rule["category"]
        k = keyword_scores.get(cat, 0.0)
        s = semantic_scores.get(cat, 0.0)
        if k == 0.0 and s == 0.0:
            continue
        if s > 0 and k > 0:
            combined[cat] = 0.45 * k + 0.55 * (0.70 + 0.29 * s)
        elif k > 0:
            combined[cat] = k
        elif s >= 0.42:
            combined[cat] = 0.55 + 0.40 * s

    if not combined:
        return {
            "category": "OTHER",
            "department": "Public Works",
            "priority": priority if priority != "Medium" else "Low",
            "confidence": 0.50,
            "model_version": MODEL_VERSION,
        }

    best_cat = max(combined, key=combined.get)
    best_rule = next(r for r in CATEGORY_TAXONOMY if r["category"] == best_cat)
    return {
        "category": best_cat,
        "department": best_rule["department"],
        "priority": priority,
        "confidence": round(min(0.99, combined[best_cat]), 2),
        "model_version": MODEL_VERSION,
    }


def format_category(cat: str) -> str:
    return (cat or "OTHER").replace("_", " ").title()


def grounded_refusal() -> str:
    return (
        "I can only answer from verified JanSamvad platform records and will not invent "
        "project, complaint, or development information. Please name a project, ward, "
        "or complaint reference (for example JS-2026-000100)."
    )


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.get("/ai/health")
def health():
    return {
        "status": "ok",
        "service": "jan_samvad_ai_nlp",
        "version": "1.1.0",
        "engine": MODEL_VERSION,
        "srs_capabilities": [
            "complaint_classification",
            "duplicate_detection",
            "similar_issue_clustering",
            "regional_intelligence",
            "grounded_assistant",
            "classification_evaluation",
        ],
        "embeddings_loaded": model is not None,
        "tfidf_fallback": SKLEARN_AVAILABLE,
    }


@app.post("/ai/classify")
def classify(payload: TextPayload):
    if not payload.text or not payload.text.strip():
        raise HTTPException(status_code=400, detail="Complaint text is required.")
    return classify_text(payload.text)


@app.post("/ai/detect-duplicates")
def detect_duplicates(payload: DuplicateCheckPayload):
    """Similarity search only. Callers must not auto-delete matched complaints (SRS BR-12)."""
    if not payload.existing_texts:
        return {"is_potential_duplicate": False, "matches": []}

    similarities = get_similarities(payload.new_text, payload.existing_texts)
    duplicates = []
    for idx, sim in enumerate(similarities):
        if sim >= (payload.threshold or 0.65):
            duplicates.append({
                "index": idx,
                "text": payload.existing_texts[idx],
                "similarity": round(sim, 3),
            })
    duplicates.sort(key=lambda x: x["similarity"], reverse=True)
    return {
        "is_potential_duplicate": len(duplicates) > 0,
        "matches": duplicates,
        "auto_delete": False,
    }


@app.post("/ai/cluster-similar")
def cluster_similar(payload: ClusterPayload):
    """Group similar complaints so repeated reports can be reviewed together (SRS US-12)."""
    items = payload.items or []
    n = len(items)
    if n == 0:
        return {"clusters": [], "ungrouped": []}

    texts = [item.text for item in items]
    threshold = payload.threshold or 0.70
    parent = list(range(n))

    def find(i: int) -> int:
        while parent[i] != i:
            parent[i] = parent[parent[i]]
            i = parent[i]
        return i

    def union(a: int, b: int) -> None:
        ra, rb = find(a), find(b)
        if ra != rb:
            parent[rb] = ra

    for i in range(n):
        others = texts[i + 1 :]
        if not others:
            continue
        sims = get_similarities(texts[i], others)
        for offset, sim in enumerate(sims):
            if sim >= threshold:
                union(i, i + 1 + offset)

    groups = defaultdict(list)
    for i in range(n):
        groups[find(i)].append(i)

    clusters = []
    ungrouped = []
    for members in groups.values():
        cluster_items = []
        for i in members:
            cluster_items.append({
                "index": i,
                "id": items[i].id,
                "text": items[i].text,
            })
        if len(members) >= 2:
            clusters.append({
                "size": len(members),
                "relationship_type": "POTENTIAL_DUPLICATE",
                "items": cluster_items,
            })
        else:
            ungrouped.extend(cluster_items)

    clusters.sort(key=lambda c: c["size"], reverse=True)
    return {"clusters": clusters, "ungrouped": ungrouped}


@app.post("/ai/regional-insights")
def regional_insights(payload: RegionalInsightsPayload):
    complaints = payload.complaints
    if not complaints:
        return {
            "total_complaints_analyzed": 0,
            "top_regions": [],
            "trends": [],
            "insights": [],
            "summary": "No complaints were provided for regional analysis.",
        }

    region_counts = defaultdict(int)
    category_counts = defaultdict(int)
    region_category_counts = defaultdict(lambda: defaultdict(int))
    monthly_counts = defaultdict(int)
    region_category_monthly = defaultdict(lambda: defaultdict(lambda: defaultdict(int)))

    for c in complaints:
        region_counts[c.region] += 1
        category_counts[c.category] += 1
        region_category_counts[c.region][c.category] += 1
        try:
            dt = (
                datetime.fromisoformat(c.created_at.replace("Z", "+00:00"))
                if "T" in c.created_at
                else datetime.strptime(c.created_at[:10], "%Y-%m-%d")
            )
            month_key = dt.strftime("%Y-%m")
            monthly_counts[month_key] += 1
            region_category_monthly[c.region][c.category][month_key] += 1
        except Exception:
            pass

    sorted_months = sorted(monthly_counts.keys())
    trends = [{"period": m, "count": monthly_counts[m]} for m in sorted_months]

    top_regions = []
    for reg, total_cnt in sorted(region_counts.items(), key=lambda x: x[1], reverse=True)[:5]:
        top_cat = "OTHER"
        if region_category_counts[reg]:
            top_cat = max(region_category_counts[reg].items(), key=lambda x: x[1])[0]
        top_regions.append({
            "region": reg,
            "count": total_cnt,
            "primary_category": top_cat,
        })

    insights = []
    if len(sorted_months) >= 2:
        latest_month, prev_month = sorted_months[-1], sorted_months[-2]
        for reg in region_category_monthly:
            for cat in region_category_monthly[reg]:
                latest_count = region_category_monthly[reg][cat][latest_month]
                prev_count = region_category_monthly[reg][cat][prev_month]
                if latest_count > prev_count and latest_count >= 3:
                    pct_increase = int(((latest_count - prev_count) / max(1, prev_count)) * 100)
                    insights.append({
                        "region": reg,
                        "category": cat,
                        "type": "SPIKE",
                        "description": (
                            f"{format_category(cat)} complaints in {reg} spiked by {pct_increase}% "
                            f"recently, rising to {latest_count} active reports."
                        ),
                    })

    for reg, cat_map in region_category_counts.items():
        total_reg_cnt = region_counts[reg]
        if total_reg_cnt >= 10:
            for cat, cnt in cat_map.items():
                if cnt / total_reg_cnt >= 0.4:
                    pct = int((cnt / total_reg_cnt) * 100)
                    insights.append({
                        "region": reg,
                        "category": cat,
                        "type": "VOLUME",
                        "description": (
                            f"{format_category(cat)} issues represent the majority ({pct}%) of "
                            f"complaints in {reg}, indicating chronic infrastructure pressure."
                        ),
                    })

    if not insights:
        for cat, cnt in sorted(category_counts.items(), key=lambda x: x[1], reverse=True)[:3]:
            insights.append({
                "region": "District-Wide",
                "category": cat,
                "type": "TREND",
                "description": (
                    f"{format_category(cat)} remains a top district concern with {cnt} total logged cases."
                ),
            })

    top_cat_name, top_cat_count = ("OTHER", 0)
    if category_counts:
        top_cat_name, top_cat_count = max(category_counts.items(), key=lambda x: x[1])
    busiest = top_regions[0]["region"] if top_regions else "the district"
    summary = (
        f"Analyzed {len(complaints)} complaints. {format_category(top_cat_name)} is the leading "
        f"category ({top_cat_count} reports). Highest volume is in {busiest}."
    )

    return {
        "total_complaints_analyzed": len(complaints),
        "top_regions": top_regions,
        "trends": trends,
        "insights": insights[:5],
        "summary": summary,
    }


@app.post("/ai/assistant/chat")
def assistant_chat(payload: AssistantMessagePayload):
    """Retrieve verified platform records only. Do not invent project or complaint facts (SRS §18.4)."""
    query = (payload.message or "").strip()
    if not query:
        raise HTTPException(status_code=400, detail="Message is required.")

    lowered = query.lower()
    projects = payload.projects_context or []
    complaints = payload.complaints_context or []

    found_complaint = None
    number_match = re.search(r"js-\d{4}-\d+", lowered)
    if number_match:
        comp_num = number_match.group(0).upper()
        for c in complaints:
            if c.complaint_number.upper() == comp_num:
                found_complaint = c
                break

    matched_project = None
    matched_complaint = found_complaint
    best_proj_score = 0.0
    best_comp_score = 1.0 if found_complaint else 0.0

    if projects:
        project_texts = [
            f"{p.name} in {p.location} by {p.department} status {p.status}" for p in projects
        ]
        sims = get_similarities(query, project_texts)
        if sims:
            max_idx = int(np.argmax(sims))
            best_proj_score = sims[max_idx]
            matched_project = projects[max_idx]

    if not found_complaint and complaints:
        complaint_texts = [
            f"{c.complaint_number} {c.title} category {c.category} status {c.status}"
            for c in complaints
        ]
        sims = get_similarities(query, complaint_texts)
        if sims:
            max_idx = int(np.argmax(sims))
            best_comp_score = sims[max_idx]
            matched_complaint = complaints[max_idx]

    evidence_threshold = 0.55

    if best_proj_score >= evidence_threshold and best_proj_score >= best_comp_score and matched_project:
        response = (
            f"According to verified platform records, the project **{matched_project.name}** "
            f"is currently in the **{matched_project.status}** stage. It is managed by the "
            f"**{matched_project.department}** department in **{matched_project.location}**, "
            f"with a sanctioned budget of **₹{matched_project.budget_cr:.2f} Cr**."
        )
    elif best_comp_score >= evidence_threshold and matched_complaint:
        response = (
            f"Verified data indicates that grievance **{matched_complaint.complaint_number}** "
            f"(\"{matched_complaint.title}\") is currently **{matched_complaint.status}**. "
            f"It is classified under **{format_category(matched_complaint.category)}** with a "
            f"**{matched_complaint.priority}** priority level."
        )
    elif "how to file" in lowered or "file complaint" in lowered or "report issue" in lowered:
        response = (
            "To file a new grievance, click on **'File Grievance'** in the navigation bar. "
            "Provide a title, description, location details, and link a project if relevant. "
            "Our AI system will classify and route the issue to the appropriate department."
        )
    elif "budget" in lowered or "funds" in lowered or "financial" in lowered:
        response = (
            "You can inspect district-wide budget allocations and disbursements under the "
            "**'Projects'** tab. Clicking on any project reveals its full financial ledger, "
            "including sanctioned funds and contractor payments."
        )
    elif "status" in lowered or "track" in lowered:
        response = (
            "You can track individual grievances using their unique reference number "
            "(e.g. `JS-2026-000123`) on the **'Grievance Tracker'** page. The timeline will "
            "show department assignments and status transitions."
        )
    else:
        response = grounded_refusal()

    return {
        "reply": response,
        "service": "JanSamvad Assistant (Verified)",
        "grounded": True,
    }


def _run_evaluation(samples: Optional[List[dict]] = None) -> dict:
    """Run classification against an independent labeled set (SRS NFR: AI quality/evaluation)."""
    samples = samples or []
    if not samples and EVAL_PATH.exists():
        with open(EVAL_PATH, "r", encoding="utf-8") as handle:
            samples = json.load(handle)

    if not samples:
        raise HTTPException(status_code=404, detail="No evaluation samples available.")

    correct = 0
    details = []
    for sample in samples:
        text = sample.get("text", "")
        expected = (sample.get("category") or "").upper()
        predicted = classify_text(text)
        hit = predicted["category"] == expected
        correct += int(hit)
        details.append({
            "text": text,
            "expected": expected,
            "predicted": predicted["category"],
            "confidence": predicted["confidence"],
            "correct": hit,
        })

    total = len(samples)
    accuracy = round(correct / total, 4) if total else 0.0
    return {
        "model_version": MODEL_VERSION,
        "total_samples": total,
        "correct": correct,
        "accuracy": accuracy,
        "embeddings_loaded": model is not None,
        "details": details,
    }


@app.get("/ai/evaluate")
def evaluate_get():
    return _run_evaluation()


@app.post("/ai/evaluate")
def evaluate_post(payload: EvaluatePayload = EvaluatePayload()):
    return _run_evaluation(payload.samples)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", "8001")), reload=True)
