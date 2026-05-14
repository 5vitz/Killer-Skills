import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        # Abrimos o navegador
        browser = await p.chromium.launch(headless=False)
        
        # Criamos um contexto (é como uma sessão limpa de navegador)
        context = await browser.new_context()
        page = await context.new_page()
        
        print("\n--- PASSO DE LOGIN ---")
        print("1. O navegador vai abrir no Instagram.")
        print("2. Faça o seu login manualmente.")
        print("3. Se o Instagram pedir código por SMS ou E-mail, coloque normalmente.")
        print("4. QUANDO VOCÊ ESTIVER DENTRO DA SUA CONTA (vendo o feed), volte aqui no terminal.")
        
        await page.goto("https://www.instagram.com")
        
        # Esta linha faz o terminal esperar você apertar Enter
        input("\n--> DEPOIS que estiver logado, aperte ENTER aqui para salvar a sessão...")
        
        # Salva os cookies e o estado do login no arquivo sessao.json
        await context.storage_state(path="sessao.json")
        
        print("\nSucesso! Sua sessão foi salva no arquivo 'sessao.json'.")
        print("Agora o seu agente tem um 'Passaporte' para entrar sem senha.")
        
        await browser.close()

asyncio.run(main())
