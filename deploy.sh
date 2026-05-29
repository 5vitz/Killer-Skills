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
else
    echo "ℹ️ Nenhuma alteração pendente para commitar."
fi

if [ ! -z "$GITHUB_TOKEN" ]; then
    echo "🔑 Autenticando com Token do GitHub..."
    git push https://$GITHUB_TOKEN@github.com/5vitz/Killer-Skills.git main
    if [ $? -ne 0 ]; then
        echo "❌ ERRO: Falha ao enviar alterações para o GitHub (git push). Verifique se há conflitos!"
        exit 1
    fi
else
    echo "⚠️ GITHUB_TOKEN não configurado no .env! Tentando push padrão..."
    git push
    if [ $? -ne 0 ]; then
        echo "❌ ERRO: Falha ao enviar alterações para o GitHub. Configure o GITHUB_TOKEN!"
        exit 1
    fi
fi

echo "🖥️ 2. Conectando via SSH ao VPS e atualizando a web..."

# Função de conexão inteligente que automatiza o SSH com senha se VPS_PASSWORD existir
connect_ssh() {
  if [ ! -z "$VPS_PASSWORD" ]; then
      # Garante que o sshpass esteja instalado localmente
      if ! command -v sshpass >/dev/null 2>&1; then
          echo "🔄 Instalando sshpass localmente para automação de senha..."
          sudo apt-get update && sudo apt-get install -y sshpass || true
      fi
      sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no root@31.220.102.2 "$@"
  else
      ssh root@31.220.102.2 "$@"
  fi
}

connect_ssh << 'EOF'
  cd ~/Killer-Skills || { echo "❌ ERRO: Pasta ~/Killer-Skills não encontrada no VPS!"; exit 1; }
  
  # Força a atualização do repositório
  rm -rf frontend/dist
  git reset --hard
  git pull || { echo "❌ ERRO: Falha ao rodar git pull no VPS!"; exit 1; }
  
  # Garante que a biblioteca do Firebase esteja instalada no VPS
  if [ -f "venv/bin/pip" ]; then
      venv/bin/pip install firebase-admin
  else
      pip3 install firebase-admin || pip install firebase-admin
  fi
  
  # Compila o novo Frontend React no VPS
  echo "📦 Compilando o novo Frontend React (Vite)..."
  cd frontend
  npm install --legacy-peer-deps || { echo "❌ ERRO: Falha ao rodar npm install no VPS!"; exit 1; }
  npm run build || { echo "❌ ERRO: Falha ao rodar npm run build no VPS!"; exit 1; }
  cp -r dist/* /var/www/killerskills/ || { echo "❌ ERRO: Falha ao copiar arquivos para /var/www/killerskills/!"; exit 1; }
  cd ..
  
  # Carrega variáveis de ambiente comuns para garantir que o PM2 seja localizado
  export PATH=$PATH:/usr/local/bin:/usr/bin:/root/.nvm/versions/node/*/bin
  [ -s "$HOME/.nvm/nvm.sh" ] && \. "$HOME/.nvm/nvm.sh"
  [ -s "$HOME/.profile" ] && \. "$HOME/.profile"
  [ -s "$HOME/.bashrc" ] && \. "$HOME/.bashrc"
  
  echo "🔄 Reiniciando serviço PM2..."
  pm2 restart killer-skills || /usr/local/bin/pm2 restart killer-skills || /usr/bin/pm2 restart killer-skills || {
      echo "⚠️ AVISO: Não foi possível reiniciar via PM2 automaticamente. Tentando matar processo Python antigo..."
      pkill -f "main.py" || true
      nohup python3 APP/main.py > /dev/null 2>&1 &
  }
  
  echo "✅ DEPLOY CONCLUÍDO COM SUCESSO NO VPS!"
EOF
