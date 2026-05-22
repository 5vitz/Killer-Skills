#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
================================================================================
                    CRIADOR DE PROMPTS (PROMPT COMPILER ENGINE)
                              KILLER SKILLS v1.0
================================================================================
Este script automatiza a afiação do machado do nosso desenvolvimento. Ele lê
os quatro pilares conceituais do projeto (/docs/) e compila um prompt de alta
fidelidade, focado e livre de alucinações para o Agente Executor.

Autor: Lincoln (Sargento de Tecnologia)
================================================================================
"""

import os
import sys

# Diretórios padrão
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS_DIR = os.path.join(BASE_DIR, "docs")

# Nomes dos arquivos de referência
FILE_ESTRATEGIA = os.path.join(DOCS_DIR, "ESTRATEGIA.md")
FILE_PLANEJAMENTO = os.path.join(DOCS_DIR, "PLANEJAMENTO.md")
FILE_METODOLOGIA = os.path.join(DOCS_DIR, "METODOLOGIA.md")
FILE_TASKS = os.path.join(DOCS_DIR, "TASKS.md")
FILE_OUTPUT = os.path.join(DOCS_DIR, "prompt_gerado.md")

# Unicode boxes para estética premium no terminal
TOP_BORDER    = "╔══════════════════════════════════════════════════════════════════════════════╗"
MID_BORDER    = "╠══════════════════════════════════════════════════════════════════════════════╣"
BOTTOM_BORDER = "╚══════════════════════════════════════════════════════════════════════════════╝"

def read_markdown_file(path):
    """Lê um arquivo markdown e retorna o conteúdo de forma limpa."""
    if not os.path.exists(path):
        print(f"⚠️  Aviso: Arquivo de referência não encontrado em {path}")
        return ""
    try:
        with open(path, "r", encoding="utf-8") as f:
            return f.read().strip()
    except Exception as e:
        print(f"❌ Erro ao ler o arquivo {os.path.basename(path)}: {e}")
        return ""

def extract_section(content, section_title):
    """Extrai uma seção específica do markdown baseado no título (ex: '## 1. MANIFESTO')."""
    lines = content.split("\n")
    start_idx = -1
    end_idx = len(lines)
    
    for i, line in enumerate(lines):
        if line.strip().startswith(section_title):
            start_idx = i
            break
            
    if start_idx == -1:
        return ""
        
    # Encontra o próximo cabeçalho do mesmo nível ou superior
    level = len(section_title.split(" ")[0]) # Conta os '#'
    for j in range(start_idx + 1, len(lines)):
        line_strip = lines[j].strip()
        if line_strip.startswith("#"):
            curr_level = len(line_strip.split(" ")[0])
            if curr_level <= level:
                end_idx = j
                break
                
    return "\n".join(lines[start_idx:end_idx]).strip()

def compile_prompt(task_input, persona_choice):
    """Compila as seções de Ontologia, Epistemologia, Metodologia e Tarefa."""
    
    print("\n⌛ Lendo os 4 Pilares Documentais em docs/...")
    
    # 1. ONTOLOGIA (ESTRATEGIA.md)
    estrategia_raw = read_markdown_file(FILE_ESTRATEGIA)
    # Extrai o Manifesto de Visão Geral
    visao_geral = extract_section(estrategia_raw, "### 1.1. Premissa Sociológica") + "\n\n" + \
                  extract_section(estrategia_raw, "### 1.2. A Tese do Projeto") + "\n\n" + \
                  extract_section(estrategia_raw, "### 1.4. O Diferencial Estratégico")
                  
    # Extrai a Persona se selecionada
    persona_context = ""
    if persona_choice != "N/A":
        persona_context = extract_section(estrategia_raw, f"#### {persona_choice}")
        if not persona_context:
            # Fallback para busca por cabeçalho genérico da persona
            persona_context = extract_section(estrategia_raw, persona_choice)

    # 2. EPISTEMOLOGIA (PLANEJAMENTO.md)
    planejamento_raw = read_markdown_file(FILE_PLANEJAMENTO)
    arquitetura_app = extract_section(planejamento_raw, "## 2. ARQUITETURA VISUAL & ESTRUTURA DO APP")
    banco_dados = extract_section(planejamento_raw, "## 3. MODELO DE BANCO DE DADOS")
    
    # 3. METODOLOGIA (METODOLOGIA.md)
    metodologia_raw = read_markdown_file(FILE_METODOLOGIA)
    regras_ouro = extract_section(metodologia_raw, "## 1. DIRETRIZES DE DESENVOLVIMENTO (REGRAS DE OURO)")
    ritual_desenvolvimento = extract_section(metodologia_raw, "## 4. RITUAL DE DESENVOLVIMENTO ORIGINAL (MÉTODO LINCOLN)")

    # 4. MONTAGEM FINAL
    prompt_builder = []
    
    prompt_builder.append("# SYSTEM INSTRUCTION: INSTRUÇÃO DE EXECUÇÃO E CODIFICAÇÃO")
    prompt_builder.append("\n" + "="*80)
    prompt_builder.append("Você é o **Agente Executor** do Killer Skills, um soldado programador altamente qualificado.")
    prompt_builder.append("Sua missão é codificar a tarefa delegada com extrema perfeição técnica, seguindo as diretrizes abaixo.")
    prompt_builder.append("="*80 + "\n")
    
    # Injetando Ontologia
    prompt_builder.append("## 🧠 1. DIRETRIZ E CONTEXTO DE ATORE (ONTOLOGIA)")
    prompt_builder.append(visao_geral)
    if persona_context:
        prompt_builder.append("\n### Persona Ativa desta Campanha/Código:")
        prompt_builder.append(persona_context)
    prompt_builder.append("\n" + "-"*80)
    
    # Injetando Epistemologia
    prompt_builder.append("## 📐 2. ESTRUTURA TÉCNICA E BANCO DE DADOS (EPISTEMOLOGIA)")
    prompt_builder.append(arquitetura_app)
    prompt_builder.append("\n" + banco_dados)
    prompt_builder.append("\n" + "-"*80)
    
    # Injetando Metodologia
    prompt_builder.append("## 🛠️ 3. REGRAS DE CONDUTA E ESTABILIDADE (METODOLOGIA)")
    prompt_builder.append(regras_ouro)
    prompt_builder.append("\n" + ritual_desenvolvimento)
    prompt_builder.append("\n" + "-"*80)
    
    # Injetando Operação (A tarefa)
    prompt_builder.append("## 🚀 4. ESCOPO EXATO DA TAREFA (OPERAÇÃO)")
    prompt_builder.append(f"Seu objetivo exclusivo nesta rodada é implementar a seguinte tarefa:")
    prompt_builder.append(f"```markdown\n{task_input}\n```")
    prompt_builder.append("\n*Lembre-se: Você deve agir cirurgicamente sobre esta tarefa. Não crie códigos fora do escopo e certifique-se de que nada que já está pronto seja afetado.*")
    
    compiled_prompt = "\n".join(prompt_builder)
    
    # Salva o prompt gerado
    try:
        with open(FILE_OUTPUT, "w", encoding="utf-8") as f:
            f.write(compiled_prompt)
        print(f"✅ Prompt compilado e salvo com sucesso em `docs/prompt_gerado.md`!")
    except Exception as e:
        print(f"❌ Erro ao salvar o prompt final: {e}")
        
    # Copia para o Clipboard se possível
    copied_to_clipboard = False
    try:
        import pyperclip
        pyperclip.copy(compiled_prompt)
        copied_to_clipboard = True
        print("📋 Prompt copiado automaticamente para a sua área de transferência!")
    except ImportError:
        pass
    except Exception:
        pass
        
    if not copied_to_clipboard:
        print("💡 Nota: Não foi possível copiar para a área de transferência do OS (xclip não instalado no sandbox), mas o prompt está salvo em `docs/prompt_gerado.md`!")
        
    return compiled_prompt

def select_persona_interactive():
    """Menu simples para seleção de persona."""
    print("\nSelecione a Persona Ativa da Campanha/Módulo:")
    print("1. O Intelectual de Vitrine  (A)")
    print("2. O Lifestyle Magnético     (B)")
    print("3. A Marca em Ascensão       (C)")
    print("4. O Especialista            (D)")
    print("5. O Ego-Booster             (E)")
    print("6. Não se aplica             (N/A)")
    
    choice = input("Digite a opção (1-6): ").strip()
    
    mapping = {
        "1": "A. O Intelectual de Vitrine",
        "2": "B. O Lifestyle Magnético",
        "3": "C. A Marca em Ascensão",
        "4": "D. O Especialista de Autoridade",
        "5": "E. O Ego-Booster",
        "6": "N/A"
    }
    
    return mapping.get(choice, "N/A")

def main():
    print(TOP_BORDER)
    print("║                   CRIADOR DE PROMPTS - PROMPT COMPILER ENGINE                ║")
    print("║                                 KILLER SKILLS                                ║")
    print(BOTTOM_BORDER)
    
    # Solicita a tarefa operacional
    print("\nQual tarefa técnica você deseja que o Agente Executor execute?")
    task_input = input("Digite a tarefa (Ex: Tarefa 1.1 - Criar database.py): ").strip()
    
    if not task_input:
        print("❌ A tarefa não pode ser vazia. Abortando.")
        sys.exit(1)
        
    # Seleção de Persona
    persona_choice = select_persona_interactive()
    
    # Executa a compilação
    compiled = compile_prompt(task_input, persona_choice)
    
    print("\n" + MID_BORDER)
    print("    PROMPT PRONTO PARA USO! COPILADO DIRETO DOS 4 PILARES CONCEITUAIS.")
    print("    Carregue o arquivo `docs/prompt_gerado.md` e envie para o Agente Executor.")
    print(BOTTOM_BORDER + "\n")

if __name__ == "__main__":
    main()
