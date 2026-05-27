# 📐 VIÉS EPISTEMOLÓGICO: O SABER (ESTRUTURA & ENGENHARIA)
## Projeto Killer Skills — Versão Unificada 2.0 (Maio de 2026)## 🏛️ CLASSE E: TOPOLOGIA OPERACIONAL (SIMETRIA EM 3 COLUNAS & DUALIDADE DE DISPOSITIVO)

Toda a interação em Desktop é estruturada sob a **Simetria Estática de Três Colunas**, mantendo o smartphone virtual perfeitamente centralizado fisicamente no centro da tela (`fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2`). As transições de tela ocorrem por crossfade exclusivo dentro do visor do celular virtual, enquanto os metadados, instruções de onboarding, relatórios de persona e botões de avanço são delegados à barra lateral direita.

### E.0. Lógica de Dispositivo Dual (isMobile Viewport)
*   **Desktop (`isMobile === false`):** Exibe a simetria de 3 colunas com o smartphone virtual centralizado de luxo.
*   **Mobile (`isMobile === true`):** Destrói o smartphone virtual. A própria tela do dispositivo físico do usuário torna-se a viewport principal de forma nativa e ergonômica, utilizando um menu inferior e sliders táteis robustos de ponta a ponta.

### E.1. Módulo Tela 0 (O Portal de Acesso Social)
*   **Finalidade:** Autenticação unificada de usuários.
*   **Componentes do Visor:** Logotipo metalizado esculpido em baixo-relevo e o botão de login social unificado Google.

### E.1.5. Router Guard & Controle de Acesso (Fluxo por Nível de Conta)
O redirecionamento pós-login é governado de forma estrita pelo tipo de conta (`accountType`) e contagem de acessos (`acesso`) do usuário consultados no Firestore:
1. **Fluxo do Usuário Premium:**
   * **Primeiro Acesso (`acesso === 1`):** Redirecionado compulsoriamente para a **Tela 1 (Elaborar Persona)** para calibrar sua Persona Híbrida.
   * **Acessos Recorrentes (`acesso > 1`):** Redirecionado diretamente para a **Tela 2 (Serviços & Construtor de Prompt)**.
   * **Reelaboração:** O usuário Premium pode, a qualquer momento, clicar no menu lateral **"1 - PERSONAS"** para recalibrar os sliders e atualizar sua persona em definitivo no banco de dados.
2. **Fluxo do Usuário Free:**
   * **Acesso Direto:** Redirecionado **sempre** de forma direta para a **Tela 3 (KS Studio)**.
   * **Restrição de IA:** O usuário Free não tem acesso a "Elaborar Persona". O menu lateral "1 - PERSONAS" fica trancado/desativado no cockpit.
   * **Foco no Manual:** Cria manualmente o flow de storyboard, realiza upload e utiliza o **Simulador de Feed do Instagram** (visualização 1:1) para postar ou agendar postagens manuais.

### E.2. Módulo Tela 1 (Onboarding Simétrico & Diagnóstico Híbrido MEVA)
*   **Finalidade:** Determinação da dosagem arquetípica e elaboração da Persona Híbrida.
*   **Componentes do Desktop:**
    *   *Sidebar Esquerda:* Menu de navegação e status online (já existente).
    *   *Smartphone Central (O Player):*
        *   No passo `video`: Contém **apenas** o player de vídeo cenográfico com controles de som.
        *   No passo `matriz`: Contém **unicamente** os 12 sliders dosadores (ocupando toda a área útil do visor para máximo conforto tátil).
    *   *Sidebar Direita (O Relatório):*
        *   No passo `video`: Exibe textos instrucionais e o botão **`IR PARA A MATRIZ ➔`**.
        *   No passo `matriz`: Exibe a **Persona Resultante** (ex: `SÁBIO / CRIADOR`), o **Relatório Detalhado** (Doutrina de Voz, Luz/Sombra e Nuances de Subtom de menores dosagens) e o botão dourado **`ELABORAR PERSONA ✨`**.

### E.3. Módulo Tela 2 (Serviços & Construtor de Prompt)
*   **Finalidade:** Escolha da modalidade e emissão da Ordem de Serviço (OS) com feedback interativo dos agentes baseada na Persona gerada.
*   **Componentes:**
    *   *O Construtor de Prompt:* Toggles táteis de micro-serviços (Redator, Roteirista, Compressor, Vídeo AI).
    *   *Feedback dos Agentes (Live Work):* Console técnico mostrando os Agentes trabalhando em tempo real no visor central do smartphone.
    *   *OK de Envio:* Botão dourado **`EMITIR ORDEM DE SERVIÇO`** na barra direita.

### E.4. Módulo Tela 3 (O KS Studio)
*   **Finalidade:** Sandbox interativa de visualização 1:1, simulação de feed e controle de publicação.
*   **Componentes do Visor:**
    *   *Simulador de Feed:* O próprio visor do celular exibe a miniatura real e interativa (Reels ou Carrossel) que o usuário pode rodar e ler.
    *   *Controles Finais:* Botões rápidos de `Publicar Agora` ou `Agendar Post` no painel lateral.

---

## 🧠 CLASSE F: ENGENHARIA DO CONSTRUTOR DE PROMPTS (CLASSES DE PROMPT)

A inteligência de redação e geração de imagens do Killer Skills é estruturada em **Classes de Prompt Desacopladas**, injetadas dinamicamente na API do Gemini/OpenRouter de acordo com as escolhas do usuário:

