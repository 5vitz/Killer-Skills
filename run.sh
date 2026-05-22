#!/bin/bash
# 🚀 KILLER SKILLS RUNNER
# Script de inicialização automática - Lincoln 2026

# Navega para a pasta raiz do projeto
cd /home/artz/Documentos/Antigravity/Killer-Skills/

# Executa o deploy automático para a nuvem Contabo antes de carregar o app local
if [ -f "./deploy.sh" ]; then
    bash ./deploy.sh
fi

# Libera a porta 8081 se estiver ocupada por alguma instância antiga travada no Ubuntu
# Isso evita o erro '[Errno 98] Address already in use'
if command -v lsof >/dev/null 2>&1; then
    PID=$(lsof -t -i:8081)
    if [ ! -z "$PID" ]; then
        echo "🔄 Liberando porta 8081 (finalizando processo antigo $PID)..."
        kill -9 $PID 2>/dev/null || true
    fi
fi

# Executa o aplicativo usando diretamente o executável python3 do venv para evitar falhas de shell no Ubuntu
if [ -f "./venv/bin/python3" ]; then
    ./venv/bin/python3 APP/main.py
elif [ -f "./venv/bin/python" ]; then
    ./venv/bin/python APP/main.py
else
    python3 APP/main.py
fi
