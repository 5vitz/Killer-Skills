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
    page.bgcolor = "#000000"
    page.padding = 0
    page.window_width = 1200
    page.window_height = 850

    # --- ESTADO GLOBAL ---
    storyboard_data = [None] * 4 
    lib_media_list = ft.Column(spacing=15, scroll="auto", expand=True)
    txt_legenda = ft.TextField(label="Legenda Estratégica", multiline=True, min_lines=3, border_color="#1E60FF", expand=True)
    ai_insight_text = ft.Text("Selecione fotos para análise...", size=13, italic=True)
    
    selected_src = None
    selected_card = None

    # --- NAVEGAÇÃO ---
    main_container = ft.AnimatedSwitcher(
        expand=True, transition=ft.AnimatedSwitcherTransition.FADE, duration=800
    )

    def show_snack(msg, color="green"):
        page.snack_bar = ft.SnackBar(ft.Text(msg), bgcolor=color)
        page.snack_bar.open = True
        page.update()

    # --- LÓGICA DE IA ASSÍNCRONA ---
    def run_ai_analysis():
        m_ativas = [m for m in storyboard_data if m is not None]
        if ai and m_ativas:
            ai_insight_text.value = "O Co-Diretor está analisando as imagens... 🧠⚡"
            ai_insight_text.color = "#1E60FF"
            page.update()
            
            # Chama a IA de verdade
            resultado = ai.analisar_storyboard(m_ativas)
            
            ai_insight_text.value = resultado
            ai_insight_text.color = ft.colors.WHITE
            page.update()

    def run_ai_caption(e):
        if ai:
            txt_legenda.value = "Gerando legenda estratégica... ✍️"
            page.update()
            
            # Rodar em thread para não travar a UI
            def task():
                res = ai.sugerir_legenda(storyboard_data)
                txt_legenda.value = res
                page.update()
            
            threading.Thread(target=task).start()

    # --- TELA DE LOGIN ---
    def login_view():
        return ft.Container(
            expand=True, alignment=ft.alignment.center,
            content=ft.Stack([
                ft.Container(width=400, height=400, bgcolor=ft.colors.with_opacity(0.05, "#1E60FF"), border_radius=200, blur=ft.Blur(100, 100), left=100, top=100),
                ft.Column([
                    ft.Text("Killer Skills", size=72, weight="bold"),
                    ft.Text("INTELLIGENT POST", color="#1E60FF", size=16, weight="bold"),
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

    # --- STUDIO VIEW ---
    def select_media(e):
        nonlocal selected_src, selected_card
        if selected_card: selected_card.border = ft.border.all(1, "white10")
        selected_src = e.control.data
        selected_card = e.control
        selected_card.border = ft.border.all(2, "#1E60FF")
        page.update()

    def set_slot(e):
        if selected_src:
            idx = e.control.data
            storyboard_data[idx] = selected_src
            e.control.content = ft.Image(src=selected_src, expand=True, fit="cover", border_radius=15)
            e.control.border = ft.border.all(2, "greenaccent")
            page.update() # Atualiza a foto IMEDIATAMENTE
            
            # Inicia a análise da IA em segundo plano para não travar
            threading.Thread(target=run_ai_analysis).start()

    def studio_view():
        return ft.Row(
            expand=True, spacing=0,
            controls=[
                ft.Container(width=240, bgcolor="#0A0A0A", padding=20, content=ft.Column([
                    ft.Text("ALMOXARIFADO", size=12, weight="bold", color="white30"),
                    ft.Divider(color="white10"), lib_media_list, 
                    ft.ElevatedButton("Importar", icon="add", on_click=lambda _: picker.pick_files(allow_multiple=True))
                ])),
                ft.Container(expand=True, padding=40, bgcolor="#000000", content=ft.Column([
                    ft.Row([
                        ft.Column([
                            ft.Text("STORYBOARD STUDIO", size=32, weight="bold"),
                            ft.Text("DIREÇÃO DE ARTE ATIVA", color="#1E60FF", size=12, weight="bold")
                        ]),
                        ft.OutlinedButton("NOVA CAMPANHA", icon="refresh", on_click=lambda _: page.update())
                    ], alignment="spaceBetween"),
                    ft.Divider(color="white10", height=40),
                    ft.Row([
                        ft.Container(
                            content=ft.Text(f"FRAME {i+1}", color="white10", weight="bold"),
                            width=160, height=220, bgcolor="#0A0A0A", border_radius=15, 
                            border=ft.border.all(1, "white10"), alignment=ft.alignment.center,
                            data=i, on_click=set_slot
                        ) for i in range(4)
                    ], spacing=20),
                    ft.Divider(height=40, color="transparent"),
                    ft.Row([
                        txt_legenda, 
                        ft.IconButton(ft.icons.AUTO_AWESOME, icon_color="#1E60FF", on_click=run_ai_caption)
                    ]),
                    ft.ElevatedButton("AGENDAR CAMPANHA COMPLETA", bgcolor="#1E60FF", color="white", height=60, width=400, on_click=lambda _: agendar_save())
                ], scroll="auto")),
                ft.Container(width=280, bgcolor="#0A0A0A", padding=25, content=ft.Column([
                    ft.Text("CO-DIRETOR AI", color="#1E60FF", weight="bold", size=16),
                    ft.Divider(color="white10", height=30),
                    ft.Container(
                        padding=20, bgcolor=ft.colors.with_opacity(0.02, ft.colors.WHITE),
                        border_radius=15, border=ft.border.all(1, ft.colors.with_opacity(0.05, ft.colors.WHITE)),
                        content=ai_insight_text
                    )
                ]))
            ]
        )

    def agendar_save():
        m = [m for m in storyboard_data if m is not None]
        if m and db:
            caminhos = [os.path.join(ASSETS_DIR, x.replace("/", "")) for x in m]
            db.agendar_post(datetime.now().strftime("%Y-%m-%d %H:%M:%S"), ", ".join(caminhos), txt_legenda.value)
            show_snack("🚀 Sucesso! Campanha enviada para a fila.", "#1E60FF")

    def go_to_studio():
        main_container.content = studio_view()
        page.update()

    def on_upload(e: ft.FilePickerUploadEvent):
        if e.progress == 1.0:
            src_p, dst_p = os.path.join(UPLOAD_DIR, e.file_name), os.path.join(ASSETS_DIR, e.file_name)
            if os.path.exists(src_p): shutil.copy(src_p, dst_p)
            lib_media_list.controls.append(
                ft.Container(
                    content=ft.Column([ft.Image(src=f"/{e.file_name}", width=100, height=100, fit="cover", border_radius=10), ft.Text(e.file_name, size=9)], alignment="center"),
                    data=f"/{e.file_name}", on_click=select_media, border=ft.border.all(1, "white10"), border_radius=12, padding=5
                )
            )
            page.update()

    picker = ft.FilePicker(on_result=lambda e: picker.upload([ft.FilePickerUploadFile(f.name, upload_url=page.get_upload_url(f.name, 600)) for f in e.files]) if e.files else None, on_upload=on_upload)
    page.overlay.append(picker)

    main_container.content = login_view()
    page.add(main_container)

if __name__ == "__main__":
    ft.app(target=main, view=None, port=8590, assets_dir=ASSETS_DIR, upload_dir=UPLOAD_DIR)
