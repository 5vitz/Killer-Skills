# 🗺️ MAPA DE TAREFAS - KILLER SKILLS COCKPIT (RITUAL DE ARQUÉTIPOS)

> [!IMPORTANT]
> **MENSAGEM PARA O PRÓXIMO LINCOLN:**
> Você está assumindo um cockpit de altíssimo nível estético (relojoaria fina, glassmorphism, fundo profundo `#0A0A0A`). 
> O Armando e o Lincoln anterior trabalharam mais de 10 horas seguidas até as 6h da manhã para calibrar cada pixel.
> **LEI DO PROJETO:** 
> 1. **NUNCA USE GREP (ripgrep)**. É uma promessa selada com o Armando. Se precisar achar algo, faça leitura direta dos arquivos.
> 2. **RESPEITE A TIPOGRAFIA FINA:** Armando detesta fontes em negrito (`font-bold`). A tipografia oficial das leituras é **Poppins peso 200 (`font-poppins-light`)**. Mantenha tudo leve, espaçado e sutil.

---

## ⚡ A IDEIA PUNK: Guia Dinâmico de Arquétipos (Coluna 1)
**Status:** Planejado (Aguardando implementação limpa na próxima sessão)

### 🎯 O Conceito
90% do público do Instagram nunca ouviu falar em Carl Jung ou arquétipos. Para sanar essa barreira educacional de forma interativa e com altíssimo impacto de UX, faremos o **Menu Esquerdo (Coluna 1)** se metamorfosear dinamicamente.
* **Estado Padrão:** Funciona como o menu normal de navegação do dashboard (1 - Personas, 3 - KS Studio, etc.).
* **Estado Ativo (Hover/Focus):** Quando o usuário coloca o mouse sobre qualquer arquétipo na matriz central ou na lista da direita (fazendo a imagem aparecer na terceira coluna), a Coluna 1 **desaparece suavemente (fade-out)** e dá lugar a um **Guia Fino e Detalhado (fade-in)** explicando exatamente o significado daquele arquétipo focado.
* **Estado de Saída:** Quando o mouse sai da área de interação, a Coluna 1 volta a ser o menu de navegação tradicional instantaneamente.

### 📐 Especificação Técnica da Metamorfose (Coluna 1)
Quando a condição `activeView === "servicos" && !hasPersonaDefined && (hoveredArchetype || focusedArchetype)` for verdadeira:

1. **Letreiro Indicador Superior:**
   * Uma tarja fina preta translúcida com bordas delicadas superior e inferior:
     `♥ GUIA DE ARQUÉTIPO ♥` (em Poppins peso 200, uppercase, `tracking-widest`).

2. **Título do Arquétipo:**
   * Centralizado, em escala majestosa (`text-2xl`), em Poppins peso 200, usando a cor característica do arquétipo (`activeArch.color`) com um brilho sutil em neon (`textShadow: 0 0 15px activeArch.color + '33'`).

3. **Parágrafo Conceitual:**
   * Uma caixa com fundo levemente jateado (`bg-white/[0.01] border border-white/[0.05]`) contendo a descrição base contida no array `ARCHETYPES` (ex: `activeArch.desc`).

4. **Ficha Técnica Superior (Desejo & Medo):**
   * Puxar diretamente do dicionário `ARCHETYPE_DETAILS[activeArch.id]`:
     * **Desejo Central:** Em ouro suave (`text-brand-gold`), peso leve.
     * **Maior Medo:** Em rosa/vermelho suave (`text-brand-pink`), peso leve.

5. **Ficha Técnica de Combate (Superpoder & Sombra):**
   * Puxar diretamente os valores:
     * **Superpoder:** Em verde brilhante sutil (`text-green-400`).
     * **Sombra (Desafio):** Em âmbar suave (`text-amber-500`).

6. **Rodapé de Navegação:**
   * Um sutil lembrete inferior: `MOVA O CURSOR PARA MUDAR`.

---

## 📋 OUTRAS TAREFAS E CALIBRAÇÕES PENDENTES
Para o dia de amanhã, passar pelas seguintes verificações com o Armando:

- [ ] **Ajuste de Altura do Card 1C:** Validar se o cockpit de sliders da Tela 1C está perfeitamente nivelado com a altura das imagens das Telas 1A e 1B em diferentes resoluções.
- [ ] **Velocidade dos Letreiros:** Garantir que o Letreiro 1 (`20s` padrão) e o Letreiro 2 (`25s` personalizado) continuem perfeitamente harmonizados fisicamente.
- [ ] **Interação Leitosas dos Sliders:** Confirmar se o efeito `hover:bg-white/[0.12]` está no contraste ideal sob a luz do dia ou se precisa de ajuste fino de opacidade.
