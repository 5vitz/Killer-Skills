import os
from datetime import datetime

try:
    import firebase_admin
    from firebase_admin import credentials, firestore, storage
except ImportError:
    raise ImportError(
        "A biblioteca 'firebase-admin' não está instalada no seu ambiente virtual Python.\n"
        "Para corrigir isso, execute o seguinte comando no terminal de seu projeto:\n"
        "  source venv/bin/activate && pip install firebase-admin"
    )

class FirestorePost:
    """
    Classe de compatibilidade e alta fidelidade (Princípio da Universalidade).
    Comporta-se exatamente como uma tupla do SQLite antigo para evitar quebra em códigos legados
    (com suporte a indexação tipo row[0], row[1] e len(row)), além de oferecer acesso orientado a objetos.
    """
    def __init__(self, doc_id, data):
        self.id = doc_id
        # Suporta data_hora como string ou timestamp do Firestore
        raw_date = data.get("data_programada") or data.get("data_hora")
        if isinstance(raw_date, datetime):
            self.data_hora = raw_date.strftime("%Y-%m-%d %H:%M:%S")
        else:
            self.data_hora = str(raw_date or "")

        # Reconstrói a string de caminhos separados por vírgula a partir do array storyboard do NoSQL
        storyboard = data.get("storyboard", [])
        caminhos = [item.get("media_path", "") for item in storyboard]
        self.arquivos = ", ".join(caminhos)

        self.legenda = data.get("legenda", "")
        self.status = data.get("status", "pendente")
        self.log_erro = data.get("log_erro", "")

    def __getitem__(self, index):
        # Mapeia exatamente as posições da tabela legada 'posts':
        # 0: id, 1: data_hora, 2: arquivos, 3: legenda, 4: status, 5: log_erro
        mapping = [self.id, self.data_hora, self.arquivos, self.legenda, self.status, self.log_erro]
        return mapping[index]

    def __len__(self):
        return 6

    def __repr__(self):
        return f"<FirestorePost id={self.id} status={self.status} data_hora={self.data_hora}>"


