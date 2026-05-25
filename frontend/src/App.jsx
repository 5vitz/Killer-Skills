import React, { useState, useEffect } from 'react';
import { 
  Menu, Play, BookOpen, Layers, Settings, ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
  Sparkles, CheckCircle2, Circle, LogOut, ArrowRight, ShieldCheck, 
  Info, Cpu, FolderOpen, Image as ImageIcon, Send, Sliders, RefreshCw, User
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
      <div className="relative w-screen h-screen flex justify-center items-center bg-[#050505] overflow-hidden select-none">
        {/* Glow Neon Azul */}
        <div className="absolute w-[400px] h-[400px] bg-brand-blue/20 rounded-full blur-[120px] left-[15%] top-[10%] pointer-events-none" />
        {/* Glow Neon Dourado */}
        <div className="absolute w-[350px] h-[350px] bg-brand-gold/10 rounded-full blur-[140px] right-[15%] bottom-[10%] pointer-events-none" />

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
              STUDIO COCKPIT v4.0
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
    <div className="relative w-screen h-screen bg-[#050505] flex overflow-hidden text-white antialiased select-none">
      {/* Esferas de Luz Ambiente Reativas (Aceleração por Hardware GPU) */}
      {/* Glow Reativo da Persona Ativa (Esquerda Superior) */}
      <div 
        className="absolute w-[450px] h-[450px] rounded-full blur-[120px] left-[15%] top-[10%] pointer-events-none opacity-20 transition-all duration-1000 ease-in-out z-0"
        style={{ backgroundColor: "#1E60FF" }}
      />
      {/* Glow de Contraste Dourado/Bronze (Direita Inferior) */}
      <div className="absolute w-[350px] h-[350px] bg-brand-gold/10 rounded-full blur-[140px] right-[15%] bottom-[10%] pointer-events-none z-0" />

      {/* 1. BARRA LATERAL METÁLICA PREMIUM */}
      <div className="w-[260px] z-10 flex flex-col justify-between p-5 border-r border-white/10 bg-[#0A0A0A]">
        <div className="flex flex-col gap-6">
          {/* Título do Cockpit */}
          <div>
            <div className="text-2xl font-bold tracking-tight text-white/90">Killer Skills</div>
            <div className={`text-[9px] font-bold tracking-wider uppercase ${isAdminMode ? "text-brand-gold" : "text-brand-blue"}`}>
              {isAdminMode ? "ADMIN COCKPIT" : "STUDIO COCKPIT"}
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
          <div className="flex flex-col gap-1.5">
            <div className="text-[9px] font-bold text-white/30 tracking-widest uppercase mb-2">Painel de Controle</div>
            
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
        <div className="flex flex-col gap-2.5">
          {/* Alternador Administrativo de Cockpit */}
          <button 
            onClick={() => {
              if (isAdminMode) {
                triggerGoogleAuthSequence("scalla_records@gmail.com");
              } else {
                triggerGoogleAuthSequence("artz.genera@gmail.com");
              }
            }}
            className={`w-full h-10 border hover:scale-[1.02] active:scale-95 duration-200 rounded-xl font-bold text-xs tracking-wider flex justify-center items-center gap-2 ${
              isAdminMode 
                ? "bg-brand-gold/10 border-brand-gold/20 text-brand-gold hover:bg-brand-gold/20 animate-pulse" 
                : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white"
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> PAINEL ADM
          </button>

          <button 
            onClick={handleLogout}
            className="w-full h-10 bg-brand-pink/15 hover:bg-brand-pink/25 border border-brand-pink/30 hover:scale-[1.02] active:scale-95 duration-200 text-brand-pink rounded-xl font-bold text-xs tracking-wider flex justify-center items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Sair da Sessão
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full active-pulse" />
            <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">ONLINE NO WEB</span>
          </div>
        </div>
      </div>

      {/* 2. CONTEÚDO PRINCIPAL (COMPLETAMENTE ADAPTÁVEL) */}
      <div className="flex-1 bg-[#050505] p-10 flex flex-col justify-center items-center overflow-hidden">
        
        {/* TELA 1: SERVIÇOS AI (SMARTPHONE DE PLAYBACK - RITUAL GERAR PERSONA) */}
        {activeView === "servicos" && (() => {
          const activeDim = DIMENSOES[Math.min(currentDimIndex, 2)];
          const activeCards = ARCHETYPES.filter(a => a.dim === activeDim.title);
          const activeArchetype = activeCards[currentCardIndex];

          // Lógica do Título de Persona Combinado para a Matriz de Síntese (Dim Index === 3)
          const sortedDosagens = Object.entries(dosagemPersona).sort((a, b) => b[1] - a[1]);
          const archTop1 = ARCHETYPES.find(a => a.id === sortedDosagens[0][0]) || ARCHETYPES[0];
          const archTop2 = ARCHETYPES.find(a => a.id === sortedDosagens[1][0]) || ARCHETYPES[1];
          const combinedTitle = `${archTop1.name} ${archTop2.name}`;

          return (
            <div className="relative w-full h-full flex justify-center items-center">
              {/* Seta sutil absoluta para voltar ao Login (Tela 0) */}
              <button 
                onClick={handleLogout}
                className="absolute top-0 left-0 flex items-center gap-1.5 text-white/20 hover:text-white/60 transition duration-200 text-xs font-semibold p-2 z-40"
              >
                <ChevronLeft className="w-4.5 h-4.5" /> Voltar ao Login
              </button>

              {/* Mockup do Celular Central (Posicionado Fixed para Centramento Perfeito) */}
              <div 
                className="fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[340px] h-[550px] bg-[#0A0A0C] border-2 rounded-[45px] p-4 flex flex-col justify-between items-center shadow-2xl transition-all duration-300 z-30" 
                style={{ borderColor: currentDimIndex === 3 ? "#D4AF37" : activeDim.color }}
              >
                {/* Botões Esquerda/Direita Flutuantes de Navegação por Chapa (Estilo Ingrid Sinkovitz) */}
                {currentDimIndex < 3 && (
                  <>
                    {/* Botão Esquerda (Anterior) */}
                    {currentCardIndex > 0 && (
                      <button 
                        onClick={() => setCurrentCardIndex(prev => prev - 1)}
                        className="absolute right-[calc(100%+8px)] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex justify-center items-center hover:bg-black/80 hover:border-white/40 active:scale-95 transition-all duration-200 shadow-xl cursor-pointer z-40"
                      >
                        <ChevronLeft className="w-4.5 h-4.5 text-white/60" />
                      </button>
                    )}
                    {/* Botão Direita (Próximo / Avançar Bloco) */}
                    {currentCardIndex < 3 ? (
                      <button 
                        onClick={() => setCurrentCardIndex(prev => prev + 1)}
                        className="absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex justify-center items-center hover:bg-black/80 hover:border-white/40 active:scale-95 transition-all duration-200 shadow-xl cursor-pointer z-40"
                      >
                        <ChevronRight className="w-4.5 h-4.5 text-white/60" />
                      </button>
                    ) : (
                      <button 
                        onClick={() => {
                          if (currentDimIndex < 2) {
                            setCurrentDimIndex(prev => prev + 1);
                            setCurrentCardIndex(0);
                          } else {
                            setCurrentDimIndex(3);
                          }
                        }}
                        className="absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-brand-gold border border-brand-gold/30 flex justify-center items-center hover:scale-105 active:scale-95 transition-all duration-200 shadow-xl cursor-pointer z-40 text-black font-bold text-xs"
                        title={currentDimIndex === 2 ? "Concluir para Síntese" : "Avançar para Próxima Dimensão"}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    )}
                  </>
                )}

                {/* Ilha Dinâmica */}
                <div className="absolute w-[110px] h-6 bg-black rounded-2xl top-1.5 left-1/2 -translate-x-1/2 z-20 flex justify-center items-center">
                  <div className="w-2.5 h-2.5 bg-[#030303] rounded-full border border-white/5" />
                </div>

                {/* Visor Interno */}
                <div className="w-full h-full bg-[#050505] rounded-[35px] border border-white/5 flex flex-col justify-between p-4 relative overflow-hidden z-10 select-none text-white">
                  {currentDimIndex < 3 ? (
                    /* FASE DE DOSAGEM (CARROSSÉIS 3X4) */
                    <div className="w-full h-full flex flex-col justify-between relative select-none animate-fade-in">
                      {/* Imagem de Fundo do Portal com Vignette de UI Pré-Planejado */}
                      <img 
                        src={activeArchetype.seedUrl} 
                        className="absolute inset-0 w-full h-full object-cover rounded-[30px] brightness-[0.6] pointer-events-none transition-all duration-500" 
                        alt={activeArchetype.name}
                      />
                      {/* Vignette Gradiente Escuro na base e no topo (UI Shadow Overlay) */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 rounded-[30px] pointer-events-none" />

                      {/* Header do Card Overlay */}
                      <div className="absolute top-4 inset-x-4 flex flex-col gap-1 z-20 text-left pointer-events-none">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] font-black uppercase tracking-widest text-[#FFD966]">
                            Dimensão {activeDim.title}
                          </span>
                          <span className="text-[7.5px] font-bold text-white/50 bg-black/40 border border-white/10 px-2 py-0.5 rounded-full uppercase">
                            CARD {currentCardIndex + 1} / 4
                          </span>
                        </div>
                        <h2 className="text-xl font-black tracking-tight text-white mt-1">
                          {activeArchetype.name}
                        </h2>
                      </div>

                      {/* Conteúdo Filosófico e de Sombra */}
                      <div className="absolute bottom-28 inset-x-4 flex flex-col gap-1.5 z-20 text-left pointer-events-none">
                        <p className="text-[10px] text-white/90 leading-relaxed font-semibold">
                          {activeArchetype.desc}
                        </p>
                        <p className="text-[9px] text-[#FFD966]/80 leading-relaxed font-medium italic">
                          {activeArchetype.shadow}
                        </p>
                      </div>

                      {/* O Slider de Vidro sobre o Card (Pre-designed bottom UI glassmorphic bar) */}
                      <div className="absolute bottom-12 inset-x-4 bg-black/65 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex flex-col gap-1.5 z-20">
                        <div className="flex justify-between items-center text-[10px] font-bold text-white/80">
                          <span className="uppercase tracking-widest text-[8px] text-white/40 font-bold">Gradação</span>
                          <span className="text-brand-gold font-black text-xs">{dosagemPersona[activeArchetype.id]}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={dosagemPersona[activeArchetype.id]}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setDosagemPersona(prev => ({ ...prev, [activeArchetype.id]: val }));
                          }}
                          className="w-full accent-brand-gold h-1 bg-white/20 rounded-lg cursor-pointer appearance-none"
                        />
                      </div>

                      {/* Dots do Sistema de "Bolinhas" (Navegação Horizontal) */}
                      <div className="absolute bottom-3 inset-x-0 flex justify-center items-center gap-2 z-20">
                        {activeCards.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentCardIndex(idx)}
                            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                              idx === currentCardIndex ? 'w-4' : 'w-1.5'
                            }`}
                            style={{ backgroundColor: idx === currentCardIndex ? activeDim.color : 'rgba(255,255,255,0.25)' }}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* PAINEL MATRIZ DE SÍNTESE (RESULTADO FINAL DA PERSONA) */
                    <div className="w-full h-full flex flex-col justify-between p-1 select-none animate-fade-in">
                      {/* Header da Síntese */}
                      <div className="flex flex-col gap-1 border-b border-white/10 pb-3 text-left">
                        <div className="text-[8px] font-black text-brand-gold uppercase tracking-widest">Matriz Arquetípica</div>
                        <h2 className="text-base font-black text-white leading-tight">Síntese da Sua Persona</h2>
                      </div>

                      {/* Lista de Gradações dos 12 Sliders (Grid Compacto Scrollable) */}
                      <div className="flex-1 my-3 overflow-y-auto pr-1 flex flex-col gap-2.5 max-h-[220px]">
                        {ARCHETYPES.map((arch) => {
                          const dimColor = arch.dim === "Alma" ? "#D4AF37" : arch.dim === "Ação" ? "#E06666" : "#8E7CC3";
                          return (
                            <div key={arch.id} className="flex flex-col gap-1 text-left bg-white/[0.02] border border-white/5 p-2 rounded-xl">
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
                          // Conclui e direciona à Tela 2
                          setActiveView("servicos_escolha");
                        }}
                        className="w-full h-11 bg-brand-gold hover:bg-brand-gold/90 active:scale-95 text-black rounded-xl font-black text-xs tracking-wider flex justify-center items-center gap-2 shadow-lg hover:shadow-brand-gold/20 duration-200 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" /> GERAR PERSONA
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* TELA 2: SERVIÇOS & CONSTRUTOR DE PROMPT */}
        {activeView === "servicos_escolha" && (
          <div className="relative w-full h-full flex justify-center items-center">
            {/* Seta sutil absoluta para voltar ao Login (Tela 0) */}
            <button 
              onClick={handleLogout}
              className="absolute top-0 left-0 flex items-center gap-1.5 text-white/20 hover:text-white/60 transition duration-200 text-xs font-semibold p-2 z-40"
            >
              <ChevronLeft className="w-4.5 h-4.5" /> Voltar ao Login
            </button>

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
            {/* Seta sutil absoluta para voltar ao Login (Tela 0) */}
            <button 
              onClick={handleLogout}
              className="absolute top-0 left-0 flex items-center gap-1.5 text-white/20 hover:text-white/60 transition duration-200 text-xs font-semibold p-2 z-40"
            >
              <ChevronLeft className="w-4.5 h-4.5" /> Voltar ao Login
            </button>

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
                      <span className="text-xs font-black uppercase tracking-widest text-brand-blue">Cockpit de Forja</span>
                    </div>
                    <div className="text-[10px] font-bold text-white/40 uppercase mt-0.5">Editor de Legenda e Micro-Serviços</div>
                  </div>
                </div>

                <hr className="border-white/10" />

                {/* Textarea Legenda */}
                <div className="flex flex-col gap-2 flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Legenda Forjada</span>
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
                🔥 FORJAR ORDEM DE SERVIÇO
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
              <h2 className="text-2xl font-bold">A Forja está ativada...</h2>
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
