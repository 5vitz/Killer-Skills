#!/bin/bash
# 🚀 KILLER SKILLS RUNNER
# Script de inicialização automática - Lincoln 2026

# Navega para a pasta raiz do projeto
cd /home/artz/Documentos/Antigravity/Killer-Skills/

# Executa o deploy automático em uma janela de terminal visível para diagnóstico de erros
if [ -f "./deploy.sh" ]; then
    gnome-terminal --wait -- bash -c "bash ./deploy.sh; echo ''; echo '--------------------------------------------------'; echo 'Pressione [ENTER] para fechar esta janela...'; read"
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

# Abre a versão Web Real oficial no navegador padrão do Ubuntu (latência zero no deploy e conexão direta)
echo "🌐 Abrindo o Killer Skills oficial na Web..."
xdg-open "https://www.killerskills.com.br"

