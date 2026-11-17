import React, { useState, useEffect, useRef } from 'react';
import { PLANS_DATA } from './data/plans';
import { DonutChart } from './components/DonutChart';
import { supabase } from './supabaseClient';
import { 
  BookOpen, Award, AlertCircle, 
  Bookmark, User, LogOut, Trash2, 
  Mail, Users, FileText, CheckSquare, Layers, Loader2,
  Share2, Download, RefreshCw, Sparkles,
  Star, Trophy, TrendingDown, Coffee, Copy, Check, Plus, Camera
} from 'lucide-react';

const MP_ALIAS = 'juan.miguel.ch';

// OFERTA OFICIAL ACTUALIZADA 2C 2026 - CIENCIAS ANTROPOLÓGICAS (FFyL UBA)
const SEMINARIOS_OFERTA_2C_2026 = [
  { id: 'sem-1', tipo: 'sociocultural', nombre: 'SEMINARIO DE ANTROPOLOGIA SOCIAL (ANTROPOLOGIA RURAL Y ANTROPOLOGIA SOCIAL) - SOLO PLAN 1985', docente: 'PROF. VALVERDE, Sebastián', cuatrimestre: '2C 2026' },
  { id: 'sem-2', tipo: 'sociocultural', nombre: 'REPRODUCCIÓN SOCIAL, DESIGUALDADES Y DIGITALIZACIÓN EN EL MUNDO DEL TRABAJO', docente: 'PROF. Hernán PALERMO y PROF. Verónica CASAS', cuatrimestre: '2C 2026' },
  { id: 'sem-3', tipo: 'sociocultural', nombre: 'PODER POLICIAL, BUROCRACIAS PENALES Y ACTIVISMOS. TEMAS Y PROBLEMAS DE INVESTIGACIÓN', docente: 'PROF. María Victoria PITA y PROF. Florencia CORBELLE', cuatrimestre: '2C 2026' },
  { id: 'sem-4', tipo: 'sociocultural', nombre: 'COLONIALIDAD, MODERNIDAD E IMAGINARIOS DE NACIÓN (MODALIDAD PRESENCIAL)', docente: 'PROF. URBANO, Eduardo Luis', cuatrimestre: '2C 2026' },
  { id: 'sem-5', tipo: 'sociocultural', nombre: 'HETERODOXIAS SOCIORELIGIOSAS DESDE UNA PERSPECTIVA HISTÓRICA Y ANTROPOLÓGICA. ALGUNOS EJEMPLOS DE EUROPA Y ARGENTINA (MODALIDAD PRESENCIAL)', docente: 'PROF. Pablo WRIGHT', cuatrimestre: '2C 2026' },
  { id: 'sem-6', tipo: 'sociocultural', nombre: 'CONFLICTIVIDAD PENAL JUVENIL ENFOQUES, METODOS Y ESTUDIOS DESDE LA ANTROPOLOGÍA JURÍDICA', docente: 'PROF. María Florencia GRAZIANO y Federico MEDINA', cuatrimestre: '2C 2026' },
  { id: 'sem-7', tipo: 'sociocultural', nombre: 'ANTROPOLOGÍA y ECONOMÍA POLÍTICA: PODER, TRABAJO Y AMBIENTE.', docente: 'PROF. Santiago SORROCHE', cuatrimestre: '2C 2026' },
  { id: 'sem-8', tipo: 'sociocultural', nombre: 'COMUNICAR LA ANTROPOLOGÍA (MODALIDAD PRESENCIAL)', docente: 'PROF. Marisol GARCIA y PROF. Roberta ALLER', cuatrimestre: '2C 2026' },
  { id: 'sem-9', tipo: 'arqueologia', nombre: 'CAMBIO CLIMÁTICO, TRANSDISCIPLINA Y ADAPTACIÓN BASADA EN ECOSISTEMAS', docente: 'PROF. Constanza RIERA y PROF. Paula Beatriz MARTIN', cuatrimestre: '2C 2026' },
  { id: 'sem-10', tipo: 'sociocultural', nombre: 'PST: LAS EMPRESAS AUTOGESTIONADAS FRENTE AL PLURIEMPLEO, EL CAPITALISMO DE PLATAFORMAS Y LA SUPEREXPLOTACIÓN DEL TRABAJO EN EL ULTRALIBERALISMO', docente: 'PROF. Andres Eduardo Ruggeri y PROF. Natalia POLTI', cuatrimestre: '2C 2026' },
  { id: 'sem-11', tipo: 'arqueologia', nombre: 'TEORÍA, INTERDISCIPLINARIEDAD Y DEBATES CONTEMPORÁNEOS EN ARQUEOLOGÍA HISTÓRICA', docente: 'PROF. María Jimena CRUZ y Melisa SALERNO', cuatrimestre: '2C 2026' },
  { id: 'sem-12', tipo: 'arqueologia', nombre: 'LA CULTURA BAJO UNA NUEVA PERSPECTIVA EVOLUTIVA.', docente: 'PROF. Viviana SCHEINSOHN', cuatrimestre: '2C 2026' },
  { id: 'sem-13', tipo: 'sociocultural', nombre: 'PST: PRODUCCIÓN Y GESTIÓN DE PROYECTOS CULTURALES EN FILO', docente: 'PROF. Victoria Julia LENCINA (Depto de Artes)', cuatrimestre: '2C 2026' },
  { id: 'sem-14', tipo: 'sociocultural', nombre: 'PST: DIÁLOGOS ENTRE ARTE Y EDUCACIÓN EN EL MUSEO ETNOGRÁFICO', docente: 'PROF. Mariana Denise LUTERSTEIN y PROF. María Eugenia LANZA (Depto de Artes)', cuatrimestre: '2C 2026' },
  { id: 'sem-15', tipo: 'sociocultural', nombre: 'PST: CONSTRUCCIÓN DE UN ESPACIO DE RECREACIÓN EDUCATIVA PARA LAS INFANCIAS EN EL CIDAC', docente: 'PROF. Anahi GUELMAN y PROF. Mariel KAROLONSKI (Depto de Cs. de la Educación)', cuatrimestre: '2C 2026' },
  { id: 'sem-16', tipo: 'sociocultural', nombre: 'PST: SABERES Y EXPERIENCIAS AMBIENTALES EN DIÁLOGOS COMUNITARIOS. EL CASO DE LA COOPERATIVA RECUPERADORES URBANOS DEL OESTE', docente: 'PROF. María Inés CARABAJAL y PROF. Lia Inés BACHMAN (Depto de Geografía)', cuatrimestre: '2C 2026' }
];

