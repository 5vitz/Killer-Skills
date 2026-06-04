import React from 'react';

export default function ServicosPremium({
  expandedSvc,
  setExpandedSvc,
  isPremium,
  servicosManual,
  servicosIA,
  servicosPostagem
}) {
  return (
    <div className="w-full flex-1 flex flex-col gap-2 overflow-hidden mb-3">
      
      {/* CATEGORIA 1: CRIAÇÃO - POST MANUAL */}
      <div className="border border-white/10 rounded-lg overflow-hidden shrink-0 bg-black/20">
        <div 
          onClick={() => setExpandedSvc(expandedSvc === "manual" ? null : "manual")}
          className="flex items-center justify-between p-2 bg-white/[0.02] cursor-pointer hover:bg-white/5 duration-150 select-none"
        >
          <span className="text-[10px] font-light uppercase tracking-widest text-[#EFE5D3] font-poppins-light">
            CRIAÇÃO - POST MANUAL
          </span>
          <span className="text-[8px] text-white/30">
            {expandedSvc === "manual" ? "▼" : "▶"}
          </span>
        </div>
        
        <div className={`transition-all duration-300 overflow-hidden ${
          expandedSvc === "manual" ? "max-h-[220px] p-2 border-t border-white/5" : "max-h-0"
        }`}>
          <div className="flex flex-col gap-1.5">
            {servicosManual.map((svc) => {
              const isActive = isPremium || !svc.premium;
              return (
                <div 
                  key={svc.id} 
                  className={`flex items-center justify-between text-[12px] transition-all px-2 py-0.5 border-b border-white/[0.02] last:border-b-0 ${
                    isActive ? "text-white/80" : "text-white/20"
                  }`}
                >
                  <span className="truncate max-w-[230px] font-poppins-light">{svc.name}</span>
                  <span className={isActive ? "text-brand-gold" : "text-white/20"}>
                    {isActive ? "✓" : "🔒"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CATEGORIA 2: CRIAÇÃO - POST COM IA */}
      <div className="border border-white/10 rounded-lg overflow-hidden shrink-0 bg-black/20">
        <div 
          onClick={() => setExpandedSvc(expandedSvc === "ia" ? null : "ia")}
          className="flex items-center justify-between p-2 bg-white/[0.02] cursor-pointer hover:bg-white/5 duration-150 select-none"
        >
          <span className="text-[10px] font-light uppercase tracking-widest text-[#EFE5D3] font-poppins-light">
            CRIAÇÃO - POST COM IA
          </span>
          <span className="text-[8px] text-white/30">
            {expandedSvc === "ia" ? "▼" : "▶"}
          </span>
        </div>
        
        <div className={`transition-all duration-300 overflow-hidden ${
          expandedSvc === "ia" ? "max-h-[250px] p-2 border-t border-white/5" : "max-h-0"
        }`}>
          <div className="flex flex-col gap-1.5">
            {servicosIA.map((svc) => {
              const isActive = isPremium || !svc.premium;
              return (
                <div 
                  key={svc.id} 
                  className={`flex items-center justify-between text-[12px] transition-all px-2 py-0.5 border-b border-white/[0.02] last:border-b-0 ${
                    isActive ? "text-white/80" : "text-white/20"
                  }`}
                >
                  <span className="truncate max-w-[230px] font-poppins-light">{svc.name}</span>
                  <span className={isActive ? "text-brand-gold" : "text-white/20"}>
                    {isActive ? "✓" : "🔒"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CATEGORIA 3: POSTAGEM */}
      <div className="border border-white/10 rounded-lg overflow-hidden shrink-0 bg-black/20">
        <div 
          onClick={() => setExpandedSvc(expandedSvc === "postagem" ? null : "postagem")}
          className="flex items-center justify-between p-2 bg-white/[0.02] cursor-pointer hover:bg-white/5 duration-150 select-none"
        >
          <span className="text-[10px] font-light uppercase tracking-widest text-[#EFE5D3] font-poppins-light">
            POSTAGEM
          </span>
          <span className="text-[8px] text-white/30">
            {expandedSvc === "postagem" ? "▼" : "▶"}
          </span>
        </div>
        
        <div className={`transition-all duration-300 overflow-hidden ${
          expandedSvc === "postagem" ? "max-h-[120px] p-2 border-t border-white/5" : "max-h-0"
        }`}>
          <div className="flex flex-col gap-1.5">
            {servicosPostagem.map((svc) => {
              const isActive = isPremium || !svc.premium;
              return (
                <div 
                  key={svc.id} 
                  className={`flex items-center justify-between text-[12px] transition-all px-2 py-0.5 border-b border-white/[0.02] last:border-b-0 ${
                    isActive ? "text-white/80" : "text-white/20"
                  }`}
                >
                  <span className="truncate max-w-[230px] font-poppins-light">{svc.name}</span>
                  <span className={isActive ? "text-brand-gold" : "text-white/20"}>
                    {isActive ? "✓" : "🔒"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
