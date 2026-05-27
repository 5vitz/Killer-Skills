import React, { useState, useEffect } from 'react';
import { 
  Menu, Play, BookOpen, Layers, Settings, ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
  Sparkles, CheckCircle2, Circle, LogOut, ArrowRight, ShieldCheck, 
  Info, Cpu, FolderOpen, Image as ImageIcon, Send, Sliders, RefreshCw, User,
  Volume2, VolumeX
} from 'lucide-react';

const API_BASE = "http://localhost:8000";

// Seeds de Mídias para a Biblioteca / Almoxarifado
const SEED_IMAGES = [
  { id: 1, url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500", name: "Jeep Renegade (Aventura)" },
  { id: 2, url: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=500", name: "Hyundai Ioniq (Futurista)" },
  { id: 3, url: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=500", name: "BYD Song Plus (Estilo)" },
  { id: 4, url: "https://images.unsplash.com/photo-1621007947382-cc347941150e?w=500", name: "Toyota Hilux (Lamas)" },
  { id: 5, url: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=500", name: "Porsche Taycan (Estética)" }
];

// Os 12 Arquétipos de Carl Jung organizados pelas 3 dimensões (Alma, Ação, Social)
const ARCHETYPES = [
  // Dimensão da Alma
  { id: 'sabio', name: 'Sábio', dim: 'Alma', desc: 'Busca o conhecimento e pratica a autorreflexão. Analisa e age com sabedoria.', color: '#D4AF37', shadow: 'Sombra: Distanciamento emocional e altivez intelectual.', seedUrl: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=500' },
  { id: 'inocente', name: 'Inocente', dim: 'Alma', desc: 'Enxerga os aspectos positivos em tudo. Espontâneo, confiante e otimista.', color: '#4D90FE', shadow: 'Sombra: Pode ser ingênuo ou negar realidades dolorosas.', seedUrl: 'https://images.unsplash.com/photo-1498843053639-170ff2122f35?w=500' },
  { id: 'explorador', name: 'Explorador', dim: 'Alma', desc: 'Busca liberdade para agir e descobrir o mundo. Gosta de novidades constantes.', color: '#34A853', shadow: 'Sombra: Inconstância, dispersão e medo de criar raízes.', seedUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500' },
  { id: 'cuidador', name: 'Cuidador', dim: 'Alma', desc: 'Gosta de cuidar dos outros. Prestativo e focado no bem-estar de todos.', color: '#EA4335', shadow: 'Sombra: Esgotamento emocional por negligência de si próprio.', seedUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=500' },
  // Dimensão da Ação
  { id: 'heroi', name: 'Herói', dim: 'Ação', desc: 'Guerreiro e destemido. Luta para proteger os seus e não teme obstáculos.', color: '#E06666', shadow: 'Sombra: Obsessão por combate e necessidade de provar valor.', seedUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500' },
  { id: 'mago', name: 'Mago', dim: 'Ação', desc: 'Acredita que o mundo pode ser diferente. Focado na transformação e revolução.', color: '#93C47D', shadow: 'Sombra: Manipulação mental e fuga da realidade física.', seedUrl: 'https://images.unsplash.com/photo-1519074069444-1ba4e5663a43?w=500' },
  { id: 'rebelde', name: 'Rebelde', dim: 'Ação', desc: 'Pensa de maneira diferente. Foge de padrões tradicionais e regras estritas.', color: '#F6B26B', shadow: 'Sombra: Destruição sem causa e marginalização improdutiva.', seedUrl: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=500' },
  { id: 'criador', name: 'Criador', dim: 'Ação', desc: 'Dá vida à imaginação e às coisas que ainda não existem. Artista e inventor.', color: '#FFD966', shadow: 'Sombra: Perfeccionismo extremo que impede a entrega.', seedUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500' },
  // Dimensão Social
  { id: 'amante', name: 'Amante', dim: 'Social', desc: 'Valoriza as conexões humanas de alta sensibilidade. Feliz ao amar e ser amado.', color: '#C27BA0', shadow: 'Sombra: Perda de identidade e anulação em favor do outro.', seedUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500' },
  { id: 'tolo', name: 'Tolo', dim: 'Social', desc: 'Alegre, dinâmico, gosta de divertir as pessoas. Autêntico e descontraído.', color: '#8E7CC3', shadow: 'Sombra: Frivolidade e fuga de responsabilidades sérias.', seedUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500' },
  { id: 'homem_comum', name: 'Homem Comum', dim: 'Social', desc: 'Age em conformidade com o grupo. Empático, pé no chão e excelente vizinho.', color: '#858585', shadow: 'Sombra: Perda de voz ativa em nome da conformidade social.', seedUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500' },
  { id: 'governante', name: 'Governante', dim: 'Social', desc: 'Líder natural, assume a autoridade e sabe impor a ordem e a estabilidade.', color: '#E09E25', shadow: 'Sombra: Rigidez extrema e medo irracional do caos.', seedUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500' }
];

const ARCHETYPE_DETAILS = {
  sabio: {
    desejo: "Encontrar a verdade",
    medo: "Ser enganado ou ignorante",
    superpoder: "Sabedoria e análise profunda",
    imagem: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=500",
    sombra: "Distanciamento emocional e altivez intelectual"
  },
  inocente: {
    desejo: "Experimentar o paraíso e ser feliz",
    medo: "Fazer algo errado e ser punido",
    superpoder: "Fé e otimismo inabaláveis",
    imagem: "https://images.unsplash.com/photo-1498843053639-170ff2122f35?w=500",
    sombra: "Ingenuidade excessiva e negação da realidade"
  },
  explorador: {
    desejo: "Viver uma vida livre e autêntica",
    medo: "Ficar preso ou se conformar",
    superpoder: "Autenticidade e coragem de desbravar",
    imagem: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500",
    sombra: "Inconstância, dispersão e pânico de criar raízes"
  },
  cuidador: {
    desejo: "Proteger e cuidar dos outros",
    medo: "Egoísmo e ingratidão",
    superpoder: "Compaixão e generosidade pura",
    imagem: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=500",
    sombra: "Martírio e esgotamento por negligência de si próprio"
  },
  heroi: {
    desejo: "Provar seu valor através de ações difíceis",
    medo: "Fraqueza e vulnerabilidade",
    superpoder: "Competência, coragem e determinação",
    imagem: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500",
    sombra: "Obsessão por combate e necessidade de provar valor"
  },
  mago: {
    desejo: "Compreender as leis fundamentais do universo",
    medo: "Consequências negativas não intencionais",
    superpoder: "Transformação e manifestação da visão",
    imagem: "https://images.unsplash.com/photo-1519074069444-1ba4e5663a43?w=500",
    sombra: "Manipulação mental e distanciamento da realidade física"
  },
  rebelde: {
    desejo: "Revolucionar o que não funciona",
    medo: "Ser comum ou impotente",
    superpoder: "Liberdade radical e pensamento disruptivo",
    imagem: "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=500",
    sombra: "Destruição sem causa legítima e rebeldia improdutiva"
  },
  criador: {
    desejo: "Criar algo de valor duradouro",
    medo: "Mediocridade ou falta de visão",
    superpoder: "Criatividade sem limites e habilidade técnica",
    imagem: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500",
    sombra: "Perfeccionismo extremo que paralisa a entrega"
  },
  amante: {
    desejo: "Estar em conexão com quem e o que ama",
    medo: "Ficar sozinho ou não ser desejado",
    superpoder: "Sensualidade, empatia e compromisso profundo",
    imagem: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500",
    sombra: "Anulação pessoal para agradar ao parceiro"
  },
  tolo: {
    desejo: "Viver no momento com alegria plena",
    medo: "Ser chato ou passar despercebido",
    superpoder: "Humor, leveza e inteligência espontânea",
    imagem: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500",
    sombra: "Frivolidade e irresponsabilidade diante de crises"
  },
  homem_comum: {
    desejo: "Pertencer e conectar-se com os outros",
    medo: "Ser deixado de fora ou se destacar demais",
    superpoder: "Empatia, realismo e ausência de pretensão",
    imagem: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
    sombra: "Perda da própria voz em nome do consenso do grupo"
  },
  governante: {
    desejo: "Criar uma família ou comunidade próspera",
    medo: "O caos e a perda do controle",
    superpoder: "Liderança, responsabilidade e estabilidade",
    imagem: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500",
    sombra: "Autoritarismo rígido e incapacidade de delegar"
  }
};

const DIMENSOES = [
  { id: 'alma', title: 'Alma', color: '#D4AF37' },
  { id: 'acao', title: 'Ação', color: '#E06666' },
  { id: 'social', title: 'Social', color: '#8E7CC3' }
];

export default function App() {
  // --- ESTADO GLOBAL ---
  const [activeView, setActiveView] = useState("servicos"); // storyboard, servicos, almoxarifado, admin_console
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  
  // Router Guard de Roteamento Dinâmico
  const [hasPersonaDefined, setHasPersonaDefined] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState("video"); // "video" ou "matriz"

  // --- AUDIO & ARQUÉTIPOS DINÂMICOS ---
  const [focusedArchetype, setFocusedArchetype] = useState(null);
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
    audio.volume = volume;
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

    // Simulação do Router Guard de Roteamento Dinâmico (Maio de 2026):
    // Se for artz.genera@gmail.com, já possui persona e plano Premium -> Vai direto para Construtor de Prompt
    if (email === "artz.genera@gmail.com") {
      setHasPersonaDefined(true);
      setActiveView("servicos_escolha");
    } 
    // Se for scalla_records@gmail.com, já possui persona e plano Free -> Vai direto para KS Studio
    else if (email === "scalla_records@gmail.com") {
      setHasPersonaDefined(true);
      setActiveView("storyboard");
    } 
    // Outros e novos logins -> Primeiro acesso, entra no vídeo explicativo do Onboarding
    else {
      setHasPersonaDefined(false);
      setOnboardingStep("video");
      setActiveView("servicos");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail("");
    setIsAdminMode(false);
    setActiveView("storyboard");
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
    const currentPersona = personas[selectedPersonaIdx];
    if (!currentPersona) return;

    setShowForgeModal(true);
    setForgeProgress(20);

    try {
      const res = await fetch(`${API_BASE}/api/forge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona_title: currentPersona.title,
          persona_tag: currentPersona.tag,
          micro_services: microServicesState
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

  // 1. TELA DE LOGIN (SMARTPHONE DE GLOWS AZUL/DOURADO)
  if (!isLoggedIn) {
    return (
      <div className="relative w-screen h-screen flex justify-center items-center bg-black overflow-hidden select-none">
        {/* Breathing Lilac & Emerald Sacred Background */}
        <div className="smoke-bg-container">
          <div className="smoke-cloud-1" />
          <div className="smoke-cloud-2" />
          <div className="smoke-cloud-3" />
        </div>

        {/* Smartphone Container */}
        <div 
          className="relative w-[340px] h-[550px] bg-brand-card border-2 rounded-[45px] p-4 flex flex-col justify-between items-center shadow-2xl"
          style={{ borderColor: "#1E60FF" }}
        >
          {/* Ilha Dinâmica */}
          <div className="absolute w-[110px] h-6 bg-black rounded-2xl top-1.5 left-1/2 -translate-x-1/2 z-20 flex justify-center items-center">
            <div className="w-2.5 h-2.5 bg-[#030303] rounded-full border border-white/5" />
          </div>

          {/* Visor Interno */}
          <div className="w-full h-full bg-[#050505] rounded-[35px] border border-white/5 flex flex-col justify-center items-center p-6 text-center z-10">
            {/* Logo Metálica */}
            <div className="text-3xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-brand-gold via-white to-brand-blue mb-2">
              KILLER SKILLS
            </div>
            <div className="text-[9px] font-bold tracking-widest text-[#1E60FF] uppercase mb-10">
              Direção de Arte AI
            </div>

            <div className="text-[11px] text-white/30 font-bold uppercase tracking-wider mb-6">
              CONECTAR COM KS STUDIO
            </div>

            {/* Login com Google (Apenas Entrar) */}
            <button 
              onClick={() => triggerGoogleAuthSequence("scalla_records@gmail.com")}
              className="w-full h-12 bg-brand-blue hover:bg-brand-blue/90 hover:scale-105 active:scale-95 duration-200 text-white rounded-xl font-bold text-xs tracking-wider flex justify-center items-center gap-2 mb-10 shadow-lg"
            >
              <Send className="w-4 h-4" /> ENTRAR
            </button>

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

  return (
    <div className="relative w-screen h-screen bg-black flex overflow-hidden text-white antialiased select-none z-10">
      {/* Breathing Lilac & Emerald Sacred Background */}
      <div className="smoke-bg-container">
        <div className="smoke-cloud-1" />
        <div className="smoke-cloud-2" />
        <div className="smoke-cloud-3" />
      </div>

      {/* 1. BARRA LATERAL METÁLICA PREMIUM */}
      <div className="w-[260px] z-10 flex flex-col justify-between p-5 border-r border-white/10 bg-[#0A0A0A]">
        <div className="flex flex-col gap-6">
          {/* Título do Cockpit */}
          <div className="text-center">
            <div className="text-2xl font-bold tracking-tight text-white/90">Killer Skills</div>
            <div className={`text-[9px] font-bold tracking-wider uppercase ${isAdminMode ? "text-brand-gold" : "text-brand-blue"}`}>
              {isAdminMode ? "ADMIN COCKPIT" : "KS STUDIO"}
            </div>
          </div>

          <hr className="border-white/10" />

          {/* Card do Usuário */}
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
            <div className={`w-8 h-8 rounded-full flex justify-center items-center font-bold text-xs ${isAdminMode ? "bg-brand-gold text-black" : "bg-brand-blue text-white"}`}>
              {userEmail.substring(0, 2).toUpperCase()}
            </div>
            <div className="text-xs font-medium text-white/70 overflow-hidden text-ellipsis whitespace-nowrap w-[150px]">
              {userEmail}
            </div>
          </div>

          {/* Menu de Áreas de Trabalho */}
          <div className="flex flex-col gap-1.5 pt-2">
            
            <button 
              onClick={() => setActiveView("servicos")}
              className={`w-full h-11 px-4 rounded-xl text-left text-xs font-semibold flex items-center gap-3 duration-200 ${
                activeView === "servicos" 
                  ? "bg-brand-blue/15 border border-brand-blue/30 text-white" 
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <User className="w-4 h-4" /> 1 - PERSONAS
            </button>

            <button 
              onClick={() => setActiveView("servicos_escolha")}
              className={`w-full h-11 px-4 rounded-xl text-left text-xs font-semibold flex items-center gap-3 duration-200 ${
                activeView === "servicos_escolha" 
                  ? "bg-brand-blue/15 border border-brand-blue/30 text-white" 
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Cpu className="w-4 h-4" /> 2 - SERVIÇOS
            </button>

            <button 
              onClick={() => setActiveView("storyboard")}
              className={`w-full h-11 px-4 rounded-xl text-left text-xs font-semibold flex items-center gap-3 duration-200 ${
                activeView === "storyboard" 
                  ? "bg-brand-blue/15 border border-brand-blue/30 text-white" 
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Sparkles className="w-4 h-4" /> 3 - KS STUDIO
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
            className={`w-full h-11 px-4 rounded-xl text-left text-xs font-semibold flex items-center gap-3 duration-200 ${
              isAdminMode 
                ? "bg-brand-gold/15 border border-brand-gold/30 text-brand-gold" 
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> PAINEL ADM
          </button>

          <button 
            onClick={handleLogout}
            className="w-full h-11 px-4 rounded-xl text-left text-xs font-semibold uppercase flex items-center gap-3 duration-200 text-white/60 hover:bg-brand-pink/10 hover:text-brand-pink"
          >
            <LogOut className="w-4 h-4" /> ENCERRAR SESSÃO
          </button>

          <div className="w-full h-11 px-4 flex items-center gap-3 text-white/40 select-none">
            <div className="w-4 flex justify-center items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full active-pulse" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">ONLINE NA WEB</span>
          </div>
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

          const activeArch = hoveredArchetype || focusedArchetype;

          return (
            <div className="relative w-full h-full flex justify-center items-center">

              {/* LETREIRO MARQUEE TICKER (DINÂMICO E COMPARTILHADO) */}
              <div className="absolute top-[3%] left-0 right-0 w-full overflow-hidden whitespace-nowrap bg-black/45 backdrop-blur-[3px] py-2 border-y border-white/[0.06] shadow-2xl z-20">
                <div className="inline-block whitespace-nowrap animate-marquee">
                  <span className="text-[17px] font-poppins-light text-gold-dress leading-relaxed px-4 drop-shadow-[0_2px_5px_rgba(0,0,0,0.85)]">
                    {onboardingStep === "video" ? (
                      <>
                        ♥ Os 12 Arquétipos de Jung ♥ &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
                        ♥ Os 12 Arquétipos de Jung ♥ &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
                        ♥ Os 12 Arquétipos de Jung ♥ &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
                        ♥ Os 12 Arquétipos de Jung ♥ &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
                      </>
                    ) : (
                      <>
                        ♥ O quanto você se identifica com esses Arquétipos? ♥ &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
                        ♥ O quanto você se identifica com esses Arquétipos? ♥ &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
                        ♥ O quanto você se identifica com esses Arquétipos? ♥ &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
                        ♥ O quanto você se identifica com esses Arquétipos? ♥ &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
                      </>
                    )}
                  </span>
                  <span className="text-[17px] font-poppins-light text-gold-dress leading-relaxed px-4 drop-shadow-[0_2px_5px_rgba(0,0,0,0.85)]">
                    {onboardingStep === "video" ? (
                      <>
                        ♥ Os 12 Arquétipos de Jung ♥ &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
                        ♥ Os 12 Arquétipos de Jung ♥ &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
                        ♥ Os 12 Arquétipos de Jung ♥ &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
                        ♥ Os 12 Arquétipos de Jung ♥ &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
                      </>
                    ) : (
                      <>
                        ♥ O quanto você se identifica com esses Arquétipos? ♥ &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
                        ♥ O quanto você se identifica com esses Arquétipos? ♥ &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
                        ♥ O quanto você se identifica com esses Arquétipos? ♥ &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
                        ♥ O quanto você se identifica com esses Arquétipos? ♥ &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Mockup do Celular Central (Posicionado Fixed para Centramento Perfeito) */}
              <div 
                className="fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[340px] h-[550px] bg-[#0A0A0C] border-2 rounded-[45px] p-4 flex flex-col justify-between items-center shadow-2xl transition-all duration-300 z-30" 
                style={{ borderColor: onboardingStep === "video" ? "#1E60FF" : "#D4AF37" }}
              >
                {/* Ilha Dinâmica */}
                <div className="absolute w-[110px] h-6 bg-black rounded-2xl top-1.5 left-1/2 -translate-x-1/2 z-20 flex justify-center items-center">
                  <div className="w-2.5 h-2.5 bg-[#030303] rounded-full border border-white/5" />
                </div>

                {/* Visor Interno */}
                <div className="w-full h-full bg-black rounded-[35px] border border-white/5 flex flex-col justify-between p-4 relative overflow-hidden z-10 select-none text-white">
                  {onboardingStep === "video" ? (
                    /* PASSO 1: VÍDEO EXPLICATIVO DA GUIA DE IA */
                    <div className="w-full h-full flex flex-col justify-between p-1 select-none animate-fade-in">
                      {/* Header da Guia */}
                      <div className="flex flex-col gap-1 border-b border-white/10 pb-3 text-left">
                        <div className="text-[8px] font-black text-brand-blue uppercase tracking-widest">Iniciação AI</div>
                        <h2 className="text-base font-black text-white leading-tight">Apresentação das Regras</h2>
                      </div>

                      {/* Mockup de Vídeo Player da Guia de IA */}
                      <div className="relative w-full h-[180px] rounded-2xl overflow-hidden border border-white/10 group cursor-pointer my-3 bg-black">
                        {/* Imagem de Fundo da Guia AI (Uma modelo elegante em tons futuristas de azul/dourado) */}
                        <img 
                          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500" 
                          className="w-full h-full object-cover brightness-[0.5] group-hover:scale-105 duration-700" 
                          alt="AI Guide"
                        />
                        {/* overlay de luz */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                        
                        {/* Pulse Play Button */}
                        <div className="absolute inset-0 flex justify-center items-center">
                          <div className="w-12 h-12 rounded-full bg-brand-blue/90 text-white flex justify-center items-center shadow-lg group-hover:scale-110 active:scale-95 duration-200 animate-pulse">
                            <Play className="w-5 h-5 ml-1 fill-white" />
                          </div>
                        </div>

                        {/* Player HUD Overlay */}
                        <div className="absolute bottom-3 inset-x-3 flex flex-col gap-1.5 pointer-events-none">
                          <div className="flex justify-between items-center text-[8px] font-bold text-white/50">
                            <span>Mesa Redonda AI</span>
                            <span>01:12 / 01:12</span>
                          </div>
                          {/* Progress Bar Mock */}
                          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-blue w-full rounded-full" />
                          </div>
                        </div>
                      </div>

                      {/* Descrição Didática */}
                      <div className="flex-1 flex flex-col gap-2 text-left mb-3">
                        <div className="text-[10px] text-white/70 font-semibold leading-relaxed">
                          Assista à locução da nossa **Guia Virtual de Inteligência Artificial** para aprender a dosar sua Persona.
                        </div>
                        <div className="text-[9px] text-[#1E60FF]/80 leading-relaxed font-bold bg-[#1E60FF]/10 border border-[#1E60FF]/20 p-2.5 rounded-xl">
                          💡 "O tom e a alma do seu Co-Diretor AI serão definidos pela calibração perfeita dos 12 sliders na próxima tela."
                        </div>
                      </div>

                      {/* Botão de Avanço para a Matriz */}
                      <button 
                        onClick={() => setOnboardingStep("matriz")}
                        className="w-full h-11 bg-brand-blue hover:bg-brand-blue/90 active:scale-95 text-white rounded-xl font-black text-xs tracking-wider flex justify-center items-center gap-2 shadow-lg duration-200 cursor-pointer"
                      >
                        IR PARA A MATRIZ <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    /* PASSO 2: PAINEL MATRIZ DE SÍNTESE (CALIBRAÇÃO DIRETA) */
                    <div className="w-full h-full flex flex-col justify-between p-1 select-none animate-fade-in">
                      {/* Header da Síntese */}
                      <div className="flex flex-col gap-1 border-b border-white/10 pb-3 text-left">
                        <div className="text-[8px] font-black text-brand-gold uppercase tracking-widest flex justify-between items-center">
                          <span>Matriz Arquetípica</span>
                          <button 
                            onClick={() => setOnboardingStep("video")}
                            className="text-[7.5px] font-bold text-white/40 hover:text-white/70 tracking-normal border border-white/10 px-2 py-0.5 rounded-full uppercase"
                          >
                            Ver Vídeo
                          </button>
                        </div>
                        <h2 className="text-base font-black text-white leading-tight">Síntese da Sua Persona</h2>
                      </div>

                      {/* Lista de Gradações dos 12 Sliders (Grid Compacto Scrollable com Scrollbar Sempre Visível) */}
                      <div className="flex-1 my-3 overflow-y-auto pr-1 flex flex-col gap-2.5 max-h-[220px] custom-scrollbar-visible">
                        {ARCHETYPES.map((arch) => {
                          const dimColor = arch.dim === "Alma" ? "#D4AF37" : arch.dim === "Ação" ? "#E06666" : "#8E7CC3";
                          const isFocused = focusedArchetype?.id === arch.id;
                          return (
                            <div 
                              key={arch.id} 
                              onMouseEnter={() => setHoveredArchetype(arch)}
                              onMouseLeave={() => setHoveredArchetype(null)}
                              onClick={() => setFocusedArchetype(isFocused ? null : arch)}
                              className="flex flex-col gap-1 text-left bg-white/[0.02] border p-2 rounded-xl hover:bg-white/[0.06] active:scale-[0.98] transition-all duration-200 cursor-pointer"
                              style={{ borderColor: isFocused ? "#D5A370" : "rgba(255, 255, 255, 0.05)" }}
                            >
                              <div className="flex justify-between items-center text-[9px] font-bold">
                                <span style={{ color: dimColor }} className="flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dimColor }} />
                                  {arch.name}
                                </span>
                                <span className="text-white/60 font-black">{dosagemPersona[arch.id]}%</span>
                              </div>
                              <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={dosagemPersona[arch.id]}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  setDosagemPersona(prev => ({ ...prev, [arch.id]: val }));
                                }}
                                className="w-full h-0.5 accent-brand-gold bg-white/10 rounded cursor-pointer appearance-none"
                              />
                            </div>
                          );
                        })}
                      </div>

                      {/* Card de Persona Combinada (Wow Moment) */}
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col gap-1 text-left select-none mb-2">
                        <span className="text-[8px] font-black text-brand-gold uppercase tracking-widest">Persona Resultante</span>
                        <h3 className="text-sm font-black text-white">{combinedTitle}</h3>
                        <p className="text-[9px] text-white/50 leading-relaxed font-semibold">
                          Mescla de seus dois arquétipos mais proeminentes.
                        </p>
                      </div>

                      {/* Botão de Finalização Gerar Persona */}
                      <button 
                        onClick={() => {
                          // Conclui Onboarding, salva e roteia com base no plano do usuário!
                          setHasPersonaDefined(true);
                          
                          // Verificação inteligente do plano para rotear:
                          if (userEmail === "scalla_records@gmail.com") {
                            setActiveView("storyboard"); // Free vai para o KS Studio
                          } else {
                            setActiveView("servicos_escolha"); // Premium vai para Construtor de Prompt
                          }
                        }}
                        className="w-full h-11 bg-brand-gold hover:bg-brand-gold/90 active:scale-95 text-black rounded-xl font-black text-xs tracking-wider flex justify-center items-center gap-2 shadow-lg hover:shadow-brand-gold/20 duration-200 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" /> GERAR PERSONA
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* COLUNA LATERAL DIREITA: Painel Estritamente Simétrico ao Menu Esquerdo (Portal do Arquétipo) */}
              <div className="absolute right-0 top-0 bottom-0 w-[300px] border-l border-white/10 bg-[#0A0A0C]/90 backdrop-blur-md p-5 flex flex-col justify-between z-20 text-left animate-fade-in text-white shadow-2xl">
                {activeArch ? (
                  /* PORTAL DO ARQUÉTIPO ATIVO (HOVERED OU FOCUSED) */
                  <div className="flex flex-col gap-4 flex-1 overflow-y-auto pr-1 custom-scrollbar-visible">
                    {/* Header */}
                    <div>
                      <h2 className="text-sm font-black uppercase tracking-wider text-brand-gold">
                        Portal do Arquétipo
                      </h2>
                      <p className="text-[9px] text-white/40 uppercase mt-0.5 font-bold">
                        {focusedArchetype?.id === activeArch.id ? "Fixo - Clique para Liberar" : "Visualização Temporária"}
                      </p>
                    </div>

                    {/* Image Card (9:16) */}
                    <div className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden border border-white/10 shadow-lg group">
                      <img 
                        src={ARCHETYPE_DETAILS[activeArch.id]?.imagem || activeArch.seedUrl} 
                        className="w-full h-full object-cover group-hover:scale-105 duration-700 brightness-[0.8] contrast-[1.05]"
                        alt={activeArch.name}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-transparent to-black/20 pointer-events-none" />
                      <div className="absolute bottom-4 left-4 right-4 text-left pointer-events-none">
                        <span 
                          className="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/60 border"
                          style={{ color: activeArch.color, borderColor: activeArch.color }}
                        >
                          {activeArch.dim}
                        </span>
                        <h3 className="text-lg font-black text-white mt-2 leading-tight drop-shadow-md">
                          {activeArch.name}
                        </h3>
                      </div>
                    </div>

                    {/* Text Details Card */}
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex flex-col gap-3 text-left">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Desejo Central</span>
                        <p className="text-[10.5px] font-semibold text-white/90">
                          {ARCHETYPE_DETAILS[activeArch.id]?.desejo}
                        </p>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Medo Primordial</span>
                        <p className="text-[10.5px] font-semibold text-white/90">
                          {ARCHETYPE_DETAILS[activeArch.id]?.medo}
                        </p>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Superpoder</span>
                        <p className="text-[10.5px] font-bold text-gold-dress">
                          {ARCHETYPE_DETAILS[activeArch.id]?.superpoder}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* WELCOME PANEL (QUANDO NENHUM ARQUÉTIPO ESTÁ ATIVO) */
                  <div className="flex-1 flex flex-col justify-center items-center text-center p-6 gap-4 border border-white/5 bg-white/[0.01] rounded-3xl my-auto">
                    <div className="w-12 h-12 rounded-full bg-brand-blue/10 border border-brand-blue/20 flex justify-center items-center active-pulse">
                      <Sparkles className="w-5 h-5 text-brand-blue" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-wider text-white">
                        Portal do Arquétipo
                      </h3>
                      <p className="text-[10px] text-white/40 mt-2 leading-relaxed">
                        Passe o mouse ou clique em qualquer um dos 12 sliders arquetípicos para revelar a sua arte sacra digital e essência mística.
                      </p>
                    </div>
                  </div>
                )}

                {/* ALWAYS-VISIBLE AUDIO CONTROLS & BRAND SIGNATURE */}
                <div className="flex flex-col gap-2 pt-4 border-t border-white/10 mt-4">
                  <div className="flex items-center justify-between text-white/40">
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => setIsMuted(!isMuted)} 
                        className="p-1 rounded-lg hover:bg-white/5 hover:text-white transition duration-200"
                      >
                        {isMuted ? <VolumeX className="w-3.5 h-3.5 text-brand-pink" /> : <Volume2 className="w-3.5 h-3.5 text-brand-blue" />}
                      </button>
                      <span className="text-[9px] font-black uppercase tracking-wider">
                        {isMuted ? "Áudio Mutado" : "Trilha Sonora"}
                      </span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="w-16 h-1 accent-brand-blue bg-white/15 rounded-lg appearance-none cursor-pointer"
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
          <div className="relative w-full h-full flex justify-center items-center">


            {/* Mockup do Celular Central (Posicionado Fixed para Centramento Perfeito) */}
            <div className="fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[340px] h-[550px] bg-brand-card border-2 rounded-[45px] p-4 flex flex-col justify-between items-center shadow-2xl transition-all duration-300 z-30" style={{ borderColor: "#1E60FF" }}>
              
              {/* Botoes Flutuantes de Navegacao (Estilo Site da Ingrid - Top/Bottom Centralizados e Aproximados) */}
              <button 
                onClick={() => scrollPersona("up")}
                className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex justify-center items-center hover:bg-black/80 hover:border-white/40 active:scale-95 transition-all duration-200 shadow-xl cursor-pointer z-40"
              >
                <ChevronUp className="w-4.5 h-4.5 text-white/60" />
              </button>
              <button 
                onClick={() => scrollPersona("down")}
                className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex justify-center items-center hover:bg-black/80 hover:border-white/40 active:scale-95 transition-all duration-200 shadow-xl cursor-pointer z-40"
              >
                <ChevronDown className="w-4.5 h-4.5 text-white/60" />
              </button>
              
              {/* Ilha Dinâmica */}
              <div className="absolute w-[110px] h-6 bg-black rounded-2xl top-1.5 left-1/2 -translate-x-1/2 z-20 flex justify-center items-center">
                <div className="w-2.5 h-2.5 bg-[#030303] rounded-full border border-white/5" />
              </div>

              {/* Visor Interno de Reels */}
              <div className="w-full h-full bg-[#050505] rounded-[35px] border border-white/5 flex flex-col justify-between p-4 relative overflow-hidden z-10">
                {/* Esvaziado para reestruturação de layout */}
              </div>
            </div>
          </div>
        )}

        {/* TELA 3: KS STUDIO (STORYBOARD + INSIGHTS + SIMULADOR DE FEED) */}
        {activeView === "storyboard" && (
          <div className="relative w-full h-full flex justify-center items-center">


            {/* Mockup do Celular Central (Posicionado Fixed para Centramento Perfeito) */}
            <div className="fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[340px] h-[550px] bg-brand-card border-2 rounded-[45px] p-4 flex flex-col justify-between items-center shadow-2xl transition-all duration-300 z-30" style={{ borderColor: "#1E60FF" }}>
              
              {/* Botoes Flutuantes de Navegacao (Estilo Site da Ingrid - Top/Bottom Centralizados e Aproximados) */}
              <button 
                onClick={() => scrollPersona("up")}
                className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex justify-center items-center hover:bg-black/80 hover:border-white/40 active:scale-95 transition-all duration-200 shadow-xl cursor-pointer z-40"
              >
                <ChevronUp className="w-4.5 h-4.5 text-white/60" />
              </button>
              <button 
                onClick={() => scrollPersona("down")}
                className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex justify-center items-center hover:bg-black/80 hover:border-white/40 active:scale-95 transition-all duration-200 shadow-xl cursor-pointer z-40"
              >
                <ChevronDown className="w-4.5 h-4.5 text-white/60" />
              </button>
              
              {/* Ilha Dinâmica */}
              <div className="absolute w-[110px] h-6 bg-black rounded-2xl top-1.5 left-1/2 -translate-x-1/2 z-20 flex justify-center items-center">
                <div className="w-2.5 h-2.5 bg-[#030303] rounded-full border border-white/5" />
              </div>

              {/* Visor Interno de Reels - Simulador de Feed Realista */}
              <div className="w-full h-full bg-[#050505] rounded-[35px] border border-white/5 flex flex-col justify-between p-0 relative overflow-hidden z-10 select-none text-white">
                {/* Active Frame Image Preview */}
                <div className="absolute inset-0 w-full h-full bg-neutral-900 flex justify-center items-center">
                  {storyboardData[activeSlot !== null ? activeSlot : 0] ? (
                    <img 
                      src={storyboardData[activeSlot !== null ? activeSlot : 0]} 
                      className="w-full h-full object-cover animate-fade-in"
                      alt="Reels Frame"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-center p-6">
                      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex justify-center items-center backdrop-blur-md">
                        <ImageIcon className="w-4.5 h-4.5 text-white/30" />
                      </div>
                      <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest leading-normal">
                        Slot {(activeSlot !== null ? activeSlot : 0) + 1} Vazio
                      </span>
                      <button 
                        onClick={() => {
                          if (activeSlot === null) setActiveSlot(0);
                          setActiveView("almoxarifado");
                        }}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 active:scale-95 border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-wider transition duration-150 text-white"
                      >
                        + Mídia
                      </button>
                    </div>
                  )}
                  {/* Subtle dark gradient overlay at the bottom for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Top Header Overlay */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20 pointer-events-none">
                  <span className="text-[9px] font-black tracking-widest text-white/40 uppercase">
                    Reels Simulator
                  </span>
                  <div className="px-2 py-0.5 rounded-full bg-black/60 border border-white/10 text-[8px] font-black text-brand-gold uppercase tracking-wider">
                    FRAME {(activeSlot !== null ? activeSlot : 0) + 1} / 4
                  </div>
                </div>

                {/* Right Side Social Overlay Buttons */}
                <div className="absolute right-3 bottom-16 flex flex-col items-center gap-4 z-20">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-sm">❤️</span>
                    <span className="text-[8px] font-black text-white/60">1.2k</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-sm">💬</span>
                    <span className="text-[8px] font-black text-white/60">84</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-sm">✈️</span>
                  </div>
                  {/* Vinyl rotating disk */}
                  <div className="w-7 h-7 rounded-full bg-black border border-white/30 flex justify-center items-center animate-spin [animation-duration:4s]">
                    <div className="w-2.5 h-2.5 bg-brand-gold rounded-full" />
                  </div>
                </div>

                {/* Bottom Profile and Caption Overlays */}
                <div className="absolute left-4 right-14 bottom-14 z-20 flex flex-col gap-1.5 text-left pointer-events-none">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-brand-gold flex justify-center items-center font-bold text-[9px] text-black border border-white/20">
                      SR
                    </div>
                    <span className="text-[10px] font-bold text-white tracking-wide">
                      @scalla.records
                    </span>
                  </div>
                  <p className="text-[9.5px] text-white/80 font-medium leading-relaxed truncate-2-lines max-h-8 overflow-hidden overflow-ellipsis">
                    {txtLegenda || "Nenhuma legenda forjada..."}
                  </p>
                </div>

                {/* Overlay Navigation Tabs at the Very Bottom (Frame slots 1-4 selection) */}
                <div className="absolute bottom-0 inset-x-0 h-11 bg-black/90 border-t border-white/5 px-2 flex justify-between items-center z-30">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlot(idx)}
                      className={`flex-1 py-1 rounded-md text-[8px] font-black uppercase tracking-wider mx-0.5 border transition duration-150 ${
                        ((activeSlot === idx) || (activeSlot === null && idx === 0))
                          ? "bg-brand-blue/20 border-brand-blue/50 text-white"
                          : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      Slot {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* PAINEL DE CONTROLE ESQUERDO: CO-DIRETOR AI (Flutuante Estilo Cockpit) */}
            <div className="absolute left-6 top-6 bottom-6 w-[320px] bg-[#0A0A0C]/90 backdrop-blur-md border border-white/10 rounded-[28px] p-6 z-20 flex flex-col justify-between shadow-2xl animate-fade-in text-white text-left">
              <div className="flex flex-col gap-5 flex-1">
                {/* Header do Painel */}
                <div>
                  <div className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-brand-gold" />
                    <span className="text-xs font-black uppercase tracking-widest text-brand-gold">Co-Diretor AI</span>
                  </div>
                  <div className="text-[10px] font-bold text-white/40 uppercase mt-0.5">Inteligência Estética & Análise</div>
                </div>

                <hr className="border-white/10" />

                {/* Status do Storyboard */}
                <div className="flex flex-col gap-2">
                  <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Storyboard Atual</div>
                  <div className="grid grid-cols-4 gap-2">
                    {storyboardData.map((slot, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => {
                          setActiveSlot(idx);
                          setActiveView("almoxarifado");
                        }}
                        className={`aspect-square rounded-lg overflow-hidden border cursor-pointer relative group ${
                          (activeSlot === idx || (activeSlot === null && idx === 0))
                            ? "border-brand-blue" 
                            : "border-white/10 hover:border-white/30"
                        }`}
                      >
                        {slot ? (
                          <img src={slot} className="w-full h-full object-cover group-hover:scale-110 duration-200" alt="Frame" />
                        ) : (
                          <div className="w-full h-full bg-white/5 flex justify-center items-center text-[10px] text-white/20 font-black">
                            +
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Box de Resposta do Co-Diretor */}
                <div className="flex-1 flex flex-col gap-2 mt-2">
                  <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Opinião do Co-Diretor</div>
                  <div className="flex-1 bg-[#050507] border border-white/10 rounded-2xl p-4 text-[11px] font-medium text-white/70 overflow-y-auto leading-relaxed italic text-left">
                    {aiInsightText}
                  </div>
                </div>
              </div>

              {/* Botão de Análise */}
              <button 
                onClick={runAiAnalysis}
                disabled={isAiLoading}
                className="w-full h-11 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 rounded-xl text-xs font-bold tracking-wider uppercase transition duration-150 mt-4 flex justify-center items-center gap-2 text-white cursor-pointer"
              >
                {isAiLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-brand-gold" />
                ) : (
                  <>🧠 ANALISAR ESTÉTICA COM IA</>
                )}
              </button>
            </div>

            {/* PAINEL DE CONTROLE DIREITO: LEGENDA & FORJA (Flutuante Estilo Cockpit) */}
            <div className="absolute right-6 top-6 bottom-6 w-[350px] bg-[#0A0A0C]/90 backdrop-blur-md border border-white/10 rounded-[28px] p-6 z-20 flex flex-col justify-between shadow-2xl animate-fade-in text-white text-left">
              <div className="flex flex-col gap-5 flex-1">
                {/* Header do Painel */}
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-brand-blue" />
                      <span className="text-xs font-black uppercase tracking-widest text-brand-blue">Estúdio de Criação</span>
                    </div>
                    <div className="text-[10px] font-bold text-white/40 uppercase mt-0.5">Editor de Legenda e Micro-Serviços</div>
                  </div>
                </div>

                <hr className="border-white/10" />

                {/* Textarea Legenda */}
                <div className="flex flex-col gap-2 flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Legenda Lapidada</span>
                    <button 
                      onClick={runAiCaption}
                      disabled={isLegendaLoading}
                      className="text-[9px] font-black text-brand-gold hover:text-brand-gold/80 flex items-center gap-1 uppercase transition duration-150 disabled:opacity-50 cursor-pointer"
                    >
                      {isLegendaLoading ? <RefreshCw className="w-2.5 h-2.5 animate-spin" /> : "✍️ Regenerar com IA"}
                    </button>
                  </div>
                  <textarea 
                    value={txtLegenda}
                    onChange={(e) => setTxtLegenda(e.target.value)}
                    className="w-full flex-1 bg-[#050507] border border-white/10 rounded-2xl p-4 text-[11px] font-semibold text-white/80 focus:border-brand-blue outline-none resize-none leading-relaxed text-left"
                  />
                </div>

                {/* Lista de Micro-Serviços */}
                <div className="flex flex-col gap-3">
                  <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Micro-Serviços Ativos</span>
                  <div className="flex flex-col gap-2">
                    {[
                      { key: "legendas", label: "Legendas Didáticas" },
                      { key: "roteiro", label: "Roteiro de Carrossel" },
                      { key: "webp", label: "Compressor WebP Automático" },
                      { key: "video", label: "Vídeo Generativo AI" }
                    ].map((ms) => (
                      <div 
                        key={ms.key}
                        onClick={() => toggleMs(ms.key)}
                        className="flex justify-between items-center bg-white/5 border border-white/5 hover:border-white/10 rounded-xl px-4 py-2.5 cursor-pointer duration-150 group"
                      >
                        <span className="text-xs font-semibold text-white/70 group-hover:text-white transition duration-150">{ms.label}</span>
                        {microServicesState[ms.key] ? (
                          <CheckCircle2 className="w-4 h-4 text-brand-blue" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-white/20" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Botão de Forja Principal */}
              <button 
                onClick={triggerForge}
                className="w-full h-12 bg-brand-gold text-black font-black text-xs tracking-widest uppercase rounded-xl hover:scale-[1.02] active:scale-95 duration-150 mt-5 shadow-lg shadow-brand-gold/15 flex justify-center items-center gap-2 cursor-pointer"
              >
                ✨ EMITIR ORDEM DE SERVIÇO
              </button>
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
                  className="bg-[#0A0A0C] border border-white/10 hover:border-brand-blue rounded-2xl p-3 flex flex-col gap-3 cursor-pointer hover:scale-[1.03] duration-200 group"
                >
                  <div className="aspect-square bg-black rounded-xl overflow-hidden">
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
                className="w-48 h-11 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold"
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
          <div className="bg-[#0A0A0C] border border-white/15 rounded-[30px] p-8 max-w-lg w-full flex flex-col items-center gap-6 shadow-2xl">
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
              <div className="w-full bg-[#050507] border border-white/10 rounded-2xl p-5 text-[10px] font-mono text-[#8A95A5] max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {forgeData.manifest}
              </div>
            )}

            {/* Ações Finais */}
            {forgeProgress === 100 && (
              <button 
                onClick={handleForgeClose}
                className="w-full h-12 bg-brand-gold text-black font-extrabold text-xs tracking-wider rounded-xl hover:scale-105 active:scale-95 duration-200 shadow-lg shadow-brand-gold/15"
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
