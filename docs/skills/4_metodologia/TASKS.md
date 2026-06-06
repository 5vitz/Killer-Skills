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
    section Fase 3: Onboarding
    Simplificação (Vídeo + Matriz)   :done,    t3, 2026-05-24, 2026-05-25
    section Fase 4: Serviços
    Tela 2 - Construtor de Prompts    :todo,    t4, 2026-05-25, 2026-05-25
    section Fase 5: Studio
    Tela 3 - KS Studio & Reels        :todo,    t5, 2026-05-25, 2026-05-25
```

---

## 📋 CLASSE BACKLOG: DETALHAMENTO DE TAREFAS

### 🟢 FASE 1: INFRAESTRUTURA & ARQUITETURA BASE (Módulo Setup)
*   [x] **Setup do Backend FastAPI:** Criação da API robusta com suporte a CORS e suporte a importação dinâmica do módulo legado `killer_skills`. *(Concluído em 23 de Maio)*
*   [x] **Setup do Frontend React:** Inicialização do ecossistema Vite com Tailwind CSS e suporte a Lucide Icons. *(Concluído em 23 de Maio)*

### 🟢 FASE 2: TELA 0 - LOGIN & IDENTIDADE (Módulo Acesso)
*   [x] **Interface do Celular de Login:** Simulação do smartphone virtual no centro da tela com o glow reativo. *(Concluído em 23 de Maio)*
*   [x] **Unidade Estática de Borda:** Ajuste de bordas (`border-2`) e cor azul (`#1E60FF`) para garantir a ilusão de permanência física do celular durante a transição para a Tela 1. *(Concluído em 23 de Maio)*

### 🟢 FASE 3: ONBOARDING SIMPLIFICADO & MATRIZ DIRETA (Módulo Onboarding) — [CONCLUÍDO]
*   [x] **Morte dos Carrosséis Lineares:** Expurgada toda a estrutura complexa de cartões individuais 3x4 que gerava fadiga de interação no usuário.
*   [x] **Passo 1: Player da Guia de IA (Didática):**
    *   Exibição estritamente minimalista de um player de vídeo cenográfico de luxo com avatar virtual realista e descrição didática das regras de dosagem.
    *   Injeção do botão de transição `IR PARA A MATRIZ ➔`.
*   [x] **Passo 2: Matriz Arquetípica Direta:**
    *   Exibição consolidada dos 12 sliders arquetípicos em lista única e compacta, permitindo calibração instantânea de gradações (0% a 100%).
    *   Pílula reativa `VER VÍDEO` na barra de título permitindo retroceder para rever a introdução.
    *   **Custom Scrollbar Permanente:** Estilização da barra de rolagem jateada (`.custom-scrollbar-visible`), mantendo-a sempre visível para sinalizar mais dados abaixo da tela.
    *   **Cálculo Dinâmico da Persona:** Computação em tempo real e visualização da Persona Resultante baseada na combinação dos dois arquétipos de maior dosagem.
*   [x] **Roteamento Inteligente (Router Guard):**
    *   Configuração condicional de acesso na autenticação por nível de conta e acessos (`acesso`):
        *   *Premium, Primeiro Acesso (`acesso === 1`):* Roteia obrigatoriamente para a Tela 1 (Onboarding / Vídeo + Sliders).
        *   *Premium, Recorrente (`acesso > 1`):* Pula o onboarding e vai direto ao Construtor de Prompts (Tela 2).
        *   *Usuário Free:* Pula onboarding e vai direto ao KS Studio (Tela 3) para storyboard e simulação manual de feed, com acesso à Tela 1 permanentemente trancado.

### 🟢 FASE 3.5: IDENTIDADE VISUAL & POLIMENTO DA SIDEBAR (Sincronia Estética) — [CONCLUÍDO]
*   [x] **Fundo Preto Puro Global:** Background configurado em preto sólido `#000000` em toda a interface do aplicativo para destacar o visor central do smartphone.
*   [x] **Centralização do Topo:** Título principal **Killer Skills** e sub-rótulo **KS Studio** perfeitamente centralizados horizontalmente no topo da Sidebar.
*   [x] **Alinhamento Geométrico Lateral:**
    *   Rótulos auxiliares removidos para proporcionar visual clean.
    *   Botões **PAINEL ADM** e **ENCERRAR SESSÃO** (em caixa alta) perfeitamente alinhados na mesma coluna de ícones dos menus principais, sem contornos ou bordas artificiais.
    *   Luz verde piscante do indicador **ONLINE NA WEB** (ajustado ao português do Brasil e com tamanho otimizado para 10px) alinhada exatamente na margem dos ícones.

