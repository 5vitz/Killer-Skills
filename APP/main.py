import os
import flet as ft
from datetime import datetime
import sys
import shutil
import threading
from dotenv import load_dotenv

# Segurança
os.environ["FLET_SECRET_KEY"] = "GENERA_STRATEGY_2026"

# Estrutura de Pastas
ROOT_DIR = os.path.dirname(__file__)
ASSETS_DIR = os.path.join(ROOT_DIR, "assets")
UPLOAD_DIR = os.path.join(ROOT_DIR, "uploads")

# Carregar configurações do cofre .env (subindo um nível para a raiz)
load_dotenv(os.path.join(ROOT_DIR, "..", ".env"))

for d in [ASSETS_DIR, UPLOAD_DIR]:
    if not os.path.exists(d): os.makedirs(d)

# Banco de Dados e IA
sys.path.append(os.path.join(ROOT_DIR, 'killer_skills'))
try:
    from persistence.scripts.database import PersistenceSkill
    db = PersistenceSkill("agente_insta.db")
except Exception as e:
    print(f"Erro no DB: {e}")
    db = None

try:
    from narrative.scripts.narrative_engine import NarrativeSkill
    ai = NarrativeSkill()
except Exception as e:
    print(f"⚠️ ERRO AO CARREGAR IA: {e}")
    ai = None

