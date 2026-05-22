import os
import flet as ft

# Mapeamento Seguro de Caminhos
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FILE_ESTRATEGIA = os.path.join(ROOT_DIR, "docs", "ESTRATEGIA.md")
FILE_PLANEJAMENTO = os.path.join(ROOT_DIR, "docs", "PLANEJAMENTO.md")
FILE_METODOLOGIA = os.path.join(ROOT_DIR, "docs", "METODOLOGIA.md")
FILE_AUTOMATION_SKILL = os.path.join(ROOT_DIR, "APP", "killer_skills", "automation", "SKILL.md")
FILE_PERSISTENCE_SKILL = os.path.join(ROOT_DIR, "APP", "killer_skills", "persistence", "SKILL.md")
FILE_NARRATIVE_SKILL = os.path.join(ROOT_DIR, "APP", "killer_skills", "narrative", "SKILL.md")

def read_markdown_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        return f"Erro ao ler arquivo: {e}"

def extract_section(raw_text, title):
    if not raw_text:
        return ""
    lines = raw_text.split('\n')
    start_idx = -1
    for i, line in enumerate(lines):
        if title.lower() in line.lower() and ('#' in line or '===' in line):
            start_idx = i
            break
    if start_idx == -1:
        return ""
    
    header_level = len(lines[start_idx]) - len(lines[start_idx].lstrip('#'))
    extracted_lines = []
    extracted_lines.append(lines[start_idx])
    
    for line in lines[start_idx+1:]:
        current_level = len(line) - len(line.lstrip('#'))
        if current_level > 0 and current_level <= header_level:
            break
        extracted_lines.append(line)
        
    return '\n'.join(extracted_lines)

