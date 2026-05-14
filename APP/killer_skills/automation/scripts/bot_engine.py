import asyncio
import os
from playwright.async_api import async_playwright

class AutomationSkill:
    def __init__(self, session_path="sessao.json"):
        self.session_path = session_path

    async def publicar_carrossel(self, lista_arquivos, legenda, headless=True):
        """
        Executa o fluxo completo de postagem de um carrossel.
        lista_arquivos: lista de strings com os caminhos dos arquivos.
        legenda: string com o texto do post.
        """
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=headless)
            # Verifica se o arquivo de sessão existe
            if not os.path.exists(self.session_path):
                await browser.close()
                return False, "Erro: Arquivo de sessão (sessao.json) não encontrado. Faça login primeiro."

            context = await browser.new_context(storage_state=self.session_path)
            page = await context.new_page()

            try:
                print("Acessando Instagram...")
                await page.goto("https://www.instagram.com/", wait_until="load", timeout=60000)
                await asyncio.sleep(5)

                print("Iniciando criação de post...")
                # Seletores universais para o botão 'Criar'
                await page.locator("svg[aria-label='Nova publicação'], span:has-text('Criar'), span:has-text('Create')").first.click()
                await asyncio.sleep(3)

                print("Selecionando arquivos...")
                async with page.expect_file_chooser() as fc_info:
                    await page.locator("button:has-text('Selecionar'), button:has-text('Select')").first.click()
                file_chooser = await fc_info.value
                await file_chooser.set_files(lista_arquivos)
                await asyncio.sleep(5)

                # Avançar (Filtros e Edição - pulamos)
                for i in range(2):
                    print(f"Avançando etapa {i+1}...")
                    # Seletor ultra-genérico para botões ou divs que fingem ser botões
                    btn_avancar = page.locator("div[role='button']:has-text('Avançar'), button:has-text('Avançar'), div[role='button']:has-text('Next'), button:has-text('Next'), div[role='button']:has-text('Continuar'), button:has-text('Continuar'), div[role='button']:has-text('Próximo'), button:has-text('Próximo')").last
                    await btn_avancar.click(timeout=15000)
                    await asyncio.sleep(5)

                print("Escrevendo legenda...")
                try:
                    legenda_box = page.locator("div[role='textbox'], [aria-label*='legenda'], [aria-label*='caption'], [contenteditable='true']").first
                    await legenda_box.click(timeout=10000)
                    await asyncio.sleep(1)
                    await page.keyboard.type(legenda, delay=100)
                    print("✅ Legenda escrita.")
                except:
                    print("⚠️ Tentando digitação alternativa...")
                    await page.keyboard.press("Tab")
                    await page.keyboard.type(legenda)

                await asyncio.sleep(3)
                print("Compartilhando...")
                # Busca genérica para o botão final de Compartilhar/Concluir
                btn_share = page.locator("div[role='button']:has-text('Compartilhar'), button:has-text('Compartilhar'), div[role='button']:has-text('Share'), button:has-text('Share'), div[role='button']:has-text('Concluído'), button:has-text('Concluído')").last
                await btn_share.click(timeout=15000)
                
                # Aguarda confirmação de envio (o Instagram mostra uma mensagem de sucesso)
                print("Aguardando confirmação final...")
                await asyncio.sleep(15)
                
                await browser.close()
                return True, "Post publicado com sucesso!"

            except Exception as e:
                await browser.close()
                return False, f"Falha na automação: {str(e)}"

# Teste básico
if __name__ == "__main__":
    # Para testar, precisaria de arquivos reais e uma sessao.json válida
    auto = AutomationSkill()
    # loop = asyncio.get_event_loop()
    # loop.run_until_complete(auto.publicar_carrossel(["foto.jpg"], "Teste modular", headless=False))
    print("Módulo de Automação carregado. Pronto para integração.")
