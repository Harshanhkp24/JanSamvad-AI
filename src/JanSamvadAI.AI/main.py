from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import re
import numpy as np

app = FastAPI(
    title="JanSamvadAI Civic Intelligence & NLP Service",
    description="Microservice for automated grievance classification, duplicate detection, and civic assistant AI.",
    version="1.0.0"
)

# Initialize SentenceTransformer model for embeddings
try:
    from sentence_transformers import SentenceTransformer, util
    model = SentenceTransformer('all-MiniLM-L6-v2')
except Exception as e:
    print(f"Error loading SentenceTransformer: {e}")
    model = None

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

def get_similarities(new_text: str, existing_texts: List[str]) -> List[float]:
    if not existing_texts:
        return []
    if model:
        try:
            new_emb = model.encode(new_text, convert_to_tensor=True)
            exist_embs = model.encode(existing_texts, convert_to_tensor=True)
            similarities = util.cos_sim(new_emb, exist_embs)[0].tolist()
            return [float(s) for s in similarities]
        except Exception as ex:
            print(f"Embedding error: {ex}")
            pass
    # Heuristic fallback: SequenceMatcher
    import difflib
    new_norm = new_text.lower().strip()
    return [float(difflib.SequenceMatcher(None, new_norm, ext.lower().strip()).ratio()) for ext in existing_texts]

@app.get("/ai/health")
def health():
    return {
        "status": "ok",
        "service": "jan_samvad_ai_nlp",
        "version": "1.0.0",
        "engine": "nlp-semantic-rules-v2",
        "embeddings_loaded": model is not None
    }

@app.post("/ai/classify")
def classify(payload: TextPayload):
    text = payload.text.lower()
    
    # Priority Heuristics
    urgency_keywords = ["emergency", "urgent", "danger", "accident", "hazard", "burst", "spark", "collapsed", "flooding", "risk"]
    high_keywords = ["broken", "severe", "overflow", "contaminated", "no water", "dark", "deep hole", "blocked"]
    
    priority = "Medium"
    if any(k in text for k in urgency_keywords):
        priority = "Critical"
    elif any(k in text for k in high_keywords):
        priority = "High"
    
    # Category mapping rules
    rules = [
        {
            "category": "ROAD_DAMAGE",
            "department": "Roads & Infrastructure",
            "keywords": ["pothole", "road", "tar", "asphalt", "flyover", "bridge", "pavement", "footpath", "crater", "speed breaker", "traffic signal"],
            "base_conf": 0.88
        },
        {
            "category": "WATER_SUPPLY",
            "department": "Water Supply",
            "keywords": ["water", "pipe", "pipeline", "drinking water", "supply", "leakage", "pressure", "tap", "tanker", "borewell", "contamination"],
            "base_conf": 0.91
        },
        {
            "category": "ELECTRICITY",
            "department": "Electricity",
            "keywords": ["power cut", "blackout", "transformer", "wire", "voltage", "cable", "electric pole", "spark"],
            "base_conf": 0.89
        },
        {
            "category": "STREET_LIGHT",
            "department": "Electricity",
            "keywords": ["street light", "streetlight", "dark road", "pole light", "sodium lamp", "led light"],
            "base_conf": 0.92
        },
        {
            "category": "DRAINAGE",
            "department": "Drainage",
            "keywords": ["drain", "drainage", "sewer", "sewage", "gutter", "manhole", "overflowing drain", "waterlogging", "clogged"],
            "base_conf": 0.89
        },
        {
            "category": "SANITATION",
            "department": "Sanitation",
            "keywords": ["garbage", "trash", "waste", "dump", "dustbin", "cleanliness", "sweeping", "dead animal", "smell", "filth"],
            "base_conf": 0.87
        },
        {
            "category": "WASTE_MANAGEMENT",
            "department": "Sanitation",
            "keywords": ["waste", "dump", "landfill", "garbage bin", "litter", "recycle"],
            "base_conf": 0.86
        },
        {
            "category": "HEALTHCARE",
            "department": "Healthcare",
            "keywords": ["hospital", "clinic", "doctor", "medicine", "health center", "ambulance", "dispensary", "vaccine", "dengue", "malaria"],
            "base_conf": 0.86
        },
        {
            "category": "EDUCATION",
            "department": "Education",
            "keywords": ["school", "teacher", "classroom", "student", "midday meal", "desk", "books", "government school", "education"],
            "base_conf": 0.85
        }
    ]

    best_match = None
    best_score = 0.0

    for rule in rules:
        matched_count = sum(1 for kw in rule["keywords"] if kw in text)
        if matched_count > 0:
            score = rule["base_conf"] + min(0.08, matched_count * 0.02)
            if score > best_score:
                best_score = score
                best_match = rule

    if best_match:
        return {
            "category": best_match["category"],
            "department": best_match["department"],
            "priority": priority,
            "confidence": round(min(0.99, best_score), 2),
            "model_version": "jansamvad-nlp-v2"
        }

    return {
        "category": "OTHER",
        "department": "Public Works",
        "priority": priority if priority != "Medium" else "Low",
        "confidence": 0.50,
        "model_version": "jansamvad-nlp-v2"
    }

