import React, { useState } from 'react';
import { ARCHETYPE_DETAILS } from '../data/archetypes';
import AudioControls from './AudioControls';

export default function PortalPersona({
  activeArch,
  isMuted,
  setIsMuted,
  volume,
  setVolume,
  isIntegrated,
  activeView,
  tagsRefino,
  setTagsRefino,
  handleConfirmarPersona
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const showPromptBuilder = isIntegrated && activeView === "servicos";

  // Lógica de validação de entrada de tags
  const handleTagInputChange = (field, rawValue) => {
    if (rawValue === "") {
      setTagsRefino(prev => ({ ...prev, [field]: "" }));
      return;
    }

    // Trava de tamanho de caracteres rígido
    if (rawValue.length > 30) return;

    // Trava de número de palavras (limite de 3 palavras)
    const words = rawValue.trim().split(/\s+/).filter(Boolean);
    if (words.length > 3) return;

    // Trava de número de tags por vírgula (limite de 2 tags)
    const tagsArray = rawValue.split(',').map(t => t.trim()).filter(Boolean);
    if (tagsArray.length > 2) return;

    setTagsRefino(prev => ({ ...prev, [field]: rawValue }));
  };

  return (
    <div className="absolute -right-10 -top-10 -bottom-10 w-[320px] border-l border-white/10 bg-[#0A0A0A] p-5 flex flex-col justify-between z-20 text-left animate-fade-in text-white shadow-2xl shrink-0">
      
      {/* TOPO FIXO */}
      <div className="flex flex-col gap-1 w-full shrink-0 select-none mb-3">
        <h2 
          className="text-sm uppercase tracking-wider text-white text-center"
          style={{ fontFamily: 'Poppins', fontWeight: 300 }}
        >
          {showPromptBuilder ? "CRIAR PROMPT" : (activeArch ? activeArch.name : "Arquétipos")}
        </h2>
      </div>

      {/* CONTEÚDO */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        {showPromptBuilder ? (
          /* CHASSI OPERACIONAL DA TELA 1D */
          <div 
            className="flex-1 w-full relative rounded-lg overflow-hidden border border-white/10 shadow-lg p-5 flex flex-col transition-all duration-500 justify-between"
            style={{ background: "linear-gradient(to bottom, #383838 0%, #222222 20%, #000000 40%)" }}
          >
            {/* Texto de Ajuda Coloquial */}
            <div className="text-[10px] text-white/50 font-poppins-light leading-relaxed mb-4 text-justify select-none">
              AS TAGS ajudam a IA a criar as mídias da maneira que vc deseja. Use com sabedoria, até duas TAGS por assunto, separadas por vírgula.
            </div>

            {/* Inputs de Refino agrupados */}
            <div className="flex flex-col gap-3 bg-white/[0.01] border border-white/10 rounded-lg p-3.5 select-none mb-auto">
              
              {/* Caixa 1: Persona */}
              <div className="flex flex-col gap-1 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-[7.5px] uppercase tracking-wider text-white/40 font-poppins-light">Persona</span>
                  <span className="text-[7.5px] text-white/20 font-poppins-light">máx. 2 tags</span>
                </div>
                <input 
                  type="text" 
                  value={tagsRefino?.tonica || ""}
                  onChange={(e) => handleTagInputChange("tonica", e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1 text-[10px] text-white focus:outline-none focus:ring-0 font-poppins-light focus:border-brand-gold/40 transition-all"
                />
              </div>

              {/* Caixa 2: Cenário */}
              <div className="flex flex-col gap-1 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-[7.5px] uppercase tracking-wider text-white/40 font-poppins-light">Cenário</span>
                  <span className="text-[7.5px] text-white/20 font-poppins-light">máx. 2 tags</span>
                </div>
                <input 
                  type="text" 
                  value={tagsRefino?.terca || ""}
                  onChange={(e) => handleTagInputChange("terca", e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1 text-[10px] text-white focus:outline-none focus:ring-0 font-poppins-light focus:border-brand-gold/40 transition-all"
                  placeholder="Neutro"
                />
              </div>

              {/* Caixa 3: Elementos/Objetos */}
              <div className="flex flex-col gap-1 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-[7.5px] uppercase tracking-wider text-white/40 font-poppins-light">Elementos/Objetos</span>
                  <span className="text-[7.5px] text-white/20 font-poppins-light">máx. 2 tags</span>
                </div>
                <input 
                  type="text" 
                  value={tagsRefino?.quinta || ""}
                  onChange={(e) => handleTagInputChange("quinta", e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1 text-[10px] text-white focus:outline-none focus:ring-0 font-poppins-light focus:border-brand-gold/40 transition-all"
                  placeholder="Neutro"
                />
              </div>

              {/* Caixa 4: Estilo Artístico da Mídia (Dropdown por hover) */}
              <div 
                className="relative flex flex-col gap-1 text-left"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <span className="text-[7.5px] uppercase tracking-wider text-white/40 font-poppins-light">Estilo Artístico da Mídia</span>
                <div className="relative">
                  <input 
                    type="text" 
                    readOnly
                    value={tagsRefino?.setima || "Selecionar Estilo..."}
                    className="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1 text-[10px] text-white focus:outline-none focus:ring-0 font-poppins-light cursor-pointer text-left transition-all"
                  />
                  {isDropdownOpen && (
                    <div className="absolute left-0 right-0 bottom-full mb-1 bg-[#0A0A0C] border border-white/10 rounded shadow-2xl z-50 py-1 animate-fade-in max-h-[150px] overflow-y-auto custom-scrollbar-visible">
                      {[
                        "Cinematográfico",
                        "Intimista",
                        "Vintage",
                        "Minimalista",
                        "Cyber-Luxury",
                        "Editorial de Moda"
                      ].map((estilo) => (
                        <button
                          key={estilo}
                          type="button"
                          onClick={() => {
                            setTagsRefino(prev => ({ ...prev, setima: estilo }));
                            setIsDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-1.5 text-[9px] font-poppins-light uppercase tracking-wider hover:bg-brand-gold/10 hover:text-brand-gold transition-colors duration-150"
                        >
                          {estilo}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Botão Confirmar Persona */}
            <button 
              onClick={handleConfirmarPersona}
              className="w-full h-8 bg-brand-blue/10 border border-brand-blue/30 text-brand-blue hover:bg-brand-blue/20 rounded-lg text-[9px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 duration-200 mt-4 shrink-0"
            >
              ✓ CONFIRMAR PERSONA
            </button>
          </div>
        ) : (
          /* CASO PADRÃO: IMAGEM DO ARQUÉTIPO OU CAPA */
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
        )}
      </div>

      {/* Controles de Áudio */}
      <AudioControls
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        volume={volume}
        setVolume={setVolume}
      />
    </div>
  );
}
