# NOC Incident Dispatcher — Documentação Técnica & Arquitetura de Software

> **Sistema:** NOC Incident Dispatcher (Grupo IBL)  
> **Versão:** 2.0.0 (Modernização Reativa)  
> **Stack:** React 19 · TypeScript 5.x (Strict) · Vite · Tailwind CSS · Zustand · Dexie.js (IndexedDB)  
> **Padrão de Integração:** *Operator-in-the-Loop* (Clipboard Nativo de Alta Fidelidade + Planilha TSV + Monday Bridge)

---

## 1. Escopo & Diretrizes Arquiteturais

O **NOC Incident Dispatcher** é uma Single Page Application (SPA) reativa e de alta performance projetada para padronizar, acelerar e auditar a comunicação de incidentes de rede e segurança do Grupo IBL para equipes de atendimento, lojas, campo e liderança operacional.

### 1.1. Princípios de Engenharia
1. **Zero Bloqueio Operacional (*Operator-in-the-Loop*):** A aplicação não depende de APIs externas síncronas ou instáveis de terceiros para entrega imediata da mensagem. O canal de saída primário é o **Clipboard nativo com formatação de alta fidelidade** disparado com <kbd>Ctrl+Enter</kbd>.
2. **Ciclo de Atualização em 1 Clique:** Em momentos de crise, o analista do NOC não deve reescrever formulários. O estado do incidente ativo é mantido em memória e persistido, bastando selecionar o novo status técnico para recalcular o SLA e gerar a nova atualização.
3. **Regra de Ouro da Cadência:** Todo comunicado encerra obrigatoriamente com o **horário do próximo aviso**, sendo rigorosamente despachado mesmo quando não há alterações de status (*"Sem novidade" é uma resposta técnica*).
4. **Ponte para o Monday.com:** O sistema possui adaptador desacoplado (`MondayBridgeAdapter`) para suportar a transição definitiva de documentação corporativa para a API do Monday.com.

---

## 2. Topologia da Arquitetura

O sistema é construído sobre uma arquitetura em camadas desacopladas (*Clean Architecture* simplificada para front-end):

```
┌────────────────────────────────────────────────────────┐
│                   Apresentação (UI)                    │
│   AppShell · ActiveIncidentBanner · LiveWhatsAppPreview│
│   IncidentTimeline · Wizard Steps (1 a 6) · Navbar     │
└───────────────────────────▲────────────────────────────┘
                            │
┌───────────────────────────┴────────────────────────────┐
│               Gerenciamento de Estado                  │
│       useIncidentStore · useTimerStore · useSettings   │
└─────────────▲────────────────────────────▲─────────────┘
              │                            │
┌─────────────┴──────────────┐ ┌───────────┴─────────────┐
│      Motor de Regras       │ │   Serviço de Notificação│
│  slaCalculator · MTTR      │ │   Clipboard · Planilha  │
│  templateCompiler · Checks │ │   MondayBridgeAdapter   │
└─────────────▲──────────────┘ └───────────▲─────────────┘
              │                            │
┌─────────────┴────────────────────────────┴─────────────┐
│                 Persistência de Dados                  │
│       Dexie.js (IndexedDB Local) · Repositories        │
└────────────────────────────────────────────────────────┘
```

### 2.1. Camadas do Sistema

* **UI / Components (`src/components/`):** Componentes atômicos estilizados com Tailwind CSS e Dark Glassmorphism, otimizados para salas de controle e operações em modo noturno contínuo.
* **State Stores (`src/store/`):** Stores globais em Zustand com seletores finos, isolando o rascunho em edição (`draft`), o incidente em andamento (`activeIncident`) e o timer regressivo de SLA.
* **Rules Engine (`src/rules/`):** Lógica pura de domínio sem acoplamento com a interface:
  * `slaCalculator.ts`: Cálculo determinístico do próximo horário limite de despacho baseado na severidade.
  * `durationCalculator.ts`: Cálculo automático do Mean Time to Repair (MTTR).
  * `templateCompiler.ts`: Compilador do texto final estruturado para WhatsApp.
  * `checklistValidator.ts`: Validação de prontidão para despacho com barra percentual.
* **Services & Adapters (`src/services/notifier/`):** Padrão *Strategy* com adaptadores independentes para Clipboard do sistema operacional, linha tabular para planilha (TSV) e adaptador de ponte para Monday.com.
* **Data Access (`src/db/`):** Repositórios Dexie.js encapsulando o banco IndexedDB local.

---

## 3. Matriz de Classificação & Nomenclatura Técnica

Toda a taxonomia do sistema utiliza terminologia formal e técnica da engenharia de redes e telecomunicações:

### 3.1. Severidades e Cadência de SLA

| Nível | Código | Classificação Formal | Cadência Obrigatória | Impacto / Diretriz Operacional |
| :---: | :---: | :--- | :---: | :--- |
| **Crítico** | `SA` | **Incidente de Segurança (DDoS)** | **15 min** | Ataque volumétrico ou de aplicação. Habilita campos de telemetria técnica e mitigação de IP/tráfego. |
| **Crítico** | `S1` | **Indisponibilidade** | **15 min** | Interrupção generalizada de conectividade em município ou POP central. |
| **Alto** | `S2` | **Indisponibilidade Parcial** | **30 min** | Interrupção restrita a anéis, bairros específicos ou rotas secundárias. |
| **Médio** | `S3` | **Instabilidade** | **60 min** | Degradação de desempenho, jitter ou latência sem queda total de enlaces. |
| **Baixo** | `S4` | **Manutenção Programada** | **Início / Fim** | Janela técnica de manutenção homologada previamente. |

