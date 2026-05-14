# 🗺️ Planejamento Estratégico: Agente Insta (Versão Desktop)

## 1. O Problema (A Dor Universal)
- **Falta de Tempo:** Empreendedores não conseguem parar 1h por dia para postar com estratégia.
- **Custo Cognitivo:** Decidir "o que postar agora" e "qual a legenda" gasta energia mental.
- **Complexidade Técnica:** Organizar arquivos, formatos (9:16 vs 4:5) e sequências é chato e propenso a erros.

## 2. A Solução (O Agente)
Uma ferramenta onde o usuário "deposita" a intenção e o conteúdo, e o sistema orquestra a execução.

## 3. Levantamento de Recursos Necessários (Brainstorming)

### A. Estratégia e Organização
- [ ] **Calendário de Conteúdo:** Visão mensal/semanal do que está planejado.
- [ ] **Templates de Campanha:** "Semana de Lançamento", "Conteúdo Educativo", "Prova Social".
- [ ] **Status de Automação:** Saber se o robô postou, se falhou e por quê.

### B. Gestão de Mídias
- [ ] **Otimizador de Imagem:** Garantir que o arquivo não seja pesado demais para o upload do Agente.
- [ ] **Preview Visual:** Ver como a sequência de Stories ou o Carrossel vai ficar antes de enviar para o Agente.

### C. Agendamento (A Chave da Liberdade)
- [ ] **Fila de Espera (Queue):** Adicionar posts a uma fila que o Agente consome nos horários de pico.
- [ ] **Agendamento Fixo:** "Postar isso exatamente segunda-feira às 18h".

### D. Inteligência de Texto
- [ ] **Banco de Legendas:** Salvar legendas padrão ou CTAs (Call to Action) recorrentes.
- [ ] **Gerador de Hashtags:** Relacionadas ao nicho do cliente.

## 4. Módulos de Agentes Especializados (Componentes Isolados)

Para atender diferentes perfis de clientes, o App será um orquestrador desses componentes:

### 🎨 Agente Criativo (Para quem NÃO produz conteúdo)
- **Função:** Gerar imagens e sugestões de arte via IA (DALL-E, Midjourney, etc).
- **Entrada:** Um tema ou nicho.
- **Saída:** Arquivos de imagem prontos para o fluxo.

### ✂️ Agente Editor/Curador (Para quem tem conteúdo "bruto")
- **Função:** Padronização técnica. Redimensionar para 9:16 ou 4:5, aplicar filtros de marca, ajustar brilho/contraste, cortar vídeos.
- **Entrada:** Arquivos originais sem padrão.
- **Saída:** Mídias otimizadas para o Instagram.

### 🚀 Agente Postador (O "Coração" da Execução)
- **Função:** A automação pura. Pegar o conteúdo final e realizar o upload, login, legenda e publicação.
- **Entrada:** Manifesto JSON + Pasta de mídias prontas.
- **Saída:** Post publicado com sucesso.

### 🧠 Agente Estrategista (O Cérebro do App)
- **Função:** Orquestrar o agendamento e a comunicação entre os outros agentes. É a interface Flet onde o usuário toma as decisões.

### 📊 Agente Analista (Insights & Performance)
- **Função:** Visitar os posts feitos nos últimos 7 dias e extrair os números de performance (curtidas, comentários, etc).
- **Entrada:** Link dos posts.
- **Saída:** Relatório de performance no Dashboard do App.

## 5. Detalhamento do MVP (Foco: Falta de Tempo)

O objetivo é permitir que o usuário carregue uma sequência de mídias e defina o horário.

### Requisitos Técnicos do Agente Postador:
- [x] **Persistência de Sessão:** O Agente não deve pedir login toda vez.
- [ ] **Fila de Execução (Queue):** Um banco de dados local simples (SQLite).
- [ ] **Background Worker:** Processo em segundo plano para verificação de horário.
