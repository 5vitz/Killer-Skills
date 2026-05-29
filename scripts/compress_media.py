import os
import shutil
import sys
import subprocess

# Lista de caminhos possíveis para o projeto local (Princípio da Robustez)
PATHS_TO_TRY = [
    "/home/artz/Documentos/Antigravity/Killer-Skills",
    "/home/artz/Killer-Skills"
]

PROJECT_ROOT = "/home/artz/Killer-Skills" # Fallback padrão
for p in PATHS_TO_TRY:
    candidate = os.path.join(p, "frontend/public/IMAGENS")
    if os.path.exists(candidate):
        PROJECT_ROOT = p
        print(f"🎯 Repositório ativo detectado em: {PROJECT_ROOT}")
        break

IMAGENS_DIR = os.path.join(PROJECT_ROOT, "frontend/public/IMAGENS")
OLDS_DIR = os.path.join(IMAGENS_DIR, "OLDS")
ARQUETIPOS_DIR = os.path.join(IMAGENS_DIR, "12Arquetipos")
TELAS_DIR = os.path.join(IMAGENS_DIR, "2Telas")

# Injeta caminhos do app para carregar a persistência do Firebase
sys.path.append(os.path.join(PROJECT_ROOT, "APP"))
sys.path.append(os.path.join(PROJECT_ROOT, "backend"))

try:
    from killer_skills.persistence.scripts.database import PersistenceSkill
except ImportError:
    PersistenceSkill = None
    print("⚠️ Aviso: Classe PersistenceSkill não pôde ser importada. O upload automático para o Storage será ignorado.")

def compress_png_to_webp(input_path, output_path):
    """Converte um arquivo PNG para WebP usando o FFmpeg do sistema com qualidade visual premium."""
    try:
        # Comando otimizado do FFmpeg para compressão WebP de alta fidelidade visual (qualidade 80)
        cmd = [
            "ffmpeg", "-y",
            "-i", input_path,
            "-codec:v", "libwebp",
            "-quality", "80",
            output_path
        ]
        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        if result.returncode == 0:
            return True
        else:
            print(f"❌ Erro FFmpeg ao converter {os.path.basename(input_path)}: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ Falha no subprocesso do FFmpeg: {e}")
        return False

def process_file(file_path, dest_folder, upload_active=False, db_instance=None):
    """Processa um arquivo individual: Converte, move o original para OLDS e opcionalmente sobe para o Firebase Storage."""
    if not os.path.exists(file_path):
        print(f"⚠️ Arquivo não encontrado: {file_path}")
        return None

    filename = os.path.basename(file_path)
    base_name, _ = os.path.splitext(filename)
    webp_filename = f"{base_name}.webp"
    webp_path = os.path.join(dest_folder, webp_filename)

    # 1. Compressão
    print(f"⚙️  Comprimindo: {filename} ...")
    success = compress_png_to_webp(file_path, webp_path)
    if not success:
        return None

    orig_size = os.path.getsize(file_path) / (1024 * 1024)
    new_size = os.path.getsize(webp_path) / (1024 * 1024)
    savings = (1 - (new_size / orig_size)) * 100

    print(f"   📉 Tamanho reduzido: {orig_size:.2f} MB ➔ {new_size:.2f} MB ({savings:.1f}% de economia!)")

    # 2. Backup do PNG original (NENHUM ARQUIVO SERÁ EXCLUÍDO)
    os.makedirs(OLDS_DIR, exist_ok=True)
    backup_path = os.path.join(OLDS_DIR, filename)
    shutil.move(file_path, backup_path)
    print(f"   📦 PNG original movido de forma segura para: IMAGENS/OLDS/{filename}")

    # 3. Upload para o Firebase Storage se ativado
    public_url = None
    if upload_active and db_instance:
        print(f"   ☁️  Enviando {webp_filename} para o Firebase Storage...")
        try:
            # Usa o método upload_media da infraestrutura ativa
            public_url = db_instance.upload_media(
                local_path=webp_path,
                destination_path=f"bibliotecas/scalla_records/scallarecords/{webp_filename}"
            )
            print(f"   ✅ Upload concluído! URL Pública Permanente:\n      🔗 {public_url}")
        except Exception as e:
            print(f"   ⚠️ Erro durante o upload para o Storage: {e}")

    return {
        "name": base_name,
        "orig_size": orig_size,
        "new_size": new_size,
        "savings": savings,
        "public_url": public_url
    }