// AVATARES HISTÓRICOS DE LA ANTROPOLOGÍA (15 REFERENTES CON ENLACES WIKIMEDIA SEGUROS / BUSTOS B&W)
const AVATARES_ANTROPOLOGIA = [
  { id: 'boas', nombre: 'Franz Boas', rol: 'Padre del Particularismo Histórico', emoji: '📚', img: 'https://upload.wikimedia.org/wikipedia/commons/6/62/FranzBoas.jpg' },
  { id: 'malinowski', nombre: 'Bronisław Malinowski', rol: 'Trabajo de Campo / Funcionalismo', emoji: '⛺', img: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Bronislaw_Malinowski_1916.jpg' },
  { id: 'mauss', nombre: 'Marcel Mauss', rol: 'Teoría del Don y Sociología', emoji: '🎁', img: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/M.Mauss_1872-1950.jpg' },
  { id: 'levis', nombre: 'Claude Lévi-Strauss', rol: 'Estructuralismo Antropológico', emoji: '🧩', img: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Claude_L%C3%A9vi-Strauss_%281908-2009%29.jpg' },
  { id: 'mead', nombre: 'Margaret Mead', rol: 'Cultura, Género e Infancia', emoji: '🌴', img: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Margaret_Mead_%281901-1978%29.jpg' },
  { id: 'benedict', nombre: 'Ruth Benedict', rol: 'Cultura y Personalidad', emoji: '🎭', img: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Ruth_Benedict_1920.jpg' },
  { id: 'geertz', nombre: 'Clifford Geertz', rol: 'Antropología Simbólica e Interpretativa', emoji: '✍️', img: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Clifford_Geertz.jpg' },
  { id: 'sahlins', nombre: 'Marshall Sahlins', rol: 'Antropología Económica y Simbólica', emoji: '🏝️', img: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Marshall_Sahlins_2008.jpg' },
  { id: 'douglas', nombre: 'Mary Douglas', rol: 'Riesgo, Pureza y Símbolos', emoji: '⚖️', img: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Mary_Douglas_1992.jpg' },
  { id: 'turner', nombre: 'Victor Turner', rol: 'Ritual y Liminidad', emoji: '🌿', img: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Victor_W_Turner.jpg' },
  { id: 'gluckman', nombre: 'Max Gluckman', rol: 'Escuela de Mánchester y Conflictos', emoji: '⚖️', img: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Max_Gluckman.jpg' },
  { id: 'leach', nombre: 'Edmund Leach', rol: 'Estructuralismo Británico', emoji: '🌐', img: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Edmund_Leach_portrait.jpg' },
  { id: 'graeber', nombre: 'David Graeber', rol: 'Antropología Económica y Anarquista', emoji: '✊', img: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/David_Graeber_2015-03-07_%2816741093492%29_%28cropped%29.jpg' },
  { id: 'segato', nombre: 'Rita Segato', rol: 'Antropología Feminista y Violencia', emoji: '🔥', img: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Rita_Segato_2017.jpg' },
  { id: 'foucault', nombre: 'Michel Foucault', rol: 'Poder, Saber y Biopolítica', emoji: '🔍', img: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Photo_of_Michel_Foucault_on_1970_dustjacket_of_The_Order_of_Things.jpg' }
];

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
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const [activeDetailMateria, setActiveDetailMateria] = useState(null);

  const [showShareModal, setShowShareModal] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const canvasRef = useRef(null);

  const [showDonateModal, setShowDonateModal] = useState(false);
  const [copiedAlias, setCopiedAlias] = useState(false);

  const [seminariosOferta, setSeminariosOferta] = useState(SEMINARIOS_OFERTA_2C_2026);
  const [showSeminarioModal, setShowSeminarioModal] = useState(false);
  
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarActual, setAvatarActual] = useState(AVATARES_ANTROPOLOGIA[3]); // Lévi-Strauss por defecto

  const [toastMessage, setToastMessage] = useState(null);
  const [studentData, setStudentData] = useState({ '2023': {}, '1985': {} });

  useEffect(() => {
    if (session && session.tipo === 'registrado') {
      cargarDatosNube(session.email);
    } else if (session && session.tipo === 'invitado') {
      setStudentData({ '2023': {}, '1985': {} });
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
        else setStudentData({ '2023': {}, '1985': {} });

        setSeminariosOferta(SEMINARIOS_OFERTA_2C_2026);

        if (data.plan_actual) setSelectedPlan(data.plan_actual);
        if (data.orientacion_actual) setSelectedOrientation(data.orientacion_actual);
        
        if (data.avatar) {
          setAvatarActual(data.avatar);
        }
      } else {
        setStudentData({ '2023': {}, '1985': {} });
      }
    } catch (err) {
      console.error("Error al conectar con Supabase:", err);
      setStudentData({ '2023': {}, '1985': {} });
    } finally {
      setLoadingCloud(false);
    }
  };

  const guardarDatosNube = async (nuevoData = studentData, nuevosSemis = seminariosOferta, nuevoAvatar = avatarActual) => {
    if (session && session.tipo === 'registrado') {
      try {
        await supabase.from('estudiantes').update({
          datos_academicos: nuevoData,
          seminarios_oferta: nuevosSemis,
          plan_actual: selectedPlan,
          orientacion_actual: selectedOrientation,
          avatar: nuevoAvatar,
          actualizado_en: new Date()
        }).eq('email', session.email);
      } catch (err) {
        console.error("Error al guardar en la nube:", err);
      }
    }
  };

  const handleCambiarAvatar = (avatarObj) => {
    setAvatarActual(avatarObj);
    setShowAvatarModal(false);
    guardarDatosNube(studentData, seminariosOferta, avatarObj);
    setToastMessage(`¡Avatar actualizado a ${avatarObj.nombre}! 🏛️`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAgregarSeminarioAElectivas = (sem) => {
    const customId = 'electiva-sem-' + sem.id + '-' + Date.now();
    const textoSeminario = `${sem.nombre} (${sem.docente})`;

    setStudentData(prev => {
      const planState = prev[selectedPlan] || {};
      const updated = {
        ...prev,
        [selectedPlan]: {
          ...planState,
          [customId]: {
            estado: 'cursando',
            nota: '',
            aplazos: '0',
            regimen: 'promocion',
            customName: textoSeminario,
            favorita: true,
            cuatrimestreCursada: '2° Cuatrimestre',
            anioCursada: '2026'
          }
        }
      };
      guardarDatosNube(updated);
      return updated;
    });

    setToastMessage("¡Tu seminario elegido ya se agregó a la pestaña electivas/seminarios!");
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleEliminarSeminarioPersonalizado = (id) => {
    const confirmar = window.confirm("¿Estás seguro que querés eliminar el seminario que elegiste?");
    if (!confirmar) return;

    setStudentData(prev => {
      const planState = { ...(prev[selectedPlan] || {}) };
      delete planState[id];

      const updated = {
        ...prev,
        [selectedPlan]: planState
      };
      guardarDatosNube(updated);
      return updated;
    });
  };

  const parseNota10 = (val) => {
    if (val === '' || val === null || isNaN(val)) return '';
    const num = parseFloat(val);
    if (num < 0) return '0';
    if (num > 10) return '10';
    return val;
  };

  const handleUpdateMateria = (id, field, value) => {
    setStudentData(prev => {
      const planState = prev[selectedPlan] || {};
      const matState = planState[id] || { 
        estado: 'pendiente', nota: '', aplazos: '0', regimen: 'promocion', 
        comision: '', anioCursada: '', cuatrimestreCursada: '',
        docenteTeorico: '', emailTeorico: '', docentePractico: '', emailPractico: '',
        parcial1: '', parcial2: '', parcial3: '', 
        final1: '', final2: '', final3: '',
        customName: '', favorita: false
      };

      let valClean = value;
      if (['parcial1', 'parcial2', 'parcial3', 'final1', 'final2', 'final3', 'nota'].includes(field)) {
        valClean = parseNota10(value);
      }

      let updatedMat = { ...matState, [field]: valClean };

      if (['parcial1', 'parcial2', 'parcial3', 'final1', 'final2', 'final3', 'regimen'].includes(field)) {
        const reg = field === 'regimen' ? value : (updatedMat.regimen || 'promocion');
        const p1 = parseFloat(updatedMat.parcial1);
        const p2 = parseFloat(updatedMat.parcial2);
        const p3 = parseFloat(updatedMat.parcial3);

        const f1 = parseFloat(updatedMat.final1);
        const f2 = parseFloat(updatedMat.final2);
        const f3 = parseFloat(updatedMat.final3);

        let aplazosFinalesCount = 0;
        [f1, f2, f3].forEach(f => {
          if (!isNaN(f) && f < 4) aplazosFinalesCount++;
        });

        updatedMat.aplazos = Math.max(0, aplazosFinalesCount).toString();

        if (reg === 'promocion') {
          const validas = [p1, p2, p3].filter(n => !isNaN(n) && n >= 1);
          if (validas.length > 0) {
            const promParciales = validas.reduce((a, b) => a + b, 0) / validas.length;
            const finalesRendidos = [f1, f2, f3].filter(n => !isNaN(n) && n >= 1);
            if (finalesRendidos.length > 0) {
              const promFinales = finalesRendidos.reduce((a, b) => a + b, 0) / finalesRendidos.length;
              updatedMat.nota = Math.round((promParciales + promFinales) / 2).toString();
            } else {
              updatedMat.nota = Math.round(promParciales).toString();
            }
          }
        } else {
          const finalesRendidos = [f1, f2, f3].filter(n => !isNaN(n) && n >= 1);
          if (finalesRendidos.length > 0) {
            const promFinales = finalesRendidos.reduce((a, b) => a + b, 0) / finalesRendidos.length;
            updatedMat.nota = Math.round(promFinales).toString();
          } else {
            const notasReg = [p1, p2].filter(n => !isNaN(n) && n >= 1);
            if (notasReg.length > 0) {
              updatedMat.nota = Math.round(notasReg.reduce((a, b) => a + b, 0) / notasReg.length).toString();
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
    
    const planState = studentData[selectedPlan] || {};
    Object.keys(planState).forEach(k => {
      if (k.startsWith('electiva-sem-')) {
        list.push({ id: k, name: 'Seminario / Electiva', etapa: 'Electiva', correlativa: '' });
      }
    });

    if (selectedPlan === '2023' && includeProfesorado && selectedOrientation !== 'profesorado') {
      const profObj = planObj.orientaciones['profesorado'];
      if (profObj) list = [...list, ...profObj.cfo];
    }
    return list;
  };

  const currentMateriasAll = getAllMaterias();
  
  const getBlockMateriasExtended = (block) => {
    let base = getBlockMaterias(block);
    if (block === 'electivas') {
      const planState = studentData[selectedPlan] || {};
      const customSeminarios = [];
      Object.keys(planState).forEach(k => {
        if (k.startsWith('electiva-sem-')) {
          customSeminarios.push({
            id: k,
            name: 'Seminario / Electiva (Oferta 2C 2026)',
            etapa: 'Electiva / PST',
            correlativa: '',
            esCustomSeminario: true
          });
        }
      });
      return [...base, ...customSeminarios];
    }
    return base;
  };

  const rawBlockMaterias = onlyFavorites ? currentMateriasAll : getBlockMateriasExtended(activeBlock);
  const currentBlockMaterias = onlyFavorites
    ? rawBlockMaterias.filter(m => studentData[selectedPlan]?.[m.id]?.favorita)
    : rawBlockMaterias;

  let aprobadasCount = 0;
  let regularizadasCount = 0;
  let cursandoCount = 0;
  let pendientesCount = 0;
  let favoritasCount = 0;

  let sumNotas = 0;
  let countNotas = 0;

  let highestMateria = null;
  let lowestMateria = null;

  const idiomasIds = new Set((planObj.idiomas || []).map(i => i.id));

  currentMateriasAll.forEach(m => {
    const st = studentData[selectedPlan]?.[m.id] || {};
    const estado = st.estado || 'pendiente';
    const notaNum = st.nota !== '' && !isNaN(st.nota) ? parseFloat(st.nota) : null;
    const esIdioma = idiomasIds.has(m.id);

    if (st.favorita) favoritasCount++;

    if (estado === 'aprobada') {
      aprobadasCount++;
      if (notaNum !== null && notaNum >= 4 && !esIdioma) {
        sumNotas += notaNum;
        countNotas++;

        const displayName = st.customName ? `${m.name}: ${st.customName}` : m.name;
        if (!highestMateria || notaNum > highestMateria.nota) {
          highestMateria = { name: displayName, nota: notaNum };
        }
        if (!lowestMateria || notaNum < lowestMateria.nota) {
          lowestMateria = { name: displayName, nota: notaNum };
        }
      }
    } else if (estado === 'regularizada') { regularizadasCount++; } 
    else if (estado === 'cursando') { cursandoCount++; } 
    else { pendientesCount++; }
  });

  const promedioSinAplazos = countNotas > 0 ? (sumNotas / countNotas).toFixed(2) : '-';
  const totalMaterias = currentMateriasAll.length;
  const porcentajeAvance = totalMaterias > 0 ? Math.round((aprobadasCount / totalMaterias) * 100) : 0;

  const getMotivationalQuotes = (pct) => {
    if (pct >= 100) return [`¡100% completado! Oficialmente en la meta del título de Antropología 🎓✨`];
    if (pct >= 70) return [`¡Ya estás al ${pct}% de tu carrera! Falta poco, sigue así 🔥🎓`];
    if (pct >= 50) return [`¡Ya pasamos la mitad del camino (${pct}%)! 🚀📚`];
    if (pct >= 25) return [`Camino al 50%: ya tenés el ${pct}% adentro 📝🔥`];
    return [`Arrancando el camino en Antropología: ya llevás el ${pct}% 🌱📚`];
  };

  const quotesList = getMotivationalQuotes(porcentajeAvance);
  const currentQuote = quotesList[quoteIndex % quotesList.length];

  useEffect(() => {
    if (!showShareModal || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const W = 1080;
    const H = 1920;

    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(0.5, '#0c4a6e');
    bgGrad.addColorStop(1, '#020617');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(179, 235, 242, 0.12)';
    ctx.lineWidth = 3;
    ctx.strokeRect(60, 60, W - 120, H - 120);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 34px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('UBA · FFyL · VIDA PUANER', W / 2, 180);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 64px sans-serif';
    ctx.fillText('Ciencias Antropológicas', W / 2, 265);

    const orientLabel = selectedOrientation === 'sociocultural' ? 'Orientación Sociocultural' : selectedOrientation === 'arqueologia' ? 'Orientación Arqueología' : 'Profesorado';
    ctx.fillStyle = '#bae6fd';
    ctx.font = '600 36px sans-serif';
    ctx.fillText(`Plan ${selectedPlan} · ${orientLabel}`, W / 2, 330);

    const cx = W / 2;
    const cy = 760;
    const radius = 270;
    const lineWidth = 75;

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

    if (aprobadasCount > 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, startAngle + aprobAngle);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.stroke();
      startAngle += aprobAngle;
    }
    if (regularizadasCount > 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, startAngle + regAngle);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = lineWidth;
      ctx.stroke();
      startAngle += regAngle;
    }
    if (cursandoCount > 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, startAngle + cursAngle);
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 130px sans-serif';
    ctx.fillText(`${porcentajeAvance}%`, cx, cy + 35);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('COMPLETADO', cx, cy + 90);

    const legendY = 1130;
    ctx.font = 'bold 30px sans-serif';
    ctx.fillStyle = '#10b981';
    ctx.fillText(`● Aprobadas: ${aprobadasCount}`, W / 2 - 230, legendY);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText(`● Regulares: ${regularizadasCount}`, W / 2 + 230, legendY);

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

    ctx.fillStyle = '#B3EBF2';
    ctx.font = 'bold 42px sans-serif';
    ctx.fillText(currentQuote, W / 2, 1510);

    ctx.fillStyle = '#64748b';
    ctx.font = '600 28px sans-serif';
    const userDisplay = session?.nombre && session.nombre !== 'Invitado' ? `${session.nombre} ${session.apellido}` : 'Estudiante de Antropología';
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
          await navigator.share({ files: [file], title: 'Mi avance en Ciencias Antropológicas - UBA', text: currentQuote });
        } catch (err) { }
      } else {
        handleDownloadStory();
      }
    }, 'image/png');
  };

  const handleCopyAlias = () => {
    navigator.clipboard.writeText(MP_ALIAS);
    setCopiedAlias(true);
    setTimeout(() => setCopiedAlias(false), 2500);
  };

  const PinoIcon = ({ color = "#0f172a" }) => (
    <svg width="36" height="36" viewBox="0 0 512 512" fill={color}>
      <path d="M256 32C245.3 32 235.3 38.3 231 48L143 144H191L111 240H167L87 336H167L79 432H224V464H160V496H352V464H288V432H433L345 336H425L345 240H401L321 144H369L281 48C276.7 38.3 266.7 32 256 32Z" />
    </svg>
  );

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#B3EBF2' }}>
        <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-sky-300 space-y-6">
          <div className="text-center space-y-3">
            <div className="mx-auto flex items-center justify-center"><PinoIcon color="#0f172a" /></div>
            <span className="text-[10px] uppercase font-black tracking-widest text-sky-900 bg-sky-100 px-3 py-1 rounded-full border border-sky-300">UBA · FFyL · Memoria Puaner</span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Ciencias Antropológicas</h1>
            <p className="text-xs text-slate-500">Ingrese su correo registrado para acceder a sus datos.</p>
          </div>

          <div className="space-y-4 pt-2">
            {isRegistering ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Nombre</label>
                    <input type="text" placeholder="Tu nombre" value={formNombre} onChange={(e) => setFormNombre(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-sky-600" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Apellido</label>
                    <input type="text" placeholder="Tu apellido" value={formApellido} onChange={(e) => setFormApellido(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-sky-600" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Correo electrónico</label>
                  <input type="email" placeholder="correo@filo.uba.ar" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-sky-600" />
                </div>
                <button
                  onClick={async () => {
                    if (formNombre.trim() && formApellido.trim() && formEmail.trim()) {
                      setLoadingCloud(true);
                      try {
                        const { data: existente } = await supabase.from('estudiantes').select('*').eq('email', formEmail.trim()).maybeSingle();
                        if (existente) {
                          alert("⚠️ Este correo ya se encuentra registrado.");
                          setLoadingCloud(false);
                          return;
                        }
                        const datosVacios = { '2023': {}, '1985': {} };
                        const avatarPorDefecto = AVATARES_ANTROPOLOGIA[3];
                        await supabase.from('estudiantes').insert([{
                          email: formEmail.trim(), nombre: formNombre.trim(), apellido: formApellido.trim(),
                          datos_academicos: datosVacios, seminarios_oferta: SEMINARIOS_OFERTA_2C_2026, avatar: avatarPorDefecto
                        }]);
                        setStudentData(datosVacios);
                        setAvatarActual(avatarPorDefecto);
                        setSession({ nombre: formNombre.trim(), apellido: formApellido.trim(), email: formEmail.trim(), tipo: 'registrado' });
                      } catch (e) {
                        alert("Hubo un error al registrarse.");
                      } finally { setLoadingCloud(false); }
                    } else { alert("Completa todos los campos."); }
                  }}
                  className="w-full bg-sky-800 hover:bg-sky-900 text-white font-bold text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  {loadingCloud && <Loader2 className="w-4 h-4 animate-spin" />} Crear Registro en la Nube
                </button>
                <button onClick={() => setIsRegistering(false)} className="w-full text-slate-600 hover:text-slate-900 text-xs font-semibold py-1">← Volver</button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={async () => {
                    const emailInput = prompt("Ingrese su correo electrónico:");
                    if (emailInput && emailInput.trim()) {
                      setLoadingCloud(true);
                      try {
                        const { data } = await supabase.from('estudiantes').select('*').eq('email', emailInput.trim()).maybeSingle();
                        setLoadingCloud(false);
                        if (data) {
                          setSession({ nombre: data.nombre, apellido: data.apellido, email: data.email, tipo: 'registrado' });
                        } else { alert("❌ Correo no registrado."); }
                      } catch (err) { setLoadingCloud(false); }
                    }
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  {loadingCloud ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />} Ingresar con mi Correo
                </button>
                <button onClick={() => setIsRegistering(true)} className="w-full bg-white hover:bg-sky-50 text-sky-950 font-bold text-xs py-3 rounded-xl transition border border-sky-300">Registrarme por Primera Vez</button>
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-sky-300"></div><span className="flex-shrink mx-4 text-sky-900 text-[10px] uppercase font-bold">O</span><div className="flex-grow border-t border-sky-300"></div>
                </div>
                <button onClick={() => { setStudentData({ '2023': {}, '1985': {} }); setSession({ nombre: 'Invitado', apellido: '', email: 'invitado@uba', tipo: 'invitado' }); }} className="w-full bg-sky-100 hover:bg-sky-200 text-sky-900 border border-sky-300 font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-2">
                  <User className="w-4 h-4 text-sky-700" /> Continuar como Invitado
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 flex flex-col justify-between">
      <div>
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-sky-500 flex items-center gap-3 animate-bounce">
            <Sparkles className="w-5 h-5 text-sky-400 shrink-0" /><p className="text-xs font-bold">{toastMessage}</p>
          </div>
        )}

        <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <PinoIcon color="#ffffff" />
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
              <button onClick={() => setShowDonateModal(true)} className="flex items-center gap-1.5 bg-sky-500/25 hover:bg-sky-500/35 text-sky-200 border border-sky-400/40 px-3 py-1.5 rounded-xl text-xs font-bold transition">
                <Coffee className="w-3.5 h-3.5 text-sky-300" /> Invitame un mate 🧉
              </button>

              {session.tipo === 'invitado' ? (
                <div className="flex items-center gap-2">
                  <button onClick={() => setSession(null)} className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-slate-950 px-3.5 py-1.5 rounded-xl text-xs font-extrabold shadow-sm transition animate-pulse">
                    <Sparkles className="w-3.5 h-3.5" /> Registrate
                  </button>
                  <button onClick={() => setSession(null)} className="flex items-center gap-1 bg-red-700/80 hover:bg-red-700 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-xl transition shadow-sm">
                    <LogOut className="w-3.5 h-3.5" /> Salir
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 bg-slate-800 px-3.5 py-1.5 rounded-xl border border-slate-700">
                  <div onClick={() => setShowAvatarModal(true)} className="relative group cursor-pointer" title="Cambiar avatar">
                    {avatarActual?.img ? (
                      <img src={avatarActual.img} alt={avatarActual.nombre} className="w-8 h-8 rounded-full object-cover border-2 border-sky-400 shadow-sm filter grayscale contrast-125" />
                    ) : (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-sky-950 bg-sky-300 border-2 border-sky-400">{session.nombre[0]}</div>
                    )}
                    <div className="absolute inset-0 bg-slate-900/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><Camera className="w-3.5 h-3.5 text-white" /></div>
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white leading-tight flex items-center gap-1.5">
                      {session.nombre} {session.apellido}
                      <span className="text-[10px] text-sky-300 font-normal">({avatarActual ? avatarActual.nombre.split(' ')[0] : ''})</span>
                    </p>
                    <p className="text-[10px] text-slate-400">{session.email}</p>
                  </div>
                  <button onClick={() => { setStudentData({ '2023': {}, '1985': {} }); setSession(null); }} className="flex items-center gap-1 bg-red-700/80 hover:bg-red-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg transition ml-2 shadow-sm">
                    <LogOut className="w-3.5 h-3.5" /> Salir
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Plan:</span>
                <select value={selectedPlan} onChange={(e) => { setSelectedPlan(e.target.value); guardarDatosNube(studentData); }} className="bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold rounded-xl px-3 py-1.5 outline-none">
                  {Object.entries(PLANS_DATA).map(([key, p]) => (<option key={key} value={key}>{p.name}</option>))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Orientación:</span>
                <select value={selectedOrientation} onChange={(e) => { setSelectedOrientation(e.target.value); guardarDatosNube(studentData); }} className="bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold rounded-xl px-3 py-1.5 outline-none">
                  <option value="sociocultural">Licenciatura - Sociocultural</option>
                  <option value="arqueologia">Licenciatura - Arqueología</option>
                  {selectedPlan === '2023' && <option value="profesorado">Profesorado en Cs. Antropológicas</option>}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => setShowShareModal(true)} className="flex items-center gap-1.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-sm transition">
                <Share2 className="w-3.5 h-3.5" /> Compartir Historia ({porcentajeAvance}%)
              </button>
              <button onClick={() => setShowSeminarioModal(true)} className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-sm transition">
                <Bookmark className="w-3.5 h-3.5" /> Catálogo Seminarios ({seminariosOferta.length})
              </button>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 pt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6">
              <DonutChart total={currentMateriasAll.length} aprobadas={aprobadasCount} regularizadas={regularizadasCount} cursando={cursandoCount} pendientes={pendientesCount} />
            </div>

            <div className="lg:col-span-3 bg-gradient-to-br from-sky-900 to-slate-900 text-white p-5 rounded-2xl shadow-md flex flex-col justify-between border border-sky-950">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] uppercase tracking-wider text-sky-300 font-bold flex items-center gap-1.5"><Award className="w-4 h-4 text-sky-400" /> Promedio UBA</span>
                  <span className="bg-sky-800/80 text-sky-200 text-[10px] px-2 py-0.5 rounded-full font-semibold">{countNotas} notas</span>
                </div>
                <div className="flex items-baseline gap-1.5 my-2">
                  <span className="text-5xl font-black tracking-tight text-white">{promedioSinAplazos}</span>
                  <span className="text-lg font-bold text-sky-300">/ 10</span>
                </div>
              </div>
              <button onClick={() => setShowShareModal(true)} className="w-full bg-white/10 hover:bg-white/20 text-sky-100 border border-sky-400/30 text-[11px] font-bold py-2 rounded-xl transition flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-300" /> Tarjeta IG / WhatsApp
              </button>
            </div>

            <div className="lg:col-span-3 bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider font-black text-slate-700 flex items-center gap-1.5"><Trophy className="w-4 h-4 text-amber-500" /> Podio de Notas</span>
                <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-500" /> {favoritasCount} favs</span>
              </div>
              <div className="space-y-2.5">
                <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-2.5">
                  <div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase text-emerald-800">Mayor Nota</span><span className="text-sm font-black text-emerald-700 bg-white px-2 py-0.5 rounded-md">{highestMateria ? highestMateria.nota : '-'}</span></div>
                  <p className="text-xs font-bold text-slate-800 truncate mt-1">{highestMateria ? highestMateria.name : 'Sin notas aún'}</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                  <div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase text-slate-600">Menor Nota</span><span className="text-sm font-black text-slate-700 bg-white px-2 py-0.5 rounded-md">{lowestMateria ? lowestMateria.nota : '-'}</span></div>
                  <p className="text-xs font-bold text-slate-700 truncate mt-1">{lowestMateria ? lowestMateria.name : 'Sin notas aún'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <button onClick={() => { setOnlyFavorites(false); setActiveBlock('cbc'); }} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${!onlyFavorites && activeBlock === 'cbc' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'}`}><Layers className="w-4 h-4 text-sky-600" /> CBC</button>
              <button onClick={() => { setOnlyFavorites(false); setActiveBlock('cfg'); }} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${!onlyFavorites && activeBlock === 'cfg' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'}`}><Layers className="w-4 h-4 text-sky-600" /> CFG</button>
              <button onClick={() => { setOnlyFavorites(false); setActiveBlock('cfo'); }} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${!onlyFavorites && activeBlock === 'cfo' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'}`}><Layers className="w-4 h-4 text-sky-600" /> CFO</button>
              <button onClick={() => { setOnlyFavorites(false); setActiveBlock('idiomas'); }} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${!onlyFavorites && activeBlock === 'idiomas' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'}`}><Layers className="w-4 h-4 text-sky-600" /> Idiomas</button>
              <button onClick={() => { setOnlyFavorites(false); setActiveBlock('electivas'); }} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${!onlyFavorites && activeBlock === 'electivas' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'}`}><Layers className="w-4 h-4 text-sky-600" /> Electivas / Seminarios</button>
            </div>
            <button onClick={() => setOnlyFavorites(prev => !prev)} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 border ${onlyFavorites ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-sm' : 'bg-amber-50 text-amber-900 border-amber-200'}`}>
              <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-amber-950' : 'fill-amber-400 text-amber-500'}`} /> Mis Favoritas ({favoritasCount})
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-base font-bold flex items-center gap-2 uppercase tracking-wide">
                {onlyFavorites ? <><Star className="w-5 h-5 text-amber-400 fill-amber-400" /> Materias Favoritas</> : <><BookOpen className="w-5 h-5 text-sky-400" /> Bloque: {activeBlock.toUpperCase()}</>}
              </h2>
              <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">{currentBlockMaterias.length} materias</span>
            </div>

            <div className="divide-y divide-slate-100">
              {currentBlockMaterias.map((m) => {
                const st = studentData[selectedPlan]?.[m.id] || { estado: 'pendiente', nota: '', favorita: false };
                const esFavorita = Boolean(st.favorita);
                return (
                  <div key={m.id} className="p-4 sm:p-5 hover:bg-slate-50 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">{m.etapa}</span>
                      </div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <button type="button" onClick={() => handleUpdateMateria(m.id, 'favorita', !esFavorita)} className="p-1 rounded-lg hover:bg-amber-50 transition">
                          <Star className={`w-5 h-5 transition ${esFavorita ? 'fill-amber-400 text-amber-500 scale-110' : 'text-slate-300'}`} />
                        </button>
                        <h3 className="font-bold text-slate-800 text-base">{st.customName ? `${m.name}: ${st.customName}` : m.name}</h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap justify-end">
                      {m.esCustomSeminario && (
                        <button onClick={() => handleEliminarSeminarioPersonalizado(m.id)} className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition"><Trash2 className="w-4 h-4" /></button>
                      )}
                      <button onClick={() => setActiveDetailMateria(m)} className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition">
                        <FileText className="w-3.5 h-3.5 text-sky-600" /> Libreta
                      </button>
                      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                        <button onClick={() => handleUpdateMateria(m.id, 'estado', 'pendiente')} className={`px-2.5 py-1 text-xs font-bold rounded-lg ${st.estado === 'pendiente' || !st.estado ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>Pend.</button>
                        <button onClick={() => handleUpdateMateria(m.id, 'estado', 'cursando')} className={`px-2.5 py-1 text-xs font-bold rounded-lg ${st.estado === 'cursando' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-500'}`}>Curs.</button>
                        <button onClick={() => handleUpdateMateria(m.id, 'estado', 'regularizada')} className={`px-2.5 py-1 text-xs font-bold rounded-lg ${st.estado === 'regularizada' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-500'}`}>Reg.</button>
                        <button onClick={() => handleUpdateMateria(m.id, 'estado', 'aprobada')} className={`px-2.5 py-1 text-xs font-bold rounded-lg ${st.estado === 'aprobada' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500'}`}>Aprob.</button>
                      </div>
                      {st.estado === 'aprobada' && (
                        <input type="number" min="0" max="10" placeholder="Nota" value={st.nota || ''} onChange={(e) => handleUpdateMateria(m.id, 'nota', e.target.value)} className="w-12 text-center bg-white border border-emerald-300 text-emerald-900 text-xs font-bold rounded-md py-1" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      <footer className="max-w-7xl mx-auto px-4 mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>Diseñado en estado de <strong>liminidad académica</strong> para Ciencias Antropológicas · FFyL UBA.</p>
        <button onClick={() => setShowDonateModal(true)} className="flex items-center gap-2 bg-white hover:bg-sky-50 text-slate-800 border border-slate-300 px-4 py-2 rounded-xl font-bold transition">
          <Coffee className="w-4 h-4 text-sky-600" /> Invitame un mate 🧉
        </button>
      </footer>

      {/* MODAL AVATAR EN B&W CON 15 ANTROPÓLOGOS */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2"><Camera className="w-4 h-4 text-sky-600" /> Elegí tu Antropólogo/a Histórico/a</h3>
              <button onClick={() => setShowAvatarModal(false)} className="text-slate-400 font-bold text-xl">×</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
              {AVATARES_ANTROPOLOGIA.map((av) => {
                const esSeleccionado = avatarActual?.id === av.id;
                return (
                  <div key={av.id} onClick={() => handleCambiarAvatar(av)} className={`cursor-pointer rounded-2xl p-3 border text-center transition flex flex-col items-center justify-between space-y-2 ${esSeleccionado ? 'bg-sky-50 border-sky-500 shadow-md ring-2 ring-sky-400' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="relative">
                      <img src={av.img} alt={av.nombre} className="w-16 h-16 rounded-full object-cover shadow-md border-2 border-white filter grayscale contrast-125" />
                      <span className="absolute -bottom-1 -right-1 text-sm bg-white rounded-full px-1">{av.emoji}</span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-xs">{av.nombre}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{av.rol}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {showDonateModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-5 text-center">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2"><Coffee className="w-4 h-4 text-sky-600" /> Reciprocidad puanense 🧉</h3>
              <button onClick={() => setShowDonateModal(false)} className="text-slate-400 font-bold text-xl">×</button>
            </div>
            <p className="text-xs text-slate-600">Si el gestor te resulta útil para organizar tu cursada y querés apoyar el proyecto con un mate virtual, ¡muchas gracias! 💙</p>
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-900 block">Alias de Mercado Pago:</span>
              <div className="flex items-center justify-between bg-white border border-sky-300 rounded-xl px-3.5 py-2.5">
                <span className="text-sm font-black text-slate-800 select-all">{MP_ALIAS}</span>
                <button type="button" onClick={handleCopyAlias} className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg ${copiedAlias ? 'bg-emerald-600 text-white' : 'bg-sky-600 text-white'}`}>
                  {copiedAlias ? <><Check className="w-3.5 h-3.5" /> ¡Copiado!</> : <><Copy className="w-3.5 h-3.5" /> Copiar</>}
                </button>
              </div>
            </div>
            <button onClick={() => setShowDonateModal(false)} className="w-full bg-slate-900 text-white text-xs font-bold py-2.5 rounded-xl">Cerrar</button>
          </div>
        </div>
      )}

      {showShareModal && (
        <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4 max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2"><Sparkles className="w-4 h-4 text-sky-600" /> Historia de Avance</h3>
              <button onClick={() => setShowShareModal(false)} className="text-slate-400 font-bold text-xl">×</button>
            </div>
            <div className="flex justify-center bg-slate-100 p-3 rounded-2xl border border-slate-200">
              <canvas ref={canvasRef} width={1080} height={1920} className="w-56 h-auto rounded-xl shadow-lg border border-slate-300" />
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button type="button" onClick={handleDownloadStory} className="flex items-center justify-center gap-1.5 bg-slate-900 text-white text-xs font-bold py-3 rounded-xl"><Download className="w-4 h-4" /> Descargar PNG</button>
              <button type="button" onClick={handleNativeShare} className="flex items-center justify-center gap-1.5 bg-sky-600 text-white text-xs font-bold py-3 rounded-xl"><Share2 className="w-4 h-4" /> Compartir</button>
            </div>
          </div>
        </div>
      )}

      {activeDetailMateria && (() => {
        const mat = activeDetailMateria;
        const st = studentData[selectedPlan]?.[mat.id] || {};
        return (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-base font-black text-slate-900">{mat.name}</h3>
                <button onClick={() => setActiveDetailMateria(null)} className="text-slate-400 font-bold text-xl">×</button>
              </div>
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold uppercase text-slate-700">Notas de Parciales e Intentos de Final</h4>
                <div className="grid grid-cols-3 gap-2">
                  <input type="number" placeholder="Parcial 1" value={st.parcial1 || ''} onChange={(e) => handleUpdateMateria(mat.id, 'parcial1', e.target.value)} className="bg-white border rounded-lg p-2 text-xs text-center" />
                  <input type="number" placeholder="Parcial 2" value={st.parcial2 || ''} onChange={(e) => handleUpdateMateria(mat.id, 'parcial2', e.target.value)} className="bg-white border rounded-lg p-2 text-xs text-center" />
                  <input type="number" placeholder="Final" value={st.final1 || ''} onChange={(e) => handleUpdateMateria(mat.id, 'final1', e.target.value)} className="bg-amber-50 border border-amber-300 rounded-lg p-2 text-xs text-center" />
                </div>
              </div>
              <div className="flex justify-end"><button onClick={() => setActiveDetailMateria(null)} className="bg-slate-900 text-white text-xs font-bold px-5 py-2.5 rounded-xl">Guardar y Cerrar</button></div>
            </div>
          </div>
        );
      })()}

      {showSeminarioModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Bookmark className="w-5 h-5 text-sky-600" /> Catálogo de Seminarios (2C 2026)</h3>
              <button onClick={() => setShowSeminarioModal(false)} className="text-slate-400 font-bold text-lg">×</button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {seminariosOferta.map(s => (
                <div key={s.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-200 gap-3">
                  <div className="space-y-1 flex-1">
                    <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-900">{s.tipo.toUpperCase()}</span>
                    <p className="font-bold text-slate-800 text-xs mt-1">{s.nombre}</p>
                    <p className="text-[11px] text-slate-500">{s.docente}</p>
                  </div>
                  <button onClick={() => { handleAgregarSeminarioAElectivas(s); setShowSeminarioModal(false); setActiveBlock('electivas'); }} className="flex items-center justify-center gap-1.5 bg-sky-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition">
                    <Plus className="w-4 h-4" /> Agregar a mis Electivas
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-end"><button onClick={() => setShowSeminarioModal(false)} className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl">Cerrar</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
