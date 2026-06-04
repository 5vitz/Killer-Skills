import React from 'react';
import { SEED_IMAGES } from '../data/archetypes';

export default function Almoxarifado({
  activeSlot,
  selectMediaFromLibrary,
  setActiveSlot,
  setActiveView
}) {
  return (
    <div className="w-full h-full flex flex-col gap-6 animate-fade-in shrink-0">
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
          className="w-48 h-11 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold shrink-0"
        >
          Voltar sem selecionar
        </button>
      )}
    </div>
  );
}
