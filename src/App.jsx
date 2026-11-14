import React, { useState, useEffect } from 'react';
import { PLANS_DATA } from './data/plans';
import { DonutChart } from './components/DonutChart';
import { BookOpen, Award, GraduationCap, CheckCircle2, Clock, AlertCircle, Bookmark, User, LogOut, Download, Upload, Plus, Trash2, ShieldCheck, Sparkles, FileText } from 'lucide-react';

export default function App() {
  const [selectedPlan, setSelectedPlan] = useState('2023');
  const [selectedOrientation, setSelectedOrientation] = useState('sociocultural');
  const [includeProfesorado, setIncludeProfesorado] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('materias');

  // Catálogo dinámico de seminarios ingresados por el usuario
  const [seminariosOferta, setSeminariosOferta] = useState([
    { id: 'sem-1', tipo: 'sociocultural', nombre: 'Antropología de las emociones y los cuerpos', docente: 'Dr. Guber', cuatrimestre: '1C 2026' },
    { id: 'sem-2', tipo: 'arqueologia', nombre: 'Arqueología pública y patrimonial en los Andes', docente: 'Dra. Endere', cuatrimestre: '1C 2026' }
  ]);
  const [nuevoSeminarioNombre, setNuevoSeminarioNombre] = useState('');
  const [nuevoSeminarioDocente, setNuevoSeminarioDocente] = useState('');
  const [nuevoSeminarioTipo, setNuevoSeminarioTipo] = useState('sociocultural');
  const [showSeminarioModal, setShowSeminarioModal] = useState(false);

  // Estado de materias por plan: { [planId]: { [materiaId]: { estado, nota, aplazos, regimen, choiceVal, areaVal, semVal } } }
  const [studentData, setStudentData] = useState(() => {
    const saved = localStorage.getItem('antropologia_uba_data_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return { '2023': {}, '1985': {} };
  });

  useEffect(() => {
    localStorage.setItem('antropologia_uba_data_v3', JSON.stringify(studentData));
  }, [studentData]);

  const planObj = PLANS_DATA[selectedPlan];
  const orientationObj = planObj.orientaciones[selectedOrientation] || planObj.orientaciones['sociocultural'];

  // Construir lista total de materias del plan actual
  const getMateriasPlan = () => {
    let list = [...planObj.cbc, ...planObj.cfg, ...orientationObj.cfo];
    if (planObj.idiomas) list = [...list, ...planObj.idiomas];
    if (selectedPlan === '2023' && includeProfesorado && selectedOrientation !== 'profesorado') {
      const profObj = planObj.orientaciones['profesorado'];
      if (profObj) list = [...list, ...profObj.cfo];
    }
    return list;
  };

  const currentMaterias = getMateriasPlan();

  // Actualizar campo de una materia
  const handleUpdateMateria = (id, field, value) => {
    setStudentData(prev => {
      const planState = prev[selectedPlan] || {};
      const matState = planState[id] || { estado: 'pendiente', nota: '', aplazos: '0', regimen: 'promocion', choiceVal: '', areaVal: '', semVal: '' };
      return {
        ...prev,
        [selectedPlan]: {
          ...planState,
          [id]: { ...matState, [field]: value }
        }
      };
    });
  };

  // Calcular estadísticas
  const totalMaterias = currentMaterias.length;
  let aprobadasCount = 0;
  let regularizadasCount = 0;
  let cursandoCount = 0;
  let pendientesCount = 0;

  let sumNotas = 0;
  let countNotas = 0;
  let sumHistorico = 0;
  let countHistorico = 0;

  currentMaterias.forEach(m => {
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
        sumHistorico += 2; // Aplazo promedio UBA (1 a 3 -> 2)
        countHistorico++;
      }
    }
  });

  const promedioSinAplazos = countNotas > 0 ? (sumNotas / countNotas).toFixed(2) : '-';
  const promedioConAplazos = countHistorico > 0 ? (sumHistorico / countHistorico).toFixed(2) : '-';

  // Exportar / Importar JSON
  const exportarJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(studentData, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `progreso_antropologia_uba_${selectedPlan}.json`);
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* HEADER INSTITUCIONAL UBA FILO */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-700 p-2.5 rounded-xl shadow-inner flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest text-red-400 font-bold">UBA · FFyL</span>
                <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-full border border-slate-700">Ciencias Antropológicas</span>
              </div>
              <h1 className="text-xl font-black tracking-tight">Gestor Académico y Promedios</h1>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            {user ? (
              <div className="flex items-center gap-3 bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700">
                <img src={user.photo} alt={user.name} className="w-8 h-8 rounded-full border border-slate-600" />
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-white leading-tight">{user.name}</p>
                  <p className="text-[10px] text-slate-400">Sincronizado con Google</p>
                </div>
                <button onClick={() => setUser(null)} className="text-slate-400 hover:text-red-400 p-1 transition" title="Cerrar sesión">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setUser({ name: 'Estudiante Antro UBA', email: 'estudiante@filo.uba.ar', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' })}
                className="flex items-center gap-2 bg-white text-slate-800 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-100 transition border border-slate-200"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.95H1.2v3.15C3.18 21.32 7.28 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.25c-.25-.72-.38-1.49-.38-2.25s.13-1.53.38-2.25V6.6H1.2C.44 8.14 0 9.87 0 12s.44 3.86 1.2 5.4l4.08-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.28 0 3.18 2.68 1.2 6.6l4.08 3.15c.95-2.84 3.6-4.95 6.72-4.95z"/>
                </svg>
                <span>Acceder con Google</span>
              </button>
            )}

            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={exportarJSON}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition"
                title="Exportar progreso"
              >
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

      {/* BARRA DE CONFIGURACIÓN DE PLAN Y TRAYECTORIA */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Plan:</span>
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="bg-slate-100 border border-slate-300 text-slate-800 text-sm font-semibold rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-red-500 outline-none"
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
                className="bg-slate-100 border border-slate-300 text-slate-800 text-sm font-semibold rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-red-500 outline-none"
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
                  className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                />
                <span>Simultaneidad con Profesorado</span>
              </label>
            )}
          </div>

          <button
            onClick={() => setShowSeminarioModal(true)}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-sm transition"
          >
            <Bookmark className="w-3.5 h-3.5" /> Gestionar Oferta Seminarios ({seminariosOferta.length})
          </button>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 pt-6 space-y-6">
        
        {/* PANEL SUPERIOR: PROMEDIOS Y GRÁFICO DE TORKA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* GRÁFICO DE TORTA */}
          <div className="lg:col-span-2">
            <DonutChart
              total={totalMaterias}
              aprobadas={aprobadasCount}
              regularizadas={regularizadasCount}
              cursando={cursandoCount}
              pendientes={pendientesCount}
            />
          </div>

          {/* PROMEDIO PROTAGONISTA */}
          <div className="bg-gradient-to-br from-red-900 to-slate-900 text-white p-6 rounded-2xl shadow-md flex flex-col justify-between border border-red-950">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-widest text-red-300 font-bold flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-red-400" /> Promedio Académico UBA
                </span>
                <span className="bg-red-800/80 text-red-200 text-[10px] px-2.5 py-1 rounded-full font-semibold">
                  {countNotas} materias con nota
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

        {/* LISTADO DE MATERIAS POR ETAPA */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
            <h2 className="text-base font-bold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-red-400" /> Plan de Estudios: {orientationObj.name}
            </h2>
            <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
              {totalMaterias} materias totales en el plan
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {currentMaterias.map((m) => {
              const st = studentData[selectedPlan]?.[m.id] || { estado: 'pendiente', nota: '', aplazos: '0', regimen: 'promocion', choiceVal: '', areaVal: '', semVal: '' };
              
              return (
                <div key={m.id} className="p-4 sm:p-5 hover:bg-slate-50/80 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* INFORMACIÓN DE LA MATERIA */}
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
                    </div>

                    <h3 className="font-bold text-slate-800 text-base">{m.name}</h3>

                    {/* SELECTORES ESPECÍFICOS SEGÚN TIPO DE MATERIA */}
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
                          <option value="Pueblos Indígenas Americanos">Pueblos Indígenas Americanos</option>
                          <option value="Arqueología Americana y Argentina I">Arqueología Americana y Argentina I</option>
                          <option value="Arqueología Argentina">Arqueología Argentina</option>
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

                  {/* CONTROLES DE ESTADO, RÉGIMEN Y NOTAS */}
                  <div className="flex items-center gap-3 flex-wrap justify-end">
                    
                    {/* ESTADO */}
                    <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                      <button
                        onClick={() => handleUpdateMateria(m.id, 'estado', 'pendiente')}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition ${st.estado === 'pendiente' || !st.estado ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                      >
                        Pendiente
                      </button>
                      <button
                        onClick={() => handleUpdateMateria(m.id, 'estado', 'cursando')}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition ${st.estado === 'cursando' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                      >
                        Cursando
                      </button>
                      <button
                        onClick={() => handleUpdateMateria(m.id, 'estado', 'regularizada')}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition ${st.estado === 'regularizada' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                      >
                        Regular
                      </button>
                      <button
                        onClick={() => handleUpdateMateria(m.id, 'estado', 'aprobada')}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition ${st.estado === 'aprobada' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                      >
                        Aprobada
                      </button>
                    </div>

                    {/* RÉGIMEN (Promoción vs Final) SI ESTÁ APROBADA O REGULAR */}
                    {(st.estado === 'aprobada' || st.estado === 'regularizada') && (
                      <select
                        value={st.regimen || 'promocion'}
                        onChange={(e) => handleUpdateMateria(m.id, 'regimen', e.target.value)}
                        className="bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg px-2 py-1.5 outline-none"
                        title="Régimen de aprobación"
                      >
                        <option value="promocion">Promocional</option>
                        <option value="final">Final Obligatorio</option>
                      </select>
                    )}

                    {/* NOTA FINAL SI ESTÁ APROBADA */}
                    {st.estado === 'aprobada' && (
                      <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
                        <span className="text-[10px] font-bold text-emerald-700 uppercase">Nota:</span>
                        <input
                          type="number"
                          min="4"
                          max="10"
                          placeholder="4-10"
                          value={st.nota || ''}
                          onChange={(e) => handleUpdateMateria(m.id, 'nota', e.target.value)}
                          className="w-12 text-center bg-white border border-emerald-300 text-emerald-900 text-xs font-bold rounded-md py-0.5 outline-none"
                        />
                      </div>
                    )}

                    {/* APLAZOS HISTÓRICOS */}
                    <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 px-2 py-1 rounded-xl" title="Cantidad de aplazos previos en esta materia">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Aplazos:</span>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        value={st.aplazos || '0'}
                        onChange={(e) => handleUpdateMateria(m.id, 'aplazos', e.target.value)}
                        className="w-10 text-center bg-white border border-slate-300 text-slate-800 text-xs font-bold rounded-md py-0.5 outline-none"
                      />
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </main>

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
              Agregue aquí los seminarios temáticos que dicta el Departamento este cuatrimestre para poder seleccionarlos directamente en su plan de estudios.
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
                Guardar y Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
