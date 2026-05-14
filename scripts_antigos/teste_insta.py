import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        # Abrimos o navegador Chromium. 
        # headless=False significa que queremos VER o navegador abrindo.
        browser = await p.chromium.launch(headless=False)
        
        # Criamos uma nova página (uma aba)
        page = await browser.new_page()
        
        print("Indo para o Instagram...")
        # Mandamos o robô navegar até o Instagram
        await page.goto("https://www.instagram.com")
        
        # Esperamos 5 segundos para a página carregar bem
        await asyncio.sleep(5)
        
        # Tiramos um print da tela
        await page.screenshot(path="resultado_instagram.png")
        print("Screenshot salva como 'resultado_instagram.png'!")
        
        # Fechamos o navegador
        await browser.close()

# Rodamos o código
asyncio.run(main())
