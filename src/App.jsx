import React, { useState, useEffect, useRef } from 'react';
import { PLANS_DATA } from './data/plans';
import { DonutChart } from './components/DonutChart';
import { supabase } from './supabaseClient';
import { 
  BookOpen, Award, AlertCircle, 
  Bookmark, User, LogOut, Trash2, 
  Mail, Users, FileText, CheckSquare, Layers, Loader2,
  Share2, Download, RefreshCw, Sparkles
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

  // Estados para Compartir Historia
  const [showShareModal, setShowShareModal] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const canvasRef = useRef(null);

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
        parcial1: '', parcial2: '', parcial3: '', notaFinal: '', customName: ''
      };

      let updatedMat = { ...matState, [field]: value };

      if (['parcial1', 'parcial2', 'parcial3', 'notaFinal', 'regimen'].includes(field)) {
        const reg = field === 'regimen' ? value : (updatedMat.regimen || 'promocion');
        const p1 = parseFloat(updatedMat.parcial1);
        const p2 = parseFloat(updatedMat.parcial2);
        const p3 = parseFloat(updatedMat.parcial3);
        const nFinal = parseFloat(updatedMat.notaFinal);

        if (reg === 'promocion') {
          const validas = [p1, p2, p3].filter(n => !isNaN(n) && n >= 1);
          if (validas.length > 0) {
            const promParciales = validas.reduce((a, b) => a + b, 0) / validas.length;
            if (promParciales >= 7 && isNaN(nFinal)) {
              updatedMat.nota = Math.round(promParciales).toString();
            } else if (!isNaN(nFinal)) {
              const notaFinalCalculada = Math.round((promParciales + nFinal) / 2);
              updatedMat.nota = notaFinalCalculada.toString();
            } else {
              updatedMat.nota = Math.round(promParciales).toString();
            }
          }
        } else {
          const notasReg = [p1, p2].filter(n => !isNaN(n) && n >= 1);
          if (notasReg.length > 0) {
            const promReg = notasReg.reduce((a, b) => a + b, 0) / notasReg.length;
            if (!isNaN(nFinal)) {
              const notaFinalCalculada = Math.round((promReg + nFinal) / 2);
              updatedMat.nota = notaFinalCalculada.toString();
            } else {
              updatedMat.nota = Math.round(promReg).toString();
            }
          }
        }
      }

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
      case 'electivas': return orientationObj.electivas || planObj.electivas || [];
      case 'profesorado':
        const profObj = planObj.orientaciones['profesorado'];
        return profObj ? profObj.cfo : [];
      default: return [];
    }
  };

  const getAllMaterias = () => {
    let list = [...(planObj.cbc || []), ...(planObj.cfg || []), ...(orientationObj.cfo || [])];
    if (planObj.idiomas) list = [...list, ...planObj.idiomas];
    const electivasList = orientationObj.electivas || planObj.electivas || [];
    if (electivasList) list = [...list, ...electivasList];
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
  const totalMaterias = currentMateriasAll.length;
  const porcentajeAvance = totalMaterias > 0 ? Math.round((aprobadasCount / totalMaterias) * 100) : 0;

  // Frases dinámicas según porcentaje de avance
  const getMotivationalQuotes = (pct) => {
    if (pct >= 100) {
      return [
        `¡100% completado! Oficialmente en la recta final hacia el título de Antropología 🎓✨`,
        `Todo el esfuerzo valió la pena: 100% de la carrera adentro. ¡A celebrar! 🥂🌿`,
        `De Puan al mundo: 100% de materias aprobadas. ¡Lo lograste! 🚀📚`
      ];
    }
    if (pct >= 70) {
      return [
        `Ya estás al ${pct}% de tu carrera. Falta poco, sigue así, ¡vamos que tú puedes! 🔥🎓`,
        `¡${pct}% adentro! Ya se ve la meta en Puan, el último tirón es tuyo 💪✨`,
        `Con el ${pct}% de la carrera aprobada, cada vez falta menos para la tesis 📖🚀`
      ];
    }
    if (pct >= 40) {
      return [
        `¡Ya pasaste la mitad del camino (${pct}%)! Seguí metiéndole que vas increíble 🚀📚`,
        `Al ${pct}% de Ciencias Antropológicas. Paso a paso construyendo el recorrido 🌿✨`,
        `¡${pct}% completado! Cada final y cada parcial suma. ¡A no aflojar! 💪🔥`
      ];
    }
    return [
      `Arrancando el camino en Antropología: ya llevás el ${pct}% de la carrera 🌱📚`,
      `Todo gran recorrido empieza con los primeros pasos: ${pct}% completado ✨🚀`,
      `¡Vamos por más! ${pct}% de la carrera adentro en Filo UBA 💪🎓`
    ];
  };

  const quotesList = getMotivationalQuotes(porcentajeAvance);
  const currentQuote = quotesList[quoteIndex % quotesList.length];

  // Dibujar tarjeta vertical (1080x1920) en el Canvas
  useEffect(() => {
    if (!showShareModal || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const W = 1080;
    const H = 1920;

    // 1. Fondo degradado oscuro elegante
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(0.5, '#0c4a6e');
    bgGrad.addColorStop(1, '#020617');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // 2. Detalles decorativos sutiles
    ctx.strokeStyle = 'rgba(179, 235, 242, 0.12)';
    ctx.lineWidth = 3;
    ctx.strokeRect(60, 60, W - 120, H - 120);

    // 3. Encabezado institucional
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 34px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('UBA · FFyL', W / 2, 180);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 64px sans-serif';
    ctx.fillText('Ciencias Antropológicas', W / 2, 265);

    const orientLabel = selectedOrientation === 'sociocultural' 
      ? 'Orientación Sociocultural' 
      : selectedOrientation === 'arqueologia' 
        ? 'Orientación Arqueología' 
        : 'Profesorado';
    ctx.fillStyle = '#bae6fd';
    ctx.font = '600 36px sans-serif';
    ctx.fillText(`Plan ${selectedPlan} · ${orientLabel}`, W / 2, 330);

    // 4. Gráfico de Torta (Donut Chart)
    const cx = W / 2;
    const cy = 760;
    const radius = 270;
    const lineWidth = 75;

    // Aro base (pendientes)
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    const total = Math.max(totalMaterias, 1);
    const aprobAngle = (aprobadasCount / total) * Math.PI * 2;
    const regAngle = (regularizadasCount / total) * Math.PI * 2;
    const cursAngle = (cursandoCount / total) * Math.PI * 2;

    let startAngle = -Math.PI / 2;

    // Segmento Aprobadas (Esmeralda)
    if (aprobadasCount > 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, startAngle + aprobAngle);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.stroke();
      startAngle += aprobAngle;
    }

    // Segmento Regularizadas (Ámbar)
    if (regularizadasCount > 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, startAngle + regAngle);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = lineWidth;
      ctx.stroke();
      startAngle += regAngle;
    }

    // Segmento Cursando (Celeste)
    if (cursandoCount > 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, startAngle + cursAngle);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }

    // Texto central en la torta
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 130px sans-serif';
    ctx.fillText(`${porcentajeAvance}%`, cx, cy + 35);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('COMPLETADO', cx, cy + 90);

    // 5. Leyenda compacta
    const legendY = 1130;
    ctx.font = 'bold 30px sans-serif';
    ctx.fillStyle = '#10b981';
    ctx.fillText(`● Aprobadas: ${aprobadasCount}`, W / 2 - 230, legendY);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText(`● Regulares: ${regularizadasCount}`, W / 2 + 230, legendY);

    // 6. Tarjeta de Métricas (Materias y Promedio)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.roundRect(120, 1200, W - 240, 190, 32);
    ctx.fill();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('MATERIAS APROBADAS', W / 2 - 210, 1265);
    ctx.fillText('PROMEDIO UBA', W / 2 + 210, 1265);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 64px sans-serif';
    ctx.fillText(`${aprobadasCount} / ${totalMaterias}`, W / 2 - 210, 1345);
    ctx.fillText(`${promedioSinAplazos}`, W / 2 + 210, 1345);

    // 7. Frase Motivacional (con salto de línea automático)
    ctx.fillStyle = '#B3EBF2';
    ctx.font = 'bold 42px sans-serif';
    const words = currentQuote.split(' ');
    let line = '';
    let yText = 1510;
    const maxWidth = W - 220;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line.trim(), W / 2, yText);
        line = words[i] + ' ';
        yText += 58;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), W / 2, yText);

    // 8. Pie de firma
    ctx.fillStyle = '#64748b';
    ctx.font = '600 28px sans-serif';
    const userDisplay = session?.nombre && session.nombre !== 'Invitado' 
      ? `${session.nombre} ${session.apellido}` 
      : 'Estudiante de Antropología';
    ctx.fillText(`${userDisplay} · gestorantropologia.uba`, W / 2, 1800);

  }, [showShareModal, quoteIndex, porcentajeAvance, aprobadasCount, regularizadasCount, cursandoCount, totalMaterias, promedioSinAplazos, selectedPlan, selectedOrientation, session, currentQuote]);

  const handleDownloadStory = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `avance-antropologia-${porcentajeAvance}pct.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handleNativeShare = async () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `avance-antropologia-${porcentajeAvance}pct.png`, { type: 'image/png' });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'Mi avance en Ciencias Antropológicas - UBA',
            text: currentQuote
          });
        } catch (err) {
          console.log('Compartir cancelado o no disponible:', err);
        }
      } else {
        handleDownloadStory();
      }
    }, 'image/png');
  };

  const PinoIcon = () => (
    <svg width="36" height="36" viewBox="0 0 512 512" fill="#0f172a">
      <path d="M256 32C245.3 32 235.3 38.3 231 48L143 144H191L111 240H167L87 336H167L79 432H224V464H160V496H352V464H288V432H433L345 336H425L345 240H401L321 144H369L281 48C276.7 38.3 266.7 32 256 32Z" />
    </svg>
  );

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
            <div className="flex items-center justify-center">
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

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-sm transition"
            >
              <Share2 className="w-3.5 h-3.5" /> Compartir Historia ({porcentajeAvance}%)
            </button>

            <button
              onClick={() => setShowSeminarioModal(true)}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-sm transition"
            >
              <Bookmark className="w-3.5 h-3.5" /> Catálogo Seminarios ({seminariosOferta.length})
            </button>
          </div>
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

            <div className="mt-4 pt-4 border-t border-sky-800/60 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-sky-200">Promedio Histórico (con aplazos):</span>
                <span className="font-bold text-white bg-sky-950/80 px-2.5 py-1 rounded-lg border border-sky-800">{promedioConAplazos}</span>
              </div>
              <button
                onClick={() => setShowShareModal(true)}
                className="w-full bg-white/10 hover:bg-white/20 text-sky-100 border border-sky-400/30 text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-sky-300" /> Generar Tarjeta para IG / WhatsApp
              </button>
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
          <button onClick={() => setActiveBlock('electivas')} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${activeBlock === 'electivas' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'}`}>
            <Layers className="w-4 h-4 text-sky-600" /> Electivas / Seminarios
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
                parcial1: '', parcial2: '', parcial3: '', notaFinal: '', customName: ''
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
                    
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-slate-800 text-base">
                        {st.customName ? `${m.name}: ${st.customName}` : m.name}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap justify-end">
                    <button
                      onClick={() => setActiveDetailMateria(m)}
                      className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-300 transition"
                    >
                      <FileText className="w-3.5 h-3.5 text-sky-600" /> Libreta / Elegir Opción
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

      {/* MODAL COMPARTIR HISTORIA IG / WHATSAPP */}
      {showShareModal && (
        <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4 max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-600" /> Historia de Avance
                </h3>
                <p className="text-[11px] text-slate-500">Formato vertical listo para Instagram o WhatsApp</p>
              </div>
              <button onClick={() => setShowShareModal(false)} className="text-slate-400 hover:text-slate-700 font-bold text-xl">×</button>
            </div>

            {/* Vista previa del Canvas escalada */}
            <div className="flex justify-center bg-slate-100 p-3 rounded-2xl border border-slate-200">
              <canvas
                ref={canvasRef}
                width={1080}
                height={1920}
                className="w-56 h-auto rounded-xl shadow-lg border border-slate-300"
              />
            </div>

            {/* Selector de frases */}
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-sky-900">Frase motivacional:</span>
                <button
                  type="button"
                  onClick={() => setQuoteIndex(prev => prev + 1)}
                  className="flex items-center gap-1 text-[11px] font-bold text-sky-700 hover:text-sky-950 bg-white px-2.5 py-1 rounded-lg border border-sky-200 shadow-2xs transition"
                >
                  <RefreshCw className="w-3 h-3" /> Cambiar frase
                </button>
              </div>
              <p className="text-xs text-slate-700 font-medium italic">"{currentQuote}"</p>
            </div>

            {/* Botones de acción */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleDownloadStory}
                className="flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 rounded-xl shadow-sm transition"
              >
                <Download className="w-4 h-4" /> Descargar PNG
              </button>
              <button
                type="button"
                onClick={handleNativeShare}
                className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white text-xs font-bold py-3 rounded-xl shadow-sm transition"
              >
                <Share2 className="w-4 h-4" /> Compartir Ahora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETALLES DE CURSADA */}
      {activeDetailMateria && (() => {
        const mat = activeDetailMateria;
        const st = studentData[selectedPlan]?.[mat.id] || {};
        const regimenActual = st.regimen || (mat.regimen === 'final' ? 'final' : 'promocion');
        const esPromocional = regimenActual === 'promocion';

        const esCBC = activeBlock === 'cbc';
        const esIdioma = activeBlock === 'idiomas';
        const esElectiva = activeBlock === 'electivas';

        return (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="text-base font-black text-slate-900">{mat.name}</h3>
                  <p className="text-[10px] text-slate-500">Configuración, selección de cátedra y notas</p>
                </div>
                <button onClick={() => setActiveDetailMateria(null)} className="text-slate-400 font-bold text-xl">×</button>
              </div>

              {esIdioma && (
                <div className="space-y-2 bg-sky-50 p-4 rounded-xl border border-sky-200">
                  <label className="text-xs font-bold uppercase text-sky-900 block">Seleccione el Idioma:</label>
                  <select
                    value={st.customName || ''}
                    onChange={(e) => handleUpdateMateria(mat.id, 'customName', e.target.value)}
                    className="w-full bg-white border border-sky-300 rounded-lg p-2 text-xs font-semibold"
                  >
                    <option value="">-- Elija el idioma --</option>
                    <option value="Inglés">Inglés</option>
                    <option value="Portugués">Portugués</option>
                    <option value="Francés">Francés</option>
                    <option value="Italiano">Italiano</option>
                    <option value="Alemán">Alemán</option>
                    <option value="Quechua">Quechua</option>
                    <option value="Guaraní">Guaraní</option>
                  </select>
                </div>
              )}

              {esCBC && (
                <div className="space-y-2 bg-sky-50 p-4 rounded-xl border border-sky-200">
                  <label className="text-xs font-bold uppercase text-sky-900 block">Especifique materia / cátedra del CBC:</label>
                  <input
                    type="text"
                    placeholder="Ej. Sociedad y Estado (Cátedra A)"
                    value={st.customName || ''}
                    onChange={(e) => handleUpdateMateria(mat.id, 'customName', e.target.value)}
                    className="w-full bg-white border border-sky-300 rounded-lg p-2 text-xs"
                  />
                </div>
              )}

              {esElectiva && (
                <div className="space-y-3 bg-sky-50 p-4 rounded-xl border border-sky-200">
                  <label className="text-xs font-bold uppercase text-sky-900 block">Seleccione el Seminario u Optativa:</label>
                  <select
                    value={st.customName || ''}
                    onChange={(e) => handleUpdateMateria(mat.id, 'customName', e.target.value)}
                    className="w-full bg-white border border-sky-300 rounded-lg p-2 text-xs font-semibold"
                  >
                    <option value="">-- Seleccionar de la oferta disponible --</option>
                    {seminariosOferta.map(sem => (
                      <option key={sem.id} value={`${sem.nombre} (${sem.docente})`}>
                        {sem.nombre} - {sem.docente} ({sem.tipo})
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-sky-800">También puede escribir un seminario personalizado:</p>
                  <input
                    type="text"
                    placeholder="O escriba el nombre del seminario electivo..."
                    value={st.customName || ''}
                    onChange={(e) => handleUpdateMateria(mat.id, 'customName', e.target.value)}
                    className="w-full bg-white border border-sky-300 rounded-lg p-2 text-xs"
                  />
                </div>
              )}

              <div className="space-y-2 bg-slate-100 p-4 rounded-xl border border-slate-200">
                <label className="text-xs font-bold uppercase text-slate-800 block">Régimen de la Materia:</label>
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

              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5"><CheckSquare className="w-4 h-4 text-sky-600" /> Evaluaciones y Notas</h4>
                
                {esPromocional ? (
                  <div>
                    <p className="text-[10px] text-slate-500 mb-2">Ingrese las notas de los parciales para promediar automáticamente (Promedio &ge; 7 aprueba directo):</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-slate-600 block mb-1">1er Parcial</span>
                        <input type="number" min="1" max="10" placeholder="Nota" value={st.parcial1 || ''} onChange={(e) => handleUpdateMateria(mat.id, 'parcial1', e.target.value)} className="w-full bg-white border rounded-lg p-2 text-xs text-center font-bold" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-600 block mb-1">2do Parcial</span>
                        <input type="number" min="1" max="10" placeholder="Nota" value={st.parcial2 || ''} onChange={(e) => handleUpdateMateria(mat.id, 'parcial2', e.target.value)} className="w-full bg-white border rounded-lg p-2 text-xs text-center font-bold" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-600 block mb-1">3ro / Recup</span>
                        <input type="number" min="1" max="10" placeholder="Nota" value={st.parcial3 || ''} onChange={(e) => handleUpdateMateria(mat.id, 'parcial3', e.target.value)} className="w-full bg-white border rounded-lg p-2 text-xs text-center font-bold" />
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-200 mt-2">
                      <span className="text-[10px] font-bold text-sky-900 block mb-1">Nota de Examen Final (Solo si fue a final)</span>
                      <input type="number" min="4" max="10" placeholder="Final (opcional)" value={st.notaFinal || ''} onChange={(e) => handleUpdateMateria(mat.id, 'notaFinal', e.target.value)} className="w-full bg-sky-50 border border-sky-300 rounded-lg p-2 text-xs text-center font-bold text-sky-950" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-[10px] text-slate-500">Ingrese las notas de regularidad (1° y 2° parcial) y la nota del examen final:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-slate-600 block mb-1">1er Parcial</span>
                        <input type="number" min="1" max="10" placeholder="Nota" value={st.parcial1 || ''} onChange={(e) => handleUpdateMateria(mat.id, 'parcial1', e.target.value)} className="w-full bg-white border rounded-lg p-2 text-xs text-center font-bold" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-600 block mb-1">2do Parcial</span>
                        <input type="number" min="1" max="10" placeholder="Nota" value={st.parcial2 || ''} onChange={(e) => handleUpdateMateria(mat.id, 'parcial2', e.target.value)} className="w-full bg-white border rounded-lg p-2 text-xs text-center font-bold" />
                      </div>
                    </div>
                    <div className="pt-1 border-t border-slate-200">
                      <span className="text-[10px] font-bold text-amber-700 block mb-1">Nota de Examen Final</span>
                      <input type="number" min="4" max="10" placeholder="Nota Final (4 a 10)" value={st.notaFinal || ''} onChange={(e) => handleUpdateMateria(mat.id, 'notaFinal', e.target.value)} className="w-full bg-amber-50 border border-amber-300 rounded-lg p-2 text-xs text-center font-bold text-amber-900" />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button onClick={() => setActiveDetailMateria(null)} className="bg-slate-900 text-white text-xs font-bold px-5 py-2.5 rounded-xl">Guardar y Cerrar</button>
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
                <Bookmark className="w-5 h-5 text-sky-600" /> Catálogo de Oferta de Seminarios
              </h3>
              <button onClick={() => setShowSeminarioModal(false)} className="text-slate-400 hover:text-slate-700 font-bold text-lg">×</button>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold uppercase text-slate-700">Nuevo Seminario</h4>
              <input
                type="text"
                placeholder="Nombre del seminario..."
                value={nuevoSeminarioNombre}
                onChange={(e) => setNuevoSeminarioNombre(e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-800 text-xs rounded-lg p-2 outline-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Docente / Cátedra..."
                  value={nuevoSeminarioDocente}
                  onChange={(e) => setNuevoSeminarioDocente(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-800 text-xs rounded-lg p-2 outline-none"
                />
                <select
                  value={nuevoSeminarioTipo}
                  onChange={(e) => setNuevoSeminarioTipo(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-800 text-xs rounded-lg p-2 outline-none"
                >
                  <option value="sociocultural">Orientación Sociocultural</option>
                  <option value="arqueologia">Orientación Arqueología</option>
                </select>
              </div>
              <button
                onClick={() => {
                  if (nuevoSeminarioNombre.trim()) {
                    const nuevos = [...seminariosOferta, {
                      id: 'sem-' + Date.now(),
                      tipo: nuevoSeminarioTipo,
                      nombre: nuevoSeminarioNombre,
                      docente: nuevoSeminarioDocente || 'Docente a confirmar',
                      cuatrimestre: '1C 2026'
                    }];
                    setSeminariosOferta(nuevos);
                    guardarDatosNube(studentData, nuevos);
                    setNuevoSeminarioNombre('');
                    setNuevoSeminarioDocente('');
                  }
                }}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold py-2 rounded-lg transition"
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
                    onClick={() => {
                      const filtrados = seminariosOferta.filter(item => item.id !== s.id);
                      setSeminariosOferta(filtrados);
                      guardarDatosNube(studentData, filtrados);
                    }}
                    className="text-slate-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setShowSeminarioModal(false)} className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl">Cerrar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
