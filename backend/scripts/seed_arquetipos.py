import os
import sys
import json
from datetime import datetime

# Define caminhos do projeto para importar PersistenceSkill
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT_DIR = os.path.dirname(BACKEND_DIR)
sys.path.append(os.path.join(ROOT_DIR, "APP"))

try:
    from killer_skills.persistence.scripts.database import PersistenceSkill
except ImportError:
    # Caso execute a partir de outro diretório de trabalho
    sys.path.append(os.path.join(BACKEND_DIR))
    sys.path.append(os.path.join(ROOT_DIR, "APP", "killer_skills"))
    from persistence.scripts.database import PersistenceSkill

# Definições Ontológicas dos 12 Arquétipos de Carl Jung com pegada de autoconhecimento poético/filosófico
ARQUETIPOS_DATA = [
    {
        "id": "sabio",
        "name": "Sábio",
        "desc_ontologica": "O Sábio é aquela parte de você que busca silenciar o barulho do mundo para escutar a própria verdade. Ele representa a sua capacidade de refletir antes de agir, de observar além do óbvio e de valorizar o aprendizado constante. Ter esse lado ativo significa que você encontra paz na quietude, prefere conversas profundas e busca entender a lógica das coisas. Mas cuidado: o excesso de racionalidade pode afastar você das suas emoções. Use sua sabedoria para iluminar o seu caminho, mantendo sempre o coração aberto.",
        "desejo": "Silenciar o barulho do mundo e encontrar a verdade interna",
        "medo": "Viver na ilusão e ser guiado pela ignorância",
        "superpoder": "Observação profunda e discernimento intuitivo",
        "sombra": "Isolamento na frieza da mente e distanciamento das emoções",
        "color": "#D4AF37"
    },
    {
        "id": "inocente",
        "name": "Inocente",
        "desc_ontologica": "O Inocente é aquela parte de você que escolhe enxergar a beleza e a pureza nas coisas simples da vida. Ele representa o seu otimismo espontâneo, a capacidade de confiar e a busca constante pela felicidade leve e sem complicações. Ter esse lado forte significa que você mantém viva a fé no futuro e o dom de recomeçar sempre com o coração limpo. Mas atenção: a busca por um mundo perfeito pode fazer você negar realidades difíceis. Preserve sua leveza, mantendo os pés firmes no chão.",
        "desejo": "Viver com espontaneidade, leveza e otimismo pleno",
        "medo": "Ser punido ou contaminado pela maldade e dureza do mundo",
        "superpoder": "Fé inabalável e pureza no recomeçar",
        "sombra": "Ingenuidade excessiva e negação de realidades dolorosas",
        "color": "#4D90FE"
    },
    {
        "id": "explorador",
        "name": "Explorador",
        "desc_ontologica": "O Explorador é aquela chama interna que impulsiona você a buscar liberdade e a descobrir novos caminhos na jornada da vida. Ele representa a sua coragem de romper a rotina, o desejo de autenticidade e o amor pela independência. Ter esse lado ativo significa que você se renova com o desconhecido e detesta qualquer sentimento de aprisionamento. Mas cuidado: o medo de criar raízes pode gerar uma eterna inconstância. Lembre-se de que a maior de todas as viagens acontece dentro de você.",
        "desejo": "Viver com liberdade e descobrir sua própria verdade",
        "medo": "Ficar preso no conformismo e na rotina sufocante",
        "superpoder": "Coragem de desbravar novos caminhos",
        "sombra": "Inconstância e dispersão pelo medo de criar raízes",
        "color": "#34A853"
    },
    {
        "id": "cuidador",
        "name": "Cuidador",
        "desc_ontologica": "O Cuidador é aquela força amorosa em você que encontra propósito em apoiar, proteger e nutrir a vida ao seu redor. Ele representa a sua generosidade natural, a compaixão sincera e a capacidade de criar ambientes seguros e acolhedores. Ter esse lado ativo significa que o bem-estar do outro é sagrado para você. Mas preste atenção: doar-se sem limites pode levar ao esquecimento das suas próprias necessidades. Lembre-se de que cuidar de si mesmo é o primeiro passo para poder cuidar do mundo.",
        "desejo": "Proteger e nutrir aqueles que ama",
        "medo": "O egoísmo e a ingratidão dos que estão ao redor",
        "superpoder": "Generosidade e acolhimento incondicional",
        "sombra": "Martírio e esgotamento por negligenciar a si próprio",
        "color": "#EA4335"
    },
    {
        "id": "heroi",
        "name": "Herói",
        "desc_ontologica": "O Herói é aquela força guerreira em você que se recusa a desistir diante dos obstáculos e das injustiças. Ele representa a sua determinação obstinada, a coragem de assumir batalhas difíceis e a busca constante por superação pessoal. Ter esse lado ativo significa que você se fortalece no desafio e busca proteger quem ama. Mas fique alerta: a necessidade constante de lutar pode transformá-lo em alguém rígido ou obcecado por vitórias. Aprenda que a verdadeira força também sabe quando descansar.",
        "desejo": "Superar desafios e proteger quem ama",
        "medo": "Fraqueza e fracasso diante dos obstáculos",
        "superpoder": "Determinação inabalável e coragem de lutar",
        "sombra": "Rigor excessivo e obsessão por estar sempre em combate",
        "color": "#E06666"
    },
    {
        "id": "mago",
        "name": "Mago",
        "desc_ontologica": "O Mago é aquela parte intuitiva de você que acredita que a realidade pode ser transformada a partir de uma visão interna profunda. Ele representa a sua capacidade de manifestar sonhos, de compreender o invisível e de catalisar mudanças profundas na vida cotidiana. Ter esse lado ativo significa que você enxerga conexões onde outros veem caos e busca criar o extraordinário. Mas atenção: o apego ao controle mental pode afastar você da simplicidade do mundo físico. Use sua magia com os pés no chão.",
        "desejo": "Transformar a realidade a partir de uma visão interior",
        "medo": "Consequências desastrosas causadas pelo controle inadequado",
        "superpoder": "Intuição afiada e manifestação de sonhos",
        "sombra": "Manipulação da realidade e distanciamento do mundo real",
        "color": "#93C47D"
    },
    {
        "id": "rebelde",
        "name": "Rebelde",
        "desc_ontologica": "O Rebelde é aquela voz autêntica em você que questiona as regras vazias e se recusa a viver sob moldes impostos pelos outros. Ele representa a sua liberdade de pensar diferente, a coragem de quebrar padrões obsoletos e o desejo de revolução pessoal. Ter esse lado ativo significa que você valoriza a sua individualidade acima de tudo e busca a mudança real. Mas cuidado: a revolta cega pode levar ao isolamento ou à destruição sem propósito. Direcione sua força para construir o novo.",
        "desejo": "Questionar regras obsoletas e provocar a mudança real",
        "medo": "Ser comum e impotente diante de padrões impostos",
        "superpoder": "Pensamento disruptivo e liberdade radical",
        "sombra": "Rebeldia vazia e destruição sem causa legítima",
        "color": "#F6B26B"
    },
    {
        "id": "criador",
        "name": "Criador",
        "desc_ontologica": "O Criador é aquela força expressiva em você que sente a necessidade urgente de dar forma à imaginação e de trazer algo novo ao mundo. Ele representa o seu impulso artístico, a busca pela originalidade e o desejo de deixar uma marca pessoal duradoura. Ter esse lado ativo significa que você enxerga potencial criativo em cada detalhe da vida. Mas preste atenção: o perfeccionismo extremo pode paralisar as suas mãos e impedir você de entregar sua arte. Liberte suas criações com amor.",
        "desejo": "Dar forma à imaginação e criar algo com alma",
        "medo": "Mediocridade e incapacidade de expressar sua visão",
        "superpoder": "Criatividade fluida e poder de dar vida às ideias",
        "sombra": "Perfeccionismo extremo que paralisa e impede a entrega",
        "color": "#FFD966"
    },
    {
        "id": "amante",
        "name": "Amante",
        "desc_ontologica": "O Amante é aquela energia sensível em você que busca conexão profunda, beleza e harmonia em todas as relações humanas. Ele representa a sua capacidade de se entregar com paixão, de valorizar o afeto e de viver com intensidade sensorial e emocional. Ter esse lado ativo significa que você coloca o amor e a beleza no centro do seu caminho. Mas cuidado: o medo de ficar só ou de ser rejeitado pode fazer você anular a sua própria identidade. Lembre-se de amar a si mesmo primeiro.",
        "desejo": "Vivenciar o afeto, a sintonia e a entrega mútua",
        "medo": "A solidão profunda e a dor de não ser aceito ou desejado",
        "superpoder": "Sensibilidade, afeto e compromisso de alma",
        "sombra": "Anulação pessoal e perda de identidade para agradar",
        "color": "#C27BA0"
    },
    {
        "id": "tolo",
        "name": "Tolo",
        "desc_ontologica": "O Tolo é aquela parte leve e espontânea de você que escolhe viver o momento presente com alegria, humor e diversão contagiante. Ele representa a sua capacidade de rir de si mesmo, de simplificar o que parece pesado e de trazer sorrisos ao dia a dia. Ter esse lado ativo significa que você valoriza a leveza e sabe que a vida é um jogo belo. Mas atenção: usar o riso como escudo pode esconder sentimentos que precisam ser acolhidos com seriedade. Divirta-se sem fugir de si.",
        "desejo": "Alegria espontânea, riso leve e descontração plena",
        "medo": "A seriedade rígida e o tédio existencial",
        "superpoder": "Humor inteligente e habilidade de aliviar pesos",
        "sombra": "Frivolidade excessiva e fuga de responsabilidades sérias",
        "color": "#8E7CC3"
    },
    {
        "id": "homem_comum",
        "name": "Homem Comum",
        "desc_ontologica": "O Homem Comum é aquela parte realista e acolhedora em você que valoriza a igualdade, a simplicidade e a conexão genuína com os outros. Ele representa o seu senso de comunidade, a empatia pé no chão e o desejo de pertencer sem precisar fingir ser quem não é. Ter esse lado ativo significa que você é confiável, valoriza a honestidade simples e respeita a todos igualmente. Mas cuidado: o medo de se destacar pode apagar o brilho da sua voz individual. Lembre-se de sua singularidade.",
        "desejo": "Conectar-se com a simplicidade e pertencer com sinceridade",
        "medo": "Ser excluído do grupo ou rejeitado por sua simplicidade",
        "superpoder": "Empatia pé no chão e fidelidade ao cotidiano",
        "sombra": "Conformismo excessivo e perda da voz própria",
        "color": "#858585"
    },
    {
        "id": "governante",
        "name": "Governante",
        "desc_ontologica": "O Governante é aquela força de liderança em você que busca criar ordem, estabilidade e prosperidade para a sua família e comunidade. Ele representa a sua capacidade de assumir responsabilidades, de organizar o caos e de guiar com segurança e clareza. Ter esse lado ativo significa que você é o pilar que sustenta e protege os outros nos momentos difíceis. Mas fique atento: a obsessão pelo controle pode gerar rigidez e afastar as pessoas. Lidere sempre com o coração aberto.",
        "desejo": "Organizar o caos, guiar e prosperar coletivamente",
        "medo": "A perda de controle, a ruína e a desordem do ambiente",
        "superpoder": "Liderança responsável e poder de prover segurança",
        "sombra": "Rigidez controladora e autoritarismo defensivo",
        "color": "#E09E25"
    }
]

