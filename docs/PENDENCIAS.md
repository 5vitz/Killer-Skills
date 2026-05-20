# 📋 Pendências e Roadmap Técnico - Killer Skills

Este arquivo registra as tarefas críticas para garantir a saúde, segurança e escalabilidade do projeto a longo prazo.

## 🔴 Prioridade Alta (Segurança e Débito Técnico)
- [ ] **Mapeamento de Serviços:** Listar quais os tipos de serviços que vamos oferecer.
- [ ] **Renomear Projeto:** Alterar o nome da pasta e referências de `meu-agente-insta` para `killer-skills` (Caminhos, imports, prompts e configs).
- [ ] **Desvincular Chaves de API:** Criar um projeto separado no Google Cloud para o "Killer Skills", removendo a dependência da chave do site "Ingrid Sinkovitz".
- [ ] **Isolamento de Ambiente:** Garantir que cada aplicação tenha seu próprio arquivo `.env` e permissões de serviço independentes.

## 🟡 Prioridade Média (Escalabilidade e Organização)
- [ ] **Unificação de Visão:** Mesclar o conteúdo do `MANIFESTO_VISAO.md` com o `PLANEJAMENTO_ESTRATEGICO.md`.
- [ ] **Unificação Técnica:** Mesclar as instruções do `Manual_de_Construcao_Killer_Skills.pdf` com o `ARQUITETURA_APP.md`.
- [ ] **Migração de Banco de Dados:** Planejar a transição de SQLite para PostgreSQL para suportar múltiplos workers e concorrência de dados.
- [ ] **Configuração de Fila (Redis):** Implementar o Redis para gerenciar as tarefas da esteira de automação (evitar gargalos no backend).
- [ ] **Storage Externo:** Mover o armazenamento de mídias (fotos/vídeos) do servidor local para um bucket S3 ou similar (Stateless design).

## 🟢 Melhorias Futuras
- [ ] **Dockerização:** Criar Dockerfiles para facilitar o deploy em qualquer infraestrutura.
- [ ] **Monitoramento de Agentes:** Criar um dashboard para visualizar o status de cada "Executor" em tempo real.
