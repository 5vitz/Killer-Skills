import React from 'react';
import { Cpu, Sparkles } from 'lucide-react';
import AudioControls from './AudioControls';

export default function KsStudio({
  forgeProgress,
  forgeData,
  handleSimularEsteira,
  isMuted,
  setIsMuted,
  volume,
  setVolume
}) {
  return (
    <div className="relative w-full h-full flex justify-center items-center shrink-0">

      {/* Mockup do Celular Central (Posicionado Fixed para Centramento Perfeito) */}
      <div className="fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[340px] h-[550px] bg-[#0A0A0C] border border-white/10 rounded-lg p-4 flex flex-col justify-between items-center shadow-2xl transition-all duration-300 z-30">
        {/* Visor Interno: Modo Forja/Manifesto ou Modo Padrão */}
        {forgeProgress > 0 ? (
          <div className="w-full h-full bg-[#050505] rounded-lg border border-white/5 flex flex-col justify-between items-center p-5 relative overflow-hidden z-10 text-center">
            <div className="flex flex-col items-center gap-3 mt-4 w-full shrink-0">
              <Cpu className="w-9 h-9 text-brand-gold animate-pulse shrink-0" />
              <div>
                <h2 
                  className="text-sm uppercase tracking-wider text-white text-center"
                  style={{ fontFamily: 'Poppins', fontWeight: 300 }}
                >
                  A Criação está ativada...
                </h2>
                <p className="text-[7px] font-bold text-brand-blue uppercase tracking-widest mt-1">Orquestrador Central assimilando agentes</p>
              </div>

              {/* Barra de Progresso */}
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5 mt-1 shrink-0">
                <div 
                  className="bg-brand-gold h-full duration-500 transition-all" 
                  style={{ width: `${forgeProgress}%` }}
                />
              </div>
            </div>

            {/* Console de Saída YAML do Manifest */}
            {forgeData ? (
              <div className="w-full flex-1 bg-[#050507] border border-white/10 rounded-lg p-3 text-[8px] font-mono text-[#8A95A5] overflow-y-auto text-left whitespace-pre-wrap leading-normal mt-3 mb-3 select-text scrollbar-thin">
                {forgeData.manifest}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-white/30 text-[8px] uppercase tracking-widest select-none">
                Compilando ordem de serviço...
              </div>
            )}

            {/* Botão de Conclusão e Simulação */}
            {forgeProgress === 100 && (
              <button 
                onClick={handleSimularEsteira}
                className="w-full h-10 bg-brand-gold text-black font-extrabold text-[9px] tracking-widest rounded-lg hover:scale-[1.02] active:scale-95 duration-200 shadow-lg shadow-brand-gold/15 shrink-0 uppercase"
              >
                Simular Esteira em Prod ➔
              </button>
            )}
          </div>
        ) : (
          /* Visor Interno de Reels Vazio (Padrão) */
          <div className="w-full h-full bg-[#050505] rounded-lg border border-white/5 flex flex-col justify-center items-center p-6 relative overflow-hidden z-10 select-none text-center">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex justify-center items-center mb-4">
              <Sparkles className="w-5 h-5 text-brand-blue" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest text-white mb-2">KS STUDIO</h3>
            <p className="text-[9px] text-white/40 leading-relaxed uppercase tracking-wider max-w-[200px]">
              Direção estética e simulação de reels. Acesse os painéis laterais para calibração.
            </p>
          </div>
        )}
      </div>

      {/* COLUNA LATERAL DIREITA: Painel Estritamente Simétrico ao Menu Esquerdo (Área com o Card Vazio) */}
      <div className="absolute -right-10 -top-10 -bottom-10 w-[320px] border-l border-white/10 bg-[#0A0A0A] p-5 flex flex-col justify-between z-20 text-left animate-fade-in text-white shadow-2xl">
        {/* TOPO FIXO: Título Geral */}
        <div className="flex flex-col gap-1 w-full shrink-0 select-none mb-3">
          <h2 
            className="text-sm uppercase tracking-wider text-white text-center font-extralight"
            style={{ fontFamily: 'Poppins', fontWeight: 300 }}
          >
            KS Studio
          </h2>
        </div>

        {/* CONTEÚDO DO PORTAL ABAIXO (CARD VAZIO) */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          <div className="flex-1 w-full relative rounded-lg overflow-hidden border border-white/10 bg-[#050505] flex flex-col justify-center items-center p-5 text-center shadow-lg">
            <Sparkles className="w-8 h-8 text-white/15 mb-3" />
            <span className="text-[9px] font-black tracking-widest uppercase text-white/30 mb-1">Cockpit Vazio</span>
            <span className="text-[9px] font-semibold text-white/20 uppercase tracking-wider leading-relaxed max-w-[150px]">
              Card reservado para forja estética AI
            </span>
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
  );
}
