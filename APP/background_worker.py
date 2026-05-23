import os
import sys
import time
import requests
from datetime import datetime
import asyncio

# Garante a resolução correta dos imports independentemente do contexto de execução
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(CURRENT_DIR)
sys.path.append(os.path.join(CURRENT_DIR, "killer_skills"))

try:
    from killer_skills.persistence.scripts.database import PersistenceSkill
    from killer_skills.automation.scripts.bot_engine import AutomationSkill
except ImportError as e:
    print(f"❌ Erro de importação: {e}")
    print("Verifique se a estrutura de pastas do app está correta.")
    sys.exit(1)

# Cria a pasta temporária de mídias baixadas se não existir
TEMP_DOWNLOAD_DIR = os.path.join(CURRENT_DIR, "temp_downloads")
os.makedirs(TEMP_DOWNLOAD_DIR, exist_ok=True)


def download_media(url):
    """
    Baixa uma mídia do Firebase Storage para o diretório temporário local
    para permitir que o Playwright interaja com o arquivo físico.
    """
    try:
        filename = url.split("/")[-1].split("?")[0]
        # Sanitiza nome do arquivo
        filename = "".join(c for c in filename if c.isalnum() or c in (".", "_", "-"))
        if not filename:
            filename = f"media_{int(time.time())}.webp"
            
        local_path = os.path.join(TEMP_DOWNLOAD_DIR, filename)
        
        print(f"📥 Baixando mídia em nuvem: {url} ...")
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        with open(local_path, "wb") as f:
            f.write(response.content)
            
        print(f"✅ Download concluído: {local_path}")
        return local_path
    except Exception as e:
        print(f"❌ Falha ao baixar mídia: {e}")
        return None


def limpar_downloads_temporarios(lista_caminhos):
    """Remove arquivos baixados temporariamente para evitar consumo de disco no VPS."""
    for caminho in lista_caminhos:
        if caminho.startswith(TEMP_DOWNLOAD_DIR) and os.path.exists(caminho):
            try:
                os.remove(caminho)
                print(f"🧹 Arquivo temporário removido: {caminho}")
            except Exception as e:
                print(f"⚠️ Erro ao remover arquivo temporário {caminho}: {e}")


async def processar_post(db, bot, post):
    """Executa a publicação física no Instagram e atualiza o status reativamente."""
    print(f"\n🚀 [EXECUÇÃO] Iniciando processamento do Post ID: {post.id}")
    print(f"📅 Horário Programado: {post.data_hora}")
    
    # Extrai e trata os caminhos das mídias (resolvendo URLs públicas do Firebase Storage)
    arquivos_brutos = [x.strip() for x in post.arquivos.split(",") if x.strip()]
    caminhos_físicos = []
    arquivos_para_limpar = []
    
    for arq in arquivos_brutos:
        if arq.startswith(("http://", "https://")):
            # É uma URL do Storage, precisamos baixar fisicamente
            caminho_local = download_media(arq)
            if caminho_local:
                caminhos_físicos.append(caminho_local)
                arquivos_para_limpar.append(caminho_local)
            else:
                erro_msg = f"Erro: Falha no download do ativo em nuvem {arq}"
                db.atualizar_status(post.id, "falha", erro_msg)
                return
        else:
            # É um caminho de arquivo local
            caminhos_físicos.append(arq)
            
    if not caminhos_físicos:
        db.atualizar_status(post.id, "falha", "Erro: Nenhuma mídia válida encontrada para publicação.")
        return

    # Atualiza o status para publicando para travar concorrência (Semáforo NoSQL)
    db.atualizar_status(post.id, "publicando")

    print(f"📝 Legenda: {post.legenda}")
    print(f"📦 Ativos físicos para upload: {caminhos_físicos}")

    # Dispara a engine modular do robô
    sucesso, mensagem = await bot.publicar_carrossel(caminhos_físicos, post.legenda, headless=True)

    if sucesso:
        print(f"🎉 [SUCESSO] Post {post.id} publicado com êxito!")
        db.atualizar_status(post.id, "sucesso")
    else:
        print(f"💥 [FALHA] Erro na publicação do Post {post.id}: {mensagem}")
        db.atualizar_status(post.id, "falha", mensagem)

    # Limpeza preventiva
    limpar_downloads_temporarios(arquivos_para_limpar)


async def main_worker_loop():
    print("--------------------------------------------------")
    print("🧠 INICIANDO DAEMON BACKGROUND WORKER - KILLER SKILLS")
    print("🔄 Monitorando Cloud Firestore em busca de campanhas pendentes...")
    print("--------------------------------------------------")

    try:
        db = PersistenceSkill()
        bot = AutomationSkill()
    except Exception as e:
        print(f"❌ Erro crítico ao conectar com os serviços: {e}")
        return

    while True:
        try:
            # Obtém todas as campanhas globais com status 'pendente'
            campanhas = db.obter_posts_pendentes()
            agora = datetime.now()
            
            for post in campanhas:
                try:
                    # Converte a string de data programada para comparação precisa
                    horario_programado = datetime.strptime(post.data_hora, "%Y-%m-%d %H:%M:%S")
                    
                    if horario_programado <= agora:
                        # O post está agendado para agora ou no passado: Executa!
                        await processar_post(db, bot, post)
                except Exception as ex:
                    print(f"⚠️ Erro ao analisar post agendado {post.id}: {ex}")
            
        except Exception as ex:
            print(f"⚠️ Erro no loop de monitoramento: {ex}")
            
        # Dorme por 30 segundos antes da próxima varredura reativa
        await asyncio.sleep(30)


if __name__ == "__main__":
    try:
        asyncio.run(main_worker_loop())
    except KeyboardInterrupt:
        print("\n👋 Worker finalizado pelo desenvolvedor.")
