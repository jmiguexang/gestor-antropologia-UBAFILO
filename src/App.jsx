import React, { useState, useEffect } from 'react';
import { PLANS_DATA } from './data/plans';
import { DonutChart } from './components/DonutChart';
import { supabase } from './supabaseClient';
import { 
  BookOpen, Award, AlertCircle, 
  Bookmark, User, LogOut, Trash2, 
  Mail, Users, FileText, CheckSquare, Layers, Loader2
} from 'lucide-react';

export default function App() {
  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem('antropologia_session');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return null;
  });

  const [isRegistering, setIsRegistering] = useState(false);
  const [formNombre, setFormNombre] = useState('');
  const [formApellido, setFormApellido] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [loadingCloud, setLoadingCloud] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState('2023');
  const [selectedOrientation, setSelectedOrientation] = useState('sociocultural');
  const [includeProfesorado, setIncludeProfesorado] = useState(false);
  const [activeBlock, setActiveBlock] = useState('cbc');

  const [activeDetailMateria, setActiveDetailMateria] = useState(null);

  const [seminariosOferta, setSeminariosOferta] = useState([
    { id: 'sem-1', tipo: 'sociocultural', nombre: 'Antropología de las emociones y los cuerpos', docente: 'Dr. Guber', cuatrimestre: '1C 2026' },
    { id: 'sem-2', tipo: 'arqueologia', nombre: 'Arqueología pública y patrimonial en los Andes', docente: 'Dra. Endere', cuatrimestre: '1C 2026' }
  ]);
  const [showSeminarioModal, setShowSeminarioModal] = useState(false);
  const [nuevoSeminarioNombre, setNuevoSeminarioNombre] = useState('');
  const [nuevoSeminarioDocente, setNuevoSeminarioDocente] = useState('');
  const [nuevoSeminarioTipo, setNuevoSeminarioTipo] = useState('sociocultural');

  const [studentData, setStudentData] = useState({ '2023': {}, '1985': {} });

  useEffect(() => {
    if (session && session.tipo === 'registrado') {
      cargarDatosNube(session.email);
    }
  }, [session]);

  const cargarDatosNube = async (email) => {
    setLoadingCloud(true);
    try {
      const { data } = await supabase
        .from('estudiantes')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (data) {
        if (data.datos_academicos) setStudentData(data.datos_academicos);
        if (data.seminarios_oferta && data.seminarios_oferta.length > 0) setSeminariosOferta(data.seminarios_oferta);
        if (data.plan_actual) setSelectedPlan(data.plan_actual);
        if (data.orientacion_actual) setSelectedOrientation(data.orientacion_actual);
      }
    } catch (err) {
      console.error("Error al conectar con Supabase:", err);
    } finally {
      setLoadingCloud(false);
    }
  };

  const guardarDatosNube = async (nuevoData, nuevosSemis = seminariosOferta) => {
    if (session && session.tipo === 'registrado') {
      try {
        await supabase.from('estudiantes').update({
          datos_academicos: nuevoData,
          seminarios_oferta: nuevosSemis,
          plan_actual: selectedPlan,
          orientacion_actual: selectedOrientation,
          actualizado_en: new Date()
        }).eq('email', session.email);
      } catch (err) {
        console.error("Error al guardar en la nube:", err);
      }
    }
  };

  const handleUpdateMateria = (id, field, value) => {
    setStudentData(prev => {
      const planState = prev[selectedPlan] || {};
      const matState = planState[id] || { 
        estado: 'pendiente', nota: '', aplazos: '0', regimen: 'promocion', 
        comision: '', anioCursada: '', cuatrimestreCursada: '',
        docenteTeorico: '', emailTeorico: '', docentePractico: '', emailPractico: '',
        parcial1: '', parcial2: '', parcial3: '', notaFinal: ''
      };

      let updatedMat = { ...matState, [field]: value };

      const updated = {
        ...prev,
        [selectedPlan]: {
          ...planState,
          [id]: updatedMat
        }
      };
      guardarDatosNube(updated);
      return updated;
    });
  };

  useEffect(() => {
    if (session) {
      localStorage.setItem('antropologia_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('antropologia_session');
    }
  }, [session]);

  const planObj = PLANS_DATA[selectedPlan];
  const orientationObj = planObj.orientaciones[selectedOrientation] || planObj.orientaciones['sociocultural'];

  const getBlockMaterias = (block) => {
    switch (block) {
      case 'cbc': return planObj.cbc || [];
      case 'cfg': return planObj.cfg || [];
      case 'cfo': return orientationObj.cfo || [];
      case 'idiomas': return planObj.idiomas || [];
      case 'profesorado':
        const profObj = planObj.orientaciones['profesorado'];
        return profObj ? profObj.cfo : [];
      default: return [];
    }
  };

  const getAllMaterias = () => {
    let list = [...(planObj.cbc || []), ...(planObj.cfg || []), ...(orientationObj.cfo || [])];
    if (planObj.idiomas) list = [...list, ...planObj.idiomas];
    if (selectedPlan === '2023' && includeProfesorado && selectedOrientation !== 'profesorado') {
      const profObj = planObj.orientaciones['profesorado'];
      if (profObj) list = [...list, ...profObj.cfo];
    }
    return list;
  };

  const currentMateriasAll = getAllMaterias();
  const currentBlockMaterias = getBlockMaterias(activeBlock);

  let aprobadasCount = 0;
  let regularizadasCount = 0;
  let cursandoCount = 0;
  let pendientesCount = 0;

  let sumNotas = 0;
  let countNotas = 0;
  let sumHistorico = 0;
  let countHistorico = 0;

  currentMateriasAll.forEach(m => {
    const st = studentData[selectedPlan]?.[m.id] || {};
    const estado = st.estado || 'pendiente';
    const notaNum = st.nota !== '' && !isNaN(st.nota) ? parseFloat(st.nota) : null;
    const aplazosNum = st.aplazos !== '' && !isNaN(st.aplazos) ? parseInt(st.aplazos) : 0;

    if (estado === 'aprobada') {
      aprobadasCount++;
      if (notaNum !== null && notaNum >= 4) {
        sumNotas += notaNum;
        countNotas++;
        sumHistorico += notaNum;
        countHistorico++;
      }
    } else if (estado === 'regularizada') { regularizadasCount++; } 
    else if (estado === 'cursando') { cursandoCount++; } 
    else { pendientesCount++; }

    if (aplazosNum > 0) {
      for (let i = 0; i < aplazosNum; i++) {
        sumHistorico += 2;
        countHistorico++;
      }
    }
  });

  const promedioSinAplazos = countNotas > 0 ? (sumNotas / countNotas).toFixed(2) : '-';
  const promedioConAplazos = countHistorico > 0 ? (sumHistorico / countHistorico).toFixed(2) : '-';

  // --- ICONO DEL PINO DE PUÁN (VECTORIAL LIMPIO Y FORZADO A CELESTE) ---
  const PinoIcon = () => (
    <svg width="32" height="32" viewBox="0 0 512 512" fill="#B3EBF2" style={{ color: '#B3EBF2' }}>
      <path d="M256 32C245.3 32 235.3 38.3 231 48L143 144H191L111 240H167L87 336H167L79 432H224V464H160V496H352V464H288V432H433L345 336H425L345 240H401L321 144H369L281 48C276.7 38.3 266.7 32 256 32Z" />
    </svg>
  );

  // --- PANTALLA DE ACCESO (#B3EBF2 SIN CUADRADO DE FONDO) ---
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#B3EBF2' }}>
        <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-sky-300 space-y-6">
          <div className="text-center space-y-3">
            <div className="mx-auto flex items-center justify-center">
              <PinoIcon />
            </div>
            <span className="text-[10px] uppercase font-black tracking-widest text-sky-900 bg-sky-100 px-3 py-1 rounded-full border border-sky-300">
              UBA · FFyL · El Patio del Pino
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Ciencias Antropológicas</h1>
            <p className="text-xs text-slate-500">Ingrese su correo registrado para acceder a sus datos.</p>
          </div>

          <div className="space-y-4 pt-2">
            {isRegistering ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Nombre</label>
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      value={formNombre}
                      onChange={(e) => setFormNombre(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-sky-600"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Apellido</label>
                    <input
                      type="text"
                      placeholder="Tu apellido"
                      value={formApellido}
                      onChange={(e) => setFormApellido(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-sky-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Correo electrónico</label>
                  <input
                    type="email"
                    placeholder="correo@filo.uba.ar"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-sky-600"
                  />
                </div>
                <button
                  onClick={async () => {
                    if (formNombre.trim() && formApellido.trim() && formEmail.trim()) {
                      setLoadingCloud(true);
                      try {
                        const { data: existente } = await supabase.from('estudiantes').select('*').eq('email', formEmail.trim()).maybeSingle();
                        
                        if (existente) {
                          alert("⚠️ Este correo ya se encuentra registrado. Por favor, utilice la opción de ingresar con su correo.");
                          setLoadingCloud(false);
                          return;
                        }

                        const { error } = await supabase.from('estudiantes').insert([{
                          email: formEmail.trim(),
                          nombre: formNombre.trim(),
                          apellido: formApellido.trim(),
                          datos_academicos: studentData,
                          seminarios_oferta: seminariosOferta
                        }]);

                        if (error) throw error;

                        setSession({ nombre: formNombre.trim(), apellido: formApellido.trim(), email: formEmail.trim(), tipo: 'registrado' });
                      } catch (e) {
                        console.error(e);
                        alert("Hubo un error al registrarse en la base de datos.");
                      } finally {
                        setLoadingCloud(false);
                      }
                    } else {
                      alert("Por favor completa todos los campos.");
                    }
                  }}
                  className="w-full bg-sky-800 hover:bg-sky-900 text-white font-bold text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  {loadingCloud && <Loader2 className="w-4 h-4 animate-spin" />}
                  Crear Registro en la Nube
                </button>
                <button
                  onClick={() => setIsRegistering(false)}
                  className="w-full text-slate-600 hover:text-slate-900 text-xs font-semibold py-1"
                >
                  ← Ya tengo cuenta / Volver
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={async () => {
                    const emailInput = prompt("Ingrese su correo electrónico para verificar acceso:");
                    if (emailInput && emailInput.trim()) {
                      setLoadingCloud(true);
                      try {
                        const { data } = await supabase
                          .from('estudiantes')
                          .select('*')
                          .eq('email', emailInput.trim())
                          .maybeSingle();

                        setLoadingCloud(false);

                        if (data) {
                          setSession({ nombre: data.nombre, apellido: data.apellido, email: data.email, tipo: 'registrado' });
                        } else {
                          alert("❌ Acceso denegado: El correo ingresado no está registrado en el sistema. Debe registrarse previamente para acceder.");
                        }
                      } catch (err) {
                        setLoadingCloud(false);
                        alert("Error de conexión al verificar el correo en la base de datos.");
                      }
                    }
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  {loadingCloud ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />} 
                  Verificar e Ingresar con mi Correo
                </button>

                <button
                  onClick={() => setIsRegistering(true)}
                  className="w-full bg-white hover:bg-sky-50 text-sky-950 font-bold text-xs py-3 rounded-xl transition border border-sky-300 shadow-xs"
                >
                  Registrarme por Primera Vez
                </button>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-sky-300"></div>
                  <span className="flex-shrink mx-4 text-sky-900 text-[10px] uppercase font-bold">O</span>
                  <div className="flex-grow border-t border-sky-300"></div>
                </div>

                <button
                  onClick={() => setSession({ nombre: 'Invitado', apellido: '', email: 'invitado@uba', tipo: 'invitado' })}
                  className="w-full bg-sky-100 hover:bg-sky-200 text-sky-900 border border-sky-300 font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4 text-sky-700" /> Continuar como Invitado (Sin registro)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- INTERFAZ PRINCIPAL ---
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      
      {loadingCloud && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3">
            <Loader2 className="w-6 h-6 text-sky-600 animate-spin" />
            <span className="text-xs font-bold text-slate-800">Verificando en Supabase...</span>
          </div>
        </div>
      )}

      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-[#B3EBF2] flex items-center justify-center">
              <PinoIcon />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-sky-400 font-bold">UBA · FFyL</span>
                <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-full border border-slate-700">
                  {session.tipo === 'registrado' ? 'Verificado en Nube' : 'Modo Invitado'}
                </span>
              </div>
              <h1 className="text-lg font-black tracking-tight">Ciencias Antropológicas</h1>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <div className="flex items-center gap-3 bg-slate-800 px-3.5 py-1.5 rounded-xl border border-slate-700">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-sky-950" style={{ backgroundColor: '#B3EBF2' }}>
                {session.nombre[0]}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white leading-tight">{session.nombre} {session.apellido}</p>
                <p className="text-[10px] text-slate-400">{session.email}</p>
              </div>
              
              <button 
                onClick={() => setSession(null)} 
                className="flex items-center gap-1 bg-red-700/80 hover:bg-red-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg transition ml-2 shadow-sm"
                title="Cerrar sesión y salir del gestor"
              >
                <LogOut className="w-3.5 h-3.5" /> Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Plan:</span>
              <select
                value={selectedPlan}
                onChange={(e) => {
                  setSelectedPlan(e.target.value);
                  guardarDatosNube(studentData);
                }}
                className="bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold rounded-xl px-3 py-1.5 outline-none"
              >
                {Object.entries(PLANS_DATA).map(([key, p]) => (
                  <option key={key} value={key}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Orientación:</span>
              <select
                value={selectedOrientation}
                onChange={(e) => {
                  setSelectedOrientation(e.target.value);
                  guardarDatosNube(studentData);
                }}
                className="bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold rounded-xl px-3 py-1.5 outline-none"
              >
                <option value="sociocultural">Licenciatura - Sociocultural</option>
                <option value="arqueologia">Licenciatura - Arqueología</option>
                {selectedPlan === '2023' && <option value="profesorado">Profesorado en Cs. Antropológicas</option>}
              </select>
            </div>

            {selectedPlan === '2023' && selectedOrientation !== 'profesorado' && (
              <label className="flex items-center gap-2 cursor-pointer bg-sky-50 text-sky-900 px-3 py-1.5 rounded-xl border border-sky-200 text-xs font-bold">
                <input
                  type="checkbox"
                  checked={includeProfesorado}
                  onChange={(e) => setIncludeProfesorado(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500 w-3.5 h-3.5"
                />
                <span>Simultaneidad con Profesorado</span>
              </label>
            )}
          </div>

          <button
            onClick={() => setShowSeminarioModal(true)}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-sm transition"
          >
            <Bookmark className="w-3.5 h-3.5" /> Catálogo Seminarios ({seminariosOferta.length})
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 pt-6 space-y-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DonutChart
              total={currentMateriasAll.length}
              aprobadas={aprobadasCount}
              regularizadas={regularizadasCount}
              cursando={cursandoCount}
              pendientes={pendientesCount}
            />
          </div>

          <div className="bg-gradient-to-br from-sky-900 to-slate-900 text-white p-6 rounded-2xl shadow-md flex flex-col justify-between border border-sky-950">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-widest text-sky-300 font-bold flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-sky-400" /> Promedio Académico UBA
                </span>
                <span className="bg-sky-800/80 text-sky-200 text-[10px] px-2.5 py-1 rounded-full font-semibold">
                  {countNotas} con nota
                </span>
              </div>
              <div className="flex items-baseline gap-2 my-2">
                <span className="text-6xl font-black tracking-tight text-white">{promedioSinAplazos}</span>
                <span className="text-xl font-bold text-sky-300">/ 10</span>
              </div>
              <p className="text-xs text-sky-200/80">Calculado sobre materias aprobadas con nota numérica final (del 4 al 10).</p>
            </div>

            <div className="mt-4 pt-4 border-t border-sky-800/60 flex items-center justify-between text-xs">
              <span className="text-sky-200">Promedio Histórico (con aplazos):</span>
              <span className="font-bold text-white bg-sky-950/80 px-2.5 py-1 rounded-lg border border-sky-800">{promedioConAplazos}</span>
            </div>
          </div>
        </div>

        {/* PESTAÑAS DE BLOQUES DE AVANCE */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
          <button onClick={() => setActiveBlock('cbc')} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${activeBlock === 'cbc' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'}`}>
            <Layers className="w-4 h-4 text-sky-600" /> Ciclo Básico Común (CBC)
          </button>
          <button onClick={() => setActiveBlock('cfg')} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${activeBlock === 'cfg' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'}`}>
            <Layers className="w-4 h-4 text-sky-600" /> {selectedPlan === '1985' ? 'Materias Básicas (CFG)' : 'Ciclo de Formación General (CFG)'}
          </button>
          <button onClick={() => setActiveBlock('cfo')} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${activeBlock === 'cfo' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'}`}>
            <Layers className="w-4 h-4 text-sky-600" /> Ciclo de Formación Orientada (CFO)
          </button>
          <button onClick={() => setActiveBlock('idiomas')} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${activeBlock === 'idiomas' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'}`}>
            <Layers className="w-4 h-4 text-sky-600" /> Idiomas y Requisitos
          </button>
          {selectedPlan === '2023' && (includeProfesorado || selectedOrientation === 'profesorado') && (
            <button onClick={() => setActiveBlock('profesorado')} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${activeBlock === 'profesorado' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'}`}>
              <Layers className="w-4 h-4 text-sky-600" /> Profesorado (CFE)
            </button>
          )}
        </div>

        {/* LISTADO DE MATERIAS DEL BLOQUE */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
            <h2 className="text-base font-bold flex items-center gap-2 uppercase tracking-wide">
              <BookOpen className="w-5 h-5 text-sky-400" /> Bloque: {activeBlock.toUpperCase()}
            </h2>
            <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
              {currentBlockMaterias.length} materias
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {currentBlockMaterias.map((m) => {
              const st = studentData[selectedPlan]?.[m.id] || { 
                estado: 'pendiente', nota: '', aplazos: '0', regimen: 'promocion', 
                comision: '', anioCursada: '', cuatrimestreCursada: '',
                docenteTeorico: '', emailTeorico: '', docentePractico: '', emailPractico: '',
                parcial1: '', parcial2: '', parcial3: '', notaFinal: ''
              };

              const regimenActual = st.regimen || (m.regimen === 'final' ? 'final' : 'promocion');
              const esPromocional = regimenActual === 'promocion';
              
              return (
                <div key={m.id} className="p-4 sm:p-5 hover:bg-slate-50/80 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">{m.etapa}</span>
                      
                      <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${esPromocional ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'}`}>
                        {esPromocional ? '✨ Promocional' : '📝 Final Obligatorio'}
                      </span>

                      {m.correlativa && (
                        <span className="text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-amber-500" /> Req: {m.correlativa}
                        </span>
                      )}
                      {(st.comision || st.anioCursada || st.cuatrimestreCursada) && (
                        <span className="text-[10px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200 font-semibold">
                          {st.cuatrimestreCursada || 'Cursada'} {st.anioCursada || ''} • Com. {st.comision || '-'}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-800 text-base">{m.name}</h3>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap justify-end">
                    <button
                      onClick={() => setActiveDetailMateria(m)}
                      className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-300 transition"
                    >
                      <FileText className="w-3.5 h-3.5 text-sky-600" /> Libreta / Docentes
                    </button>

                    <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                      <button onClick={() => handleUpdateMateria(m.id, 'estado', 'pendiente')} className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${st.estado === 'pendiente' || !st.estado ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>Pend.</button>
                      <button onClick={() => handleUpdateMateria(m.id, 'estado', 'cursando')} className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${st.estado === 'cursando' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-500'}`}>Curs.</button>
                      <button onClick={() => handleUpdateMateria(m.id, 'estado', 'regularizada')} className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${st.estado === 'regularizada' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-500'}`}>Reg.</button>
                      <button onClick={() => handleUpdateMateria(m.id, 'estado', 'aprobada')} className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${st.estado === 'aprobada' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500'}`}>Aprob.</button>
                    </div>

                    {st.estado === 'aprobada' && (
                      <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-xl">
                        <span className="text-[10px] font-bold text-emerald-700 uppercase">Nota:</span>
                        <input
                          type="number" min="4" max="10" placeholder="4-10"
                          value={st.nota || ''}
                          onChange={(e) => handleUpdateMateria(m.id, 'nota', e.target.value)}
                          className="w-10 text-center bg-white border border-emerald-300 text-emerald-900 text-xs font-bold rounded-md py-0.5 outline-none"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 px-2 py-1 rounded-xl" title="Cantidad de aplazos">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Apl:</span>
                      <input
                        type="number" min="0" max="5"
                        value={st.aplazos || '0'}
                        onChange={(e) => handleUpdateMateria(m.id, 'aplazos', e.target.value)}
                        className="w-8 text-center bg-white border border-slate-300 text-slate-800 text-xs font-bold rounded-md py-0.5 outline-none"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* MODAL DETALLES DE CURSADA */}
      {activeDetailMateria && (() => {
        const mat = activeDetailMateria;
        const st = studentData[selectedPlan]?.[mat.id] || {};
        const regimenActual = st.regimen || (mat.regimen === 'final' ? 'final' : 'promocion');
        const esPromocional = regimenActual === 'promocion';

        const calcularPromedioParciales = () => {
          const p1 = parseFloat(st.parcial1);
          const p2 = parseFloat(st.parcial2);
          const p3 = parseFloat(st.parcial3);
          
          const notasValidas = [p1, p2, p3].filter(n => !isNaN(n) && n >= 1);
          if (notasValidas.length > 0) {
            const suma = notasValidas.reduce((a, b) => a + b, 0);
            const promedio = Math.round(suma / notasValidas.length);
            handleUpdateMateria(mat.id, 'nota', promedio.toString());
          }
        };

        return (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="text-base font-black text-slate-900">{mat.name}</h3>
                  <p className="text-[10px] text-slate-500">Configuración de cursada y evaluaciones</p>
                </div>
                <button onClick={() => setActiveDetailMateria(null)} className="text-slate-400 font-bold text-xl">×</button>
              </div>

              {/* SELECTOR DE RÉGIMEN */}
              <div className="space-y-2 bg-sky-50/60 p-4 rounded-xl border border-sky-100">
                <label className="text-xs font-bold uppercase text-sky-900 block">Régimen de la Materia:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateMateria(mat.id, 'regimen', 'promocion')}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition ${esPromocional ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm' : 'bg-white text-slate-700 border-slate-200'}`}
                  >
                    ✨ Promocional
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateMateria(mat.id, 'regimen', 'final')}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition ${!esPromocional ? 'bg-amber-600 text-white border-amber-700 shadow-sm' : 'bg-white text-slate-700 border-slate-200'}`}
                  >
                    📝 Examen Final Obligatorio
                  </button>
                </div>
              </div>

              {/* SECCIÓN DE PERIODO Y COMISIÓN */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5"><Users className="w-4 h-4 text-sky-600" /> Periodo y Cursada</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-600 block mb-1">Año</span>
                    <select
                      value={st.anioCursada || ''}
                      onChange={(e) => handleUpdateMateria(mat.id, 'anioCursada', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                    >
                      <option value="">-- Año --</option>
                      <option value="2026">2026</option>
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                      <option value="2022">2022</option>
                      <option value="2021">2021</option>
                      <option value="2020">2020</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-600 block mb-1">Cuatrimestre</span>
                    <select
                      value={st.cuatrimestreCursada || ''}
                      onChange={(e) => handleUpdateMateria(mat.id, 'cuatrimestreCursada', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                    >
                      <option value="">-- Período --</option>
                      <option value="1° Cuatrimestre">1° Cuatrimestre</option>
                      <option value="2° Cuatrimestre">2° Cuatrimestre</option>
                      <option value="Verano">Verano</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-600 block mb-1">Comisión</span>
                    <select
                      value={st.comision || ''}
                      onChange={(e) => handleUpdateMateria(mat.id, 'comision', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                    >
                      <option value="">-- Com --</option>
                      <option value="1">Com 1</option>
                      <option value="2">Com 2</option>
                      <option value="3">Com 3</option>
                      <option value="4">Com 4</option>
                      <option value="5">Com 5</option>
                      <option value="6">Com 6</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <input type="text" placeholder="Profesor Teórico" value={st.docenteTeorico || ''} onChange={(e) => handleUpdateMateria(mat.id, 'docenteTeorico', e.target.value)} className="bg-white border rounded-lg p-2 text-xs" />
                  <input type="email" placeholder="Correo Teórico" value={st.emailTeorico || ''} onChange={(e) => handleUpdateMateria(mat.id, 'emailTeorico', e.target.value)} className="bg-white border rounded-lg p-2 text-xs" />
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <input type="text" placeholder="Profesor Práctico" value={st.docentePractico || ''} onChange={(e) => handleUpdateMateria(mat.id, 'docentePractico', e.target.value)} className="bg-white border rounded-lg p-2 text-xs" />
                  <input type="email" placeholder="Correo Práctico" value={st.emailPractico || ''} onChange={(e) => handleUpdateMateria(mat.id, 'emailPractico', e.target.value)} className="bg-white border rounded-lg p-2 text-xs" />
                </div>
              </div>

              {/* SECCIÓN DINÁMICA DE PARCIALES / FINAL */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5"><CheckSquare className="w-4 h-4 text-sky-600" /> Evaluaciones y Notas</h4>
                  {esPromocional && (
                    <button 
                      type="button" 
                      onClick={calcularPromedioParciales}
                      className="text-[10px] bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold px-2 py-1 rounded-lg transition"
                    >
                      ⚡ Calcular nota final por promedio
                    </button>
                  )}
                </div>
                
                {esPromocional ? (
                  <div>
                    <p className="text-[10px] text-slate-500 mb-2">Al ser promocional, se habilitan 3 casillas (1° Parcial, 2° Parcial y Recuperador / 3°):</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-slate-600 block mb-1">1er Parcial</span>
                        <input type="text" placeholder="Nota" value={st.parcial1 || ''} onChange={(e) => handleUpdateMateria(mat.id, 'parcial1', e.target.value)} className="w-full bg-white border rounded-lg p-2 text-xs text-center font-bold" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-600 block mb-1">2do Parcial</span>
                        <input type="text" placeholder="Nota" value={st.parcial2 || ''} onChange={(e) => handleUpdateMateria(mat.id, 'parcial2', e.target.value)} className="w-full bg-white border rounded-lg p-2 text-xs text-center font-bold" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-600 block mb-1">Recup / 3ro</span>
                        <input type="text" placeholder="Nota" value={st.parcial3 || ''} onChange={(e) => handleUpdateMateria(mat.id, 'parcial3', e.target.value)} className="w-full bg-white border rounded-lg p-2 text-xs text-center font-bold" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-[10px] text-slate-500">Al ser de final obligatorio, se habilitan 2 casillas para la regularidad y el espacio para la nota del examen final:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] font-bold text
