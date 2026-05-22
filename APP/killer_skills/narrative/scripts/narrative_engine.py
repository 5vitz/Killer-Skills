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

    def analisar_storyboard(self, imagens_path):
        if not self.ativo:
            return "IA em modo offline. Verifique o terminal para erros de chave."
        
        if not imagens_path:
            return "Aguardando mídias para análise..."

        try:
            print(f"[IA] Analisando {len(imagens_path)} imagens...")
            prompt = "Analise estas imagens de carrossel de Instagram e dê um insight curto (2 frases) sobre o que elas comunicam e como impactam o público."
            
            conteudo = [prompt]
            for path in imagens_path:
                # Ajuste no caminho da imagem para garantir que encontre em APP/assets
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

    def sugerir_legenda(self, imagens_path):
        if not self.ativo: return "Ative a chave para sugestão real."
        try:
            print("[IA] Gerando legenda mágica...")
            prompt = "Escreva uma legenda curta, magnética e profissional para este post. Use emojis e hashtags."
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
