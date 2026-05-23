# 📋 VIÉS OPERACIONAL: TASKS (CRONOGRAMA & BACKLOG)

Este arquivo registra a hierarquia de execução do **Killer Skills** baseada em níveis de prioridade tática, consolidando o cronograma do MVP e o backlog de pendências tecnológicas.

---

## 1. HIERARQUIA DE EXECUÇÃO (ORDEM DE PRIORIDADES)

### 🚨 NÍVEL 1: PRIORIDADE CRÍTICA (AFIAÇÃO DE FERRAMENTAL)
*Foco: Ferramentas internas para maximizar a produtividade e precisão do desenvolvimento.*
*   [x] **Tarefa 0.1 (Construtor de Prompt - Estágio 1):** Criar o script compilador CLI em Python `scripts/compilar_prompt.py` que lê os 4 pilares em `/docs/` e gera prompts estruturados no clipboard. *(Concluído em 20 de Maio de 2026)*
*   [x] **Tarefa 0.2 (Lançador Desktop & Atalho Ubuntu 24.04):** Criar script de inicialização automática `run.sh` com reciclagem de portas, instalador `install_launcher.py` que integra o ícone dourado KS no menu de aplicativos do Ubuntu 24.04 e atalho na Área de Trabalho com correção gráfica de `libmpv`. *(Concluído em 21 de Maio de 2026)*

### 🔴 NÍVEL 2: PRIORIDADE ALTA (MVP FASE 1 - O CÉREBRO E BASTIDORES)
*Foco: Banco de dados em nuvem, engines de automação e processo em segundo plano.*
*   [x] **Tarefa 1.1:** Criar o módulo de Banco de Dados (`database.py`) - Estrutura Cloud Firestore para clientes, contas, campanhas e mídias do storyboard. *(Concluído em 22 de Maio de 2026)*
*   [x] **Tarefa 1.2:** Refatorar o script legado `postar_carrossel.py` em uma engine modular e reutilizável (`bot_engine.py`) que aceite parâmetros flexíveis. *(Concluído em 22 de Maio de 2026)*
*   [x] **Tarefa 1.3:** Criar o `background_worker.py` - Script leve em segundo plano que monitora o Firestore e dispara a engine do bot na hora agendada. *(Concluído em 22 de Maio de 2026)*

### 🟡 NÍVEL 3: PRIORIDADE MÉDIA (MVP FASE 2 - INTERFACE PREMIUM FLET)
*Foco: Cockpit de Luxo visual no Flet com navegação lateral, layouts espaçosos e glassmorphism.*
*   [ ] **Tarefa 2.1:** Configurar a estrutura base do App Flet (Sidebar Metálica de Navegação Lateral e Temas).
*   [ ] **Tarefa 2.2:** Construir a tela do Creative Studio & Almoxarifado (Drag & Drop de mídias, digitação de legendas e preview do storyboard).
*   [ ] **Tarefa 2.3:** Construir a tela do Simulador Instagram 1:1 e o Planner Semanal em grid.

### 🟢 NÍVEL 4: PRIORIDADE BAIXA (MVP FASE 3 - INTEGRAÇÃO, ANÁLISE E TESTES)
*Foco: Conexão das pontas, feedback de performance e validação em lote.*
*   [ ] **Tarefa 3.1:** Conectar a Interface Flet com as queries do banco Cloud Firestore NoSQL e Firebase Storage.
*   [ ] **Tarefa 3.2:** Executar testes ponta a ponta (agendamento com disparo silencioso via PM2).
*   [ ] **Tarefa 3.3:** Implementar o Agente Analista para extração básica de performance dos posts.

---

## 2. BACKLOG DE SEGURANÇA & DÉBITOS TÉCNICOS (LONGO PRAZO)

*   [ ] **Aprofundamento Ético e Segurança (Meta API):** Estratégia de "Brand Safety" do Killer Skills (Meta OAuth e governança Human-in-the-Loop para a Scalla Records).
*   [x] **Mapeamento de Serviços:** Listagem dos formatos comerciais de serviços de IA a serem oferecidos. *(Concluído em 22 de Maio de 2026)*
*   [ ] **Renomear Projeto:** Ajuste de referências e imports de `meu-agente-insta` para `killer-skills` em todo o repositório.
*   [x] **Isolamento de Ambiente:** Criação do projeto independente no Google Cloud e separação estrita das variáveis de ambiente (`.env` e `firebase_key.json`). *(Concluído em 22 de Maio de 2026)*
*   [x] **Substituição de Infraestrutura (NoSQL Cloud):** Migração do antigo modelo SQLite/PostgreSQL local direto para Cloud Firestore e Storage, fornecendo concorrência nativa thread-safe. *(Concluído em 22 de Maio de 2026)*
*   [ ] **Planejamento de Escalabilidade Vertical:** Mapear a infraestrutura e recursos consumidos hoje (CPU, memória, banda e armazenamento do VPS Contabo) para planejar limites máximos de hardware e capacidade antes da transição para escala horizontal.
*   [ ] **Mensageria com Redis:** Implementação de Redis Queue para orquestração escalável de workers em produção.
*   [ ] **Dockerização:** Criação de Dockerfiles para implantação rápida.

---
*Documento de Controle e Rastreabilidade Operacional. Killer Skills 2026.*
