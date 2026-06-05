import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Ajustando o caminho do Python para carregar o módulo killer_skills com suporte a caminhos novos e legados
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(BACKEND_DIR)

if BACKEND_DIR not in sys.path:
    sys.path.append(BACKEND_DIR)

if os.path.exists(os.path.join(BACKEND_DIR, "killer_skills")):
    sys.path.append(os.path.join(BACKEND_DIR, "killer_skills"))
else:
    sys.path.append(os.path.join(ROOT_DIR, "APP"))
    sys.path.append(os.path.join(ROOT_DIR, "APP", "killer_skills"))

# Força a inicialização das dependências no deps.py
import deps

# Importando os routers modularizados
from routers import auth, personas, ai, forge

app = FastAPI(title="Killer Skills API", version="1.0.0")

# Habilitando CORS para permitir conexões do React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Montando a rota estática para uploads
app.mount("/uploads", StaticFiles(directory=os.path.join(ROOT_DIR, "APP", "uploads")), name="uploads")

# Registrando os routers modularizados na aplicação
app.include_router(auth.router)
app.include_router(personas.router)
app.include_router(ai.router)
app.include_router(forge.router)

@app.get("/")
def index():
    return {"status": "online", "message": "Killer Skills API is up and running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
