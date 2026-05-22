#!/bin/bash
echo "🚀 INICIANDO DEPLOY AUTOMÁTICO — KILLER SKILLS"
echo "--------------------------------------------------"
# Carrega as variáveis do arquivo .env local
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

echo "📦 1. Enviando alterações locais para o GitHub..."
git add .
if ! git diff-index --quiet HEAD --; then
    git commit -m "deploy: automatic sync $(date '+%Y-%m-%d %H:%M:%S')"
    if [ ! -z "$GITHUB_TOKEN" ]; then
        echo "🔑 Autenticando com Token do GitHub de forma segura..."
        git push https://$GITHUB_TOKEN@github.com/5vitz/Killer-Skills.git main
    else
        echo "⚠️ GITHUB_TOKEN não configurado no .env! Tentando push padrão..."
        git push
    fi
else
    echo "ℹ️ Nenhuma alteração pendente para commitar."
fi

echo "🖥️ 2. Conectando via SSH ao VPS e atualizando a web..."
ssh root@31.220.102.2 << 'EOF'
  cd ~/Killer-Skills
  git checkout APP/main.py
  git pull
  pm2 restart killer-skills
  echo "✅ DEPLOY CONCLUÍDO COM 100% DE SUCESSO NA WEB!"
EOF
