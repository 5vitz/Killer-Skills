import os
import google.generativeai as genai
from dotenv import load_dotenv

class NarrativeSkill:
    def __init__(self):
        # Tenta carregar de vários locais possíveis para garantir resiliência
        load_dotenv() # Tenta o padrão primeiro
        env_path = os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", ".env")
        load_dotenv(env_path)
        
        raw_key = os.getenv("GEMINI_API_KEY")
        api_key = raw_key.strip() if raw_key else None
        
        print(f"[IA] Tentando carregar chave...")
        
        if api_key and len(api_key) > 10 and api_key != "COLE_SUA_CHAVE_AQUI":
            print(f"[IA] ✅ Chave detectada e carregada (Final: {api_key[-4:]})")
            genai.configure(api_key=api_key)
            # Usando o altamente criativo e gratuito gemini-1.5-pro com suporte à quota do Free Tier
            try:
                models_list = [m.name for m in genai.list_models()]
                print(f"[IA] Modelos disponíveis no SDK: {models_list}")
            except Exception as ex:
                print(f"[IA] Erro ao listar modelos: {ex}")
            self.model = genai.GenerativeModel('gemini-2.5-flash')
            self.ativo = True
        else:
            print(f"[IA] ⚠️ Chave não encontrada ou inválida. Valor bruto: '{raw_key}'")
            self.ativo = False

    def analisar_storyboard(self, imagens_path, dosagem=None):
        if not self.ativo:
            return "IA em modo offline. Verifique o terminal para erros de chave."
        
        if not imagens_path:
            return "Aguardando mídias para análise..."

        try:
            print(f"[IA] Analisando {len(imagens_path)} imagens com MEVA...")
            
            # Construção de contexto arquetípico baseado no MEVA
            meva_context = ""
            if dosagem:
                sorted_meva = sorted(dosagem.items(), key=lambda x: x[1], reverse=True)
                essencia = sorted_meva[0]
                co_piloto = sorted_meva[1]
                subtons = [f"{k} ({v}%)" for k, v in sorted_meva[2:] if v >= 15]
                
                meva_context = f"""
[CONTEXTO ARQUETÍPICO MEVA]
O usuário possui a seguinte assinatura psicológica de Carl Jung:
- Essência Dominante (Principal): {essencia[0].upper()} ({essencia[1]}%)
- Co-Piloto (Expressão): {co_piloto[0].upper()} ({co_piloto[1]}%)
- Subtons Complementares Ativos: {', '.join(subtons) if subtons else 'Nenhum'}

Por favor, adote um tom que combine a autoridade intelectual da Essência com a dinâmica de atração do Co-Piloto.
"""

            prompt = f"""{meva_context}
Você é o Co-Diretor Criativo de Luxo do Killer Skills.
Analise estas imagens de carrossel de Instagram e forneça uma análise curta (máximo 2 frases) de alto impacto estético e intelectual.
Descreva o que elas comunicam e como impactam o público premium sob o viés do posicionamento arquetípico ativo.
"""
            
            conteudo = [prompt]
            for path in imagens_path:
                full_path = os.path.join(os.path.dirname(__file__), "..", "..", "..", "assets", os.path.basename(path))
                print(f"[IA] Lendo imagem: {full_path}")
                
                if os.path.exists(full_path):
                    with open(full_path, "rb") as f:
                        img_data = f.read()
                        conteudo.append({"mime_type": "image/jpeg", "data": img_data})
                else:
                    print(f"[IA] ❌ Erro: Imagem não encontrada no caminho: {full_path}")

            if len(conteudo) == 1:
                return "Erro: Nenhuma imagem pôde ser carregada para análise."

            response = self.model.generate_content(conteudo)
            return response.text
        except Exception as e:
            print(f"[IA] ❌ Falha crítica: {str(e)}")
            return f"Erro na análise: {str(e)}"

    def sugerir_legenda(self, imagens_path, dosagem=None):
        if not self.ativo: return "Ative a chave para sugestão real."
        try:
            print("[IA] Gerando legenda mágica com MEVA...")
            
            meva_context = ""
            if dosagem:
                sorted_meva = sorted(dosagem.items(), key=lambda x: x[1], reverse=True)
                essencia = sorted_meva[0]
                co_piloto = sorted_meva[1]
                subtons = [f"{k.upper()} ({v}%)" for k, v in sorted_meva[2:] if v >= 15]
                
                subtons_instr = ""
                if subtons:
                    subtons_instr = f"Incorpore as nuances sutis dos subtons complementares ativos: {', '.join(subtons)} para enriquecer o texto, modular sombras e refinar o vocabulário."

                meva_context = f"""
[DIRETRIZ DE VOZ - SPECTRO ARQUETÍPICO MEVA]
Sua escrita deve ser calibrada cirurgicamente com base na assinatura psíquica do usuário:
- Essência Dominante (Espinha dorsal do texto): {essencia[0].upper()} ({essencia[1]}%)
- Co-Piloto (Transformação/Engajamento): {co_piloto[0].upper()} ({co_piloto[1]}%)
{subtons_instr}

A voz deve soar como a mescla de {essencia[0].upper()} e {co_piloto[0].upper()}. Evite generalizações. Use a sofisticação da essência com a atração de expressão do co-piloto.
"""

            prompt = f"""{meva_context}
Você é o Cérebro Narrativo de Luxo do Killer Skills.
Escreva uma legenda curta, magnética, premium e com alto poder de retenção para este post.
Use emojis selecionados de forma sutil e hashtags pertinentes ao nicho de luxo/arte.
Foque na autenticidade e na voz expressiva da assinatura do usuário.
"""
            
            conteudo = [prompt]
            for path in imagens_path:
                if path:
                    full_path = os.path.join(os.path.dirname(__file__), "..", "..", "..", "assets", os.path.basename(path))
                    if os.path.exists(full_path):
                        with open(full_path, "rb") as f:
                            conteudo.append({"mime_type": "image/jpeg", "data": f.read()})
            
            response = self.model.generate_content(conteudo)
            return response.text
        except Exception as e:
            return f"Erro: {str(e)}"
