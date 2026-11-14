import React from 'react';

export function DonutChart({ total, aprobadas, regularizadas, cursando, pendientes }) {
  const radius = 65;
  const circumference = 2 * Math.PI * radius;

  const pAprobadas = total > 0 ? (aprobadas / total) : 0;
  const pRegularizadas = total > 0 ? (regularizadas / total) : 0;
  const pCursando = total > 0 ? (cursando / total) : 0;

  const dashAprobadas = pAprobadas * circumference;
  const dashRegularizadas = pRegularizadas * circumference;
  const dashCursando = pCursando * circumference;

  const offsetRegularizadas = -dashAprobadas;
  const offsetCursando = offsetRegularizadas - dashRegularizadas;

  const porcentajeAvance = total > 0 ? Math.round(((aprobadas + regularizadas * 0.5) / total) * 100) : 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          <circle
            cx="80" cy="80" r={radius}
            className="text-slate-100"
            strokeWidth="20"
            stroke="currentColor"
            fill="transparent"
          />
          {aprobadas > 0 && (
            <circle
              cx="80" cy="80" r={radius}
              className="text-emerald-500 transition-all duration-700 ease-out"
              strokeWidth="20"
              strokeDasharray={`${dashAprobadas} ${circumference}`}
              strokeDashoffset="0"
              strokeLinecap="round"
              fill="transparent"
            />
          )}
          {regularizadas > 0 && (
            <circle
              cx="80" cy="80" r={radius}
              className="text-amber-500 transition-all duration-700 ease-out"
              strokeWidth="20"
              strokeDasharray={`${dashRegularizadas} ${circumference}`}
              strokeDashoffset={offsetRegularizadas}
              strokeLinecap="round"
              fill="transparent"
            />
          )}
          {cursando > 0 && (
            <circle
              cx="80" cy="80" r={radius}
              className="text-blue-500 transition-all duration-700 ease-out"
              strokeWidth="20"
              strokeDasharray={`${dashCursando} ${circumference}`}
              strokeDashoffset={offsetCursando}
              strokeLinecap="round"
              fill="transparent"
            />
          )}
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-black text-slate-800 tracking-tight">{porcentajeAvance}%</span>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Avance</span>
        </div>
      </div>

      <div className="flex-1 w-full grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2.5 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/60">
          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
          <div>
            <p className="text-xs font-medium text-slate-500">Aprobadas</p>
            <p className="font-bold text-slate-800 text-base">{aprobadas} <span className="text-xs text-slate-400 font-normal">/ {total}</span></p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100/60">
          <span className="w-3.5 h-3.5 rounded-full bg-amber-500 flex-shrink-0"></span>
          <div>
            <p className="text-xs font-medium text-slate-500">Regularizadas</p>
            <p className="font-bold text-slate-800 text-base">{regularizadas}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100/60">
          <span className="w-3.5 h-3.5 rounded-full bg-blue-500 flex-shrink-0"></span>
          <div>
            <p className="text-xs font-medium text-slate-500">Cursando</p>
            <p className="font-bold text-slate-800 text-base">{cursando}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
          <span className="w-3.5 h-3.5 rounded-full bg-slate-300 flex-shrink-0"></span>
          <div>
            <p className="text-xs font-medium text-slate-500">Pendientes</p>
            <p className="font-bold text-slate-800 text-base">{pendientes}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
