import os
import sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any, Union
from datetime import datetime

# Ajustando o caminho do Python para carregar o módulo killer_skills com suporte a caminhos novos e legados
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(BACKEND_DIR)

if os.path.exists(os.path.join(BACKEND_DIR, "killer_skills")):
    sys.path.append(BACKEND_DIR)
    sys.path.append(os.path.join(BACKEND_DIR, "killer_skills"))
else:
    sys.path.append(os.path.join(ROOT_DIR, "APP"))
    sys.path.append(os.path.join(ROOT_DIR, "APP", "killer_skills"))

try:
    from persistence.scripts.database import PersistenceSkill
    db = PersistenceSkill("killer_skills.db")
except Exception as e:
    print(f"⚠️ Erro ao carregar PersistenceSkill: {e}")
    db = None

try:
    from narrative.scripts.narrative_engine import NarrativeSkill
    ai = NarrativeSkill()
except Exception as e:
    print(f"⚠️ Erro ao carregar NarrativeSkill: {e}")
    ai = None

app = FastAPI(title="Killer Skills API", version="1.0.0")

# Habilitando CORS para permitir conexões do React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
 
from fastapi.staticfiles import StaticFiles
app.mount("/uploads", StaticFiles(directory=os.path.join(ROOT_DIR, "APP", "uploads")), name="uploads")

# --- MODELOS DE ENTRADA ---
class LoginRequest(BaseModel):
    email: str

class CaptionRequest(BaseModel):
    storyboard: List[Optional[str]]
    dosagem: Optional[Dict[str, float]] = None

class AnalysisRequest(BaseModel):
    storyboard: List[str]
    dosagem: Optional[Dict[str, float]] = None

class ForgeRequest(BaseModel):
    persona_title: str
    persona_tag: str
    micro_services: Dict[str, Any]
    dosagem: Optional[Dict[str, float]] = None
    post_type: Optional[str] = None
    post_qty: Optional[int] = None
    agendamento_data: Optional[str] = None
    agendamento_hora: Optional[str] = None
    persona_confirmada: Optional[bool] = None
    lote: Optional[List[Dict[str, Any]]] = None

# --- PERSONAS DATA SEED ---
PESSOAL_DATA = [
    {"title": "Intelectual / Culto", "subtitle": "Erudição & Sobriedade", "desc": "Ideias profundas, referências históricas e artísticas em um tom culto de autoridade intelectual.", "icon": "menu_book", "color": "#1E60FF", "tag": "Pessoal"},
    {"title": "Criativo / Disruptivo", "subtitle": "Ousadia & Inovação", "desc": "Quebra de padrões tradicionais, originalidade extrema e linguagem altamente autêntica.", "icon": "auto_awesome", "color": "#E91E63", "tag": "Pessoal"},
    {"title": "Autoridade / Líder", "subtitle": "Assertividade & Inspiração", "desc": "Compartilhamento de marcos profissionais (milestones) e tom inspirador de liderança.", "icon": "workspace_premium", "color": "#d4af37", "tag": "Pessoal"},
    {"title": "Carismático / Empático", "subtitle": "Conexão Humana & Leveza", "desc": "Histórias cotidianas do dia a dia (life stories), empatia e tom altamente conversacional.", "icon": "favorite", "color": "#FF5722", "tag": "Pessoal"},
    {"title": "Narcisista / Estético", "subtitle": "Luxo & Impacto Visual", "desc": "Estética cinematográfica, sofisticação de alto padrão e enquadramentos de luxo absoluto.", "icon": "diamond", "color": "#E040FB", "tag": "Pessoal"},
    {"title": "Mentor / Educador", "subtitle": "Valor Didático & Tutoriais", "desc": "Geração de valor prático, compartilhamento de conhecimento e tutoriais passo a passo.", "icon": "school", "color": "#00E676", "tag": "Pessoal"},
    {"title": "Visionário / Futurista", "subtitle": "Tecnologia & Tendências", "desc": "Análise de tendências tecnológicas, inovações disruptivas e otimismo com o futuro.", "icon": "psychology", "color": "#00BCD4", "tag": "Pessoal"},
    {"title": "Pragmático / Direto", "subtitle": "Minimalismo & Foco", "desc": "Linguagem cirúrgica, produtividade máxima e comunicação direta ao ponto sem rodeios.", "icon": "flash_on", "color": "#FFEB3B", "tag": "Pessoal"},
    {"title": "Lifestyle / Aventureiro", "subtitle": "Liberdade & Bastidores", "desc": "Liberdade geográfica, flexibilidade, bastidores de viagens e rotina dinâmica ao ar livre.", "icon": "explore", "color": "#8BC34A", "tag": "Pessoal"},
    {"title": "Humanitário / Propósito", "subtitle": "Valores & Impacto Social", "desc": "Causas sociais, ecologia, legado humanitário e atitudes alinhadas com princípios nobres.", "icon": "public", "color": "#4CAF50", "tag": "Pessoal"},
    {"title": "Especialista Técnico", "subtitle": "Precisão & Credibilidade", "desc": "Precisão metodológica, jargão profissional, gráficos técnicos e alta autoridade acadêmica.", "icon": "science", "color": "#9C27B0", "tag": "Pessoal"},
    {"title": "Conectado / Pop", "subtitle": "Humor Fino & Tendências", "desc": "Memes inteligentes, sintonia rápida com as conversas do momento e linguagem super descontraída.", "icon": "forum", "color": "#FFC107", "tag": "Pessoal"},
]