### 🟢 FASE 3.8: VOCABULÁRIO PREMIUM & ESTÚDIO DE CRIAÇÃO (Eliminação de "Forja") — [CONCLUÍDO]
*   [x] **Sanitização de Ambiguidade de Termos:** Remoção completa dos termos industriais "forja" e "forjar" no frontend, blindando o visual de mercado de luxo.
*   [x] **Substituição de Rótulos no Cockpit:**
    *   Atualização de *Cockpit de Forja* para **ESTÚDIO DE CRIAÇÃO**.
    *   Atualização de *Legenda Forjada* para **LEGENDA LAPIDADA**.
    *   Atualização de *FORJAR ORDEM DE SERVIÇO* para **EMITIR ORDEM DE SERVIÇO** no botão dourado principal.
    *   Atualização de *A Forja está ativada* para **A Criação está ativada...** no modal do manifesto.

---

### 🟢 FASE 3.9: SIMETRIA EM 3 COLUNAS & NOMENCLATURA HIBRIDA (Módulo Onboarding) — [CONCLUÍDO]
*   [x] **Planejamento Ontológico e Epistemológico (MEVA):** Criação da especificação do Modelo de Espectro Vetorial Arquetípico (MEVA) e dos Títulos Duplos Híbridos (ex: `SÁBIO / CRIADOR`). *(Concluído em 25 de Maio)*
*   [x] **Reengenharia de Grid em App.jsx:** Implementação do layout de 3 colunas em Desktop (Menu Esquerdo + Celular Central + Painel Direito). *(Concluído)*
*   [x] **Limpeza Completa do Smartphone Central:** Mover todos os botões de ação e textos informativos para a nova barra lateral direita, mantendo o visor central puramente focado em vídeo/sliders. *(Concluído)*
*   [x] **Implementação do Diagnóstico Detalhado:** Renderização da Doutrina Híbrida e Modulação de Subtons baseada nas menores calibrações. *(Concluído)*
*   [x] **Botão "Elaborar Persona":** Substituição final do botão "Gerar Persona". *(Concluído)*
*   [x] **Integração da Trilha Sonora dos Arquétipos:** Carregamento automático do arquivo `Trilha_Arquetipos.mp3` na entrada de Tela 1 - Elaborar Persona com mute/unmute e slider de volume visível o tempo todo na base da Coluna 3. *(Concluído)*
*   [x] **Interface Letreiro Marquee e Atmosfera Respirante:** Implementação de letreiro dinâmico em loop horizontal *"Os 12 Arquétipos de Jung"* com tipografia caligráfica indiana *Yatra One* e fundo respirante de auras intensas em verde e lilás sob aceleração de hardware por CSS. *(Concluído)*

### 🟢 FASE 4.5: MOTOR DE LOTE ACUMULADO (Módulo Serviços & Fila da Esteira) — [CONCLUÍDO]
*   [x] **Infraestrutura de Fila de Lotes em React:** Criação do estado `loteProducao` em `App.jsx` para suportar composições dinâmicas multipost.
*   [x] **Módulo Visual de Lote (Coluna 3):** Implementação da lista compacta e sofisticada no Accordion de Produção com deleção rápida (`✕`).
*   [x] **Cálculo Reativo de Créditos (Coluna 2):** Exibição da soma consolidada de créditos estimulada de todo o lote no card dourado no smartphone.
*   [x] **Validação Pydantic e FastAPI para Lotes:** Ajuste na classe `ForgeRequest` no backend para receber e persistir múltiplos posts.
*   [x] **Manifesto Dinâmico YAML compilado:** Geração dinâmica do manifesto no FastAPI listando cada postagem (tipo, quantidade, data/hora e custo) de forma individualizada.

### 🟢 FASE 4.8: TRANSIÇÃO DIRETA E FORJA UNIFICADA NO SMARTPHONE (Módulo Studio) — [CONCLUÍDO]
*   [x] **Fim do Modal Intermediário:** Remoção de 100% do código e markup da antiga janela suspensa "showForgeModal" que quebrava o fluxo.
*   [x] **Redirecionamento Instantâneo:** Ao clicar em `EMITIR ORDEM DE SERVIÇO` na Tela 2A, a view altera-se imediatamente para a Tela 3 (`activeView = "storyboard"`).
*   [x] **Integração Reativa de Visor (Coluna 2):** O visor do smartphone da Tela 3 assume o estado da forja se `forgeProgress > 0`, renderizando a barra de progresso dourada, título "A Criação está ativada..." em **Poppins 300** e o console místico do manifesto YAML.
*   [x] **Botão de Simulação Master:** Criação do botão `Simular Esteira em Prod ➔` na base interna do celular após a conclusão (100%), permitindo o reset suave do visor.

