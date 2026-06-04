import React, { useEffect } from 'react';

export default function LoginScreen({
  onGoogleLoginSuccess
}) {
  useEffect(() => {
    // Inicialização segura do SDK do Google Identity Services
    const initializeGoogleSignIn = () => {
      if (typeof window.google !== 'undefined') {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: (response) => {
            try {
              // O token JWT retornado pelo Google
              const idToken = response.credential;
              // Decodificamos o e-mail do JWT (sem validação de assinatura no frontend)
              const base64Url = idToken.split('.')[1];
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              const jsonPayload = decodeURIComponent(
                atob(base64)
                  .split('')
                  .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                  .join('')
              );
              const payload = JSON.parse(jsonPayload);
              const email = payload.email;
              
              onGoogleLoginSuccess(email, idToken);
            } catch (err) {
              console.error("Erro ao decodificar token do Google:", err);
            }
          }
        });

        // Renderiza o botão oficial do Google Sign-In
        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-button"),
          { 
            theme: "filled_black", 
            size: "large", 
            width: 260, 
            text: "signin_with", 
            shape: "rectangular",
            logo_alignment: "left"
          }
        );
      }
    };

    // Caso o script do Google gsi client ainda esteja carregando no head, tenta inicializar após um pequeno delay
    if (typeof window.google === 'undefined') {
      const interval = setInterval(() => {
        if (typeof window.google !== 'undefined') {
          initializeGoogleSignIn();
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    } else {
      initializeGoogleSignIn();
    }
  }, [onGoogleLoginSuccess]);

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
          
          <div className="w-full flex flex-col items-center justify-center animate-fade-in">
            {/* Cabeçalho da Tela 0 (Âncora de Altura Fixa para Sincronia Espacial - Deslocado 30px para Cima) */}
            <div className="h-[136px] flex flex-col items-center justify-center mb-[46px] mt-[-24px]">
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

            {/* Container onde o Iframe do Google Sign-In oficial é renderizado */}
            <div className="w-full flex justify-center mb-8 h-11">
              <div id="google-signin-button" className="animate-fade-in"></div>
            </div>
          </div>

          <div className="text-[9px] font-bold text-white/10 tracking-widest uppercase">
            KS STUDIO v4.0
          </div>
        </div>
      </div>
    </div>
  );
}
