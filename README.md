<div align="center">

# ⚡ NOC Incident Dispatcher

**Sistema Reativo de Gestão e Despacho de Incidentes de Rede**  
*Grupo IBL · Network Operations Center (NOC)*

[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7_(Strict)-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Zustand](https://img.shields.io/badge/Zustand-5.x-443E38?style=flat-square)](https://github.com/pmndrs/zustand)
[![Dexie.js](https://img.shields.io/badge/Dexie.js-IndexedDB-1ABC9C?style=flat-square)](https://dexie.org)
[![Archify](https://img.shields.io/badge/Archify-v1.0.0-9333EA?style=flat-square)](./architecture.archify.json)

</div>

---

## 🏛️ Topologia Arquitetural (Archify Specification)

<p align="center">
  <img src="./docs/architecture-topology.svg" alt="Archify Architecture Topology Map" width="100%" />
</p>

<details open>
<summary><b>🔍 Diagrama Interativo de Fluxo (Mermaid Flowchart)</b></summary>

```mermaid
flowchart LR
    subgraph L1["1. Client Layer (UI)"]
        UI_WIZ["Form Wizard (Steps 1-6)"]
        UI_BAN["Active Incident Banner"]
        UI_PREV["Live WhatsApp Preview"]
        UI_SLA["SLA Countdown Widget"]
        UI_TIME["Incident Timeline Feed"]
    end

    subgraph L2["2. State & Rules Engine"]
        ST_ZUS["useIncidentStore (Zustand)"]
        ST_SLA["SLA Calculator"]
        ST_COMP["Template Compiler"]
        ST_MTTR["Duration & MTTR Engine"]
        ST_CHK["Checklist Validator"]
    end

    subgraph L3["3. Persistence (IndexedDB)"]
        DB_DEX["Dexie.js Database"]
        DB_INC[("incidents Table")]
        DB_TIM[("timeline Table")]
        DB_SET[("settings Table")]
    end

    subgraph L4["4. Integration Layer"]
        INT_CLIP["Clipboard (Ctrl+Enter)\n★ Canal Oficial"]
        INT_TSV["Spreadsheet TSV"]
        INT_MON["Monday.com Bridge"]
    end

    UI_WIZ --> ST_ZUS
    UI_BAN --> ST_ZUS
    ST_ZUS --> ST_SLA
    ST_ZUS --> ST_COMP
    ST_ZUS --> ST_CHK
    ST_ZUS --> DB_DEX
    DB_DEX --> DB_INC
    DB_DEX --> DB_TIM
    DB_DEX --> DB_SET
    ST_ZUS --> INT_CLIP
    ST_ZUS --> INT_TSV
    ST_ZUS --> INT_MON

    classDef client fill:#0E1622,stroke:#35D1B8,stroke-width:1.5px,color:#F8FAFC
    classDef state fill:#0E1622,stroke:#A78BFA,stroke-width:1.5px,color:#F8FAFC
    classDef storage fill:#0E1622,stroke:#10B981,stroke-width:1.5px,color:#F8FAFC
    classDef integration fill:#0E1622,stroke:#F0A742,stroke-width:1.5px,color:#F8FAFC

    class UI_WIZ,UI_BAN,UI_PREV,UI_SLA,UI_TIME client
    class ST_ZUS,ST_SLA,ST_COMP,ST_MTTR,ST_CHK state
    class DB_DEX,DB_INC,DB_TIM,DB_SET storage
    class INT_CLIP,INT_TSV,INT_MON integration
```

</details>

---

## ⚡ Especificação Rápida das Camadas

<table>
  <thead>
    <tr>
      <th align="left">Camada</th>
      <th align="left">Tecnologia</th>
      <th align="left">Responsabilidade</th>
      <th align="left">Saída / Artefato</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>1. Client Presentation</b></td>
      <td><code>React 19</code> · <code>Tailwind CSS</code></td>
      <td>Interface Dark Command Center, inputs desacoplados, preview hiper-realista do WhatsApp Web e relógio reativo.</td>
      <td>DOM reativo, Hotkeys (<code>Ctrl+Enter</code>)</td>
    </tr>
    <tr>
      <td><b>2. State & Engine</b></td>
      <td><code>Zustand 5</code> · <code>TypeScript</code></td>
      <td>Gerenciamento de rascunhos, cronômetro de cadência (SLA), cálculo de MTTR e compilação do texto formal.</td>
      <td>State imutável, string formatada WhatsApp</td>
    </tr>
    <tr>
      <td><b>3. Persistence</b></td>
      <td><code>Dexie.js</code> (IndexedDB)</td>
      <td>Armazenamento local multi-incidente no navegador. Protege contra perda por reload acidental (F5) ou fechamento de abas.</td>
      <td>Schemas: <code>incidents</code>, <code>timeline</code>, <code>settings</code></td>
    </tr>
    <tr>
      <td><b>4. Integration</b></td>
      <td><code>Strategy Pattern</code></td>
      <td>Saída operacional de alta velocidade: Clipboard nativo (paliativo sem custos de API) e ponte para Monday.com.</td>
      <td>Clipboard OS, Linha TSV, Payload Monday API</td>
    </tr>
  </tbody>
</table>

---

## 🚨 Matriz de Classificação & SLAs

<table>
  <thead>
    <tr>
      <th>Código</th>
      <th>Nomenclatura Técnica Formal</th>
      <th>SLA Obrigatório</th>
      <th>Diretriz Operacional IBL</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">🔴 <b>S1</b></td>
      <td><b>Indisponibilidade</b></td>
      <td><code>A cada 15 min</code></td>
      <td>Queda total de município ou POP principal. Suspensão total de agendas de rua e ativações.</td>
    </tr>
    <tr>
      <td align="center">🟠 <b>S2</b></td>
      <td><b>Indisponibilidade Parcial</b></td>
      <td><code>A cada 30 min</code></td>
      <td>Interrupção isolada a anéis ópticos, bairros específicos ou trechos de cabo.</td>
    </tr>
    <tr>
      <td align="center">🟡 <b>S3</b></td>
      <td><b>Instabilidade</b></td>
      <td><code>A cada 60 min</code></td>
      <td>Degradação de tráfego, latência ou perda de pacotes. Orientar suporte com frase única.</td>
    </tr>
    <tr>
      <td align="center">🔵 <b>S4</b></td>
      <td><b>Manutenção Programada</b></td>
      <td><code>Início e Fim</code></td>
      <td>Janela noturna técnica previamente homologada pelo NOC.</td>
    </tr>
    <tr>
      <td align="center">🟣 <b>SA</b></td>
      <td><b>Incidente de Segurança (DDoS)</b></td>
      <td><code>A cada 15 min</code></td>
      <td>Ataque volumétrico/L7. Habilita telemetria e registros de mitigação de operadora/upstream.</td>
    </tr>
  </tbody>
</table>

---

## 🔄 Ciclo de Vida do Incidente (*Operator-in-the-Loop*)

<details open>
<summary><b>🔍 Diagrama de Fases Operacionais</b></summary>

```mermaid
flowchart TD
    DET(["⚡ Incidente Detectado"]) --> AB["📣 1º Aviso (ab)\nAté 10 min (mesmo em apuração)"]
    
    subgraph CICLO["🔄 Ciclo de Atualização em 1 Clique (SLA Ativo)"]
        direction TB
        AT["🔄 Atualização Periódica (at)\nTroca rápida de status técnico"]
        SLA{"⏱️ Cadência de SLA\nSA/S1: 15m · S2: 30m · S3: 60m"}
        AT --> SLA
        SLA -->|"Próximo prazo"| AT
    end

    AB --> CICLO
    CICLO -->|"Tráfego estabilizado"| NR["✅ Normalização (nr)\nValidação de telemetria + MTTR"]
    NR --> EN["📋 Relatório Final (en)\nCausa raiz e melhorias estruturais"]
    EN --> FIN(["🏁 Incidente Encerrado"])

    classDef startEnd fill:#0F172A,stroke:#64748B,stroke-width:1.5px,color:#E2E8F0
    classDef abStep fill:#1E1B4B,stroke:#818CF8,stroke-width:2px,color:#F8FAFC
    classDef loopStep fill:#172554,stroke:#38BDF8,stroke-width:2px,color:#F8FAFC
    classDef normStep fill:#064E3B,stroke:#34D399,stroke-width:2px,color:#F8FAFC
    classDef closeStep fill:#3B0764,stroke:#C084FC,stroke-width:2px,color:#F8FAFC

    class DET,FIN startEnd
    class AB abStep
    class AT,SLA loopStep
    class NR normStep
    class EN closeStep
```

</details>

---

## 📡 Pipeline de Despacho & Dados

```mermaid
sequenceDiagram
    autonumber
    actor OP as 👤 Operador NOC
    participant UI as 🖥️ UI (Wizard / Preview)
    participant ST as 🧠 useIncidentStore
    participant RL as ⚙️ Rules & SLA Engine
    participant DB as 💾 Dexie (IndexedDB)
    participant CP as 📋 Clipboard OS
    participant MB as 🏢 Monday.com Bridge

    OP->>UI: Pressiona Ctrl+Enter / Botão Despachar
    UI->>ST: dispatchActiveMessage()
    ST->>RL: validateChecklist() & compileWhatsAppMessage()
    RL-->>ST: Texto Formatado & Metadata de SLA
    ST->>DB: Persiste Incidente & Snapshot na Timeline
    DB-->>ST: Confirmação de Gravação Local
    ST->>CP: Injeta texto formatado no Clipboard
    ST->>MB: Prepara Payload para Monday.com
    ST-->>UI: Feedback Visual ("Copiado ✓") + Reseta Timer SLA
    OP->>OP: Cola no Grupo Oficial do WhatsApp
```

---

## 💾 Persistência: IndexedDB vs Hospedagem Centralizada

> [!NOTE]
> **Como funciona atualmente:**  
> O sistema utiliza **IndexedDB (Dexie.js)**. Os dados residem **no navegador do computador do operador**. Se a máquina fechar a aba ou reiniciar, nada se perde.  
> Se o projeto for hospedado estaticamente em `https://event.iblnet.com.br/`, outro usuário que abrir o link em sua máquina iniciará com o banco local vazio.

Para tornar o link um **Painel de Monitoramento Global em Tempo Real**, utiliza-se:
1. **Monday.com API:** Através do [`MondayBridgeAdapter.ts`](./src/services/notifier/MondayBridgeAdapter.ts), os eventos alimentam o quadro central da IBL.
2. **Camada em Nuvem (Supabase / Firebase):** Sincronização via WebSockets refletindo novos comunicados em menos de 100ms em todas as telas abertas.

---

## 🛠️ Execução & Comandos

```bash
# 1. Instalar dependências
npm install

# 2. Servidor de desenvolvimento com HMR
npm run dev

# 3. Compilar bundle de produção otimizado
npm run build

# 4. Preview local do pacote gerado (dist/)
npm run preview
```

---

<div align="center">

<sub>Grupo IBL · Network Operations Center · Arquitetura Orientada a Eventos Críticos</sub>

</div>
