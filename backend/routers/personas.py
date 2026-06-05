from fastapi import APIRouter
from seeds.personas import ALL_PERSONAS

router = APIRouter()

@router.get("/api/personas")
@router.get("/personas")
def get_personas():
    return ALL_PERSONAS
