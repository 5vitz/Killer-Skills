# 🗺️ Mapeamento de Jornada dos Clientes e Consumo de Créditos
## Projeto Killer Skills — Versão Estratégica 1.0 (Maio de 2026)

Este documento detalha o funcionamento prático do modelo de cobrança **Pay-per-Use (Créditos Pré-Pagos)** sob a ótica de **5 Personas de Clientes**. Ele serve como guia conceitual para o desenvolvimento da lógica de negócio no Backend, definindo a função de cada agente de IA e a precificação de cada ação.

---

## 🧠 1. A Equipe de Agentes e Suas Funções Técnicas

No modelo de Créditos Pré-Pagos, o ecossistema opera com **5 agentes integrados** sob o controle do app:

1. **O Estrategista (Orchestrator):** A mente controladora (a interface Flet). Ele recebe o comando do cliente, consulta se há saldo suficiente no banco de dados local, recruta os agentes necessários e divide a campanha em tarefas. *(Custo: 0 créditos — gerencia a engrenagem)*.
2. **O Narrador (Narrative Engine):** Especialista em texto e voz. Responsável por gerar as legendas altamente persuasivas (via OpenRouter), roteirizar carrosséis e gerar a voz clonada do usuário (Text-to-Speech). *(Consome de 2 a 10 créditos)*.
3. **O Criativo (Media Engine):** O artista visual. Ele se conecta às APIs (como Fal.ai ou Replicate) para gerar imagens ultra-realistas (Flux.1) ou renderizar vídeos cinemáticos (Luma/Runway). *(Consome de 50 a 300 créditos)*.
4. **O Técnico/Editor (Curator Engine):** Para quem já tem conteúdo bruto. Ele redimensiona mídias (4:5 ou 9:16), aplica presets estéticos da marca, comprime para WebP de alta performance e trata áudios. *(Consome de 10 a 20 créditos)*.
5. **O Executor (Postador Automatizado):** O robô operacional. Responsável por autenticar com segurança no Instagram (via PM2 no VPS), fazer o upload perfeito e disparar a notificação de "Campanha Publicada". *(Consome 20 créditos)*.

---

## 🗺️ 2. As 5 Jornadas de Clientes e Seus Consumos

Abaixo estão detalhados os fluxos de consumo de cada persona dentro do dashboard do aplicativo:

### 👤 Persona A: O Intelectual de Vitrine (Ex: Dr. Thiago, Advogado)
*   **A Dor:** Quer projetar sabedoria, profundidade e cultura nas redes sociais para atrair clientes de alta renda, mas não tem tempo de ler livros clássicos ou escrever textos reflexivos.
*   **O Ritual de Entrada:** Thiago faz um PIX de **R$ 50,00** (adiciona 5.000 créditos à sua carteira) e seleciona o template de Persona: *"O Intelectual"*.
*   **O Fluxo de Ação (Jornada):**
    1. **Entrada:** Thiago digita na caixa de texto do app apenas: *"Quero falar sobre a importância do foco no trabalho hoje"*.
    2. **Intelectualização (Texto):** **O Narrador** cria uma legenda impecável com tom sofisticado, iniciando com uma frase de Marco Aurélio e terminando com um gancho estratégico sobre produtividade no mundo moderno. *(Débito: 5 créditos)*.
    3. **Ambientação (Imagem):** **O Criativo** aciona a API e gera uma imagem minimalista de uma mesa de madeira escura com um livro aberto antigo, óculos de leitura finos e uma xícara de café com fumaça realista sob luz suave de estúdio. *(Débito: 50 créditos)*.
    4. **Execução:** **O Executor** agenda o post para as 07:30 da manhã seguinte. *(Débito: 20 créditos)*.
*   **Custo da Campanha:** **75 créditos** (aproximadamente R$ 0,75 centavos).

---

### 👤 Persona B: O Lifestyle Magnético (Ex: Gustavo, Investidor/Trader)
*   **A Dor:** Precisa projetar sucesso de alto padrão, lazer luxuoso e status social para gerar atração e vendas (inveja aspiracional), mas sua rotina real de trabalho é comum e diante de computadores.
*   **O Ritual de Entrada:** Gustavo deposita **R$ 200,00** (20.000 créditos) e activa o template: *"Vencedor de Lifestyle"*.
*   **O Fluxo de Ação (Jornada):**
    1. **Entrada:** Gustavo faz upload de uma selfie simples que tirou no espelho da academia (conteúdo bruto).
    2. **Curadoria Visual:** **O Editor** recorta o fundo da foto, aplica um preset de cores quentes e ricas (estética premium Cyber-Luxury) e melhora a definição facial via IA. *(Débito: 15 créditos)*.
    3. **Fabricação de Veracidade:** **O Criativo** pega a imagem tratada e faz uma fusão de cenários (Inpainting) de altíssima precisão: insere a silhueta de Gustavo em um lounge de aeroporto executivo de luxo, com um jato executivo visível pela janela de vidro ao fundo. *(Débito: 100 créditos)*.
    4. **Narrativa:** **O Narrador** escreve a legenda perfeita: *"O sucesso não é o que você faz quando todos olham, mas as decisões silenciosas de bastidores. Próxima parada: SP."* *(Débito: 5 créditos)*.
    5. **Execução:** **O Executor** faz o agendamento da publicação. *(Débito: 20 créditos)*.
*   **Custo da Campanha:** **140 créditos** (aproximadamente R$ 1,40).

