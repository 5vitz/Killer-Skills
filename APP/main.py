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


# Copiar Logo Premium Metalizada para a pasta assets
logo_src = "/home/artz/Documentos/Antigravity/Killer-Skills/Imagens/Logo_Final.png"
logo_dst = os.path.join(ASSETS_DIR, "killer_skills_logo.png")
if os.path.exists(logo_src):
    try:
        shutil.copy(logo_src, logo_dst)
    except Exception as e:
        print(f"Erro ao copiar logo: {e}")

# Banco de Dados e IA
sys.path.append(os.path.join(ROOT_DIR, 'killer_skills'))
try:
    from persistence.scripts.database import PersistenceSkill
    db = PersistenceSkill("killer_skills.db")
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
    
    # Inicializa o FilePicker no overlay no topo exato para evitar erros do Flet
    picker = ft.FilePicker()
    page.overlay.append(picker)

    # --- ESTADO GLOBAL DO COCKPIT ---
    active_view = "storyboard"      # "storyboard", "almoxarifado", "colecoes", "preview"
    is_admin_mode = False           # Chave de acesso ADM
    is_logged_in = False            # Chave de acesso SaaS
    logged_in_user_email = ""       # E-mail do usuário autenticado
    active_slot = None              # Slot (0, 1, 2, 3) sendo editado
    storyboard_data = [None] * 4 
    selected_persona_idx = 0
    micro_services_state = {
        "legendas": True,
        "roteiro": False,
        "webp": True,
        "video": False
    }
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
    preview_avatar_text = ft.Text("SR", size=10, weight="bold", color="white")
    preview_username_top = ft.Text("scallarecords", size=11, weight="bold", color="white")
    preview_username_caption = ft.TextSpan("scallarecords ", ft.TextStyle(weight="bold", color="white"))
    preview_caption_text = ft.TextSpan("Legenda do post...", ft.TextStyle(color="white"))
    
    preview_media = ft.Image(src=None, fit="cover", border_radius=10)
    preview_media_container = ft.Container(
        content=ft.Text("Nenhuma mídia selecionada", color="white30", size=11),
        width=300, height=260, bgcolor="#141414", border_radius=10, alignment=ft.Alignment(0, 0)
    )

    def on_caption_change(e):
        preview_caption_text.text = txt_legenda.value if txt_legenda.value else "Legenda do post..."
        page.update()
    
    txt_legenda.on_change = on_caption_change

    # Dropdown de Contas do Scalla Records
    account_dropdown = ft.Dropdown(
        label="Selecionar Canal (Scalla Records)",
        border_color="#1E60FF",
        width=280,
        options=[
            ft.dropdown.Option("scallarecords", "Scalla Records (@scallarecords)"),
            ft.dropdown.Option("scallarecords_studios", "Scalla Studios (@scallarecords_studios)"),
            ft.dropdown.Option("scallarecords_test", "Scalla Test (@scallarecords_test)"),
        ],
        value="scallarecords",
    )

    def on_account_change(e):
        val = account_dropdown.value
        username = f"{val}"
        preview_username_top.value = username
        preview_username_caption.text = f"{username} "
        
        # Iniciais para o avatar circular
        initials = "".join([part[0] for part in val.split("scalla") if part]).upper()
        if not initials: initials = val[:2].upper()
        preview_avatar_text.value = initials[:2]
        page.update()

    account_dropdown.on_change = on_account_change


    # --- LÓGICA DE NAVEGAÇÃO DE PÁGINAS ---
    main_panel_container = ft.Container(expand=True)

    def change_view(view_name):
        nonlocal active_view
        active_view = view_name
        
        # Sidebar Metálica Prateada Escovada ao entrar em Serviços AI
        if view_name == "servicos":
            sidebar_container.bgcolor = "#1A1A1E"  # Tom escuro de metal nobre
            sidebar_container.border = ft.Border(right=ft.BorderSide(2, "#A0AAB5"))  # Brilho prateado proeminente
        else:
            sidebar_container.bgcolor = "#0A0A0A"
            sidebar_container.border = ft.Border(right=ft.BorderSide(1, "white10"))

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

    def login_view():
        # O mockup de smartphone no centro exato da área restante
        smartphone_login_visor = ft.Container(
            expand=True,
            content=ft.Column([
                ft.Image(src="/killer_skills_logo.png", height=110, fit="contain"),
                ft.Container(height=20),
                ft.Text("CONECTAR COM A COCKPIT", size=11, color="white30", weight="bold"),
                ft.Container(height=25),
                # Botão do Google elegante
                ft.ElevatedButton(
                    "LOGAR COM O GOOGLE",
                    icon="login",
                    bgcolor="#1E60FF",
                    color="white",
                    width=260,
                    height=52,
                    on_click=lambda _: go_to_studio(),
                    style=ft.ButtonStyle(
                        shape=ft.RoundedRectangleBorder(radius=12)
                    )
                ),
                ft.Container(height=12),
                # Botão do Facebook
                ft.ElevatedButton(
                    "CONTINUAR COM FACEBOOK",
                    icon="facebook",
                    bgcolor="#1877F2",
                    color="white",
                    width=260,
                    height=52,
                    on_click=lambda _: go_to_studio(),
                    style=ft.ButtonStyle(
                        shape=ft.RoundedRectangleBorder(radius=12)
                    )
                ),
                ft.Container(height=50),
                ft.Text("DIREÇÃO DE ARTE IA", size=9, color="white10", weight="bold")
            ], alignment="center", horizontal_alignment="center", spacing=0),
            padding=20,
            bgcolor="#050505", # Vácuo escuro dentro do visor
            border_radius=25
        )

        smartphone_mockup_login = ft.Container(
            width=330,
            height=530,
            bgcolor="#0A0A0A",
            border_radius=35,
            border=ft.Border.all(1, "#1E60FF"),
            padding=15,
            content=ft.Stack([
                # Dynamic Notch (Ilha Dinâmica)
                ft.Container(
                    width=100,
                    height=20,
                    bgcolor="#000000",
                    border_radius=10,
                    top=0,
                    left=100, # Centralizado
                ),
                # Screen Canvas Area
                ft.Container(
                    content=smartphone_login_visor,
                    top=25,
                    left=0,
                    right=0,
                    bottom=0,
                    bgcolor="#000000",
                    border_radius=25,
                    alignment=ft.Alignment(0, 0),
                    border=ft.Border.all(1, "white10")
                )
            ])
        )

        # Container central com glows neon ao fundo
        center_area = ft.Container(
            expand=True,
            bgcolor="#050505",
            content=ft.Stack([
                # Glow Neon Azul ao Fundo
                ft.Container(
                    width=350, height=350,
                    bgcolor="#0D1E60FF",
                    border_radius=175,
                    blur=ft.Blur(100, 100),
                    left=150, top=90
                ),
                # Glow Neon Dourado sutil ao Fundo
                ft.Container(
                    width=250, height=250,
                    bgcolor="#0Dd4af37",
                    border_radius=125,
                    blur=ft.Blur(120, 120),
                    right=100, bottom=80
                ),
                # Smartphone perfeitamente centralizado fisicamente na tela cheia!
                ft.Container(
                    content=smartphone_mockup_login,
                    alignment=ft.Alignment(0, 0)
                )
            ])
        )

        return center_area

    # --- LÓGICA DO STORYBOARD (NAVEGAÇÃO DO PLAYER CENTRAL) ---
    # Removido on_storyboard_card_click (Conceito obsoleto de 4 cards eliminados em favor do Smartphone Player Central)

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
            
            # Mantém o slot ativo e volta para a tela do Storyboard!
            change_view("storyboard")
            
            # Executa a IA no plano de fundo para não travar
            threading.Thread(target=run_ai_analysis).start()
        else:
            # Se clicado fora do fluxo de seleção, apenas bota no simulador
            preview_media.src = src
            preview_media_container.content = preview_media
            page.update()

    # --- 1. CONSTRUÇÃO DA TELA: CREATIVE STUDIO (STORYBOARD / PLAYER INDIVIDUAL) ---
    def build_storyboard_view():
        nonlocal active_slot
        if active_slot is None:
            active_slot = 0
            
        has_media = storyboard_data[active_slot] is not None
        
        # Conteúdo do Smartphone
        if has_media:
            screen_content = ft.Image(src=storyboard_data[active_slot], expand=True, fit="cover", border_radius=25)
        else:
            screen_content = ft.Column([
                ft.IconButton(
                    icon="add_a_photo", 
                    icon_color="#d4af37", 
                    icon_size=48,
                    on_click=lambda _: change_view("almoxarifado")
                ),
                ft.Text("Vazio", color="white30", size=14, weight="bold"),
                ft.Text("Clique para inserir mídia do Almoxarifado", color="white10", size=10, text_align="center")
            ], alignment="center", horizontal_alignment="center", spacing=10)
            
        # Smartphone Mockup Premium com Notch e Borda Iluminada
        smartphone_player = ft.Container(
            width=330,
            height=530,
            bgcolor="#0A0A0A",
            border_radius=35,
            border=ft.Border.all(1, "#1E60FF"),
            padding=15,
            content=ft.Stack([
                # Dynamic Notch (Ilha Dinâmica)
                ft.Container(
                    width=100,
                    height=20,
                    bgcolor="#000000",
                    border_radius=10,
                    top=0,
                    left=100, # Centralizado
                ),
                # Screen Canvas Area
                ft.Container(
                    content=screen_content,
                    top=25,
                    left=0,
                    right=0,
                    bottom=0,
                    bgcolor="#000000",
                    border_radius=25,
                    alignment=ft.Alignment(0, 0),
                    border=ft.Border.all(1, "white10")
                )
            ])
        )
        
        # Controles de Navegação (Setas)
        def next_frame():
            nonlocal active_slot
            active_slot = (active_slot + 1) % 4
            change_view("storyboard")
            
        def prev_frame():
            nonlocal active_slot
            active_slot = (active_slot - 1) % 4
            change_view("storyboard")
            
        navigation_controls = ft.Row([
            ft.IconButton(icon="arrow_back_ios", icon_color="white", icon_size=18, on_click=lambda _: prev_frame()),
            ft.Container(
                content=ft.Text(f"⚡ FRAME {active_slot + 1} / 4", size=13, weight="bold", color="#d4af37"),
                bgcolor="white10",
                padding=ft.Padding.symmetric(horizontal=15, vertical=8),
                border_radius=10
            ),
            ft.IconButton(icon="arrow_forward_ios", icon_color="white", icon_size=18, on_click=lambda _: next_frame()),
        ], alignment="center", spacing=20)
        
        # Painel do Player (Coluna Esquerda) - Navegador em cima para alinhamento perfeito pela base!
        player_panel = ft.Column([
            navigation_controls,
            ft.Container(height=10),
            smartphone_player
        ], horizontal_alignment="center", spacing=0)

        # 1. Coluna Esquerda: O Header (Logo + Título "Direção de Arte" enxuto) e o Card-Legenda Verticalizado!
        left_side = ft.Column([
            ft.Row([
                ft.Image(src="/killer_skills_logo.png", height=70, fit="contain"),
                ft.Column([
                    ft.Text("Killer Skills", size=30, weight="bold"),
                    ft.Text("DIREÇÃO DE ARTE", color="#1E60FF", size=11, weight="bold")
                ], spacing=0)
            ], spacing=15, vertical_alignment="center"),
            ft.Divider(color="white10", height=15),
            
            ft.Text("LEGENDA E CAPTIONS", size=11, color="white30", weight="bold"),
            ft.Container(
                content=ft.Column([
                    txt_legenda, # O campo de texto se expande verticalmente
                    ft.Row([
                        ft.Container(expand=True), # Empurra o botão para a direita!
                        ft.Container(
                            content=ft.IconButton(icon="auto_awesome", icon_color="#1E60FF", on_click=run_ai_caption, icon_size=24),
                            bgcolor="#050505", border_radius=12, width=50, height=50, alignment=ft.Alignment(0, 0)
                        )
                    ], spacing=10)
                ], expand=True, spacing=15),
                padding=15,
                bgcolor="#0A0A0A",
                border_radius=15,
                border=ft.Border.all(1, "white10"),
                expand=True
            )
        ], width=290, spacing=15)

        # 2. Coluna Central: O Smartphone Player 3D (Desceu um pouco para dar ar ao logo e centralizado!)
        center_side = ft.Container(
            content=player_panel,
            alignment=ft.Alignment(0, 0),
            padding=ft.Padding.only(top=10), # Calibragem milimétrica para alinhamento perfeito na base!
            width=330
        )

        # 3. Coluna Direita: Diretrizes da Coleção, Selecionar Canal e Botão PREVIEW enxuto!
        right_side = ft.Column([
            ft.Text("DIRETRIZES DA COLEÇÃO", size=11, color="white30", weight="bold"),
            ft.Row([
                ft.Text("Coleção Ativa:", size=12, color="white70"),
                ft.Container(
                    padding=ft.Padding.symmetric(horizontal=12, vertical=6),
                    bgcolor="#1E60FF", border_radius=8,
                    content=ft.Text(f"@{account_dropdown.value}", size=12, weight="bold", color="white")
                )
            ], alignment="start", vertical_alignment="center"),
            ft.Divider(color="white10", height=15),
            
            ft.Text("SELECIONAR CANAL", size=11, color="white30", weight="bold"),
            account_dropdown,
            ft.Divider(color="white10", height=30),
            
            ft.Container(expand=True), # Empurra o botão de Preview para o rodapé
            
            # Botão de Preview enxuto ("PREVIEW") com largura proporcional de 290px
            ft.ElevatedButton(
                "PREVIEW", bgcolor="#1E60FF", color="white", 
                height=55, width=290, on_click=lambda _: change_view("preview"),
                icon="mobile_screen_share"
            )
        ], width=290, spacing=15)

        return ft.Stack([
            # Coluna Central: Smartphone Player perfeitamente centralizado fisicamente na tela inteira!
            ft.Container(
                content=player_panel,
                alignment=ft.Alignment(0, 0),
                width=330,
            ),
            # Coluna Esquerda: Legenda e Captons posicionados à esquerda (deslocado da sidebar!)
            ft.Container(
                content=left_side,
                left=30, # Ajustado de 290 para 30 (Row do layout cuida do offset da sidebar)
                top=40,
                bottom=40,
                width=280
            ),
            # Coluna Direita: Diretrizes da Coleção posicionadas à direita!
            ft.Container(
                content=right_side,
                right=30, # Ajustado de 40 para 30
                top=40,
                bottom=40,
                width=280
            )
        ], expand=True)

    # --- 2. CONSTRUÇÃO DA TELA: ALMOXARIFADO (BIBLIOTECA DE MÍDIA) ---
    def build_almoxarifado_view():
        media_sources = seed_images.copy()
        
        if os.path.exists(ASSETS_DIR):
            for f in os.listdir(ASSETS_DIR):
                if f.lower().endswith((".png", ".jpg", ".jpeg", ".webp")):
                    media_sources.append(f"/{f}")

        # Monta a galeria em Grid
        grid_controls = []
        for src in media_sources:
            btn_inserir = ft.Container(
                content=ft.Text(f"📥 Inserir no Frame {active_slot + 1}", size=9, weight="bold", color="white"),
                bgcolor="#1E60FF", border_radius=8, padding=6,
                alignment=ft.Alignment(0, 0), data=src, on_click=select_and_insert_media
            ) if active_slot is not None else ft.Container(
                content=ft.Text("Visualizar no Feed", size=8, color="white70"),
                bgcolor="white10", border_radius=8, padding=4,
                alignment=ft.Alignment(0, 0), data=src, on_click=select_and_insert_media
            )

            grid_controls.append(
                ft.Container(
                    content=ft.Column([
                        ft.Image(src=src, width=130, height=130, fit="cover", border_radius=10),
                        ft.Container(height=5),
                        btn_inserir
                    ], alignment="center", horizontal_alignment="center"),
                    padding=10, bgcolor="#0A0A0A", border_radius=15,
                    border=ft.Border.all(1, "white10"),
                    width=150, height=190
                )
            )

        # Banner informativo se estiver selecionando para um Frame
        banner_selecao = ft.Container(
            padding=15, bgcolor="#1E60FF", border_radius=12,
            content=ft.Row([
                ft.Icon("info_outline", color="white"),
                ft.Text(f"SELECIONANDO MÍDIA PARA O FRAME {active_slot + 1} DA CAMPANHA", weight="bold", size=13),
                ft.Container(expand=True),
                ft.TextButton("Cancelar e Voltar", icon="close", icon_color="white", on_click=lambda _: cancel_selection())
            ])
        ) if active_slot is not None else ft.Container()

        def cancel_selection():
            nonlocal active_slot
            active_slot = None
            change_view("storyboard")

        return ft.Container(
            expand=True, padding=40, bgcolor="#000000",
            content=ft.Column([
                ft.Row([
                    ft.Column([
                        ft.Text("📁 Almoxarifado Central", size=36, weight="bold"),
                        ft.Text("GERENCIADOR DE COLEÇÕES E ATIVOS VISUAIS", color="#1E60FF", size=11, weight="bold")
                    ]),
                    ft.ElevatedButton("Fazer Upload", icon="add_to_photos", on_click=lambda _: picker.pick_files(allow_multiple=True))
                ], alignment="spaceBetween"),
                ft.Divider(color="white10", height=30),
                
                banner_selecao,
                ft.Container(height=10),
                
                ft.Text("MÍDIAS DISPONÍVEIS NA COLEÇÃO", size=11, color="white30", weight="bold"),
                ft.Row(grid_controls, wrap=True, spacing=15, scroll="auto")
            ], scroll="auto")
        )

    # --- 3. CONSTRUÇÃO DA TELA: PREVIEW & SIMULADOR INSTAGRAM (TOTALMENTE ESPAÇOSA) ---
    def build_preview_view():
        return ft.Container(
            expand=True, padding=40, bgcolor="#000000",
            content=ft.Column([
                ft.Row([
                    ft.Column([
                        ft.Text("📱 Simulador & Fila", size=36, weight="bold"),
                        ft.Text("PREVIEW 1:1 E AGENDAMENTO DE PUBLICIDADE", color="#1E60FF", size=11, weight="bold")
                    ]),
                    ft.ElevatedButton("Voltar para o Studio", icon="edit", on_click=lambda _: change_view("storyboard"))
                ], alignment="spaceBetween"),
                ft.Divider(color="white10", height=30),
                
                # Duas colunas espaçosas centralizadas na tela!
                ft.Row([
                    # Coluna Esquerda: O Celular Simulador
                    ft.Container(
                        width=380, padding=25, bgcolor="#0A0A0A", border_radius=20,
                        border=ft.Border.all(1, "white10"),
                        content=ft.Column([
                            ft.Text("SIMULAÇÃO DE POST MÓVEL", size=11, color="white30", weight="bold"),
                            ft.Container(
                                padding=12, bgcolor="#000000", border_radius=15,
                                border=ft.Border.all(1, "white10"),
                                content=ft.Column([
                                    # Header do Post
                                    ft.Row([
                                        ft.Container(
                                            content=preview_avatar_text,
                                            width=28, height=28, bgcolor="#C5A880", border_radius=14, alignment=ft.Alignment(0, 0)
                                        ),
                                        ft.Column([
                                            preview_username_top,
                                            ft.Text("Vitória, ES", size=8, color="white30")
                                        ], spacing=0),
                                        ft.Container(expand=True),
                                        ft.Icon("more_horiz", color="white", size=16)
                                    ], alignment="center"),
                                    
                                    # Media Display
                                    preview_media_container,
                                    
                                    # Action Bar
                                    ft.Row([
                                        ft.Icon("favorite_border", color="white", size=16),
                                        ft.Icon("chat_bubble_outline", color="white", size=16),
                                        ft.Icon("send", color="white", size=16),
                                        ft.Container(expand=True),
                                        ft.Icon("bookmark_border", color="white", size=16)
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
                        ], spacing=10)
                    ),
                    
                    # Coluna Direita: Painel IA e Agendamento
                    ft.Container(
                        expand=True, padding=30, bgcolor="#0A0A0A", border_radius=20,
                        border=ft.Border.all(1, "white10"),
                        content=ft.Column([
                            ft.Text("INSIGHTS DO CO-DIRETOR IA", size=11, color="white30", weight="bold"),
                            ft.Container(
                                padding=20, bgcolor="#05FFFFFF",
                                border_radius=15, border=ft.Border.all(1, "#0DFFFFFF"),
                                content=ai_insight_text,
                                min_height=140,
                            ),
                            ft.Divider(color="white10", height=25),
                            
                            ft.Text("STATUS DE PUBLICAÇÃO", size=11, color="white30", weight="bold"),
                            ft.Row([
                                ft.Icon("cell_tower", color="green"),
                                ft.Text("Pronto para Autopublicação VPS", size=13, color="white70")
                            ]),
                            ft.Container(height=20),
                            
                            ft.ElevatedButton(
                                "APROVAR E AGENDAR CAMPANHA", bgcolor="#1E60FF", color="white", 
                                height=60, width=360, on_click=lambda _: agendar_save()
                            )
                        ], spacing=15)
                    )
                ], spacing=40, alignment="start", vertical_alignment="start")
            ], scroll="auto")
        )

    # --- 4. CONSTRUÇÃO DA TELA: COLEÇÕES / CLIENTES ---
    def build_colecoes_view():
        return ft.Container(
            expand=True, padding=40, bgcolor="#000000",
            content=ft.Column([
                ft.Text("💼 Gestão de Coleções", size=36, weight="bold"),
                ft.Text("CLIENTES E CONTAS CONECTADAS NO VPS", color="#1E60FF", size=11, weight="bold"),
                ft.Divider(color="white10", height=30),
                
                ft.Text("CLIENTES ATIVOS (ESTILO COLOÇÕES FIRESTORE)", size=11, color="white30", weight="bold"),
                ft.Row([
                    ft.Container(
                        width=320, padding=25, bgcolor="#0A0A0A", border_radius=15,
                        border=ft.Border.all(1, "#1E60FF"),
                        content=ft.Column([
                            ft.Row([
                                ft.Icon("business", color="#1E60FF", size=32),
                                ft.Column([
                                    ft.Text("Scalla Records", size=18, weight="bold"),
                                    ft.Text("Sua Conta Master", size=10, color="white30")
                                ], spacing=0)
                            ], spacing=15),
                            ft.Divider(color="white10", height=15),
                            ft.Text("03 Contas de Instagram vinculadas no VPS.", size=12, color="white70"),
                            ft.Container(height=10),
                            ft.ElevatedButton("Configurar Canais", width=200, bgcolor="white10", color="white")
                        ])
                    ),
                    ft.Container(
                        width=320, padding=25, bgcolor="#0A0A0A", border_radius=15,
                        border=ft.Border.all(1, "white10"),
                        content=ft.Column([
                            ft.Row([
                                ft.Icon("add", color="white30", size=32),
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

    def exit_admin_mode():
        nonlocal is_admin_mode
        is_admin_mode = False
        change_view("storyboard")

    def try_open_admin_portal():
        ADMIN_EMAILS = ["artz.genera@gmail.com"]
        if is_logged_in:
            if logged_in_user_email in ADMIN_EMAILS:
                nonlocal is_admin_mode
                is_admin_mode = True
                change_view("admin_constructor")
                show_snack("🔓 Painel de Administração Liberado!", "#d4af37")
            else:
                dialog_pro = ft.AlertDialog(
                    bgcolor="#0F111A",
                    shape=ft.RoundedRectangleBorder(radius=15),
                    content=ft.Container(
                        width=380, height=310, padding=10,
                        content=ft.Column([
                            ft.Row([
                                ft.Icon("lock_person", color="#d4af37", size=32),
                                ft.Text("Recurso Restrito Pro", size=18, weight="bold", color="white")
                            ], alignment="center", spacing=10),
                            ft.Divider(color="white10", height=15),
                            ft.Text(
                                "O Construtor de Prompts e os Agentes Autônomos de Infraestrutura estão disponíveis apenas para administradores e contas homologadas no plano Enterprise.",
                                size=11, color="white70", text_align="center"
                            ),
                            ft.Text(
                                f"Sua conta ativa ({logged_in_user_email}) não possui privilégios de Engenharia.",
                                size=10, color="#d4af37", italic=True, text_align="center"
                            ),
                            ft.Container(height=10),
                            ft.ElevatedButton(
                                "Falar com Consultor (Fazer Upgrade)",
                                icon="contact_support",
                                bgcolor="#d4af37",
                                color="#0F111A",
                                width=300,
                                height=45,
                                on_click=lambda _: [show_snack("📞 Solicitação enviada! Um arquiteto entrará em contato.", "#d4af37"), setattr(dialog_pro, "open", False), page.update()]
                            )
                        ], horizontal_alignment="center", spacing=10)
                    )
                )
                page.overlay.append(dialog_pro)
                dialog_pro.open = True
                page.update()
        else:
            open_google_login_dialog(from_saas_gate=False)

    def open_google_login_dialog(from_saas_gate=False):
        client_id = os.getenv("GOOGLE_CLIENT_ID")
        client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
        
        # Handler do login real do Flet OAuth
        def on_flet_login(e):
            nonlocal is_admin_mode, is_logged_in, logged_in_user_email
            if e.error:
                show_snack(f"❌ Erro de Autenticação Real: {e.error}", "red")
            else:
                user_email = page.auth.user.email if page.auth and page.auth.user else "desconhecido"
                is_logged_in = True
                logged_in_user_email = user_email
                dialog.open = False
                
                if from_saas_gate:
                    go_to_studio()
                    show_snack(f"👋 Bem-vindo ao Killer Skills, {user_email}!", "#1E60FF")
                else:
                    is_admin_mode = True
                    change_view("admin_constructor")
                    show_snack(f"🔓 Acesso Administrativo Liberado para {user_email} via Google OAuth!", "#d4af37")
                page.update()

        page.on_login = on_flet_login

        loading_bar = ft.ProgressBar(width=320, color="#d4af37", visible=False)
        loading_text = ft.Text("Autenticando credenciais do Google...", size=11, color="#d4af37", visible=False)
        
        txt_custom_email = ft.TextField(
            label="Ou digite outra conta de e-mail...",
            border_color="#d4af37",
            bgcolor="#000000",
            text_size=12,
            height=45,
            content_padding=10
        )
        
        def trigger_google_auth_sequence(custom_email=None):
            if client_id and client_secret:
                try:
                    from flet.auth.providers.google_oauth_provider import GoogleAuthProvider
                    provider = GoogleAuthProvider(
                        client_id=client_id,
                        client_secret=client_secret,
                        redirect_url="http://localhost:8550/oauth_callback"
                    )
                    dialog.open = False
                    page.update()
                    page.login(provider)
                    return
                except Exception as ex:
                    print(f"Erro ao inicializar Google OAuth Real: {ex}")

            # Fallback para Simulação de Alta Fidelidade
            loading_bar.visible = True
            loading_text.visible = True
            page.update()
            
            target_email = custom_email if custom_email else "artz.genera@gmail.com"
            if txt_custom_email.value.strip() and not custom_email:
                target_email = txt_custom_email.value.strip()

            import time
            def run_auth():
                time.sleep(1.5)
                nonlocal is_admin_mode, is_logged_in, logged_in_user_email
                is_logged_in = True
                logged_in_user_email = target_email
                dialog.open = False
                
                if from_saas_gate:
                    go_to_studio()
                    show_snack(f"👋 Bem-vindo ao Killer Skills, {target_email}!", "#1E60FF")
                else:
                    is_admin_mode = True
                    change_view("admin_constructor")
                    show_snack(f"🔓 Acesso Administrativo Liberado para {target_email}!", "#d4af37")
                page.update()
                
            threading.Thread(target=run_auth).start()

        dialog = ft.AlertDialog(
            bgcolor="#050505",
            shape=ft.RoundedRectangleBorder(radius=15),
            content=ft.Container(
                width=380, height=420, padding=10,
                content=ft.Column([
                    ft.Row([
                        ft.Image(src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg", width=24, height=24),
                        ft.Text("Fazer login com o Google", size=16, weight="bold", color="white")
                    ], alignment="center", spacing=10),
                    ft.Text("Escolha uma conta ou digite seu e-mail para prosseguir para o Painel ADM", size=10, color="white30", text_align="center"),
                    ft.Divider(color="white10", height=15),
                    
                    ft.Container(
                        content=ft.Row([
                            ft.Container(
                                content=ft.Text("AG", size=12, weight="bold", color="white"),
                                width=32, height=32, bgcolor="#d4af37", border_radius=16, alignment=ft.Alignment(0, 0)
                            ),
                            ft.Column([
                                ft.Text("Artz Genera", size=13, weight="bold", color="white"),
                                ft.Text("artz.genera@gmail.com", size=11, color="white30")
                            ], spacing=0)
                        ], spacing=12),
                        padding=10, border_radius=10, bgcolor="#0F0F12", border=ft.Border.all(1, "white10"),
                        on_click=lambda _: trigger_google_auth_sequence("artz.genera@gmail.com")
                    ),
                    ft.Container(height=5),
                    ft.Container(
                        content=ft.Row([
                            ft.Container(
                                content=ft.Text("SK", size=12, weight="bold", color="white"),
                                width=32, height=32, bgcolor="#1E60FF", border_radius=16, alignment=ft.Alignment(0, 0)
                            ),
                            ft.Column([
                                ft.Text("Sinkando", size=13, weight="bold", color="white"),
                                ft.Text("sinkando@gmail.com", size=11, color="white30")
                            ], spacing=0)
                        ], spacing=12),
                        padding=10, border_radius=10, bgcolor="#0F0F12", border=ft.Border.all(1, "white10"),
                        on_click=lambda _: trigger_google_auth_sequence("sinkando@gmail.com")
                    ),
                    ft.Container(height=5),
                    ft.Row([
                        txt_custom_email,
                        ft.IconButton(
                            icon="arrow_forward",
                            icon_color="#d4af37",
                            bgcolor="#1E60FF",
                            icon_size=18,
                            on_click=lambda _: trigger_google_auth_sequence()
                        )
                    ], spacing=10, alignment="center"),
                    ft.Container(height=5),
                    loading_bar,
                    loading_text
                ], horizontal_alignment="center", spacing=10)
            )
        )

        page.dialog = dialog
        dialog.open = True
        page.update()

    def build_admin_console_view():
        return ft.Container(
            expand=True, padding=40, bgcolor="#000000",
            content=ft.Column([
                ft.Text("🖥️ Console de Infraestrutura ADM", size=36, weight="bold"),
                ft.Text("ESTADO DO BANCO DE DADOS E INFRA ESTRUTURA VPS", color="#d4af37", size=11, weight="bold"),
                ft.Divider(color="white10", height=30),
                
                ft.Row([
                    ft.Container(
                        width=320, padding=25, bgcolor="#0A0A0A", border_radius=15,
                        border=ft.Border.all(1, "#2c2c2c"),
                        content=ft.Column([
                            ft.Row([
                                ft.Icon("storage", color="#d4af37", size=24),
                                ft.Text("Banco SQLite", size=16, weight="bold")
                            ], spacing=10),
                            ft.Divider(color="white10", height=10),
                            ft.Text("Banco de Dados: killer_skills.db", size=12, color="white70"),
                            ft.Row([
                                ft.Container(width=8, height=8, bgcolor="green", border_radius=4),
                                ft.Text("Conexão ativa & estável", size=11, color="green")
                            ], spacing=8),
                        ], spacing=12)
                    ),
                    ft.Container(
                        width=320, padding=25, bgcolor="#0A0A0A", border_radius=15,
                        border=ft.Border.all(1, "#2c2c2c"),
                        content=ft.Column([
                            ft.Row([
                                ft.Icon("memory", color="#d4af37", size=24),
                                ft.Text("Processos PM2", size=16, weight="bold")
                            ], spacing=10),
                            ft.Divider(color="white10", height=10),
                            ft.Text("Servidor: background_worker.py", size=12, color="white70"),
                            ft.Row([
                                ft.Container(width=8, height=8, bgcolor="green", border_radius=4),
                                ft.Text("ONLINE (Status: active)", size=11, color="green")
                            ], spacing=8),
                        ], spacing=12)
                    )
                ], spacing=25)
            ], scroll="auto")
        )

    # --- 6. CONSTRUÇÃO DA TELA: SERVIÇOS DISPONÍVEIS (TELA 1) ---
    def build_servicos_view():
        nonlocal selected_persona_idx, micro_services_state

        # 12 Personas da Categoria Pessoal (Identidade & Prestígio)
        pessoal_data = [
            {"title": "Intelectual / Culto", "subtitle": "Erudição & Sobriedade", "desc": "Ideias profundas, referências históricas e artísticas em um tom culto de autoridade intelectual.", "icon": "menu_book", "color": "#1E60FF", "tag": "Pessoal"},
            {"title": "Criativo / Disruptivo", "subtitle": "Ousadia & Inovação", "desc": "Quebra de padrões tradicionais, originalidade extrema e linguagem altamente autêntica.", "icon": "auto_awesome", "color": "#E91E63", "tag": "Pessoal"},
            {"title": "Autoridade / Líder", "subtitle": "Assertividade & Inspiração", "desc": "Compartilhamento de marcos profissionais (milestones) e tom inspirador de liderança.", "icon": "workspace_premium", "color": "#d4af37", "tag": "Pessoal"},
            {"title": "Carismático / Empático", "subtitle": "Conexão Humana & Leveza", "desc": "Histórias cotidianas do dia a dia (life stories), empatia e tom altamente conversacional.", "icon": "favorite", "color": "#FF5722", "tag": "Pessoal"},
            {"title": "Narcisista / Estético", "subtitle": "Luxo & Impacto Visual", "desc": "Estética cinematográfica, sofisticação de alto padrão e enquadramentos de luxo absoluto.", "icon": "diamond", "color": "#E040FB", "tag": "Pessoal"},
            {"title": "Mentor / Educador", "subtitle": "Valor Didático & Tutoriais", "desc": "Geração de valor prático, compartilhamento de conhecimento e tutoriais passo a passo.", "icon": "school", "color": "#00E676", "tag": "Pessoal"},
            {"title": "Visionário / Futurista", "subtitle": "Tecnologia & Tendências", "desc": "Análise de tendências tecnológicas, inovações disruptivas e otimismo com o futuro.", "icon": "psychology", "color": "#00BCD4", "tag": "Pessoal"},
            {"title": "Pragmático / Direto", "subtitle": "Minimalismo & Foco", "desc": "Linguagem cirúrgica, produtividade máxima e comunicação direta ao ponto sem rodeios.", "icon": "flash_on", "color": "#FFEB3B", "tag": "Pessoal"},
            {"title": "Lifestyle / Aventureiro", "subtitle": "Liberdade & Bastidores", "desc": "Liberdade geográfica, flexibilidade, bastidores de viagens e rotina dinâmica ao ar livre.", "icon": "explore", "color": "#8BC34A", "tag": "Pessoal"},
            {"title": "Humanitário / Propósito", "subtitle": "Valores & Impacto Social", "desc": "Causas sociais, ecologia, legado humanitário e atitudes alinhadas com princípios nobres.", "icon": "public", "color": "#4CAF50", "tag": "Pessoal"},
            {"title": "Especialista Técnico", "subtitle": "Precisão & Credibilidade", "desc": "Precisão metodológica, jargão profissional, gráficos técnicos e alta autoridade acadêmica.", "icon": "science", "color": "#9C27B0", "tag": "Pessoal"},
            {"title": "Conectado / Pop", "subtitle": "Humor Fino & Tendências", "desc": "Memes inteligentes, sintonia rápida com as conversas do momento e linguagem super descontraída.", "icon": "forum", "color": "#FFC107", "tag": "Pessoal"},
        ]

        # 12 Serviços da Categoria Profissional (Consistência & Mercado)
        profissional_data = [
            {"title": "Institucional / Estúdio", "subtitle": "Autoridade Artística & Estúdio", "desc": "Portfólio de alto padrão e produções de bastidores premium (ideal para a Scalla Records).", "icon": "business", "color": "#1E60FF", "tag": "Profissional"},
            {"title": "Profissional Liberal / Especialista", "subtitle": "Credibilidade & Segurança", "desc": "Conformidade ética, segurança profissional e alta conversão para agendamentos e consultas.", "icon": "medical_services", "color": "#00E676", "tag": "Profissional"},
            {"title": "Agência Criativa / Branding", "subtitle": "Sofisticação Visual & Luxo", "desc": "Posicionamento estético de altíssimo nível para atrair clientes premium e valorizar a arte.", "icon": "palette", "color": "#d4af37", "tag": "Profissional"},
            {"title": "Agência de Performance / Tráfego", "subtitle": "Métricas, ROI & Leads", "desc": "Foco absoluto em funis de marketing, captação ágil de clientes em escala e métricas de vendas.", "icon": "trending_up", "color": "#00E676", "tag": "Profissional"},
            {"title": "Infoprodutor / Educador Digital", "subtitle": "Lançamentos & Comuniade", "desc": "Estratégia de lançamento de cursos digitais, captação de alunos e autoridade comunitária.", "icon": "cast_for_education", "color": "#E91E63", "tag": "Profissional"},
            {"title": "E-commerce / Loja Virtual", "subtitle": "Catálogos & Provas Sociais", "desc": "Visualização atrativa de produtos físicos, unboxing, novidades de catálogo e avaliações.", "icon": "shopping_bag", "color": "#FF9800", "tag": "Profissional"},
            {"title": "Comércio Local / Varejo", "subtitle": "Atendimento & Ofertas do Dia", "desc": "Atração regional, ofertas locais, endereço físico, atendimento humano e horários.", "icon": "storefront", "color": "#00BCD4", "tag": "Profissional"},
            {"title": "Prestador de Serviços / Freelancer", "subtitle": "Portfólios & Orçamentos", "desc": "Apresentação prática de trabalhos anteriores, simplificação de orçamentos e depoimentos.", "icon": "design_services", "color": "#9E9E9E", "tag": "Profissional"},
            {"title": "Corporativo / B2B", "subtitle": "Comunicação de Alto Nível", "desc": "Estudos de caso (case studies), tom formal e relacionamento estratégico com executivos.", "icon": "handshake", "color": "#607D8B", "tag": "Profissional"},
            {"title": "Portal de Notícias / Curador", "subtitle": "Notícias & Curadoria Rápida", "desc": "Alto volume de postagens informativas diárias, compilações rápidas e notícias de última hora.", "icon": "feed", "color": "#F44336", "tag": "Profissional"},
            {"title": "Empreendedor / Fundador", "subtitle": "Bastidores & Cultura da Marca", "desc": "Liderança humana, cultura da empresa e o lado humano dos bastidores da construção de marca.", "icon": "rocket_launch", "color": "#FFEB3B", "tag": "Profissional"},
            {"title": "Euquipe / Solopreneur", "subtitle": "Otimização & Bastidores Reais", "desc": "Produtividade máxima com tempo restrito, rotina sem filtros e venda direta simplificada.", "icon": "self_improvement", "color": "#795548", "tag": "Profissional"},
        ]

        all_personas = pessoal_data + profissional_data
        
        # Garante limites seguros de índice
        if selected_persona_idx < 0 or selected_persona_idx >= len(all_personas):
            selected_persona_idx = 0
            
        persona = all_personas[selected_persona_idx]
        p_title = persona["title"]
        p_subtitle = persona["subtitle"]
        p_desc = persona["desc"]
        p_color = persona["color"]
        p_tag = persona["tag"]

        # 1. Coluna Esquerda: Dossiê Estratégico AI
        left_side = ft.Column([
            ft.Text("🔍 DOSSIÊ DA PERSONA", size=11, color="white30", weight="bold"),
            ft.Container(
                content=ft.Column([
                    ft.Row([
                        ft.Container(
                            content=ft.Icon(persona["icon"], color=p_color, size=24),
                            bgcolor="white10",
                            padding=8,
                            border_radius=8
                        ),
                        ft.Column([
                            ft.Text(p_title, size=18, weight="bold", color="white"),
                            ft.Text(p_tag.upper(), size=9, weight="bold", color=p_color)
                        ], spacing=0)
                    ], spacing=10),
                    ft.Divider(color="white10", height=15),
                    
                    ft.Text("DIRETRIZE ESTRATÉGICA", size=10, color="white30", weight="bold"),
                    ft.Text(p_subtitle, size=12, color="white", weight="w500"),
                    ft.Container(height=5),
                    ft.Text(p_desc, size=11, color="white60"),
                    
                    ft.Divider(color="white10", height=15),
                    ft.Text("MÉTRICAS ESTIMADAS AI", size=10, color="white30", weight="bold"),
                    ft.Row([
                        ft.Column([
                            ft.Text("Taxa de Retenção", size=9, color="white30"),
                            ft.Text("89.4%" if p_tag == "Pessoal" else "93.1%", size=14, weight="bold", color=p_color)
                        ], spacing=2),
                        ft.Container(expand=True),
                        ft.Column([
                            ft.Text("Engajamento Médio", size=9, color="white30"),
                            ft.Text("7.8x" if p_tag == "Pessoal" else "9.2x", size=14, weight="bold", color=p_color)
                        ], spacing=2),
                    ])
                ], spacing=12),
                padding=20,
                bgcolor="#0A0A0A",
                border_radius=15,
                border=ft.Border.all(1, "white10"),
                expand=True
            )
        ], width=280, spacing=15)

        # 3. Coluna Direita: A Forja (Ordem de Serviço)
        def get_manifest_yaml():
            legendas_label = "Legendas Didáticas" if p_tag == "Pessoal" else "Legendas Corporativas"
            yaml_text = f"""---
ORDEM_DE_SERVICO:
  ID: "OS-2026-KS-{p_title[:4].upper()}"
  TIMESTAMP: "{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
  
  AGENTE_ATIVADO:
    NOME: "{p_title}"
    CATEGORIA: "{p_tag}"
    STATUS: "CONVOCADO"
  
  MICRO_SERVICOS_SOLICITADOS:
    - {legendas_label}: {"ATIVO 🟢" if micro_services_state["legendas"] else "INATIVO 🔴"}
    - Roteiro de Carrossel: {"ATIVO 🟢" if micro_services_state["roteiro"] else "INATIVO 🔴"}
    - Compressor WebP: {"ATIVO 🟢" if micro_services_state["webp"] else "INATIVO 🔴"}
    - Vídeo Generativo AI: {"ATIVO 🟢" if micro_services_state["video"] else "INATIVO 🔴"}
  
  ORQUESTRADOR: "Central-AI-v4"
  STATUS_ORDEM: "PRONTO_PARA_FORJA"
---"""
            return yaml_text

        right_side = ft.Column([
            ft.Text("🛠️ A FORJA: ORDEM DE SERVIÇO", size=11, color="white30", weight="bold"),
            ft.Container(
                content=ft.Column([
                    ft.Text("CONFIGURAÇÃO EM TEMPO REAL", size=9, color="#d4af37", weight="bold"),
                    ft.Container(
                        content=ft.Text(
                            get_manifest_yaml(),
                            size=10,
                            font_family="monospace",
                            color="#8A95A5"
                        ),
                        bgcolor="#050507",
                        padding=15,
                        border_radius=10,
                        border=ft.Border.all(1, "white10"),
                        expand=True
                    ),
                    ft.Container(height=5),
                    ft.Text(
                        "Os microsserviços selecionados no celular atualizam a forja de prompts e pipelines em tempo real.",
                        size=9,
                        color="white30",
                        text_align="center"
                    )
                ], spacing=10, expand=True),
                padding=20,
                bgcolor="#0A0A0A",
                border_radius=15,
                border=ft.Border.all(1, "white10"),
                expand=True
            )
        ], width=280, spacing=15)

        # 2. O Celular Central (Física do Instagram)
        def scroll_persona(direction):
            nonlocal selected_persona_idx
            if direction == "up":
                selected_persona_idx = (selected_persona_idx - 1) % 24
            else:
                selected_persona_idx = (selected_persona_idx + 1) % 24
            change_view("servicos")

        def toggle_ms(k):
            micro_services_state[k] = not micro_services_state[k]
            change_view("servicos")

        legendas_label = "Legendas Didáticas" if p_tag == "Pessoal" else "Legendas Corporativas"
        micro_services = [
            {"key": "legendas", "title": legendas_label, "icon": "edit_note"},
            {"key": "roteiro", "title": "Roteiro Carrossel", "icon": "auto_stories"},
            {"key": "webp", "title": "Compressor WebP", "icon": "photo_size_select_large"},
            {"key": "video", "title": "Vídeo AI", "icon": "movie_creation"}
        ]

        ms_cards = []
        for ms in micro_services:
            key = ms["key"]
            is_active = micro_services_state[key]
            ms_cards.append(
                ft.Container(
                    width=110,
                    height=100,
                    bgcolor="#141416" if is_active else "#09090A",
                    border=ft.Border.all(1.5, p_color if is_active else "white10"),
                    border_radius=12,
                    padding=10,
                    on_click=lambda _, k=key: toggle_ms(k),
                    content=ft.Column([
                        ft.Row([
                            ft.Icon(ms["icon"], color=p_color if is_active else "white30", size=18),
                            ft.Container(expand=True),
                            ft.Icon("check_circle" if is_active else "radio_button_unchecked", color=p_color if is_active else "white10", size=12)
                        ], alignment="spaceBetween"),
                        ft.Container(height=4),
                        ft.Text(ms["title"], size=9, weight="bold", color="white" if is_active else "white30", max_lines=2, overflow=ft.TextOverflow.ELLIPSIS),
                        ft.Container(height=2),
                        ft.Text("ATIVADO" if is_active else "DESATIVADO", size=7, weight="bold", color=p_color if is_active else "white20")
                    ], spacing=0)
                )
            )

        def forge_work_order():
            progress_bar = ft.ProgressBar(width=320, color="#d4af37")
            dialog_forge = ft.AlertDialog(
                bgcolor="#050507",
                shape=ft.RoundedRectangleBorder(radius=15),
                content=ft.Container(
                    width=380, height=200, padding=10,
                    content=ft.Column([
                        ft.Icon("auto_awesome", color="#d4af37", size=36),
                        ft.Text("A Forja está ativada...", size=16, weight="bold", color="white"),
                        ft.Text("ORQUESTRADOR CENTRAL ASSIMILANDO AGENTE...", size=9, color="#1E60FF", weight="bold"),
                        ft.Container(height=10),
                        progress_bar
                    ], horizontal_alignment="center", spacing=10)
                )
            )
            page.overlay.append(dialog_forge)
            dialog_forge.open = True
            page.update()
            
            import time
            def run_forge():
                time.sleep(2.0)
                dialog_forge.open = False
                page.update()
                show_snack(f"🚀 Ordem de Serviço OS-2026-KS-{p_title[:4].upper()} enviada ao Orquestrador Central!", "#d4af37")
                change_view("storyboard")
                
            threading.Thread(target=run_forge).start()

        visor_content = ft.Container(
            expand=True,
            padding=ft.Padding.only(top=15, left=15, right=15, bottom=15),
            bgcolor="#050505",
            content=ft.Column([
                # Header
                ft.Row([
                    ft.Container(
                        content=ft.Text(p_tag.upper(), size=8, weight="bold", color="black"),
                        bgcolor=p_color,
                        padding=ft.Padding.symmetric(horizontal=8, vertical=3),
                        border_radius=8
                    ),
                    ft.Container(expand=True),
                    ft.Text(f"{selected_persona_idx + 1:02d} / 24", size=9, color="white30", weight="bold")
                ], alignment="spaceBetween"),
                
                ft.Container(height=12),
                
                # Reels Drag Area with Navigation Overlay
                ft.Container(
                    expand=True,
                    content=ft.Stack([
                        ft.Container(
                            content=ft.Column([
                                ft.Row([
                                    ft.Container(
                                        content=ft.Icon(persona["icon"], color=p_color, size=24),
                                        bgcolor="white10",
                                        padding=8,
                                        border_radius=10
                                    ),
                                    ft.Column([
                                        ft.Text(p_title, size=15, weight="bold", color="white"),
                                        ft.Text("Agente de Posicionamento", size=9, color="white30")
                                    ], spacing=0)
                                ], spacing=10),
                                
                                ft.Container(height=8),
                                
                                ft.Container(
                                    content=ft.Column([
                                        ft.Text(p_subtitle, size=11, weight="bold", color=p_color),
                                        ft.Container(height=4),
                                        ft.Text(p_desc, size=9.5, color="white60", max_lines=4, overflow=ft.TextOverflow.ELLIPSIS)
                                    ], spacing=0),
                                    bgcolor="#0A0A0C",
                                    padding=10,
                                    border_radius=10,
                                    border=ft.Border.all(1, "white10")
                                ),
                                
                                ft.Container(height=10),
                                
                                ft.Text("🎛️ MICRO-SERVIÇOS DE ELITE (SWIPE)", size=8, color="white30", weight="bold"),
                                ft.Container(
                                    content=ft.Row(ms_cards, scroll="always", spacing=8),
                                    height=110,
                                    clip_behavior=ft.ClipBehavior.ANTI_ALIAS
                                )
                            ], spacing=0, scroll="auto")
                        ),
                        
                        # Reel navigation overlay on the right side of the visor
                        ft.Column([
                            ft.IconButton(icon="arrow_upward", icon_color="white", icon_size=20, bgcolor="black87", on_click=lambda _: scroll_persona("up")),
                            ft.Container(height=5),
                            ft.IconButton(icon="arrow_downward", icon_color="white", icon_size=20, bgcolor="black87", on_click=lambda _: scroll_persona("down")),
                        ], alignment="center", right=0, top=60)
                    ])
                ),
                
                ft.Container(height=10),
                
                ft.ElevatedButton(
                    "FORJAR ORDEM DE SERVIÇO",
                    bgcolor="#d4af37",
                    color="black",
                    width=270,
                    height=45,
                    on_click=lambda _: forge_work_order(),
                    style=ft.ButtonStyle(
                        shape=ft.RoundedRectangleBorder(radius=10),
                        text_style=ft.TextStyle(size=11, weight="bold")
                    )
                )
            ], alignment="spaceBetween", spacing=0)
        )

        smartphone_player = ft.Container(
            width=330,
            height=530,
            bgcolor="#0A0A0A",
            border_radius=35,
            border=ft.Border.all(1, p_color),
            padding=15,
            content=ft.Stack([
                ft.Container(
                    width=100,
                    height=20,
                    bgcolor="#000000",
                    border_radius=10,
                    top=0,
                    left=100,
                ),
                ft.Container(
                    content=visor_content,
                    top=25,
                    left=0,
                    right=0,
                    bottom=0,
                    bgcolor="#000000",
                    border_radius=25,
                    alignment=ft.Alignment(0, 0),
                    border=ft.Border.all(1, "white10")
                )
            ])
        )

        smartphone_player_wrapper = ft.Column([
            ft.Row([
                ft.IconButton(icon="arrow_upward", icon_color="white30", on_click=lambda _: scroll_persona("up")),
                ft.Text("RODANTE REELS", size=9, weight="bold", color="white30"),
                ft.IconButton(icon="arrow_downward", icon_color="white30", on_click=lambda _: scroll_persona("down"))
            ], alignment="center", spacing=10),
            ft.Container(height=5),
            smartphone_player
        ], horizontal_alignment="center", spacing=0)

        return ft.Container(
            expand=True, padding=40, bgcolor="#000000",
            content=ft.Stack([
                # Coluna Central: Smartphone Player perfeitamente centralizado fisicamente na tela inteira!
                ft.Container(
                    content=smartphone_player_wrapper,
                    alignment=ft.Alignment(0, 0),
                    left=0,
                    right=0,
                    top=0,
                    bottom=0
                ),
                # Coluna Esquerda: Dossiê Estratégico posicionado à esquerda (deslocado da sidebar!)
                ft.Container(
                    content=left_side,
                    left=30, # Ajustado de 290 para 30 (Row do layout cuida do offset da sidebar)
                    top=40,
                    bottom=40,
                    width=280
                ),
                # Coluna Direita: A Forja posicionada à direita!
                ft.Container(
                    content=right_side,
                    right=30, # Ajustado de 40 para 30
                    top=40,
                    bottom=40,
                    width=280
                )
            ])
        )

    # --- 5. MENU LATERAL DE NAVEGAÇÃO PREMIUM ---
    def build_sidebar(disabled=False):
        effective_active_view = None if disabled else active_view
        effective_is_logged_in = False if disabled else is_logged_in
        effective_is_admin_mode = False if disabled else is_admin_mode

        sidebar_controls = [
            ft.Text("Killer Skills" if disabled else "Creative Studio", size=26, weight="bold", color="white70" if disabled else "white"),
            ft.Text("COCKPIT BLOQUEADO" if disabled else ("ADMIN COCKPIT" if effective_is_admin_mode else "STUDIO COCKPIT"), color="white30" if disabled else ("#d4af37" if effective_is_admin_mode else "#1E60FF"), size=9, weight="bold"),
            ft.Divider(color="white10", height=30),
        ]
        
        if not disabled and effective_is_logged_in:
            initials = logged_in_user_email[:2].upper() if logged_in_user_email else "US"
            sidebar_controls.extend([
                ft.Container(
                    content=ft.Row([
                        ft.Container(
                            content=ft.Text(initials, size=10, weight="bold", color="white"),
                            width=24, height=24, bgcolor="#d4af37" if effective_is_admin_mode else "#1E60FF", border_radius=12, alignment=ft.Alignment(0, 0)
                        ),
                        ft.Text(logged_in_user_email, size=11, color="white70", overflow=ft.TextOverflow.ELLIPSIS, weight="w500")
                    ], spacing=10),
                    padding=ft.Padding.symmetric(horizontal=10, vertical=8),
                    bgcolor="white10",
                    border_radius=10,
                    margin=ft.Padding.only(bottom=15)
                )
            ])
        
        if not disabled and effective_is_admin_mode:
            sidebar_controls.extend([
                ft.Text("ENGENHARIA ADM", size=10, color="white30", weight="bold"),
                ft.Container(height=5),
                ft.Container(
                    content=ft.Row([
                        ft.Icon("construction", color="#d4af37" if effective_active_view == "admin_constructor" else "white30", size=18),
                        ft.Text("Construtor ADM", color="white" if effective_active_view == "admin_constructor" else "white70", size=13, weight="bold" if effective_active_view == "admin_constructor" else "normal")
                    ]),
                    padding=ft.Padding.symmetric(horizontal=12, vertical=10),
                    bgcolor="#0Dd4af37" if effective_active_view == "admin_constructor" else "transparent",
                    border_radius=10,
                    on_click=None if disabled else (lambda _: change_view("admin_constructor"))
                ),
                ft.Container(
                    content=ft.Row([
                        ft.Icon("dashboard", color="#d4af37" if effective_active_view == "admin_console" else "white30", size=18),
                        ft.Text("Console de Infra", color="white" if effective_active_view == "admin_console" else "white70", size=13, weight="bold" if effective_active_view == "admin_console" else "normal")
                    ]),
                    padding=ft.Padding.symmetric(horizontal=12, vertical=10),
                    bgcolor="#0Dd4af37" if effective_active_view == "admin_console" else "transparent",
                    border_radius=10,
                    on_click=None if disabled else (lambda _: change_view("admin_console"))
                ),
                ft.Container(expand=True),
                ft.Container(
                    content=ft.Row([
                        ft.Icon("arrow_back", color="white70", size=18),
                        ft.Text("Voltar ao Studio", color="white70", size=13)
                    ]),
                    padding=ft.Padding.symmetric(horizontal=12, vertical=10),
                    border_radius=10,
                    on_click=None if disabled else (lambda _: exit_admin_mode())
                )
            ])
        else:
            sidebar_controls.extend([
                ft.Text("ÁREAS DE TRABALHO", size=10, color="white30", weight="bold"),
                ft.Container(height=5),
                ft.Container(
                    content=ft.Row([
                        ft.Icon("widgets", color="white30" if disabled else ("#1E60FF" if effective_active_view == "servicos" else "white30"), size=18),
                        ft.Text("Serviços AI", color="white30" if disabled else ("white" if effective_active_view == "servicos" else "white70"), size=13, weight="bold" if effective_active_view == "servicos" else "normal")
                    ]),
                    padding=ft.Padding.symmetric(horizontal=12, vertical=10),
                    bgcolor="transparent" if disabled else ("#0D1E60FF" if effective_active_view == "servicos" else "transparent"),
                    border_radius=10,
                    on_click=None if disabled else (lambda _: change_view("servicos"))
                ),
                ft.Container(
                    content=ft.Row([
                        ft.Icon("auto_awesome", color="white30" if disabled else ("#1E60FF" if effective_active_view == "storyboard" else "white30"), size=18),
                        ft.Text("Creative Studio", color="white30" if disabled else ("white" if effective_active_view == "storyboard" else "white70"), size=13, weight="bold" if effective_active_view == "storyboard" else "normal")
                    ]),
                    padding=ft.Padding.symmetric(horizontal=12, vertical=10),
                    bgcolor="transparent" if disabled else ("#0D1E60FF" if effective_active_view == "storyboard" else "transparent"),
                    border_radius=10,
                    on_click=None if disabled else (lambda _: change_view("storyboard"))
                ),
                ft.Container(
                    content=ft.Row([
                        ft.Icon("folder_special", color="white30" if disabled else ("#1E60FF" if effective_active_view == "almoxarifado" else "white30"), size=18),
                        ft.Text("Almoxarifado", color="white30" if disabled else ("white" if effective_active_view == "almoxarifado" else "white70"), size=13, weight="bold" if effective_active_view == "almoxarifado" else "normal")
                    ]),
                    padding=ft.Padding.symmetric(horizontal=12, vertical=10),
                    bgcolor="transparent" if disabled else ("#0D1E60FF" if effective_active_view == "almoxarifado" else "transparent"),
                    border_radius=10,
                    on_click=None if disabled else (lambda _: change_view("almoxarifado"))
                ),
                ft.Container(
                    content=ft.Row([
                        ft.Icon("mobile_screen_share", color="white30" if disabled else ("#1E60FF" if effective_active_view == "preview" else "white30"), size=18),
                        ft.Text("Simulador & Fila", color="white30" if disabled else ("white" if effective_active_view == "preview" else "white70"), size=13, weight="bold" if effective_active_view == "preview" else "normal")
                    ]),
                    padding=ft.Padding.symmetric(horizontal=12, vertical=10),
                    bgcolor="transparent" if disabled else ("#0D1E60FF" if effective_active_view == "preview" else "transparent"),
                    border_radius=10,
                    on_click=None if disabled else (lambda _: change_view("preview"))
                ),
                ft.Container(
                    content=ft.Row([
                        ft.Icon("people_outline", color="white30" if disabled else ("#1E60FF" if effective_active_view == "colecoes" else "white30"), size=18),
                        ft.Text("Coleções / Clientes", color="white30" if disabled else ("white" if effective_active_view == "colecoes" else "white70"), size=13, weight="bold" if effective_active_view == "colecoes" else "normal")
                    ]),
                    padding=ft.Padding.symmetric(horizontal=12, vertical=10),
                    bgcolor="transparent" if disabled else ("#0D1E60FF" if effective_active_view == "colecoes" else "transparent"),
                    border_radius=10,
                    on_click=None if disabled else (lambda _: change_view("colecoes"))
                ),
                ft.Container(
                    content=ft.Row([
                        ft.Icon("article", color="white30" if disabled else ("#1E60FF" if effective_active_view == "prompt_constructor" else "white30"), size=18),
                        ft.Text("Construtor de Prompt", color="white30" if disabled else ("white" if effective_active_view == "prompt_constructor" else "white70"), size=13, weight="bold" if effective_active_view == "prompt_constructor" else "normal")
                    ]),
                    padding=ft.Padding.symmetric(horizontal=12, vertical=10),
                    bgcolor="transparent" if disabled else ("#0D1E60FF" if effective_active_view == "prompt_constructor" else "transparent"),
                    border_radius=10,
                    on_click=None if disabled else (lambda _: change_view("prompt_constructor"))
                ),
                ft.Container(height=10),
                # Botão Exclusivo Pro (Bait de Conversão!)
                ft.Container(
                    content=ft.Row([
                        ft.Icon("admin_panel_settings", color="white30" if disabled else "#d4af37", size=18),
                        ft.Text("👑 Painel ADM [RESTRITO]", color="white30" if disabled else "#d4af37", size=13, weight="bold")
                    ]),
                    padding=ft.Padding.symmetric(horizontal=12, vertical=10),
                    bgcolor="transparent" if disabled else "#0Dd4af37",
                    border=ft.Border.all(1, "white10" if disabled else "#26d4af37"),
                    border_radius=10,
                    on_click=None if disabled else (lambda _: try_open_admin_portal())
                ),
                ft.Container(expand=True),
                
                # Botão VOLTAR provisório para testar a imobilidade absoluta do Player central!
                ft.Container(
                    content=ft.Row([
                        ft.Icon("logout", color="#E91E63", size=18),
                        ft.Text("VOLTAR (TELA 0)", color="#E91E63", size=13, weight="bold")
                    ]),
                    padding=ft.Padding.symmetric(horizontal=12, vertical=10),
                    bgcolor="#1AE91E63",
                    border_radius=10,
                    on_click=None if disabled else (lambda _: go_to_login())
                ),
                ft.Container(height=5),
                
                ft.Text("Slogan:", size=8, color="white30"),
                ft.Text("Nossos Agentes Trabalham por Você!", size=9, italic=True, color="white30" if disabled else "white60"),
                ft.Container(height=10),
                ft.Row([
                    ft.Container(width=8, height=8, bgcolor="white30" if disabled else "green", border_radius=4),
                    ft.Text("SESSÃO BLOQUEADA" if disabled else "ONLINE NO VPS", size=9, color="white30")
                ], spacing=8)
            ])
            
        return ft.Column(sidebar_controls, spacing=10, expand=True) # expand=True para evitar colapsos verticais

    # Declaramos o contêiner da barra lateral (trancado de cima a baixo na Row)
    sidebar_container = ft.Container(
        width=260, bgcolor="#0A0A0A", padding=20,
        border=ft.Border(right=ft.BorderSide(1, "white10")),
        content=build_sidebar(),
        expand=False # Ocupa exatamente 260px fixos
    )

    # --- MONTAGEM DA INTERFACE PRINCIPAL (SEM O PREVIEW FIXO NA DIREITA!) ---
    def build_active_view():
        view_control = None
        if active_view == "storyboard":
            return build_storyboard_view()
        elif active_view == "servicos":
            return build_servicos_view()
        elif active_view == "almoxarifado":
            view_control = build_almoxarifado_view()
        elif active_view == "preview":
            view_control = build_preview_view()
        elif active_view == "colecoes":
            view_control = build_colecoes_view()
        elif active_view == "prompt_constructor":
            from prompt_constructor import build_prompt_constructor_view
            view_control = build_prompt_constructor_view(is_admin=False, page=page)
        elif active_view == "admin_constructor":
            from prompt_constructor import build_prompt_constructor_view
            view_control = build_prompt_constructor_view(is_admin=True, page=page)
        elif active_view == "admin_console":
            view_control = build_admin_console_view()

        # O main_panel_container agora é posicionado automaticamente pela Row,
        # sem a necessidade do hack de margem de 260px!
        if view_control:
            return ft.Container(
                content=view_control,
                expand=True
            )

    # Painel Principal do Studio
    main_panel_container.content = build_active_view()

    # Painel Geral de Trabalho baseado em ROW responsiva: 
    # O smartphone fica perfeitamente centrado no vácuo restante à direita da sidebar!
    studio_layout = ft.Row(
        spacing=0,
        expand=True,
        controls=[
            sidebar_container,      # Lado esquerdo fixo
            main_panel_container   # Lado direito responsivo restante
        ]
    )
    
    # --- VOLTAR AO LOGIN (TELA 0) ---
    def go_to_login():
        nonlocal is_logged_in, logged_in_user_email
        is_logged_in = False
        logged_in_user_email = ""
        main_container.content = login_view()
        page.update()

    # --- ANIMAÇÃO DE TROCA DE TELA ---
    main_container = ft.AnimatedSwitcher(
        content=ft.Container(),
        expand=True, transition=ft.AnimatedSwitcherTransition.FADE, duration=500
    )

    def go_to_studio():
        nonlocal is_logged_in, logged_in_user_email
        is_logged_in = True
        logged_in_user_email = "artz.genera@gmail.com"
        change_view("servicos")
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
            if active_view == "almoxarifado":
                change_view("almoxarifado")
            show_snack(f"✅ Upload concluído: {e.file_name}", "#1E60FF")

    # Configura os manipuladores do FilePicker que foi registrado precocemente no topo
    picker.on_result = lambda e: picker.upload([ft.FilePickerUploadFile(f.name, upload_url=page.get_upload_url(f.name, 600)) for f in e.files]) if e.files else None
    picker.on_upload = on_upload

    main_container.content = login_view()
    page.add(main_container)

if __name__ == "__main__":
    web_mode = os.getenv("PORT") or os.getenv("WEB_MODE")
    view_mode = None if web_mode else ft.AppView.FLET_APP
    ft.app(target=main, view=view_mode, port=8081, assets_dir=ASSETS_DIR, upload_dir=UPLOAD_DIR)
