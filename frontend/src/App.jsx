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

export default function App() {
  // --- ESTADO GLOBAL ---
  const [activeView, setActiveView] = useState("servicos"); // storyboard, servicos, almoxarifado, admin_console
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [userEmail, setUserEmail] = useState("");
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
        
        {/* TELA 1: SERVIÇOS AI (SMARTPHONE DE PLAYBACK) */}
        {activeView === "servicos" && (
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

              {/* Botões Esquerda/Direita para Navegação do Carrossel (Aparecem somente quando o portal está aberto) */}
              {isPortalOpen && (
                <>
                  {currentSlideIdx > 0 && (
                    <button 
                      onClick={() => setCurrentSlideIdx(prev => Math.max(0, prev - 1))}
                      className="absolute right-[calc(100%+8px)] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex justify-center items-center hover:bg-black/80 hover:border-white/40 active:scale-95 transition-all duration-200 shadow-xl cursor-pointer z-40"
                    >
                      <ChevronLeft className="w-4.5 h-4.5 text-white/60" />
                    </button>
                  )}
                  {currentSlideIdx < 5 && (
                    <button 
                      onClick={() => setCurrentSlideIdx(prev => Math.min(5, prev + 1))}
                      className="absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex justify-center items-center hover:bg-black/80 hover:border-white/40 active:scale-95 transition-all duration-200 shadow-xl cursor-pointer z-40"
                    >
                      <ChevronRight className="w-4.5 h-4.5 text-white/60" />
                    </button>
                  )}
                </>
              )}
              
              {/* Ilha Dinâmica */}
              <div className="absolute w-[110px] h-6 bg-black rounded-2xl top-1.5 left-1/2 -translate-x-1/2 z-20 flex justify-center items-center">
                <div className="w-2.5 h-2.5 bg-[#030303] rounded-full border border-white/5" />
              </div>

              {/* Visor Interno de Reels */}
              <div className="w-full h-full bg-[#050505] rounded-[35px] border border-white/5 flex flex-col justify-between p-4 relative overflow-hidden z-10">
                {!isPortalOpen ? (
                  /* Modo A: Seleção de Persona */
                  <div className="w-full h-full flex flex-col justify-between p-1 select-none animate-fade-in">
                    {/* Card 1: Saudação Reativa */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-2 select-none text-left">
                      <div className="text-[10px] font-bold text-brand-blue uppercase tracking-widest">Saudação Ativa</div>
                      <div className="text-sm font-extrabold text-white/90">
                        Saudações, Genera! 👋
                      </div>
                      <div className="text-[11px] text-white/60 leading-relaxed font-semibold">
                        Como você se posiciona socialmente?
                      </div>
                    </div>

                    {/* Card 2: Persona Ativa slot vertical */}
                    <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-3xl p-5 flex flex-col justify-between items-center text-center relative overflow-hidden group select-none transition-all duration-300 mt-3">
                      {/* Glow interno reativo sutil */}
                      <div 
                        className="absolute inset-0 opacity-10 blur-xl pointer-events-none group-hover:scale-110 transition duration-500" 
                        style={{ background: "radial-gradient(circle, #1E60FF 0%, transparent 70%)" }}
                      />
                      
                      <div className="flex flex-col items-center gap-2 mt-2">
                        <div 
                          className="w-10 h-10 rounded-2xl flex justify-center items-center font-bold text-sm shadow-lg mb-1"
                          style={{ backgroundColor: "#1E60FF25", color: "#1E60FF", border: "1px solid #1E60FF40" }}
                        >
                          <User className="w-5 h-5" />
                        </div>
                        <div className="text-lg font-black tracking-tight" style={{ color: "#1E60FF" }}>
                          {currentPersona.title}
                        </div>
                        <div className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
                          {currentPersona.subtitle}
                        </div>
                        <p className="text-[10px] text-white/50 px-4 leading-relaxed font-medium mt-1">
                          {currentPersona.desc}
                        </p>
                      </div>

                      {/* Botão Entrar no Portal */}
                      <button
                        onClick={() => {
                          setIsPortalOpen(true);
                          setCurrentSlideIdx(0);
                        }}
                        className="w-full h-10 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 group-hover:border-white/20 rounded-xl font-extrabold text-xs tracking-wider flex justify-center items-center gap-2 transition duration-200 mt-4 shadow-inner"
                      >
                        <Sparkles className="w-3.5 h-3.5" style={{ color: "#1E60FF" }} />
                        🔮 Entrar no Portal
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Modo B: Carrossel Horizontal do Portal (Fórmulas X.Y) */
                  <div className="w-full h-full flex flex-col justify-between p-1 select-none animate-fade-in">
                    {/* Header do Portal com Botão Fechar */}
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <div className="text-left">
                        <div className="text-[8px] font-bold text-brand-gold uppercase tracking-widest">Jornada de Iniciação</div>
                        <div className="text-[10px] font-black text-white/80">Portal da {currentPersona.title}</div>
                      </div>
                      <button 
                        onClick={() => setIsPortalOpen(false)}
                        className="px-2 h-5 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 rounded-md text-[8px] font-bold tracking-wider text-white/60 hover:text-white transition duration-150"
                      >
                        Voltar
                      </button>
                    </div>

                    {/* Slide Ativo (Matriz X.Y) */}
                    <div className="flex-1 my-3 bg-white/[0.02] border border-white/5 rounded-3xl p-5 flex flex-col justify-between items-center text-center relative overflow-hidden">
                      {/* Luz ambiente interna do carrossel */}
                      <div 
                        className="absolute w-[200px] h-[200px] rounded-full blur-[80px] opacity-10 pointer-events-none"
                        style={{ backgroundColor: "#1E60FF" }}
                      />
                      
                      {/* Código Mágico do Slide no Topo */}
                      <div 
                        className="px-3 py-1 rounded-full text-[9px] font-black tracking-widest border"
                        style={{ borderColor: "#1E60FF30", backgroundColor: "#1E60FF15", color: "#1E60FF" }}
                      >
                        SLIDE {selectedPersonaIdx + 1}.{currentSlideIdx + 1}
                      </div>

                      {/* Título & Descrição Metafórica do Slide */}
                      <div className="flex flex-col gap-2">
                        <div className="text-base font-black text-white/90">
                          {currentSlideIdx === 0 && "Filosofia Central"}
                          {currentSlideIdx === 1 && "Luz do Arquétipo"}
                          {currentSlideIdx === 2 && "Sombra & Desafios"}
                          {currentSlideIdx === 3 && "Estética Recomendada"}
                          {currentSlideIdx === 4 && "Tom de Voz & Redação"}
                          {currentSlideIdx === 5 && "Convocação Concluída"}
                        </div>
                        <p className="text-[10.5px] text-white/50 px-2 leading-relaxed font-medium">
                          {currentSlideIdx === 0 && `Conectando com a sabedoria e a cosmovisão transcendental da Persona ${String(selectedPersonaIdx + 1).padStart(2, '0')}.`}
                          {currentSlideIdx === 1 && `O poder realizador, as virtudes expressivas e os dons ativos revelados sob a claridade do arquétipo.`}
                          {currentSlideIdx === 2 && `Os perigos inconscientes, os vícios ocultos e os gatilhos psicológicos que devem ser mitigados.`}
                          {currentSlideIdx === 3 && `Paletas cromáticas recomendadas, formas geométricas, texturas e as metáforas artísticas ideais.`}
                          {currentSlideIdx === 4 && `Estrutura de copy, cadência verbal, palavras-chave de poder e atitude dialética de alta conversão.`}
                          {currentSlideIdx === 5 && `O portal psicológico foi completamente cruzado. A Ordem de Convocação está selada e pronta para o KS Studio.`}
                        </p>
                      </div>

                      {/* Controles de Slide e Ação de Finalização */}
                      <div className="w-full mt-3">
                        {currentSlideIdx === 5 && (
                          <button 
                            onClick={() => {
                              setActiveView("servicos_escolha");
                              setIsPortalOpen(false);
                            }}
                            className="w-full h-10 bg-brand-gold hover:bg-brand-gold/90 active:scale-95 text-black rounded-xl font-black text-xs tracking-wider flex justify-center items-center gap-2 shadow-lg hover:shadow-brand-gold/20 duration-200 animate-pulse cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" /> OK: Convocação Concluída
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Dots Indicadores de Progresso do Carrossel */}
                    <div className="flex justify-center items-center gap-1.5 py-1">
                      {Array.from({ length: 6 }).map((_, idx) => (
                        <span 
                          key={idx} 
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            idx === currentSlideIdx 
                              ? "w-4" 
                              : "w-1.5"
                          }`}
                          style={{ backgroundColor: idx === currentSlideIdx ? "#1E60FF" : "rgba(255,255,255,0.15)" }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

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
