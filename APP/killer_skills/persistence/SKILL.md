---
name: persistence-skill
description: Gerencia o armazenamento local de agendamentos de postagens e logs de execução. Use esta skill para salvar novos agendamentos, consultar posts pendentes e atualizar o status de execução.
---

# Killer Skill: Persistência (SQLite)

Esta habilidade permite que o Agente Insta mantenha uma memória persistente de suas tarefas.

## Funcionalidades principais:
1. **Inicialização:** Cria o banco de dados local `agente_insta.db` se ele não existir.
2. **Agendamento:** Salva uma nova tarefa de postagem com data, hora, mídias e legenda.
3. **Consulta:** Recupera posts que estão na hora de serem publicados.
4. **Atualização:** Marca o sucesso ou falha de uma postagem.

## Estrutura de Dados (Tabela 'posts'):
- `id`: Identificador único.
- `data_hora`: Momento programado para a postagem.
- `arquivos`: Lista de caminhos de arquivos (JSON ou Texto).
- `legenda`: Texto da publicação.
- `status`: 'pendente', 'sucesso' ou 'falha'.
- `log_erro`: Detalhes técnicos em caso de falha.