def main(page: ft.Page):
    page.title = "Killer Skills - Direção de Arte"
    page.theme_mode = "dark"
    page.bgcolor = "#050505"
    page.padding = 0
    page.window_width = 1350
    page.window_height = 880

    # --- ESTADO GLOBAL DO COCKPIT ---
    active_view = "storyboard"      # "storyboard", "almoxarifado", "colecoes"
    active_slot = None              # Slot (0, 1, 2, 3) sendo editado
    storyboard_data = [None] * 4 
    txt_legenda = ft.TextField(
        label="Legenda Estratégica", multiline=True, min_lines=5, 
        border_color="#1E60FF", expand=True, bgcolor="#0A0A0A"
    )
    ai_insight_text = ft.Text("Selecione fotos para análise...", size=13, italic=True)
    
    # Mídias Seed (Semeadas) para o Mockup ficar lindo de primeira!
    seed_images = [
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500", # Jeep
        "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=500", # Hyundai
        "https://images.unsplash.com/photo-1563720223185-11003d516935?w=500", # BYD
        "https://images.unsplash.com/photo-1621007947382-cc347941150e?w=500"  # Toyota
    ]

    # --- SIMULADOR INSTAGRAM REATIVO (Preview 1:1) ---
    preview_avatar_text = ft.Text("GO", size=10, weight="bold", color="white")
    preview_username_top = ft.Text("grupoorletti", size=11, weight="bold", color="white")
    preview_username_caption = ft.TextSpan("grupoorletti ", ft.TextStyle(weight="bold", color="white"))
    preview_caption_text = ft.TextSpan("Legenda do post...", ft.TextStyle(color="white"))
    
    preview_media = ft.Image(src=None, fit="cover", border_radius=10)
    preview_media_container = ft.Container(
        content=ft.Text("Nenhuma mídia selecionada", color="white30", size=11),
        width=300, height=260, bgcolor="#141414", border_radius=10, alignment=ft.alignment.center
    )

    def on_caption_change(e):
        preview_caption_text.text = txt_legenda.value if txt_legenda.value else "Legenda do post..."
        page.update()
    
    txt_legenda.on_change = on_caption_change

    # Dropdown de Contas do Grupo Orletti
    account_dropdown = ft.Dropdown(
        label="Selecionar Canal (Grupo Orletti)",
        border_color="#1E60FF",
        width=280,
        options=[
            ft.dropdown.Option("grupoorletti", "Grupo Orletti (@grupoorletti)"),
            ft.dropdown.Option("orlettiseminovos", "Orletti Seminovos (@orlettiseminovos)"),
            ft.dropdown.Option("jeeporletti", "Jeep Orletti (@jeeporletti)"),
            ft.dropdown.Option("hyundaiorletti", "Hyundai Orletti (@hyundaiorletti)"),
            ft.dropdown.Option("fiatorletti", "Fiat Orletti (@fiatorletti)"),
            ft.dropdown.Option("bydorletti", "BYD Orletti (@bydorletti)"),
            ft.dropdown.Option("gwmorletti", "GWM Orletti (@gwmorletti)"),
            ft.dropdown.Option("renaultorletti", "Renault Orletti (@renaultorletti)"),
            ft.dropdown.Option("toyotaorletti", "Toyota Orletti (@toyotaorletti)"),
        ],
        value="grupoorletti",
    )

    def on_account_change(e):
        val = account_dropdown.value
        username = f"{val}"
        preview_username_top.value = username
        preview_username_caption.text = f"{username} "
        
        # Iniciais para o avatar circular
        initials = "".join([part[0] for part in val.split("orletti") if part]).upper()
        if not initials: initials = val[:2].upper()
        preview_avatar_text.value = initials[:2]
        page.update()

    account_dropdown.on_change = on_account_change

    # --- LÓGICA DE NAVEGAÇÃO DE PÁGINAS ---
    main_panel_container = ft.Container(expand=True)

    def change_view(view_name):
        nonlocal active_view
        active_view = view_name
        main_panel_container.content = build_active_view()
        # Atualiza o menu lateral para refletir a navegação ativa
        sidebar_container.content = build_sidebar()
        page.update()

    def show_snack(msg, color="green"):
        page.snack_bar = ft.SnackBar(ft.Text(msg), bgcolor=color)
        page.snack_bar.open = True
        page.update()

    # --- LÓGICA DE IA ---
    def run_ai_analysis():
        m_ativas = [m for m in storyboard_data if m is not None]
        if ai and m_ativas:
            ai_insight_text.value = "O Co-Diretor está analisando as imagens... 🧠⚡"
            ai_insight_text.color = "#1E60FF"
            page.update()
            
            resultado = ai.analisar_storyboard(m_ativas)
            ai_insight_text.value = resultado
            ai_insight_text.color = ft.colors.WHITE
            page.update()

    def run_ai_caption(e):
        if ai:
            txt_legenda.value = "Gerando legenda estratégica... ✍️"
            page.update()
            
            def task():
                res = ai.sugerir_legenda(storyboard_data)
                txt_legenda.value = res
                preview_caption_text.text = res
                page.update()
            
            threading.Thread(target=task).start()

    # --- TELA DE LOGIN ---
    def go_to_studio():
        change_view("storyboard")

    def login_view():
        return ft.Container(
            expand=True, alignment=ft.alignment.center,
            content=ft.Stack([
                ft.Container(width=400, height=400, bgcolor=ft.colors.with_opacity(0.05, "#1E60FF"), border_radius=200, blur=ft.Blur(100, 100), left=100, top=100),
                ft.Column([
                    ft.Text("Killer Skills", size=72, weight="bold"),
                    ft.Text("NOSSOS AGENTES TRABALHAM POR VOCÊ!", color="#1E60FF", size=14, weight="bold"),
                    ft.Divider(height=40, color="transparent"),
                    ft.Container(
                        padding=40, width=500, bgcolor=ft.colors.with_opacity(0.05, ft.colors.WHITE),
                        border_radius=30, border=ft.border.all(1, ft.colors.with_opacity(0.1, ft.colors.WHITE)),
                        blur=ft.Blur(15, 15),
                        content=ft.Column([
                            ft.Text("Sessão de Iniciação", size=24, weight="w600"),
                            ft.ElevatedButton("INICIAR JORNADA", bgcolor="#1E60FF", color="white", width=300, height=55, on_click=lambda _: go_to_studio()),
                            ft.TextButton("Consultoria IA Especializada", icon=ft.icons.AUTO_AWESOME, icon_color="#1E60FF")
                        ], horizontal_alignment="center", alignment="center", spacing=30)
                    ),
                    ft.Divider(height=40, color="transparent"),
                    ft.Text("© 2026 KILLER SKILLS - ESTILO DE VIDA CRIATIVO", size=10, color="white10")
                ], horizontal_alignment="center", alignment="center")
            ])
        )

    # --- LÓGICA DO STORYBOARD (STORYBOARD CARD CLICK -> GO TO LIBRARY) ---
    def on_storyboard_card_click(e):
        nonlocal active_slot
        active_slot = e.control.data  # Salva qual slot (0, 1, 2 ou 3) está ativo
        change_view("almoxarifado")   # Vai para a biblioteca de mídias!

    # --- LÓGICA DA BIBLIOTECA (CLICK MEDIA IN LIBRARY -> RETURN TO STORYBOARD) ---
    def select_and_insert_media(e):
        nonlocal active_slot
        src = e.control.data
        
        if active_slot is not None:
            storyboard_data[active_slot] = src
            
            # Atualiza o simulador do Instagram na hora
            preview_media.src = src
            preview_media_container.content = preview_media
            
            show_snack(f"📥 Mídia inserida com sucesso no Frame {active_slot + 1}!", "#1E60FF")
            
            # Limpa o slot ativo e volta para a tela do Storyboard!
            active_slot = None
            change_view("storyboard")
            
            # Executa a IA no plano de fundo para não travar
            threading.Thread(target=run_ai_analysis).start()
        else:
            # Se clicado fora do fluxo de seleção, apenas bota no simulador
            preview_media.src = src
            preview_media_container.content = preview_media
            page.update()

    # --- 1. CONSTRUÇÃO DA TELA: CREATIVE STUDIO (STORYBOARD) ---
    def build_storyboard_view():
        # Cards do Storyboard Espaçosos
        cards = []
        for i in range(4):
            has_media = storyboard_data[i] is not None
            card_content = ft.Image(src=storyboard_data[i], expand=True, fit="cover", border_radius=15) if has_media else ft.Column([
                ft.Icon(ft.icons.ADD_A_PHOTO, size=28, color="white30"),
                ft.Text(f"FRAME {i+1}", color="white30", size=10, weight="bold"),
                ft.Text("Clique para Inserir", color="white10", size=8)
            ], alignment="center", horizontal_alignment="center", spacing=8)
            
            cards.append(
                ft.Container(
                    content=card_content,
                    width=170, height=230, bgcolor="#0A0A0A", border_radius=15, 
                    border=ft.border.all(1, "greenaccent" if has_media else "white10"), 
                    alignment=ft.alignment.center,
                    data=i, on_click=on_storyboard_card_click,
                    animate=ft.Animation(300, ft.AnimationCurve.EASE_OUT)
                )
            )

        return ft.Container(
            expand=True, padding=30, bgcolor="#000000",
            content=ft.Column([
                # Header Espaçoso
                ft.Row([
                    ft.Column([
                        ft.Text("🎬 Creative Studio", size=32, weight="bold"),
                        ft.Text("DIREÇÃO DE ARTE E STORYBOARD ATIVOS", color="#1E60FF", size=10, weight="bold")
                    ]),
                    account_dropdown
                ], alignment="spaceBetween"),
                ft.Divider(color="white10", height=30),
                
                # Coleção Indicador
                ft.Row([
                    ft.Text("Coleção Ativa:", size=11, color="white30"),
                    ft.Container(
                        padding=ft.padding.symmetric(horizontal=10, vertical=4),
                        bgcolor="#1E60FF", border_radius=8,
                        content=ft.Text(f"@{account_dropdown.value}", size=11, weight="bold", color="white")
                    )
                ]),
                ft.Container(height=10),
                
                # Storyboard Cards
                ft.Text("STORYBOARD (CLIQUE EM UM CARD PARA PROCURAR MÍDIA)", size=11, color="white30", weight="bold"),
                ft.Row(cards, spacing=20),
                
                ft.Divider(height=30, color="transparent"),
                
                # Legendas
                ft.Text("ESCREVA A LEGENDA E SOLICITE COPILOTO IA", size=11, color="white30", weight="bold"),
                ft.Row([
                    txt_legenda, 
                    ft.Container(
                        content=ft.IconButton(ft.icons.AUTO_AWESOME, icon_color="#1E60FF", on_click=run_ai_caption, icon_size=28),
                        bgcolor="#0A0A0A", border_radius=15, width=60, height=60, alignment=ft.alignment.center
                    )
                ], spacing=10),
                
                ft.Container(height=10),
                
                # Agendamento
                ft.ElevatedButton(
                    "AGENDAR CAMPANHA COMPLETA", bgcolor="#1E60FF", color="white", 
                    height=55, width=320, on_click=lambda _: agendar_save()
                )
            ], scroll="auto")
        )

    # --- 2. CONSTRUÇÃO DA TELA: ALMOXARIFADO (BIBLIOTECA DE MÍDIA) ---
    def build_almoxarifado_view():
        # Carrega todas as mídias da pasta de uploads e assets + seeds
        media_sources = seed_images.copy()
        
        if os.path.exists(ASSETS_DIR):
            for f in os.listdir(ASSETS_DIR):
                if f.lower().endswith((".png", ".jpg", ".jpeg", ".webp")):
                    # Evita duplicar links absolutos
                    media_sources.append(f"/{f}")

        # Monta a galeria em Grid
        grid_controls = []
        for src in media_sources:
            btn_inserir = ft.Container(
                content=ft.Text(f"📥 Inserir no Frame {active_slot + 1}", size=9, weight="bold", color="white"),
                bgcolor="#1E60FF", border_radius=8, padding=6,
                alignment=ft.alignment.center, data=src, on_click=select_and_insert_media
            ) if active_slot is not None else ft.Container(
                content=ft.Text("Visualizar no Feed", size=8, color="white70"),
                bgcolor="white10", border_radius=8, padding=4,
                alignment=ft.alignment.center, data=src, on_click=select_and_insert_media
            )

            grid_controls.append(
                ft.Container(
                    content=ft.Column([
                        ft.Image(src=src, width=130, height=130, fit="cover", border_radius=10),
                        ft.Container(height=5),
                        btn_inserir
                    ], alignment="center", horizontal_alignment="center"),
                    padding=10, bgcolor="#0A0A0A", border_radius=15,
                    border=ft.border.all(1, "white10"),
                    width=150, height=190
                )
            )

        # Banner informativo se estiver selecionando para um Frame
        banner_selecao = ft.Container(
            padding=15, bgcolor="#1E60FF", border_radius=12,
            content=ft.Row([
                ft.Icon(ft.icons.INFO_OUTLINE, color="white"),
                ft.Text(f"SELECIONANDO MÍDIA PARA O FRAME {active_slot + 1} DA CAMPANHA", weight="bold", size=13),
                ft.Spacer(),
                ft.TextButton("Cancelar e Voltar", icon=ft.icons.CLOSE, icon_color="white", on_click=lambda _: cancel_selection())
            ])
        ) if active_slot is not None else ft.Container()

        def cancel_selection():
            nonlocal active_slot
            active_slot = None
            change_view("storyboard")

        return ft.Container(
            expand=True, padding=30, bgcolor="#000000",
            content=ft.Column([
                ft.Row([
                    ft.Column([
                        ft.Text("📁 Almoxarifado Central", size=32, weight="bold"),
                        ft.Text("GERENCIADOR DE COLEÇÕES E ATIVOS VISUAIS", color="#1E60FF", size=10, weight="bold")
                    ]),
                    ft.ElevatedButton("Fazer Upload", icon=ft.icons.ADD_TO_PHOTOS, on_click=lambda _: picker.pick_files(allow_multiple=True))
                ], alignment="spaceBetween"),
                ft.Divider(color="white10", height=30),
                
                banner_selecao,
                ft.Container(height=10),
                
                ft.Text("MÍDIAS DISPONÍVEIS NA COLEÇÃO", size=11, color="white30", weight="bold"),
                ft.Row(grid_controls, wrap=True, spacing=15, scroll="auto")
            ], scroll="auto")
        )

    # --- 3. CONSTRUÇÃO DA TELA: COLEÇÕES / CLIENTES ---
    def build_colecoes_view():
        # Mock de Coleções estilo Firestore
        return ft.Container(
            expand=True, padding=30, bgcolor="#000000",
            content=ft.Column([
                ft.Text("💼 Gestão de Coleções", size=32, weight="bold"),
                ft.Text("CLIENTES E CONTAS CONECTADAS NO VPS", color="#1E60FF", size=10, weight="bold"),
                ft.Divider(color="white10", height=30),
                
                ft.Text("CLIENTES ATIVOS (ESTILO COLOÇÕES FIRESTORE)", size=11, color="white30", weight="bold"),
                ft.Row([
                    ft.Container(
                        width=320, padding=25, bgcolor="#0A0A0A", border_radius=15,
                        border=ft.border.all(1, "#1E60FF"),
                        content=ft.Column([
                            ft.Row([
                                ft.Icon(ft.icons.BUSINESS, color="#1E60FF", size=32),
                                ft.Column([
                                    ft.Text("Grupo Orletti", size=18, weight="bold"),
                                    ft.Text("Sua Conta Master", size=10, color="white30")
                                ], spacing=0)
                            ], spacing=15),
                            ft.Divider(color="white10", height=15),
                            ft.Text("09 Contas de Instagram vinculadas no VPS.", size=12, color="white70"),
                            ft.Container(height=10),
                            ft.ElevatedButton("Configurar Canais", width=200, bgcolor="white10", color="white")
                        ])
                    ),
                    ft.Container(
                        width=320, padding=25, bgcolor="#0A0A0A", border_radius=15,
                        border=ft.border.all(1, "white10"),
                        content=ft.Column([
                            ft.Row([
                                ft.Icon(ft.icons.ADD, color="white30", size=32),
                                ft.Column([
                                    ft.Text("Nova Coleção", size=18, weight="bold", color="white30"),
                                    ft.Text("Adicionar Cliente", size=10, color="white30")
                                ], spacing=0)
                            ], spacing=15),
                            ft.Divider(color="white10", height=15),
                            ft.Text("Cadastre uma nova agência ou cliente para isolar mídias e posts.", size=12, color="white30"),
                            ft.Container(height=10),
                            ft.ElevatedButton("Criar Coleção", width=200, disabled=True)
                        ])
                    )
                ], spacing=20)
            ], scroll="auto")
        )

    # --- 4. CONSTRUÇÃO DO COCKPIT CENTRAL (SIDEBAR + MAIN + PREVIEW) ---
    def build_sidebar():
        return ft.Container(
            width=260, bgcolor="#0A0A0A", padding=20,
            border=ft.border.only(right=ft.border.BorderSide(1, "white10")),
            content=ft.Column([
                ft.Text("Killer Skills", size=26, weight="bold"),
                ft.Text("STUDIO COCKPIT", color="#1E60FF", size=9, weight="bold"),
                ft.Divider(color="white10", height=30),
                
                ft.Text("ÁREAS DE TRABALHO", size=10, color="white30", weight="bold"),
                ft.Container(height=5),
                
                # Menu de Navegação Premium
                ft.Container(
                    content=ft.Row([
                        ft.Icon(ft.icons.AUTO_AWESOME_MOTION, color="#1E60FF" if active_view == "storyboard" else "white30", size=18),
                        ft.Text("Creative Studio", color="white" if active_view == "storyboard" else "white70", size=13, weight="bold" if active_view == "storyboard" else "normal")
                    ]),
                    padding=ft.padding.symmetric(horizontal=12, vertical=10),
                    bgcolor=ft.colors.with_opacity(0.05, "#1E60FF") if active_view == "storyboard" else "transparent",
                    border_radius=10,
                    on_click=lambda _: change_view("storyboard")
                ),
                ft.Container(
                    content=ft.Row([
                        ft.Icon(ft.icons.FOLDER_SPECIAL, color="#1E60FF" if active_view == "almoxarifado" else "white30", size=18),
                        ft.Text("Almoxarifado", color="white" if active_view == "almoxarifado" else "white70", size=13, weight="bold" if active_view == "almoxarifado" else "normal")
                    ]),
                    padding=ft.padding.symmetric(horizontal=12, vertical=10),
                    bgcolor=ft.colors.with_opacity(0.05, "#1E60FF") if active_view == "almoxarifado" else "transparent",
                    border_radius=10,
                    on_click=lambda _: change_view("almoxarifado")
                ),
                ft.Container(
                    content=ft.Row([
                        ft.Icon(ft.icons.PEOPLE_OUTLINE, color="#1E60FF" if active_view == "colecoes" else "white30", size=18),
                        ft.Text("Coleções / Clientes", color="white" if active_view == "colecoes" else "white70", size=13, weight="bold" if active_view == "colecoes" else "normal")
                    ]),
                    padding=ft.padding.symmetric(horizontal=12, vertical=10),
                    bgcolor=ft.colors.with_opacity(0.05, "#1E60FF") if active_view == "colecoes" else "transparent",
                    border_radius=10,
                    on_click=lambda _: change_view("colecoes")
                ),
                
                # Rodapé / Status
                ft.Container(expand=True),
                ft.Text("Slogan:", size=8, color="white30"),
                ft.Text("Nossos Agentes Trabalham por Você!", size=9, italic=True, color="white60"),
                ft.Container(height=10),
                ft.Row([
                    ft.Container(width=8, height=8, bgcolor="green", border_radius=4),
                    ft.Text("ONLINE NO VPS", size=9, color="white30")
                ], spacing=8)
            ], spacing=10)
        )

    # Declaramos o contêiner da barra lateral
    sidebar_container = ft.Container(content=build_sidebar())

    # --- MONTAGEM DA INTERFACE PRINCIPAL ---
    def build_active_view():
        if active_view == "storyboard":
            return build_storyboard_view()
        elif active_view == "almoxarifado":
            return build_almoxarifado_view()
        elif active_view == "colecoes":
            return build_colecoes_view()

    # Painel Principal do Studio
    main_panel_container.content = build_active_view()

    # Coluna do Preview (Lado Direito)
    preview_column = ft.Container(
        width=360, bgcolor="#0A0A0A", padding=20,
        border=ft.border.only(left=ft.border.BorderSide(1, "white10")),
        content=ft.Column([
            ft.Text("DIRETORIA & PREVIEW", color="#1E60FF", weight="bold", size=16),
            ft.Divider(color="white10", height=15),
            
            # Seção 1: Insights da IA
            ft.Text("INSIGHTS DO CO-DIRETOR", size=11, color="white30", weight="bold"),
            ft.Container(
                padding=15, bgcolor=ft.colors.with_opacity(0.02, ft.colors.WHITE),
                border_radius=12, border=ft.border.all(1, ft.colors.with_opacity(0.05, ft.colors.WHITE)),
                content=ai_insight_text,
                height=100,
            ),
            ft.Divider(color="white10", height=20),
            
            # Seção 2: Simulador do Instagram
            ft.Text("SIMULADOR INSTAGRAM (1:1)", size=11, color="white30", weight="bold"),
            ft.Container(
                padding=12, bgcolor="#000000", border_radius=15,
                border=ft.border.all(1, "white10"),
                content=ft.Column([
                    # Header do Post
                    ft.Row([
                        ft.Container(
                            content=preview_avatar_text,
                            width=28, height=28, bgcolor="#C5A880", border_radius=14, alignment=ft.alignment.center
                        ),
                        ft.Column([
                            preview_username_top,
                            ft.Text("Vitória, ES", size=8, color="white30")
                        ], spacing=0),
                        ft.Container(expand=True),
                        ft.Icon(ft.icons.MORE_HORIZ, color="white", size=16)
                    ], alignment="center"),
                    
                    # Media Display
                    preview_media_container,
                    
                    # Action Bar
                    ft.Row([
                        ft.Icon(ft.icons.FAVORITE_BORDER, color="white", size=16),
                        ft.Icon(ft.icons.CHAT_BUBBLE_OUTLINE, color="white", size=16),
                        ft.Icon(ft.icons.SEND, color="white", size=16),
                        ft.Container(expand=True),
                        ft.Icon(ft.icons.BOOKMARK_BORDER, color="white", size=16)
                    ]),
                    
                    # Likes e Legenda
                    ft.Text("Curtido por ingrid_sinkovitz e outras pessoas", size=10, weight="w500", color="white"),
                    ft.Text(
                        spans=[
                            preview_username_caption,
                            preview_caption_text
                        ], size=10, max_lines=3, overflow="ellipsis"
                    )
                ], spacing=8)
            )
        ], spacing=10, scroll="auto")
    )

    # Painel Geral de Trabalho (Sidebar + Main + Preview)
    studio_layout = ft.Row(
        expand=True, spacing=0,
        controls=[
            sidebar_container,
            main_panel_container,
            preview_column
        ]
    )

    # --- ANIMAÇÃO DE TROCA DE TELA ---
    main_container = ft.AnimatedSwitcher(
        content=ft.Container(),
        expand=True, transition=ft.AnimatedSwitcherTransition.FADE, duration=500
    )

    def go_to_studio():
        main_container.content = studio_layout
        page.update()

    def agendar_save():
        m = [m for m in storyboard_data if m is not None]
        if m and db:
            caminhos = [os.path.join(ASSETS_DIR, x.replace("/", "")) for x in m if not x.startswith("http")]
            db.agendar_post(datetime.now().strftime("%Y-%m-%d %H:%M:%S"), ", ".join(caminhos), txt_legenda.value)
            show_snack("🚀 Sucesso! Campanha enviada para a fila.", "#1E60FF")

    def on_upload(e: ft.FilePickerUploadEvent):
        if e.progress == 1.0:
            src_p, dst_p = os.path.join(UPLOAD_DIR, e.file_name), os.path.join(ASSETS_DIR, e.file_name)
            if os.path.exists(src_p): shutil.copy(src_p, dst_p)
            # Atualiza o almoxarifado reativamente se estiver na tela dele
            if active_view == "almoxarifado":
                change_view("almoxarifado")
            show_snack(f"✅ Upload concluído: {e.file_name}", "#1E60FF")

    picker = ft.FilePicker(on_result=lambda e: picker.upload([ft.FilePickerUploadFile(f.name, upload_url=page.get_upload_url(f.name, 600)) for f in e.files]) if e.files else None, on_upload=on_upload)
    page.overlay.append(picker)

    main_container.content = login_view()
    page.add(main_container)

if __name__ == "__main__":
    ft.app(target=main, view=None, port=8081, assets_dir=ASSETS_DIR, upload_dir=UPLOAD_DIR)
