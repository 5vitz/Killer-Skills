import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function LoginScreen({
  loginStage,
  enteredEmail,
  setEnteredEmail,
  loginPassword,
  setLoginPassword,
  handleEmailSubmit,
  handlePasswordSubmit,
  passwordInputRef
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
          {loginStage === "email" ? (
            /* ETAPA 1: DIGITAR E-MAIL DE ACESSO */
            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                await handleEmailSubmit();
              }}
              className="w-full flex flex-col items-center justify-center animate-fade-in"
            >
              {/* Cabeçalho da Tela 0 (Âncora de Altura Fixa para Sincronia Espacial - Deslocado 30px para Cima) */}
              <div className="h-[96px] flex flex-col items-center justify-center mb-[54px]">
                {/* Logo Metálica */}
                <img 
                  src="/images/LOGO_metal.png" 
                  alt="KILLER SKILLS" 
                  className="h-10 object-contain mb-1.5"
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
          ) : (
            /* ETAPA 2: GOOGLE SIGN-IN MORPH */
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handlePasswordSubmit();
              }}
              className="w-full flex flex-col items-center justify-center animate-fade-in"
            >
              {/* Cabeçalho da Tela 0A (Symmetrical height and spacing - Deslocado 30px para Cima) */}
              <div className="h-[96px] flex flex-col items-center justify-center mb-[54px]">
                {/* Google Logo SVG - Ampliado e Elevado */}
                <svg className="w-12 h-12 mb-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>

                <h3 className="text-[10px] font-poppins-light text-white/50 uppercase tracking-widest">
                  Entre Com a Conta Desejada
                </h3>
              </div>

              {/* Entrada de Senha */}
              <div className="w-full flex flex-col gap-1.5 text-left mb-6">
                <input 
                  type="password"
                  ref={passwordInputRef}
                  autoFocus
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Digite sua Senha"
                  className="w-full h-11 bg-white/[0.03] border border-white/10 rounded-lg px-4 text-xs text-white placeholder-white/20 focus:outline-none focus:border-brand-blue/50 duration-200"
                />
              </div>

              {/* Botão de Entrada */}
              <button 
                type="submit"
                className="w-full btn-login-avancar mb-6"
              >
                ENTRAR
              </button>
            </form>
          )}

          <div className="text-[9px] font-bold text-white/10 tracking-widest uppercase">
            KS STUDIO v4.0
          </div>
        </div>
      </div>
    </div>
  );
}