PROFISSIONAL_DATA = [
    {"title": "Institucional / Estúdio", "subtitle": "Autoridade Artística & Estúdio", "desc": "Portfólio de alto padrão e produções de bastidores premium (ideal para a Scalla Records).", "icon": "business", "color": "#1E60FF", "tag": "Profissional"},
    {"title": "Profissional Liberal / Especialista", "subtitle": "Credibilidade & Segurança", "desc": "Conformidade ética, segurança profissional e alta conversão para agendamentos e consultas.", "icon": "medical_services", "color": "#00E676", "tag": "Profissional"},
    {"title": "Agência Criativa / Branding", "subtitle": "Sofisticação Visual & Luxo", "desc": "Posicionamento estético de altíssimo nível para atrair clientes premium e valorizar a arte.", "icon": "palette", "color": "#d4af37", "tag": "Profissional"},
    {"title": "Agência de Performance / Tráfego", "subtitle": "Métricas, ROI & Leads", "desc": "Foco absoluto em funis de marketing, captação ágil de clientes em escala e métricas de vendas.", "icon": "trending_up", "color": "#00E676", "tag": "Profissional"},
    {"title": "Infoprodutor / Educador Digital", "subtitle": "Lançamentos & Comuniade", "desc": "Estratégia de lançamento de cursos digitais, captação de alunos e autoridade comunitária.", "icon": "cast_for_education", "color": "#E91E63", "tag": "Profissional"},
    {"title": "E-commerce / Loja Virtual", "subtitle": "Catálogos & Provas Sociais", "desc": "Visualização atrativa de produtos físicos, unboxing, novidades de catálogo e avaliações.", "icon": "shopping_bag", "color": "#FF9800", "tag": "Profissional"},
    {"title": "Comércio Local / Varejo", "subtitle": "Atendimento & Ofertas do Dia", "desc": "Atração regional, ofertas locais, endereço físico, atendimento humano e horários.", "icon": "storefront", "color": "#00BCD4", "tag": "Profissional"},
    {"title": "Prestador de Serviços / Freelancer", "subtitle": "Portfólios & Orçamentos", "desc": "Apresentação prática de trabalhos anteriores, simplificação de orçamentos e depoimentos.", "icon": "design_services", "color": "#9E9E9E", "tag": "Profissional"},
    {"title": "Corporativo / B2B", "subtitle": "Comunicação de Alto Nível", "desc": "Estudos de caso (case studies), tom formal e relacionamento estratégico com executivos.", "icon": "handshake", "color": "#607D8B", "tag": "Profissional"},
    {"title": "Portal de Notícias / Curador", "subtitle": "Notícias & Curadoria Rápida", "desc": "Alto volume de postagens informativas diárias, compilações rápidas e notícias de última hora.", "icon": "feed", "color": "#F44336", "tag": "Profissional"},
    {"title": "Empreendedor / Fundador", "subtitle": "Bastidores & Cultura da Marca", "desc": "Liderança humana, cultura da empresa e o lado humano dos bastidores da construção de marca.", "icon": "rocket_launch", "color": "#FFEB3B", "tag": "Profissional"},
    {"title": "Euquipe / Solopreneur", "subtitle": "Otimização & Bastidores Reais", "desc": "Produtividade máxima com tempo restrito, rotina sem filtros e venda direta simplificada.", "icon": "self_improvement", "color": "#795548", "tag": "Profissional"},
]