### 🟢 FASE 5.0: BIBLIOTECA DE AGENTES E NOVA ONTOLOGIA OPERACIONAL (Módulo Documentação) — [CONCLUÍDO]
*   [x] **Criação do Diretório Local:** `/docs/skills/5_agentes/` integrado nativamente ao repositório local.
*   [x] **Mapeamento Conceitual:** Elaboração de `INDEX.md` consolidando a origem do repositório `msitarzewski/agency-agents` e a nova Trindade Operacional (Gerente de Esteira, Construtor de Flow e Agente Postador).
*   [x] **Download de Especialistas de Insumo:** Gravação física local e enriquecimento de 5 manifestos estratégicos: *Image Prompt Engineer*, *Whimsy Injector*, *Content Creator*, *Carousel Growth Engine* e *Sprint Prioritizer*.

### 🔵 FASE 4.0: RESPONSIVIDADE MOBILE NATIVA (Fórmula da Gaveta) — [PLANEJADO]
*   [ ] **Hook isMobile Viewport:** Detecção em tempo real do dispositivo do usuário.
*   [ ] **Destruição do Smartphone Virtual no Mobile:** Eliminação das bordas falsas para dar espaço à tela cheia do dispositivo real do usuário.
*   [ ] **Sliders Táteis Ergonômicos:** Ampliação de sliders para preenchimento de tela no mobile real.
*   [ ] **Drawer / Bottom Sheet:** Gaveta de visualização para o relatório expandido do diagnóstico.

---

## 🎯 PONTO DE PARADA OPERACIONAL (ONDE PARAMOS HOJE)
*   **Forja Unificada e Transição Direta:** A emissão de Ordem de Serviço na Tela 2A agora transiciona o usuário imediatamente para a Tela 3 (KS Studio), e o visor do smartphone central assume reativamente todo o progresso e renderiza o manifesto YAML consolidado. O modal intermediário foi 100% expurgado do código.
*   **Botão de Simulação Integrado:** Adicionado o botão dourado `Simular Esteira em Prod ➔` na base interna do celular, resetando os estados e retornando o visor ao modo padrão de forma fluida.
*   **Biblioteca de Agentes Importada:** Criado o diretório `/docs/skills/5_agentes/` com um arquivo `INDEX.md` mapeando a Trindade Operacional (Gerente de Esteira, Construtor de Flow e Agente Postador) e contendo a gravação local de 5 agentes estratégicos do repositório `msitarzewski/agency-agents` do GitHub.
*   **Compilação e Estabilidade Local:** O pipeline de build do frontend Vite (`npm run build`) e a validação sintática do backend FastAPI (`python3 -m py_compile app.py`) foram executados com **100% de sucesso**. Tudo está plenamente estável no ambiente local.

---

## 🚀 PLANO DE TRABALHO IMEDIATO (CÓDIGO & INTEGRAÇÃO)
*   [ ] **Mapeador e Compressor de Mídia WebP (Extrator Local) — HOJE:**
    *   Criar script utilitário para mapear as mais de 20 imagens gigantes (PNGs) na pasta local `Imagens/12_arquetipos/` e permitir a seleção das 12 imagens finais (uma para cada arquétipo).
    *   Renomear os arquivos com códigos estranhos do Gemini para IDs limpos e padronizados (ex: `sabio.webp`, `mago.webp`).
    *   Converter os PNGs pesados (6-8MB) para WebP leve de alta fidelidade (100-300KB) mantendo a proporção estrita de **9:16**.
    *   Fazer o upload automático para o Firebase Storage e atualizar as URLs permanentes no Banco de Dados/código.
*   [ ] **Refatoração Modular do Backend (Desacoplamento e Ontologia) — FUTURO:**
    *   Migrar os seeds hardcoded de personas (`PESSOAL_DATA` e `PROFISSIONAL_DATA`) de `app.py` para um módulo de sementes dedicado (`backend/seeds/personas.py`).
    *   Isolar os esquemas de validação do Pydantic em um arquivo de tipos próprio (`backend/models/schemas.py`).
    *   Substituir a estrutura monolítica de endpoints em `app.py` por sub-rotas componentizadas usando `APIRouter` do FastAPI (ex: `/routers/auth.py`, `/routers/ai.py`, `/routers/services.py`).
