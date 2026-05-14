import streamlit as st
import json
import os

# Configuração da Página para parecer um App Profissional
st.set_page_config(
    page_title="Gerador de Campanhas - Agente Lincoln",
    page_icon="🚀",
    layout="wide"
)

# Estilo CSS para aproximar do visual do Admin da Ingrid (Dark Mode Premium)
st.markdown("""
    <style>
    .main {
        background-color: #0e1117;
    }
    .stButton>button {
        background-color: #0066FF;
        color: white;
        border-radius: 8px;
        font-weight: bold;
        width: 100%;
    }
    .stTextInput>div>div>input {
        background-color: #1a1c24;
        color: white;
        border-radius: 8px;
    }
    </style>
    """, unsafe_allow_html=True)

st.title("🚀 Gerador de Campanhas Instagram")
st.subheader("Orquestrador de Conteúdo - Método Lincoln")

# Dividindo em Abas igual ao ProjectManager da Ingrid
tab_info, tab_estrutura, tab_json = st.tabs(["📋 Info Campanha", "🏗️ Estrutura de Fluxo", "💾 Gerar JSON"])

with tab_info:
    st.header("Informações Gerais")
    col1, col2 = st.columns(2)
    
    with col1:
        nome_campanha = st.text_input("Nome da Campanha", placeholder="Ex: Inverno 2024 - Coleção Linho")
        cliente = st.text_input("Cliente / Marca", placeholder="Ex: Loja 5inko")
    
    with col2:
        cor_marca = st.color_picker("Cor de Identidade da Marca", "#0066FF")
        data_inicio = st.date_input("Data de Início da Postagem")

with tab_estrutura:
    st.header("Definição do Fluxo de Navegação")
    st.info("Defina como o conteúdo será apresentado no Instagram.")
    
    col_v, col_h = st.columns(2)
    
    with col_v:
        st.subheader("📱 Navegação Vertical (Stories/Reels)")
        qtd_vertical = st.number_input("Quantidade de Vídeos/Fotos Verticais", min_value=0, value=7)
        legenda_v = st.text_area("Legenda Base Vertical", "Acompanhe nossa nova coleção...")
        
    with col_h:
        st.subheader("↔️ Navegação Horizontal (Carrossel)")
        qtd_horizontal = st.number_input("Quantidade de Imagens no Carrossel", min_value=0, value=8)
        legenda_h = st.text_area("Legenda Base Carrossel", "Arraste para o lado e veja os detalhes.")

with tab_json:
    st.header("Exportação de Manifesto")
    
    # Criando o dicionário que vira JSON
    dados_campanha = {
        "metadata": {
            "campanha": nome_campanha,
            "cliente": cliente,
            "cor_tema": cor_marca,
            "data": str(data_inicio)
        },
        "sequencia_vertical": {
            "total_itens": qtd_vertical,
            "legenda": legenda_v,
            "formato": "9:16"
        },
        "sequencia_carrossel": {
            "total_itens": qtd_horizontal,
            "legenda": legenda_h,
            "formato": "4:5"
        }
    }
    
    st.code(json.dumps(dados_campanha, indent=4, ensure_ascii=False), language="json")
    
    if st.button("SALVAR MANIFESTO E ENVIAR AO AGENTE"):
        with open("campanha.json", "w", encoding="utf-8") as f:
            json.dump(dados_campanha, f, indent=4, ensure_ascii=False)
        st.success("✅ Arquivo 'campanha.json' salvo com sucesso na pasta do projeto!")
        st.balloons()

st.sidebar.markdown("---")
st.sidebar.info("Agente Lincoln - Versão 1.0 (Instagram Strategy)")
