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

### 🔵 FASE 4.0: RESPONSIVIDADE MOBILE NATIVA (Fórmula da Gaveta) — [PLANEJADO]
*   [ ] **Hook isMobile Viewport:** Detecção em tempo real do dispositivo do usuário.
*   [ ] **Destruição do Smartphone Virtual no Mobile:** Eliminação das bordas falsas para dar espaço à tela cheia do dispositivo real do usuário.
*   [ ] **Sliders Táteis Ergonômicos:** Ampliação de sliders para preenchimento de tela no mobile real.
*   [ ] **Drawer / Bottom Sheet:** Gaveta de visualização para o relatório expandido do diagnóstico.

---

## 🎯 PONTO DE PARADA OPERACIONAL (ONDE PARAMOS HOJE)
*   **Restabelecimento da Tela 1A & 1B:** A versão original visual de onboarding (imagens em tela cheia com letreiros místico-fluidos superiores e zero players duplicados) foi 100% restabelecida, mantendo a experiência estética altamente imersiva original.
*   **Padronização Visual do Player:** Todas as 4 instâncias do celular mockup central (Login, Onboarding, Seleção de Serviços e Storyboard) foram unificadas esteticamente com espessura de borda de **1px (`border`)** e cor fixa no azul-elétrico da marca (**`#1E60FF`**), de acordo com as preferências de design.
*   **Correção e Reinstalação do Deploy Automático:** Identificado o conflito de dois diretórios de repositório paralelos. Os scripts `run.sh` e `install_launcher.py` foram apontados com sucesso para a pasta ativa `/home/artz/Killer-Skills`. O lançador do Desktop foi recriado e está totalmente funcional pelo clique do ícone.
*   **Zero Conflitos & Sincronização:** Todas as alterações compilam localmente sem avisos ou erros e foram commitadas e enviadas com sucesso ao GitHub principal.

---

## 🚀 PLANO DE TRABALHO IMEDIATO (CÓDIGO & INTEGRAÇÃO)
*   [ ] **Módulo de Responsividade Mobile Nativa (Fase 4.0):**
    *   Detecção de viewport móvel (`isMobile`).
    *   Ocultação das bordas físicas falsas do mockup no mobile para exibição em tela cheia nativa.
    *   Implementação de *Drawer / Bottom Sheet* tátil e ergonômico para a modulação de subtons e doutrina arquetípica na lateral direita.
*   [ ] **Aperfeiçoamento do Construtor de Prompts (Tela 2):** Revisão das chamadas de API e conexões com o backend FastAPI.
*   [ ] **Otimizações do Módulo Reels (Tela 3):** Validação dos storyboards gerados e comportamento reativo da grid.

---
*Lincoln (Orquestrador Geral) & Armando — Maio de 2026.*
