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
    *   Configuração condicional de acesso na autenticação:
        *   *Primeiro Acesso / Novo Usuário:* Roteia para o Onboarding (Vídeo Explicativo).
        *   *Usuário Recorrente Free:* Pula onboarding e vai direto para o **KS Studio** (`activeView === "storyboard"`).
        *   *Usuário Recorrente Premium:* Pula onboarding e vai direto para o **Construtor de Prompts** (`activeView === "servicos_escolha"`).

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

## 🎯 PONTO DE PARADA OPERACIONAL (ONDE PARAMOS HOJE)
O aplicativo está com toda a **estrutura e simetria técnica de frontend 100% finalizada, polida e livre de bugs**. A sidebar de controle e os passos do Onboarding estão integrados com o roteamento automático guardado. O roteiro de vídeo de onboarding foi ajustado para 32 segundos (4 blocos de 8 segundos) com consistência estética indiana de luxo.

---

## 🚀 PLANO DE TRABALHO PARA AMANHÃ (TERÇA-FEIRA — DIA DA DEMO)

### 🎙️ 1. Geração das Mídias no Estúdio (Sua parte):
*   [ ] **Voz da Guia:** Gerar a voz feminina jovem Neural2 em português via console Google Cloud TTS usando os 4 textos de 8 segundos.
*   [ ] **Trilha no Pro Tools:** Mixar a voz gerada com sua biblioteca/samples de **Tabla e Cítara** em loop contínuo de 40 segundos.
*   [ ] **Geração dos 4 Vídeos:** Enviar os áudios e prompts em inglês para o gerador de vídeo com Lip-Sync para obter os clipes da modelo indiana falando em perfeita sincronia.

### 💻 2. Integração Técnica no Código (Nossa parte):
*   [ ] **Substituição dos Vídeos Finais:** Substituir o mockup de vídeo estático pelos clipes MP4 gerados com áudio no visor do smartphone.
*   [ ] **Adição do Ícone de Som/Mute:** Programar o ícone de alto-falante interativo com slider de volume e toggle de mute na tela de Onboarding.
*   [ ] **Manutenção de Trilha Sonora Contínua:** Configurar o loop contínuo do áudio tocando suavemente em segundo plano durante a fase de ajuste fino dos 12 sliders da Matriz.
*   [ ] **Build de Produção e Deploy:** Rodar o comando final de compilação e deploy na VPS (`bash ./deploy.sh`) para atualizar a demonstração oficial na web para a reunião!

---
*Lincoln (Orquestrador Geral) & Armando — Maio de 2026.*