### 3.2. Momentos do Comunicado

* `ab` (**Primeiro Aviso**): Disparado em até 10 minutos após a detecção do incidente. Manda-se mesmo com diagnóstico inicial em aberto (*"Causa em triagem técnica"*).
* `at` (**Atualização Periódica**): Enviado rigorosamente no horário prometido pelo SLA. Atualiza o status das equipes e o restabelecimento parcial.
* `nr` (**Normalização**): Disparado após a confirmação do retorno pleno do tráfego e telemetria. Calcula automaticamente o tempo total de indisponibilidade (MTTR).
* `en` (**Relatório de Fechamento**): Relatório técnico consolidado pós-incidente, documentando causa raiz, ações corretivas executadas e melhorias preventivas.

---

## 4. Persistência de Dados & Modelo de Armazenamento

### 4.1. Como os dados são persistidos atualmente (IndexedDB)
A aplicação utiliza o **Dexie.js** para gerenciar um banco de dados **IndexedDB** local no navegador:
* **Tabelas:** `incidents` (incidentes ativos e encerrados), `timeline` (histórico de despachos imutáveis) e `settings` (preferências do operador e histórico de cidades/POPs frequentes).
* **Escopo Local (*Browser Sandbox*):** Os dados residem **exclusivamente no armazenamento local do navegador da máquina onde o sistema está aberto**.

> [!IMPORTANT]
> **Acesso Multi-Dispositivo e Compartilhamento Global:**  
> Como o IndexedDB é uma tecnologia *client-side*, ao hospedar a aplicação estática (ex.: `https://event.iblnet.com.br/`), **cada operador ou usuário que abrir o link em seu próprio computador ou celular terá um banco de dados local isolado**.  
> Para que supervisores, atendentes ou outras máquinas visualizem em tempo real os mesmos incidentes ativos de forma compartilhada, é necessária a sincronização com um repositório centralizado (detalhado abaixo).

### 4.2. Estratégias de Compartilhamento em Tempo Real
1. **Integração com Monday.com (Planejada via `MondayBridgeAdapter`):** O NOC despacha o incidente e o sistema sincroniza os status e timelines com o board corporativo de eventos da IBL via API.
2. **Camada de Nuvem em Tempo Real (Supabase / Firebase):** Substituição ou sincronização bidirecional do IndexedDB com um banco de dados em nuvem com *WebSockets*, refletindo atualizações em tempo real para qualquer pessoa acessando a URL.
3. **API REST Interna:** Backend leve na infraestrutura da IBL servindo os incidentes para a aplicação.

---

## 5. Estrutura de Diretórios

```
├── architecture.archify.json   # Especificação visual da arquitetura (Archify)
├── index.html                  # Ponto de entrada SPA
├── index.legacy.html           # Arquivo legado original de referência
├── package.json
├── tailwind.config.ts          # Tokens e temas Dark Command Center
├── tsconfig.json               # Configuração TypeScript (Strict Mode)
├── vite.config.ts
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── index.css               # Estilos base, background tech grid e animações
    ├── types/                  # Definições de tipos TypeScript estritos
    │   ├── domain.ts           # Modelos de Incident, TimelineEntry, TechnicalDetails
    │   ├── catalog.ts          # Tipos de Severidade, Causas, Momentos e Pacotes
    │   └── notifier.ts         # Contratos para adaptadores de despacho
    ├── constants/              # Constantes e dicionários de termos formais
    │   ├── severities.ts
    │   ├── moments.ts
    │   ├── causes.ts
    │   ├── progress.ts
    │   ├── packages.ts
    │   └── presets.ts
    ├── rules/                  # Lógica de negócio e regras de cálculo
    │   ├── slaCalculator.ts
    │   ├── durationCalculator.ts
    │   ├── checklistValidator.ts
    │   └── templateCompiler.ts
    ├── db/                     # Camada de banco de dados
    │   ├── database.ts         # Configuração e schema do Dexie.js
    │   └── repositories/       # Abstrações de acesso a dados
    │       ├── incidentRepository.ts
    │       ├── timelineRepository.ts
    │       └── settingsRepository.ts
    ├── store/                  # Gerenciamento de estado global
    │   ├── useIncidentStore.ts
    │   ├── useTimerStore.ts
    │   └── useSettingsStore.ts
    ├── services/
    │   └── notifier/           # Implementações de adaptadores de saída
    │       ├── ClipboardAdapter.ts
    │       ├── SpreadsheetAdapter.ts
    │       ├── MondayBridgeAdapter.ts
    │       └── NotifierService.ts
    └── components/             # Interface do usuário (UI)
        ├── ui/                 # Componentes genéricos (Card, Chip, Button)
        ├── layout/             # Shell, Navbar, ReferenceCards, Dock Mobile
        ├── incident/           # Banner ativo, SLA widget, abas de incidentes
        ├── form/               # Etapas e seletores do formulário wizard
        └── preview/            # Live preview do WhatsApp e checklist
```

---

## 6. Guia de Execução & Comandos

### 6.1. Pré-requisitos
* Node.js >= 18.0.0 (Recomendado v20+ ou v22+)
* Gerenciador de pacotes npm, pnpm ou yarn

### 6.2. Instalação e Desenvolvimento
```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento com Hot Module Replacement
npm run dev
```

### 6.3. Compilação para Produção
```bash
# Validação rigorosa de tipagem com TypeScript + Build Vite
npm run build

# Executar preview local dos artefatos estáticos compilados (dist/)
npm run preview
```
