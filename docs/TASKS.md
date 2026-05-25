# 📝 BACKLOG DE TAREFAS ATIVAS (ACTIVE TASKS)
## Projeto Killer Skills — Versão Unificada 2.0 (Maio de 2026)

Este documento atua como o quadro ágil e **única fonte de verdade para o andamento operacional** das tarefas da migração do Killer Skills para o ecossistema **React + FastAPI**, organizadas de forma modular e componentizada.

---

## 🗺️ CLASSE ROADMAP: LINHA DO TEMPO OPERACIONAL

```mermaid
gantt
    title Cronograma de Desenvolvimento KS 2.0
    dateFormat  YYYY-MM-DD
    section Fase 1: Setup
    Infraestrutura FastAPI & React   :done,    t1, 2026-05-23, 2026-05-23
    section Fase 2: Login
    Tela 0 - Acesso Social           :done,    t2, 2026-05-23, 2026-05-23
    section Fase 3: Portal
    Tela 1 - Cards e Carrossel Portal:active,  t3, 2026-05-23, 2026-05-24
    section Fase 4: Serviços
    Tela 2 - Serviços & Prompt Forger:todo,    t4, 2026-05-24, 2026-05-24
    section Fase 5: Studio
    Tela 3 - KS Studio & Feed Sandbox:todo,    t5, 2026-05-24, 2026-05-25
```

---

## 📋 CLASSE BACKLOG: DETALHAMENTO DE TAREFAS

### 🟢 FASE 1: INFRAESTRUTURA & ARQUITETURA BASE (Módulo Setup)
*   [x] **Setup do Backend FastAPI:** Criação da API robusta com suporte a CORS e suporte a importação dinâmica do módulo legado `killer_skills`. *(Concluído em 23 de Maio)*
*   [x] **Setup do Frontend React:** Inicialização do ecossistema Vite com Tailwind CSS e suporte a Lucide Icons. *(Concluído em 23 de Maio)*

### 🟢 FASE 2: TELA 0 - LOGIN & IDENTIDADE (Módulo Acesso)
*   [x] **Interface do Celular de Login:** Simulação do smartphone virtual no centro da tela com o glow reativo. *(Concluído em 23 de Maio)*
*   [x] **Unidade Estática de Borda:** Ajuste de bordas (`border-2`) e cor azul (`#1E60FF`) para garantir a ilusão de permanência física do celular durante a transição para a Tela 1. *(Concluído em 23 de Maio)*

### ⏳ FASE 3: TELA 1 - O RITUAL DE GERAR PERSONA (Módulo Onboarding) — [EM ANDAMENTO]
*   [ ] **Os 3 Carrosséis Horizontais (Fórmula 3x4):**
    *   Desenhar o fluxo contendo os 3 carrosséis correspondentes às dimensões internas: *Dimensão da Alma*, *Dimensão da Ação* e *Dimensão Social*.
    *   Implementar a navegação horizontal interna dos 4 cards de cada dimensão utilizando o familiar sistema de "bolinhas" (dots).
*   [ ] **Sliders de Dosagem Vertical:**
    *   Desenvolver o controle de slider vertical estilizado na lateral direita de cada card do arquétipo (0 a 100, padrão em 50% para neutralidade ergonômica).
*   [ ] **Painel de Síntese Matriz:**
    *   Desenhar no visor a tela consolidada com o gráfico diagramático consolidado e totalmente editável das dosagens imputadas.
*   [ ] **Botão Gerar Persona e Persistência:**
    *   Inserir o botão dourado **`GERAR PERSONA`** no rodapé do painel de síntese.
    *   Implementar o salvamento real do objeto JSON `dosagem_persona` na coleção `clientes` do Firestore.
    *   Desenvolver a verificação de primeiro acesso (Router Guard) em `App.jsx` para pular o onboarding se a Persona já existir.
*   [ ] **Expurgador Automático de Mídias (Free Users):**
    *   Programar o background worker assíncrono no FastAPI VPS para higienização e remoção de blobs/arquivos de usuários free 12 dias após postagem.

### ⏳ FASE 3.5: PRODUÇÃO DE CONTEÚDO & IMAGENS (Forja de Mídias) — [EM ANDAMENTO]
*   [ ] **Forja de Prompts e Imagens via Google One (Gemini Advanced / AI):**
    *   Produzir os prompts estruturados e artísticos para as **12 Imagens Master de Portais dos Arquétipos** (divididas pelas 3 Dimensões Internas: Alma, Ação, Social).
    *   Garantir que a direção de arte das 12 imagens integre previamente uma zona de sombra ou gradiente (volumetric dark vignette) projetada para abrigar o Slider UI de dosagem.
    *   Testar e co-criar os prompts em parceria ativa entre Genera e Lincoln, alinhando a estética ao mercado de luxo e marcas premium.

### ⏳ FASE 4: TELA 2 - SERVIÇOS & CONSTRUTOR DE PROMPT (Módulo Serviços) — [PENDENTE]
*   [ ] **Bifurcação de Valor:**
    *   Estruturar no visor interno a divisão entre serviço Grátis e Premium.
    *   *Opção A (Serviço Grátis):* Encaminha imediatamente para a Tela 3 (KS Studio).
    *   *Opção B (Serviço Premium):* Expande no mesmo visor da Tela 2 para abrir o Construtor de Prompt.
*   [ ] **Painel do Construtor de Prompt (Modo Premium):**
    *   Criar os toggles reativos para selecionar micro-serviços (Redator de Legendas, Roteirista de Reels, Compressor WebP, Vídeo AI).
*   [ ] **Feedback de Agentes Trabalhando (Live Work):**
    *   Renderizar no visor uma área de logs retro-futurista simulando o trabalho ativo e a digitação em tempo real dos agentes inteligentes (*O Estrategista*, *O Redator*, *O WebP Compressor*) enquanto a OS é compilada.
*   [ ] **Manifesto da OS & Forja:**
    *   Exibir reativamente o código JSON/YAML da Ordem de Serviço.
    *   Botão dourado **`FORJAR ORDEM DE SERVIÇO`** para disparar o envio e direcionar para o KS Studio Premium.

### ⏳ FASE 5: TELA 3 - O COCKPIT KS STUDIO (Módulo Sandbox) — [PENDENTE]
*   [ ] **Simulador 1:1 de Feed do Instagram:**
    *   Reconstruir a simulação reativa do Reels/Carrossel permitindo ao usuário passar o carrossel de fotos lateralmente e ler a legenda polida gerada pela IA.
*   [ ] **Botões de Agendamento e Postagem:**
    *   Implementar botões minimalistas reativos para postar direto ou agendar no Planner da Scalla Records.

### ⏳ FASE 6: CONEXÕES DE APIS & PERSISTÊNCIA EM NUVEM (Módulo Cérebro) — [PENDENTE]
*   [ ] **Engrenagem NarrativeSkill (Gemini):** Conectar os inputs e micro-serviços aos endpoints reais da API FastAPI para redação e análise de imagem real pelo modelo Gemini Pro.
*   [ ] **Banco de Dados Firestore NoSQL:** Configurar o salvamento real dos dados de campanha agendada na subcoleção NoSQL da nuvem Firebase em tempo real.

---
*Assinado em Conformidade com as Diretrizes da Mesa Redonda.*  
*Lincoln (Orquestrador Geral) — Maio de 2026.*
