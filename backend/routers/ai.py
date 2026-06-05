from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict
from deps import ai

router = APIRouter()

class CaptionRequest(BaseModel):
    storyboard: List[Optional[str]]
    dosagem: Optional[Dict[str, float]] = None

class AnalysisRequest(BaseModel):
    storyboard: List[str]
    dosagem: Optional[Dict[str, float]] = None

@router.post("/api/ai/caption")
@router.post("/ai/caption")
def get_ai_caption(req: CaptionRequest):
    if not ai:
        return {"caption": "IA Indisponível no momento. Adicione a chave no arquivo .env."}
    try:
        slots = [x if x else None for x in req.storyboard]
        caption = ai.sugerir_legenda(slots, req.dosagem)
        return {"caption": caption}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/ai/analysis")
@router.post("/ai/analysis")
def get_ai_analysis(req: AnalysisRequest):
    if not ai:
        return {"insight": "IA offline no momento. Adicione sua chave GEMINI_API_KEY no .env."}
    try:
        insight = ai.analisar_storyboard(req.storyboard, req.dosagem)
        return {"insight": insight}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
