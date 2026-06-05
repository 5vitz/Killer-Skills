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
import EspelhoDaAlma from './components/EspelhoDaAlma';
import PortalPersona from './components/PortalPersona';
import KsStudio from './components/KsStudio';
import Almoxarifado from './components/Almoxarifado';

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

  // Estado do E-mail de Acesso
  const [enteredEmail, setEnteredEmail] = useState(() => localStorage.getItem("userEmail") || "");
  
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

    // Salvar e-mail no localStorage para lembrar na próxima visita
    localStorage.setItem('userEmail', email);

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

  const onGoogleLoginSuccess = async (email, idToken) => {
    if (!email) return;
    
    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email })
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        triggerGoogleAuthSequence(email);
      } else {
        alert(data.detail || "E-mail não cadastrado em nosso sistema!");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar ao servidor de autenticação. Verifique se o backend está rodando!");
    }
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
        onGoogleLoginSuccess={onGoogleLoginSuccess}
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
        personaConfirmed={personaConfirmed}
        setPersonaConfirmed={setPersonaConfirmed}
        isPremium={isPremium}
      />

      {/* 2. CONTEÚDO PRINCIPAL (COMPLETAMENTE ADAPTÁVEL) */}
      <div className="flex-1 bg-[#050505] p-10 flex flex-col justify-center items-center overflow-hidden">
        
        {/* TELA 1: SERVIÇOS AI (SMARTPHONE DE PLAYBACK - RITUAL GERAR PERSONA) */}
        {activeView === "servicos" && (() => {
          const activeArch = onboardingStep === "matriz" ? (hoveredArchetype || ARCHETYPES[0]) : null;
          return (
            <div className="relative w-full h-full flex justify-center items-center">
              
              <EspelhoDaAlma
                onboardingStep={onboardingStep}
                setOnboardingStep={setOnboardingStep}
                dosagemPersona={dosagemPersona}
                setDosagemPersona={setDosagemPersona}
                setHoveredArchetype={setHoveredArchetype}
                activeArch={activeArch}
                setHasPersonaDefined={setHasPersonaDefined}
                setActiveView={setActiveView}
              />

              <PortalPersona
                activeArch={activeArch}
                isMuted={isMuted}
                setIsMuted={setIsMuted}
                volume={volume}
                setVolume={setVolume}
              />

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

                  {/* BLOCOS MOVIDOS: Custo no Rodapé do Card */}
                  <div className="relative z-10 flex flex-col gap-3 mt-3 pt-3 border-t border-white/5 shrink-0">
                    {/* Bloco de Custo Estimado Reativo em Destaque Dourado Metalizado */}
                    <div className="w-full bg-gradient-to-r from-brand-gold/10 via-brand-gold/5 to-transparent border border-brand-gold/30 rounded-lg p-2 flex items-center justify-between text-left select-none">
                      <div className="flex flex-col">
                        <span className="text-[7px] font-bold text-brand-gold/80 uppercase tracking-wider">Custo da Ordem de Serviço</span>
                        <span className="text-[9.5px] font-black text-brand-gold uppercase tracking-wide">
                          Créditos Consumidos: {loteProducao.reduce((sum, item) => sum + item.custo, 0) + (postQty === 0 ? 0 : (postType === "reels" ? postQty * 35 : (postType === "carrossel" ? postQty * 25 : postQty * 15)))} cr
                        </span>
                      </div>
                      <span className="text-sm select-none">💰</span>
                    </div>
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
          <KsStudio
            forgeProgress={forgeProgress}
            forgeData={forgeData}
            handleSimularEsteira={handleSimularEsteira}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            volume={volume}
            setVolume={setVolume}
          />
        )}

        {/* TELA 3: ALMOXARIFADO / UPLOADS LIBRARY */}
        {activeView === "almoxarifado" && (
          <Almoxarifado
            activeSlot={activeSlot}
            selectMediaFromLibrary={selectMediaFromLibrary}
            setActiveSlot={setActiveSlot}
            setActiveView={setActiveView}
          />
        )}
      </div>


    </div>
  );
}