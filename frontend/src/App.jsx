import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, Play, BookOpen, Layers, Settings, ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
  Sparkles, CheckCircle2, Circle, LogOut, ArrowRight, ShieldCheck, 
  Info, Cpu, FolderOpen, Image as ImageIcon, Send, Sliders, RefreshCw, User,
  Volume2, VolumeX
} from 'lucide-react';
import { ARCHETYPES, ARCHETYPE_DETAILS, SEED_IMAGES, TEXTO_PADRAO } from './data/archetypes';
import AudioControls from './components/AudioControls';
import LoginScreen from './components/LoginScreen';
import DefinicoesPost from './components/DefinicoesPost';
import ServicosPremium from './components/ServicosPremium';
import MyselfSidebar from './components/MyselfSidebar';

const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" 
  ? "http://localhost:8000" 
  : "";

export default function App() {
  const servicosManual = [
    { id: 1, name: "Upload de Mídia (Permanente)", premium: true },
    { id: 2, name: "Compressor WebP Nativo", premium: false },
    { id: 3, name: "Adequação de Proporções", premium: false },
    { id: 4, name: "Criar Flow Manual", premium: false },
    { id: 5, name: "Simular Flow Manual", premium: false }
  ];

  const servicosIA = [
    { id: 6, name: "Curadoria Estética Grade (Grid IA)", premium: true },
    { id: 7, name: "Criação de Legendas - IA", premium: true },
    { id: 8, name: "Roteirização Reels (Director's Cut)", premium: true },
    { id: 9, name: "Geração de Imagens - IA", premium: true },
    { id: 10, name: "Geração de Vídeos - IA", premium: true },
    { id: 11, name: "Flow Automatizado - IA", premium: true }
  ];

  const servicosPostagem = [
    { id: 12, name: "Postar VPS Automatizado", premium: true },
    { id: 13, name: "Agendar Post Automatizado", premium: true }
  ];

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
  const [expandedSvc, setExpandedSvc] = useState("manual"); // "manual", "ia", "postagem"
  const [postType, setPostType] = useState("reels"); // "reels", "carrossel", "imagem_unica"
  const [postQty, setPostQty] = useState(0);
  const [personaConfirmed, setPersonaConfirmed] = useState(false);
  const [agendamentoData, setAgendamentoData] = useState("");
  const [agendamentoHora, setAgendamentoHora] = useState("");
  const [loteProducao, setLoteProducao] = useState([]);
  const isPremium = isLoggedIn && userEmail !== "free@killerskills.com.br";

  const getTetracordeMeva = () => {
    const sorted = Object.entries(dosagemPersona).sort((a, b) => b[1] - a[1]);
    
    const t1Id = sorted[0][0];
    const t1Val = sorted[0][1];
    const top1 = ARCHETYPES.find(a => a.id === t1Id) || ARCHETYPES[0];
    
    // Terça (2º lugar): Só ativa se > 50%
    const t2Id = sorted[1] ? sorted[1][0] : null;
    const t2Val = sorted[1] ? sorted[1][1] : 0;
    const top2 = t2Val > 50 ? (ARCHETYPES.find(a => a.id === t2Id) || null) : null;
    
    // Quinta (3º lugar): Só ativa se > 50%. E resolvemos empates na 3ª posição.
    const t3Val = sorted[2] ? sorted[2][1] : 0;
    const quintas = [];
    if (t3Val > 50) {
      for (let i = 2; i < sorted.length; i++) {
        // Se chegarmos no 4º elemento (índice 3), interrompemos para a Quinta não absorver a Sétima
        if (i === 3) break;
        if (sorted[i][1] === t3Val) {
          const arch = ARCHETYPES.find(a => a.id === sorted[i][0]);
          if (arch) quintas.push(arch);
        } else {
          break;
        }
      }
    }

    // Sétima (4º lugar): Só ativa se > 50%
    const t4Id = sorted[3] ? sorted[3][0] : null;
    const t4Val = sorted[3] ? sorted[3][1] : 0;
    const top4 = t4Val > 50 ? (ARCHETYPES.find(a => a.id === t4Id) || null) : null;

    // Subtoms: tudo o que sobrou (com valor estritamente acima do neutro de 50%)
    // Excluímos a tônica, a terça, as quintas e a sétima (se ativas)
    const quintasIds = quintas.map(q => q.id);
    const subtoms = sorted.filter(([k, v]) => {
      if (k === t1Id) return false;
      if (top2 && k === top2.id) return false;
      if (quintasIds.includes(k)) return false;
      if (top4 && k === top4.id) return false;
      return v > 50;
    }).map(([k, v]) => ARCHETYPES.find(a => a.id === k)).filter(Boolean);

    return { top1, t1Val, top2, t2Val, quintas, t3Val, top4, t4Val, subtoms };
  };

  const compilarDiagnosticoTetracorde = () => {
    const { top1, top2, quintas, top4, subtoms } = getTetracordeMeva();
    
    const tonicaText = `Sua marca pessoal irradia a mensagem de ${top1.tag.toLowerCase()} guiada pela essência do ${top1.name}.`;
    const tercaText = top2 
      ? ` Suas narrativas ganham vida no cenário de ${top2.tag.toLowerCase()} do ${top2.name},`
      : "";
    
    let quintaText = "";
    if (quintas.length > 0) {
      const qText = quintas.map(q => `${q.tag.toLowerCase()} do ${q.name}`).join(" e ");
      quintaText = `${top2 ? " materializando-se" : " Materializando-se"} em detalhes de ${qText}.`;
    } else {
      quintaText = `${top2 ? " sob" : " Sob"} uma estética silenciosa, minimalista e focada.`;
    }

    const setimaText = top4
      ? ` Todo o conjunto sob a direção de estilo ${top4.tag.toLowerCase()} do ${top4.name}.`
      : "";
    
    const subList = subtoms.slice(0, 2).map(s => s.name);
    const coloridoText = subList.length > 0
      ? ` Pinceladas sutis de ${subList.join(" e ")} matizam com delicadeza sua atitude de comunicação.`
      : "";
      
    return `${tonicaText}${tercaText}${quintaText}${setimaText}${coloridoText}`;
  };

  const getPromptMestre = () => {
    const { top1, t1Val, top2, t2Val, quintas, t3Val, top4, t4Val, subtoms } = getTetracordeMeva();
    
    const tonicaSection = `- MENSAGEM / SIGNIFICADO (Tônica): ${top1.name} (Tag: ${top1.tag}, Dosagem: ${t1Val}%)`;
    const tercaSection = top2 
      ? `- CENÁRIO / CONTEXTO (Terça): ${top2.name} (Tag: ${top2.tag}, Dosagem: ${t2Val}%)`
      : "- CENÁRIO / CONTEXTO (Terça): NEUTRO (Abaixo do limite de 50%)";
      
    let quintaSection = "";
    if (quintas.length > 0) {
      quintaSection = `- OBJETOS / ELEMENTOS (Quinta): ${quintas.map(q => `${q.name} (Tag: ${q.tag})`).join(" + ")} (Dosagem: ${t3Val}%)`;
    } else {
      quintaSection = "- OBJETOS / ELEMENTOS (Quinta): NEUTRO (Abaixo do limite de 50%)";
    }

    const setimaSection = top4
      ? `- ESTILO / FOTOGRAFIA (Sétima): ${top4.name} (Tag: ${top4.tag}, Dosagem: ${t4Val}%)`
      : "- ESTILO / FOTOGRAFIA (Sétima): NEUTRO (Abaixo do limite de 50%)";

    const subtomsSection = subtoms.length > 0
      ? `- COLORIDO / SUBTOMS: Pinceladas sutis de ${subtoms.map(s => s.name).slice(0, 3).join(", ")}`
      : "";

    return `PROMPT DNA ARQUETÍPICO (TETRACORDE HARMÔNICO MEVA):
[DIRETRIZES DE ARQUITETURA VISUAL E VOZ]
${tonicaSection}
${tercaSection}
${quintaSection}
${setimaSection}
${subtomsSection}

[REGRAS DE PRODUÇÃO]
- O tom falado e copy da legenda derivam da Tônica (${top1.name} - ${top1.tag}).
- A atmosfera visual e o cenário do Reels/Carrossel derivam da Terça (${top2 ? `${top2.name} - ${top2.tag}` : "Neutro"}).
- Os adereços e detalhes visuais da cena derivam da Quinta (${quintas.length > 0 ? quintas.map(q => q.name).join(" + ") : "Neutro"}).
- A direção de fotografia e o verniz estético derivam da Sétima (${top4 ? `${top4.name} - ${top4.tag}` : "Neutro"}).
- A coloração geral e sutileza de tom incorporam o colorido dos Subtoms.`;
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
  const [forgeProgress, setForgeProgress] = useState(0);
  const [forgeData, setForgeData] = useState(null);

  // Carregar Personas do Backend no startup
  useEffect(() => {
    fetch(`${API_BASE}/api/personas`)
      .then(res => res.json())
      .then(data => setPersonas(data))
      .catch(err => console.error("Erro ao carregar personas do backend:", err));
  }, []);

  // --- LÓGICA DE LOTES ACUMULADOS ---
  const handleAdicionarAoLote = () => {
    if (postQty === 0) {
      alert("Por favor, selecione uma quantidade maior que 0 antes de adicionar à esteira!");
      return;
    }

    const novoItem = {
      id: Date.now(),
      tipo: postType,
      quantidade: postQty,
      tags: [...tags],
      agendamento: {
        data: agendamentoData,
        hora: agendamentoHora
      },
      custo: postType === "reels" ? postQty * 35 : (postType === "carrossel" ? postQty * 25 : postQty * 15)
    };

    setLoteProducao(prev => [...prev, novoItem]);

    // Limpa campos locais de insumo para permitir a próxima inserção
    setPostQty(0);
    setTags([]);
    setAgendamentoData("");
    setAgendamentoHora("");
  };

  const handleRemoverDoLote = (id) => {
    setLoteProducao(prev => prev.filter(item => item.id !== id));
  };

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
    let loteEnvio = [...loteProducao];
    
    // Salvaguarda: se houver configuração ativa na tela que não foi adicionada, inclui no lote final
    if (postQty > 0) {
      const itemPendente = {
        id: Date.now(),
        tipo: postType,
        quantidade: postQty,
        tags: [...tags],
        agendamento: {
          data: agendamentoData,
          hora: agendamentoHora
        },
        custo: postType === "reels" ? postQty * 35 : (postType === "carrossel" ? postQty * 25 : postQty * 15)
      };
      loteEnvio.push(itemPendente);
    }

    if (loteEnvio.length === 0) {
      alert("Sua esteira de produção está vazia! Configure um post e clique em Adicionar à Esteira primeiro.");
      return;
    }

    const { top1, top2 } = getTetracordeMeva();
    const combinedTitle = top2 
      ? `${top1.name.toUpperCase()} / ${top2.name.toUpperCase()}`
      : top1.name.toUpperCase();

    // Transiciona imediatamente para a Tela 3 (KS Studio) e ativa o progresso reativo da OS
    setActiveView("storyboard");
    setForgeProgress(20);

    try {
      const res = await fetch(`${API_BASE}/api/forge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona_title: combinedTitle,
          persona_tag: isPremium ? "Premium" : "Free",
          micro_services: {
            ...microServicesState
          },
          dosagem: dosagemPersona,
          lote: loteEnvio, // Envia o lote completo de posts estruturados!
          persona_confirmada: personaConfirmed
        })
      });
      setForgeProgress(60);
      const data = await res.json();
      setForgeProgress(100);
      setForgeData(data);
      
      // Limpa o lote local após emissão bem-sucedida
      setLoteProducao([]);
    } catch (e) {
      console.error(e);
      setForgeProgress(100);
    }
  };

  const handleSimularEsteira = () => {
    setForgeProgress(0);
    setForgeData(null);
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

  const renderDefinicoesPost = () => {
    return (
      <DefinicoesPost
        expandedSection={expandedSection}
        setExpandedSection={setExpandedSection}
        personaConfirmed={personaConfirmed}
        setPersonaConfirmed={setPersonaConfirmed}
        isPremium={isPremium}
        setActiveView={setActiveView}
        setOnboardingStep={setOnboardingStep}
        postType={postType}
        setPostType={setPostType}
        postQty={postQty}
        setPostQty={setPostQty}
        tags={tags}
        setTags={setTags}
        tagInput={tagInput}
        setTagInput={setTagInput}
        loteProducao={loteProducao}
        handleAdicionarAoLote={handleAdicionarAoLote}
        handleRemoverDoLote={handleRemoverDoLote}
        agendamentoData={agendamentoData}
        setAgendamentoData={setAgendamentoData}
        agendamentoHora={agendamentoHora}
        setAgendamentoHora={setAgendamentoHora}
      />
    );
  };

  const renderServicosPremium = () => {
    return (
      <ServicosPremium
        expandedSvc={expandedSvc}
        setExpandedSvc={setExpandedSvc}
        isPremium={isPremium}
        servicosManual={servicosManual}
        servicosIA={servicosIA}
        servicosPostagem={servicosPostagem}
      />
    );
  };

  // 1. TELA DE LOGIN (SMARTPHONE DE GLOWS AZUL/DOURADO)
  if (!isLoggedIn) {
    return (
      <LoginScreen
        loginStage={loginStage}
        enteredEmail={enteredEmail}
        setEnteredEmail={setEnteredEmail}
        loginPassword={loginPassword}
        setLoginPassword={setLoginPassword}
        handleEmailSubmit={handleEmailSubmit}
        handlePasswordSubmit={handlePasswordSubmit}
        passwordInputRef={passwordInputRef}
      />
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
      <MyselfSidebar
        showPersonaCard={showPersonaCard}
        activeView={activeView}
        setActiveView={setActiveView}
        userEmail={userEmail}
        isAdminMode={isAdminMode}
        triggerGoogleAuthSequence={triggerGoogleAuthSequence}
        handleLogout={handleLogout}
        getTetracordeMeva={getTetracordeMeva}
        compilarDiagnosticoTetracorde={compilarDiagnosticoTetracorde}
        setOnboardingStep={setOnboardingStep}
        activeArch={activeArch}
      />

      {/* 2. CONTEÚDO PRINCIPAL (COMPLETAMENTE ADAPTÁVEL) */}
      <div className="flex-1 bg-[#050505] p-10 flex flex-col justify-center items-center overflow-hidden">
        
        {/* TELA 1: SERVIÇOS AI (SMARTPHONE DE PLAYBACK - RITUAL GERAR PERSONA) */}
        {activeView === "servicos" && (() => {
          // Lógica do Título de Persona Combinado para a Matriz de Síntese
          const { top1, top2 } = getTetracordeMeva();
          const combinedTitle = top2 
            ? `${top1.name} ${top2.name}`
            : top1.name;

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
                            style={{ fontFamily: 'Poppins', fontWeight: 300 }}
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
                    style={{ fontFamily: 'Poppins', fontWeight: 300 }}
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

                <AudioControls
                  isMuted={isMuted}
                  setIsMuted={setIsMuted}
                  volume={volume}
                  setVolume={setVolume}
                />
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
                    style={{ fontFamily: 'Poppins', fontWeight: 300 }}
                  >
                    DEFINIÇÕES DO POST
                  </h2>
                </div>

                {/* Bloco Superior: DEFINIÇÕES DO POST (PRÉ-PRODUÇÃO, PRODUÇÃO, PÓS-PRODUÇÃO) */}
                {renderDefinicoesPost()}

                {/* Bloco de Custo Estimado Reativo em Destaque Dourado Metalizado */}
                <div className="w-full shrink-0 bg-gradient-to-r from-brand-gold/10 via-brand-gold/5 to-transparent border border-brand-gold/30 rounded-lg p-2 flex items-center justify-between text-left select-none mb-3">
                  <div className="flex flex-col">
                    <span className="text-[7px] font-bold text-brand-gold/80 uppercase tracking-wider">Custo da Ordem de Serviço</span>
                    <span className="text-[9.5px] font-black text-brand-gold uppercase tracking-wide">
                      Créditos Consumidos: {loteProducao.reduce((sum, item) => sum + item.custo, 0) + (postQty === 0 ? 0 : (postType === "reels" ? postQty * 35 : (postType === "carrossel" ? postQty * 25 : postQty * 15)))} cr
                    </span>
                  </div>
                  <span className="text-sm select-none">💰</span>
                </div>

                {/* Botão de Emissão de OS na base */}
                <button 
                  onClick={triggerForge}
                  disabled={loteProducao.length === 0 && postQty === 0}
                  className={`w-full h-10 rounded-lg text-black text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 relative z-10 shrink-0 shadow-lg duration-200 ${
                    loteProducao.length === 0 && postQty === 0 
                      ? "bg-white/5 border border-white/10 text-white/20 cursor-not-allowed active:scale-100" 
                      : "bg-[#EFE5D3] hover:bg-[#F7EFE2] active:scale-95 cursor-pointer"
                  }`}
                >
                  Emitir Ordem de Serviço <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* COLUNA LATERAL DIREITA: Serviços Premium (Acordeões) */}
            <div className="absolute -right-10 -top-10 -bottom-10 w-[320px] border-l border-white/10 bg-[#0A0A0A] p-5 flex flex-col justify-between z-20 text-left animate-fade-in text-white shadow-2xl">
              
              {/* CONTEÚDO DO PORTAL: 3 Cards Expansíveis (Acordeões) */}
              <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                <div 
                  className="flex-1 w-full relative rounded-lg overflow-hidden border border-white/10 shadow-lg p-4 flex flex-col justify-between transition-all duration-500"
                  style={{ background: ACTIVE_COCKPIT_GRADIENT }}
                >
                  <div className="flex flex-col gap-2.5 relative z-10 flex-1 overflow-hidden">
                    {/* TÍTULO INTERNO DO CARD ALINHADO */}
                    <div className="w-full shrink-0 select-none mt-2 mb-3">
                      <h2 
                        className="text-[11px] uppercase tracking-widest text-white/50 text-center"
                        style={{ fontFamily: 'Poppins', fontWeight: 300 }}
                      >
                        SERVIÇOS PREMIUM
                      </h2>
                    </div>

                    {/* Acordeões de Serviços */}
                    {renderServicosPremium()}
                  </div>

                  {/* Botão de Upgrade para Free */}
                  {!isPremium && (
                    <button 
                      onClick={() => {
                        setActiveView("servicos");
                        setOnboardingStep("video");
                      }}
                      className="w-full h-11 bg-brand-gold hover:bg-[#F0C547] active:scale-95 duration-200 rounded-lg text-black text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 relative z-10 mt-3 shrink-0 shadow-lg shadow-brand-gold/15"
                    >
                      Fazer Upgrade para Premium <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <AudioControls
                isMuted={isMuted}
                setIsMuted={setIsMuted}
                volume={volume}
                setVolume={setVolume}
              />
            </div>

          </div>
        )}

        {/* TELA 3: KS STUDIO (STORYBOARD + INSIGHTS + SIMULADOR DE FEED) */}
        {activeView === "storyboard" && (
          <div className="relative w-full h-full flex justify-center items-center">

            {/* Mockup do Celular Central (Posicionado Fixed para Centramento Perfeito) */}
            <div className="fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[340px] h-[550px] bg-[#0A0A0C] border border-white/10 rounded-lg p-4 flex flex-col justify-between items-center shadow-2xl transition-all duration-300 z-30">
              {/* Visor Interno: Modo Forja/Manifesto ou Modo Padrão */}
              {forgeProgress > 0 ? (
                <div className="w-full h-full bg-[#050505] rounded-lg border border-white/5 flex flex-col justify-between items-center p-5 relative overflow-hidden z-10 text-center">
                  <div className="flex flex-col items-center gap-3 mt-4 w-full shrink-0">
                    <Cpu className="w-9 h-9 text-brand-gold animate-pulse shrink-0" />
                    <div>
                      <h2 
                        className="text-sm uppercase tracking-wider text-white text-center"
                        style={{ fontFamily: 'Poppins', fontWeight: 300 }}
                      >
                        A Criação está ativada...
                      </h2>
                      <p className="text-[7px] font-bold text-brand-blue uppercase tracking-widest mt-1">Orquestrador Central assimilando agentes</p>
                    </div>

                    {/* Barra de Progresso */}
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5 mt-1 shrink-0">
                      <div 
                        className="bg-brand-gold h-full duration-500 transition-all" 
                        style={{ width: `${forgeProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Console de Saída YAML do Manifest */}
                  {forgeData ? (
                    <div className="w-full flex-1 bg-[#050507] border border-white/10 rounded-lg p-3 text-[8px] font-mono text-[#8A95A5] overflow-y-auto text-left whitespace-pre-wrap leading-normal mt-3 mb-3 select-text scrollbar-thin">
                      {forgeData.manifest}
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-white/30 text-[8px] uppercase tracking-widest select-none">
                      Compilando ordem de serviço...
                    </div>
                  )}

                  {/* Botão de Conclusão e Simulação */}
                  {forgeProgress === 100 && (
                    <button 
                      onClick={handleSimularEsteira}
                      className="w-full h-10 bg-brand-gold text-black font-extrabold text-[9px] tracking-widest rounded-lg hover:scale-[1.02] active:scale-95 duration-200 shadow-lg shadow-brand-gold/15 shrink-0 uppercase"
                    >
                      Simular Esteira em Prod ➔
                    </button>
                  )}
                </div>
              ) : (
                /* Visor Interno de Reels Vazio (Padrão) */
                <div className="w-full h-full bg-[#050505] rounded-lg border border-white/5 flex flex-col justify-center items-center p-6 relative overflow-hidden z-10 select-none text-center">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex justify-center items-center mb-4">
                    <Sparkles className="w-5 h-5 text-brand-blue" />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-white mb-2">KS STUDIO</h3>
                  <p className="text-[9px] text-white/40 leading-relaxed uppercase tracking-wider max-w-[200px]">
                    Direção estética e simulação de reels. Acesse os painéis laterais para calibração.
                  </p>
                </div>
              )}
            </div>

            {/* COLUNA LATERAL DIREITA: Painel Estritamente Simétrico ao Menu Esquerdo (Área com o Card Vazio) */}
            <div className="absolute -right-10 -top-10 -bottom-10 w-[320px] border-l border-white/10 bg-[#0A0A0A] p-5 flex flex-col justify-between z-20 text-left animate-fade-in text-white shadow-2xl">
              {/* TOPO FIXO: Título Geral */}
              <div className="flex flex-col gap-1 w-full shrink-0 select-none mb-3">
                <h2 
                  className="text-sm uppercase tracking-wider text-white text-center font-extralight"
                  style={{ fontFamily: 'Poppins', fontWeight: 300 }}
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

              <AudioControls
                isMuted={isMuted}
                setIsMuted={setIsMuted}
                volume={volume}
                setVolume={setVolume}
              />
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


    </div>
  );
}