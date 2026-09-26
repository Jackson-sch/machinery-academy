import React, { useState, useEffect } from 'react';
import {
  Gauge,
  Key,
  Shield,
  Volume2,
  AlertTriangle,
  CheckCircle,
  RotateCcw,
  Award,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Flame,
  Lightbulb,
  Radio,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { machineryAudio } from '../utils/machineryAudio';

interface Props {
  initialMachine?: 'excavadora' | 'cargador' | 'retroexcavadora';
}

export default function Simulador({ initialMachine = 'excavadora' }: Props) {
  const [machine, setMachine] = useState<'excavadora' | 'cargador' | 'retroexcavadora'>(initialMachine);

  // Cockpit States
  const [seatbeltFastened, setSeatbeltFastened] = useState(false);
  const [safetyLeverLocked, setSafetyLeverLocked] = useState(true); // Red lock lever
  const [ignitionKey, setIgnitionKey] = useState<'OFF' | 'ACC' | 'START'>('OFF');
  const [engineRunning, setEngineRunning] = useState(false);
  const [rpm, setRpm] = useState(0);
  const [pressurePsi, setPressurePsi] = useState(0);
  const [hornSounded, setHornSounded] = useState(false);
  
  // Mission Tracking
  const [errors, setErrors] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([
    'Sistema de Simulación iniciado. Realice la secuencia de arranque segura.',
  ]);

  // Hydraulic movements
  const [boomAngle, setBoomAngle] = useState(15);
  const [bucketAngle, setBucketAngle] = useState(0);
  const [swingAngle, setSwingAngle] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Engine loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (engineRunning) {
      interval = setInterval(() => {
        setRpm((prev) => {
          const target = safetyLeverLocked ? 850 : 1600;
          return prev < target ? prev + 50 : prev > target ? prev - 30 : target;
        });
        setPressurePsi((prev) => {
          const target = safetyLeverLocked ? 400 : 3800;
          return prev < target ? prev + 150 : prev > target ? prev - 100 : target;
        });
      }, 100);
    } else {
      setRpm(0);
      setPressurePsi(0);
    }
    return () => clearInterval(interval);
  }, [engineRunning, safetyLeverLocked]);

  const addLog = (msg: string, isError = false) => {
    setLogs((prev) => [msg, ...prev.slice(0, 5)]);
    if (isError) {
      setErrors((prev) => [...prev, msg]);
    }
  };

  const handleHorn = () => {
    machineryAudio.playHorn();
    setHornSounded(true);
    addLog('🔊 [BOCINA] 1 toque reglamentario emitido: alerta preventiva a personal de piso.');
  };

  const handleSeatbelt = () => {
    machineryAudio.playSwitch();
    if (!seatbeltFastened) {
      setSeatbeltFastened(true);
      addLog('✓ Cinturón de seguridad de 3 pulgadas abrochado correctamente.');
    } else {
      setSeatbeltFastened(false);
      addLog('⚠️ Cinturón desabrochado.', true);
    }
  };

  const handleSafetyLever = () => {
    machineryAudio.playSwitch();
    if (safetyLeverLocked) {
      if (!engineRunning) {
        addLog('⚠️ Precaución: Liberando palanca de seguridad antes del arranque.', true);
      }
      setSafetyLeverLocked(false);
      addLog('✓ Palanca roja de seguridad hidráulica DESBLOQUEADA. Presión piloto activa.');
    } else {
      setSafetyLeverLocked(true);
      addLog('✓ Palanca de seguridad BLOQUEADA. Mandos hidráulicos aislados.');
    }
  };

  const handleIgnition = () => {
    machineryAudio.playSwitch();
    if (ignitionKey === 'OFF') {
      if (!seatbeltFastened) {
        addLog('❌ FALTA DE SEGURIDAD: Intentó dar contacto sin abrocharse el cinturón.', true);
      }
      setIgnitionKey('ACC');
      addLog('⚡ Contacto en ON (ACC): Autodiagnóstico de testigos y sensores.');
    } else if (ignitionKey === 'ACC') {
      if (!hornSounded) {
        addLog('❌ FALTA GRAVE: Encendió el motor sin alertar con 1 toque de bocina.', true);
      }
      if (!safetyLeverLocked) {
        addLog('❌ FALTA CRÍTICA: La palanca de seguridad debe estar bloqueada para dar arranque.', true);
      }
      machineryAudio.playIgnitionStart();
      setIgnitionKey('START');
      setEngineRunning(true);
      addLog('🚀 Motor Diésel encendido. Ralentí bajo estabilizado.');
    } else {
      // Turn OFF
      setIgnitionKey('OFF');
      setEngineRunning(false);
      setRpm(0);
      setPressurePsi(0);
      addLog('🛑 Motor apagado.');
    }
  };

  // Joystick actions
  const moveBoom = (delta: number) => {
    if (!engineRunning) {
      addLog('⚠️ Motor apagado: Sin presión hidráulica.', true);
      return;
    }
    if (safetyLeverLocked) {
      addLog('⚠️ Mandos bloqueados: Desbloquee la palanca roja de seguridad.', true);
      return;
    }
    machineryAudio.playHydraulic();
    setBoomAngle((prev) => Math.max(0, Math.min(65, prev + delta)));
    addLog(`🕹️ Pluma ajustada a ${Math.round(boomAngle + delta)}°`);
  };

  const moveBucket = (delta: number) => {
    if (!engineRunning || safetyLeverLocked) {
      addLog('⚠️ Sin respuesta hidráulica (verifique motor o palanca de bloqueo).', true);
      return;
    }
    machineryAudio.playHydraulic();
    setBucketAngle((prev) => Math.max(-30, Math.min(50, prev + delta)));
    addLog(`🕹️ Cucharón ajustado a ${Math.round(bucketAngle + delta)}°`);
  };

  const moveSwing = (delta: number) => {
    if (!engineRunning || safetyLeverLocked) {
      addLog('⚠️ Giro inhabilitado (verifique motor o palanca de bloqueo).', true);
      return;
    }
    machineryAudio.playHydraulic();
    setSwingAngle((prev) => prev + delta);
    addLog(`🕹️ Giro de torreta: ${Math.round(swingAngle + delta)}°`);
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          handleHorn();
          break;
        case 'KeyB':
          e.preventDefault();
          handleSeatbelt();
          break;
        case 'KeyL':
          e.preventDefault();
          handleSafetyLever();
          break;
        case 'Enter':
          e.preventDefault();
          handleIgnition();
          break;
        case 'ArrowUp':
          e.preventDefault();
          moveBoom(10);
          break;
        case 'ArrowDown':
          e.preventDefault();
          moveBoom(-10);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          moveSwing(-30);
          break;
        case 'ArrowRight':
          e.preventDefault();
          moveSwing(30);
          break;
        case 'KeyW':
          e.preventDefault();
          moveBucket(15);
          break;
        case 'KeyS':
          e.preventDefault();
          moveBucket(-15);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const finishMission = () => {
    setIsCompleted(true);
    if (errors.length <= 1) {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#38bdf8'],
      });
    }
  };

  const resetSimulator = () => {
    setSeatbeltFastened(false);
    setSafetyLeverLocked(true);
    setIgnitionKey('OFF');
    setEngineRunning(false);
    setRpm(0);
    setPressurePsi(0);
    setHornSounded(false);
    setErrors([]);
    setIsCompleted(false);
    setBoomAngle(15);
    setBucketAngle(0);
    setSwingAngle(0);
    setLogs(['Simulador reiniciado a condiciones pre-arranque.']);
  };

  // Compute what the operator should do next
  const getNextInstruction = () => {
    if (!seatbeltFastened) {
      return { step: '1', text: 'Abrocha tu cinturón de seguridad de 3 pulgadas (botón Cinturón o tecla B).' };
    }
    if (!hornSounded) {
      return { step: '2', text: 'Emite 1 toque reglamentario de bocina para despejar el radio de giro (botón Bocina o Barra Espaciadora).' };
    }
    if (ignitionKey === 'OFF') {
      return { step: '3', text: 'Gira la llave a contacto ON para diagnóstico de testigos (botón Contacto o Enter).' };
    }
    if (!engineRunning) {
      return { step: '4', text: 'Arranca el motor Diésel con la palanca de seguridad bloqueada (botón Arrancar o Enter).' };
    }
    if (safetyLeverLocked) {
      return { step: '5', text: 'Baja la palanca roja de seguridad (Traba OFF o tecla L) para habilitar la presión piloto.' };
    }
    return { step: '6', text: '¡Excelente! El sistema está presurizado. Acciona los joysticks (Flechas y W/S) para mover el equipo.' };
  };

  const nextInstruction = getNextInstruction();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Top Guided Steps Assistant Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black text-xs">
            {nextInstruction.step}
          </div>
          <div>
            <span className="text-[11px] uppercase font-bold text-amber-400 block tracking-wider">
              Guía de Operación Paso a Paso:
            </span>
            <span className="text-xs font-medium text-slate-200">
              {nextInstruction.text}
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 text-[11px] font-mono text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
          <span>⌨️ Atajos:</span>
          <span className="text-amber-400 font-bold">Espacio</span> = Bocina |
          <span className="text-amber-400 font-bold">B</span> = Cinturón |
          <span className="text-amber-400 font-bold">L</span> = Traba |
          <span className="text-amber-400 font-bold">Enter</span> = Llave |
          <span className="text-amber-400 font-bold">Flechas</span> = Mandos
        </div>
      </div>

      {/* Simulator Header */}
      <div className="flex flex-wrap items-center justify-between p-6 bg-slate-950/80 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs uppercase font-mono tracking-wider text-amber-400 font-bold">
              Simulador Interactivo de Cabina
            </span>
          </div>
          <h2 className="text-2xl font-black text-white">
            Puesto de Mando y Secuencia Operacional
          </h2>
        </div>

        {/* Machine Switcher */}
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          {(['excavadora', 'cargador', 'retroexcavadora'] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMachine(m);
                resetSimulator();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                machine === m
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Simulator Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Visual Cockpit / 2D Kinematic Representation */}
        <div className="lg:col-span-7 p-6 bg-slate-950 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 relative min-h-[480px]">
          {/* Machine Graphic & Visual State */}
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className="w-full max-w-md h-64 relative bg-gradient-to-b from-slate-900/60 to-slate-950/90 rounded-2xl border border-slate-800/80 p-4 overflow-hidden flex flex-col items-center justify-center">
              {/* Sky and Ground Horizon */}
              <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/20 to-amber-950/30 pointer-events-none"></div>

              {/* Machine Kinematic Representation */}
              <div
                className="relative z-10 transition-transform duration-300 ease-out flex flex-col items-center"
                style={{ transform: `rotate(${swingAngle * 0.2}deg)` }}
              >
                {/* Upper Machine Body */}
                <div className="w-36 h-20 bg-amber-500 rounded-lg shadow-xl relative border-2 border-amber-400 flex items-center justify-center">
                  <span className="text-[10px] font-black tracking-widest text-slate-950 uppercase">
                    {machine.toUpperCase()}
                  </span>

                  {/* Cab Glass */}
                  <div className="absolute -left-3 top-2 w-10 h-12 bg-sky-400/60 rounded border border-sky-300 backdrop-blur-sm"></div>

                  {/* Boom / Arm Joint */}
                  <div
                    className="absolute right-0 top-3 w-32 h-4 bg-amber-600 origin-left transition-transform duration-300 shadow-md"
                    style={{ transform: `rotate(${-boomAngle}deg)` }}
                  >
                    {/* Bucket Joint */}
                    <div
                      className="absolute right-0 top-0 w-12 h-10 bg-slate-800 origin-top-left rounded-r border border-slate-700 transition-transform duration-300"
                      style={{ transform: `rotate(${bucketAngle}deg)` }}
                    ></div>
                  </div>
                </div>

                {/* Tracks / Wheels Base */}
                <div className="w-44 h-8 bg-slate-800 rounded-md mt-2 border border-slate-700 flex items-center justify-around px-2">
                  <div className="w-4 h-4 rounded-full bg-slate-700 border border-slate-600"></div>
                  <div className="w-4 h-4 rounded-full bg-slate-700 border border-slate-600"></div>
                  <div className="w-4 h-4 rounded-full bg-slate-700 border border-slate-600"></div>
                  <div className="w-4 h-4 rounded-full bg-slate-700 border border-slate-600"></div>
                </div>
              </div>

              {/* Angle Readouts */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <div>Pluma: {Math.round(boomAngle)}°</div>
                <div>Balde: {Math.round(bucketAngle)}°</div>
                <div>Giro: {Math.round(swingAngle)}°</div>
              </div>
            </div>

            {/* Operator Warning HUD */}
            <div className="mt-4 w-full flex items-center justify-between gap-3">
              <div
                className={`flex-1 p-2.5 rounded-xl border text-center transition-all ${
                  safetyLeverLocked
                    ? 'bg-red-950/40 border-red-700/60 text-red-300'
                    : 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300'
                }`}
              >
                <div className="text-[10px] uppercase font-bold">Bloqueo Hidráulico</div>
                <div className="text-xs font-mono font-bold">
                  {safetyLeverLocked ? '🔒 TRABADO (SEGURO)' : '🔓 ACTIVO (ENERGIZADO)'}
                </div>
              </div>

              <div
                className={`flex-1 p-2.5 rounded-xl border text-center transition-all ${
                  seatbeltFastened
                    ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300'
                    : 'bg-amber-950/40 border-amber-700/60 text-amber-300'
                }`}
              >
                <div className="text-[10px] uppercase font-bold">Cinturón Operador</div>
                <div className="text-xs font-mono font-bold">
                  {seatbeltFastened ? '✓ ABROCHADO' : '⚠️ DESABROCHADO'}
                </div>
              </div>
            </div>
          </div>

          {/* Console Activity Log */}
          <div className="mt-4 p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono">
            <div className="text-[10px] font-bold uppercase text-slate-500 mb-1">
              Registro Telemétrico del Sistema:
            </div>
            <div className="space-y-1">
              {logs.map((log, i) => (
                <div
                  key={i}
                  className={`truncate ${
                    log.includes('❌') || log.includes('⚠️')
                      ? 'text-red-400 font-semibold'
                      : log.includes('✓') || log.includes('🚀')
                      ? 'text-emerald-400'
                      : 'text-slate-300'
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Operational Dashboard & Controls */}
        <div className="lg:col-span-5 p-6 bg-slate-900/90 flex flex-col justify-between">
          <div>
            {/* Instrument Cluster (Gauges) */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Tacómetro</div>
                  <div className="text-xl font-mono font-black text-amber-400 mt-0.5">{rpm}</div>
                  <div className="text-[10px] text-slate-500">RPM Motor</div>
                </div>
                <Gauge className={`w-7 h-7 ${engineRunning ? 'text-amber-400 animate-pulse' : 'text-slate-700'}`} />
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Presión Hidráulica</div>
                  <div className="text-xl font-mono font-black text-cyan-400 mt-0.5">{pressurePsi}</div>
                  <div className="text-[10px] text-slate-500">PSI Principal</div>
                </div>
                <Flame className={`w-7 h-7 ${pressurePsi > 1000 ? 'text-cyan-400' : 'text-slate-700'}`} />
              </div>
            </div>

            {/* Pre-Start Safety Panel */}
            <div className="space-y-3 mb-6">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                1. Controles de Seguridad y Arranque
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={handleSeatbelt}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95 ${
                    seatbeltFastened
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-400'
                  }`}
                >
                  <Shield className="w-5 h-5" />
                  <span className="text-[11px] leading-tight">Cinturón (B)</span>
                </button>

                <button
                  type="button"
                  onClick={handleHorn}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95 ${
                    hornSounded
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                      : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-400'
                  }`}
                >
                  <Volume2 className="w-5 h-5" />
                  <span className="text-[11px] leading-tight">Bocina (Espacio)</span>
                </button>

                <button
                  type="button"
                  onClick={handleSafetyLever}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95 ${
                    safetyLeverLocked
                      ? 'bg-red-950/50 border-red-500 text-red-300 font-bold'
                      : 'bg-emerald-950/50 border-emerald-500 text-emerald-300 font-bold'
                  }`}
                >
                  <AlertTriangle className="w-5 h-5" />
                  <span className="text-[11px] leading-tight">
                    {safetyLeverLocked ? 'Traba ON (L)' : 'Traba OFF (L)'}
                  </span>
                </button>
              </div>

              {/* Ignition Switch Button */}
              <button
                type="button"
                onClick={handleIgnition}
                className={`w-full py-3.5 px-4 rounded-xl border flex items-center justify-center gap-2 font-bold text-sm transition-all shadow-lg cursor-pointer active:scale-95 ${
                  engineRunning
                    ? 'bg-red-600 hover:bg-red-500 text-white border-red-500 shadow-red-600/20'
                    : ignitionKey === 'ACC'
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-400 shadow-amber-500/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                <Key className="w-4 h-4" />
                {engineRunning
                  ? 'APAGAR MOTOR (STOP)'
                  : ignitionKey === 'ACC'
                  ? 'GIRAR LLAVE A ARRANQUE (START)'
                  : 'PONER CONTACTO (IGNITION ON)'}
              </button>
            </div>

            {/* Joysticks Hydraulic Controls */}
            <div className="space-y-3 mb-6">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>2. Mandos Hidráulicos (Joysticks)</span>
                <span className="text-[10px] text-slate-500 font-mono">ISO Standard</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Left Joystick: Boom & Swing */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                  <div className="text-[10px] font-bold text-slate-400 mb-2">Pluma (Boom)</div>
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveBoom(-10)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs flex items-center gap-1 cursor-pointer active:scale-95"
                    >
                      <ArrowDown className="w-3.5 h-3.5" /> Bajar (↓)
                    </button>
                    <button
                      type="button"
                      onClick={() => moveBoom(10)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs flex items-center gap-1 cursor-pointer active:scale-95"
                    >
                      <ArrowUp className="w-3.5 h-3.5" /> Subir (↑)
                    </button>
                  </div>
                </div>

                {/* Right Joystick: Bucket & Swing */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                  <div className="text-[10px] font-bold text-slate-400 mb-2">Cucharón (Bucket)</div>
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveBucket(-15)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs flex items-center gap-1 cursor-pointer active:scale-95"
                    >
                      Descargar (S)
                    </button>
                    <button
                      type="button"
                      onClick={() => moveBucket(15)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs flex items-center gap-1 cursor-pointer active:scale-95"
                    >
                      Recoger (W)
                    </button>
                  </div>
                </div>
              </div>

              {/* Cab Swing */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">Giro de Torreta</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => moveSwing(-30)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs flex items-center gap-1 cursor-pointer active:scale-95"
                  >
                    <ArrowLeft className="w-3 h-3" /> Izq (←)
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSwing(30)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs flex items-center gap-1 cursor-pointer active:scale-95"
                  >
                    Der (→) <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Completion Bar */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={resetSimulator}
              className="p-2 text-slate-500 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Reiniciar simulador"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={finishMission}
              disabled={!engineRunning}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                engineRunning
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Award className="w-4 h-4" /> Finalizar y Calificar Maniobra
            </button>
          </div>

          {/* Completion Modal / Card */}
          {isCompleted && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-amber-500/40 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm text-white">Evaluación de Maniobra</span>
              </div>
              <div className="text-xs text-slate-300">
                {errors.length === 0 ? (
                  <span className="text-emerald-400 font-semibold">
                    ¡Impecable! Secuencia de seguridad ejecutada con cero faltas reglamentarias.
                  </span>
                ) : (
                  <span>
                    Has completado la operación con{' '}
                    <strong className="text-amber-400">{errors.length} observaciones</strong> de seguridad.
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