class PersistenceSkill:
    def __init__(self, db_path="app-killerskills"):
        """
        Inicializa o SDK do Firebase Admin e conecta ao Firestore.
        O db_path serve como identificador de compatibilidade para a classe legada.
        """
        key_path = os.getenv("FIREBASE_CREDENTIALS", "firebase_key.json")
        
        # Resolução inteligente do caminho absoluto da chave
        if not os.path.isabs(key_path):
            if os.path.exists(key_path):
                abs_key_path = os.path.abspath(key_path)
            else:
                # O script pode estar rodando dentro de subpastas do app (como APP/killer_skills/persistence/scripts/)
                base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))
                abs_key_path = os.path.join(base_dir, key_path)
        else:
            abs_key_path = key_path

        if not os.path.exists(abs_key_path):
            raise FileNotFoundError(
                f"Arquivo de credenciais do Firebase não encontrado em: {abs_key_path}\n"
                "Certifique-se de que o arquivo 'firebase_key.json' está na raiz do projeto."
            )

        # Inicializa o app Firebase se ainda não foi inicializado
        if not firebase_admin._apps:
            cred = credentials.Certificate(abs_key_path)
            firebase_admin.initialize_app(cred, {
                'storageBucket': 'gen-lang-client-0513318140.firebasestorage.app'
            })
            print("🔥 Firebase Admin SDK inicializado com sucesso!")

        self.db = firestore.client()
        self.bucket = storage.bucket('gen-lang-client-0513318140.firebasestorage.app')
        print("⚡ Conexão ativa com o Cloud Firestore e Storage estabelecida!")
        
        # Garante a existência do locatário (tenant) padrão para compatibilidade retrógrada
        self._inicializar_tenant_padrao()

    def _inicializar_tenant_padrao(self):
        """Garante a estrutura inicial padrão de Scalla Records para retrocompatibilidade no MVP."""
        cliente_ref = self.db.collection("clientes").document("scalla_records")
        if not cliente_ref.get().exists:
            cliente_ref.set({
                "nome": "Scalla Records",
                "empresa": "Scalla Records Studio & Produções Ltda.",
                "camada": "Pessoal",
                "sub_categoria": "Estúdio de Gravação / Música",
                "logo_url": ""
            })
            print("💼 Cliente padrão 'scalla_records' criado no Firestore.")

        conta_ref = cliente_ref.collection("contas").document("scallarecords")
        if not conta_ref.get().exists:
            conta_ref.set({
                "username": "scallarecords",
                "avatar_url": "",
                "meta_token": "",
                "account_type": "Pessoal"
            })
            print("📱 Conta padrão 'scallarecords' cadastrada sob 'scalla_records'.")

    # --- API RETROCOMPATÍVEL (Compatível com main.py legado) ---

    def agendar_post(self, data_hora, arquivos, legenda):
        """
        Adiciona uma nova campanha à fila de agendamento na conta padrão (scalla_records -> scallarecords).
        Esta função mapeia o comportamento do SQLite antigo para a estrutura NoSQL.
        """
        caminhos = [x.strip() for x in arquivos.split(",") if x.strip()]
        
        # Constrói o array storyboard aninhado
        storyboard_list = []
        for i, path in enumerate(caminhos):
            storyboard_list.append({
                "frame_index": i,
                "media_path": path,
                "tipo": "video" if path.lower().endswith((".mp4", ".mov", ".avi")) else "imagem"
            })

        campanha_data = {
            "data_programada": data_hora, # String no formato antigo
            "legenda": legenda,
            "status": "pendente",
            "flow_transitions": ["right", "right", "right"], # Transição padrão
            "log_erro": "",
            "storyboard": storyboard_list,
            "data_criacao": firestore.SERVER_TIMESTAMP
        }

        # Salva na subcoleção de campanhas da conta padrão
        ref = self.db.collection("clientes").document("scalla_records") \
                     .collection("contas").document("scallarecords") \
                     .collection("campanhas").document() # ID autogerado
        
        ref.set(campanha_data)
        print(f"🚀 Campanha agendada no Firestore com ID: {ref.id}")
        return ref.id

    def obter_posts_pendentes(self):
        """Retorna todos os posts com status 'pendente' de todas as contas vinculadas (Busca Global)."""
        campanhas_pendentes = []
        
        # Utiliza Collection Group Query para buscar em todas as subcoleções 'campanhas'
        query = self.db.collection_group("campanhas").where("status", "==", "pendente")
        docs = query.get()
        
        for doc in docs:
            campanhas_pendentes.append(FirestorePost(doc.id, doc.to_dict()))
            
        # Ordena pela data programada ascendentemente
        campanhas_pendentes.sort(key=lambda x: x.data_hora)
        return campanhas_pendentes

    def atualizar_status(self, post_id, status, log_erro=None):
        """Atualiza o status e log de erro de uma campanha agendada."""
        # Busca no caminho padrão primeiro por performance
        default_ref = self.db.collection("clientes").document("scalla_records") \
                             .collection("contas").document("scallarecords") \
                             .collection("campanhas").document(post_id)
        if default_ref.get().exists:
            default_ref.update({
                "status": status,
                "log_erro": log_erro or ""
            })
            print(f"✅ Status da campanha {post_id} atualizado para '{status}' (Caminho Padrão).")
            return

        # Fallback de busca global se não estiver na conta padrão
        docs = self.db.collection_group("campanhas").get()
        for doc in docs:
            if doc.id == post_id:
                doc.reference.update({
                    "status": status,
                    "log_erro": log_erro or ""
                })
                print(f"✅ Status da campanha {post_id} atualizado para '{status}' (Busca Global).")
                return
        print(f"⚠️ Erro: Campanha {post_id} não encontrada para atualização.")

    # --- NOVA API AVANÇADA MULTILOCATÁRIO (Para futuras telas de Coleções e Canais) ---

    def criar_cliente(self, cliente_id, nome, empresa, camada="Pessoal", sub_categoria="", logo_url=""):
        """Cadastra um novo cliente (Coleção Principal) no ecossistema."""
        self.db.collection("clientes").document(cliente_id).set({
            "nome": nome,
            "empresa": empresa,
            "camada": camada,
            "sub_categoria": sub_categoria,
            "logo_url": logo_url
        })
        print(f"💼 Cliente '{nome}' cadastrado com ID '{cliente_id}'!")

    def conectar_conta(self, cliente_id, username, avatar_url="", meta_token="", account_type="Criador"):
        """Conecta um novo canal de Instagram a um cliente específico."""
        self.db.collection("clientes").document(cliente_id) \
               .collection("contas").document(username).set({
                   "username": username,
                   "avatar_url": avatar_url,
                   "meta_token": meta_token,
                   "account_type": account_type
               })
        print(f"📱 Conta de Instagram '@{username}' vinculada ao cliente '{cliente_id}'!")

    def obter_clientes(self):
        """Retorna a lista de todos os clientes cadastrados."""
        docs = self.db.collection("clientes").get()
        return [{**doc.to_dict(), "id": doc.id} for doc in docs]

    def obter_contas(self, cliente_id):
        """Retorna todas as contas de Instagram associadas a um cliente."""
        docs = self.db.collection("clientes").document(cliente_id).collection("contas").get()
        return [{**doc.to_dict(), "id": doc.id} for doc in docs]

    def upload_media(self, local_path, destination_path=None, cliente_id="scalla_records", username="scallarecords"):
        """
        Faz o upload de um arquivo local para o Firebase Storage e retorna sua URL pública permanente.
        """
        # Resolve o caminho local de forma inteligente
        if not os.path.isabs(local_path):
            if os.path.exists(local_path):
                abs_local_path = os.path.abspath(local_path)
            else:
                # Resolve com base na raiz do app se executado de subpastas
                base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))
                abs_local_path = os.path.join(base_dir, local_path)
        else:
            abs_local_path = local_path

        if not os.path.exists(abs_local_path):
            raise FileNotFoundError(f"Arquivo local não encontrado para upload: {abs_local_path}")

        filename = os.path.basename(abs_local_path)
        
        # Estrutura o destino padrão se não for fornecido
        if not destination_path:
            destination_path = f"bibliotecas/{cliente_id}/{username}/{filename}"

        # Obtém a referência do blob
        blob = self.bucket.blob(destination_path)
        
        # Detecta MIME Type básico
        content_type = "application/octet-stream"
        if filename.lower().endswith((".png", ".jpg", ".jpeg")):
            content_type = "image/jpeg"
        elif filename.lower().endswith(".webp"):
            content_type = "image/webp"
        elif filename.lower().endswith((".mp4", ".mov", ".avi")):
            content_type = "video/mp4"

        # Faz o upload com metadados de tipo de conteúdo
        blob.upload_from_filename(abs_local_path, content_type=content_type)
        
        # Torna o blob público para leitura imediata
        blob.make_public()
        
        print(f"☁️ Arquivo {filename} enviado para o Storage em '{destination_path}'")
        return blob.public_url


# Teste de execução rápida local (Apenas se executado diretamente)
if __name__ == "__main__":
    db = PersistenceSkill("teste")
    # Agenda post de teste na estrutura padrão
    id_teste = db.agendar_post(
        datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "uploads/mock1.webp, uploads/mock2.webp",
        "Legenda de teste Firestore!"
    )
    print("Posts Pendentes no Firestore:")
    for post in db.obter_posts_pendentes():
        print(f" - ID: {post.id} | Horário: {post.data_hora} | Mídias: {post.arquivos} | Legenda: {post.legenda}")
