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
        choiceVal: '', areaVal: '', semVal: '', comision: '', cuatrimestre: '',
        docenteTeorico: '', emailTeorico: '', docentePractico: '', emailPractico: '',
        parcial1: '', parcial2: '', parcial3: ''
      };
      const updated = {
        ...prev,
        [selectedPlan]: {
          ...planState,
          [id]: { ...matState, [field]: value }
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

  // --- ÍCONO DEL PINO DE PUÁN (SVG NATIVO) ---
  const PinoIcon = ({ className = "w-6 h-6 text-white" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L3 14h5l-3 7h14l-3-7h5L12 2z" />
      <path d="M12 14v8" />
    </svg>
  );

  // --- PANTALLA DE ACCESO (CELESTE + PINO) ---
  if (!session) {
    return (
      <div className="min-h-screen bg-sky-950 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-sky-100 space-y-6">
          <div className="text-center space-y-2">
            <div className="bg-sky-600 w-14 h-14 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-sky-900/20">
              <PinoIcon className="w-8 h-8 text-white" />
            </div>
            <span className="text-[10px] uppercase font-black tracking-widest text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
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
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  {loadingCloud && <Loader2 className="w-4 h-4 animate-spin" />}
                  Crear Registro en la Nube
                </button>
                <button
                  onClick={() => setIsRegistering(false)}
                  className="w-full text-slate-500 hover:text-slate-800 text-xs font-semibold py-1"
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
                  className="w-full bg-sky-900 hover:bg-sky-800 text-white font-bold text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  {loadingCloud ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />} 
                  Verificar e Ingresar con mi Correo
                </button>

                <button
                  onClick={() => setIsRegistering(true)}
                  className="w-full bg-sky-50 hover:bg-sky-100 text-sky-900 font-bold text-xs py-3 rounded-xl transition border border-sky-200"
                >
                  Registrarme por Primera Vez
                </button>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-4 text-slate-400 text-[10px] uppercase font-bold">O</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <button
                  onClick={() => setSession({ nombre: 'Invitado', apellido: '', email: 'invitado@uba', tipo: 'invitado' })}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4 text-slate-500" /> Continuar como Invitado (Sin registro)
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
            <div className="bg-sky-600 p-2.5 rounded-xl shadow-inner flex items-center justify-center">
              <PinoIcon className="w-6 h-6 text-white" />
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
              <div className="w-7 h-7 rounded-full bg-sky-600 flex items-center justify-center text-xs font-bold text-white">
                {session.nombre[0]}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white leading-tight">{session.nombre} {session.apellido}</p>
                <p className="text-[10px] text-slate-400">{session.email}</p>
              </div>
              <button onClick={() => setSession(null)} className="text-slate-400 hover:text-sky-400 p-1 transition ml-2" title="Cerrar sesión">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
