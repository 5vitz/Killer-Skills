---
name: persistence-skill
description: Gerencia o armazenamento local relacional SQLite (killer_skills.db) de clientes, contas do Instagram vinculadas, campanhas agendadas e mídias de storyboard de forma thread-safe para suportar múltiplos workers em segundo plano.
---

# Killer Skill: Persistência (SQLite Relacional)

Esta habilidade permite que o Killer Skills mantenha uma memória persistente de alta fidelidade e segregação multilocatária de dados.

## Funcionalidades principais:
1. **Inicialização Relacional:** Cria o banco de dados `killer_skills.db` com o mapeamento completo de tabelas de Clientes, Contas, Campanhas e Storyboard.
2. **Segregação por Cliente:** Permite isolar campanhas e ativos para múltiplos clientes no mesmo banco (Multitenancy).
3. **Agendamento Robusto:** Permite agendar campanhas com metadados estruturados, legendas, múltiplos frames de mídias e fluxo de transições.
4. **Gerenciador de Fila:** Permite obter posts agendados na data/hora e atualizar seus status de forma thread-safe.

## Estrutura Física do Banco de Dados:

### 1. Tabela `CLIENTE`
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `nome` (TEXT NOT NULL)
- `empresa` (TEXT)
- `camada` (TEXT) - Pessoal ou Comercial
- `sub_categoria` (TEXT) - Preset ativo ou Outros
- `logo_url` (TEXT)

### 2. Tabela `CONTA_INSTAGRAM`
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `cliente_id` (INTEGER, FOREIGN KEY REFERENCES CLIENTE(id))
- `username` (TEXT NOT NULL UNIQUE)
- `avatar_url` (TEXT)
- `meta_token` (TEXT) - Token social de longa duração OAuth 2.0
- `account_type` (TEXT) - Criador, Comercial ou Pessoal

### 3. Tabela `CAMPANHA`
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `conta_id` (INTEGER, FOREIGN KEY REFERENCES CONTA_INSTAGRAM(id))
- `data_programada` (DATETIME NOT NULL)
- `legenda` (TEXT)
- `status` (TEXT DEFAULT 'pendente') - 'pendente', 'sucesso', 'falha'
- `flow_transitions` (TEXT) - Vetor com strings de transição (Ex: '["right", "down", "right"]')
- `log_erro` (TEXT)

### 4. Tabela `STORYBOARD_MEDIA`
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `campanha_id` (INTEGER, FOREIGN KEY REFERENCES CAMPANHA(id))
- `frame_index` (INTEGER NOT NULL) - 0 a 3 (Slots de mídia)
- `media_path` (TEXT NOT NULL)
- `tipo` (TEXT NOT NULL) - 'imagem' ou 'video'
