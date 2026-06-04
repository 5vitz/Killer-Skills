import React from 'react';
import { ARCHETYPE_DETAILS } from '../data/archetypes';
import AudioControls from './AudioControls';

export default function PortalPersona({
  activeArch,
  isMuted,
  setIsMuted,
  volume,
  setVolume
}) {
  return (
    <div className="absolute -right-10 -top-10 -bottom-10 w-[320px] border-l border-white/10 bg-[#0A0A0A] p-5 flex flex-col justify-between z-20 text-left animate-fade-in text-white shadow-2xl shrink-0">
      
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

      {/* Controles de Áudio unificados na base */}
      <AudioControls
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        volume={volume}
        setVolume={setVolume}
      />

    </div>
  );
}