```mermaid
graph TD
    classDef base fill:#0A0A0C,stroke:#D4AF37,stroke-width:1.5px,color:#FFF;
    classDef prompt fill:#14141A,stroke:#1E60FF,stroke-width:1px,color:#FFF;

    Persona[🔮 Arquétipo Escolhido] -->|Injeta Tom e Regras| MasterPrompt[⚡ Prompt Master Unificado]
    PortalContext[📝 Respostas do Portal] -->|Injeta Dores e Luz| MasterPrompt
    Services[🛠️ Micro-Serviços Ativos] -->|Determina Ganchos e CTAs| MasterPrompt
    
    MasterPrompt -->|Executa| GeminiEngine[🧠 Gemini / OpenRouter API]

    class Persona,PortalContext,Services base;
    class MasterPrompt,GeminiEngine prompt;
```

### F.1. Classe de Prompt A: Tom & Posicionamento (The Archetype Class)
Injeta as diretrizes estritas do arquétipo de Carl Jung selecionado (ex: tom sóbrio e filosófico do *Sábio*, tom provocativo e sarcástico do *Criador*).

### F.2. Classe de Prompt B: Contexto Profundo (The Shadow Class)
Incorpora as dores, aspirações e o dilema "Luz & Sombra" coletados durante a navegação do portal de iniciação do usuário.

### F.3. Classe de Prompt C: Estrutura do Gancho (The Hook Class)
Formata o texto de acordo com os ganchos de retenção de 3 segundos (para Roteiros de Reels) ou frameworks clássicos de copy (AIDA/PAS para Legendas Persuasivas).

---

## 💾 CLASSE G: PERSISTÊNCIA NoSQL (MODELAGEM CLOUD FIRESTORE)

Toda a infraestrutura é baseada em banco de dados NoSQL thread-safe no Cloud Firestore, segregado de forma modular:

```
[Coleção Principal: clientes]
      |
      +---> Documento: {cliente_id} (Campos: nome, créditos, dosagem_persona)
                 |
                 +---> [Subcoleção: contas]
                             |
                             +---> Documento: {instagram_username} (Tokens, Conta Meta)
                                         |
                                         +---> [Subcoleção: campanhas]
                                                     |
                                                     +---> Documento: {campanha_id} (OS, Mídias, Status)
```

### G.1. Modelo do Documento `campanhas` (Ordem de Serviço)
```json
{
  "id": "os_98127391823",
  "data_programada": "2026-05-24T18:00:00Z",
  "dosagem_persona": {
    "sabio": 80,
    "mago": 40,
    "tolo": 15
  },
  "status": "pendente",
  "ordem_servico": {
    "servicos_solicitados": ["legendas", "webp_compress"],
    "insumos": {
      "frase_portal": "A verdade nos libertará da pressa digital",
      "midi_url": "https://storage.googleapis.com/..."
    }
  },
  "storyboard": [
    {
      "frame_index": 0,
      "media_path": "https://storage.googleapis.com/...",
      "tipo": "webp"
    }
  ]
}
```

---

## 📦 CLASSE H: PIPELINE DE MÍDIA (STORAGE & COMPRESSOR WEBP)

### H.1. Otimizador Client-Side WebP (O Almoxarife Técnico)
Para garantir latência zero e uploads instantâneos:
1.  O arquivo de imagem (PNG/JPG) arrastado pelo usuário é interceptado no front-end.
2.  Um canvas HTML5 processa a imagem em memória, realizando o redimensionamento inteligente e convertendo o buffer para o formato `.webp` com fator de qualidade ajustável (padrão 80%).
3.  O peso final é reduzido em média **82%** antes do envio.

### H.2. Upload para o Firebase Storage
*   **Bucket Destino:** `gen-lang-client-0513318140.firebasestorage.app`
*   **Ação:** O SDK Admin emite o upload assíncrono do buffer WebP e define os cabeçalhos de metadados como público permanente (`make_public()`), gerando a URL HTTP estável consumida pelo background worker de postagem.

---

## ⚙️ CLASSE I: ORQUESTRAÇÃO DO SISTEMA (BACKGROUND WORKER & PLAYWRIGHT)

Mapeamento do motor assíncrono que consome a fila do Firestore no VPS Contabo e executa o navegador via Playwright:

```mermaid
flowchart TD
    classDef step fill:#0A0A0C,stroke:#1E60FF,stroke-width:1.5px,color:#FFF;
    classDef gate fill:#14141A,stroke:#D4AF37,stroke-width:1.5px,color:#FFF;

    Fila[🔍 Fila do Firestore: Status 'pendente'] -->| background_worker detecta data/hora | Lock[🔒 Trancar OS: Status 'processando']
    Lock --> launchPlaywright[🌐 Inicializar Playwright Headless no VPS]
    launchPlaywright --> loginIG[🔑 Autenticar Instagram via Meta Cookies]
    
    loginIG --> uploadMedia[📤 Fazer Upload do WebP / Vídeo no Player]
    uploadMedia --> pasteCaption[✍️ Colar Legenda gerada pela OS]
    
    pasteCaption --> clickPublish[🎉 Clicar em Publicar]
    clickPublish --> verifySuccess{👁️ Publicação Bem-Sucedida?}
    
    verifySuccess -- SIM --> updateSuccess[✅ Atualizar Firestore: Status 'sucesso']
    verifySuccess -- NÃO --> updateError[❌ Registrar Log de Erro no Firestore]

    class Fila,Lock,launchPlaywright,loginIG,uploadMedia,pasteCaption,clickPublish,updateSuccess,updateError step;
    class verifySuccess gate;
```

---
*Assinado e Selado em Conformidade Epistemológica.*  
*Genera & Lincoln — Maio de 2026.*
