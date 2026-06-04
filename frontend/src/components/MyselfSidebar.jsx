import React from 'react';
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
  activeArch
}) {
  const GRADIENT_3_TONES = "linear-gradient(to bottom, #383838 0%, #222222 20%, #000000 40%)";
  const ACTIVE_COCKPIT_GRADIENT = GRADIENT_3_TONES;

  return (
    <div className="w-[320px] z-10 flex flex-col justify-between p-5 border-r border-white/10 bg-[#0A0A0A] relative overflow-hidden transition-all duration-500 shrink-0">
      
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
                style={{ fontFamily: 'Poppins', fontWeight: 300 }}
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
                {activeView === "servicos_escolha" ? (() => {
                  const { top1, top2, quintas, top4, subtoms } = getTetracordeMeva();
                  return (
                    <>
                      {/* Sumário Visual do Tetracorde MEVA (Respiração Visual na metade superior) */}
                      <div className="relative z-10 flex flex-col gap-2.5 mb-auto select-none pt-2">
                        <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                          <span className="text-[8px] uppercase tracking-wider text-white/30 font-poppins-light">Mensagem (Tônica)</span>
                          <span className="text-[10px] font-poppins-light tracking-wide text-brand-gold uppercase">{top1.tag}</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                          <span className="text-[8px] uppercase tracking-wider text-white/30 font-poppins-light">Cenário (Terça)</span>
                          <span className="text-[10px] font-poppins-light tracking-wide text-white/70 uppercase">
                            {top2 ? top2.tag : "Neutro"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                          <span className="text-[8px] uppercase tracking-wider text-white/30 font-poppins-light">Elementos (Quinta)</span>
                          <span className="text-[10px] font-poppins-light tracking-wide text-white/70 uppercase text-right truncate max-w-[140px]">
                            {quintas.length > 0 ? quintas.map(q => q.tag).join(" + ") : "Neutro"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                          <span className="text-[8px] uppercase tracking-wider text-white/30 font-poppins-light">Estilo (Sétima)</span>
                          <span className="text-[10px] font-poppins-light tracking-wide text-white/70 uppercase">
                            {top4 ? top4.tag : "Neutro"}
                          </span>
                        </div>
                        {subtoms.length > 0 && (
                          <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                            <span className="text-[8px] uppercase tracking-wider text-white/30 font-poppins-light">Colorido (Subtoms)</span>
                            <span className="text-[9px] font-poppins-light tracking-wide text-white/40 uppercase truncate max-w-[140px]">
                              {subtoms.slice(0, 2).map(s => s.name).join(", ")}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Diagnóstico Dinâmico de Persona compilado na base do card */}
                      <div className="relative z-10 flex flex-col justify-end pr-1 mt-4 select-text">
                        <div className="font-poppins-light text-[12px] leading-relaxed text-justify whitespace-pre-line mb-3.5" style={{ color: '#FFFFFF' }}>
                          {compilarDiagnosticoTetracorde()}
                        </div>
                        
                        {/* Seta discreta para voltar à calibração de sliders */}
                        <div className="flex items-center gap-1.5 select-none shrink-0 border-t border-white/5 pt-2.5 mt-1">
                          <button 
                            onClick={() => {
                              setActiveView("servicos");
                              setOnboardingStep("matriz");
                            }}
                            className="text-[9px] font-poppins-light text-white/30 hover:text-white/70 flex items-center gap-1 duration-150 cursor-pointer"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" /> Voltar para os sliders de calibração
                          </button>
                        </div>
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
          </>
        )}
      </div>

    </div>
  );
}
