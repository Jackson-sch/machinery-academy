import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, AlertTriangle, ShieldCheck, RotateCcw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ChecklistItem {
  id: string;
  tarea: string;
  criterio: string;
  esCritico: boolean;
}

interface ChecklistCategory {
  categoria: string;
  items: ChecklistItem[];
}

interface Props {
  machineId: string;
  machineTitle: string;
  checklist: ChecklistCategory[];
}

export default function ChecklistMantenimiento({ machineId, machineTitle, checklist }: Props) {
  const storageKey = `machinery_checklist_${machineId}`;
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [hasCelebrated, setHasCelebrated] = useState(false);

  // Load saved state
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setCheckedItems(JSON.parse(saved));
      }
    } catch {
      // fallback
    }
  }, [storageKey]);

  // Save state
  const toggleItem = (itemId: string) => {
    const updated = {
      ...checkedItems,
      [itemId]: !checkedItems[itemId],
    };
    setCheckedItems(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const resetChecklist = () => {
    if (confirm('¿Deseas reiniciar la inspección pre-operacional a cero?')) {
      setCheckedItems({});
      setHasCelebrated(false);
      try {
        localStorage.removeItem(storageKey);
      } catch {
        // ignore
      }
    }
  };

  // Calculation
  const allItems = checklist.flatMap((c) => c.items);
  const totalCount = allItems.length;
  const completedCount = allItems.filter((i) => checkedItems[i.id]).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  const criticalItems = allItems.filter((i) => i.esCritico);
  const criticalCompleted = criticalItems.filter((i) => checkedItems[i.id]).length;
  const allCriticalDone = criticalCompleted === criticalItems.length;

  useEffect(() => {
    if (progressPercent === 100 && !hasCelebrated) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#3b82f6', '#facc15'],
      });
      setHasCelebrated(true);
    }
  }, [progressPercent, hasCelebrated]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 tracking-wider uppercase">
              Protocolo Diario
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: {machineId}</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-wide">
            Checklist de Inspección Técnica Pre-Uso
          </h3>
          <p className="text-sm text-slate-400">
            Comprobación visual y funcional obligatoria antes de encender el motor de {machineTitle}.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={resetChecklist}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            title="Reiniciar lista de verificación"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reiniciar
          </button>
        </div>
      </div>

      {/* Progress metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Progreso General</div>
            <div className="text-2xl font-black text-amber-400 mt-0.5">
              {progressPercent}%
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {completedCount} de {totalCount} verificados
            </div>
          </div>
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                className="text-slate-800"
                fill="transparent"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                className="text-amber-500 transition-all duration-500 ease-out"
                fill="transparent"
                strokeDasharray="125.6"
                strokeDashoffset={125.6 - (125.6 * progressPercent) / 100}
              />
            </svg>
            <span className="absolute text-[10px] font-bold text-white">{progressPercent}%</span>
          </div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-400 font-medium">Puntos Críticos de Vida</div>
            <AlertTriangle className={`w-4 h-4 ${allCriticalDone ? 'text-emerald-400' : 'text-amber-500 animate-pulse'}`} />
          </div>
          <div className="text-2xl font-black text-white mt-0.5">
            {criticalCompleted} <span className="text-slate-500 text-lg font-normal">/ {criticalItems.length}</span>
          </div>
          <div className={`text-xs mt-0.5 ${allCriticalDone ? 'text-emerald-400' : 'text-amber-400'}`}>
            {allCriticalDone ? '✓ Todos los críticos aprobados' : 'Atención: Puntos críticos pendientes'}
          </div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Estado para Operación</div>
            <div className="flex items-center gap-2 mt-1">
              {progressPercent === 100 ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" /> APTO PARA OPERAR
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <AlertTriangle className="w-3.5 h-3.5" /> INSPECCIÓN EN CURSO
                </span>
              )}
            </div>
          </div>
          {progressPercent === 100 && (
            <Award className="w-8 h-8 text-amber-400 animate-bounce" />
          )}
        </div>
      </div>

      {/* Checklist Sections */}
      <div className="space-y-6">
        {checklist.map((categoria, idx) => (
          <div key={idx} className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-5">
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400/90 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              {categoria.categoria}
            </h4>

            <div className="space-y-3">
              {categoria.items.map((item) => {
                const isChecked = !!checkedItems[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`flex items-start gap-3.5 p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <button
                      type="button"
                      className="mt-0.5 text-slate-400 hover:text-white transition-colors focus:outline-none"
                    >
                      {isChecked ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-600 hover:text-amber-400" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm font-semibold ${isChecked ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                          {item.tarea}
                        </span>
                        {item.esCritico && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950/80 text-red-400 border border-red-800/60 tracking-wider">
                            CRÍTICO
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        <span className="text-slate-500 font-medium">Criterio de aprobación:</span> {item.criterio}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
