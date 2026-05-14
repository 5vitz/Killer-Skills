import asyncio
import os
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        diretorio_atual = os.getcwd()
        img1 = os.path.join(diretorio_atual, "imagens_post", "AVA01.png")
        img2 = os.path.join(diretorio_atual, "imagens_post", "Bone.png")

        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(storage_state="sessao.json")
        page = await context.new_page()

        print("Acessando Instagram...")
        await page.goto("https://www.instagram.com/")
        # Removemos a trava de 'networkidle' e usamos apenas um tempo fixo
        await asyncio.sleep(10)

        print("Procurando o botão de 'Criar'...")
        criadores = [
            "span:has-text('Criar')", 
            "span:has-text('Create')",
            "[aria-label='Nova publicação']",
            "[aria-label='New post']",
            "svg[aria-label='Nova publicação']",
            "text='Criar'"
        ]
        
        sucesso_criar = False
        for seletor in criadores:
            try:
                await page.locator(seletor).first.click(timeout=5000)
                sucesso_criar = True
                print(f"Sucesso com o seletor: {seletor}")
                break
            except:
                continue
        
        if not sucesso_criar:
            print("Tentando clique forçado no ícone de '+'...")
            await page.click("div[role='button']:has(svg)")
        
        await asyncio.sleep(5)

        print("Selecionando arquivos...")
        try:
            async with page.expect_file_chooser() as fc_info:
                # Tenta vários nomes de botão para o seletor de arquivos
                await page.locator("button:has-text('Selecionar'), button:has-text('Select'), ._acan").first.click()
            file_chooser = await fc_info.value
            await file_chooser.set_files([img1, img2])
        except Exception as e:
            print(f"Erro ao selecionar arquivos: {e}")
            
        await asyncio.sleep(6)

        for i in range(2):
            print(f"Avançar ({i+1}/2)...")
            await page.locator("div:has-text('Avançar'), div:has-text('Next'), button:has-text('Avançar'), button:has-text('Next')").first.click()
            await asyncio.sleep(5)

        print("Legenda...")
        try:
            legenda_box = page.locator("div[role='textbox'], div[contenteditable='true']").first
            await legenda_box.fill("Post automático via Agente IA! 🚀 #automacao #aprendizado")
            await asyncio.sleep(3)
        except:
            await page.keyboard.type("Post automático via Agente IA!")

        print("Compartilhar...")
        await page.locator("div:has-text('Compartilhar'), div:has-text('Share'), button:has-text('Compartilhar'), button:has-text('Share')").first.click()
        
        print("\nPost enviado! Aguardando conclusão...")
        await asyncio.sleep(20)
        
        await browser.close()
        print("\nFinalizado!")

asyncio.run(main())