def build_prompt_constructor_view(is_admin: bool, page: ft.Page):
    # --- COMPONENTES VISUAIS ---
    
    # Campo de Entrada de Tarefa
    task_input = ft.TextField(
        label="Descrição da Tarefa / Prompt" if is_admin else "Descreva o Post ou Campanha que deseja criar",
        hint_text="Ex: Adicionar coluna de status no banco SQLite..." if is_admin else "Ex: Criar um carrossel premium mostrando o novo SUV BYD...",
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

    # Componentes Exclusivos da Cockpit de Cliente (is_admin = False)
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
            ft.dropdown.Option("Narcisista", "Pessoal: Narcisista"),
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
            custom_preset_input.value = ""
        page.update()

    preset_dropdown.on_change = on_preset_change

    # Componentes Exclusivos da Cockpit ADM (is_admin = True)
    agent_dropdown = ft.Dropdown(
        label="Agente de Desenvolvimento Destinatário",
        options=[
            ft.dropdown.Option("Lincoln", "Maestro / Orquestrador Geral (Lincoln)"),
            ft.dropdown.Option("Redator", "Redator (Cérebro Narrativo)"),
            ft.dropdown.Option("Tecnico", "Técnico (Arte-Finalista Visual)"),
            ft.dropdown.Option("Estrategista", "Estrategista (Analista de Mídia)"),
            ft.dropdown.Option("Soldado", "Soldado (Executor Mecânico / Postador)"),
        ],
        value="Lincoln",
        border_color="#2c2c2c",
        focused_border_color="#d4af37",
        label_style=ft.TextStyle(color="#9b9b9b"),
        border_radius=10,
        color="#ffffff",
        bgcolor="#0F111A",
        expand=True,
    )

    status_message = ft.Text(
        value="",
        size=14,
        weight=ft.FontWeight.W_500,
        color="#4caf50",
        opacity=0.0,
        animate_opacity=300,
    )

    output_preview = ft.TextField(
        label="Visualização da Ordem de Serviço Compilada" if is_admin else "Visualização do Briefing de Conteúdo Compilado",
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

    def on_compile_click(e):
        if not task_input.value.strip():
            task_input.error_text = "Por favor, digite as especificações."
            page.update()
            return
            
        task_input.error_text = None
        estrategia_raw = read_markdown_file(FILE_ESTRATEGIA)
        planejamento_raw = read_markdown_file(FILE_PLANEJAMENTO)
        metodologia_raw = read_markdown_file(FILE_METODOLOGIA)
        
        prompt_builder = []
        
        if is_admin:
            # Compilação ADM / Engenharia
            prompt_builder.append("# SYSTEM INSTRUCTION: ORDEM DE SERVIÇO TÉCNICA (ADMIN)")
            prompt_builder.append("="*80)
            prompt_builder.append(f"Destinatário: Agente de Desenvolvimento [{agent_dropdown.value}]")
            prompt_builder.append("="*80 + "\n")
            
            prompt_builder.append("## 🧠 1. DIRETRIZES ONTOLÓGICAS (ESTRATÉGIA)")
            prompt_builder.append(extract_section(estrategia_raw, "### 1.1. Premissa Sociológica"))
            prompt_builder.append(extract_section(estrategia_raw, "### 1.2. A Tese do Projeto"))
            
            prompt_builder.append("\n## 📐 2. ARQUITETURA TÉCNICA (PLANEJAMENTO)")
            prompt_builder.append(extract_section(planejamento_raw, "## 3. MODELO DE BANCO DE DADOS"))
            
            prompt_builder.append("\n## 🛠️ 3. RITUAIS E DIRETRIZES DE ENGENHARIA (METODOLOGIA)")
            prompt_builder.append(extract_section(metodologia_raw, "## 1. DIRETRIZES DE DESENVOLVIMENTO"))
            
            # Carregar e injetar contrato da Skill do Agente
            target_agent = agent_dropdown.value
            skill_text = ""
            if target_agent == "Soldado":
                skill_text = read_markdown_file(FILE_AUTOMATION_SKILL)
            elif target_agent in ["Redator", "Estrategista"]:
                skill_text = read_markdown_file(FILE_NARRATIVE_SKILL)
            elif target_agent == "Tecnico":
                skill_text = read_markdown_file(FILE_PERSISTENCE_SKILL)
                
            if skill_text and not skill_text.startswith("Erro"):
                prompt_builder.append("\n## 🧩 4. CONTRATO DE AGENTE E ESPECIFICAÇÃO DE SKILL")
                prompt_builder.append(skill_text)
            
            prompt_builder.append("\n" + "="*80)
            prompt_builder.append("## 📝 ESCOPO DA TAREFA TÉCNICA DE ENGENHARIA DELEGADA:")
            prompt_builder.append(task_input.value.strip())
            prompt_builder.append("="*80)
        else:
            # Compilação Pública / Cliente
            prompt_builder.append("# INSTRUÇÃO DE COPILOTO: CRIAÇÃO DE POST & STORYBOARD")
            prompt_builder.append("="*80)
            prompt_builder.append("Você é o **Redator e Diretor de Arte Operacional** do Killer Skills.")
            prompt_builder.append("Sua missão é dar vida a uma peça conceitual premium sob as diretrizes abaixo.")
            prompt_builder.append("="*80 + "\n")
            
            prompt_builder.append("## 🧠 1. CONTEXTO E POSICIONAMENTO DA MARCA")
            
            camada_choice = camada_dropdown.value
            preset_choice = preset_dropdown.value
            
            if camada_choice != "N/A":
                prompt_builder.append(f"- **Camada Estratégica:** {camada_choice}")
                if camada_choice == "Pessoal":
                    prompt_builder.append(extract_section(estrategia_raw, "### 2.1. CAMADA 1: CAMADA PESSOAL"))
                elif camada_choice == "Comercial":
                    prompt_builder.append(extract_section(estrategia_raw, "### 2.2. CAMADA 2: CAMADA COMERCIAL"))
            
            if preset_choice != "N/A":
                if preset_choice == "Outros (Descrever abaixo)":
                    custom_val = custom_preset_input.value.strip() or "Customizado (Não especificado)"
                    prompt_builder.append(f"- **Preset Customizado do Usuário:** {custom_val}")
                else:
                    prompt_builder.append(f"- **Preset Selecionado:** {preset_choice}")
            
            prompt_builder.append("\n## 🎯 2. ESCOPO CRIATIVO DO POST SOLICITADO:")
            prompt_builder.append(task_input.value.strip())
            
        compiled_text = "\n".join(prompt_builder)
        output_preview.value = compiled_text
        
        # Salva o arquivo de apoio para o Agente Executor ler se necessário
        output_path = os.path.join(ROOT_DIR, "docs", "prompt_gerado.md")
        try:
            with open(output_path, "w", encoding="utf-8") as f:
                f.write(compiled_text)
        except Exception:
            pass
            
        # Copia para o Clipboard nativamente
        page.set_clipboard(compiled_text)
        
        # Feedback Visual
        status_message.value = "📋 Prompt Compilado e Copiado para a Área de Transferência!"
        status_message.color = "#d4af37"
        status_message.opacity = 1.0
        page.update()
        
        import time
        def fade_out():
            time.sleep(3)
            status_message.opacity = 0.0
            page.update()
            
        import threading
        threading.Thread(target=fade_out).start()

    compile_button = ft.ElevatedButton(
        text="Compilar e Copiar Ordem" if is_admin else "Compilar Briefing de Post",
        icon=ft.icons.BOLT,
        color="#000000",
        bgcolor="#d4af37",
        style=ft.ButtonStyle(
            shape=ft.RoundedRectangleBorder(radius=10),
            padding=ft.Padding(15, 20, 15, 20),
        ),
        on_click=on_compile_click,
    )

    # Layout do Bloco de Configurações
    config_controls = [
        ft.Text("Parâmetros da Ordem" if is_admin else "Configurações de Identidade", size=16, weight=ft.FontWeight.BOLD, color="#ffffff"),
        task_input,
    ]
    
    if is_admin:
        config_controls.append(
            ft.Row(
                controls=[agent_dropdown],
                spacing=15,
            )
        )
    else:
        config_controls.append(
            ft.Row(
                controls=[camada_dropdown, preset_dropdown],
                spacing=15,
            )
        )
        config_controls.append(custom_preset_input)
        
    config_controls.append(
        ft.Row(
            controls=[compile_button, status_message],
            alignment=ft.MainAxisAlignment.SPACE_BETWEEN,
        )
    )

    config_card = ft.Container(
        content=ft.Column(controls=config_controls, spacing=20),
        bgcolor="#0F111A",
        padding=25,
        border_radius=15,
        border=ft.border.all(1, "#2c2c2c"),
    )

    preview_card = ft.Container(
        content=ft.Column(
            controls=[
                ft.Text("Ordem Compilada (docs/prompt_gerado.md)" if is_admin else "Briefing Compilado (docs/prompt_gerado.md)", size=16, weight=ft.FontWeight.BOLD, color="#ffffff"),
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

    return ft.Container(
        expand=True,
        padding=40,
        bgcolor="#000000",
        content=ft.Column([
            ft.Row([
                ft.Column([
                    ft.Text("🛠️ Construtor ADM" if is_admin else "📝 Construtor de Prompts", size=36, weight="bold"),
                    ft.Text("ENGENHARIA E DIRETRIZES DE CÓDIGO" if is_admin else "DIREÇÃO NARRATIVA E DIRETRIZES IA", color="#d4af37", size=11, weight="bold")
                ]),
            ], alignment="spaceBetween"),
            ft.Divider(color="white10", height=30),
            
            ft.Row([
                config_card,
                preview_card
            ], spacing=25, expand=True, alignment="start", vertical_alignment="start")
        ], scroll="auto")
    )
