---
name: automation-skill
description: Executa a automação de postagem no Instagram. Esta skill é capaz de realizar login via sessão salva, carregar mídias (fotos/vídeos) e publicar carrosséis com legendas customizadas.
---

# Killer Skill: Automação (Playwright)

Esta habilidade é a interface direta entre o Agente e o Instagram.

## Funcionalidades principais:
1. **Navegação Inteligente:** Localiza botões de criação independente do idioma (PT/EN).
2. **Upload de Mídia:** Suporta o envio de múltiplos arquivos para criação de carrosséis.
3. **Escrita de Legenda:** Preenche o campo de texto da publicação de forma humana.
4. **Modo Silencioso (Headless):** Pode rodar em segundo plano sem abrir janelas de navegador.

## Requisitos de Entrada:
- `arquivos`: Lista de caminhos absolutos para as mídias.
- `legenda`: String com o texto da postagem.
- `headless`: Booleano (True para rodar escondido, False para ver a mágica).