@app.post("/ai/detect-duplicates")
def detect_duplicates(payload: DuplicateCheckPayload):
    if not payload.existing_texts:
        return {"is_potential_duplicate": False, "matches": []}
    
    similarities = get_similarities(payload.new_text, payload.existing_texts)
    duplicates = []
    
    for idx, sim in enumerate(similarities):
        if sim >= payload.threshold:
            duplicates.append({
                "index": idx,
                "text": payload.existing_texts[idx],
                "similarity": round(sim, 3)
            })
            
    duplicates.sort(key=lambda x: x["similarity"], reverse=True)
    return {
        "is_potential_duplicate": len(duplicates) > 0,
        "matches": duplicates
    }

@app.post("/ai/regional-insights")
def regional_insights(payload: RegionalInsightsPayload):
    complaints = payload.complaints
    if not complaints:
        return {
            "total_complaints_analyzed": 0,
            "top_regions": [],
            "trends": [],
            "insights": []
        }
    
    from collections import defaultdict
    from datetime import datetime

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
            dt = datetime.fromisoformat(c.created_at.replace("Z", "+00:00")) if "T" in c.created_at else datetime.strptime(c.created_at[:10], "%Y-%m-%d")
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
            "primary_category": top_cat
        })
        
    insights = []
    
    if len(sorted_months) >= 2:
        latest_month = sorted_months[-1]
        prev_month = sorted_months[-2]
        
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
                        "description": f"{cat.replace('_', ' ').title()} complaints in {reg} spiked by {pct_increase}% recently, rising to {latest_count} active reports."
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
                        "description": f"{cat.replace('_', ' ').title()} issues represent the majority ({pct}%) of complaints in {reg}, indicating chronic infrastructure pressure."
                    })
                    
    if not insights:
        for cat, cnt in sorted(category_counts.items(), key=lambda x: x[1], reverse=True)[:3]:
            insights.append({
                "region": "District-Wide",
                "category": cat,
                "type": "TREND",
                "description": f"{cat.replace('_', ' ').title()} remains a top district concern with {cnt} total logged cases."
            })
            
    return {
        "total_complaints_analyzed": len(complaints),
        "top_regions": top_regions,
        "trends": trends,
        "insights": insights[:5]
    }

@app.post("/ai/assistant/chat")
def assistant_chat(payload: AssistantMessagePayload):
    query = payload.message.lower().strip()
    
    matched_project = None
    matched_complaint = None
    best_proj_score = 0.0
    best_comp_score = 0.0
    
    if payload.projects_context:
        project_texts = [f"{p.name} in {p.location} by {p.department} status {p.status}" for p in payload.projects_context]
        sims = get_similarities(query, project_texts)
        if sims:
            max_idx = int(np.argmax(sims))
            if sims[max_idx] > best_proj_score:
                best_proj_score = sims[max_idx]
                matched_project = payload.projects_context[max_idx]
                
    if payload.complaints_context:
        complaint_texts = [f"{c.complaint_number} {c.title} category {c.category} status {c.status}" for c in payload.complaints_context]
        sims = get_similarities(query, complaint_texts)
        if sims:
            max_idx = int(np.argmax(sims))
            if sims[max_idx] > best_comp_score:
                best_comp_score = sims[max_idx]
                matched_complaint = payload.complaints_context[max_idx]

    threshold = 0.45
    
    found_complaint = None
    if "js-2026-" in query:
        match = re.search(r"js-2026-\d{6}", query)
        if match:
            comp_num = match.group(0).upper()
            for c in (payload.complaints_context or []):
                if c.complaint_number.upper() == comp_num:
                    found_complaint = c
                    best_comp_score = 1.0
                    break
                    
    if found_complaint:
        matched_complaint = found_complaint

    if best_proj_score >= threshold and best_proj_score >= best_comp_score and matched_project:
        response = (
            f"According to verified platform records, the project **{matched_project.name}** "
            f"is currently in the **{matched_project.status}** stage. It is managed by the **{matched_project.department}** "
            f"department in **{matched_project.location}**, with a sanctioned budget of **₹{matched_project.budget_cr:.2f} Cr**."
        )
    elif best_comp_score >= threshold and matched_complaint:
        response = (
            f"Verified data indicates that grievance **{matched_complaint.complaint_number}** "
            f"(\"{matched_complaint.title}\") is currently **{matched_complaint.status}**. "
            f"It is classified under **{matched_complaint.category.replace('_', ' ').title()}** with a **{matched_complaint.priority}** priority level."
        )
    else:
        if "how to file" in query or "file complaint" in query or "report issue" in query:
            response = (
                "To file a new grievance, click on **'File Grievance'** in the navigation bar. "
                "Provide a title, description, location details, and link a project if relevant. "
                "Our AI system will classify and route the issue to the appropriate department."
            )
        elif "budget" in query or "funds" in query or "financial" in query:
            response = (
                "You can inspect district-wide budget allocations and disbursements under the **'Projects'** tab. "
                "Clicking on any project reveals its full financial ledger, including sanctioned funds and contractor payments."
            )
        elif "status" in query or "track" in query:
            response = (
                "You can track individual grievances using their unique reference number (e.g. `JS-2026-000123`) on the "
                "**'Grievance Tracker'** page. The timeline will show department assignments and status transitions."
            )
        else:
            response = (
                "Hello! I am your JanSamvad Civic Assistant. I can answer questions about verified infrastructure projects, "
                "active grievances, and budgets in your district. "
                "If you are asking about a specific project or complaint, please specify its name or reference number (e.g. `JS-2026-000100`)."
            )

    return {
        "reply": response,
        "service": "JanSamvad Assistant (Verified)"
    }
