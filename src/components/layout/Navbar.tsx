import React, { useEffect, useState } from 'react';
import { Activity, Clock } from 'lucide-react';
import { IncidentSwitcher } from '../incident/IncidentSwitcher';

export const Navbar: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-noc-border/80 bg-noc-surface/85 backdrop-blur-xl sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
          {/* Logo e Identificação */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-noc-signal to-teal-400 flex items-center justify-center text-noc-textDark shadow-md shadow-noc-signal/20">
                <Activity className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-noc-signal radar-dot" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                  NOC Dispatcher <span className="text-noc-signal font-normal text-xs sm:text-sm">· Grupo IBL</span>
                </h1>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-noc-surface3 border border-noc-border text-noc-signal">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-noc-textDim hidden sm:block">
                Central de Comunicação de Incidentes & Alinhamento Operacional
              </p>
            </div>
          </div>

          {/* Relógio Operacional em Tempo Real */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center gap-2 bg-noc-surface2/80 border border-noc-border/80 px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-noc-textDim shadow-inner">
              <Clock className="w-3.5 h-3.5 text-noc-signal" />
              <span className="text-noc-text">{currentTime || '--:--:--'}</span>
              <span className="text-[10px] text-noc-textFaint font-sans">BRT</span>
            </div>
          </div>
        </div>

        {/* Abas de Incidentes Concorrentes */}
        <IncidentSwitcher />
      </div>
    </header>
  );
};
