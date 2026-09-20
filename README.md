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

<div align="center">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 980 500" width="100%" height="auto" style="max-width: 980px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <defs>
    <!-- Filtros de Glow -->
    <filter id="glow-teal" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <filter id="glow-purple" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <filter id="card-shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.6"/>
    </filter>

    <!-- Marcadores de Conectores -->
    <marker id="arrow-teal" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#35D1B8" />
    </marker>
    <marker id="arrow-purple" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#A78BFA" />
    </marker>
    <marker id="arrow-amber" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#F0A742" />
    </marker>

    <!-- Gradientes -->
    <linearGradient id="bg-box" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0A0F16"/>
      <stop offset="100%" stop-color="#06090D"/>
    </linearGradient>
    <linearGradient id="grad-card" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#141E2B" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#0D141E" stop-opacity="0.9"/>
    </linearGradient>
    <linearGradient id="grad-teal-accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#35D1B8"/>
      <stop offset="100%" stop-color="#10B981"/>
    </linearGradient>
  </defs>

  <!-- Fundo Canvas -->
  <rect width="980" height="500" rx="16" fill="url(#bg-box)" stroke="#1F2937" stroke-width="1.5"/>

  <!-- Título do Diagrama -->
  <g transform="translate(30, 32)">
    <circle cx="6" cy="6" r="5" fill="#35D1B8" />
    <text x="20" y="10" fill="#E2E8F0" font-size="13" font-weight="700" letter-spacing="1">ARCHIFY ARCHITECTURE TOPOLOGY MAP</text>
    <text x="320" y="10" fill="#64748B" font-size="11" font-family="monospace">v2.0.0 · REACT 19 · ZUSTAND · DEXIE · CLEAN ARCHITECTURE</text>
  </g>

  <!-- ==================== CAMADA 1: CLIENT PRESENTATION ==================== -->
  <rect x="25" y="65" width="220" height="405" rx="12" fill="#0E1622" stroke="#1E2E42" stroke-width="1" />
  <rect x="25" y="65" width="220" height="32" rx="12" fill="#142132" />
  <rect x="25" y="85" width="220" height="12" fill="#142132" />
  <text x="40" y="86" fill="#35D1B8" font-size="11" font-weight="700" letter-spacing="0.5">1. CLIENT LAYER (UI)</text>

  <!-- Nós Camada 1 -->
  <g transform="translate(37, 110)">
    <!-- Node 1.1 -->
    <rect width="196" height="56" rx="8" fill="url(#grad-card)" stroke="#26384F" stroke-width="1" filter="url(#card-shadow)"/>
    <text x="14" y="24" fill="#F8FAFC" font-size="11" font-weight="600">Form Wizard (Steps 1-6)</text>
    <text x="14" y="42" fill="#64748B" font-size="9.5">Momento, Severidade, Causa, Ações</text>
    
    <!-- Node 1.2 -->
    <rect y="68" width="196" height="56" rx="8" fill="url(#grad-card)" stroke="#26384F" stroke-width="1" filter="url(#card-shadow)"/>
    <text x="14" y="92" fill="#F8FAFC" font-size="11" font-weight="600">Active Incident Banner</text>
    <text x="14" y="110" fill="#64748B" font-size="9.5">Command Center · Micro-KPIs</text>

    <!-- Node 1.3 -->
    <rect y="136" width="196" height="56" rx="8" fill="url(#grad-card)" stroke="#26384F" stroke-width="1" filter="url(#card-shadow)"/>
    <text x="14" y="160" fill="#F8FAFC" font-size="11" font-weight="600">Live WhatsApp Preview</text>
    <text x="14" y="178" fill="#64748B" font-size="9.5">Mockup Web · Validação Checklist</text>

    <!-- Node 1.4 -->
    <rect y="204" width="196" height="56" rx="8" fill="url(#grad-card)" stroke="#26384F" stroke-width="1" filter="url(#card-shadow)"/>
    <text x="14" y="228" fill="#F8FAFC" font-size="11" font-weight="600">SLA Countdown Widget</text>
    <text x="14" y="246" fill="#64748B" font-size="9.5">Decaimento Regressivo · Alerta Web Audio</text>

    <!-- Node 1.5 -->
    <rect y="272" width="196" height="56" rx="8" fill="url(#grad-card)" stroke="#26384F" stroke-width="1" filter="url(#card-shadow)"/>
    <text x="14" y="296" fill="#F8FAFC" font-size="11" font-weight="600">Incident Timeline Feed</text>
    <text x="14" y="314" fill="#64748B" font-size="9.5">Histórico Auditável de Despachos</text>
  </g>

  <!-- ==================== CAMADA 2: STATE & RULES ==================== -->
  <rect x="270" y="65" width="220" height="405" rx="12" fill="#0E1622" stroke="#1E2E42" stroke-width="1" />
  <rect x="270" y="65" width="220" height="32" rx="12" fill="#142132" />
  <rect x="270" y="85" width="220" height="12" fill="#142132" />
  <text x="285" y="86" fill="#A78BFA" font-size="11" font-weight="700" letter-spacing="0.5">2. STATE & RULES ENGINE</text>

  <!-- Nós Camada 2 -->
  <g transform="translate(282, 110)">
    <!-- Node 2.1 -->
    <rect width="196" height="56" rx="8" fill="url(#grad-card)" stroke="#4C3875" stroke-width="1" filter="url(#card-shadow)"/>
    <text x="14" y="24" fill="#A78BFA" font-size="11" font-weight="600">useIncidentStore (Zustand)</text>
    <text x="14" y="42" fill="#94A3B8" font-size="9.5">Draft, Ativo, Alternância Multi-Incident</text>

    <!-- Node 2.2 -->
    <rect y="68" width="196" height="56" rx="8" fill="url(#grad-card)" stroke="#334155" stroke-width="1" filter="url(#card-shadow)"/>
    <text x="14" y="92" fill="#F8FAFC" font-size="11" font-weight="600">SLA Calculator</text>
    <text x="14" y="110" fill="#64748B" font-size="9.5">SA/S1 (15m), S2 (30m), S3 (60m)</text>

    <!-- Node 2.3 -->
    <rect y="136" width="196" height="56" rx="8" fill="url(#grad-card)" stroke="#334155" stroke-width="1" filter="url(#card-shadow)"/>
    <text x="14" y="160" fill="#F8FAFC" font-size="11" font-weight="600">Template Compiler</text>
    <text x="14" y="178" fill="#64748B" font-size="9.5">Compilador WhatsApp Formal</text>

    <!-- Node 2.4 -->
    <rect y="204" width="196" height="56" rx="8" fill="url(#grad-card)" stroke="#334155" stroke-width="1" filter="url(#card-shadow)"/>
    <text x="14" y="228" fill="#F8FAFC" font-size="11" font-weight="600">Duration & MTTR Engine</text>
    <text x="14" y="246" fill="#64748B" font-size="9.5">Cálculo de Tempo de Indisponibilidade</text>

    <!-- Node 2.5 -->
    <rect y="272" width="196" height="56" rx="8" fill="url(#grad-card)" stroke="#334155" stroke-width="1" filter="url(#card-shadow)"/>
    <text x="14" y="296" fill="#F8FAFC" font-size="11" font-weight="600">Checklist Validator</text>
    <text x="14" y="314" fill="#64748B" font-size="9.5">Percentual de Prontidão (0-100%)</text>
  </g>

  <!-- ==================== CAMADA 3: PERSISTENCE (INDEXEDDB) ==================== -->
  <rect x="515" y="65" width="200" height="405" rx="12" fill="#0E1622" stroke="#1E2E42" stroke-width="1" />
  <rect x="515" y="65" width="200" height="32" rx="12" fill="#142132" />
  <rect x="515" y="85" width="200" height="12" fill="#142132" />
  <text x="530" y="86" fill="#10B981" font-size="11" font-weight="700" letter-spacing="0.5">3. PERSISTENCE LAYER</text>

  <!-- Nós Camada 3 -->
  <g transform="translate(527, 110)">
    <!-- Node 3.1 -->
    <rect width="176" height="70" rx="8" fill="url(#grad-card)" stroke="#165B4C" stroke-width="1" filter="url(#card-shadow)"/>
    <text x="12" y="24" fill="#34D399" font-size="11" font-weight="600">Dexie.js (IndexedDB)</text>
    <text x="12" y="42" fill="#64748B" font-size="9.5">Banco Local Reativo</text>
    <text x="12" y="58" fill="#94A3B8" font-size="9" font-family="monospace">NocIncidentDatabase v2</text>

    <!-- Node 3.2 -->
    <rect y="84" width="176" height="60" rx="8" fill="url(#grad-card)" stroke="#26384F" stroke-width="1" filter="url(#card-shadow)"/>
    <text x="12" y="108" fill="#F8FAFC" font-size="10.5" font-weight="600">incidents Table</text>
    <text x="12" y="126" fill="#64748B" font-size="9">Incidentes Ativos e Encerrados</text>

    <!-- Node 3.3 -->
    <rect y="158" width="176" height="60" rx="8" fill="url(#grad-card)" stroke="#26384F" stroke-width="1" filter="url(#card-shadow)"/>
    <text x="12" y="182" fill="#F8FAFC" font-size="10.5" font-weight="600">timeline Table</text>
    <text x="12" y="200" fill="#64748B" font-size="9">Snapshots Imutáveis de Avisos</text>

    <!-- Node 3.4 -->
    <rect y="232" width="176" height="60" rx="8" fill="url(#grad-card)" stroke="#26384F" stroke-width="1" filter="url(#card-shadow)"/>
    <text x="12" y="256" fill="#F8FAFC" font-size="10.5" font-weight="600">settings Table</text>
    <text x="12" y="274" fill="#64748B" font-size="9">Cidades Recentes, POPs, Operador</text>
  </g>

  <!-- ==================== CAMADA 4: INTEGRATION & OUTPUT ==================== -->
  <rect x="740" y="65" width="215" height="405" rx="12" fill="#0E1622" stroke="#1E2E42" stroke-width="1" />
  <rect x="740" y="65" width="215" height="32" rx="12" fill="#142132" />
  <rect x="740" y="85" width="215" height="12" fill="#142132" />
  <text x="755" y="86" fill="#F0A742" font-size="11" font-weight="700" letter-spacing="0.5">4. INTEGRATION LAYER</text>

  <!-- Nós Camada 4 -->
  <g transform="translate(752, 110)">
    <!-- Node 4.1 -->
    <rect width="191" height="74" rx="8" fill="url(#grad-card)" stroke="#D97706" stroke-width="1.2" filter="url(#card-shadow)"/>
    <rect x="12" y="10" width="80" height="16" rx="4" fill="#F59E0B" fill-opacity="0.2"/>
    <text x="17" y="22" fill="#FBBF24" font-size="8.5" font-weight="700" letter-spacing="0.5">CANAL OFICIAL</text>
    <text x="12" y="44" fill="#F8FAFC" font-size="11" font-weight="700">Clipboard Dispatcher</text>
    <text x="12" y="60" fill="#94A3B8" font-size="9">Ctrl+Enter · Operator-in-the-Loop</text>

    <!-- Node 4.2 -->
    <rect y="88" width="191" height="66" rx="8" fill="url(#grad-card)" stroke="#26384F" stroke-width="1" filter="url(#card-shadow)"/>
    <text x="12" y="112" fill="#F8FAFC" font-size="11" font-weight="600">Spreadsheet TSV Exporter</text>
    <text x="12" y="130" fill="#64748B" font-size="9">Linha Tabular Formatada para Excel</text>

    <!-- Node 4.3 -->
    <rect y="168" width="191" height="78" rx="8" fill="url(#grad-card)" stroke="#7C3AED" stroke-width="1" filter="url(#card-shadow)"/>
    <rect x="12" y="178" width="90" height="16" rx="4" fill="#8B5CF6" fill-opacity="0.2"/>
    <text x="17" y="190" fill="#C4B5FD" font-size="8.5" font-weight="700" letter-spacing="0.5">PLUG CORPORATIVO</text>
    <text x="12" y="214" fill="#F8FAFC" font-size="11" font-weight="700">MondayBridgeAdapter</text>
    <text x="12" y="230" fill="#94A3B8" font-size="9">Pronto para a API do Monday.com</text>
  </g>

  <!-- ==================== VETORES DE FLUXO / CONECTORES ==================== -->
  <!-- UI -> Store -->
  <path d="M 233 138 L 282 138" stroke="#35D1B8" stroke-width="1.8" fill="none" marker-end="url(#arrow-teal)"/>
  <path d="M 233 330 L 282 148" stroke="#35D1B8" stroke-width="1.2" stroke-dasharray="3,3" fill="none"/>
  
  <!-- Store -> DB -->
  <path d="M 478 145 L 527 145" stroke="#A78BFA" stroke-width="1.8" fill="none" marker-end="url(#arrow-purple)"/>
  
  <!-- Store -> Notifier -->
  <path d="M 478 138 C 500 138, 500 30, 752 145" stroke="#F0A742" stroke-width="1.8" fill="none" marker-end="url(#arrow-amber)"/>

</svg>

</div>

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

## 🔄 Fluxo de Despacho em 1 Clique (*Operator-in-the-Loop*)

```
[ Incidente Detectado ]
         │
         ▼
[ 1º Aviso (ab) ] ──────────► Disparado em até 10 minutos (mesmo em apuração)
         │
         ▼ (Contagem de SLA ativa: 15 / 30 / 60 min)
[ Atualizações (at) ] ──────► "1 Clique": Troca apenas o status técnico
         │                    (mantém dados intactos; recalcula próximo aviso)
         ▼
[ Normalização (nr) ] ──────► Validação de telemetria + Cálculo automático MTTR
         │
         ▼
[ Relatório Final (en) ] ───► Consolidação pós-incidente (causa raiz e melhorias)
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
