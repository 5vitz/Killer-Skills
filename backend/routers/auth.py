from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class LoginRequest(BaseModel):
    email: str

@router.post("/api/login")
@router.post("/login")
def login(req: LoginRequest):
    email = req.email.strip().lower()
    if not email:
        raise HTTPException(status_code=400, detail="E-mail inválido")
    
    ALLOWED_EMAILS = [
        "artz.genera@gmail.com",
        "sinkando@gmail.com",
        "scalla_records@gmail.com",
        "free@killerskills.com.br"
    ]
    
    if email not in ALLOWED_EMAILS:
        raise HTTPException(status_code=400, detail="E-mail não cadastrado")
    
    return {
        "success": True,
        "email": email,
        "is_admin": email in ["artz.genera@gmail.com", "sinkando@gmail.com"]
    }
