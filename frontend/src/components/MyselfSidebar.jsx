import React, { useState } from 'react';
import { 
  User, Cpu, Sparkles, ShieldCheck, LogOut, ChevronLeft 
} from 'lucide-react';
import { ARCHETYPE_DETAILS } from '../data/archetypes';

export default function MyselfSidebar({
  showPersonaCard,
  activeView,
  setActiveView,
  userEmail,
  isAdminMode,
  triggerGoogleAuthSequence,
  handleLogout,
  getTetracordeMeva,
  compilarDiagnosticoTetracorde,
  setOnboardingStep,
  activeArch,
  personaConfirmed,
  setPersonaConfirmed,
  isPremium,
  isIntegrated,
  setIsIntegrated,
  tagsRefino,
  setTagsRefino,
  handleConfirmarPersona
}) {
  const GRADIENT_3_TONES = "linear-gradient(to bottom, #383838 0%, #222222 20%, #000000 40%)";
  const ACTIVE_COCKPIT_GRADIENT = GRADIENT_3_TONES;

  const showMenuPadrao = !showPersonaCard && activeView !== "storyboard" && activeView !== "servicos_escolha";
  const showDiagnosticoCard = showPersonaCard && activeView !== "storyboard";

  return (
    <div className="w-[320px] z-10 flex flex-col justify-between p-5 border-r border-white/10 bg-[#0A0A0A] relative overflow-hidden transition-all duration-500 shrink-0">
      
      {/* ESTADO A: MENU PADRÃO */}
      <div className={`w-full h-full flex flex-col justify-between transition-all duration-500 ease-in-out ${showMenuPadrao ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none absolute inset-5"}`}>
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
                {userEmail ? userEmail.substring(0, 2).toUpperCase() : "US"}
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
              onClick={() => {
                setIsIntegrated(false);
                setOnboardingStep("matriz");
                setActiveView("servicos");
              }}
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
      <div className={`w-full h-full flex flex-col justify-between transition-all duration-500 ease-in-out ${showDiagnosticoCard ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none absolute inset-5"}`}>
        {showPersonaCard && (
          <>
            {/* CONTEÚDO DO PORTAL ABAIXO (TEXT PLAYER CARD) */}
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
              <div 
                className="flex-1 w-full relative rounded-lg overflow-hidden border border-white/10 shadow-lg p-5 flex flex-col transition-all duration-500"
                style={{ background: ACTIVE_COCKPIT_GRADIENT }}
              >
                {/* TÍTULO INTERNO DO CARD ALINHADO */}
                <div className="w-full shrink-0 select-none mt-2 mb-3">
                  <h2 
                    className="text-[11px] uppercase tracking-widest text-white/50 text-center"
                    style={{ fontFamily: 'Poppins', fontWeight: 300 }}
                  >
                    {(activeView === "servicos_escolha" || isIntegrated) ? "MYSELF" : "SIGNIFICADO"}
                  </h2>
                </div>

                {(activeView === "servicos_escolha" || isIntegrated) ? (() => {
                  const { top1, top2, quintas, top4, subtoms } = getTetracordeMeva();
                  return (
                    <>
                      {/* Diagnóstico Dinâmico de Persona compilado no topo do card */}
                      <div className="relative z-10 flex flex-col text-justify select-text pt-1 mb-2">
                        <div className="font-poppins-light text-[12px] leading-relaxed text-white/95">
                          {compilarDiagnosticoTetracorde()}
                        </div>
                      </div>
                      {/* Botões de Edição da Persona */}
                      <div className="flex flex-col gap-2 mt-auto select-none border-t border-white/5 pt-3 shrink-0">
                        {/* Botão Editar Persona */}
                        <button 
                          disabled={!isPremium}
                          onClick={() => {
                            setIsIntegrated(false); // Retorna a Coluna 1 ao modo SIGNIFICADO
                            if (activeView !== "servicos") {
                              setActiveView("servicos");
                              setOnboardingStep("matriz");
                            }
                          }}
                          className={`w-full h-8 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-[9px] font-bold uppercase tracking-wider duration-200 select-none ${
                            !isPremium ? "opacity-30 cursor-not-allowed" : "text-white/70"
                          }`}
                        >
                          ✎ EDITAR PERSONA {!isPremium && "🔒"}
                        </button>
                      </div>
                    </>
                  );
                })() : activeArch ? (
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
                ) : null}
              </div>
            </div>

            {isIntegrated && activeView === "servicos" && (
              <button 
                onClick={() => {
                  setIsIntegrated(false);
                  setOnboardingStep("matriz");
                }}
                className="w-full h-8 flex items-center justify-center gap-1 text-[9px] font-bold uppercase tracking-wider text-white/40 hover:text-white/70 duration-200 select-none mt-2 shrink-0"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> VOLTAR
              </button>
            )}
          </>
        )}
      </div>

      {/* ESTADO D: TELA 2 (COCKPIT) LIMPA COM BOTÃO VOLTAR NO RODAPÉ */}
      {activeView === "servicos_escolha" && (
        <div className="w-full h-full flex flex-col justify-end transition-all duration-500 ease-in-out">
          <button 
            onClick={() => {
              setIsIntegrated(true);
              setOnboardingStep("matriz");
              setActiveView("servicos");
            }}
            className="w-full h-8 flex items-center justify-center gap-1 text-[9px] font-bold uppercase tracking-wider text-white/40 hover:text-white/70 duration-200 select-none shrink-0"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> VOLTAR
          </button>
        </div>
      )}

      {/* ESTADO C: TELA 3 (KS STUDIO) LIMPO COM BOTÃO VOLTAR */}
      {activeView === "storyboard" && (
        <div className="w-full h-full flex flex-col justify-between transition-all duration-500 ease-in-out">
          {/* Header */}
          <div className="w-full shrink-0 select-none mt-2 mb-3">
            <h2 
              className="text-[11px] uppercase tracking-widest text-white/50 text-center"
              style={{ fontFamily: 'Poppins', fontWeight: 300 }}
            >
              KS Studio
            </h2>
          </div>

          {/* Área Central Vazia de Respiro */}
          <div className="flex-1 flex flex-col justify-center items-center opacity-10 select-none">
            <div className="text-xl font-bold tracking-tight text-white/50">Killer Skills</div>
          </div>
          
          {/* Botão VOLTAR no rodapé */}
          <button 
            onClick={() => {
              setIsIntegrated(true);
              setOnboardingStep("matriz");
              setActiveView("servicos");
            }}
            className="w-full h-10 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 duration-200 text-white/70"
          >
            <ChevronLeft className="w-4 h-4" /> Voltar ao Painel
          </button>
        </div>
      )}

    </div>
  );
}
