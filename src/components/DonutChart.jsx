import React from 'react';

export function DonutChart({ total, aprobadas, regularizadas, cursando, pendientes }) {
  const safeTotal = Math.max(total, 1);

  // Porcentajes reales sobre el total de materias del plan
  const pctAprobadas = (aprobadas / safeTotal) * 100;
  const pctRegularizadas = (regularizadas / safeTotal) * 100;
  const pctCursando = (cursando / safeTotal) * 100;

  const porcentajePrincipal = Math.round(pctAprobadas);

  // Geometría exacta del círculo SVG
  const size = 200;
  const strokeWidth = 22;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  // Longitudes de cada arco
  const dashAprobadas = (pctAprobadas / 100) * circumference;
  const dashRegularizadas = (pctRegularizadas / 100) * circumference;
  const dashCursando = (pctCursando / 100) * circumference;

  // Desplazamientos (offsets) para apilar cada tramo donde termina el anterior
  const offsetAprobadas = 0;
  const offsetRegularizadas = -dashAprobadas;
  const offsetCursando = -(dashAprobadas + dashRegularizadas);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
      {/* Gráfico de Rosquilla SVG Dinámico */}
      <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90 transform">
          {/* Aro base gris (Pendientes) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
          />

          {/* Tramo 1: Aprobadas (Verde Esmeralda) */}
          {aprobadas > 0 && (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="#10b981"
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashAprobadas} ${circumference}`}
              strokeDashoffset={offsetAprobadas}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.5s ease, stroke-dashoffset 0.5s ease' }}
            />
          )}

          {/* Tramo 2: Regularizadas (Ámbar) */}
          {regularizadas > 0 && (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="#f59e0b"
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashRegularizadas} ${circumference}`}
              strokeDashoffset={offsetRegularizadas}
              style={{ transition: 'stroke-dasharray 0.5s ease, stroke-dashoffset 0.5s ease' }}
            />
          )}

          {/* Tramo 3: Cursando (Celeste Sky) */}
          {cursando > 0 && (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="#0284c7"
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashCursando} ${circumference}`}
              strokeDashoffset={offsetCursando}
              style={{ transition: 'stroke-dasharray 0.5s ease, stroke-dashoffset 0.5s ease' }}
            />
          )}
        </svg>

        {/* Porcentaje central */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-black text-slate-900 tracking-tight">{porcentajePrincipal}%</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Aprobado</span>
        </div>
      </div>

      {/* Desglose numérico por estado */}
      <div className="flex-1 w-full space-y-3">
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Progreso de la Carrera</h3>
          <p className="text-xs text-slate-500">Se actualiza en tiempo real al cambiar el estado de tus materias.</p>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-bold text-emerald-950">Aprobadas</span>
            </div>
            <span className="text-sm font-black text-emerald-700">{aprobadas}</span>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-xs font-bold text-amber-950">Regulares</span>
            </div>
            <span className="text-sm font-black text-amber-700">{regularizadas}</span>
          </div>

          <div className="bg-sky-50 border border-sky-200 p-2.5 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
              <span className="text-xs font-bold text-sky-950">Cursando</span>
            </div>
            <span className="text-sm font-black text-sky-700">{cursando}</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
              <span className="text-xs font-bold text-slate-700">Pendientes</span>
            </div>
            <span className="text-sm font-black text-slate-600">{pendientes}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
