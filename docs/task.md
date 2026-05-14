# 📋 Cronograma de Execução: Agente Insta MVP

## Fase 1: Fundação e "Cérebro" (Bastidores)
- [ ] **Tarefa 1.1:** Criar o módulo de Banco de Dados (`database.py`) - Estrutura SQLite para agendamentos e logs.
- [ ] **Tarefa 1.2:** Refatorar o `postar_carrossel.py` em um módulo reutilizável (`bot_engine.py`) que aceite parâmetros (arquivos, legendas).
- [ ] **Tarefa 1.3:** Criar o "Background Worker" - Um script simples que monitora o banco e dispara o bot na hora certa.

## Fase 2: Interface Premium (Flet)
- [ ] **Tarefa 2.1:** Configurar a estrutura base do App Flet (Navegação Lateral e Temas).
- [ ] **Tarefa 2.2:** Construir a tela de "Novo Post" (Upload de arquivos e Agendamento).
- [ ] **Tarefa 2.3:** Construir o Dashboard (Cards de status e visualização da Fila).

## Fase 3: Conexão e Testes
- [ ] **Tarefa 3.1:** Conectar a Interface com o Banco de Dados.
- [ ] **Tarefa 3.2:** Teste de ponta a ponta: Agendar um post para daqui a 5 minutos e verificar a execução silenciosa.
- [ ] **Tarefa 3.3:** Implementar o Agente Analista (Insights básicos) para fechar o MVP.
