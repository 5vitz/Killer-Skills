#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
================================================================================
                    CRIADOR DE PROMPTS - INTERFACE GRÁFICA (GUI)
                              KILLER SKILLS v1.0
================================================================================
Interface gráfica de alta fidelidade visual (Flet) para compilação do
Prompt Compiler Engine.

Autor: Lincoln (Sargento de Tecnologia)
================================================================================
"""

import os
import sys
import flet as ft
# Diretórios padrão
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS_DIR = os.path.join(BASE_DIR, "docs")

# Caminhos dos 4 Pilares
FILE_ESTRATEGIA = os.path.join(DOCS_DIR, "ESTRATEGIA.md")
FILE_PLANEJAMENTO = os.path.join(DOCS_DIR, "PLANEJAMENTO.md")
FILE_METODOLOGIA = os.path.join(DOCS_DIR, "METODOLOGIA.md")
FILE_TASKS = os.path.join(DOCS_DIR, "TASKS.md")
FILE_OUTPUT = os.path.join(DOCS_DIR, "prompt_gerado.md")

def read_markdown_file(path):
    if not os.path.exists(path):
        return ""
    try:
        with open(path, "r", encoding="utf-8") as f:
            return f.read().strip()
    except Exception:
        return ""

def extract_section(content, section_title):
    lines = content.split("\n")
    start_idx = -1
    end_idx = len(lines)
    
    for i, line in enumerate(lines):
        if line.strip().startswith(section_title):
            start_idx = i
            break
            
    if start_idx == -1:
        return ""
        
    level = len(section_title.split(" ")[0])
    for j in range(start_idx + 1, len(lines)):
        line_strip = lines[j].strip()
        if line_strip.startswith("#"):
            curr_level = len(line_strip.split(" ")[0])
            if curr_level <= level:
                end_idx = j
                break
                
    return "\n".join(lines[start_idx:end_idx]).strip()

def main(page: ft.Page):
    # Configurações de Janela Premium (Compatível com múltiplas versões de Flet)
    page.title = "Criador de Prompts - Killer Skills"
    try:
        page.window.width = 900
        page.window.height = 760
        page.window.resizable = True
    except AttributeError:
        page.window_width = 900
        page.window_height = 760
        page.window_resizable = True
    page.bgcolor = "#050505"  # Fundo ultra-escuro de cinema
    page.theme_mode = ft.ThemeMode.DARK
    page.padding = 30

    # Fontes e estilo
    page.fonts = {
        "Inter": "https://github.com/google/fonts/raw/main/ofl/inter/Inter%5Bslnt%2Cwght%5D.ttf"
    }
    page.theme = ft.Theme(font_family="Inter")

    # Título do App (Carrega a Logo Branca se existir, senão a Colorida, senão o ícone alternativo)
    logo_branca = "/home/artz/Documentos/Antigravity/Killer-Skills/Imagens/Logo_Branca.png"
    logo_colorida = "/home/artz/Documentos/Antigravity/Killer-Skills/Imagens/Logo_Final.png"
    
    if os.path.exists(logo_branca):
        header_logo = ft.Image(src="/Logo_Branca.png", width=32, height=32, fit=ft.ImageFit.CONTAIN)
    elif os.path.exists(logo_colorida):
        header_logo = ft.Image(src="/Logo_Final.png", width=32, height=32, fit=ft.ImageFit.CONTAIN)
    else:
        header_logo = ft.Icon(ft.icons.BOLT, color="#d4af37", size=32)

    title_row = ft.Row(
        controls=[
            header_logo,
            ft.Text(
                "KILLER SKILLS",
                size=22,
                weight=ft.FontWeight.BOLD,
                color="#ffffff",
            ),
            ft.Text(
                "•   PROMPT COMPILER ENGINE",
                size=14,
                weight=ft.FontWeight.W_300,
                color="#7c7c7c",
            )
        ],
        alignment=ft.MainAxisAlignment.START,
    )

    # Elementos de Interface
    task_input = ft.TextField(
        label="Tarefa Operacional a Executar",
        hint_text="Ex: Tarefa 1.1 - Criar módulo de banco de dados (database.py)",
        multiline=True,
        min_lines=3,
        max_lines=5,
        border_color="#2c2c2c",
        focused_border_color="#d4af37",
        focused_border_width=2,
        label_style=ft.TextStyle(color="#9b9b9b"),
        border_radius=10,
        text_size=14,
        color="#ffffff",
        bgcolor="#0F111A",
    )

    camada_dropdown = ft.Dropdown(
        label="Camada de Atuação",
        options=[
            ft.dropdown.Option("N/A", "Não se aplica (Geral/Técnica)"),
            ft.dropdown.Option("Pessoal", "Camada Pessoal (Identidade & Prestígio)"),
            ft.dropdown.Option("Comercial", "Camada Comercial (Consistência & Mercado)"),
        ],
        value="N/A",
        border_color="#2c2c2c",
        focused_border_color="#d4af37",
        label_style=ft.TextStyle(color="#9b9b9b"),
        border_radius=10,
        color="#ffffff",
        bgcolor="#0F111A",
        expand=True,
    )

    preset_dropdown = ft.Dropdown(
        label="Perfil / Preset de Posicionamento",
        options=[
            ft.dropdown.Option("N/A", "Sem preset ativo"),
            # Presets Pessoais
            ft.dropdown.Option("Intelectual / Culto", "Pessoal: Intelectual / Culto"),
            ft.dropdown.Option("Criativo / Rebelde", "Pessoal: Criativo / Rebelde"),
            ft.dropdown.Option("Autoridade / Vitorioso", "Pessoal: Autoridade / Vitorioso"),
            ft.dropdown.Option("Alegre / Carismático", "Pessoal: Alegre / Carismático"),
            ft.dropdown.Option("Narcisista (Ego-Booster)", "Pessoal: Narcisista (Ego-Booster)"),
            # Vertentes Comerciais
            ft.dropdown.Option("Vertente A: Agências Digitais", "Comercial: Vertente A (Agências/Curadores)"),
            ft.dropdown.Option("Vertente B: Pequenos Negócios (Euquipe)", "Comercial: Vertente B (Pequenos Negócios/Euquipe)"),
            ft.dropdown.Option("Outros (Descrever abaixo)", "Pessoal: Outros (Descrever abaixo)"),
        ],
        value="N/A",
        border_color="#2c2c2c",
        focused_border_color="#d4af37",
        label_style=ft.TextStyle(color="#9b9b9b"),
        border_radius=10,
        color="#ffffff",
        bgcolor="#0F111A",
        expand=True,
    )

    custom_preset_input = ft.TextField(
        label="Descreva seu Perfil Customizado (Se selecionou 'Outros')",
        hint_text="Ex: Aventureiro Tecnológico, Minimalista Filosófico, Acadêmico Disruptivo...",
        border_color="#2c2c2c",
        focused_border_color="#d4af37",
        focused_border_width=2,
        label_style=ft.TextStyle(color="#9b9b9b"),
        border_radius=10,
        text_size=14,
        color="#ffffff",
        bgcolor="#0F111A",
        disabled=True,
    )

    def on_preset_change(e):
        is_other = (preset_dropdown.value == "Outros (Descrever abaixo)")
        custom_preset_input.disabled = not is_other
        
        if is_other:
            custom_preset_input.label = "Descreva seu Perfil Customizado (ATIVADO 🔓)"
            custom_preset_input.border_color = "#d4af37"
        else:
            custom_preset_input.label = "Descreva seu Perfil Customizado (Se selecionou 'Outros')"
            custom_preset_input.border_color = "#2c2c2c"
            custom_preset_input.value = "" # Limpa se mudar de ideia
            
        page.update()

    preset_dropdown.on_change = on_preset_change

    status_message = ft.Text(
        value="",
        size=14,
        weight=ft.FontWeight.W_500,
        color="#4caf50",
        opacity=0.0,
        animate_opacity=300,
    )

    output_preview = ft.TextField(
        label="Visualização do Prompt Compilado",
        multiline=True,
        read_only=True,
        min_lines=10,
        max_lines=15,
        border_color="#2c2c2c",
        label_style=ft.TextStyle(color="#7c7c7c"),
        border_radius=10,
        text_size=12,
        color="#c8c8c8",
        bgcolor="#0F111A",
        expand=True,
    )

    # Função de Compilação
    def on_compile_click(e):
        if not task_input.value.strip():
            task_input.error_text = "Por favor, digite a tarefa a ser executada."
            page.update()
            return
            
        task_input.error_text = None
        
        # 1. ONTOLOGIA (ESTRATEGIA.md)
        estrategia_raw = read_markdown_file(FILE_ESTRATEGIA)
        visao_geral = extract_section(estrategia_raw, "### 1.1. Premissa Sociológica") + "\n\n" + \
                      extract_section(estrategia_raw, "### 1.2. A Tese do Projeto") + "\n\n" + \
                      extract_section(estrategia_raw, "## 3. O DIFERENCIAL ESTRATÉGICO & COMERCIAL")
                      
        camada_choice = camada_dropdown.value
        preset_choice = preset_dropdown.value
        persona_context = ""
        
        if camada_choice != "N/A":
            persona_context += f"\n- **Camada de Atuação Ativa:** Camada {camada_choice}\n"
            if camada_choice == "Pessoal":
                persona_context += extract_section(estrategia_raw, "### 2.1. CAMADA 1: CAMADA PESSOAL")
            elif camada_choice == "Comercial":
                persona_context += extract_section(estrategia_raw, "### 2.2. CAMADA 2: CAMADA COMERCIAL")
                
        if preset_choice != "N/A":
            if preset_choice == "Outros (Descrever abaixo)":
                custom_val = custom_preset_input.value.strip() or "Customizado (Não descrito)"
                persona_context += f"\n\n- **Perfil / Preset Ativo (Customizado):** {custom_val}\n"
            else:
                persona_context += f"\n\n- **Perfil / Preset Ativo:** {preset_choice}\n"

        # 2. EPISTEMOLOGIA (PLANEJAMENTO.md)
        planejamento_raw = read_markdown_file(FILE_PLANEJAMENTO)
        arquitetura_app = extract_section(planejamento_raw, "## 2. ARQUITETURA VISUAL & ESTRUTURA DO APP")
        banco_dados = extract_section(planejamento_raw, "## 3. MODELO DE BANCO DE DADOS")
        
        # 3. METODOLOGIA (METODOLOGIA.md)
        metodologia_raw = read_markdown_file(FILE_METODOLOGIA)
        regras_ouro = extract_section(metodologia_raw, "## 1. DIRETRIZES DE DESENVOLVIMENTO (REGRAS DE OURO)")
        batalhao_agentes = extract_section(metodologia_raw, "## 2. O BATALHÃO DE AGENTES DE COPRODUÇÃO (A MESA REDONDA)")
        ritual_desenvolvimento = extract_section(metodologia_raw, "## 4. RITUAL DE DESENVOLVIMENTO ORIGINAL (MÉTODO LINCOLN)")

        # 4. MONTAGEM FINAL DO PROMPT
        prompt_builder = []
        prompt_builder.append("# SYSTEM INSTRUCTION: INSTRUÇÃO DE EXECUÇÃO E CODIFICAÇÃO")
        prompt_builder.append("\n" + "="*80)
        prompt_builder.append("Você é o **Agente Executor** do Killer Skills, um soldado programador altamente qualificado.")
        prompt_builder.append("Sua missão é codificar a tarefa delegada com extrema perfeição técnica, sob a orientação do Orquestrador Lincoln.")
        prompt_builder.append("="*80 + "\n")
        
        prompt_builder.append("## 🧠 1. DIRETRIZ E CONTEXTO DE ATORE (ONTOLOGIA)")
        prompt_builder.append(visao_geral)
        if persona_context:
            prompt_builder.append("\n### Persona Ativa desta Campanha/Código:")
            prompt_builder.append(persona_context)
        prompt_builder.append("\n" + "-"*80)
        
        prompt_builder.append("## 📐 2. ESTRUTURA TÉCNICA E BANCO DE DADOS (EPISTEMOLOGIA)")
        prompt_builder.append(arquitetura_app)
        prompt_builder.append("\n" + banco_dados)
        prompt_builder.append("\n" + "-"*80)
        
        prompt_builder.append("## 🛠️ 3. REGRAS DE CONDUTA E ESTABILIDADE (METODOLOGIA)")
        prompt_builder.append(regras_ouro)
        prompt_builder.append("\n" + batalhao_agentes)
        prompt_builder.append("\n" + ritual_desenvolvimento)
        prompt_builder.append("\n" + "-"*80)
        
        prompt_builder.append("## 🚀 4. ESCOPO EXATO DA TAREFA (OPERAÇÃO)")
        prompt_builder.append(f"Seu objetivo exclusivo nesta rodada é implementar a seguinte tarefa:")
        prompt_builder.append(f"```markdown\n{task_input.value.strip()}\n```")
        prompt_builder.append("\n*Lembre-se: Você deve agir cirurgicamente sobre esta tarefa. Não crie códigos fora do escopo e certifique-se de que nada que já está pronto seja afetado.*")
        
        compiled_prompt = "\n".join(prompt_builder)
        
        # Salva o prompt no arquivo
        try:
            with open(FILE_OUTPUT, "w", encoding="utf-8") as f:
                f.write(compiled_prompt)
        except Exception:
            pass
            
        # Copia para a área de transferência nativa do Flet (100% de confiabilidade!)
        page.set_clipboard(compiled_prompt)
        
        # Exibe o preview na interface
        output_preview.value = compiled_prompt
        
        # Animação de Sucesso
        status_message.value = "⚡ Prompt compilado com sucesso e copiado para o seu Clipboard!"
        status_message.color = "#4caf50"
        status_message.opacity = 1.0
        
        page.update()

    compile_button = ft.ElevatedButton(
        text="Compilar e Copiar Prompt",
        icon=ft.icons.BOLT,
        color="#000000",
        bgcolor="#d4af37",
        style=ft.ButtonStyle(
            shape=ft.RoundedRectangleBorder(radius=10),
            padding=ft.Padding(15, 20, 15, 20),
        ),
        on_click=on_compile_click,
    )

    # Layout em Grid/Cartões
    config_card = ft.Container(
        content=ft.Column(
            controls=[
                ft.Text("Parâmetros do Prompt", size=16, weight=ft.FontWeight.BOLD, color="#ffffff"),
                task_input,
                ft.Row(
                    controls=[camada_dropdown, preset_dropdown],
                    spacing=15,
                ),
                custom_preset_input,
                ft.Row(
                    controls=[compile_button, status_message],
                    alignment=ft.MainAxisAlignment.SPACE_BETWEEN,
                ),
            ],
            spacing=20,
        ),
        bgcolor="#0F111A",
        padding=25,
        border_radius=15,
        border=ft.border.all(1, "#2c2c2c"),
    )

    preview_card = ft.Container(
        content=ft.Column(
            controls=[
                ft.Text("Prompt Gerado (docs/prompt_gerado.md)", size=16, weight=ft.FontWeight.BOLD, color="#ffffff"),
                output_preview,
            ],
            spacing=10,
            expand=True,
        ),
        bgcolor="#0F111A",
        padding=25,
        border_radius=15,
        border=ft.border.all(1, "#2c2c2c"),
        expand=True,
    )

    # Rodapé institucional
    footer = ft.Row(
        controls=[
            ft.Text(
                "ESTRATEGICAMENTE DEFINIDO POR GENERA & LINCOLN  |  CÓDIGO É POESIA!",
                size=10,
                color="#4c4c4c",
            )
        ],
        alignment=ft.MainAxisAlignment.CENTER,
    )

    # Montagem Final da Página
    page.add(
        ft.Column(
            controls=[
                title_row,
                ft.Divider(color="#2c2c2c"),
                config_card,
                preview_card,
                footer,
            ],
            spacing=15,
            expand=True,
        )
    )

if __name__ == "__main__":
    ft.app(
        target=main,
        view="web_browser",
        assets_dir="/home/artz/Documentos/Antigravity/Killer-Skills/Imagens"
    )

