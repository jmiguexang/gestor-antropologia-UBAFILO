import React, { useState, useEffect } from 'react';
import { PLANS_DATA } from './data/plans';
import { DonutChart } from './components/DonutChart';
import { 
  BookOpen, Award, GraduationCap, CheckCircle2, Clock, AlertCircle, 
  Bookmark, User, LogOut, Download, Upload, Plus, Trash2, Settings, 
  ChevronRight, Mail, Users, FileText, CheckSquare, Layers
} from 'lucide-react';

export default function App() {
  // Estado de Autenticación / Perfil
  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem('antropologia_session');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return null; // null muestra la pantalla de bienvenida/login o invitado
  });

  // Formularios de Registro / Login local
  const [isRegistering, setIsRegistering] = useState(false);
  const [formNombre, setFormNombre] = useState('');
  const [formApellido, setFormApellido] = useState('');
  const [formEmail, setFormEmail] = useState('');

  // Configuración académica
  const [selectedPlan, setSelectedPlan] = useState('2023');
  const [selectedOrientation, setSelectedOrientation] = useState('sociocultural');
  const [includeProfesorado, setIncludeProfesorado] = useState(false);
  const [activeBlock, setActiveBlock] = useState('cbc'); // 'cbc', 'cfg', 'cfo', 'idiomas', 'profesorado'

  // Modal de detalles de cursada (comisiones, docentes, parciales)
  const [activeDetailMateria, setActiveDetailMateria] = useState(null);

  // Catálogo dinámico de seminarios
  const [seminariosOferta, setSeminariosOferta] = useState(() => {
    const saved = localStorage.getItem('antropologia_seminarios');
    return saved ? JSON.parse(saved) : [
      { id: 'sem-1', tipo: 'sociocultural', nombre: 'Antropología de las emociones y los cuerpos', docente: 'Dr. Guber', cuatrimestre: '1C 2026' },
      { id: 'sem-2', tipo: 'arqueologia', nombre: 'Arqueología pública y patrimonial en los Andes', docente: 'Dra. Endere', cuatrimestre: '1C 2026' }
    ];
  });
  const [showSeminarioModal, setShowSeminarioModal] = useState(false);
  const [nuevoSeminarioNombre, setNuevoSeminarioNombre] = useState('');
  const [nuevoSeminarioDocente, setNuevoSeminarioDocente] = useState('');
  const [nuevoSeminarioTipo, setNuevoSeminarioTipo] = useState('sociocultural');

  // Estado central de materias y detalles de cursada
  const [studentData, setStudentData] = useState(() => {
    const saved = localStorage.getItem('antropologia_uba_data_v4');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return { '2023': {}, '1985': {} };
  });

  // Persistencia local automática
  useEffect(() => {
    localStorage.setItem('antropologia_uba_data_v4', JSON.stringify(studentData));
  }, [studentData]);

  useEffect(() => {
    localStorage.setItem('antropologia_seminarios', JSON.stringify(seminariosOferta));
  }, [seminariosOferta]);

  useEffect(() => {
    if (session) {
      localStorage.setItem('antropologia_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('antropologia_session');
    }
  }, [session]);

  const planObj = PLANS_DATA[selectedPlan];
  const orientationObj = planObj.orientaciones[selectedOrientation] || planObj.orientaciones['sociocultural'];

  // Listas de materias separadas por bloque
  const getBlockMaterias = (block) => {
    switch (block) {
      case 'cbc':
        return planObj.cbc || [];
      case 'cfg':
        return planObj.cfg || [];
      case 'cfo':
        return orientationObj.cfo || [];
      case 'idiomas':
        return planObj.idiomas || [];
      case 'profesorado':
        const profObj = planObj.orientaciones['profesorado'];
        return profObj ? profObj.cfo : [];
      default:
        return [];
    }
  };

  // Todas las materias para el cálculo de promedio y torta general
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

  // Actualizar datos de una materia (estado, nota, detalles de cursada, etc.)
  const handleUpdateMateria = (id, field, value) => {
    setStudentData(prev => {
      const planState = prev[selectedPlan] || {};
      const matState = planState[id] || { 
        estado: 'pendiente', nota: '', aplazos: '0', regimen: 'promocion', 
        choiceVal: '', areaVal: '', semVal: '', comision: '', cuatrimestre: '',
        docenteTeorico: '', emailTeorico: '', docentePractico: '', emailPractico: '',
        parcial1: '', parcial2: '', parcial3: ''
      };
      return {
        ...prev,
        [selectedPlan]: {
          ...planState,
          [id]: { ...matState, [field]: value }
        }
      };
    });
  };

  // Cálculo de estadísticas generales
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
    } else if (estado === 'regularizada') {
      regularizadasCount++;
    } else if (estado === 'cursando') {
      cursandoCount++;
    } else {
      pendientesCount++;
    }

    if (aplazosNum > 0) {
      for (let i = 0; i < aplazosNum; i++) {
        sumHistorico += 2;
        countHistorico++;
      }
    }
  });

  const promedioSinAplazos = countNotas > 0 ? (sumNotas / countNotas).toFixed(2) : '-';
  const promedioConAplazos = countHistorico > 0 ? (sumHistorico / countHistorico).toFixed(2) : '-';

  // Exportar / Importar
  const exportarJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(studentData, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `progreso_antropologia_${session ? session.email : 'invitado'}.json`);
    dlAnchorElem.click();
  };

  const importarJSON = (e) => {
    const fileReader = new FileReader();
    if (e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          setStudentData(parsed);
          alert("¡Progreso importado con éxito!");
        } catch (err) {
          alert("Error al leer el archivo JSON.");
        }
      };
    }
  };

  // --- PANTALLA DE ACCESO / REGISTRO ---
  if (!session) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 space-y-6">
          <div className="text-center space-y-2">
            <div className="bg-red-700 w-14 h-14 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-red-900/20">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <span className="text-[10px] uppercase font-black tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
              UBA · FFyL
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Ciencias Antropológicas</h1>
            <p className="text-xs text-slate-500">Gestor académico, libretas de cursada y control de promedios.</p>
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
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Apellido</label>
                    <input
                      type="text"
                      placeholder="Tu apellido"
                      value={formApellido}
                      onChange={(e) => setFormApellido(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-red-500"
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <button
                  onClick={() => {
                    if (formNombre.trim() && formApellido.trim() && formEmail.trim()) {
                      setSession({ nombre: formNombre, apellido: formApellido, email: formEmail, tipo: 'registrado' });
                    } else {
                      alert("Por favor completa todos los campos.");
                    }
                  }}
                  className="w-full bg-red-700 hover:bg-red-800 text-white font-bold text-xs py-3 rounded-xl shadow-md transition"
                >
                  Crear mi Perfil y Comenzar
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
                  onClick={() => {
                    const emailInput = prompt("Ingresa tu correo electrónico registrado:");
                    if (emailInput) {
                      setSession({ nombre: 'Estudiante', apellido: 'UBA', email: emailInput, tipo: 'registrado' });
                    }
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" /> Ingresar con mi Correo
                </button>
                <button
                  onClick={() => setIsRegistering(true)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-3 rounded-xl transition border border-slate-200"
                >
                  Crear una Cuenta Nueva
                </button>
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-4 text-slate-400 text-[10px] uppercase font-bold">O</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>
                <button
                  onClick={() => setSession({ nombre: 'Invitado', apellido: '', email: 'invitado@uba', tipo: 'invitado' })}
                  className="w-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4 text-amber-700" /> Continuar como Invitado (Sin registro)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- INTERFAZ PRINCIPAL DEL GESTOR ---
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      
      {/* HEADER INSTITUCIONAL */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-700 p-2.5 rounded-xl shadow-inner flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-red-400 font-bold">UBA · FFyL</span>
                <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-full border border-slate-700">Antropología</span>
              </div>
              <h1 className="text-lg font-black tracking-tight">Gestor Académico y Libreta</h1>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <div className="flex items-center gap-3 bg-slate-800 px-3.5 py-1.5 rounded-xl border border-slate-700">
              <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-xs font-bold text-white">
                {session.nombre[0]}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white leading-tight">{session.nombre} {session.apellido}</p>
                <p className="text-[10px] text-slate-400">{session.email} {session.tipo === 'invitado' && '(Invitado)'}</p>
              </div>
              <button onClick={() => setSession(null)} className="text-slate-400 hover:text-red-400 p-1 transition ml-2" title="Cerrar sesión">
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button onClick={exportarJSON} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition" title="Exportar progreso">
                <Download className="w-3.5 h-3.5" /> Exportar
              </button>
              <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition cursor-pointer">
                <Upload className="w-3.5 h-3.5" /> Importar
                <input type="file" accept=".json" onChange={importarJSON} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      </header>

      {/* BARRA DE CONFIGURACIÓN DE PLAN Y ORIENTACIÓN */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Plan:</span>
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-red-500 outline-none"
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
                onChange={(e) => setSelectedOrientation(e.target.value)}
                className="bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-red-500 outline-none"
              >
                <option value="sociocultural">Licenciatura - Sociocultural</option>
                <option value="arqueologia">Licenciatura - Arqueología</option>
                {selectedPlan === '2023' && <option value="profesorado">Profesorado en Cs. Antropológicas</option>}
              </select>
            </div>

            {selectedPlan === '2023' && selectedOrientation !== 'profesorado' && (
              <label className="flex items-center gap-2 cursor-pointer bg-red-50 text-red-800 px-3 py-1.5 rounded-xl border border-red-200 text-xs font-bold">
                <input
                  type="checkbox"
                  checked={includeProfesorado}
                  onChange={(e) => setIncludeProfesorado(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500 w-3.5 h-3.5"
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
        
        {/* PANEL SUPERIOR: TORTA Y PROMEDIOS */}
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

          <div className="bg-gradient-to-br from-red-900 to-slate-900 text-white p-6 rounded-2xl shadow-md flex flex-col justify-between border border-red-950">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-widest text-red-300 font-bold flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-red-400" /> Promedio Académico UBA
                </span>
                <span className="bg-red-800/80 text-red-200 text-[10px] px-2.5 py-1 rounded-full font-semibold">
                  {countNotas} con nota
                </span>
              </div>
              <div className="flex items-baseline gap-2 my-2">
                <span className="text-6xl font-black tracking-tight text-white">{promedioSinAplazos}</span>
                <span className="text-xl font-bold text-red-300">/ 10</span>
              </div>
              <p className="text-xs text-red-200/80">Calculado sobre materias aprobadas con nota numérica final (del 4 al 10).</p>
            </div>

            <div className="mt-4 pt-4 border-t border-red-800/60 flex items-center justify-between text-xs">
              <span className="text-red-200">Promedio Histórico (con aplazos):</span>
              <span className="font-bold text-white bg-red-950/80 px-2.5 py-1 rounded-lg border border-red-800">{promedioConAplazos}</span>
            </div>
          </div>
        </div>

        {/* PESTAÑAS DE BLOQUES DE AVANCE */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
          <button
            onClick={() => setActiveBlock('cbc')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${activeBlock === 'cbc' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
          >
            <Layers className="w-4 h-4 text-red-500" /> Ciclo Básico Común (CBC)
          </button>
          <button
            onClick={() => setActiveBlock('cfg')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${activeBlock === 'cfg' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
          >
            <Layers className="w-4 h-4 text-red-500" /> {selectedPlan === '1985' ? 'Materias Básicas (CFG)' : 'Ciclo de Formación General (CFG)'}
          </button>
          <button
            onClick={() => setActiveBlock('cfo')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${activeBlock === 'cfo' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
          >
            <Layers className="w-4 h-4 text-red-500" /> Ciclo de Formación Orientada (CFO)
          </button>
          <button
            onClick={() => setActiveBlock('idiomas')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${activeBlock === 'idiomas' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
          >
            <Layers className="w-4 h-4 text-red-500" /> Idiomas y Requisitos
          </button>
          {selectedPlan === '2023' && (includeProfesorado || selectedOrientation === 'profesorado') && (
            <button
              onClick={() => setActiveBlock('profesorado')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${activeBlock === 'profesorado' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
            >
              <Layers className="w-4 h-4 text-red-500" /> Profesorado (CFE)
            </button>
          )}
        </div>

        {/* LISTADO DE MATERIAS DEL BLOQUE SELECCIONADO */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
            <h2 className="text-base font-bold flex items-center gap-2 uppercase tracking-wide">
              <BookOpen className="w-5 h-5 text-red-400" /> Bloque: {activeBlock.toUpperCase()}
            </h2>
            <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
              {currentBlockMaterias.length} materias en este bloque
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {currentBlockMaterias.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">No hay materias configuradas para este bloque en la orientación actual.</div>
            ) : (
              currentBlockMaterias.map((m) => {
                const st = studentData[selectedPlan]?.[m.id] || { 
                  estado: 'pendiente', nota: '', aplazos: '0', regimen: 'promocion', 
                  choiceVal: '', areaVal: '', semVal: '', comision: '', cuatrimestre: '',
                  docenteTeorico: '', emailTeorico: '', docentePractico: '', emailPractico: '',
                  parcial1: '', parcial2: '', parcial3: ''
                };
                
                return (
                  <div key={m.id} className="p-4 sm:p-5 hover:bg-slate-50/80 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {m.etapa}
                        </span>
                        {m.correlativa && (
                          <span className="text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 text-amber-500" /> Req: {m.correlativa}
                          </span>
                        )}
                        {(st.comision || st.cuatrimestre) && (
                          <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-semibold">
                            {st.cuatrimestre || 'Cursada'} • Com. {st.comision || '-'}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-slate-800 text-base">{m.name}</h3>

                      {/* SELECTORES ESPECÍFICOS */}
                      {m.isChoice && m.options && (
                        <div className="pt-1">
                          <select
                            value={st.choiceVal || ''}
                            onChange={(e) => handleUpdateMateria(m.id, 'choiceVal', e.target.value)}
                            className="bg-slate-100 border border-slate-300 text-slate-800 text-xs font-medium rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-red-500"
                          >
                            <option value="">-- Seleccionar materia cursada --</option>
                            {m.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        </div>
                      )}

                      {m.isLicChoice && (
                        <div className="pt-1">
                          <select
                            value={st.choiceVal || ''}
                            onChange={(e) => handleUpdateMateria(m.id, 'choiceVal', e.target.value)}
                            className="bg-slate-100 border border-slate-300 text-slate-800 text-xs font-medium rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-red-500"
                          >
                            <option value="">-- Seleccionar materia de la Licenciatura --</option>
                            <option value="Sociedades, Culturas y Estados">Sociedades, Culturas y Estados en América Prehispánica y Colonial</option>
                            <option value="Antropología Lingüística">Antropología Lingüística</option>
                            <option value="Procesos Culturales y Folklore">Procesos Culturales, Folklore y Prácticas Subalternas</option>
                            <option value="Teoría Social">Teoría Social</option>
                            <option value="Teorías de la Subjetividad">Teorías de la Subjetividad</option>
                          </select>
                        </div>
                      )}

                      {m.isAreaChoice && (
                        <div className="pt-2 flex flex-col sm:flex-row gap-2">
                          <select
                            value={st.areaVal || ''}
                            onChange={(e) => handleUpdateMateria(m.id, 'areaVal', e.target.value)}
                            className="bg-slate-100 border border-slate-300 text-slate-800 text-xs font-medium rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-red-500"
                          >
                            <option value="">-- Seleccionar Área Temática --</option>
                            {orientationObj.areasTematicas?.map(area => <option key={area} value={area}>{area}</option>)}
                          </select>

                          {st.areaVal && orientationObj.materiasPorArea?.[st.areaVal] && (
                            <select
                              value={st.choiceVal || ''}
                              onChange={(e) => handleUpdateMateria(m.id, 'choiceVal', e.target.value)}
                              className="bg-slate-100 border border-slate-300 text-slate-800 text-xs font-medium rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-red-500"
                            >
                              <option value="">-- Seleccionar Materia del Área --</option>
                              {orientationObj.materiasPorArea[st.areaVal].map(sub => <option key={sub} value={sub}>{sub}</option>)}
                            </select>
                          )}
                        </div>
                      )}

                      {m.isSeminar && (
                        <div className="pt-1">
                          <select
                            value={st.semVal || ''}
                            onChange={(e) => handleUpdateMateria(m.id, 'semVal', e.target.value)}
                            className="bg-slate-100 border border-slate-300 text-slate-800 text-xs font-medium rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-red-500"
                          >
                            <option value="">-- Seleccionar Seminario Ofertado --</option>
                            {seminariosOferta
                              .filter(s => m.seminarType ? s.tipo === m.seminarType : true)
                              .map(sem => <option key={sem.id} value={sem.nombre}>{sem.nombre} ({sem.docente} - {sem.cuatrimestre})</option>)}
                          </select>
                        </div>
                      )}

                      {m.isFreeText && (
                        <div className="pt-1">
                          <input
                            type="text"
                            placeholder="Ingrese nombre de la materia optativa o electiva..."
                            value={st.choiceVal || ''}
                            onChange={(e) => handleUpdateMateria(m.id, 'choiceVal', e.target.value)}
                            className="bg-slate-100 border border-slate-300 text-slate-800 text-xs font-medium rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-red-500 w-full sm:w-80"
                          />
                        </div>
                      )}
                    </div>

                    {/* CONTROLES DE ESTADO, NOTAS Y BOTÓN LIBRETA */}
                    <div className="flex items-center gap-3 flex-wrap justify-end">
                      
                      {/* BOTÓN LIBRETA DE CURSADA (DETALLES Y PARCIALES) */}
                      <button
                        onClick={() => setActiveDetailMateria(m)}
                        className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-300 transition"
                        title="Ver comisión, docentes y parciales"
                      >
                        <FileText className="w-3.5 h-3.5 text-red-600" /> Libreta / Docentes
                      </button>

                      {/* ESTADO */}
                      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                        <button
                          onClick={() => handleUpdateMateria(m.id, 'estado', 'pendiente')}
                          className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${st.estado === 'pendiente' || !st.estado ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                          Pend.
                        </button>
                        <button
                          onClick={() => handleUpdateMateria(m.id, 'estado', 'cursando')}
                          className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${st.estado === 'cursando' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                          Curs.
                        </button>
                        <button
                          onClick={() => handleUpdateMateria(m.id, 'estado', 'regularizada')}
                          className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${st.estado === 'regularizada' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                          Reg.
                        </button>
                        <button
                          onClick={() => handleUpdateMateria(m.id, 'estado', 'aprobada')}
                          className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${st.estado === 'aprobada' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                          Aprob.
                        </button>
                      </div>

                      {/* RÉGIMEN */}
                      {(st.estado === 'aprobada' || st.estado === 'regularizada') && (
                        <select
                          value={st.regimen || 'promocion'}
                          onChange={(e) => handleUpdateMateria(m.id, 'regimen', e.target.value)}
                          className="bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg px-2 py-1.5 outline-none"
                        >
                          <option value="promocion">Promo</option>
                          <option value="final">Final</option>
                        </select>
                      )}

                      {/* NOTA FINAL */}
                      {st.estado === 'aprobada' && (
                        <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-xl">
                          <span className="text-[10px] font-bold text-emerald-700 uppercase">Nota:</span>
                          <input
                            type="number"
                            min="4"
                            max="10"
                            placeholder="4-10"
                            value={st.nota || ''}
                            onChange={(e) => handleUpdateMateria(m.id, 'nota', e.target.value)}
                            className="w-10 text-center bg-white border border-emerald-300 text-emerald-900 text-xs font-bold rounded-md py-0.5 outline-none"
                          />
                        </div>
                      )}

                      {/* APLAZOS */}
                      <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 px-2 py-1 rounded-xl" title="Cantidad de aplazos">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Apl:</span>
                        <input
                          type="number"
                          min="0"
                          max="5"
                          value={st.aplazos || '0'}
                          onChange={(e) => handleUpdateMateria(m.id, 'aplazos', e.target.value)}
                          className="w-8 text-center bg-white border border-slate-300 text-slate-800 text-xs font-bold rounded-md py-0.5 outline-none"
                        />
                      </div>

                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>

      </main>

      {/* MODAL DETALLES DE CURSADA, DOCENTES Y PARCIALES */}
      {activeDetailMateria && (() => {
        const mat = activeDetailMateria;
        const st = studentData[selectedPlan]?.[mat.id] || { 
          comision: '', cuatrimestre: '', docenteTeorico: '', emailTeorico: '', 
          docentePractico: '', emailPractico: '', parcial1: '', parcial2: '', parcial3: '' 
        };

        return (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
              
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <span className="text-[10px] font-black uppercase text-red-600 bg-red-50 px-2 py-0.5 rounded">{mat.etapa}</span>
                  <h3 className="text-base font-black text-slate-900 mt-1">{mat.name}</h3>
                </div>
                <button onClick={() => setActiveDetailMateria(null)} className="text-slate-400 hover:text-slate-700 font-bold text-xl p-1">×</button>
              </div>

              {/* SECCIÓN COMISIÓN Y CUATRIMESTRE */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-red-600" /> Información de Cursada
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Comisión</label>
                    <select
                      value={st.comision || ''}
                      onChange={(e) => handleUpdateMateria(mat.id, 'comision', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-red-500 font-semibold"
                    >
                      <option value="">-- Comisión --</option>
                      <option value="1">Comisión 1</option>
                      <option value="2">Comisión 2</option>
                      <option value="3">Comisión 3</option>
                      <option value="4">Comisión 4</option>
                      <option value="5">Comisión 5</option>
                      <option value="6">Comisión 6</option>
                      <option value="Optativa">Comisión Única</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Cuatrimestre / Año</label>
                    <input
                      type="text"
                      placeholder="ej. 1C 2026"
                      value={st.cuatrimestre || ''}
                      onChange={(e) => handleUpdateMateria(mat.id, 'cuatrimestre', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* SECCIÓN DOCENTES */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-red-600" /> Cuerpo Docente y Contacto
                </h4>
                <div className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Docente Teórico (ej. Dr. García)"
                      value={st.docenteTeorico || ''}
                      onChange={(e) => handleUpdateMateria(mat.id, 'docenteTeorico', e.target.value)}
                      className="bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-800 outline-none"
                    />
                    <input
                      type="email"
                      placeholder="Correo electrónico teórico"
                      value={st.emailTeorico || ''}
                      onChange={(e) => handleUpdateMateria(mat.id, 'emailTeorico', e.target.value)}
                      className="bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-800 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Docente Práctico (JTP / Ayudante)"
                      value={st.docentePractico || ''}
                      onChange={(e) => handleUpdateMateria(mat.id, 'docentePractico', e.target.value)}
                      className="bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-800 outline-none"
                    />
                    <input
                      type="email"
                      placeholder="Correo electrónico práctico"
                      value={st.emailPractico || ''}
                      onChange={(e) => handleUpdateMateria(mat.id, 'emailPractico', e.target.value)}
                      className="bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-800 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECCIÓN PARCIALES */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-red-600" /> Registro de Parciales
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">1er Parcial</label>
                    <input
                      type="text"
                      placeholder="Nota / Estado"
                      value={st.parcial1 || ''}
                      onChange={(e) => handleUpdateMateria(mat.id, 'parcial1', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-800 text-center font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">2do Parcial</label>
                    <input
                      type="text"
                      placeholder="Nota / Estado"
                      value={st.parcial2 || ''}
                      onChange={(e) => handleUpdateMateria(mat.id, 'parcial2', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-800 text-center font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Recup. / 3ro</label>
                    <input
                      type="text"
                      placeholder="Nota / Estado"
                      value={st.parcial3 || ''}
                      onChange={(e) => handleUpdateMateria(mat.id, 'parcial3', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-800 text-center font-bold outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveDetailMateria(null)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow transition"
                >
                  Guardar y Cerrar
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* MODAL GESTOR DE SEMINARIOS */}
      {showSeminarioModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-red-600" /> Catálogo de Oferta de Seminarios
              </h3>
              <button onClick={() => setShowSeminarioModal(false)} className="text-slate-400 hover:text-slate-700 font-bold text-lg">×</button>
            </div>

            <p className="text-xs text-slate-500">
              Agregue aquí los seminarios temáticos que dicta el Departamento para seleccionarlos luego en su plan de estudios.
            </p>

            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold uppercase text-slate-700">Nuevo Seminario</h4>
              <input
                type="text"
                placeholder="Nombre del seminario..."
                value={nuevoSeminarioNombre}
                onChange={(e) => setNuevoSeminarioNombre(e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-800 text-xs rounded-lg p-2 outline-none focus:ring-2 focus:ring-red-500"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Docente / Cátedra..."
                  value={nuevoSeminarioDocente}
                  onChange={(e) => setNuevoSeminarioDocente(e.target.value)}
                  className="bg-white border border-slate-300 text-slate-800 text-xs rounded-lg p-2 outline-none focus:ring-2 focus:ring-red-500"
                />
                <select
                  value={nuevoSeminarioTipo}
                  onChange={(e) => setNuevoSeminarioTipo(e.target.value)}
                  className="bg-white border border-slate-300 text-slate-800 text-xs rounded-lg p-2 outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="sociocultural">Orientación Sociocultural</option>
                  <option value="arqueologia">Orientación Arqueología</option>
                </select>
              </div>
              <button
                onClick={() => {
                  if (nuevoSeminarioNombre.trim()) {
                    setSeminariosOferta([...seminariosOferta, {
                      id: 'sem-' + Date.now(),
                      tipo: nuevoSeminarioTipo,
                      nombre: nuevoSeminarioNombre,
                      docente: nuevoSeminarioDocente || 'Docente a confirmar',
                      cuatrimestre: '1C 2026'
                    }]);
                    setNuevoSeminarioNombre('');
                    setNuevoSeminarioDocente('');
                  }
                }}
                className="w-full bg-red-700 hover:bg-red-800 text-white text-xs font-bold py-2 rounded-lg transition"
              >
                + Añadir al catálogo
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              <h4 className="text-xs font-bold uppercase text-slate-500">Seminarios Disponibles</h4>
              {seminariosOferta.map(s => (
                <div key={s.id} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200 text-xs">
                  <div>
                    <p className="font-bold text-slate-800">{s.nombre}</p>
                    <p className="text-[10px] text-slate-500">{s.docente} • {s.tipo.toUpperCase()}</p>
                  </div>
                  <button
                    onClick={() => setSeminariosOferta(seminariosOferta.filter(item => item.id !== s.id))}
                    className="text-slate-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowSeminarioModal(false)}
                className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
