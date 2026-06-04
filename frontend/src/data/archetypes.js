// Seeds de Mídias para a Biblioteca / Almoxarifado
export const SEED_IMAGES = [
  { id: 1, url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500", name: "Jeep Renegade (Aventura)" },
  { id: 2, url: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=500", name: "Hyundai Ioniq (Futurista)" },
  { id: 3, url: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=500", name: "BYD Song Plus (Estilo)" },
  { id: 4, url: "https://images.unsplash.com/photo-1621007947382-cc347941150e?w=500", name: "Toyota Hilux (Lamas)" },
  { id: 5, url: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=500", name: "Porsche Taycan (Estética)" }
];

export const ARCHETYPES = [
  { id: 'sabio', name: 'Sábio', tag: 'Verdade', desc: 'O Sábio é aquela parte de você que busca silenciar o barulho do mundo para escutar a própria verdade. Ele representa a sua capacidade de refletir antes de agir, de observar além do óbvio e de valorizar o aprendizado constante. Ter esse lado ativo significa que você encontra paz na quietude, prefere conversas profundas e busca entender a lógica das coisas. Mas cuidado: o excesso de racionalidade pode afastar você das suas emoções. Use sua sabedoria para iluminar o seu caminho, mantendo sempre o coração aberto.', color: '#D4AF37', shadow: 'Sombra: Isolamento na frieza da mente e distanciamento das emoções.', seedUrl: 'https://storage.googleapis.com/gen-lang-client-0513318140.firebasestorage.app/bibliotecas/scalla_records/scallarecords/Sabio.webp' },
  { id: 'inocente', name: 'Inocente', tag: 'Simplicidade', desc: 'O Inocente é aquela parte de você que escolhe enxergar a beleza e a pureza nas coisas simples da vida. Ele representa o seu otimismo espontâneo, a capacidade de confiar e a busca constante pela felicidade leve e sem complicações. Ter esse lado forte significa que você mantém viva a fé no futuro e o dom de recomeçar sempre com o coração limpo. Mas atenção: a busca por um mundo perfeito pode fazer você negar realidades difíceis. Preserve sua leveza, mantendo os pés firmes no chão.', color: '#4D90FE', shadow: 'Sombra: Ingenuidade excessiva e negação de realidades dolorosas.', seedUrl: 'https://storage.googleapis.com/gen-lang-client-0513318140.firebasestorage.app/bibliotecas/scalla_records/scallarecords/Inocente.webp' },
  { id: 'explorador', name: 'Explorador', tag: 'Liberdade', desc: 'O Explorador é aquela chama interna que impulsiona você a buscar liberdade e a descobrir novos caminhos na jornada da vida. Ele representa a sua coragem de romper a rotina, o desejo de autenticidade e o amor pela independência. Ter esse lado ativo significa que você se renova com o desconhecido e detesta qualquer sentimento de aprisionamento. Mas cuidado: o medo de criar raízes pode gerar uma eterna inconstância. Lembre-se de que a maior de todas as viagens acontece dentro de você.', color: '#34A853', shadow: 'Sombra: Inconstância e dispersão pelo medo de criar raízes.', seedUrl: 'https://storage.googleapis.com/gen-lang-client-0513318140.firebasestorage.app/bibliotecas/scalla_records/scallarecords/Explorador.webp' },
  { id: 'cuidador', name: 'Cuidador', tag: 'Acolhimento', desc: 'O Cuidador é aquela força amorosa em você que encontra propósito em apoiar, proteger e nutrir a vida ao seu redor. Ele representa a sua generosidade natural, a compaixão sincera e a capacidade de criar ambientes seguros e acolhedores. Ter esse lado ativo significa que o bem-estar do outro é sagrado para você. Mas preste atenção: doar-se sem limites pode levar ao esquecimento das suas próprias necessidades. Lembre-se de que cuidar de si mesmo é o primeiro passo para poder cuidar do mundo.', color: '#EA4335', shadow: 'Sombra: Martírio e esgotamento por negligenciar a si próprio.', seedUrl: 'https://storage.googleapis.com/gen-lang-client-0513318140.firebasestorage.app/bibliotecas/scalla_records/scallarecords/Cuidador.webp' },
  { id: 'heroi', name: 'Herói', tag: 'Superação', desc: 'O Herói é aquela força guerreira em você que se recusa a desistir diante dos obstáculos e das injustices. Ele representa a sua determinação obstinada, a coragem de assumir batalhas difíceis e a busca constante por superação pessoal. Ter esse lado ativo significa que você se fortalece no desafio e busca proteger quem ama. Mas fique alerta: a necessidade constante de lutar pode transformá-lo em alguém rígido ou obcecado por vitórias. Aprenda que a verdadeira força também sabe quando descansar.', color: '#E06666', shadow: 'Sombra: Rigor excessivo e obsessão por estar sempre em combate.', seedUrl: 'https://storage.googleapis.com/gen-lang-client-0513318140.firebasestorage.app/bibliotecas/scalla_records/scallarecords/Heroi.webp' },
  { id: 'mago', name: 'Mago', tag: 'Transformação', desc: 'O Mago é aquela parte intuitiva de você que acredita que a reality pode ser transformada a partir de uma visão interna profunda. Ele representa a sua capacidade de manifestar sonhos, de compreender o invisível e de catalisar mudanças profundas na vida cotidiana. Ter esse lado ativo significa que você enxerga conexões onde outros veem caos e busca criar o extraordinário. Mas atenção: o apego ao controle mental pode afastar você da simplicidade do mundo físico. Use sua magia com os pés no chão.', color: '#93C47D', shadow: 'Sombra: Manipulação da realidade e distanciamento do mundo real.', seedUrl: 'https://storage.googleapis.com/gen-lang-client-0513318140.firebasestorage.app/bibliotecas/scalla_records/scallarecords/Mago.webp' },
  { id: 'rebelde', name: 'Rebelde', tag: 'Ruptura', desc: 'O Rebelde é aquela voz autêntica em você que questiona as regras vazias e se recusa a viver sob moldes impostos pelos outros. Ele representa a sua liberdade de pensar diferente, a coragem de quebrar padrões obsoletos e o desejo de revolução pessoal. Ter esse lado ativo significa que você valoriza a sua individualidade acima de tudo e busca a mudança real. Mas cuidado: a revolta cega pode levar ao isolamento ou à destruição sem propósito. Direcione sua força para construir o novo.', color: '#F6B26B', shadow: 'Sombra: Rebeldia vazia e destruição sem causa legítima.', seedUrl: 'https://storage.googleapis.com/gen-lang-client-0513318140.firebasestorage.app/bibliotecas/scalla_records/scallarecords/Rebelde.webp' },
  { id: 'criador', name: 'Criador', tag: 'Originalidade', desc: 'O Criador é aquela força expressiva em você que sente a necessidade urgente de dar forma à imaginação e de trazer algo novo ao mundo. Ele representa o seu impulso artístico, a busca pela originalidade e o desejo de deixar uma marca pessoal duradoura. Ter esse lado ativo significa que você enxerga potencial criativo em cada detalhe da vida. Mas preste atenção: o perfeccionismo extremo pode paralisar as suas mãos e impedir você de entregar sua arte. Liberte suas criações com amor.', color: '#FFD966', shadow: 'Sombra: Perfeccionismo extremo que paralisa e impede a entrega.', seedUrl: 'https://storage.googleapis.com/gen-lang-client-0513318140.firebasestorage.app/bibliotecas/scalla_records/scallarecords/Criador.webp' },
  { id: 'amante', name: 'Amante', tag: 'Conexão', desc: 'O Amante é aquela energia sensível em você que busca conexão profunda, beleza e harmonia em todas as relações humanas. Ele representa a sua capacidade de se entregar com paixão, de valorizar o afeto e de viver com intensidade sensorial e emocional. Ter esse lado ativo significa que você coloca o amor e a beleza no centro do seu caminho. Mas cuidado: o medo de ficar só ou de ser rejeitado pode fazer você anular a sua própria identidade. Lembre-se de amar a si mesmo primeiro.', color: '#C27BA0', shadow: 'Sombra: Anulação pessoal e perda de identidade para agradar.', seedUrl: 'https://storage.googleapis.com/gen-lang-client-0513318140.firebasestorage.app/bibliotecas/scalla_records/scallarecords/Amante.webp' },
  { id: 'tolo', name: 'Tolo', tag: 'Leveza', desc: 'O Tolo é aquela parte leve e espontânea de você que escolhe viver o momento presente com alegria, humor e diversão contagiante. Ele representa a sua capacidade de rir de si mesmo, de simplificar o que parece pesado e de trazer sorrisos ao dia a dia. Ter esse lado active significa que você valoriza a leveza e sabe que a vida é um jogo belo. Mas atenção: usar o riso como escudo pode esconder sentimentos que precisam ser acolhidos com seriedade. Divirta-se sem fugir de si.', color: '#8E7CC3', shadow: 'Sombra: Frivolidade excessiva e fuga de responsabilidades sérias.', seedUrl: 'https://storage.googleapis.com/gen-lang-client-0513318140.firebasestorage.app/bibliotecas/scalla_records/scallarecords/Tolo.webp' },
  { id: 'homem_comum', name: 'Homem Comum', tag: 'Realismo', desc: 'O Homem Comum é aquela parte realista e acolhedora em você que valoriza a igualdade, a simplicidade e a conexão genuína com os outros. Ele representa o seu senso de comunidade, a empatia pé no chão e o desejo de pertencer sem precisar fingir ser quem não é. Ter esse lado ativo significa que você é confiável, valoriza a honestidade simples e respeita a todos igualmente. Mas cuidado: o medo de se destacar pode apagar o brilho da sua voz individual. Lembre-se de sua singularidade.', color: '#858585', shadow: 'Sombra: Conformismo excessivo e perda da voz própria.', seedUrl: 'https://storage.googleapis.com/gen-lang-client-0513318140.firebasestorage.app/bibliotecas/scalla_records/scallarecords/CaraComum.webp' },
  { id: 'governante', name: 'Governante', tag: 'Autoridade', desc: 'O Governante é aquela força de liderança em você que busca criar ordem, estabilidade e prosperidade para a sua família e comunidade. Ele representa a sua capacidade de assumir responsabilidades, de organizar o caos e de guiar com segurança e clareza. Ter esse lado ativo significa que você é o pilar que sustenta e protege os outros nos momentos difíceis. Mas fique atento: a obsessão pelo controle pode gerar rigidez e afastar as pessoas. Lidere sempre com o coração aberto.', color: '#E09E25', shadow: 'Sombra: Rigidez controladora e autoritarismo defensivo.', seedUrl: 'https://storage.googleapis.com/gen-lang-client-0513318140.firebasestorage.app/bibliotecas/scalla_records/scallarecords/Governante.webp' }
];

export const ARCHETYPE_DETAILS = {
  sabio: {
    desejo: "Silenciar o barulho do mundo e encontrar a verdade interna",
    medo: "Viver na ilusão e ser guiado pela ignorância",
    superpoder: "Observação profunda e discernimento intuitivo",
    imagem: "https://storage.googleapis.com/gen-lang-client-0513318140.firebasestorage.app/bibliotecas/scalla_records/scallarecords/Sabio.webp",
    sombra: "Isolamento na frieza da mente e distanciamento das emoções"
  },
  inocente: {
    desejo: "Viver com espontaneidade, leveza e otimismo pleno",
    medo: "Ser punido ou contaminado pela maldade e dureza do mundo",
    superpoder: "Fé inabalável e pureza no recomeçar",
    imagem: "https://storage.googleapis.com/gen-lang-client-0513318140.firebasestorage.app/bibliotecas/scalla_records/scallarecords/Inocente.webp",
    sombra: "Ingenuidade excessiva and negação de realidades dolorosas"
  },
  explorador: {
    desejo: "Viver com liberdade e descobrir sua própria verdade",
    medo: "Ficar preso no conformismo e na rotina sufocante",
    superpoder: "Coragem de desbravar novos caminhos",
    imagem: "https://storage.googleapis.com/gen-lang-client-0513318140.firebasestorage.app/bibliotecas/scalla_records/scallarecords/Explorador.webp",
    sombra: "Inconstância e dispersão pelo medo de criar raízes"
  },
  cuidador: {
    desejo: "Proteger e nutrir aqueles que ama",
    medo: "O egoísmo e a ingratidão dos que estão ao redor",
    superpoder: "Generosidade e acolhimento incondicional",
    imagem: "https://storage.googleapis.com/gen-lang-client-0513318140.firebasestorage.app/bibliotecas/scalla_records/scallarecords/Cuidador.webp",
    sombra: "Martírio e esgotamento por negligenciar a si próprio"
  },
  heroi: {
    desejo: "Superar desafios e proteger quem ama",
    medo: "Fraqueza e fracasso diante dos obstáculos",
    superpoder: "Determinação inabalável e coragem de lutar",
    imagem: "https://storage.googleapis.com/gen-lang-client-0513318140.firebasestorage.app/bibliotecas/scalla_records/scallarecords/Heroi.webp",
    sombra: "Rigor excessivo e obsessão por estar sempre em combate"
  },
  mago: {
    desejo: "Transformar a realidade a partir de uma visão interior",
    medo: "Consequências desastrosas causadas pelo controle inadequado",
    superpoder: "Intuição afiada e manifestação de sonhos",
    imagem: "https://storage.googleapis.com/gen-lang-client-0513318140.firebasestorage.app/bibliotecas/scalla_records/scallarecords/Mago.webp",
    sombra: "Manipulação da realidade e distanciamento do world real"
  },
  rebelde: {
    desejo: "Questionar regras obsoletas e provocar a mudança real",
    medo: "Ser comum e impotente diante de padrões impostos",
    superpoder: "Pensamento disruptivo e liberdade radical",
    imagem: "https://storage.googleapis.com/gen-lang-client-0513318140.firebasestorage.app/bibliotecas/scalla_records/scallarecords/Rebelde.webp",
    sombra: "Rebeldia vazia e destruição sem causa legítima"
  },
  criador: {
    desejo: "Dar forma à imaginação e criar algo com alma",
    medo: "Mediocridade e incapacidade de expressar sua visão",
    superpoder: "Criatividade fluida e poder de dar vida às ideias",
    imagem: "https://storage.googleapis.com/gen-lang-client-0513318140.firebasestorage.app/bibliotecas/scalla_records/scallarecords/Criador.webp",
    sombra: "Perfeccionismo extremo que paralisa e impede a entrega"
  },
  amante: {
    desejo: "Vivenciar o afeto, a sintonia e a entrega mútua",
    medo: "A solidão profunda e a dor de não ser aceito ou desejado",
    superpoder: "Sensibilidade, afeto e compromisso de alma",
    imagem: "https://storage.googleapis.com/gen-lang-client-0513318140.firebasestorage.app/bibliotecas/scalla_records/scallarecords/Amante.webp",
    sombra: "Anulação pessoal e perda de identidade para agradar"
  },
  tolo: {
    desejo: "Alegria espontânea, riso leve e descontração plena",
    medo: "A seriedade rígida e o tédio existencial",
    superpoder: "Humor inteligente e habilidade de aliviar pesos",
    imagem: "https://storage.googleapis.com/gen-lang-client-0513318140.firebasestorage.app/bibliotecas/scalla_records/scallarecords/Tolo.webp",
    sombra: "Frivolidade excessiva e fuga de responsabilidades sérias"
  },
  homem_comum: {
    desejo: "Conectar-se com a simplicidade e pertencer com sinceridade",
    medo: "Ser excluído do grupo ou rejeitado por sua simplicidade",
    superpoder: "Empatia pé no chão e fidelidade ao cotidiano",
    imagem: "https://storage.googleapis.com/gen-lang-client-0513318140.firebasestorage.app/bibliotecas/scalla_records/scallarecords/CaraComum.webp",
    sombra: "Conformismo excessivo e perda da voz própria"
  },
  governante: {
    desejo: "Organizar o caos, guiar e prosperar coletivamente",
    medo: "A perda de controle, a ruína e a desordem do ambiente",
    superpoder: "Liderança responsável e poder de prover segurança",
    imagem: "https://storage.googleapis.com/gen-lang-client-0513318140.firebasestorage.app/bibliotecas/scalla_records/scallarecords/Governante.webp",
    sombra: "Rigidez controladora e autoritarismo defensivo"
  }
};

export const TEXTO_PADRAO = `Eu tenho o dom de ver além do óbvio, trazendo clareza para a vida. Minha essência irradia otimismo puro, renovando a leveza de recomeçar. Minha jornada busca novos caminhos rumo à minha liberdade interior.

Eu sei acolher com generosidade, sendo porto seguro para as pessoas. Eu ajo com coragem inabalável, determinado a vencer com honra. Eu tenho a força sutil de transformar meus sonhos em realidade.

Eu penso fora dos padrões com ousadia, abrindo caminhos para o novo. Minha força criativa dá forma à imaginação, superando barreiras. Meu valor reside no afeto profundo que dedico a todas as relações.

Eu trago a sabedoria do riso leve, aliviando os pesos do cotidiano.`;
