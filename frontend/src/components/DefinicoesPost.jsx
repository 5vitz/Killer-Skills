import React from 'react';

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
  setAgendamentoHora
}) {
  return (
    <div className="flex-1 flex flex-col gap-4 pt-2 overflow-y-auto pr-1 custom-scrollbar-visible">
      
      {/* CARD 1: PRÉ-PRODUÇÃO (DNA Institucional) */}
      <div className="border border-white/10 rounded-lg overflow-hidden shrink-0 bg-black/20">
        <div 
          onClick={() => setExpandedSection(expandedSection === "pre" ? null : "pre")}
          className="flex items-center justify-between p-2.5 bg-white/[0.02] cursor-pointer hover:bg-white/5 duration-150 select-none"
        >
          <span className="text-[10px] font-light uppercase tracking-widest text-[#EFE5D3] font-poppins-light">
            PRÉ-PRODUÇÃO
          </span>
          <span className="text-[8px] text-white/30">
            {expandedSection === "pre" ? "▼" : "▶"}
          </span>
        </div>
        
        <div className={`transition-all duration-300 overflow-hidden ${
          expandedSection === "pre" ? "max-h-[160px] p-3 border-t border-white/5" : "max-h-0"
        }`}>
          <div className="flex flex-col gap-2">
            <span className="text-[8px] uppercase tracking-wider text-white/30">
              Validação da Persona (MEVA)
            </span>
            
            {/* Botão Confirmar Persona */}
            <button 
              onClick={() => setPersonaConfirmed(!personaConfirmed)}
              className={`w-full h-8 rounded-lg text-[9px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 duration-200 ${
                personaConfirmed 
                  ? "bg-brand-blue/10 border border-brand-blue/30 text-brand-blue" 
                  : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10"
              }`}
            >
              {personaConfirmed ? (
                <>✓ PERSONA CONFIRMADA</>
              ) : (
                <>✓ CONFIRMAR PERSONA</>
              )}
            </button>

            {/* Botão Editar Sliders */}
            <button 
              disabled={!isPremium}
              onClick={() => {
                setActiveView("servicos");
                setOnboardingStep("matriz");
              }}
              className={`w-full h-8 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-[9px] font-bold uppercase tracking-wider duration-200 select-none ${
                !isPremium ? "opacity-30 cursor-not-allowed" : "text-white/70"
              }`}
            >
              ✎ EDITAR PERSONA {!isPremium && "🔒"}
            </button>
          </div>
        </div>
      </div>

      {/* CARD 2: PRODUÇÃO (Tipos e Quantidades) */}
      <div className="border border-white/10 rounded-lg overflow-hidden shrink-0 bg-black/20">
        <div 
          onClick={() => setExpandedSection(expandedSection === "pro" ? null : "pro")}
          className="flex items-center justify-between p-2.5 bg-white/[0.02] cursor-pointer hover:bg-white/5 duration-150 select-none"
        >
          <span className="text-[10px] font-light uppercase tracking-widest text-[#EFE5D3] font-poppins-light">
            PRODUÇÃO
          </span>
          <span className="text-[8px] text-white/30">
            {expandedSection === "pro" ? "▼" : "▶"}
          </span>
        </div>

        <div className={`transition-all duration-300 overflow-hidden ${
          expandedSection === "pro" ? "max-h-[480px] p-3 border-t border-white/5" : "max-h-0"
        }`}>
          <div className="flex flex-col gap-3">
            {/* Formato de Post */}
            <div className="flex flex-col gap-1 text-left">
              <span className="text-[8px] uppercase tracking-wider text-white/30 pl-1">
                Formato de Post
              </span>
              <select 
                value={postType}
                onChange={(e) => {
                  const t = e.target.value;
                  setPostType(t);
                  setPostQty(0);
                }}
                className="w-full h-8 bg-[#050505] border border-white/10 rounded-lg px-2 text-[9px] text-white uppercase tracking-wider focus:outline-none focus:border-brand-blue/30 duration-200"
              >
                <option value="reels">Reels (Vídeo)</option>
                <option value="carrossel">Carrossel (Imagens)</option>
                <option value="imagem_unica">Post Único (Imagem)</option>
              </select>
            </div>

            {/* Quantidade Dinâmica */}
            <div className="flex flex-col gap-1 text-left">
              <span className="text-[8px] uppercase tracking-wider text-white/30 pl-1">
                {postType === "reels" && "Quantidade de Vídeos"}
                {postType === "carrossel" && "Quantidade de Slides (Imagens)"}
                {postType === "imagem_unica" && "Quantidade de Posts (Imagens)"}
              </span>
              
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => {
                    if (postQty > 0) setPostQty(prev => prev - 1);
                  }}
                  className="w-8 h-8 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg flex items-center justify-center text-xs font-bold font-mono duration-150 active:scale-90"
                >
                  -
                </button>
                
                <div className="flex-1 h-8 bg-black/60 border border-white/5 rounded-lg flex items-center justify-center text-[10px] font-bold font-mono">
                  {postQty} {postType === "carrossel" ? (postQty === 1 ? "Slide" : "Slides") : (postQty === 1 ? "Post" : "Posts")}
                </div>
                
                <button 
                  onClick={() => {
                    if (postQty < 10) setPostQty(prev => prev + 1);
                  }}
                  className="w-8 h-8 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg flex items-center justify-center text-xs font-bold font-mono duration-150 active:scale-90"
                >
                  +
                </button>
              </div>
            </div>

            {/* Modulação por Tags */}
            <div className="flex flex-col gap-1.5 text-left border-t border-white/5 pt-3 mt-1">
              <div className="flex justify-between items-center px-1">
                <span className="text-[8px] uppercase tracking-wider text-white/30 pl-1">
                  Modulação por Tags ({tags.length}/5)
                </span>
                <span className="text-[8px] uppercase tracking-wider text-white/15">Limite</span>
              </div>

              {/* Lista de Badges de Tags */}
              <div className="flex flex-wrap gap-1.5 p-2 bg-white/[0.01] border border-white/5 rounded-lg min-h-[42px] max-h-[76px] overflow-y-auto scrollbar-none">
                {tags.map((tag, idx) => (
                  <span 
                    key={idx}
                    className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-[8.5px] font-semibold flex items-center gap-1.5 text-white/70 animate-fade-in"
                  >
                    {tag}
                    <button 
                      onClick={() => setTags(prev => prev.filter((_, i) => i !== idx))}
                      className="hover:text-brand-pink duration-150 font-bold text-[9px] focus:outline-none shrink-0"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {tags.length === 0 && (
                  <span className="text-[8px] font-poppins-light text-white/20 italic self-center pl-1">
                    Nenhuma tag ativa...
                  </span>
                )}
              </div>

              {/* Input de Tags */}
              <div className="relative">
                <input 
                  type="text"
                  disabled={tags.length >= 5}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      const val = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
                      if (val && !tags.includes(val) && tags.length < 5) {
                        setTags(prev => [...prev, val]);
                      }
                      setTagInput("");
                    }
                  }}
                  placeholder={tags.length >= 5 ? "Limite atingido (5 tags)" : "Digitar tag (pressione Enter)"}
                  className="w-full h-8 bg-white/[0.02] border border-white/10 rounded-lg px-3 text-[9px] text-white placeholder-white/20 focus:outline-none focus:border-brand-blue/50 duration-200"
                />
              </div>
            </div>

            {/* Botão de Adicionar à Esteira */}
            <button 
              onClick={handleAdicionarAoLote}
              disabled={postQty === 0}
              className={`w-full h-9 rounded-lg text-[9px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 duration-200 mt-3 select-none ${
                postQty === 0 
                  ? "bg-white/5 border border-white/10 text-white/20 cursor-not-allowed" 
                  : "bg-white/10 border border-white/20 hover:bg-white/15 text-white cursor-pointer active:scale-95"
              }`}
            >
              Adicionar à Esteira ➔
            </button>

            {/* Fila do Lote Acumulado */}
            {loteProducao.length > 0 && (
              <div className="flex flex-col gap-2 border-t border-white/5 pt-3 mt-3">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[8px] uppercase tracking-wider text-white/30 pl-1">
                    Lote Acumulado na Esteira ({loteProducao.length})
                  </span>
                  <span className="text-[8px] uppercase tracking-wider text-white/15">Fila</span>
                </div>
                <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto custom-scrollbar-visible pr-1">
                  {loteProducao.map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-white/5 border border-white/10 rounded-lg p-2 flex justify-between items-center text-[9px] text-white/80 animate-fade-in"
                    >
                      <div className="flex flex-col gap-0.5 text-left truncate">
                        <span className="font-bold text-[#EFE5D3] uppercase tracking-wider">
                          {item.quantidade}x {item.tipo === "reels" ? "Reels" : (item.tipo === "carrossel" ? "Carrossel" : "Post Único")}
                        </span>
                        {item.tags.length > 0 && (
                          <span className="text-[7.5px] text-white/30 truncate">
                            Tags: {item.tags.join(", ")}
                          </span>
                        )}
                        {(item.agendamento.data || item.agendamento.hora) && (
                          <span className="text-[7.5px] text-brand-gold/70 font-semibold uppercase tracking-wider">
                            📅 {item.agendamento.data || "Sem data"} • ⏰ {item.agendamento.hora || "Sem hora"}
                          </span>
                        )}
                      </div>
                      <button 
                        onClick={() => handleRemoverDoLote(item.id)}
                        className="p-1 hover:text-brand-pink duration-150 font-bold text-xs shrink-0 select-none"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CARD 3: PÓS-PRODUÇÃO (Fila de Envio) */}
      <div className="border border-white/10 rounded-lg overflow-hidden shrink-0 bg-black/20">
        <div 
          onClick={() => setExpandedSection(expandedSection === "pos" ? null : "pos")}
          className="flex items-center justify-between p-2.5 bg-white/[0.02] cursor-pointer hover:bg-white/5 duration-150 select-none"
        >
          <span className="text-[10px] font-light uppercase tracking-widest text-[#EFE5D3] font-poppins-light">
            PÓS-PRODUÇÃO
          </span>
          <span className="text-[8px] text-white/30">
            {expandedSection === "pos" ? "▼" : "▶"}
          </span>
        </div>

        <div className={`transition-all duration-300 overflow-hidden ${
          expandedSection === "pos" ? "max-h-[220px] p-3 border-t border-white/5" : "max-h-0"
        }`}>
          <div className="flex flex-col gap-2.5">
            {/* Agendador Toggle */}
            <div className="flex flex-col gap-1 text-left">
              <span className="text-[8px] uppercase tracking-wider text-white/30 pl-1">
                Data da Publicação
              </span>
              <input 
                type="date"
                disabled={!isPremium}
                value={agendamentoData}
                onChange={(e) => setExpandedSection("pos") || setAgendamentoData(e.target.value)}
                className={`w-full h-8 bg-[#050505] border border-white/10 rounded-lg px-2 text-[9px] text-white uppercase focus:outline-none focus:border-brand-blue/30 duration-200 ${
                  !isPremium ? "opacity-30 cursor-not-allowed" : ""
                }`}
              />
            </div>

            <div className="flex flex-col gap-1 text-left">
              <span className="text-[8px] uppercase tracking-wider text-white/30 pl-1">
                Hora da Publicação
              </span>
              <input 
                type="time"
                disabled={!isPremium}
                value={agendamentoHora}
                onChange={(e) => setExpandedSection("pos") || setAgendamentoHora(e.target.value)}
                className={`w-full h-8 bg-[#050505] border border-white/10 rounded-lg px-2 text-[9px] text-white focus:outline-none focus:border-brand-blue/30 duration-200 ${
                  !isPremium ? "opacity-30 cursor-not-allowed" : ""
                }`}
              />
            </div>
            
            <div className="text-[7.5px] text-white/20 uppercase tracking-widest pl-1 text-left">
              {isPremium ? "✓ Conexão estável com VPS PM2" : "🔒 Agendamento restrito ao Premium"}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