def seed_process():
    # 1. Cria diretórios de dados locais para os arquivos JSON se não existirem
    data_dir = os.path.join(BACKEND_DIR, "data", "arquetipos")
    os.makedirs(data_dir, exist_ok=True)
    print(f"📁 Pasta de arquétipos verificada em: {data_dir}")

    # 2. Salva cada arquétipo em um arquivo JSON individual
    for arch in ARQUETIPOS_DATA:
        file_path = os.path.join(data_dir, f"{arch['id']}.json")
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(arch, f, ensure_ascii=False, indent=2)
        print(f" ✔️ Salvo arquivo JSON local: {arch['id']}.json")

    # 3. Prepara o upload e realiza no Firestore
    print("\n🔥 Inicializando upload para o Cloud Firestore...")
    try:
        db_handler = PersistenceSkill()
        firestore_db = db_handler.db

        for arch in ARQUETIPOS_DATA:
            doc_ref = firestore_db.collection("arquetipos").document(arch["id"])
            doc_ref.set(arch)
            print(f"  ⚡ Documento '{arch['name']}' enviado/atualizado no Firestore!")
            
        print("\n🎉 Todos os 12 arquétipos foram integrados ao Banco de Dados Firestore com sucesso!")
    except Exception as e:
        print(f"\n⚠️ Ocorreu um erro no upload para o Firestore: {e}")
        print("Certifique-se de que o arquivo 'firebase_key.json' está na raiz do projeto e que o ambiente Python possui 'firebase-admin' instalado.")

if __name__ == "__main__":
    seed_process()
