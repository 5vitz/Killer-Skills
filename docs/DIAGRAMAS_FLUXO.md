# 📊 Diagramas de Fluxo e Arquitetura - Killer Skills

Estes diagramas detalham o funcionamento técnico do sistema e foram desenhados com foco em escalabilidade.

## 1. Fluxo de Inteligência (Equipe de Agentes)
Mostra a interação entre os agentes especializados até a geração do plano de execução.

```mermaid
graph TD
    User((Usuário)) -->|Input da Campanha| ORC[Orquestrador]
    
    subgraph Equipe_Pensante [Núcleo de Inteligência]
        ORC <-->|Briefing & Tom de Voz| NAR[Narrador]
        ORC <-->|Análise de Mercado| EST[Estrategista]
        ORC <-->|Configuração Técnica| TEC[Técnico]
    end
    
    ORC -->|Gera Plano de Execução| JSON{JSON da Campanha}
    JSON -->|Envia para| QUEUE[(Fila de Tarefas - Redis)]
```

---

## 2. Esteira de Automação (Executores)
O uso de uma fila permite que você escale horizontalmente, adicionando quantos robôs forem necessários sem sobrecarregar o app principal.

```mermaid
graph LR
    subgraph Backend
        APP[App Dashboard] -->|Publicar Post| REDIS[(Redis Queue)]
    end

    subgraph Workers_Escalaveis [Execução Horizontal]
        REDIS --> W1[Executor 1 - Playwright]
        REDIS --> W2[Executor 2 - Playwright]
        REDIS --> W3[Executor N... - Playwright]
    end

    W1 --> IG1[Instagram Perfil A]
    W2 --> IG2[Instagram Perfil B]
    W3 --> IG3[Instagram Perfil C]
```

---

## 3. Arquitetura de Servidor no VPS
Estrutura recomendada para o ambiente de produção na Contabo.

```mermaid
graph TD
    Internet((Internet)) -->|Porta 80/443| NGX[Nginx - Reverse Proxy]
    
    subgraph Servidor_App [VPS Principal]
        NGX -->|Load Balancer| PM2[PM2 Cluster Mode]
        PM2 --> INST1[Instância Node.js 1]
        PM2 --> INST2[Instância Node.js 2]
    end
    
    subgraph Persistencia [Camada de Dados]
        INST1 & INST2 --> DB[(PostgreSQL / MongoDB)]
        INST1 & INST2 --> CACHE[(Redis)]
    end
```
