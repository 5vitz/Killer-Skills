import sqlite3
import os
from datetime import datetime

class PersistenceSkill:
    def __init__(self, db_path="agente_insta.db"):
        self.db_path = db_path
        self.init_db()

    def get_connection(self):
        return sqlite3.connect(self.db_path)

    def init_db(self):
        """Inicializa o banco de dados e as tabelas necessárias."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS posts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    data_hora DATETIME NOT NULL,
                    arquivos TEXT NOT NULL,
                    legenda TEXT,
                    status TEXT DEFAULT 'pendente',
                    log_erro TEXT
                )
            ''')
            conn.commit()
            print(f"Banco de dados inicializado em: {os.path.abspath(self.db_path)}")

    def agendar_post(self, data_hora, arquivos, legenda):
        """Adiciona um novo post à fila de agendamento."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO posts (data_hora, arquivos, legenda)
                VALUES (?, ?, ?)
            ''', (data_hora, arquivos, legenda))
            conn.commit()
            return cursor.lastrowid

    def obter_posts_pendentes(self):
        """Retorna todos os posts com status 'pendente'."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM posts WHERE status = 'pendente' ORDER BY data_hora ASC")
            return cursor.fetchall()

    def atualizar_status(self, post_id, status, log_erro=None):
        """Atualiza o resultado de uma execução de postagem."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                UPDATE posts 
                SET status = ?, log_erro = ? 
                WHERE id = ?
            ''', (status, log_erro, post_id))
            conn.commit()

# Teste rápido se executado diretamente
if __name__ == "__main__":
    db = PersistenceSkill("teste_agente.db")
    id_post = db.agendar_post(datetime.now().strftime("%Y-%m-%d %H:%M:%S"), "foto1.jpg, foto2.jpg", "Legenda de teste")
    print(f"Post agendado com ID: {id_post}")
    print("Posts Pendentes:", db.obter_posts_pendentes())
