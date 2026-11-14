import React, { useState, useEffect } from 'react';
import { PLANS_DATA } from './data/plans';
import { DonutChart } from './components/DonutChart';
import { supabase } from './supabaseClient';
import { 
  BookOpen, Award, GraduationCap, AlertCircle, 
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

  // --- PANTALLA DE ACCESO / VERIFICACIÓN ---
  if (!session) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 space-y-6">
          <div className="text-center space-y-2">
            <div className="bg-red-700 w-14 h-14 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-red-900/20">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <span className="text-[10px] uppercase font-black tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
              UBA · FFyL · Verificación Nube
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
                  onClick={async () => {
                    if (formNombre.trim() && formApellido.trim() && formEmail.trim()) {
                      setLoadingCloud(true);
                      try {
                        // Verificamos si el correo ya existe en la base de datos
                        const { data: existente } = await supabase.from('estudiantes').select('*').eq('email', formEmail.trim()).maybeSingle();
                        
                        if (existente) {
                          alert("⚠️ Este correo ya se encuentra registrado. Por favor, utilice la opción de ingresar con su correo.");
                          setLoadingCloud(false);
                          return;
                        }

                        // Si no existe, lo creamos oficialmente
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
                  className="w-full bg-red-700 hover:bg-red-800 text-white font-bold text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  {loadingCloud && <Loader2 className="w-4 h-4 animate-spin" />}
                  Crear Registro en la Nube
                </button>
                <button
                  onClick={() => setIsRegistering(false)}
                  className="w-full text-