def main():
    print("==================================================")
    print("⚙️  EXTRATOR E COMPRESSOR DE MÍDIA WEB P (KILLER SKILLS)")
    print("==================================================")
    print(f"📂 Diretório de Trabalho: {IMAGENS_DIR}")

    # Inicia a conexão com o Firebase se disponível
    db = None
    if PersistenceSkill:
        try:
            db = PersistenceSkill()
        except Exception as e:
            print(f"⚠️ Aviso: Falha ao conectar ao Firebase ({e}). Rodando apenas conversão local.")

    # Argumentos do terminal
    args = sys.argv[1:]
    
    # Se rodar sem argumentos ou com 'test', faz apenas o teste unitário de uma imagem
    if not args or args[0] == "test":
        print("\n🧪 MODO DE TESTE UNITÁRIO ATIVADO (Apenas 1 Imagem)")
        print("--------------------------------------------------")
        # Procura a primeira imagem de arquétipo disponível
        test_file = None
        if os.path.exists(ARQUETIPOS_DIR):
            for f in os.listdir(ARQUETIPOS_DIR):
                if f.lower().endswith(".png"):
                    test_file = os.path.join(ARQUETIPOS_DIR, f)
                    break
        
        if not test_file and os.path.exists(TELAS_DIR):
            # Se não achou em 12Arquetipos, tenta nas 2Telas
            for f in os.listdir(TELAS_DIR):
                if f.lower().endswith(".png"):
                    test_file = os.path.join(TELAS_DIR, f)
                    break
        
        if not test_file:
            print("❌ Nenhuma imagem PNG de origem encontrada em '12Arquetipos' ou '2Telas' para testar!")
            sys.exit(1)

        dest_folder = os.path.dirname(test_file)
        result = process_file(test_file, dest_folder, upload_active=True, db_instance=db)
        
        if result:
            print("\n🎉 TESTE UNITÁRIO CONCLUÍDO COM SUCESSO!")
            print("Para processar todas as outras imagens remanescentes, execute o comando:")
            print("  python scripts/compress_media.py all")
        else:
            print("\n❌ O Teste Unitário falhou. Verifique se o FFmpeg está instalado e funcional.")
            sys.exit(1)

    # Se rodar com 'all', processa o lote completo de imagens
    elif args[0] == "all":
        print("\n🚀 PROCESSAMENTO EM LOTE INICIADO (Todas as Imagens)")
        print("--------------------------------------------------")
        
        results = []
        
        # 1. Processa 12Arquetipos
        if os.path.exists(ARQUETIPOS_DIR):
            png_files = [f for f in os.listdir(ARQUETIPOS_DIR) if f.lower().endswith(".png")]
            if png_files:
                print(f"\n📂 Processando pasta '12Arquetipos' ({len(png_files)} arquivos):")
                for f in sorted(png_files):
                    file_path = os.path.join(ARQUETIPOS_DIR, f)
                    res = process_file(file_path, ARQUETIPOS_DIR, upload_active=True, db_instance=db)
                    if res:
                        results.append(res)
        
        # 2. Processa 2Telas
        if os.path.exists(TELAS_DIR):
            png_files = [f for f in os.listdir(TELAS_DIR) if f.lower().endswith(".png")]
            if png_files:
                print(f"\n📂 Processando pasta '2Telas' ({len(png_files)} arquivos):")
                for f in sorted(png_files):
                    file_path = os.path.join(TELAS_DIR, f)
                    res = process_file(file_path, TELAS_DIR, upload_active=True, db_instance=db)
                    if res:
                        results.append(res)

        # Relatório Final
        if results:
            print("\n==================================================")
            print("📊 RELATÓRIO CONSOLIDADO DE COMPRESSÃO E UPLOAD")
            print("==================================================")
            total_orig = sum(r["orig_size"] for r in results)
            total_new = sum(r["new_size"] for r in results)
            total_saved = total_orig - total_new
            global_savings = (1 - (total_new / total_orig)) * 100
            
            print(f"📦 Total de Arquivos Processados: {len(results)}")
            print(f"💾 Peso Total Original: {total_orig:.2f} MB")
            print(f"⚡ Novo Peso WebP Total: {total_new:.2f} MB")
            print(f"🔥 Economia Geral de Banda: {total_saved:.2f} MB ({global_savings:.1f}% mais leve!)")
            print("--------------------------------------------------")
            print("✅ Todas as fotos antigas .png foram movidas com segurança para a pasta 'IMAGENS/OLDS/'.")
            print("🚀 O sistema está ultra-leve e as URLs na nuvem estão configuradas!")
            print("==================================================")
        else:
            print("\n⚠️ Nenhuma imagem PNG pendente foi encontrada para processar em lote.")

if __name__ == "__main__":
    main()
