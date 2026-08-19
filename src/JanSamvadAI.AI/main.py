from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import re
import difflib

app = FastAPI(
    title="JanSamvadAI Civic Intelligence & NLP Service",
    description="Microservice for automated grievance classification, duplicate detection, and civic assistant AI.",
    version="1.0.0"
)

class TextPayload(BaseModel):
    text: str

class DuplicateCheckPayload(BaseModel):
    new_text: str
    existing_texts: List[str]
    threshold: Optional[float] = 0.65

class AssistantMessagePayload(BaseModel):
    message: str
    role: Optional[str] = "CITIZEN"

@app.get("/ai/health")
def health():
    return {
        "status": "ok",
        "service": "jan_samvad_ai_nlp",
        "version": "1.0.0",
        "engine": "nlp-semantic-rules-v2"
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
    new_norm = payload.new_text.lower().strip()
    duplicates = []
    
    for idx, existing in enumerate(payload.existing_texts):
        exist_norm = existing.lower().strip()
        ratio = difflib.SequenceMatcher(None, new_norm, exist_norm).ratio()
        if ratio >= payload.threshold:
            duplicates.append({
                "index": idx,
                "text": existing,
                "similarity": round(ratio, 3)
            })
            
    duplicates.sort(key=lambda x: x["similarity"], reverse=True)
    return {
        "is_potential_duplicate": len(duplicates) > 0,
        "matches": duplicates
    }

@app.post("/ai/assistant/chat")
def assistant_chat(payload: AssistantMessagePayload):
    query = payload.message.lower().strip()
    
    if "how to file" in query or "file complaint" in query or "report issue" in query:
        response = "To file a grievance, click on **'File Grievance'** in the navigation bar. Fill in the title, description, and location. Our AI will automatically categorize your complaint and assign it to the responsible department."
    elif "budget" in query or "funds" in query or "financial" in query:
        response = "You can view district expenditure and individual project balance ledgers under the **'Projects'** section. Click any project to inspect its sanctioned amount, contractor disbursements, and transaction history."
    elif "status" in query or "track" in query:
        response = "You can track any grievance in real time on the **'Grievance Tracker'** page using your complaint reference number (e.g., `JS-2026-000123`)."
    elif "contact" in query or "officer" in query:
        response = "Department contact directories and ward officers are listed under each department detail page and project metadata."
    else:
        response = f"Thank you for contacting JanSamvad AI. I can assist you with filing grievances, tracking civic works, analyzing project financial disbursements, or navigating local governance information. How can I help you today?"

    return {
        "reply": response,
        "service": "JanSamvad Assistant"
    }