*   [ ] **Módulo de Responsividade Mobile Nativa (Fase 4.0):**
    *   Detecção de viewport móvel (`isMobile`).
    *   Ocultação das bordas físicas falsas do mockup no mobile para exibição em tela cheia nativa.
    *   Implementação de *Drawer / Bottom Sheet* tátil e ergonômico para a modulação de subtons e doutrina arquetípica na lateral direita.
*   [ ] **Aperfeiçoamento do Construtor de Prompts (Tela 2):** Revisão das chamadas de API e conexões com o backend FastAPI.
*   [ ] **Otimizações do Módulo Reels (Tela 3):** Validação dos storyboards gerados e comportamento reativo da grid.
*   [ ] **Experiência Sensorial Dinâmica dos Sliders (Módulo Onboarding / Matriz):**
    *   Todos os sliders começam em 50% por padrão.
    *   A imagem correspondente ao arquétipo no portal lateral direito começa em preto e branco (`grayscale(100%)`).
    *   **Dosagem abaixo de 50%:** A imagem vai descolando/desfocando progressivamente (aplicando `blur(...)` dinâmico via CSS até um máximo de `8px` ou `12px` em 0%).
    *   **Retorno a 50%:** A imagem volta a ficar nítida, mantendo-se em preto e branco (`blur(0px)`, `grayscale(100%)`).
    *   **Dosagem acima de 50%:** A saturação e a cor original da imagem aumentam gradativamente (o grayscale vai de `100%` a `0%` ao alcançar 100% de intensidade do slider).
    *   **Lógica Técnica:** Vincular os valores do slider ativamente aos filtros de estilo do React: `filter: grayscale(G%) blur(Bpx)`.
*   [ ] **Redação e Produção dos 120+ Textos da Matriz MEVA (Módulo Onboarding / Matriz):**
    *   **Estrutura 12x10 (120 Textos):** Desenvolver 10 textos de gradação decimais para cada um dos 12 arquétipos (Bracket 1 de 0-10% a Bracket 10 de 91-100%).
    *   **Faixa Decimal de Ausência (Texto 01):** Garantir que o bracket de 0% a 10% comente de forma ativa a carência ou sombra psicológica daquele arquétipo ("A ausência de...").
    *   **Motor de Compilação Narrativa:** Implementar a lógica no app que lê os 12 valores, resolve os brackets, ordena de forma decrescente (Dominância -> Co-Pilotos -> Sombra/Subtoms) e concatena os textos para formar o relatório final de Persona.
    *   **Assinatura de Título Duplo Híbrido:** Exibir no topo do diagnóstico o título oficial com o par ordenado em caixa alta dos dois maiores percentuais (ex: `SÁBIO / EXPLORADOR`), conferindo flexibilidade na voz e na interpretação do app.
    *   **Layout Físico em 3 Colunas na Tela 1C (Sliders):**
        *   *Coluna 1 (Esquerda):* Descrição conceitual estática do arquétipo hovered/focused.
        *   *Coluna 2 (Centro):* 12 sliders arquetípicos na simetria do smartphone.
        *   *Coluna 3 (Direita):* Controles de áudio (volume e mute) + Exibição das imagens conceituais dos arquétipos geradas por IA.
    *   **Layout Físico em 3 Colunas na Tela 2 (Serviços / Diagnóstico):**
        *   *Coluna 1 (Esquerda):* Título Duplo Híbrido + O relatório de Persona compilado final.
        *   *Coluna 2 (Centro):* Visor do smartphone com portal estético reativo da Persona ou live work preview.
        *   *Coluna 3 (Direita):* Painel de seleção de Micro-serviços + Botão dourado de EMITIR ORDEM DE SERVIÇO.
*   [ ] **Construção do Dicionário de Variabilidade Arquetípica MEVA (Os 12 Arquétipos):**
    *   Redigir as 7x4 variações para os outros 11 arquétipos (Mago, Explorador, Criador, Herói, Rebelde, Amante, Tolo, Cuidador, Homem Comum, Inocente, Governante) seguindo o modelo do Tetracorde, definindo as propriedades de Persona (Tônica), Cenário (Terça), Elementos (Quinta) e Estilo/Fotografia (Sétima).

---
*Lincoln (Orquestrador Geral) & Armando — Maio de 2026.*
