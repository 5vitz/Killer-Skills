import React from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

export default function DefinicoesPost({
  expandedSection,
  setExpandedSection,
  personaConfirmed,
  setPersonaConfirmed,
  isPremium,
  setActiveView,
  setOnboardingStep,
  postType,
  setPostType,
  postQty,
  setPostQty,
  tags,
  setTags,
  tagInput,
  setTagInput,
  loteProducao,
  handleAdicionarAoLote,
  handleRemoverDoLote,
  agendamentoData,
  setAgendamentoData,
  agendamentoHora,
  setAgendamentoHora,
  carrosselFrames,
  setCarrosselFrames,
  currentSlideIdx,
  setCurrentSlideIdx
}) {
  // Gradasões de Azul Premium para o fundo do visor
  const bgGradients = [
    "linear-gradient(to bottom, rgba(30, 58, 138, 0.45) 0%, rgba(5, 5, 5, 0) 100%)",   // Frame 1: #1E3A8A (Azul Claro Suave)
    "linear-gradient(to bottom, rgba(29, 78, 216, 0.45) 0%, rgba(5, 5, 5, 0) 100%)",   // Frame 2: #1D4ED8 (Azul Médio Claro)
    "linear-gradient(to bottom, rgba(30, 64, 175, 0.45) 0%, rgba(5, 5, 5, 0) 100%)",   // Frame 3: #1E40AF (Azul Médio)
    "linear-gradient(to bottom, rgba(23, 37, 84, 0.45) 0%, rgba(5, 5, 5, 0) 100%)",    // Frame 4: #172554 (Azul Escuro)
    "linear-gradient(to bottom, rgba(3, 7, 18, 0.45) 0%, rgba(5, 5, 5, 0) 100%)",      // Frame 5: #030712 (Azul Profundo)
  ];

  const activeSlide = carrosselFrames[currentSlideIdx] || {
    metodo: "persona",
    imagemReferencia: null,
    imagemUpload: null,
    tags: { tonica: "", terca: "", quinta: "", setima: "" }
  };

  const handleUpdateSlide = (idx, fields) => {
    const updated = [...carrosselFrames];
    updated[idx] = { ...updated[idx], ...fields };
    setCarrosselFrames(updated);
  };

  const handleTagsChange = (layer, val) => {
    const parts = val.split(',');
    let sanitizedVal = val;
    if (parts.length > 2) {
      sanitizedVal = parts.slice(0, 2).join(',');
    }
    const updatedTags = { ...activeSlide.tags, [layer]: sanitizedVal };
    handleUpdateSlide(currentSlideIdx, { tags: updatedTags });
  };

  return (
    <div className="flex-1 w-full flex flex-col justify-between overflow-hidden relative">
      {/* Camada de Fundo Dinâmica */}
      <div 
        className="absolute inset-0 pointer-events-none -z-10 transition-all duration-300"
        style={{ 
          background: postType === "carrossel" 
            ? bgGradients[currentSlideIdx] 
            : "transparent" 
        }}
      />

      {/* Seletor de Formato do Post */}
      <div className="flex w-full border border-white/10 rounded-lg p-0.5 bg-white/[0.02] mb-3 shrink-0">
        {['reels', 'carrossel', 'imagem_unica'].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setPostType(type)}
            className={`flex-1 py-1 text-[8px] uppercase tracking-wider rounded-md transition-all duration-300 font-poppins-light ${
              postType === type 
                ? "bg-white/10 text-white font-normal" 
                : "text-white/40 hover:text-white/70"
            }`}
          >
            {type === 'reels' ? 'Reels' : type === 'carrossel' ? 'Carrossel' : 'Imagem Única'}
          </button>
        ))}
      </div>

      {/* FLUXO 1: CARROSSEL HÍBRIDO INTERATIVO */}
      {postType === "carrossel" && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Navegador de Frames */}
          <div className="flex items-center justify-between w-full mb-3 px-1 shrink-0">
            <button
              type="button"
              onClick={() => setCurrentSlideIdx(prev => Math.max(0, prev - 1))}
              disabled={currentSlideIdx === 0}
              className={`p-1 transition-all rounded-full border border-white/10 bg-black/20 ${
                currentSlideIdx === 0 ? "opacity-30 cursor-not-allowed" : "opacity-80 hover:opacity-100 hover:bg-black/40 active:scale-95"
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5 text-white" />
            </button>
            
            <span className="text-[9px] uppercase tracking-widest text-white/80 font-poppins-light">
              IMAGEM 0{currentSlideIdx + 1} <span className="text-white/40">/ 05</span>
            </span>
            
            <button
              type="button"
              onClick={() => setCurrentSlideIdx(prev => Math.min(4, prev + 1))}
              disabled={currentSlideIdx === 4}
              className={`p-1 transition-all rounded-full border border-white/10 bg-black/20 ${
                currentSlideIdx === 4 ? "opacity-30 cursor-not-allowed" : "opacity-80 hover:opacity-100 hover:bg-black/40 active:scale-95"
              }`}
            >
              <ChevronRight className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

          {/* Container Principal de Configurações do Slide */}
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 custom-scrollbar mb-2 text-left">
            {/* Método de Criação */}
            <div className="flex flex-col gap-1 w-full shrink-0">
              <label className="text-[7px] text-white/40 uppercase tracking-widest pl-1">Método de Criação</label>
              <div className="grid grid-cols-3 gap-1 w-full">
                {[
                  { id: 'persona', label: 'Persona AI' },
                  { id: 'referencia', label: 'Ref. AI' },
                  { id: 'upload', label: 'Upload Dir.' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleUpdateSlide(currentSlideIdx, { metodo: opt.id })}
                    className={`py-1 px-0.5 text-[7.5px] uppercase tracking-wider rounded border transition-all duration-200 font-poppins-light ${
                      activeSlide.metodo === opt.id
                        ? "border-brand-gold/40 bg-brand-gold/10 text-brand-gold font-normal"
                        : "border-white/5 bg-white/[0.02] text-white/50 hover:text-white/80 hover:border-white/10"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Condicional */}
            {(activeSlide.metodo === 'referencia' || activeSlide.metodo === 'upload') && (
              <div className="w-full shrink-0">
                <div className="relative border border-dashed border-white/10 rounded-lg p-2 bg-white/[0.01] hover:bg-white/[0.03] transition-all flex flex-col items-center justify-center cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        if (activeSlide.metodo === 'referencia') {
                          handleUpdateSlide(currentSlideIdx, { imagemReferencia: file.name });
                        } else {
                          handleUpdateSlide(currentSlideIdx, { imagemUpload: file.name });
                        }
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <ImageIcon className="w-3.5 h-3.5 text-white/30 group-hover:text-white/50 transition-colors mb-0.5" />
                  <span className="text-[7.5px] text-white/40 uppercase tracking-widest text-center group-hover:text-white/60">
                    {activeSlide.metodo === 'referencia' 
                      ? (activeSlide.imagemReferencia || "Upload Referência")
                      : (activeSlide.imagemUpload || "Upload Imagem Final")}
                  </span>
                </div>

                {((activeSlide.metodo === 'referencia' && activeSlide.imagemReferencia) || 
                  (activeSlide.metodo === 'upload' && activeSlide.imagemUpload)) && (
                  <div className="flex items-center justify-between w-full mt-1 px-1.5 py-0.5 bg-white/5 border border-white/5 rounded text-[7.5px] text-white/60">
                    <span className="truncate max-w-[170px]">
                      ✓ {activeSlide.metodo === 'referencia' ? activeSlide.imagemReferencia : activeSlide.imagemUpload}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (activeSlide.metodo === 'referencia') {
                          handleUpdateSlide(currentSlideIdx, { imagemReferencia: null });
                        } else {
                          handleUpdateSlide(currentSlideIdx, { imagemUpload: null });
                        }
                      }}
                      className="text-white/40 hover:text-white/80 ml-2"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Tags de Refinamento MEVA */}
            {(activeSlide.metodo === 'persona' || activeSlide.metodo === 'referencia') && (
              <div className="flex flex-col gap-2 mt-1">
                <div className="text-[7px] text-white/30 uppercase tracking-widest pl-1 font-poppins-light">Refinamento de Prompt (MEVA)</div>
                
                {[
                  { key: 'tonica', label: 'Tônica (Persona)', placeholder: 'Ex: blazer contemporaneo' },
                  { key: 'terca', label: 'Terça (Cenário)', placeholder: 'Ex: escritorio de luxo' },
                  { key: 'quinta', label: 'Quinta (Elementos)', placeholder: 'Ex: caneta tinteiro' },
                  { key: 'setima', label: 'Sétima (Estilo)', placeholder: 'Ex: foco cinematografico' }
                ].map((layer) => {
                  const value = activeSlide.tags?.[layer.key] || "";
                  const tagCount = value.trim() ? value.split(',').filter(t => t.trim()).length : 0;
                  
                  return (
                    <div key={layer.key} className="flex flex-col gap-0.5 bg-white/[0.01] border border-white/5 rounded-lg p-1.5 transition-all hover:border-white/10">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-[7.5px] text-white/60 uppercase tracking-wider font-poppins-light">{layer.label}</span>
                        <span className={`text-[6.5px] ${tagCount > 2 ? 'text-rose-400' : 'text-white/30'}`}>
                          {tagCount}/2 tags
                        </span>
                      </div>
                      
                      <input
                        type="text"
                        value={value}
                        maxLength={40}
                        placeholder={layer.placeholder}
                        onChange={(e) => handleTagsChange(layer.key, e.target.value)}
                        className="w-full bg-black/40 border border-white/5 rounded px-1.5 py-0.5 text-[8px] text-white placeholder-white/20 focus:outline-none focus:border-brand-gold/30 transition-all font-poppins-light"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* FLUXO 2: REELS OU IMAGEM ÚNICA */}
      {postType !== "carrossel" && (
        <div className="flex-1 flex flex-col overflow-hidden text-left">
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5 custom-scrollbar mb-2">
            {/* Quantidade */}
            <div className="flex flex-col gap-1 w-full shrink-0">
              <label className="text-[7px] text-white/40 uppercase tracking-widest pl-1 font-poppins-light">Quantidade de Posts</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPostQty(prev => Math.max(0, prev - 1))}
                  className="w-6 h-6 bg-white/5 border border-white/10 rounded flex items-center justify-center text-xs text-white/80 hover:bg-white/10 active:scale-95 transition-all"
                >
                  -
                </button>
                <span className="flex-1 text-center text-[9px] text-white font-poppins-light bg-black/40 border border-white/5 rounded py-0.5">
                  {postQty}
                </span>
                <button
                  type="button"
                  onClick={() => setPostQty(prev => prev + 1)}
                  className="w-6 h-6 bg-white/5 border border-white/10 rounded flex items-center justify-center text-xs text-white/80 hover:bg-white/10 active:scale-95 transition-all"
                >
                  +
                </button>
              </div>
            </div>

            {/* Tags Direcionais */}
            <div className="flex flex-col gap-1 w-full shrink-0">
              <label className="text-[7px] text-white/40 uppercase tracking-widest pl-1 font-poppins-light">Tags Direcionais</label>
              <div className="flex gap-1">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (tagInput.trim() && !tags.includes(tagInput.trim())) {
                        setTags([...tags, tagInput.trim()]);
                        setTagInput("");
                      }
                    }
                  }}
                  placeholder="Pressione Enter"
                  className="flex-1 bg-black/40 border border-white/5 rounded px-1.5 py-0.5 text-[8px] text-white placeholder-white/20 focus:outline-none focus:border-brand-gold/30 transition-all font-poppins-light"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
                      setTags([...tags, tagInput.trim()]);
                      setTagInput("");
                    }
                  }}
                  className="px-2 bg-white/5 border border-white/10 rounded text-[8px] hover:bg-white/10 active:scale-95 text-white/80 font-poppins-light"
                >
                  Add
                </button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1 max-h-[35px] overflow-y-auto pr-0.5 custom-scrollbar">
                  {tags.map((t, idx) => (
                    <span key={idx} className="flex items-center gap-0.5 px-1 py-0.2 bg-white/5 border border-white/10 rounded text-[7px] text-white/70 font-poppins-light">
                      {t}
                      <button
                        type="button"
                        onClick={() => setTags(tags.filter(x => x !== t))}
                        className="text-[8px] text-white/40 hover:text-white ml-0.5"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Agendamento */}
            <div className="flex flex-col gap-1 w-full shrink-0">
              <label className="text-[7px] text-white/40 uppercase tracking-widest pl-1 font-poppins-light">Agendamento (Opcional)</label>
              <div className="grid grid-cols-2 gap-1">
                <input
                  type="date"
                  value={agendamentoData}
                  onChange={(e) => setAgendamentoData(e.target.value)}
                  className="bg-black/40 border border-white/5 rounded px-1.5 py-0.5 text-[8px] text-white/70 focus:outline-none focus:border-brand-gold/30 transition-all font-poppins-light"
                />
                <input
                  type="time"
                  value={agendamentoHora}
                  onChange={(e) => setAgendamentoHora(e.target.value)}
                  className="bg-black/40 border border-white/5 rounded px-1.5 py-0.5 text-[8px] text-white/70 focus:outline-none focus:border-brand-gold/30 transition-all font-poppins-light"
                />
              </div>
            </div>

            {/* Adicionar à Esteira */}
            <button
              type="button"
              onClick={handleAdicionarAoLote}
              className="w-full py-1.5 border border-white/10 rounded bg-white/5 hover:bg-white/10 text-[8px] text-white font-poppins-light uppercase tracking-widest transition-all duration-200 active:scale-98 shrink-0"
            >
              Adicionar à Esteira
            </button>
          </div>

          {/* Lista de Lotes */}
          {loteProducao.length > 0 ? (
            <div className="flex-1 flex flex-col gap-1 overflow-hidden border-t border-white/5 pt-2">
              <div className="text-[7px] text-white/30 uppercase tracking-widest pl-1 font-poppins-light shrink-0">
                Esteira de Lote ({loteProducao.length} itens)
              </div>
              <div className="flex-1 overflow-y-auto pr-0.5 flex flex-col gap-1 custom-scrollbar">
                {loteProducao.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-1 px-1.5 bg-white/[0.01] border border-white/5 rounded transition-all hover:border-white/10 shrink-0">
                    <div className="flex flex-col text-left">
                      <span className="text-[8px] text-white/70 font-poppins-light uppercase tracking-wider">
                        {item.quantidade}x {item.tipo === 'reels' ? 'Reels' : 'Imagem Única'}
                      </span>
                      {item.agendamento?.data && (
                        <span className="text-[6px] text-white/40">
                          Agendado: {item.agendamento.data} às {item.agendamento.hora}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoverDoLote(item.id)}
                      className="text-[8px] text-rose-400/70 hover:text-rose-400 px-1 hover:bg-white/5 rounded font-poppins-light"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center text-white/15 text-[8px] uppercase tracking-widest text-center py-4 select-none">
              Esteira de Lote Vazia
            </div>
          )}
        </div>
      )}
    </div>
  );
}
