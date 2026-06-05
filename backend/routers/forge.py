import os
import random
import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
from deps import db

router = APIRouter()

ROUTERS_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(ROUTERS_DIR)

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
    carrossel_frames: Optional[List[Dict[str, Any]]] = None


def gerar_prompt_tetracorde(dosagem: Dict[str, float]) -> str:
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

@router.post("/api/forge")
@router.post("/forge")
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
    
    if req.carrossel_frames and len(req.carrossel_frames) > 0:
        # Modo Carrossel Híbrido Individualizado
        qty = len(req.carrossel_frames)
        t_type = "carrossel"
        total_cost = qty * 25
        logistica = f"{req.agendamento_data} às {req.agendamento_hora}" if req.agendamento_data else "IMEDIATO (Publicação VPS Contabo)"
        
        lote_items_yaml = f"\n  ESTEIRA_CARROSSEL_HIBRIDO ({qty} slides):"
        for i, frame in enumerate(req.carrossel_frames, 1):
            metodo_str = frame.get("metodo", "persona").upper()
            ref_str = frame.get("imagemReferencia") or "N/A"
            upload_str = frame.get("imagemUpload") or "N/A"
            
            f_tags = frame.get("tags", {})
            tonica_t = f_tags.get("tonica") or "N/A"
            terca_t = f_tags.get("terca") or "N/A"
            quinta_t = f_tags.get("quinta") or "N/A"
            setima_t = f_tags.get("setima") or "N/A"
            
            lote_items_yaml += f"""
    - SLIDE {i}:
        METODO_PRODUCAO: "{metodo_str}"
        IMAGEM_REFERENCIA: "{ref_str}"
        IMAGEM_UPLOAD: "{upload_str}"
        TAGS_REFINAMENTO_MEVA:
          TONICA_PERSONA: "{tonica_t}"
          TERCA_CENARIO: "{terca_t}"
          QUINTA_ELEMENTOS: "{quinta_t}"
          SETIMA_ESTILO: "{setima_t}\""""
    elif req.lote and len(req.lote) > 0:
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
