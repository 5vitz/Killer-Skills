import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function LoginScreen({
  enteredEmail,
  setEnteredEmail,
  handleEmailSubmit
}) {
  return (
    <div className="relative w-screen h-screen flex justify-center items-center bg-black overflow-hidden select-none animate-fade-in">
      {/* Breathing Lilac & Emerald Sacred Background */}
      <div className="smoke-bg-container">
        <div className="smoke-cloud-1" />
        <div className="smoke-cloud-2" />
        <div className="smoke-cloud-3" />
      </div>

      {/* Smartphone Container */}
      <div className="relative w-[340px] h-[550px] bg-[#0A0A0C] border border-white/10 rounded-lg p-4 flex flex-col justify-between items-center shadow-2xl transition-all duration-500">
        {/* Visor Interno */}
        <div className="w-full h-full bg-[#050505] rounded-lg border border-white/5 flex flex-col justify-center items-center p-6 text-center z-10 text-white relative">
          
          {/* FORMULÁRIO DE LOGIN COM E-MAIL */}
          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              await handleEmailSubmit();
            }}
            className="w-full flex flex-col items-center justify-center animate-fade-in"
          >
            {/* Cabeçalho da Tela 0 (Âncora de Altura Fixa para Sincronia Espacial - Deslocado 30px para Cima) */}
            <div className="h-[136px] flex flex-col items-center justify-center mb-[36px] mt-[-24px]">
              {/* Logo Metálica */}
              <img 
                src="/images/LOGO_metal.png" 
                alt="KILLER SKILLS" 
                className="h-[120px] object-contain mb-1.5"
              />
              <div className="text-[9px] font-bold tracking-widest text-[#1E60FF] uppercase">
                KS Studio
              </div>
            </div>

            {/* Entrada de Email */}
            <div className="w-full flex flex-col gap-1.5 text-left mb-6">
              <input 
                type="email" 
                autoFocus
                value={enteredEmail}
                onChange={(e) => setEnteredEmail(e.target.value)}
                placeholder="nome@exemplo.com"
                className="w-full h-11 bg-white/[0.03] border border-white/10 rounded-lg px-4 text-xs text-white placeholder-white/20 focus:outline-none focus:border-brand-blue/50 duration-200"
              />
            </div>

            {/* Botão de Avanço */}
            <button 
              type="submit"
              className="btn-login-avancar mb-6"
            >
              AVANÇAR <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-[9px] font-bold text-white/10 tracking-widest uppercase">
            KS STUDIO v4.0
          </div>
        </div>
      </div>
    </div>
  );
}
