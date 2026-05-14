import asyncio
import time
from datetime import datetime
import sys
import os

# Ajustando o caminho para importar as Killer Skills
sys.path.append(os.path.join(os.path.dirname(__file__), 'killer_skills'))

from persistence.scripts.database import PersistenceSkill
from automation.scripts.bot_engine import AutomationSkill

class Orchestrator:
    def __init__(self):
        self.db = PersistenceSkill("agente_insta.db")
        self.bot = AutomationSkill("sessao.json")
        self.is_running = True

    async def verificar_e_executar(self):
        """Verifica posts pendentes e executa se estiver na hora."""
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Orquestrador verificando fila...")
        
        posts_pendentes = self.db.obter_posts_pendentes()
        agora = datetime.now()

        for post in posts_pendentes:
            # post = (id, data_hora, arquivos, legenda, status, erro)
            post_id, post_data_hora, post_arquivos, post_legenda, _, _ = post
            
            # Converte a string de data do banco para objeto datetime
            horario_post = datetime.strptime(post_data_hora, "%Y-%m-%d %H:%M:%S")

            if agora >= horario_post:
                print(f"🚀 Hora de postar! ID: {post_id} - Legenda: {post_legenda[:30]}...")
                
                # Transforma a string de arquivos de volta em lista
                lista_arquivos = [arq.strip() for arq in post_arquivos.split(',')]
                
                # Executa a postagem (Modo VISÍVEL para diagnóstico)
                sucesso, mensagem = await self.bot.publicar_carrossel(lista_arquivos, post_legenda, headless=False)
                
                if sucesso:
                    self.db.atualizar_status(post_id, 'sucesso')
                    print(f"✅ Sucesso: {mensagem}")
                else:
                    self.db.atualizar_status(post_id, 'falha', log_erro=mensagem)
                    print(f"❌ Falha: {mensagem}")

    async def iniciar(self):
        """Loop principal do serviço."""
        print("--- Agente Insta: Orquestrador Ativado ---")
        print("Pressione Ctrl+C para desligar o Agente.")
        
        try:
            while self.is_running:
                await self.verificar_e_executar()
                # Espera 60 segundos antes da próxima verificação
                await asyncio.sleep(60)
        except KeyboardInterrupt:
            print("\nDesligando Orquestrador...")
            self.is_running = False

if __name__ == "__main__":
    orchestrator = Orchestrator()
    asyncio.run(orchestrator.iniciar())
