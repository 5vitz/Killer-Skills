import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function AudioControls({ isMuted, setIsMuted, volume, setVolume }) {
  return (
    <div className="flex flex-col gap-2 pt-4 border-t border-white/10 mt-4 shrink-0">
      <div className="flex items-center gap-3 text-white/40">
        <div className="flex items-center gap-1 shrink-0">
          <button 
            onClick={() => setIsMuted(!isMuted)} 
            className="p-1 rounded-lg hover:bg-white/5 hover:text-white transition duration-200 shrink-0"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-brand-pink" /> : <Volume2 className="w-3.5 h-3.5 text-brand-blue" />}
          </button>
          <span className="text-[9px] font-black uppercase tracking-wider whitespace-nowrap">
            {isMuted ? "Áudio Mutado" : "Trilha Sonora"}
          </span>
        </div>
        <input 
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="flex-1 premium-slider min-w-[60px]"
        />
      </div>
      <div className="text-[8px] font-black tracking-widest text-center text-white/15 uppercase mt-1">
        Killer Skills v4.0 • Direção de Arte AI
      </div>
    </div>
  );
}
