#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 🖥️ KILLER SKILLS DESKTOP LAUNCHER INSTALLER
# Desenvolvido por Lincoln - Maio 2026

import os
import stat

def install():
    print("🖥️ Inicializando instalação do lançador do Killer Skills...")
    
    root_dir = "/home/artz/Documentos/Antigravity/Killer-Skills"
    run_sh = os.path.join(root_dir, "run.sh")
    logo_png = os.path.join(root_dir, "Imagens", "Logo_Final.png")
    
    # 1. Tornar o run.sh executável
    if os.path.exists(run_sh):
        st = os.stat(run_sh)
        os.chmod(run_sh, st.st_mode | stat.S_IEXEC)
        print("✅ Script 'run.sh' marcado como executável com sucesso.")
    else:
        print("❌ Erro: run.sh não encontrado!")
        return
        
    # Conteúdo do arquivo .desktop
    desktop_entry = f"""[Desktop Entry]
Version=1.0
Type=Application
Name=Killer Skills
Comment=Cockpit de IA & Direção de Arte
Exec={run_sh}
Icon={logo_png}
Terminal=false
Categories=Development;Office;
StartupNotify=true
"""

    # 2. Salvar na pasta do sistema (~/.local/share/applications/)
    system_app_dir = "/home/artz/.local/share/applications"
    os.makedirs(system_app_dir, exist_ok=True)
    system_desktop_path = os.path.join(system_app_dir, "killer-skills.desktop")
    
    with open(system_desktop_path, "w", encoding="utf-8") as f:
        f.write(desktop_entry)
    st = os.stat(system_desktop_path)
    os.chmod(system_desktop_path, st.st_mode | stat.S_IEXEC)
    print(f"✅ Lançador de Menu instalado em: {system_desktop_path}")

    # 3. Salvar na Área de Trabalho (Desktop) se existir
    desktop_paths = [
        "/home/artz/Área de Trabalho",
        "/home/artz/Desktop",
        "/home/artz/Desktop-Folders"
    ]
    
    for dp in desktop_paths:
        if os.path.exists(dp):
            dest_path = os.path.join(dp, "killer-skills.desktop")
            with open(dest_path, "w", encoding="utf-8") as f:
                f.write(desktop_entry)
            st = os.stat(dest_path)
            os.chmod(dest_path, st.st_mode | stat.S_IEXEC)
            print(f"✅ Lançador adicionado à Área de Trabalho: {dest_path}")
            
    print("🎉 Instalação concluída com absoluto sucesso! O ícone dourado metalizado do KS agora figura nos seus aplicativos.")

if __name__ == "__main__":
    install()
