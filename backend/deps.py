import os
import sys

# Ajustando o caminho do Python para carregar o módulo killer_skills com suporte a caminhos novos e legados
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(BACKEND_DIR)

if os.path.exists(os.path.join(BACKEND_DIR, "killer_skills")):
    sys.path.append(BACKEND_DIR)
    sys.path.append(os.path.join(BACKEND_DIR, "killer_skills"))
else:
    sys.path.append(os.path.join(ROOT_DIR, "APP"))
    sys.path.append(os.path.join(ROOT_DIR, "APP", "killer_skills"))

# Inicialização das instâncias globais compartilhadas
db = None
ai = None

try:
    from persistence.scripts.database import PersistenceSkill
    db = PersistenceSkill("killer_skills.db")
except Exception as e:
    print(f"⚠️ Erro ao carregar PersistenceSkill: {e}")

try:
    from narrative.scripts.narrative_engine import NarrativeSkill
    ai = NarrativeSkill()
except Exception as e:
    print(f"⚠️ Erro ao carregar NarrativeSkill: {e}")
