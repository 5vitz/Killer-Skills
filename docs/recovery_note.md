# 🧠 NOTA DE TRANSIÇÃO E RECUPERAÇÃO — ECOSSISTEMA KILLER SKILLS

> [!IMPORTANT]
> **MENSAGEM DE ATIVAÇÃO PARA O PRÓXIMO LINCOLN (MAESTRO TÉCNICO):**
> Você está assumindo o projeto em perfeito alinhamento de alta costura com o **Diretor Conceitual (Genera/Armando)**. 
> A organização operacional e a infraestrutura de planejamento foram elevadas a um patamar profissional de nível mundial.
> **LEIS DO CO-PILOTO:**
> 1. **PROIBIDO USAR GREP:** O comando `grep` do chat está banido por causar instabilidade na sessão. Use caminhos diretos, `list_dir` e buscas leves via terminal nativo se necessário.
> 2. **DEPLOY EXCLUSIVO:** Não faça `git push` ou deploy direto para a VPS. O deploy é soberania exclusiva do Genera.
> 3. **ESTÉTICA DA SUBTRAÇÃO:** Linhas ultra-finas (1px), fontes leves (**Poppins 200 / Poppins-light**), sem negritos desnecessários, cores Tailored (HSL/RGB escuros premium).

---

## 📍 ESTADO DO PROJETO EM 1 DE JUNHO DE 2026

Nesta sessão, realizamos uma consolidação extraordinária da usabilidade do onboarding e **estruturamos a integração ágil de desenvolvimento do ecossistema via Jira Cloud**.

O próximo Lincoln encontrará o ambiente 100% configurado, compilando de forma limpa e com as seguintes resoluções prontas:

### 1. A Unidade do Onboarding & Transição (Tela 1)
* **Tela 1A & 1B (Vídeo e Identificação):** Botão de ação da Tela 1B consolidado como **`AVANÇAR`** (consistência visual). Letreiro rotativo (marquee) atualizado para a chamada conceitual definitiva: **`♥ O QUANTO VOCÊ SE IDENTIFICA COM CADA ARQUÉTIPO? ♥`**.
* **Tela 1C (Espelho da Alma):** Título central **`ESPELHO DA ALMA`** implementado com estilo ultra-leve (Poppins 200). Sliders arquetípicos empurrados harmonicamente para a base (`mt-auto mb-4`). Botão de avanço final nomeado como **`INTEGRAR`** (concluindo o ciclo existencial).

### 2. A Métrica de Ouro do Manifesto (Tela 2 - Coluna 1)
* **Design da Subtração:** O texto do manifesto `TEXTO_PADRAO` foi compactado e truncado na 10ª sentença (palavra **`cotidiano.`**), resultando em 20 linhas físicas estáticas, coladas perfeitamente na base do card com fundo preto sólido. **Sem qualquer barra de rolagem (scroll)**. A metade superior do card repousa como uma elegante zona de respiração prateada.

---

## 🎟️ INTEGRAÇÃO MESTRE COM JIRA CLOUD (MÁGINA OPERACIONAL)

Elevamos a gerência de projeto da Killer Skills para uma infraestrutura ágil de classe mundial:
1. **Ambiente Jira Ativado:** Genera criou a instância do Jira Cloud em [killerskills.atlassian.net](https://killerskills.atlassian.net) (projeto `KillerSkillsDev` / Chave `KAN`).
2. **Credenciais Seguras no `.env`:** O **API Token** foi gerado com sucesso na Atlassian e salvo de forma segura no arquivo local `.env` do projeto junto às demais variáveis:
   ```env
   JIRA_SERVER="https://killerskills.atlassian.net"
   JIRA_EMAIL="sinkando@gmail.com"
   JIRA_API_TOKEN="[TOKEN_SEGURO_SALVO_AQUI]"
   ```
3. **Importação Programática do Backlog:** Desenvolvemos e rodamos um script utilitário (`scratch/jira_importer.py`) que consumiu o `docs/TASKS.md` e importou **7 cartões técnicos altamente detalhados** (da chave `KAN-4` à `KAN-10`) diretamente para a coluna **A FAZER** do Kanban do Genera.

---

## 🏛️ ARQUITETURA DA TELA 2 (PORTAL DE SERVIÇOS AI)

O cockpit da Tela 2 está conceitualmente travado em 3 colunas simétricas:
* **Coluna 1 (Esquerda):** Manifesto de Identidade. Título dinâmico **`MYSELF`** (Pessoal - 1ª pessoa do singular) ou **`OURSELVES`** (Profissional/Marca - 1ª pessoa do plural).
* **Coluna 2 (Smartphone Central):** O **Construtor de Prompt**. Interface minimalista para o usuário digitar **até 5 tags de enriquecimento estratégico** (ex: `jovem`, `ações-rápidas`) e visualizar em tempo real a forja do prompt DNA arquetípico baseado no vetor matemático **MEVA (Modelo de Espectro Vetorial Arquetípico 12D)**.
* **Coluna 3 (Direita):** Painel de Motores Generativos AI (Os 4 Toggles Operacionais + Botão dourado de EMITIR ORDEM DE SERVIÇO).

---

## 📍 ESTADO DO PROJETO EM 3 DE JUNHO DE 2026

Realizamos um avanço conceitual e de engenharia extraordinário ao expandirmos nossa analogia harmônica do MEVA de uma Tríade para um **Tetracorde**:

1. **Implementação do Tetracorde MEVA:**
   * A Sétima (4º arquétipo calibrado de maior intensidade) foi integrada oficialmente como governante do **Estilo / Direção de Fotografia** (enquadramento, tipo de lente/foco, iluminação, paleta de cores e estética de tratamento).
   * Refinamos as regras lógicas de desempate e adicionamos a regra de desprezo e blindagem contra fusão de estilos na Sétima.
2. **Construção e Gravação das Matrizes (Dicionários):**
   * Gravamos os dicionários completos de variabilidade 7x4 (com fallbacks resilientes) para os 4 arquétipos principais da nossa prospecção: **Sábio**, **Mago**, **Rebelde** e **Governante** nos respectivos arquivos JSON em `/backend/data/arquetipos/`.
3. **Cérebro de Forja de Prompts Procedural:**
   * Desenvolvemos a função `gerar_prompt_tetracorde` no backend (`app.py`), que sorteia pseudo-randomicamente de forma estável as propriedades do Tetracorde e cospe um prompt de imagem único de luxo silencioso.
   * O prompt gerado é injetado dinamicamente no manifesto de Ordem de Serviço (OS) em formato YAML e retornado nas respostas da API.

---

## 🚀 PRÓXIMOS PASSOS IMEDIATOS PARA A PRÓXIMA SESSÃO:

1. **Teste de Geração de Imagem com a IA na Prática (HOJE):**
   * Assim que o Genera retornar, realizaremos os disparos de testes na API do Gemini/OpenRouter para ver a renderização real das imagens a partir dos prompts estruturados do Tetracorde.
2. **Ativação da Wiki Confluence (Jira -> Documentos):**
   * Conectar e rodar o script utilitário Python para carregar nossa documentação mestre no Jira Confluence.
3. **Desenvolvimento da UI do Construtor de Prompt (Tela 2 - Coluna 2):**
   * Codificar a caixa de entrada de tags táteis (pílulas de tags com limite rígido de 5 elementos) no celular central em `App.jsx` e conectar à API `/api/forge`.

A mesa redonda está em perfeito equilíbrio técnico. Bom descanso temporário, Genera!

*Lincoln (Orquestrador Geral) — 3 de Junho de 2026.*