ALL_PERSONAS = PESSOAL_DATA + PROFISSIONAL_DATA

# --- ENDPOINTS API ---

@app.get("/")
def index():
    return {"status": "online", "message": "Killer Skills API is up and running!"}

@app.post("/api/login")
@app.post("/login")
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

@app.get("/api/personas")
@app.get("/personas")
def get_personas():
    return ALL_PERSONAS

@app.post("/api/ai/caption")
@app.post("/ai/caption")
def get_ai_caption(req: CaptionRequest):
    if not ai:
        return {"caption": "IA Indisponível no momento. Adicione a chave no arquivo .env."}
    try:
        slots = [x if x else None for x in req.storyboard]
        caption = ai.sugerir_legenda(slots, req.dosagem)
        return {"caption": caption}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/analysis")
@app.post("/ai/analysis")
def get_ai_analysis(req: AnalysisRequest):
    if not ai:
        return {"insight": "IA offline no momento. Adicione sua chave GEMINI_API_KEY no .env."}
    try:
        insight = ai.analisar_storyboard(req.storyboard, req.dosagem)
        return {"insight": insight}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def gerar_prompt_tetracorde(dosagem: Dict[str, float]) -> str:
    import json
    import random
    
    if not dosagem:
        return "Um retrato de posicionamento de marca minimalista e elegante sob iluminação difusa de estúdio de luxo."
    
    ORDEM_ARQUETIPOS = ['heroi', 'sabio', 'mago', 'criador', 'explorador', 'rebelde', 'cuidador', 'amante', 'governante', 'homem_comum', 'inocente', 'tolo']
    
    # Ordenar por valor (decrescente) e por índice no array (crescente)
    sorted_meva = sorted(
        dosagem.items(), 
        key=lambda x: (-x[1], ORDEM_ARQUETIPOS.index(x[0]) if x[0] in ORDEM_ARQUETIPOS else 999)
    )
    
    tonica_id = sorted_meva[0][0]
    terca_id = sorted_meva[1][0] if len(sorted_meva) > 1 and sorted_meva[1][1] > 50 else None
    quinta_id = sorted_meva[2][0] if len(sorted_meva) > 2 and sorted_meva[2][1] > 50 else None
    setima_id = sorted_meva[3][0] if len(sorted_meva) > 3 and sorted_meva[3][1] > 50 else None
    
    def carregar_variabilidade(arq_id: str) -> Optional[Dict[str, Any]]:
        try:
            arq_path = os.path.join(BACKEND_DIR, "data", "arquetipos", f"{arq_id}.json")
            if os.path.exists(arq_path):
                with open(arq_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    return data.get("tetracorde_variabilidade")
        except Exception as e:
            print(f"Erro ao carregar variabilidade para {arq_id}: {e}")
        return None

    tonica_var = carregar_variabilidade(tonica_id)
    terca_var = carregar_variabilidade(terca_id) if terca_id else None
    quinta_var = carregar_variabilidade(quinta_id) if quinta_id else None
    setima_var = carregar_variabilidade(setima_id) if setima_id else None

    # Fallbacks elegantes de luxo silencioso
    fallback_tonica = {
        "idade": ["um indivíduo em plena maturidade profissional", "um profissional experiente", "um mentor maduro", "um especialista de presença marcante"],
        "aparencia": ["com olhar sereno e focado", "com feições marcantes e olhar inteligente", "com olhar estratégico e expressão calma", "com expressão assertiva e confiante"],
        "vestimenta": ["um traje clássico minimalista de alta costura", "um blazer escuro de corte contemporâneo", "uma roupa estruturada de alfaiataria premium", "um sobretudo preto elegante de design limpo"],
        "postura": ["em postura ereta e segura", "sentado com naturalidade e elegância", "em pé de forma confiante", "em postura de foco e atenção"],
        "expressao": ["de seriedade tranquila", "com semblante compenetrado e profissional", "de determinação calma", "com olhar atento e sóbrio"],
        "acao": ["observando atentamente os arredores", "em atitude de planejamento e foco", "completando uma tarefa com precisão", "em momento de quietude intelectual"]
    }
    
    fallback_terca = {
        "tipo": ["interno", "interno", "interno", "interno"],
        "localizacao": ["dentro de um escritório contemporâneo de luxo silencioso", "em um espaço arquitetônico de design monumental", "em uma galeria de arte com linhas geométricas minimalistas", "dentro de um ambiente corporativo de altíssimo padrão"],
        "textura_superficies": ["paredes de concreto arquitetônico liso e detalhes metálicos escovados", "superfícies de mármore imperial polido", "detalhes de madeira nobre e revestimento fosco", "placas de ardósia escura polida e vidro jateado"],
        "profundidade": ["uma vista urbana minimalista desfocada ao fundo", "linhas de perspectiva geométricas perfeitas em segundo plano", "antessala elegante sob penumbra ao fundo", "janelas panorâmicas com luz natural difusa ao fundo"]
    }

    fallback_quinta = {
        "objeto_principal": ["um caderno de couro de alta qualidade sobre uma mesa maciça", "uma caneta tinteiro clássica de design luxuoso", "uma ampulheta moderna de metal escovado", "um objeto de design geométrico dourado"],
        "objeto_secundario": ["uma xícara de café expresso escuro emanando vapor sutil", "uma pasta executiva de couro nobre", "um cronógrafo clássico polido", "um livro de capa dura minimalista"],
        "fauna_flora": ["uma planta ornamental de folhagem verde-escura", "uma orquídea branca solitária em vaso minimalista", "um ramo seco decorativo de forma poética", "um bonsai ornamental esculpido"]
    }

    fallback_setima = {
        "enquadramento": ["Plano médio centralizado com simetria impecável", "Retrato cinematográfico em plano americano", "Plano médio-curto com enquadramento de luxo", "Composição centralizada clássica e equilibrada"],
        "luz": ["iluminação de alto brilho com feixes suaves", "luz lateral suave de fim de tarde criando sombras elegantes", "iluminação executiva difusa e uniforme", "luz de contra-luz dramática com sombras longas"],
        "cores": ["tons de cinza-chumbo, preto fosco e realces em ouro escovado", "tons de azul-marinho, grafite e branco puro", "tons terrosos quentes e bege-areia com detalhes em cobre", "tons monocromáticos com detalhes sutis metalizados"],
        "estilo_visual": ["estética de luxo corporativo silencioso, nitidez absoluta em toda a imagem", "fotografia editorial premium de alta costura, paleta sóbria e refinada", "estética executiva cinematográfica de alta definição com linhas geométricas puras", "composição simétrica neo-clássica de extrema imponência e elegância minimalista"]
    }

    idx = random.randint(0, 3)
    
    # 1. Tônica
    t_data = tonica_var if tonica_var and "tonica_persona" in tonica_var else fallback_tonica
    if "tonica_persona" in t_data: t_data = t_data["tonica_persona"]
    idade = random.choice(t_data.get("idade", fallback_tonica["idade"]))
    aparencia = random.choice(t_data.get("aparencia", fallback_tonica["aparencia"]))
    vestimenta = random.choice(t_data.get("vestimenta", fallback_tonica["vestimenta"]))
    postura = random.choice(t_data.get("postura", fallback_tonica["postura"]))
    expressao = random.choice(t_data.get("expressao", fallback_tonica["expressao"]))
    acao = random.choice(t_data.get("acao", fallback_tonica["acao"]))

    # 2. Terça
    if terca_id and terca_var and "terca_cenario" in terca_var:
        c_data = terca_var["terca_cenario"]
        tipo = random.choice(c_data.get("tipo", ["interno"]))
        localizacao = random.choice(c_data.get("localizacao", fallback_terca["localizacao"]))
        texturas = random.choice(c_data.get("textura_superficies", fallback_terca["textura_superficies"]))
        profundidade = random.choice(c_data.get("profundidade", fallback_terca["profundidade"]))
    else:
        tipo = "interno"
        localizacao = fallback_terca["localizacao"][idx]
        texturas = fallback_terca["textura_superficies"][idx]
        profundidade = fallback_terca["profundidade"][idx]

    # 3. Quinta
    if quinta_id and quinta_var and "quinta_elementos" in quinta_var:
        e_data = quinta_var["quinta_elementos"]
        obj_p = random.choice(e_data.get("objeto_principal", fallback_quinta["objeto_principal"]))
        obj_s = random.choice(e_data.get("objeto_secundario", fallback_quinta["objeto_secundario"]))
        flora = random.choice(e_data.get("fauna_flora", fallback_quinta["fauna_flora"]))
    else:
        obj_p = fallback_quinta["objeto_principal"][idx]
        obj_s = fallback_quinta["objeto_secundario"][idx]
        flora = fallback_quinta["fauna_flora"][idx]

    # 4. Sétima
    if setima_id and setima_var and "setima_estilo" in setima_var:
        s_data = setima_var["setima_estilo"]
        enquadramento = random.choice(s_data.get("enquadramento", fallback_setima["enquadramento"]))
        luz = random.choice(s_data.get("luz", fallback_setima["luz"]))
        cores = random.choice(s_data.get("cores", fallback_setima["cores"]))
        estilo = random.choice(s_data.get("estilo_visual", fallback_setima["estilo_visual"]))
    else:
        enquadramento = fallback_setima["enquadramento"][idx]
        luz = fallback_setima["luz"][idx]
        cores = fallback_setima["cores"][idx]
        estilo = fallback_setima["estilo_visual"][idx]

    return f"{enquadramento} de {idade} {aparencia}, vestindo {vestimenta}, {postura} com expressão {expressao}, {acao}. A cena se passa em {localizacao} ({tipo}), com superfícies caracterizadas por {texturas} e {profundidade}. No ambiente destaca-se {obj_p} e {obj_s}, com a presença de {flora}. O plano é banhado por {luz}, com paleta de cores em {cores}. Todo o conjunto sob {estilo}."

@app.post("/api/forge")
@app.post("/forge")
def forge_order(req: ForgeRequest):
    os_id = f"OS-2026-KS-{req.persona_title[:4].upper()}"
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    # Se houver dosagem MEVA, compila em string YAML com a lógica do Tetracorde Harmônico
    meva_signature_yaml = "N/A"
    prompt_imagem = ""
    if req.dosagem:
        ARCHETYPE_TAGS = {
            'heroi': 'Superação', 'sabio': 'Verdade', 'mago': 'Transformação',
            'criador': 'Originalidade', 'explorador': 'Liberdade', 'rebelde': 'Ruptura',
            'cuidador': 'Acolhimento', 'amante': 'Conexão', 'governante': 'Autoridade',
            'homem_comum': 'Realismo', 'inocente': 'Simplicidade', 'tolo': 'Leveza'
        }
        ARCHETYPE_NAMES = {
            'heroi': 'Herói', 'sabio': 'Sábio', 'mago': 'Mago',
            'criador': 'Criador', 'explorador': 'Explorador', 'rebelde': 'Rebelde',
            'cuidador': 'Cuidador', 'amante': 'Amante', 'governante': 'Governante',
            'homem_comum': 'Homem Comum', 'inocente': 'Inocente', 'tolo': 'Tolo'
        }
        
        ORDEM_ARQUETIPOS = ['heroi', 'sabio', 'mago', 'criador', 'explorador', 'rebelde', 'cuidador', 'amante', 'governante', 'homem_comum', 'inocente', 'tolo']
        
        # Ordenação estável decrescente por valor e crescente por índice no array fixo
        sorted_meva = sorted(
            req.dosagem.items(), 
            key=lambda x: (-x[1], ORDEM_ARQUETIPOS.index(x[0]) if x[0] in ORDEM_ARQUETIPOS else 999)
        )
        
        t1_id, t1_val = sorted_meva[0]
        t1_tag = ARCHETYPE_TAGS.get(t1_id, t1_id.capitalize())
        t1_name = ARCHETYPE_NAMES.get(t1_id, t1_id.capitalize())
        
        t2_id, t2_val = sorted_meva[1] if len(sorted_meva) > 1 else (None, 0)
        top2_str = "NEUTRO (Valor de 50% ou menos)"
        if t2_val > 50:
            t2_tag = ARCHETYPE_TAGS.get(t2_id, t2_id.capitalize())
            t2_name = ARCHETYPE_NAMES.get(t2_id, t2_id.capitalize())
            top2_str = f"{t2_name.upper()} ({t2_tag} - {t2_val}%)"
            
        t3_val = sorted_meva[2][1] if len(sorted_meva) > 2 else 0
        quintas = []
        quintas_ids = []
        if t3_val > 50:
            for i in range(2, len(sorted_meva)):
                # Se for a quarta posição (Sétima), interrompe a união da Quinta
                if i == 3:
                    break
                if sorted_meva[i][1] == t3_val:
                    q_id = sorted_meva[i][0]
                    q_tag = ARCHETYPE_TAGS.get(q_id, q_id.capitalize())
                    q_name = ARCHETYPE_NAMES.get(q_id, q_id.capitalize())
                    quintas.append(f"{q_name.upper()} ({q_tag})")
                    quintas_ids.append(q_id)
                else:
                    break
                    
        top3_str = " + ".join(quintas) + f" ({t3_val}%)" if quintas else "NEUTRO (Valor de 50% ou menos)"
        
        # Sétima (4º Lugar - Estilo)
        t4_id, t4_val = sorted_meva[3] if len(sorted_meva) > 3 else (None, 0)
        top4_str = "NEUTRO (Valor de 50% ou menos)"
        if t4_val > 50:
            t4_tag = ARCHETYPE_TAGS.get(t4_id, t4_id.capitalize())
            t4_name = ARCHETYPE_NAMES.get(t4_id, t4_id.capitalize())
            top4_str = f"{t4_name.upper()} ({t4_tag} - {t4_val}%)"

        # Subtoms (Exclui Tônica, Terça, Quintas e Sétima)
        subtoms = []
        for k, v in sorted_meva:
            if k == t1_id:
                continue
            if t2_val > 50 and k == t2_id:
                continue
            if k in quintas_ids:
                continue
            if t4_val > 50 and k == t4_id:
                continue
            if v > 50:
                q_name = ARCHETYPE_NAMES.get(k, k.capitalize())
                subtoms.append(f"{q_name} ({v}%)")
        
        subtoms_str = ", ".join(subtoms[:3]) if subtoms else "N/A"
        
        # Geração do Prompt de Imagem baseado nas matrizes do Tetracorde
        prompt_imagem = gerar_prompt_tetracorde(req.dosagem)
        
        meva_signature_yaml = f"""\n      MENSAGEM_TEXTO_TONICA: "{t1_name.upper()} ({t1_tag} - {t1_val}%)"\n      CENARIO_CONTEXTO_TERCA: "{top2_str}"\n      ELEMENTOS_CENA_QUINTA: "{top3_str}"\n      ESTILO_FOTOGRAFIA_SETIMA: "{top4_str}"\n      COLORIDO_SUBTOMS: "{subtoms_str}"\n      PROMPT_IMAGEM_TETRACORDE: "{prompt_imagem}\""""

    # Lógica de processamento de Lote vs Post Único Legado
    lote_items_yaml = ""
    total_cost = 0
    
    if req.lote and len(req.lote) > 0:
        # Modo Lote Acumulado
        lote_items_yaml = f"\n  ESTEIRA_DE_PRODUCAO_LOTE ({len(req.lote)} itens):"
        for i, item in enumerate(req.lote, 1):
            t_type = item.get("tipo", "reels").upper()
            qty = item.get("quantidade", 1)
            tags_list = ", ".join(item.get("tags", [])) if item.get("tags") else "N/A"
            agendamento = item.get("agendamento", {})
            a_data = agendamento.get("data")
            a_hora = agendamento.get("hora")
            logistica = f"{a_data} às {a_hora}" if a_data else "IMEDIATO (Publicação VPS Contabo)"
            custo_item = item.get("custo", 0)
            total_cost += custo_item
            
            lote_items_yaml += f"""
    - ITEM {i}:
        FORMATO_FISICO: "{t_type}"
        QUANTIDADE_SOLICITADA: {qty}
        TAGS_TATEIS: "{tags_list}"
        LOGISTICA_ENTREGA: "{logistica}"
        CUSTO: "{custo_item} créditos\""""
    else:
        # Fallback Modo Legado (Post Único)
        qty = req.post_qty if req.post_qty is not None else 1
        t_type = req.post_type or "reels"
        unit_cost = 35 if t_type == "reels" else (25 if t_type == "carrossel" else 15)
        total_cost = qty * unit_cost
        tags_list = req.micro_services.get("tags", "N/A")
        logistica = f"{req.agendamento_data} às {req.agendamento_hora}" if req.agendamento_data else "IMEDIATO (Publicação VPS Contabo)"
        
        lote_items_yaml = f"""
  DEFINICOES_DO_POST:
    FORMATO_FISICO: "{t_type.upper()}"
    QUANTIDADE_SOLICITADA: {qty}
    CUSTO_ESTIMADO: "{total_cost} créditos"
    LOGISTICA_ENTREGA: "{logistica}"
    TAGS_TATEIS_DIRECIONAMENTO: "{tags_list}\""""

    manifest_yaml = f"""---
ORDEM_DE_SERVICO:
  ID: "{os_id}"
  TIMESTAMP: "{timestamp}"
  
  AGENTE_ATIVADO:
    NOME: "{req.persona_title}"
    CATEGORIA: "{req.persona_tag}"
    STATUS: "CONVOCADO"
    
  ASSINATURA_ARQUETIPICA_MEVA: {meva_signature_yaml}
  {lote_items_yaml}
  
  CUSTO_TOTAL_CONSOLIDADO: "{total_cost} créditos"
  PERSONA_CONFIRMADA: {"SIM (Selo Ontológico Ativo) ✓" if req.persona_confirmada else "NÃO (Sombra Ativa) 🔴"}

  MICRO_SERVICOS_AUTENTICADOS:
    - Postagem Automática: {"ATIVO 🟢" if req.persona_confirmada else "PENDENTE 🟡"}
    - Curadoria de Grade (Grid AI): ATIVO 🟢 (Plano Premium)
    - Roteirização Reels (Director's Cut): ATIVO 🟢 (Plano Premium)
    - Criação de Legendas: ATIVO 🟢 (Plano Premium)
    - Geração de Imagem: ATIVO 🟢 (Plano Premium)
    - Geração de Vídeo: ATIVO 🟢 (Plano Premium)
    - Compressor WebP Local: ATIVO 🟢 (Padrão de Infraestrutura)
  
  ORQUESTRADOR: "Central-AI-v4"
  STATUS_ORDEM: "PRONTO_PARA_FORJA"
---"""

    # Se a conexão com o banco de dados Firebase/Firestore estiver ativa, salvamos o agendamento
    if db:
        try:
            if req.lote and len(req.lote) > 0:
                for item in req.lote:
                    agendamento = item.get("agendamento", {})
                    a_data = agendamento.get("data")
                    a_hora = agendamento.get("hora")
                    item_time = f"{a_data} {a_hora}" if a_data else timestamp
                    
                    db.agendar_post(
                        data_hora=item_time,
                        arquivos="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500",
                        legenda=f"Lote OS: {item.get('quantidade')}x {item.get('tipo').upper()} para a persona {req.persona_title}!"
                    )
            else:
                db.agendar_post(
                    data_hora=timestamp,
                    arquivos="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500",
                    legenda=f"OS Forjada para a persona {req.persona_title}! Assinatura arquetípica unificada ativa."
                )
        except Exception as e:
            print(f"⚠️ Erro ao salvar agendamentos no Firestore: {e}")

    return {
        "success": True,
        "os_id": os_id,
        "manifest": manifest_yaml,
        "prompt_imagem": prompt_imagem if req.dosagem else None,
        "timestamp": timestamp
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
