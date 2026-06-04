import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ARCHETYPES } from '../data/archetypes';

export default function EspelhoDaAlma({
  onboardingStep,
  setOnboardingStep,
  dosagemPersona,
  setDosagemPersona,
  setHoveredArchetype,
  activeArch,
  setHasPersonaDefined,
  setActiveView
}) {
  const GRADIENT_3_TONES_INVERTED = "linear-gradient(to bottom, #000000 0%, #000000 60%, #222222 80%, #383838 100%)";
  const ACTIVE_PLAYER_GRADIENT = GRADIENT_3_TONES_INVERTED;

  return (
    <div 
      className="fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[340px] h-[550px] bg-[#0A0A0C] border border-white/10 rounded-lg p-4 flex flex-col justify-between items-center shadow-2xl transition-all duration-300 z-30 shrink-0" 
    >
      {/* Visor Interno */}
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
                        value={dosagemPersona[arch.id] || 0}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setDosagemPersona(prev => ({ ...prev, [arch.id]: val }));
                        }}
                        className="flex-1 premium-slider-palha mx-2"
                      />

                      {/* Bloco 3 (Porcentagem): Largura fixa de 24px alinhada na direita */}
                      <div className="w-6 shrink-0 text-right text-[9px] font-black text-[#EFE5D3]/70 leading-none">
                        {dosagemPersona[arch.id] || 0}%
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
  );
}
