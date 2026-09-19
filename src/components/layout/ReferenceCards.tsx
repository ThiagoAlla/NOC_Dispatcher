import React from 'react';
import { SEVERITIES } from '../../constants/severities';
import { Card } from '../ui/Card';

export const ReferenceCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {/* Tabela de Cadência */}
      <Card
        id="card-cadencia"
        title="Cadência de SLA por Severidade"
        subtitle="Intervalos regimentais para emissão de comunicados obrigatórios"
        defaultCollapsed={true}
      >
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-noc-border text-noc-signal font-mono uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Severidade</th>
                <th className="py-2.5 px-3 text-right">Cadência</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-noc-border/40">
              {SEVERITIES.map((s) => (
                <tr key={s.id} className="hover:bg-noc-surface2/60 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2 font-medium">
                      <span className="text-base">{s.ico}</span>
                      <div>
                        <div className="font-bold text-noc-text">{s.code} — {s.label}</div>
                        <div className="text-[11px] text-noc-textDim line-clamp-1">{s.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-right whitespace-nowrap">
                    <span
                      className="px-2.5 py-1 rounded-md font-mono text-[11px] font-bold"
                      style={{
                        backgroundColor: `${s.colorCss}18`,
                        color: s.colorCss,
                        border: `1px solid ${s.colorCss}35`,
                      }}
                    >
                      {s.cadenceMinutes
                        ? s.cadenceMinutes < 60
                          ? `a cada ${s.cadenceMinutes} min`
                          : `a cada ${s.cadenceMinutes / 60}h`
                        : 'início e término'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Como funciona */}
      <Card
        id="card-ajuda"
        title="Ciclo de Vida do Incidente"
        subtitle="Critérios de despacho e responsabilidades em cada etapa"
        defaultCollapsed={true}
      >
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-noc-border text-noc-signal font-mono uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Etapa Operacional</th>
                <th className="py-2.5 px-3">Diretriz de Disparo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-noc-border/40">
              <tr className="hover:bg-noc-surface2/60 transition-colors">
                <td className="py-2.5 px-3 font-bold text-noc-text whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-noc-red" />
                    <span>Primeiro Aviso</span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-noc-textDim leading-relaxed">
                  Em até <b>10 minutos</b> após a detecção. Mande mesmo sem causa identificada — “em triagem técnica” é a postura correta.
                </td>
              </tr>
              <tr className="hover:bg-noc-surface2/60 transition-colors">
                <td className="py-2.5 px-3 font-bold text-noc-text whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-noc-amber" />
                    <span>Atualização</span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-noc-textDim leading-relaxed">
                  Rigidamente no horário prometido no comunicado anterior. Mesmo sem alterações de status, reforce a continuidade dos trabalhos.
                </td>
              </tr>
              <tr className="hover:bg-noc-surface2/60 transition-colors">
                <td className="py-2.5 px-3 font-bold text-noc-text whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-noc-signal" />
                    <span>Normalização</span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-noc-textDim leading-relaxed">
                  Após confirmação dos testes de telemetria e estabilidade de tráfego, nunca por sensação prévia.
                </td>
              </tr>
              <tr className="hover:bg-noc-surface2/60 transition-colors">
                <td className="py-2.5 px-3 font-bold text-noc-text whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-noc-purple" />
                    <span>Relatório Final</span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-noc-textDim leading-relaxed">
                  Pós-incidente consolidado no dia seguinte com causa raiz, ações corretivas executadas e melhorias estruturais.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
