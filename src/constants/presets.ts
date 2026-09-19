export const PRESET_CLIENTS = [
  'Ainda em levantamento',
  'Poucos clientes impactados',
  'Aproximadamente 100 clientes',
  'Aproximadamente 300 clientes',
  'Aproximadamente 500 clientes',
  'Aproximadamente 1.000 clientes',
  'Aproximadamente 2.000 clientes',
  'Aproximadamente 3.000 clientes',
  'Aproximadamente 5.000 clientes',
  'Mais de 5.000 clientes',
] as const;

export const PRESET_PREVISIONS = [
  'Previsão em apuração técnica',
  'Em até 1 hora',
  'Em até 2 horas',
  'Em até 4 horas',
  'Em até 6 horas',
  'Previsão para hoje',
  'Previsão para amanhã',
  'Previsão a ser informada no próximo aviso',
] as const;

export const PRESET_RECOVERED = [
  'Nenhum cliente ainda',
  'Primeiras conexões retornando',
  'Aproximadamente 50% restabelecido',
  'Maior parte dos acessos restabelecida',
  'Praticamente todos os clientes online',
  '100% restabelecido',
] as const;

export const PRESET_WHAT_IS_HAPPENING = [
  'Interrupção generalizada de conectividade nos clientes da região.',
  'Instabilidade de tráfego com perda de pacotes e oscilação de latência.',
  'Clientes corporativos com perda de conectividade; residenciais sem impacto.',
  'Instabilidade pontual em sites e serviços externos específicos.',
  'Indisponibilidade nos sistemas de atendimento e telefonia interna.',
  'Oscilações temporárias decorrentes de manutenção programada na rede.',
] as const;

export const PRESET_ACTIONS = [
  'Engenharia do NOC em telemetria para isolamento do ponto de falha.',
  'Equipe técnica de campo em deslocamento prioritário para o local.',
  'Equipe técnica posicionada no local realizando procedimentos de emenda/reparo.',
  'Manobras lógicas de contingência e desvio de tráfego em execução.',
  'Mitigação e regras de filtragem ativadas junto ao scrubbing center.',
  'Chamado crítico em acompanhamento prioritário com a operadora parceira.',
  'Aguardando normalização do fornecimento de energia pela concessionária.',
] as const;

export const PRESET_WHAT_RETURNED = [
  'Serviços de internet 100% restabelecidos na região.',
  'Conexões normalizadas com tráfego e latência estabilizados.',
  'Janela de manutenção técnica finalizada com sucesso.',
  'Sistemas de atendimento e centrais telefônicas restabelecidos.',
] as const;

export const PRESET_CLIENT_INSTRUCTIONS = [
  'Nenhuma ação necessária. Conexão estabilizada.',
  'Clientes que apresentarem oscilação devem reiniciar o roteador da tomada.',
  'Casos residuais de falta de conexão devem abrir chamado no suporte.',
] as const;

export const PRESET_WHAT_WAS_DONE = [
  'Fusão óptica e substituição de trecho de cabo danificado concluídas.',
  'Substituição física de hardware por sobressalente homologado.',
  'Fornecimento de energia restabelecido pela concessionária no POP.',
  'Mitigação e bloqueio de ataque volumétrico finalizados.',
  'Manobra lógica de rota executada com sucesso.',
] as const;

export const PRESET_FUTURE_CHANGES = [
  'Estudo para implantação de redundância óptica no trecho afetado.',
  'Ampliação da autonomia do banco de baterias no POP da localidade.',
  'Upgrade de capacidade nos concentradores de distribuição.',
  'Revisão de acordos de nível de serviço (SLA) com operadora parceira.',
  'Incidente isolado e tratado; sem alterações estruturais imediatas.',
] as const;

export const PRESET_EXTRA_ORIENTATIONS = [
  'Priorizar restabelecimento de clientes corporativos e órgãos públicos.',
  'Não informar prazos aos clientes além dos divulgados neste comunicado.',
  'Plantonistas devem permanecer atentos aos comunicados no grupo.',
  'Filas de atendimento sobrecarregadas; orientar de forma objetiva.',
] as const;

export const PRESET_CUSTOMER_SCRIPTS = [
  'Identificamos uma interrupção na rede da sua região. Nossas equipes técnicas já estão atuando para restabelecer os serviços o mais breve possível.',
  'Estamos com uma instabilidade técnica temporária na região. A engenharia de rede já está atuando para normalizar o tráfego.',
  'Estamos realizando uma manutenção preventiva planejada na sua região. A conexão retornará tão logo a intervenção seja finalizada.',
  'Os serviços de rede já foram normalizados na sua região. Caso ainda perceba instabilidade, por favor reinicie seu roteador da tomada.',
  'Identificamos uma instabilidade no circuito da operadora de trânsito IP parceira. A normalização já está sendo cobrada em regime de prioridade.',
] as const;

export const PRESET_TECHNICAL_CAUSES = [
  'Rompimento de cabo óptico (Backbone/Acesso)',
  'Interrupção de energia da concessionária',
  'Falha de hardware (Switch/Roteador/OLT)',
  'Falha em circuito upstream / Operadora parceira',
  'Ataque volumétrico distribuído (DDoS)',
  'Manutenção preventiva e melhoria de infraestrutura',
  'Indisponibilidade em servidor / plataforma interna',
  'Falha em nobreak / banco de baterias interno',
  'Erro de roteamento / configuração',
  'Em diagnóstico e triagem técnica pelo NOC',
] as const;
