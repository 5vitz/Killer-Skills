#!/bin/bash
echo "🚀 INICIANDO DEPLOY AUTOMÁTICO — KILLER SKILLS"
echo "--------------------------------------------------"
echo "📦 1. Enviando alterações locais para o GitHub..."
git add .
git commit -m "feat: implement spacious multi-page navigation and brand slogan"
git push

echo "🖥️ 2. Conectando via SSH ao VPS e atualizando a web..."
ssh root@31.220.102.2 << 'EOF'
  cd ~/Killer-Skills
  git checkout APP/main.py
  git pull
  pm2 restart killer-skills
  echo "✅ DEPLOY CONCLUÍDO COM 100% DE SUCESSO NA WEB!"
EOF
