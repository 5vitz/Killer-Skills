import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        # Abrimos o navegador
        browser = await p.chromium.launch(headless=False)
        
        # AQUI ESTÁ A MÁGICA: 
        # Criamos o contexto JÁ CARREGANDO o arquivo de sessão
        context = await browser.new_context(storage_state="sessao.json")
        
        page = await context.new_page()
        
        print("Entrando no Instagram com a sua sessão salva...")
        await page.goto("https://www.instagram.com")
        
        # Esperamos um pouco para carregar o seu Feed
        await asyncio.sleep(7)
        
        # Tiramos um print para provar que você está logado
        await page.screenshot(path="logado_com_sucesso.png")
        
        print("Sucesso! Veja o arquivo 'logado_com_sucesso.png'. Você entrou sem digitar senha!")
        
        await browser.close()

asyncio.run(main())
