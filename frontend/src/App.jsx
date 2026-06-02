import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, Play, BookOpen, Layers, Settings, ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
  Sparkles, CheckCircle2, Circle, LogOut, ArrowRight, ShieldCheck, 
  Info, Cpu, FolderOpen, Image as ImageIcon, Send, Sliders, RefreshCw, User,
  Volume2, VolumeX
} from 'lucide-react';

const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" 
  ? "http://localhost:8000" 
  : "";

// Seeds de Mídias para a Biblioteca / Almoxarifado
const SEED_IMAGES = [
  { id: 1, url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500", name: "Jeep Renegade (Aventura)" },
  { id: 2, url: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=500", name: "Hyundai Ioniq (Futurista)" },
  { id: 3, url: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=500", name: "BYD Song Plus (Estilo)" },
  { id: 4, url: "https://images.unsplash.com/photo-1621007947382-cc347941150e?w=500", name: "Toyota Hilux (Lamas)" },
  { id: 5, url: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=500", name: "Porsche Taycan (Estética)" }
];

const ARCHETYPES = [
  { id: 'sabio', name: 'Sábio', desc: 'O Sábio é aquela parte de você que busca silenciar o barulho do mundo para escutar a própria verdade. Ele representa a sua capacidade de refletir antes de agir, de observar além do óbvio e de valorizar o aprendizado constante. Ter esse lado ativo significa que você encontra paz na quietude, prefere conversas profundas e busca entender a lógica das coisas. Mas cuidado: o excesso de racionalidade pode afastar você das suas emoções. Use sua sabedoria para iluminar o seu caminho, mantendo sempre o coração aberto.', color: '#D4AF37', shadow: 'Sombra: Isolamento na frieza da mente e distanciamento das emoções.', seedUrl: 'https://storage.googleapis.com/gen-lang-client-0513318140.firebasestorage.app/bibliotecas/scalla_records/scallarecords/Sabio.webp' },
  { id: 'inocente', name: 'Inocente', desc: 'O Inocente é aquela parte de você que escolhe enxergar a beleza e a pureza nas coisas simples da vida. Ele representa o seu otimismo espontâneo, a capacidade de confiar e a busca constante pela felicidade leve e sem complicações. Ter esse lado forte significa que você mantém viva a fé no futuro e o dom de recomeçar sempre com o coração limpo. Mas atenção: a busca por um mundo perfeito pode fazer você negar realidades difíceis. Preserve sua leveza, mantendo os pés firmes no chão.', color: '#4D90FE', shadow: 'Sombra: Ingenuidade excessiva e negação de realidades dolorosas.', seedUrl: 'https://storage.googleapis.com/gen-lang-client-0513318140.firebasestorage.app/bibliotecas/scalla_records/scallarecords/Inocente.webp' },
  { id: 'explorador', name: 'Explorador', desc: 'O Explorador é aquela chama interna que impulsiona você a buscar liberdade e a descobrir novos caminhos na jornada da vida. Ele representa a sua coragem de romper a rotina, o desejo de autenticidade e o amor pela independência. Ter esse lado ativo significa que você se renova com o desconhecido e detesta qualquer sentimento de aprisionamento. Mas cuidado: o medo de criar raízes pode gerar uma eterna inconstância. Lembre-se de que a maior de todas as viagens acontece dentro de você.', color: '#34A853', shadow: 'Sombra: Inconstância e dispersão pelo medo de criar raízes.', seedUrl: 'https://storage.googleapis.com/gen-lang-client-0513318140.firebasestorage.app/bibliotecas/scalla_records/scallarecords/Explorador.webp' },
  { id: 'cuidador', name: 'Cuidador', desc: 'O Cuidador é aquela força amorosa em você que encontra propósito em apoiar, proteger e nutrir a vida ao seu redor. Ele representa a sua generosidade natural, a compaixão sincera e a capacidade de criar ambientes seguros e acolhedores. Ter esse lado ativo significa que o bem-estar do outro é sagrado para você. Mas preste atenção: doar-se sem limites pode levar ao esquecimento das suas próprias necessidades. Lembre-se de que cuidar de si mesmo é o primeiro passo para poder cuidar do mundo.', color: '#EA4335', shadow: 'Sombra: Martírio e esgotamento por negligenciar a si próprio.', seedUrl: 'https://storage.googleapis.com/gen-lang-client-0513318140.firebasestorage.app/bibliotecas/scalla_records/scallarecords/Cuidador.webp' },
  { id: 'heroi', name: 'Herói', desc: 'O Herói é aquela força guerreira em você que se recusa a desistir diante dos obstáculos e das injustiças. Ele representa a sua determinação obstinada, a coragem de assumir batalhas difíceis e a busca constante por superação pessoal. Ter esse lado ativo significa que você se fortalece no desafio e busca proteger quem ama. Mas fique alerta: a necessidade constante de lutar pode transformá-lo em alguém rígido ou obcecado por vitórias. Aprenda que a verdadeira força também sabe quando descansar.', color: '#E06666', shadow: 'Sombra: Rigor excessivo e obsessão por estar sempre em combate.', seedUrl: 'https://storage.googleapis.com/gen-lang-client-0513318140.firebasestorage.app/bibliotecas/scalla_records/scallarecords/Heroi.webp' },
  { id: 'mago', name: 'Mago', desc: 'O Mago é aquela parte intuitiva de você que acredita que a realidade pode ser transformada a partir de uma visão interna profunda. Ele representa a sua capacidade de manifestar sonhos, de compreender o invisível e de catalisar mudanças profundas na vida cotidiana. Ter esse lado ativo significa que você enxerga conexões onde outros veem caos e busca criar o extraordinário. Mas atenção: o apego ao controle mental pode afastar você da simplicidade do mundo físico. Use sua magia com os pés no chão.', color: '#93C47D', shadow: 'Sombra: Manipulação da realidade e distanciamento do mundo real.', seedUrl: 'https://storage.googleapis.com/gen-lang-client-0513318140.firebasestorage.app/bibliotecas/scalla_records/scallarecords/Mago.webp' },
  { id: 'rebelde', name: 'Rebelde', desc: 'O Rebelde é aquela voz autêntica em você que questiona as regras vazias e se recusa a viver sob moldes impostos pelos outros. Ele representa a sua liberdade de pensar diferente, a coragem de quebrar padrões obsoletos e o desejo de revolução pessoal. Ter esse lado ativo significa que você valoriza a sua individualidade acima de tudo e busca a mudança real. Mas cuidado: a revolta cega pode levar ao isolamento ou à destruição sem propósito. Direcione sua força para construir o novo.', color: '#F6B26B', shadow: 'Sombra: Rebeldia vazia e destruição sem causa legítima.', seedUrl: 'https://storage.googleapis.com/gen-lang-client-0513318140.firebasestorage.app/bibliotecas/scalla_records/scallarecords/Rebelde.webp' },
  { id: 'criador', name: 'Criador', desc: 'O Criador é aquela força expressiva em você que sente a necessidade urgente de dar forma à imaginação e de trazer algo novo ao mundo. Ele representa o seu impulso artístico, a busca pela originalidade e o desejo de deixar uma marca pessoal duradoura. Ter esse lado ativo significa que você enxerga potencial criativo em cada detalhe da vida. Mas preste atenção: o perfeccionismo extremo pode paralisar as suas mãos e impedir você de entregar sua arte. Liberte suas criações com amor.', color: '#FFD966', shadow: 'Sombra: Perfeccionismo extremo que paralisa e impede a entrega.', seedUrl: 'https://storage.googleapis.com/gen-lang-client-0513318140.firebasestorage.app/bibliotecas/scalla_records/scallarecords/Criador.webp' },
  { id: 'amante', name: 'Amante', desc: 'O Amante é aquela energia sensível em você que busca conexão profunda, beleza e harmonia em todas as relações humanas. Ele representa a sua capacidade de se entregar com paixão, de valorizar o afeto e de viver com intensidade sensorial e emocional. Ter esse lado ativo significa que você coloca o amor e a beleza no centro do seu caminho. Mas cuidado: o medo de ficar só ou de ser rejeitado pode fazer você anular a sua própria identidade. Lembre-se de amar a si mesmo primeiro.', color: '#C27BA0', shadow: 'Sombra: Anulação pessoal e perda de identidade para agradar.', seedUrl: 'https://storage.googleapis.com/gen-lang-client-0513318140.firebasestorage.app/bibliotecas/scalla_records/scallarecords/Amante.webp' },
  { id: 'tolo', name: 'Tolo', desc: 'O Tolo é aquela parte leve e espontânea de você que escolhe viver o momento presente com alegria, humor e diversão contagiante. Ele representa a sua capacidade de rir de si mesmo, de simplificar o que parece pesado e de trazer sorrisos ao dia a dia. Ter esse lado active significa que você valoriza a leveza e sabe que a vida é um jogo belo. Mas atenção: usar o riso como escudo pode esconder sentimentos que precisam ser acolhidos com seriedade. Divirta-se sem fugir de si.', color: '#8E7CC3', shadow: 'Sombra: Frivolidade excessiva e fuga de responsabilidades sérias.', seedUrl: 'https://storage.googleapis.com/gen-lang-client-0513318140.firebasestorage.app/bibliotecas/scalla_records/scallarecords/Tolo.webp' },
  { id: 'homem_comum', name: 'Homem Comum', desc: 'O Homem Comum é aquela parte realista e acolhedora em você que valoriza a igualdade, a simplicidade e a conexão genuína com os outros. Ele representa o seu senso de comunidade, a empatia pé no chão e o desejo de pertencer sem precisar fingir ser quem não é. Ter esse lado ativo significa que você é confiável, valoriza a honestidade simples e respeita a todos igualmente. Mas cuidado: o medo de se destacar pode apagar o brilho da sua voz individual. Lembre-se de sua singularidade.', color: '#858585', shadow: 'Sombra: Conformismo excessivo e perda da voz própria.', seedUrl: 'https://storage.googleapis.com/gen-lang-client-0513318140.firebasestorage.app/bibliotecas/scalla_records/scallarecords/CaraComum.webp' },
  { id: 'governante', name: 'Governante', desc: 'O Governante é aquela força de liderança em você que busca criar ordem, estabilidade e prosperidade para a sua família e comunidade. Ele representa a sua capacidade de assumir responsabilidades, de organizar o caos e de guiar com segurança e clareza. Ter esse lado ativo significa que você é o pilar que sustenta e protege os outros nos momentos difíceis. Mas fique atento: a obsessão pelo controle pode gerar rigidez e afastar as pessoas. Lidere sempre com o coração aberto.', color: '#E09E25', shadow: 'Sombra: Rigidez controladora e autoritarismo defensivo.', seedUrl: 'https://storage.googleapis.com/gen-lang-client-0513318140.firebasestorage.app/bibliotecas/scalla_records/scallarecords/Governante.webp' }
];

const ARCHETYPE_DETAILS = {
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
    sombra: "Ingenuidade excessiva e negação de realidades dolorosas"
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
const TEXTO_PADRAO = `Eu tenho o dom de ver além do óbvio, trazendo clareza para a vida. Minha essência irradia otimismo puro, renovando a leveza de recomeçar. Minha jornada busca novos caminhos rumo à minha liberdade interior.

Eu sei acolher com generosidade, sendo porto seguro para as pessoas. Eu ajo com coragem inabalável, determinado a vencer com honra. Eu tenho a força sutil de transformar meus sonhos em realidade.

Eu penso fora dos padrões com ousadia, abrindo caminhos para o novo. Minha força criativa dá forma à imaginação, superando barreiras. Meu valor reside no afeto profundo que dedico a todas as relações.

Eu trago a sabedoria do riso leve, aliviando os pesos do cotidiano.`;




export default function App() {
  // --- CONFIGURAÇÃO EXPERIMENTAL DO DEGRADÊ DO COCKPIT ---
  // Para alternar ou reverter, basta trocar as variáveis abaixo:
  const GRADIENT_2_TONES = "linear-gradient(to bottom, #383838 0%, #0D0D0D 25%)";
  const GRADIENT_3_TONES = "linear-gradient(to bottom, #383838 0%, #222222 20%, #000000 40%)";
  const GRADIENT_3_TONES_INVERTED = "linear-gradient(to bottom, #000000 0%, #000000 60%, #222222 80%, #383838 100%)";
  
  const ACTIVE_COCKPIT_GRADIENT = GRADIENT_3_TONES; // Coluna 1 Card (Prata em cima, Preto embaixo)
  const ACTIVE_PLAYER_GRADIENT = GRADIENT_3_TONES_INVERTED; // Player Central (Preto em cima, Prata embaixo)

  // --- ESTADO GLOBAL ---
  const [activeView, setActiveView] = useState("servicos"); // storyboard, servicos, almoxarifado, admin_console
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // Google Morph Login Sequence States
  const [loginStage, setLoginStage] = useState("email"); // "email" ou "google"
  const [enteredEmail, setEnteredEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const passwordInputRef = useRef(null);
  
  // Router Guard de Roteamento Dinâmico
  const [hasPersonaDefined, setHasPersonaDefined] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState("video"); // "video" ou "matriz"

  // --- AUDIO & ARQUÉTIPOS DINÂMICOS ---
  const [hoveredArchetype, setHoveredArchetype] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.35);

  const [audio] = useState(() => {
    const a = new Audio('/audios/Trilha_Arquetipos.mp3');
    a.loop = true;
    return a;
  });

  useEffect(() => {
    audio.muted = isMuted;
    // Percepção auditiva humana ajustada via escala quadrática (suavidade perfeita)
    audio.volume = Math.pow(volume, 2);
  }, [isMuted, volume, audio]);

  useEffect(() => {
    if (!isMuted) {
      audio.play().catch(err => {
        console.log("Autoplay bloqueado pelo navegador:", err);
      });
    } else {
      audio.pause();
    }
  }, [isMuted, audio]);

  useEffect(() => {
    return () => {
      audio.pause();
    };
  }, [audio]);

  // Garantia de Auto-Foco instantâneo na transição para a tela de senha (mecanismo à prova de falhas do browser)
  useEffect(() => {
    if (loginStage === "google" && passwordInputRef.current) {
      const timer = setTimeout(() => {
        passwordInputRef.current.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [loginStage]);

  // Novo Onboarding de Dosagem de Personas
  const [dosagemPersona, setDosagemPersona] = useState({
    sabio: 50, inocente: 50, explorador: 50, cuidador: 50,
    heroi: 50, mago: 50, rebelde: 50, criador: 50,
    amante: 50, tolo: 50, homem_comum: 50, governante: 50
  });
  const [currentDimIndex, setCurrentDimIndex] = useState(0); // 0=Alma, 1=Ação, 2=Social, 3=Matriz
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const [selectedPersonaIdx, setSelectedPersonaIdx] = useState(0);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [microServicesState, setMicroServicesState] = useState({
    legendas: true,
    roteiro: false,
    webp: true,
    video: false
  });
  const [tags, setTags] = useState(["luxo", "alta-costura"]);
  const [tagInput, setTagInput] = useState("");
  const [expandedSection, setExpandedSection] = useState("pre"); // "pre", "pro", "pos"
  const [postType, setPostType] = useState("reels"); // "reels", "carrossel", "imagem_unica"
  const [postQty, setPostQty] = useState(1);
  const [personaConfirmed, setPersonaConfirmed] = useState(false);
  const [agendamentoData, setAgendamentoData] = useState("");
  const [agendamentoHora, setAgendamentoHora] = useState("");
  const isPremium = isLoggedIn && userEmail !== "free@killerskills.com.br";

  const getPromptMestre = () => {
    const sorted = Object.entries(dosagemPersona).sort((a, b) => b[1] - a[1]);
    const top1 = ARCHETYPES.find(a => a.id === sorted[0][0]) || ARCHETYPES[0];
    const top2 = ARCHETYPES.find(a => a.id === sorted[1][0]) || ARCHETYPES[1];
    
    return `PROMPT DNA ARQUETÍPICO:
[VETOR MEVA ATIVO]
${sorted.map(([k, v]) => `  - ${k.toUpperCase()}: ${v}%`).join('\\n')}

[ESSÊNCIA DOMINANTE]
Primeiro Arquétipo: ${top1.name} (${sorted[0][1]}%)
Segundo Arquétipo: ${top2.name} (${sorted[1][1]}%)

[DIRETRIZES DE VOZ]
- Tom de marca guiado pelo arquétipo ${top1.name} (Top 1) e temperado pela expressão do ${top2.name} (Top 2).
- Estética minimalista high-end, linguagem elegante, inteligente e direcionada ao mercado premium.
- Evitar jargões industriais, clichês de marketing e tom barulhento.`;
  };
  const [storyboardData, setStoryboardData] = useState([
    "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500", // Jeep
    "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=500", // Hyundai
    null,
    null
  ]);
  const [activeSlot, setActiveSlot] = useState(null);
  const [txtLegenda, setTxtLegenda] = useState("Legenda Estratégica original...");
  const [aiInsightText, setAiInsightText] = useState("Selecione fotos para análise...");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isLegendaLoading, setIsLegendaLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("scallarecords");
  
  // Lista de 24 Personas
  const [personas, setPersonas] = useState([]);
  const [showForgeModal, setShowForgeModal] = useState(false);
  const [forgeProgress, setForgeProgress] = useState(0);
  const [forgeData, setForgeData] = useState(null);

  // Carregar Personas do Backend no startup
  useEffect(() => {
    fetch(`${API_BASE}/api/personas`)
      .then(res => res.json())
      .then(data => setPersonas(data))
      .catch(err => console.error("Erro ao carregar personas do backend:", err));
  }, []);

  // --- LÓGICA DE AÇÕES ---
  const triggerGoogleAuthSequence = (email = "artz.genera@gmail.com") => {
    setUserEmail(email);
    setIsLoggedIn(true);
    setIsAdminMode(email === "artz.genera@gmail.com" || email === "sinkando@gmail.com");

    // Todos os acessos passam pelo Onboarding Perfeito de 5 telas (Login 1, Login 2, Vídeo, Contemplação, Sliders)
    setHasPersonaDefined(false);
    setOnboardingStep("video");
    setActiveView("servicos");

    // Entra tocando a trilha sonora com 20% do volume como default
    setIsMuted(false);
    setVolume(0.20);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail("");
    setIsAdminMode(false);
    setActiveView("storyboard");
    setLoginStage("email");
    setLoginPassword("");
    setIsMuted(true); // Silencia a trilha sonora no logout
  };

  const runAiAnalysis = async () => {
    const activeMedia = storyboardData.filter(x => x !== null);
    if (activeMedia.length === 0) return;

    setIsAiLoading(true);
    setAiInsightText("O Co-Diretor está analisando as imagens... 🧠⚡");

    try {
      const res = await fetch(`${API_BASE}/api/ai/analysis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storyboard: activeMedia })
      });
      const data = await res.json();
      setAiInsightText(data.insight);
    } catch (e) {
      setAiInsightText("Erro ao conectar à IA: " + e.message);
    } finally {
      setIsAiLoading(false);
    }
  };

  const runAiCaption = async () => {
    setIsLegendaLoading(true);
    setTxtLegenda("Gerando legenda estratégica... ✍️");

    try {
      const res = await fetch(`${API_BASE}/api/ai/caption`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storyboard: storyboardData })
      });
      const data = await res.json();
      setTxtLegenda(data.caption);
    } catch (e) {
      setTxtLegenda("Erro ao gerar legenda: " + e.message);
    } finally {
      setIsLegendaLoading(false);
    }
  };

  const triggerForge = async () => {
    const sortedDosagens = Object.entries(dosagemPersona).sort((a, b) => b[1] - a[1]);
    const archTop1 = ARCHETYPES.find(a => a.id === sortedDosagens[0][0]) || ARCHETYPES[0];
    const archTop2 = ARCHETYPES.find(a => a.id === sortedDosagens[1][0]) || ARCHETYPES[1];
    const combinedTitle = `${archTop1.name.toUpperCase()} / ${archTop2.name.toUpperCase()}`;

    setShowForgeModal(true);
    setForgeProgress(20);

    try {
      const res = await fetch(`${API_BASE}/api/forge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona_title: combinedTitle,
          persona_tag: isPremium ? "Premium" : "Free",
          micro_services: {
            ...microServicesState,
            tags: tags.join(", ")
          },
          dosagem: dosagemPersona,
          post_type: postType,
          post_qty: postQty,
          agendamento_data: agendamentoData,
          agendamento_hora: agendamentoHora,
          persona_confirmada: personaConfirmed
        })
      });
      setForgeProgress(60);
      const data = await res.json();
      setForgeProgress(100);
      setForgeData(data);
    } catch (e) {
      console.error(e);
      setForgeProgress(100);
    }
  };

  const handleForgeClose = () => {
    setShowForgeModal(false);
    setForgeProgress(0);
    setForgeData(null);
    setActiveView("storyboard");
  };

  const scrollPersona = (direction) => {
    if (activePersonasList.length === 0) return;
    setIsPortalOpen(false); // Fechar portal ao rolar verticalmente para ver o Card da nova persona
    if (direction === "up") {
      setSelectedPersonaIdx((prev) => (prev - 1 + activePersonasList.length) % activePersonasList.length);
    } else {
      setSelectedPersonaIdx((prev) => (prev + 1) % activePersonasList.length);
    }
  };

  const toggleMs = (key) => {
    setMicroServicesState(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const selectMediaFromLibrary = (url) => {
    if (activeSlot !== null) {
      const copy = [...storyboardData];
      copy[activeSlot] = url;
      setStoryboardData(copy);
      setActiveSlot(null);
      setActiveView("storyboard");
    }
  };

  // --- RENDERS DE TELA ---

  const handleEmailSubmit = async () => {
    if (enteredEmail.trim() === "" || !enteredEmail.includes("@")) {
      alert("Por favor, insira um e-mail válido!");
      return;
    }
    
    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: enteredEmail.trim() })
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        setLoginStage("google");
      } else {
        alert(data.detail || "E-mail não cadastrado em nosso sistema!");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar ao servidor de autenticação. Verifique se o backend está rodando!");
    }
  };

  const handlePasswordSubmit = () => {
    if (loginPassword.trim() === "") {
      alert("Por favor, digite sua senha para entrar!");
      return;
    }
    triggerGoogleAuthSequence(enteredEmail);
  };

  // 1. TELA DE LOGIN (SMARTPHONE DE GLOWS AZUL/DOURADO)
  if (!isLoggedIn) {
    return (
      <div className="relative w-screen h-screen flex justify-center items-center bg-black overflow-hidden select-none animate-fade-in">
        {/* Breathing Lilac & Emerald Sacred Background */}
        <div className="smoke-bg-container">
          <div className="smoke-cloud-1" />
          <div className="smoke-cloud-2" />
          <div className="smoke-cloud-3" />
        </div>

        {/* Smartphone Container */}
        <div 
          className="relative w-[340px] h-[550px] bg-[#0A0A0C] border border-white/10 rounded-lg p-4 flex flex-col justify-between items-center shadow-2xl transition-all duration-500"
        >
          {/* Visor Interno */}
          <div className="w-full h-full bg-[#050505] rounded-lg border border-white/5 flex flex-col justify-center items-center p-6 text-center z-10 text-white relative">
            {loginStage === "email" ? (
              /* ETAPA 1: DIGITAR E-MAIL DE ACESSO */
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  await handleEmailSubmit();
                }}
                className="w-full flex flex-col items-center justify-center animate-fade-in"
              >
                {/* Cabeçalho da Tela 0 (Âncora de Altura Fixa para Sincronia Espacial - Deslocado 30px para Cima) */}
                <div className="h-[96px] flex flex-col items-center justify-center mb-[54px]">
                  {/* Logo Metálica */}
                  <div className="text-3xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-brand-gold via-white to-brand-blue mb-1">
                    KILLER SKILLS
                  </div>
                  <div className="text-[9px] font-bold tracking-widest text-[#1E60FF] uppercase">
                    KS Studio
                  </div>
                </div>

                {/* Entrada de Email */}
                <div className="w-full flex flex-col gap-1.5 text-left mb-6">
                  <input 
                    type="email" 
                    autoFocus
                    value={enteredEmail}
                    onChange={(e) => setEnteredEmail(e.target.value)}
                    placeholder="nome@exemplo.com"
                    className="w-full h-11 bg-white/[0.03] border border-white/10 rounded-lg px-4 text-xs text-white placeholder-white/20 focus:outline-none focus:border-brand-blue/50 duration-200"
                  />
                </div>

                {/* Botão de Avanço */}
                <button 
                  type="submit"
                  className="btn-login-avancar mb-6"
                >
                  AVANÇAR <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* ETAPA 2: GOOGLE SIGN-IN MORPH */
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handlePasswordSubmit();
                }}
                className="w-full flex flex-col items-center justify-center animate-fade-in"
              >
                {/* Cabeçalho da Tela 0A (Symmetrical height and spacing - Deslocado 30px para Cima) */}
                <div className="h-[96px] flex flex-col items-center justify-center mb-[54px]">
                  {/* Google Logo SVG - Ampliado e Elevado */}
                  <svg className="w-12 h-12 mb-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>

                  <h3 className="text-[10px] font-poppins-light text-white/50 uppercase tracking-widest">
                    Entre Com a Conta Desejada
                  </h3>
                </div>

                {/* Entrada de Senha */}
                <div className="w-full flex flex-col gap-1.5 text-left mb-6">
                  <input 
                    type="password"
                    ref={passwordInputRef}
                    autoFocus
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Digite sua Senha"
                    className="w-full h-11 bg-white/[0.03] border border-white/10 rounded-lg px-4 text-xs text-white placeholder-white/20 focus:outline-none focus:border-brand-blue/50 duration-200"
                  />
                </div>

                {/* Botão de Entrada */}
                <button 
                  type="submit"
                  className="w-full btn-login-avancar mb-6"
                >
                  ENTRAR
                </button>
              </form>
            )}

            <div className="text-[9px] font-bold text-white/10 tracking-widest uppercase">
              KS STUDIO v4.0
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- MOCK DAS PERSONAS E SEGURANÇAS ---
  const activePersonasList = personas.length > 0 ? personas : Array.from({ length: 12 }, (_, i) => ({
    title: `Persona ${String(i + 1).padStart(2, '0')}`,
    subtitle: `Arquétipo Pessoal ${i + 1}`,
    desc: `Exploração do arquétipo místico número ${i + 1}`,
    color: i % 2 === 0 ? "#1E60FF" : "#d4af37",
    tag: "Pessoal",
    icon: "User"
  }));

  const currentPersona = activePersonasList[selectedPersonaIdx] || activePersonasList[0];
  const activeArch = onboardingStep === "matriz" ? (hoveredArchetype || ARCHETYPES[0]) : null;
  const isMetamorphosed = activeView === "servicos" && onboardingStep === "matriz" && activeArch;
  const showPersonaCard = isMetamorphosed || (activeView === "servicos_escolha");


  return (
    <div className="relative w-screen h-screen bg-black flex overflow-hidden text-white antialiased select-none z-10">
      {/* Breathing Lilac & Emerald Sacred Background */}
      <div className="smoke-bg-container">
        <div className="smoke-cloud-1" />
        <div className="smoke-cloud-2" />
        <div className="smoke-cloud-3" />
      </div>

      {/* 1. BARRA LATERAL METÁLICA PREMIUM */}
      <div className="w-[320px] z-10 flex flex-col justify-between p-5 border-r border-white/10 bg-[#0A0A0A] relative overflow-hidden transition-all duration-500">
        
        {/* ESTADO A: MENU PADRÃO */}
        <div className={`w-full h-full flex flex-col justify-between transition-all duration-500 ease-in-out ${showPersonaCard ? "opacity-0 scale-95 pointer-events-none absolute inset-5" : "opacity-100 scale-100"}`}>
          <div className="flex flex-col">
            {/* Bloco de Identidade: Marca + Conta do Usuário (Espaçamento Luxuoso) */}
            <div className="flex flex-col gap-8">
              {/* Título do Cockpit */}
              <div className="text-center">
                <div className="text-2xl font-bold tracking-tight text-white/90">Killer Skills</div>
                <div className="text-[9px] font-bold tracking-wider uppercase text-brand-blue">
                  KS STUDIO
                </div>
              </div>

              {/* Card do Usuário (Mesma Altura e Estilo dos Itens do Menu) */}
              <div className="w-full h-11 px-4 rounded-lg flex items-center justify-start gap-3 bg-white/5 border border-white/5 shrink-0">
                <div className={`w-5 h-5 rounded-full flex justify-center items-center font-bold text-[9px] shrink-0 ${isAdminMode ? "bg-brand-gold text-black" : "bg-brand-blue text-white"}`}>
                  {userEmail.substring(0, 2).toUpperCase()}
                </div>
                <div className="text-xs font-semibold text-white/70 overflow-hidden text-ellipsis whitespace-nowrap">
                  {userEmail}
                </div>
              </div>
            </div>

            {/* Divisor de Seção (Posicionado Mais Abaixo para Dar uma Respirada) */}
            <hr className="border-white/10 mt-10 mb-8" />

            {/* Menu de Áreas de Trabalho (Deslocado mais para baixo com espaçamento amplo) */}
            <div className="flex flex-col gap-2 pt-2">
              
              <button 
                onClick={() => setActiveView("servicos")}
                className={`w-full h-11 px-4 rounded-lg text-left text-xs font-semibold flex items-center gap-3 duration-200 ${
                  activeView === "servicos" 
                    ? "bg-white/5 border border-white/5 text-white" 
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <User className="w-4 h-4 shrink-0" /> PERSONA
              </button>

              <button 
                onClick={() => setActiveView("servicos_escolha")}
                className={`w-full h-11 px-4 rounded-lg text-left text-xs font-semibold flex items-center gap-3 duration-200 ${
                  activeView === "servicos_escolha" 
                    ? "bg-white/5 border border-white/5 text-white" 
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Cpu className="w-4 h-4 shrink-0" /> SERVIÇOS
              </button>

              <button 
                onClick={() => setActiveView("storyboard")}
                className={`w-full h-11 px-4 rounded-lg text-left text-xs font-semibold flex items-center gap-3 duration-200 ${
                  activeView === "storyboard" 
                    ? "bg-white/5 border border-white/5 text-white" 
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Sparkles className="w-4 h-4 shrink-0" /> KS STUDIO
              </button>
            </div>
          </div>

          {/* Rodapé da Sidebar */}
          <div className="flex flex-col gap-1.5 border-t border-white/10 pt-4">
            {/* Alternador Administrativo de Cockpit */}
            <button 
              onClick={() => {
                if (isAdminMode) {
                  triggerGoogleAuthSequence("scalla_records@gmail.com");
                } else {
                  triggerGoogleAuthSequence("artz.genera@gmail.com");
                }
              }}
              className="w-full h-11 px-4 rounded-lg text-left text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 duration-200 text-white/40 hover:bg-white/5 hover:text-white"
            >
              <ShieldCheck className="w-4 h-4 shrink-0 text-white/40" /> PAINEL ADM
            </button>

            <button 
              onClick={handleLogout}
              className="w-full h-11 px-4 rounded-lg text-left text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 duration-200 text-white/40 hover:bg-brand-pink/10 hover:text-brand-pink"
            >
              <LogOut className="w-4 h-4 shrink-0 text-white/40" /> ENCERRAR SESSÃO
            </button>

            <div className="w-full h-11 px-4 flex items-center gap-3 text-white/40 select-none">
              <div className="w-4 flex justify-center items-center shrink-0">
                <span className="w-2 h-2 bg-green-500 rounded-full active-pulse" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">ONLINE NA WEB</span>
            </div>
          </div>
        </div>

        {/* ESTADO B: GUIA FINO E DETALHADO (ARQUÉTIPOS TEXTOS) */}
        <div className={`w-full h-full flex flex-col justify-between transition-all duration-500 ease-in-out ${showPersonaCard ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none absolute inset-5"}`}>
          {showPersonaCard && (
            <>
              {/* TOPO FIXO: Título Geral */}
              <div className="flex flex-col gap-1 w-full shrink-0 select-none mb-3">
                <h2 
                  className="text-sm uppercase tracking-wider text-white text-center"
                  style={{ fontFamily: 'Poppins', fontWeight: 200 }}
                >
                  {activeView === "servicos_escolha" ? "MYSELF" : "Significado"}
                </h2>
              </div>

              {/* CONTEÚDO DO PORTAL ABAIXO (TEXT PLAYER CARD) */}
              <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                <div 
                  className="flex-1 w-full relative rounded-lg overflow-hidden border border-white/10 shadow-lg p-5 flex flex-col transition-all duration-500"
                  style={{ background: ACTIVE_COCKPIT_GRADIENT }}
                >
                  {activeView === "servicos_escolha" ? (
                    <>
                      {/* Texto-Padrão da Persona em 50% sem scroll, colado na base do card */}
                      <div className="relative z-10 flex-1 flex flex-col justify-end pr-1 select-text">
                        <div className="font-poppins-light text-[12px] leading-relaxed text-justify whitespace-pre-line" style={{ color: '#FFFFFF' }}>
                          {TEXTO_PADRAO}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Descrição Ontológica Poética (Ajustada para preenchimento natural sem scroll) */}
                      <p className="relative z-10 font-poppins-light text-[12px] leading-relaxed text-justify mb-4" style={{ color: '#FFFFFF' }}>
                        {activeArch.desc}
                      </p>

                      {/* Fichas Técnicas Delicadas */}
                      <div className="relative z-10 flex flex-col gap-2.5 pt-3 border-t border-white/5 mt-auto">
                        <div className="flex flex-col text-left">
                          <span className="text-[8px] tracking-wider uppercase font-poppins-light" style={{ color: '#FFFFFF' }}>Desejo Central</span>
                          <span className="text-[10px] font-poppins-light leading-tight" style={{ color: '#FFFFFF' }}>
                            {ARCHETYPE_DETAILS[activeArch.id]?.desejo}
                          </span>
                        </div>

                        <div className="flex flex-col text-left">
                          <span className="text-[8px] tracking-wider uppercase font-poppins-light" style={{ color: '#FFFFFF' }}>Maior Medo</span>
                          <span className="text-[10px] font-poppins-light leading-tight" style={{ color: '#FFFFFF' }}>
                            {ARCHETYPE_DETAILS[activeArch.id]?.medo}
                          </span>
                        </div>

                        <div className="flex flex-col text-left">
                          <span className="text-[8px] tracking-wider uppercase font-poppins-light" style={{ color: '#FFFFFF' }}>Superpoder</span>
                          <span className="text-[10px] font-poppins-light leading-tight" style={{ color: '#FFFFFF' }}>
                            {ARCHETYPE_DETAILS[activeArch.id]?.superpoder}
                          </span>
                        </div>

                        <div className="flex flex-col text-left">
                          <span className="text-[8px] tracking-wider uppercase font-poppins-light" style={{ color: '#FFFFFF' }}>Sombra</span>
                          <span className="text-[10px] font-poppins-light leading-tight" style={{ color: '#FFFFFF' }}>
                            {ARCHETYPE_DETAILS[activeArch.id]?.sombra}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

      </div>

      {/* 2. CONTEÚDO PRINCIPAL (COMPLETAMENTE ADAPTÁVEL) */}
      <div className="flex-1 bg-[#050505] p-10 flex flex-col justify-center items-center overflow-hidden">
        
        {/* TELA 1: SERVIÇOS AI (SMARTPHONE DE PLAYBACK - RITUAL GERAR PERSONA) */}
        {activeView === "servicos" && (() => {
          // Lógica do Título de Persona Combinado para a Matriz de Síntese
          const sortedDosagens = Object.entries(dosagemPersona).sort((a, b) => b[1] - a[1]);
          const archTop1 = ARCHETYPES.find(a => a.id === sortedDosagens[0][0]) || ARCHETYPES[0];
          const archTop2 = ARCHETYPES.find(a => a.id === sortedDosagens[1][0]) || ARCHETYPES[1];
          const combinedTitle = `${archTop1.name} ${archTop2.name}`;

          const activeArch = onboardingStep === "matriz" ? (hoveredArchetype || ARCHETYPES[0]) : null;

          return (
            <div className="relative w-full h-full flex justify-center items-center">

              {/* Mockup do Celular Central (Posicionado Fixed para Centramento Perfeito) */}
              <div 
                className="fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[340px] h-[550px] bg-[#0A0A0C] border border-white/10 rounded-lg p-4 flex flex-col justify-between items-center shadow-2xl transition-all duration-300 z-30" 
              >
                {/* Visor Interno */}
                {/* Visor Interno (Fundo preto removido em Tela1A e Tela1B para renderização direta no Player) */}
                <div 
                  className="w-full h-full flex flex-col justify-between relative overflow-hidden z-10 select-none text-white bg-transparent border-0 p-0"
                >
                  {onboardingStep === "video" ? (
                    /* TELA 1A - LETREIRO 1 (OS ARQUÉTIPOS DE JUNG) */
                    <div key="screen-1a" className="w-full h-full flex flex-col justify-between p-0 select-none relative">
                      
                      {/* Card da Imagem com Bordas Arredondadas e Cinza Clarinho (Flex-1 para preencher todo o espaço) */}
                      <div className="relative w-full flex-1 rounded-lg overflow-hidden border border-white/10 shadow-2xl bg-white/[0.02] mb-4">
                        <img 
                          key="img-1a"
                          src="https://storage.googleapis.com/gen-lang-client-0513318140.firebasestorage.app/bibliotecas/scalla_records/scallarecords/Tela1A.webp" 
                          className="w-full h-full object-cover brightness-[0.6]" 
                          alt="AI Guide"
                        />
                        {/* Letreiro 1 Overlay Inside Card (Top Position) */}
                        <div className="absolute top-3 left-0 right-0 w-full overflow-hidden whitespace-nowrap bg-black/80 backdrop-blur-[2px] py-3 border-y border-white/[0.06] z-20">
                          <div className="inline-block whitespace-nowrap animate-marquee text-[20px] font-poppins-light text-gold-dress tracking-widest uppercase">
                            ♥ Os 12 Arquétipos de Jung ♥ &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
                            ♥ Os 12 Arquétipos de Jung ♥ &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
                            ♥ Os 12 Arquétipos de Jung ♥ &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
                            ♥ Os 12 Arquétipos de Jung ♥ &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
                          </div>
                        </div>
                      </div>

                      {/* Botão de Avanço para a Identificação */}
                      <button 
                        onClick={() => setOnboardingStep("identificacao")}
                        className="btn-dashboard-avancar z-10 mt-auto"
                      >
                        AVANÇAR <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : onboardingStep === "identificacao" ? (
                    /* TELA 1B - LETREIRO 2 (COM QUAIS ARQUÉTIPOS VOCÊ SE IDENTIFICA?) */
                    <div key="screen-1b" className="w-full h-full flex flex-col justify-between p-0 select-none relative">
                      
                      {/* Card da Imagem com Bordas Arredondadas e Cinza Clarinho (Flex-1 para preencher todo o espaço) */}
                      <div className="relative w-full flex-1 rounded-lg overflow-hidden border border-white/10 shadow-2xl bg-white/[0.02] mb-4">
                        <img 
                          key="img-1b"
                          src="https://storage.googleapis.com/gen-lang-client-0513318140.firebasestorage.app/bibliotecas/scalla_records/scallarecords/Tela1B.webp" 
                          className="w-full h-full object-cover brightness-[0.6] translate-y-[30px]" 
                          alt="Archetype Study"
                        />
                        {/* Letreiro 2 Overlay Inside Card (Top Position) */}
                        <div className="absolute top-3 left-0 right-0 w-full overflow-hidden whitespace-nowrap bg-black/80 backdrop-blur-[2px] py-3 border-y border-white/[0.06] z-20">
                          <div className="inline-block whitespace-nowrap animate-marquee text-[20px] font-poppins-light text-gold-dress tracking-widest uppercase" style={{ animationDuration: "25s" }}>
                            ♥ O quanto você se identifica com cada Arquétipo? ♥ &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
                            ♥ O quanto você se identifica com cada Arquétipo? ♥ &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
                            ♥ O quanto você se identifica com cada Arquétipo? ♥ &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
                            ♥ O quanto você se identifica com cada Arquétipo? ♥ &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
                          </div>
                        </div>
                      </div>

                      {/* Botão de Avanço para a Matriz */}
                      <button 
                        onClick={() => setOnboardingStep("matriz")}
                        className="btn-dashboard-avancar z-10 mt-auto"
                      >
                        AVANÇAR <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    /* PASSO 3: PAINEL MATRIZ DE SÍNTESE (CALIBRAÇÃO DIRETA COM FUNDO PRETO PREMIUM) */
                    <div key="screen-1c" className="w-full h-full flex flex-col justify-between p-0 select-none relative">
                      
                      {/* Card da Matriz com Bordas Arredondadas e Fundo Grafite Sólido Luxuoso */}
                      <div 
                        className="relative w-full flex-1 rounded-lg overflow-hidden border border-white/10 shadow-2xl mb-4 flex flex-col pt-1 pb-0 px-0 justify-between"
                        style={{ background: ACTIVE_PLAYER_GRADIENT }}
                      >
                        {/* Header do Player Central */}
                        <div className="w-full shrink-0 select-none mt-4 mb-2">
                          <h2 
                            className="text-sm uppercase tracking-wider text-white text-center"
                            style={{ fontFamily: 'Poppins', fontWeight: 200 }}
                          >
                            ESPELHO DA ALMA
                          </h2>
                        </div>
                        
                        {/* Lista de Gradações dos 12 Sliders (Sem Scroll, Totalmente Encaixados e Compactados com Alturas Fixas Simétricas) */}
                        <div className="mb-4 mt-auto overflow-hidden flex flex-col gap-0 h-[384px]">
                          {ARCHETYPES.map((arch) => {
                            return (
                              <div 
                                key={arch.id} 
                                onMouseEnter={() => setHoveredArchetype(arch)}
                                onMouseLeave={() => setHoveredArchetype(null)}
                                className={`flex items-center justify-between text-left border-b border-white/[0.05] px-4 hover:bg-white/[0.08] transition-all duration-200 h-[32px] ${
                                  activeArch?.id === arch.id ? "bg-white/[0.05]" : "bg-white/[0.01]"
                                }`}
                              >
                                {/* Bloco 1 (Nome): Largura fixa de 78px sem o ponto a esquerda e sem negrito para evitar truncamento e corte de perninhas */}
                                <div className="w-[78px] shrink-0 flex items-center text-[11px] font-poppins-light leading-tight">
                                  <span style={{ color: "#EFE5D3" }}>{arch.id === 'homem_comum' ? 'Comum' : arch.name}</span>
                                </div>

                                {/* Bloco 2 (Slider): Se estica para preencher todo o meio do card */}
                                <input 
                                  type="range" 
                                  min="0" 
                                  max="100" 
                                  value={dosagemPersona[arch.id]}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    setDosagemPersona(prev => ({ ...prev, [arch.id]: val }));
                                  }}
                                  className="flex-1 premium-slider-palha mx-2"
                                />

                                {/* Bloco 3 (Porcentagem): Largura fixa de 24px alinhada na direita */}
                                <div className="w-6 shrink-0 text-right text-[9px] font-black text-[#EFE5D3]/70 leading-none">
                                  {dosagemPersona[arch.id]}%
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Botão de Finalização Gerar Persona */}
                      <button 
                        onClick={() => {
                          // Conclui Onboarding e envia diretamente para Tela 2A (Serviços)
                          setHasPersonaDefined(true);
                          setActiveView("servicos_escolha");
                        }}
                        className="btn-dashboard-avancar z-30"
                      >
                        INTEGRAR <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* COLUNA LATERAL DIREITA: Painel Estritamente Simétrico ao Menu Esquerdo (Portal da Persona) */}
              <div className="absolute -right-10 -top-10 -bottom-10 w-[320px] border-l border-white/10 bg-[#0A0A0A] p-5 flex flex-col justify-between z-20 text-left animate-fade-in text-white shadow-2xl">
                
                {/* TOPO FIXO: Título Geral (Dinâmico na Tela 1C refletindo o arquétipo ativo por padrão ou foco) */}
                <div className="flex flex-col gap-1 w-full shrink-0 select-none mb-3">
                  <h2 
                    className="text-sm uppercase tracking-wider text-white text-center"
                    style={{ fontFamily: 'Poppins', fontWeight: 200 }}
                  >
                    {activeArch ? activeArch.name : "Arquétipos"}
                  </h2>
                </div>

                {/* CONTEÚDO DO PORTAL ABAIXO (SEM SCROLL, APENAS FOTO STRETCHED) */}
                <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                  {/* Image Card (Flex-1 para preenchimento vertical perfeito) */}
                  <div 
                    className="flex-1 w-full relative rounded-lg overflow-hidden border border-white/10 shadow-lg group transition-colors duration-500"
                    style={{ backgroundColor: activeArch ? "transparent" : "#090C15" }}
                  >
                    <img 
                      src={
                        activeArch 
                          ? (ARCHETYPE_DETAILS[activeArch.id]?.imagem || activeArch.seedUrl)
                          : "/images/ImagemCapa.jpg"
                      } 
                      className={`w-full h-full duration-700 ${
                        activeArch 
                          ? "object-cover group-hover:scale-105 brightness-[0.8] contrast-[1.05]" 
                          : "object-contain p-4 brightness-[1.0] contrast-[1.0] scale-95"
                      }`}
                      alt={activeArch ? activeArch.name : "Portal da Persona"}
                    />

                  </div>
                </div>

                {/* ALWAYS-VISIBLE AUDIO CONTROLS & BRAND SIGNATURE */}
                <div className="flex flex-col gap-2 pt-4 border-t border-white/10 mt-4 shrink-0">
                  <div className="flex items-center gap-3 text-white/40">
                    <div className="flex items-center gap-1 shrink-0">
                      <button 
                        onClick={() => setIsMuted(!isMuted)} 
                        className="p-1 rounded-lg hover:bg-white/5 hover:text-white transition duration-200 shrink-0"
                      >
                        {isMuted ? <VolumeX className="w-3.5 h-3.5 text-brand-pink" /> : <Volume2 className="w-3.5 h-3.5 text-brand-blue" />}
                      </button>
                      <span className="text-[9px] font-black uppercase tracking-wider whitespace-nowrap">
                        {isMuted ? "Áudio Mutado" : "Trilha Sonora"}
                      </span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="flex-1 premium-slider min-w-[60px]"
                    />
                  </div>
                  <div className="text-[8px] font-black tracking-widest text-center text-white/15 uppercase mt-1">
                    Killer Skills v4.0 • Direção de Arte AI
                  </div>
                </div>
              </div>

            </div>
          );
        })()}

        {/* TELA 2: SERVIÇOS & CONSTRUTOR DE PROMPT */}
        {activeView === "servicos_escolha" && (
          <div className="relative w-full h-full flex justify-center items-center animate-fade-in">

            {/* Mockup do Celular Central (Posicionado Fixed para Centramento Perfeito) */}
            <div className="fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[340px] h-[550px] bg-[#0A0A0C] border border-white/10 rounded-lg p-4 flex flex-col justify-between items-center shadow-2xl transition-all duration-300 z-30">
              {/* Visor Interno */}
              <div className="w-full h-full bg-[#050505] rounded-lg border border-white/5 flex flex-col justify-between p-4 relative overflow-hidden z-10 select-none">
                
                {/* Cabeçalho do Construtor */}
                <div className="w-full shrink-0 select-none mt-2 mb-3">
                  <h2 
                    className="text-[11px] uppercase tracking-widest text-white/50 text-center"
                    style={{ fontFamily: 'Poppins', fontWeight: 200 }}
                  >
                    CONSTRUTOR DE PROMPT
                  </h2>
                </div>

                {/* Bloco Superior: Prompt Mestre Herdado */}
                <div className="w-full flex-1 flex flex-col gap-1 overflow-hidden mb-3">
                  <span className="text-[7.5px] font-bold tracking-widest uppercase text-white/30 text-left pl-1">
                    Prompt Mestre Herdado
                  </span>
                  <div 
                    className="w-full flex-1 bg-black/60 border border-white/5 rounded-lg p-2.5 overflow-y-auto custom-scrollbar-visible text-left text-[8.5px] font-mono text-white/60 leading-relaxed whitespace-pre-wrap select-text selection:bg-brand-blue/30"
                  >
                    {getPromptMestre()}
                  </div>
                </div>

                {/* Bloco Inferior: Console de Modulação por Tags */}
                <div className="w-full shrink-0 flex flex-col gap-1.5 mb-4 text-left">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[7.5px] font-bold tracking-widest uppercase text-white/30">
                      Modulação por Tags ({tags.length}/5)
                    </span>
                    <span className="text-[7px] font-bold text-white/15 uppercase">Limite Máximo</span>
                  </div>

                  {/* Lista de Badges de Tags */}
                  <div className="flex flex-wrap gap-1.5 p-2 bg-white/[0.01] border border-white/5 rounded-lg min-h-[42px] max-h-[76px] overflow-y-auto scrollbar-none">
                    {tags.map((tag, idx) => (
                      <span 
                        key={idx}
                        className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-[8.5px] font-semibold flex items-center gap-1.5 text-white/70 animate-fade-in"
                      >
                        {tag}
                        <button 
                          onClick={() => setTags(prev => prev.filter((_, i) => i !== idx))}
                          className="hover:text-brand-pink duration-150 font-bold text-[9px] focus:outline-none shrink-0"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {tags.length === 0 && (
                      <span className="text-[8px] font-poppins-light text-white/20 italic self-center pl-1">
                        Nenhuma tag ativa...
                      </span>
                    )}
                  </div>

                  {/* Input de Tags */}
                  <div className="relative">
                    <input 
                      type="text"
                      disabled={tags.length >= 5}
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                          e.preventDefault();
                          const val = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
                          if (val && !tags.includes(val) && tags.length < 5) {
                            setTags(prev => [...prev, val]);
                          }
                          setTagInput("");
                        }
                      }}
                      placeholder={tags.length >= 5 ? "Limite atingido (5 tags)" : "Digitar tag (pressione Enter)"}
                      className="w-full h-8 bg-white/[0.02] border border-white/10 rounded-lg px-3 text-[9px] text-white placeholder-white/20 focus:outline-none focus:border-brand-blue/50 duration-200"
                    />
                  </div>
                </div>

                {/* Botão de Emissão de OS na base */}
                <button 
                  onClick={triggerForge}
                  className="w-full h-10 bg-[#EFE5D3] hover:bg-[#F7EFE2] active:scale-95 duration-200 rounded-lg text-black text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 relative z-10 shrink-0 shadow-lg"
                >
                  Emitir Ordem de Serviço <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* COLUNA LATERAL DIREITA: Definições do Post (Acordeões) */}
            <div className="absolute -right-10 -top-10 -bottom-10 w-[320px] border-l border-white/10 bg-[#0A0A0A] p-5 flex flex-col justify-between z-20 text-left animate-fade-in text-white shadow-2xl">
              
              {/* TOPO FIXO: Título Geral */}
              <div className="flex flex-col gap-1 w-full shrink-0 select-none mb-3">
                <h2 
                  className="text-sm uppercase tracking-wider text-white text-center font-extralight"
                  style={{ fontFamily: 'Poppins', fontWeight: 200 }}
                >
                  Definições do Post
                </h2>
              </div>

              {/* CONTEÚDO DO PORTAL: 3 Cards Expansíveis (Acordeões) */}
              <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                <div 
                  className="flex-1 w-full relative rounded-lg overflow-hidden border border-white/10 shadow-lg p-4 flex flex-col justify-between transition-all duration-500"
                  style={{ background: ACTIVE_COCKPIT_GRADIENT }}
                >
                  <div className="flex flex-col gap-2.5 relative z-10 flex-1 overflow-hidden">
                    {/* Header de Assinatura */}
                    <div className="text-[10px] font-bold uppercase tracking-widest border-b border-white/10 pb-2 mb-2 text-center flex flex-col gap-1 select-none shrink-0">
                      <span style={{ color: isPremium ? '#D4AF37' : '#858585' }}>
                        {isPremium ? "★ CONTA PREMIUM ATIVADA ★" : "CONTA GRATUITA (FREE)"}
                      </span>
                    </div>

                    {/* Acordeão Container */}
                    <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1 custom-scrollbar-visible">
                      
                      {/* CARD 1: PRÉ-PRODUÇÃO (DNA Institucional) */}
                      <div className="border border-white/10 rounded-lg overflow-hidden shrink-0 bg-black/20">
                        <div 
                          onClick={() => setExpandedSection(expandedSection === "pre" ? null : "pre")}
                          className="flex items-center justify-between p-2.5 bg-white/[0.02] cursor-pointer hover:bg-white/5 duration-150 select-none"
                        >
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#EFE5D3]">
                            A - Pré-Produção
                          </span>
                          <span className="text-[8px] text-white/30">
                            {expandedSection === "pre" ? "▼" : "▶"}
                          </span>
                        </div>
                        
                        <div className={`transition-all duration-300 overflow-hidden ${
                          expandedSection === "pre" ? "max-h-[160px] p-3 border-t border-white/5" : "max-h-0"
                        }`}>
                          <div className="flex flex-col gap-2">
                            <span className="text-[8px] uppercase tracking-wider text-white/30">
                              Validação da Persona (MEVA)
                            </span>
                            
                            {/* Botão Confirmar Persona */}
                            <button 
                              onClick={() => setPersonaConfirmed(!personaConfirmed)}
                              className={`w-full h-8 rounded-lg text-[9px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 duration-200 ${
                                personaConfirmed 
                                  ? "bg-brand-blue/10 border border-brand-blue/30 text-brand-blue" 
                                  : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10"
                              }`}
                            >
                              {personaConfirmed ? (
                                <>✓ PERSONA CONFIRMADA</>
                              ) : (
                                <>✓ CONFIRMAR PERSONA</>
                              )}
                            </button>

                            {/* Botão Editar Sliders */}
                            <button 
                              disabled={!isPremium}
                              onClick={() => {
                                setActiveView("servicos");
                                setOnboardingStep("matriz");
                              }}
                              className={`w-full h-8 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-[9px] font-bold uppercase tracking-wider duration-200 select-none ${
                                !isPremium ? "opacity-30 cursor-not-allowed" : "text-white/70"
                              }`}
                            >
                              ✎ EDITAR PERSONA {!isPremium && "🔒"}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* CARD 2: PRODUÇÃO (Tipos e Quantidades) */}
                      <div className="border border-white/10 rounded-lg overflow-hidden shrink-0 bg-black/20">
                        <div 
                          onClick={() => setExpandedSection(expandedSection === "pro" ? null : "pro")}
                          className="flex items-center justify-between p-2.5 bg-white/[0.02] cursor-pointer hover:bg-white/5 duration-150 select-none"
                        >
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#EFE5D3]">
                            B - Produção
                          </span>
                          <span className="text-[8px] text-white/30">
                            {expandedSection === "pro" ? "▼" : "▶"}
                          </span>
                        </div>

                        <div className={`transition-all duration-300 overflow-hidden ${
                          expandedSection === "pro" ? "max-h-[380px] p-3 border-t border-white/5" : "max-h-0"
                        }`}>
                          <div className="flex flex-col gap-3">
                            {/* Formato de Post */}
                            <div className="flex flex-col gap-1 text-left">
                              <span className="text-[8px] uppercase tracking-wider text-white/30 pl-1">
                                Formato de Post
                              </span>
                              <select 
                                value={postType}
                                onChange={(e) => {
                                  const t = e.target.value;
                                  setPostType(t);
                                  // Ajustar a quantidade padrão conforme o tipo
                                  if (t === "carrossel") setPostQty(5);
                                  else setPostQty(1);
                                }}
                                className="w-full h-8 bg-[#050505] border border-white/10 rounded-lg px-2 text-[9px] text-white uppercase tracking-wider focus:outline-none focus:border-brand-blue/30 duration-200"
                              >
                                <option value="reels">Reels (Vídeo)</option>
                                <option value="carrossel">Carrossel (Imagens)</option>
                                <option value="imagem_unica">Post Único (Imagem)</option>
                              </select>
                            </div>

                            {/* Quantidade Dinâmica */}
                            <div className="flex flex-col gap-1 text-left">
                              <span className="text-[8px] uppercase tracking-wider text-white/30 pl-1">
                                {postType === "reels" && "Quantidade de Vídeos"}
                                {postType === "carrossel" && "Quantidade de Slides (Imagens)"}
                                {postType === "imagem_unica" && "Quantidade de Posts (Imagens)"}
                              </span>
                              
                              <div className="flex items-center gap-1">
                                <button 
                                  onClick={() => {
                                    const min = postType === "carrossel" ? 2 : 1;
                                    if (postQty > min) setPostQty(prev => prev - 1);
                                  }}
                                  className="w-8 h-8 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg flex items-center justify-center text-xs font-bold font-mono duration-150 active:scale-90"
                                >
                                  -
                                </button>
                                
                                <div className="flex-1 h-8 bg-black/60 border border-white/5 rounded-lg flex items-center justify-center text-[10px] font-bold font-mono">
                                  {postQty} {postType === "carrossel" ? "Slides" : (postQty === 1 ? "Post" : "Posts")}
                                </div>
                                
                                <button 
                                  onClick={() => {
                                    if (postQty < 10) setPostQty(prev => prev + 1);
                                  }}
                                  className="w-8 h-8 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg flex items-center justify-center text-xs font-bold font-mono duration-150 active:scale-90"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* Estimador de Créditos */}
                            <div className="bg-black/60 border border-white/5 rounded-lg p-2 flex items-center justify-between text-left select-none">
                              <div className="flex flex-col">
                                <span className="text-[7.5px] font-bold text-white/30 uppercase tracking-wider">Custo de Ordem de Serviço</span>
                                <span className="text-[9px] font-bold text-brand-gold uppercase">
                                  {/* Reels: 35cr, Carrossel: 25cr, Post Único: 15cr */}
                                  Custo Estimado: {postType === "reels" ? postQty * 35 : (postType === "carrossel" ? postQty * 25 : postQty * 15)} créditos
                                </span>
                              </div>
                              <span className="text-xs">💰</span>
                            </div>

                            {/* Detalhes Técnicos dos Serviços do Plano */}
                            <div className="flex flex-col gap-1.5 pt-2 border-t border-white/5 mt-1 select-none">
                              <span className="text-[7.5px] font-bold uppercase tracking-wider text-white/30 pl-1 text-left">
                                Serviços Ativados
                              </span>
                              
                              <div className="max-h-[100px] overflow-y-auto custom-scrollbar-visible pr-1 flex flex-col gap-1.5">
                                {[
                                  { id: 1, name: "05. Upload de Mídia (Permanente)", premium: true },
                                  { id: 2, name: "06. Adequação de Proporção", premium: false },
                                  { id: 3, name: "07. Criar Flow Manual", premium: false },
                                  { id: 4, name: "08. Simular Flow Manual", premium: false },
                                  { id: 5, name: "09. Curadoria de Grade (Grid AI)", premium: true },
                                  { id: 6, name: "10. Criação de Legendas (IA)", premium: true },
                                  { id: 7, name: "11. Roteiros Reels (Director's)", premium: true },
                                  { id: 8, name: "12. Geração de Imagens (IA)", premium: true },
                                  { id: 9, name: "13. Geração de Vídeos (IA)", premium: true },
                                  { id: 10, name: "14. Flow Automatizado (IA)", premium: true },
                                  { id: 11, name: "15. Simulador Inteligente Flow", premium: true }
                                ].map((svc) => {
                                  const isActive = isPremium || !svc.premium;
                                  return (
                                    <div key={svc.id} className={`flex items-center justify-between text-[8px] transition-all ${isActive ? "opacity-80" : "opacity-20"}`}>
                                      <span className="truncate max-w-[170px]">{svc.name}</span>
                                      <span>{isActive ? "✓" : "🔒"}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CARD 3: PÓS-PRODUÇÃO (Fila de Envio) */}
                      <div className="border border-white/10 rounded-lg overflow-hidden shrink-0 bg-black/20">
                        <div 
                          onClick={() => setExpandedSection(expandedSection === "pos" ? null : "pos")}
                          className="flex items-center justify-between p-2.5 bg-white/[0.02] cursor-pointer hover:bg-white/5 duration-150 select-none"
                        >
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#EFE5D3]">
                            C - Pós-Produção
                          </span>
                          <span className="text-[8px] text-white/30">
                            {expandedSection === "pos" ? "▼" : "▶"}
                          </span>
                        </div>

                        <div className={`transition-all duration-300 overflow-hidden ${
                          expandedSection === "pos" ? "max-h-[220px] p-3 border-t border-white/5" : "max-h-0"
                        }`}>
                          <div className="flex flex-col gap-2.5">
                            {/* Agendador Toggle */}
                            <div className="flex flex-col gap-1 text-left">
                              <span className="text-[8px] uppercase tracking-wider text-white/30 pl-1">
                                Data da Publicação
                              </span>
                              <input 
                                type="date"
                                disabled={!isPremium}
                                value={agendamentoData}
                                onChange={(e) => setExpandedSection("pos") || setAgendamentoData(e.target.value)}
                                className={`w-full h-8 bg-[#050505] border border-white/10 rounded-lg px-2 text-[9px] text-white uppercase focus:outline-none focus:border-brand-blue/30 duration-200 ${
                                  !isPremium ? "opacity-30 cursor-not-allowed" : ""
                                }`}
                              />
                            </div>

                            <div className="flex flex-col gap-1 text-left">
                              <span className="text-[8px] uppercase tracking-wider text-white/30 pl-1">
                                Hora da Publicação
                              </span>
                              <input 
                                type="time"
                                disabled={!isPremium}
                                value={agendamentoHora}
                                onChange={(e) => setExpandedSection("pos") || setAgendamentoHora(e.target.value)}
                                className={`w-full h-8 bg-[#050505] border border-white/10 rounded-lg px-2 text-[9px] text-white focus:outline-none focus:border-brand-blue/30 duration-200 ${
                                  !isPremium ? "opacity-30 cursor-not-allowed" : ""
                                }`}
                              />
                            </div>
                            
                            <div className="text-[7.5px] text-white/20 uppercase tracking-widest pl-1 text-left">
                              {isPremium ? "✓ Conexão estável com VPS PM2" : "🔒 Agendamento restrito ao Premium"}
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Card do Almoxarifado & Contingência */}
                  <div className="flex flex-col gap-2 pt-3 border-t border-white/10 mt-3 relative z-10 shrink-0 select-none">
                    {/* Status do Almoxarifado */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-lg p-2 flex items-center justify-between">
                      <div className="flex flex-col text-left">
                        <span className="text-[7.5px] font-bold text-white/30 uppercase tracking-wider">Mídia Almoxarifado</span>
                        <span className="text-[9px] font-bold text-white/70 uppercase">
                          {isPremium ? "✓ ARMAZENAMENTO PERMANENTE" : "EXPIRAÇÃO EM 12 DIAS"}
                        </span>
                      </div>
                      <span className="text-xs">{isPremium ? "📦" : "⏳"}</span>
                    </div>

                    {/* Contingência de Download */}
                    <div className="flex justify-between items-center px-1 py-0.5 text-[8.5px] text-white/40 hover:text-white transition duration-200 cursor-pointer">
                      <span className="font-poppins-light leading-none">Download Manual de Contingência</span>
                      <span className="font-bold text-[9px]">↓</span>
                    </div>
                  </div>

                  {/* Botão de Upgrade para Free ou rodapé premium */}
                  {!isPremium ? (
                    <button 
                      onClick={() => {
                        setActiveView("servicos");
                        setOnboardingStep("video");
                      }}
                      className="w-full h-11 bg-brand-gold hover:bg-[#F0C547] active:scale-95 duration-200 rounded-lg text-black text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 relative z-10 mt-3 shrink-0 shadow-lg shadow-brand-gold/15"
                    >
                      Fazer Upgrade para Premium <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <div className="text-[7.5px] text-center text-white/20 uppercase tracking-widest mt-3 shrink-0 select-none">
                      Segurança de Faturamento Ativa
                    </div>
                  )}
                </div>
              </div>

              {/* ALWAYS-VISIBLE AUDIO CONTROLS & BRAND SIGNATURE */}
              <div className="flex flex-col gap-2 pt-4 border-t border-white/10 mt-4 shrink-0">
                <div className="flex items-center gap-3 text-white/40">
                  <div className="flex items-center gap-1 shrink-0">
                    <button 
                      onClick={() => setIsMuted(!isMuted)} 
                      className="p-1 rounded-lg hover:bg-white/5 hover:text-white transition duration-200 shrink-0"
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5 text-brand-pink" /> : <Volume2 className="w-3.5 h-3.5 text-brand-blue" />}
                    </button>
                    <span className="text-[9px] font-black uppercase tracking-wider whitespace-nowrap">
                      {isMuted ? "Áudio Mutado" : "Trilha Sonora"}
                    </span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="flex-1 premium-slider min-w-[60px]"
                  />
                </div>
                <div className="text-[8px] font-black tracking-widest text-center text-white/15 uppercase mt-1">
                  Killer Skills v4.0 • Direção de Arte AI
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TELA 3: KS STUDIO (STORYBOARD + INSIGHTS + SIMULADOR DE FEED) */}
        {activeView === "storyboard" && (
          <div className="relative w-full h-full flex justify-center items-center">

            {/* Mockup do Celular Central (Posicionado Fixed para Centramento Perfeito) */}
            <div className="fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[340px] h-[550px] bg-[#0A0A0C] border border-white/10 rounded-lg p-4 flex flex-col justify-between items-center shadow-2xl transition-all duration-300 z-30">
              {/* Visor Interno de Reels Vazio */}
              <div className="w-full h-full bg-[#050505] rounded-lg border border-white/5 flex flex-col justify-center items-center p-6 relative overflow-hidden z-10 select-none text-center">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex justify-center items-center mb-4">
                  <Sparkles className="w-5 h-5 text-brand-blue" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-widest text-white mb-2">KS STUDIO</h3>
                <p className="text-[9px] text-white/40 leading-relaxed uppercase tracking-wider max-w-[200px]">
                  Direção estética e simulação de reels. Acesse os painéis laterais para calibração.
                </p>
              </div>
            </div>

            {/* COLUNA LATERAL DIREITA: Painel Estritamente Simétrico ao Menu Esquerdo (Área com o Card Vazio) */}
            <div className="absolute -right-10 -top-10 -bottom-10 w-[320px] border-l border-white/10 bg-[#0A0A0A] p-5 flex flex-col justify-between z-20 text-left animate-fade-in text-white shadow-2xl">
              {/* TOPO FIXO: Título Geral */}
              <div className="flex flex-col gap-1 w-full shrink-0 select-none mb-3">
                <h2 
                  className="text-sm uppercase tracking-wider text-white text-center font-extralight"
                  style={{ fontFamily: 'Poppins', fontWeight: 200 }}
                >
                  KS Studio
                </h2>
              </div>

              {/* CONTEÚDO DO PORTAL ABAIXO (CARD VAZIO) */}
              <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                <div className="flex-1 w-full relative rounded-lg overflow-hidden border border-white/10 bg-[#050505] flex flex-col justify-center items-center p-5 text-center shadow-lg">
                  <Sparkles className="w-8 h-8 text-white/15 mb-3" />
                  <span className="text-[9px] font-black tracking-widest uppercase text-white/30 mb-1">Cockpit Vazio</span>
                  <span className="text-[9px] font-semibold text-white/20 uppercase tracking-wider leading-relaxed max-w-[150px]">
                    Card reservado para forja estética AI
                  </span>
                </div>
              </div>

              {/* ALWAYS-VISIBLE AUDIO CONTROLS & BRAND SIGNATURE */}
              <div className="flex flex-col gap-2 pt-4 border-t border-white/10 mt-4 shrink-0">
                <div className="flex items-center gap-3 text-white/40">
                  <div className="flex items-center gap-1 shrink-0">
                    <button 
                      onClick={() => setIsMuted(!isMuted)} 
                      className="p-1 rounded-lg hover:bg-white/5 hover:text-white transition duration-200 shrink-0"
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5 text-brand-pink" /> : <Volume2 className="w-3.5 h-3.5 text-brand-blue" />}
                    </button>
                    <span className="text-[9px] font-black uppercase tracking-wider whitespace-nowrap">
                      {isMuted ? "Áudio Mutado" : "Trilha Sonora"}
                    </span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="flex-1 premium-slider min-w-[60px]"
                  />
                </div>
                <div className="text-[8px] font-black tracking-widest text-center text-white/15 uppercase mt-1">
                  Killer Skills v4.0 • Direção de Arte AI
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TELA 3: ALMOXARIFADO / UPLOADS LIBRARY */}
        {activeView === "almoxarifado" && (
          <div className="w-full h-full flex flex-col gap-6 animate-fade-in">
            <div>
              <h1 className="text-3xl font-bold">Almoxarifado</h1>
              <p className="text-xs text-white/40">Selecione uma imagem para inseri-la no carrossel ativo ({activeSlot !== null ? `Slot ${activeSlot + 1}` : 'Nenhum slot selecionado'}).</p>
            </div>

            <div className="grid grid-cols-5 gap-6">
              {SEED_IMAGES.map((img) => (
                <div 
                  key={img.id}
                  onClick={() => selectMediaFromLibrary(img.url)}
                  className="bg-[#0A0A0C] border border-white/10 hover:border-brand-blue rounded-lg p-3 flex flex-col gap-3 cursor-pointer hover:scale-[1.03] duration-200 group"
                >
                  <div className="aspect-square bg-black rounded-lg overflow-hidden">
                    <img src={img.url} className="w-full h-full object-cover group-hover:scale-110 duration-500" alt={img.name} />
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight truncate">{img.name}</div>
                    <div className="text-[9px] text-white/30 uppercase tracking-widest mt-1">Biblioteca Pública</div>
                  </div>
                </div>
              ))}
            </div>

            {activeSlot !== null && (
              <button 
                onClick={() => {
                  setActiveSlot(null);
                  setActiveView("storyboard");
                }}
                className="w-48 h-11 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold"
              >
                Voltar sem selecionar
              </button>
            )}
          </div>
        )}
      </div>

      {/* 3. MODAL DE PROGRESSO DA FORJA DE PROMPTS */}
      {showForgeModal && (
        <div className="fixed inset-0 bg-black/90 flex justify-center items-center z-50 animate-fade-in p-6">
          <div className="bg-[#0A0A0C] border border-white/15 rounded-lg p-8 max-w-lg w-full flex flex-col items-center gap-6 shadow-2xl">
            <Cpu className="w-14 h-14 text-brand-gold active-pulse" />
            <div className="text-center">
              <h2 className="text-2xl font-bold">A Criação está ativada...</h2>
              <p className="text-[10px] font-bold text-brand-blue uppercase tracking-widest mt-1">Orquestrador Central assimilando agentes</p>
            </div>

            {/* Barra de Progresso */}
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
              <div 
                className="bg-brand-gold h-full duration-500 transition-all" 
                style={{ width: `${forgeProgress}%` }}
              />
            </div>

            {/* Console de Saída YAML do Manifest */}
            {forgeData && (
              <div className="w-full bg-[#050507] border border-white/10 rounded-lg p-5 text-[10px] font-mono text-[#8A95A5] max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {forgeData.manifest}
              </div>
            )}

            {/* Ações Finais */}
            {forgeProgress === 100 && (
              <button 
                onClick={handleForgeClose}
                className="w-full h-12 bg-brand-gold text-black font-extrabold text-xs tracking-wider rounded-lg hover:scale-105 active:scale-95 duration-200 shadow-lg shadow-brand-gold/15"
              >
                CONVOCAR AGENTE E CONCLUIR
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}