---

### 👤 Persona C: A Marca em Ascensão (Ex: Mariana, E-commerce de Moda)
*   **A Dor:** Quer criar a ilusão de que sua loja está bombando, despachando dezenas de mercadorias diariamente, para gerar segurança de compra e efeito manada em novos clientes.
*   **O Ritual de Entrada:** Mariana carrega **R$ 100,00** (10.000 créditos).
*   **O Fluxo de Ação (Jornada):**
    1. **Entrada:** Mariana não tem nenhuma mídia disponível para hoje. Ela seleciona o comando: *"Geração Dinâmica de Movimentação de Estoque"*.
    2. **Produção Cinemática (Vídeo):** **O Criativo** aciona o gerador de vídeo (Luma/Kling via Fal.ai) e renderiza um vídeo de 5 segundos de mãos elegantes selando caixas de envio minimalistas com uma fita preta luxuosa em cima de uma mesa de mármore. *(Débito: 300 créditos)*.
    3. **Narrativa Comercial:** **O Narrador** cria a legenda com forte chamada para ação: *"Mais um lote de outono embalado e saindo para entrega hoje! Restam apenas 7 unidades em estoque. Link na bio."* *(Débito: 5 créditos)*.
    4. **Execução:** **O Executor** publica o post em formato Reels no horário de pico (18:00). *(Débito: 25 créditos)*.
*   **Custo da Campanha:** **330 créditos** (aproximadamente R$ 3,30).

---

### 👤 Persona D: O Especialista de Autoridade (Ex: Amanda, Mentora Corporativa)
*   **A Dor:** Precisa demonstrar extrema competência e conhecimento técnico para vender mentorias de alto valor (High-Ticket), sem ter que passar horas criando slides ou designs complexos.
*   **O Ritual de Entrada:** Amanda faz uma recarga de **R$ 150,00** (15.000 créditos).
*   **O Fluxo de Ação (Jornada):**
    1. **Entrada:** Amanda grava um áudio simples de WhatsApp de 40 segundos comentando uma notícia do setor de negócios e sobe o arquivo no app.
    2. **Transcrição:** **O Editor** transcreve o áudio perfeitamente usando a API Whisper e remove ruídos de respiração. *(Débito: 10 créditos)*.
    3. **Estruturação:** **O Narrador** pega o texto bruto e o resume de forma estruturada em um roteiro educativo de Carrossel de 4 páginas (Ganchos, Métodos e Chamada para Ação). *(Débito: 10 créditos)*.
    4. **Montagem Estética:** **O Criativo** gera os fundos texturizados elegantes em tons de azul corporativo e cinza escuro para cada um dos 4 slides (Flux.1) e o editor estampa o texto diagramado por cima. *(Débito: 150 créditos)*.
    5. **Execução:** **O Executor** monta o carrossel e realiza o agendamento para terça às 19:00. *(Débito: 30 créditos)*.
*   **Custo da Campanha:** **200 créditos** (aproximadamente R$ 2,00).

---

### 👤 Persona E: O Ego-Booster (Ex: Arthur, Validação Social)
*   **A Dor:** Busca validação social rápida (curtidas e comentários rápidos para massagear o ego), mas não tem viajado ou tirado fotos interessantes ultimamente.
*   **O Ritual de Entrada:** Arthur adiciona **R$ 30,00** (3.000 créditos).
*   **O Fluxo de Ação (Jornada):**
    1. **Entrada:** Arthur sobe uma foto comum dele sentado no sofá de sua casa.
    2. **Recorte:** **O Editor** remove o fundo da sala comum. *(Débito: 0 créditos - processo local)*.
    3. **Criação de Contexto:** **O Criativo** o coloca sentado em uma espreguiçadeira na varanda de um resort luxuoso nas Maldivas, com o mar azul ao fundo, adaptando a luz solar ao corpo de Arthur de forma realista (AI Light Synthesis). *(Débito: 80 créditos)*.
    4. **Legenda Provocativa:** **O Narrador** redige uma legenda enigmática e poética que convida a interações rápidas. *(Débito: 5 créditos)*.
    5. **Execução:** **O Executor** posta a foto imediatamente na rede. *(Débito: 20 créditos)*.
*   **Custo da Campanha:** **105 créditos** (aproximadamente R$ 1,05).

---

## 📈 3. Resumo da Arbitragem Financeira (Para a Plataforma)

| Persona | Custo de API Real (Estimativa) | Créditos Cobrados | Valor Cobrado do Cliente | Margem de Lucro Bruta |
| :--- | :--- | :--- | :--- | :--- |
| **Intelectual** | R$ 0,08 (Texto + Flux) | 75 | R$ 0,75 | **~837%** |
| **Lifestyle** | R$ 0,22 (Tratamento + Inpaint) | 140 | R$ 1,40 | **~536%** |
| **Marca** | R$ 0,85 (Vídeo Luma) | 330 | R$ 3,30 | **~288%** |
| **Especialista** | R$ 0,30 (Whisper + 4x Flux) | 200 | R$ 2,00 | **~566%** |
| **Ego-Booster** | R$ 0,15 (Inpaint Maldivas) | 105 | R$ 1,05 | **~600%** |

> [!TIP]
> Este modelo garante que o faturamento da Killer Skills seja diretamente proporcional à satisfação e ao volume de postagens do usuário, criando uma máquina sustentável de micro-transações de alto valor agregado.
