import React, { useState, useEffect, useRef } from 'react';
import { PLANS_DATA } from './data/plans';
import { DonutChart } from './components/DonutChart';
import { supabase } from './supabaseClient';
import { 
  BookOpen, Award, AlertCircle, 
  Bookmark, User, LogOut, Trash2, 
  Mail, Users, FileText, CheckSquare, Layers, Loader2,
  Share2, Download, RefreshCw, Sparkles,
  Star, Trophy, Coffee, Copy, Check, Plus, Camera, Heart
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
  { id: 'sem-10', tipo: 'sociocultural', nombre: 'PST: LAS EMPRESAS AUTOGESTIONADAS FRENTE AL PLURIEMPLEO, EL CAPITALISMO DE PLATAFORMAS Y LA SUPEREXPLOTACIÓN DEL TRABAJO EN ULTRALIBERALISMO', docente: 'PROF. Andres Eduardo Ruggeri y PROF. Natalia POLTI', cuatrimestre: '2C 2026' },
  { id: 'sem-11', tipo: 'arqueologia', nombre: 'TEORÍA, INTERDISCIPLINARIEDAD Y DEBATES CONTEMPORÁNEOS EN ARQUEOLOGÍA HISTÓRICA', docente: 'PROF. María Jimena CRUZ y Melisa SALERNO', cuatrimestre: '2C 2026' },
  { id: 'sem-12', tipo: 'arqueologia', nombre: 'LA CULTURA BAJO UNA NUEVA PERSPECTIVA EVOLUTIVA.', docente: 'PROF. Viviana SCHEINSOHN', cuatrimestre: '2C 2026' },
  { id: 'sem-13', tipo: 'sociocultural', nombre: 'PST: PRODUCCIÓN Y GESTIÓN DE PROYECTOS CULTURALES EN FILO', docente: 'PROF. Victoria Julia LENCINA (Depto de Artes)', cuatrimestre: '2C 2026' },
  { id: 'sem-14', tipo: 'sociocultural', nombre: 'PST: DIÁLOGOS ENTRE ARTE Y EDUCACIÓN EN EL MUSEO ETNOGRÁFICO', docente: 'PROF. Mariana Denise LUTERSTEIN y PROF. María Eugenia LANZA (Depto de Artes)', cuatrimestre: '2C 2026' },
  { id: 'sem-15', tipo: 'sociocultural', nombre: 'PST: CONSTRUCCIÓN DE UN ESPACIO DE RECREACIÓN EDUCATIVA PARA LAS INFANCIAS EN EL CIDAC', docente: 'PROF. Anahi GUELMAN y PROF. Mariel KAROLONSKI (Depto de Cs. de la Educación)', cuatrimestre: '2C 2026' },
  { id: 'sem-16', tipo: 'sociocultural', nombre: 'PST: SABERES Y EXPERIENCIAS AMBIENTALES EN DIÁLOGOS COMUNITARIOS. EL CASO DE LA COOPERATIVA RECUPERADORES URBANOS DEL OESTE', docente: 'PROF. María Inés CARABAJAL y PROF. Lia Inés BACHMAN (Depto de Geografía)', cuatrimestre: '2C 2026' }
];

const AVATARES_ANTROPOLOGIA = [
  { id: 'anonimo', nombre: 'Estudiante Puaner', rol: 'Espíritu libre de Puan', emoji: '☕', img: '/avatares/anonimo.jpg' },
  { id: 'boas', nombre: 'Franz Boas', rol: 'Padre del Particularismo Histórico', emoji: '📚', img: '/avatares/franz-boas.jpg' },
  { id: 'malinowski', nombre: 'Bronisław Malinowski', rol: 'Trabajo de Campo / Funcionalismo', emoji: '⛺', img: '/avatares/bronislaw-malinowski.jpg' },
  { id: 'mauss', nombre: 'Marcel Mauss', rol: 'Teoría del Don y Sociología', emoji: '🎁', img: '/avatares/marcel-mauss.jpg' },
  { id: 'levis', nombre: 'Claude Lévi-Strauss', rol: 'Estructuralismo Antropológico', emoji: '🧩', img: '/avatares/claude-levi-strauss.jpg' },
  { id: 'mead', nombre: 'Margaret Mead', rol: 'Cultura, Género e Infancia', emoji: '🌴', img: '/avatares/margaret-mead.jpg' },
  { id: 'benedict', nombre: 'Ruth Benedict', rol: 'Cultura y Personalidad', emoji: '🎭', img: '/avatares/ruth-benedict.jpg' },
  { id: 'geertz', nombre: 'Clifford Geertz', rol: 'Antropología Simbólica e Interpretativa', emoji: '✍️', img: '/avatares/clifford-geertz.jpg' },
  { id: 'sahlins', nombre: 'Marshall Sahlins', rol: 'Antropología Económica y Simbólica', emoji: '🏝️', img: '/avatares/marshall-sahlins.jpg' },
  { id: 'douglas', nombre: 'Mary Douglas', rol: 'Riesgo, Pureza y Símbolos', emoji: '⚖️', img: '/avatares/mary-douglas.jpg' },
  { id: 'turner', nombre: 'Victor Turner', rol: 'Ritual y Liminidad', emoji: '🌿', img: '/avatares/victor-turner.jpg' },
  { id: 'gluckman', nombre: 'Max Gluckman', rol: 'Escuela de Mánchester y Conflictos', emoji: '⚖️', img: '/avatares/max-gluckman.jpg' },
  { id: 'leach', nombre: 'Edmund Leach', rol: 'Estructuralismo Británico', emoji: '🌐', img: '/avatares/edmund-leach.jpg' },
  { id: 'graeber', nombre: 'David Graeber', rol: 'Antropología Económica y Anarquista', emoji: '✊', img: '/avatares/david-graeber.jpg' },
  { id: 'segato', nombre: 'Rita Segato', rol: 'Antropología Feminista y Violencia', emoji: '🔥', img: '/avatares/rita-segato.jpg' },
  { id: 'foucault', nombre: 'Michel Foucault', rol: 'Poder, Saber y Biopolítica', emoji: '🔍', img: '/avatares/michael-foucault.jpg' },
  { id: 'viveiros', nombre: 'Eduardo Viveiros de Castro', rol: 'Antropología Ontológica y Perspectivismo', emoji: '🐆', img: '/avatares/eduardo-viveiros-de-castro.jpg' }
];

// Función auxiliar de redondeo UBA XXI (CBC)
const redondearUBAXXI = (promedio) => {
  if (promedio >= 3.01 && promedio <= 3.99) {
    return 3;
  }
  const decimales = Number((promedio - Math.floor(promedio)).toFixed(4));
  if (decimales >= 0.5) {
    return Math.ceil(promedio);
  }
  return Math.floor(promedio);
};

// Función auxiliar de redondeo FFyL (.5 a favor del estudiante)
const redondearFFyL = (promedio) => {
  const decimales = Number((promedio - Math.floor(promedio)).toFixed(4));
  if (decimales >= 0.5) {
    return Math.ceil(promedio);
  }
  return Math.floor(promedio);
};

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
  const [avatarActual, setAvatarActual] = useState(() => {
    const savedAvatar = localStorage.getItem('antropologia_avatar');
    if (savedAvatar) {
      try {
        const parsed = JSON.parse(savedAvatar);
        return AVATARES_ANTROPOLOGIA.find(a => a.id === parsed.id) || parsed;
      } catch (e) { }
    }
    return AVATARES_ANTROPOLOGIA[4];
  });

  const [toastMessage, setToastMessage] = useState(null);
  const [studentData, setStudentData] = useState(() => {
    const savedData = localStorage.getItem('antropologia_guest_data');
    if (savedData) {
      try { return JSON.parse(savedData); } catch (e) { }
    }
    return { '2023': {}, '1985': {} };
  });

  useEffect(() => {
    if (session && session.tipo === 'registrado') {
      cargarDatosNube(session.email);
    } else if (session && session.tipo === 'invitado') {
      const savedGuest = localStorage.getItem('antropologia_guest_data');
      if (savedGuest) {
        try { setStudentData(JSON.parse(savedGuest)); } catch (e) { setStudentData({ '2023': {}, '1985': {} }); }
      }
    }
  }, [session]);

  const cargarDatosNube = async (email) => {
    setLoadingCloud(true);
    try {
      const { data, error } = await supabase
        .from('estudiantes')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (error) {
        console.error("Error consultando Supabase:", error);
      }

      if (data) {
        const datosRecibidos = data.datos_academicos || { '2023': {}, '1985': {} };
        setStudentData(datosRecibidos);
        setSeminariosOferta(SEMINARIOS_OFERTA_2C_2026);

        if (data.plan_actual) setSelectedPlan(data.plan_actual);
        if (data.orientacion_actual) setSelectedOrientation(data.orientacion_actual);

        const rawAvatar = data.avatar || datosRecibidos._avatar;
        if (rawAvatar) {
          const avatarId = typeof rawAvatar === 'string' ? rawAvatar : rawAvatar.id;
          const avatarEncontrado = AVATARES_ANTROPOLOGIA.find(a => a.id === avatarId) || (typeof rawAvatar === 'object' ? rawAvatar : AVATARES_ANTROPOLOGIA[4]);
          setAvatarActual(avatarEncontrado);
          localStorage.setItem('antropologia_avatar', JSON.stringify(avatarEncontrado));
        }
      } else {
        setStudentData({ '2023': {}, '1985': {} });
      }
    } catch (err) {
      console.error("Error al conectar con Supabase:", err);
    } finally {
      setLoadingCloud(false);
    }
  };

  const guardarDatosNube = async (
    nuevoData = studentData,
    nuevosSemis = seminariosOferta,
    nuevoAvatar = avatarActual,
    nuevoPlan = selectedPlan,
    nuevaOrientacion = selectedOrientation
  ) => {
    localStorage.setItem('antropologia_guest_data', JSON.stringify(nuevoData));
    if (nuevoAvatar) {
      localStorage.setItem('antropologia_avatar', JSON.stringify(nuevoAvatar));
    }

    if (session && session.tipo === 'registrado') {
      try {
        const payloadAcademico = {
          ...nuevoData,
          _avatar: nuevoAvatar
        };

        const { error } = await supabase.from('estudiantes').update({
          datos_academicos: payloadAcademico,
          seminarios_oferta: nuevosSemis,
          plan_actual: nuevoPlan,
          orientacion_actual: nuevaOrientacion,
          avatar: nuevoAvatar,
          actualizado_en: new Date().toISOString()
        }).eq('email', session.email);

        if (error) {
          console.error("Error al actualizar en Supabase:", error);
        }
      } catch (err) {
        console.error("Error al guardar en la nube:", err);
      }
    }
  };

  const handleCambiarAvatar = (avatarObj) => {
    setAvatarActual(avatarObj);
    setShowAvatarModal(false);
    guardarDatosNube(studentData, seminariosOferta, avatarObj, selectedPlan, selectedOrientation);
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
      guardarDatosNube(updated, seminariosOferta, avatarActual, selectedPlan, selectedOrientation);
      return updated;
    });

    setToastMessage("¡Seminario agregado a tus electivas!");
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleEliminarSeminarioPersonalizado = (id) => {
    const confirmar = window.confirm("¿Estás seguro que querés eliminar este seminario?");
    if (!confirmar) return;

    setStudentData(prev => {
      const planState = { ...(prev[selectedPlan] || {}) };
      delete planState[id];

      const updated = {
        ...prev,
        [selectedPlan]: planState
      };
      guardarDatosNube(updated, seminariosOferta, avatarActual, selectedPlan, selectedOrientation);
      return updated;
    });
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
        customName: '', favorita: false, materiaElectivaCBC: ''
      };

      let updatedMat = { ...matState, [field]: value };

      const cbcIds = new Set((PLANS_DATA[selectedPlan]?.cbc || []).map(c => c.id));
      const cfgIds = new Set((PLANS_DATA[selectedPlan]?.cfg || []).map(c => c.id));
      const esMateriaCBC = cbcIds.has(id);
      const esMateriaCFG = cfgIds.has(id);

      if (['parcial1', 'parcial2', 'parcial3', 'final1', 'final2', 'final3', 'regimen'].includes(field)) {
        const reg = field === 'regimen' ? value : (updatedMat.regimen || 'promocion');
        const p1 = parseFloat(updatedMat.parcial1);
        const p2 = parseFloat(updatedMat.parcial2);
        const p3 = parseFloat(updatedMat.parcial3);

        const f1 = parseFloat(updatedMat.final1);
        const f2 = parseFloat(updatedMat.final2);
        const f3 = parseFloat(updatedMat.final3);

        let aplazosCount = 0;
        [f1, f2, f3].forEach(f => {
          if (!isNaN(f) && f > 0 && f < 4) aplazosCount++;
        });
        updatedMat.aplazos = Math.max(0, aplazosCount).toString();

        const notaAprobadaFinal = [f1, f2, f3].find(f => !isNaN(f) && f >= 4);

        if (esMateriaCBC) {
          const instanciasParciales = [p1, p2].filter(n => !isNaN(n) && n >= 0);
          const promParcialesExacto = instanciasParciales.length === 2
            ? (instanciasParciales[0] + instanciasParciales[1]) / 2
            : (instanciasParciales.length === 1 ? instanciasParciales[0] : null);

          if (notaAprobadaFinal !== undefined) {
            updatedMat.nota = notaAprobadaFinal.toString();
          } else if (promParcialesExacto !== null) {
            const notaEnteraCBC = redondearUBAXXI(promParcialesExacto);
            updatedMat.nota = notaEnteraCBC.toString();

            if (instanciasParciales.length === 2 && field !== 'regimen') {
              if (notaEnteraCBC >= 7) {
                updatedMat.regimen = 'promocion';
              } else if (notaEnteraCBC >= 4 && notaEnteraCBC < 7) {
                updatedMat.regimen = 'final';
              }
            }
          }
        } else if (esMateriaCFG) {
          const instanciasParciales = (reg === 'promocion' ? [p1, p2, p3] : [p1, p2])
            .filter(n => !isNaN(n) && n >= 0);
          const promParcialesExacto = instanciasParciales.length > 0
            ? instanciasParciales.reduce((a, b) => a + b, 0) / instanciasParciales.length
            : null;
          const notaParcialesRedondeada = promParcialesExacto !== null ? redondearFFyL(promParcialesExacto) : null;

          const intentosFinales = [f1, f2, f3].filter(n => !isNaN(n) && n >= 0);

          if (notaAprobadaFinal !== undefined && intentosFinales.length > 0) {
            const promFinales = intentosFinales.reduce((a, b) => a + b, 0) / intentosFinales.length;
            if (promParcialesExacto !== null) {
              const notaDefinitiva = redondearFFyL((promParcialesExacto + promFinales) / 2);
              updatedMat.nota = notaDefinitiva.toString();
            } else {
              updatedMat.nota = redondearFFyL(promFinales).toString();
            }
          } else if (notaParcialesRedondeada !== null) {
            updatedMat.nota = notaParcialesRedondeada.toString();
          }
        } else {
          if (notaAprobadaFinal !== undefined) {
            updatedMat.nota = notaAprobadaFinal.toString();
          } else if (reg === 'promocion') {
            const validas = [p1, p2, p3].filter(n => !isNaN(n) && n >= 1);
            if (validas.length > 0) {
              const promParciales = validas.reduce((a, b) => a + b, 0) / validas.length;
              updatedMat.nota = Math.round(promParciales).toString();
            }
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

      // GUARDADO INMEDIATO EN LOCAL Y NUBE
      guardarDatosNube(updated, seminariosOferta, avatarActual, selectedPlan, selectedOrientation);
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
      case 'electivas': return planObj.electivas || planObj.electivas || [];
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

  let sumNotasPromedio = 0;
  let countNotasPromedio = 0;
  let notasAprobadasList = [];

  const idiomasIds = new Set((planObj.idiomas || []).map(i => i.id));
  const cbcIdsSet = new Set((planObj.cbc || []).map(c => c.id));
  const cfgIdsSet = new Set((planObj.cfg || []).map(c => c.id));

  currentMateriasAll.forEach(m => {
    const st = studentData[selectedPlan]?.[m.id] || {};
    const estado = st.estado || 'pendiente';
    const notaNum = st.nota !== '' && !isNaN(st.nota) ? parseFloat(st.nota) : null;
    const esIdioma = idiomasIds.has(m.id);
    const esCFGMat = cfgIdsSet.has(m.id);

    if (st.favorita) favoritasCount++;

    if (estado === 'aprobada') {
      aprobadasCount++;
      if (notaNum !== null && notaNum >= 4 && !esIdioma) {
        sumNotasPromedio += notaNum;
        countNotasPromedio++;
        const nombreMostrar = cbcIdsSet.has(m.id) && st.materiaElectivaCBC ? st.materiaElectivaCBC : m.name;
        notasAprobadasList.push({ name: st.customName ? `${nombreMostrar}: ${st.customName}` : nombreMostrar, nota: notaNum });
      }

      if (!esIdioma && !esCFGMat) {
        [st.final1, st.final2, st.final3].forEach(fVal => {
          const fNum = parseFloat(fVal);
          if (!isNaN(fNum) && fNum > 0 && fNum < 4) {
            sumNotasPromedio += fNum;
            countNotasPromedio++;
          }
        });
      }
    } else if (estado === 'regularizada') { regularizadasCount++; } 
    else if (estado === 'cursando') { cursandoCount++; } 
    else { pendientesCount++; }
  });

  notasAprobadasList.sort((a, b) => b.nota - a.nota);
  const podioTop3 = notasAprobadasList.slice(0, 3);

  const promedioGeneralUBA = countNotasPromedio > 0 ? (sumNotasPromedio / countNotasPromedio).toFixed(2) : '-';
  const totalMaterias = currentMateriasAll.length;
  const porcentajeAvance = totalMaterias > 0 ? Math.round((aprobadasCount / totalMaterias) * 100) : 0;

  const getMotivationalQuotes = (pct) => {
    if (pct >= 100) {
      return [
        `¡100% completado! Oficialmente en la meta del título de Antropología 🎓✨`,
        `Todo el esfuerzo de Puan valió la pena: 100% adentro. ¡A celebrar! 🥂🌿`,
        `De Filo UBA al mundo: carrera terminada. ¡Lo lograste! 🏆🚀`
      ];
    }
    if (pct >= 70) {
      return [
        `¡Ya estás al ${pct}% de tu carrera! Falta poco, sigue así, ¡vamos que tú puedes! 🔥🎓`,
        `Huele a tesis: ${pct}% de la carrera aprobado. El último tirón es tuyo 📖🚀`,
        `Con el ${pct}% adentro, la recta final ya se siente cerquita. ¡A no aflojar! 💪✨`
      ];
    }
    if (pct >= 50) {
      return [
        `¡Ya pasamos la mitad del camino (${pct}%)! El recorrido viene excelente 🚀📚`,
        `Mitad de carrera adentro (${pct}%). De acá en adelante, cada materia se disfruta el doble 🌿✨`,
        `Cruzando el ${pct}% de Ciencias Antropológicas. ¡La base ya está súper firme! 💪🔥`
      ];
    }
    if (pct >= 25) {
      return [
        `Camino al 50%: ya tenés el ${pct}% adentro. ¡Cada parcial suma un montón! 📝🔥`,
        `Construyendo el trayecto académico: ${pct}% completado. ¡A seguir con ese ritmo! 🌿📖`,
        `Marchando firmes en Filo UBA: ${pct}% de la carrera aprobada 🚀✨`
      ];
    }
    return [
      `Arrancando el camino en Antropología: ya llevás el ${pct}% de la carrera 🌱📚`,
      `Recién empieza el viaje en Puan: ${pct}% completado. ¡A meterle con todo! ✨🚀`,
      `Primeros pasos en la facultad: ${pct}% adentro. ¡Vamos por más! 💪🎓`
    ];
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
    ctx.fillText(`${promedioGeneralUBA}`, W / 2 + 210, 1345);

    ctx.fillStyle = '#B3EBF2';
    ctx.font = 'bold 38px sans-serif';
    ctx.textAlign = 'center';
    
    const maxWidth = W - 200;
    const words = currentQuote.split(' ');
    let line = '';
    let lines = [];

    for (let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + ' ';
      let metrics = ctx.measureText(testLine);
      let testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    let startQuoteY = lines.length > 1 ? 1470 : 1490;
    for (let k = 0; k < lines.length; k++) {
      ctx.fillText(lines[k], W / 2, startQuoteY + (k * 50));
    }

    ctx.fillStyle = '#64748b';
    ctx.font = '600 28px sans-serif';
    const userDisplay = session?.nombre && session.nombre !== 'Invitado' ? `${session.nombre} ${session.apellido}` : 'Estudiante de Antropología';
    ctx.fillText(`${userDisplay} · gestorantropologia.uba`, W / 2, 1800);

  }, [showShareModal, quoteIndex, porcentajeAvance, aprobadasCount, regularizadasCount, cursandoCount, totalMaterias, promedioGeneralUBA, selectedPlan, selectedOrientation, session, currentQuote]);

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
                        const avatarPorDefecto = AVATARES_ANTROPOLOGIA[4];
                        const datosVacios = { '2023': {}, '1985': {}, _avatar: avatarPorDefecto };
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
                <button onClick={() => { setSession({ nombre: 'Invitado', apellido: '', email: 'invitado@uba', tipo: 'invitado' }); }} className="w-full bg-sky-100 hover:bg-sky-200 text-sky-900 border border-sky-300 font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-2">
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
              Invitame un mate 🧉
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
                      <img src={avatarActual.img} alt={avatarActual.nombre} className="w-8 h-8 rounded-full object-cover border-2 border-sky-400 shadow-sm" />
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
                  <button onClick={() => { setSession(null); }} className="flex items-center gap-1 bg-red-700/80 hover:bg-red-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg transition ml-2 shadow-sm">
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
                <select
                  value={selectedPlan}
                  onChange={(e) => {
                    const nuevoP = e.target.value;
                    setSelectedPlan(nuevoP);
                    guardarDatosNube(studentData, seminariosOferta, avatarActual, nuevoP, selectedOrientation);
                  }}
                  className="bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold rounded-xl px-3 py-1.5 outline-none"
                >
                  {Object.entries(PLANS_DATA).map(([key, p]) => (<option key={key} value={key}>{p.name}</option>))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Orientación:</span>
                <select
                  value={selectedOrientation}
                  onChange={(e) => {
                    const nuevaO = e.target.value;
                    setSelectedOrientation(nuevaO);
                    guardarDatosNube(studentData, seminariosOferta, avatarActual, selectedPlan, nuevaO);
                  }}
                  className="bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold rounded-xl px-3 py-1.5 outline-none"
                >
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
              <button onClick={() => setShowSeminarioModal(true)} className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition">
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
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[11px] uppercase tracking-wider text-sky-300 font-bold flex items-center gap-1.5"><Award className="w-4 h-4 text-sky-400" /> Promedio UBA</span>
                  <span className="bg-sky-800/80 text-sky-200 text-[10px] px-2 py-0.5 rounded-full font-semibold">con aplazos</span>
                </div>
                
                <div className="flex items-baseline gap-1.5 my-0.5">
                  <span className="text-6xl font-black tracking-tight text-white">{promedioGeneralUBA}</span>
                  <span className="text-base font-bold text-sky-300">/ 10</span>
                </div>
                
                <div className="mt-1.5 bg-sky-950/80 border border-sky-400/30 rounded-xl p-2 text-[10px] text-sky-100 leading-snug flex items-start gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5 fill-rose-400" />
                  <span>El promedio no te define, tranquilx. Vos solo seguí esforzándote que tiempo para mejorar, siempre hay.</span>
                </div>
              </div>

              <button onClick={() => setShowShareModal(true)} className="w-full mt-2.5 bg-white/10 hover:bg-white/20 text-sky-100 border border-sky-400/30 text-[11px] font-bold py-2 rounded-xl transition flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-300" /> Tarjeta IG / WhatsApp
              </button>
            </div>

            <div className="lg:col-span-3 bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider font-black text-slate-700 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-500" /> Podio de Notas (Top 3)
                </span>
                <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-500" /> {favoritasCount} favs
                </span>
              </div>

              <div className="space-y-2">
                {podioTop3.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">Aún no hay notas cargadas</p>
                ) : (
                  podioTop3.map((item, idx) => {
                    const medallas = ['🥇', '🥈', '🥉'];
                    const coloresBorde = ['border-amber-300 bg-amber-50/50', 'border-slate-300 bg-slate-50', 'border-amber-700/30 bg-amber-950/5'];
                    return (
                      <div key={idx} className={`border rounded-xl p-2 flex items-center justify-between gap-2 ${coloresBorde[idx]}`}>
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="text-sm shrink-0">{medallas[idx]}</span>
                          <p className="text-[11px] font-bold text-slate-800 truncate" title={item.name}>{item.name}</p>
                        </div>
                        <span className="text-xs font-black px-2 py-0.5 bg-white rounded-md border shadow-2xs shrink-0 text-slate-900">
                          {item.nota}
                        </span>
                      </div>
                    );
                  })
                )}
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
                const regimenActual = st.regimen || (m.regimen === 'final' ? 'final' : 'promocion');
                const esPromocional = regimenActual === 'promocion';
                const esFavorita = Boolean(st.favorita);
                const esMateriaCBC = cbcIdsSet.has(m.id);
                const esMateriaCFG = cfgIdsSet.has(m.id);

                return (
                  <div key={m.id} className="p-4 sm:p-5 hover:bg-slate-50 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">{m.etapa}</span>
                        <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${esPromocional ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'}`}>
                          {esPromocional ? '✨ Promocional' : '📝 Examen Final Obligatorio'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <button type="button" onClick={() => handleUpdateMateria(m.id, 'favorita', !esFavorita)} className="p-1 rounded-lg hover:bg-amber-50 transition">
                          <Star className={`w-5 h-5 transition ${esFavorita ? 'fill-amber-400 text-amber-500 scale-110' : 'text-slate-300'}`} />
                        </button>
                        {esMateriaCBC ? (
                          <div>
                            <h3 className="font-bold text-slate-800 text-base">{st.materiaElectivaCBC || m.name}</h3>
                            {st.customName && (
                              <p className="text-xs font-semibold text-sky-700 mt-0.5">({st.customName})</p>
                            )}
                          </div>
                        ) : esMateriaCFG ? (
                          <div>
                            <h3 className="font-bold text-slate-800 text-base">{m.name}</h3>
                            {st.customName && (
                              <p className="text-xs font-semibold text-sky-700 mt-0.5">({st.customName})</p>
                            )}
                          </div>
                        ) : (
                          <h3 className="font-bold text-slate-800 text-base">{st.customName ? `${m.name}: ${st.customName}` : m.name}</h3>
                        )}
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
                      {(st.estado === 'aprobada' || ((esMateriaCBC || esMateriaCFG) && st.nota !== '')) && (
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
          Invitame un mate 🧉
        </button>
      </footer>

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
                      <img src={av.img} alt={av.nombre} className="w-16 h-16 rounded-full object-cover shadow-md border-2 border-white" />
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
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">🧉 Reciprocidad puaner</h3>
              <button onClick={() => setShowDonateModal(false)} className="text-slate-400 font-bold text-xl">×</button>
            </div>
            <p className="text-xs text-slate-600">
              En este ciclo constante de <strong>dar, recibir y devolver</strong>, si el gestor te resulta útil para gestionar tu carrera y querés apoyar el proyecto con un mate virtual, ¡muchas gracias!
            </p>
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
            <div className="flex justify-center bg-slate-100 p-3 rounded-2xl border border-slate-200 relative">
              <canvas ref={canvasRef} width={1080} height={1920} className="w-56 h-auto rounded-xl shadow-lg border border-slate-300" />
            </div>
            <div className="flex items-center justify-between gap-2">
              <button type="button" onClick={() => setQuoteIndex(prev => prev + 1)} className="flex items-center justify-center gap-1.5 bg-sky-100 hover:bg-sky-200 text-sky-900 text-xs font-bold py-3 px-3 rounded-xl transition border border-sky-300" title="Cambiar frase">
                <RefreshCw className="w-4 h-4 text-sky-700" /> Cambiar frase
              </button>
              <button type="button" onClick={handleDownloadStory} className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 rounded-xl transition">
                <Download className="w-4 h-4" /> Descargar PNG
              </button>
              <button type="button" onClick={handleNativeShare} className="flex-1 flex items-center justify-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold py-3 rounded-xl transition">
                <Share2 className="w-4 h-4" /> Compartir
              </button>
            </div>
          </div>
        </div>
      )}

      {activeDetailMateria && (() => {
        const mat = activeDetailMateria;
        const st = studentData[selectedPlan]?.[mat.id] || {};
        const regimenActual = st.regimen || (mat.regimen === 'final' ? 'final' : 'promocion');
        const esPromocional = regimenActual === 'promocion';

        const esCBC = activeBlock === 'cbc' || cbcIdsSet.has(mat.id);
        const esCFG = activeBlock === 'cfg' || cfgIdsSet.has(mat.id);
        const esIdioma = activeBlock === 'idiomas';
        const esElectiva = activeBlock === 'electivas';

        const p1 = parseFloat(st.parcial1);
        const p2 = parseFloat(st.parcial2);
        const p3 = parseFloat(st.parcial3);

        const f1 = parseFloat(st.final1);
        const f2 = parseFloat(st.final2);
        const f3 = parseFloat(st.final3);

        const instanciasCBC = [p1, p2].filter(n => !isNaN(n) && n >= 0);
        const promedioExactoCBC = instanciasCBC.length === 2 ? (instanciasCBC[0] + instanciasCBC[1]) / 2 : null;
        const notaFinalCBC = promedioExactoCBC !== null ? redondearUBAXXI(promedioExactoCBC) : null;

        const instanciasCFG = (esPromocional ? [p1, p2, p3] : [p1, p2]).filter(n => !isNaN(n) && n >= 0);
        const promedioExactoCFG = instanciasCFG.length > 0
          ? (instanciasCFG.reduce((a, b) => a + b, 0) / instanciasCFG.length)
          : null;
        const notaParcialesCFG = promedioExactoCFG !== null ? redondearFFyL(promedioExactoCFG) : null;

        const intentosFinalesCFG = [f1, f2, f3].filter(n => !isNaN(n) && n >= 0);
        const promedioFinalesCFG = intentosFinalesCFG.length > 0
          ? (intentosFinalesCFG.reduce((a, b) => a + b, 0) / intentosFinalesCFG.length)
          : null;
        const notaFinalAprobadaCFG = [f1, f2, f3].find(f => !isNaN(f) && f >= 4);
        const notaDefinitivaCFG = (notaFinalAprobadaCFG !== undefined && promedioFinalesCFG !== null && promedioExactoCFG !== null)
          ? redondearFFyL((promedioExactoCFG + promedioFinalesCFG) / 2)
          : null;

        const validasParciales = [p1, p2, p3].filter(n => !isNaN(n) && n >= 1);
        const promedioParcialesCalc = validasParciales.length > 0 ? (validasParciales.reduce((a, b) => a + b, 0) / validasParciales.length) : 0;

        const logroPromocion = esCBC
          ? (notaFinalCBC !== null && notaFinalCBC >= 7)
          : esCFG
            ? (esPromocional && instanciasCFG.length === 3 && notaParcialesCFG !== null && notaParcialesCFG >= 7)
            : (esPromocional && validasParciales.length >= 2 && promedioParcialesCalc >= 7);

        const vaAFinalIndirectoCBC = esCBC && notaFinalCBC !== null && notaFinalCBC >= 4 && notaFinalCBC < 7;
        const reprobadoParcialesCBC = esCBC && notaFinalCBC !== null && notaFinalCBC < 4;

        const vaAFinalCFG = esCFG && !logroPromocion && (
          (esPromocional && instanciasCFG.length === 3 && notaParcialesCFG !== null && notaParcialesCFG >= 4 && notaParcialesCFG < 7) ||
          (!esPromocional && instanciasCFG.length === 2 && notaParcialesCFG !== null && notaParcialesCFG >= 4)
        );
        const reprobadoParcialesCFG = esCFG && (
          (esPromocional && instanciasCFG.length === 3 && notaParcialesCFG !== null && notaParcialesCFG < 4) ||
          (!esPromocional && instanciasCFG.length === 2 && notaParcialesCFG !== null && notaParcialesCFG < 4)
        );

        const ocultarTercerParcial = esCBC || (esCFG && !esPromocional);

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

              {esCBC && (() => {
                const nombreOriginalLower = mat.name.toLowerCase();
                const esEleccionCBC = nombreOriginalLower.includes('elección') || nombreOriginalLower.includes('eleccion') || nombreOriginalLower.includes('cbc 1') || nombreOriginalLower.includes('cbc 2');
                const nombreMat = (esEleccionCBC && st.materiaElectivaCBC ? st.materiaElectivaCBC : mat.name).toLowerCase();
                let opcionesCatedras = [];

                if (nombreMat.includes('antropología')) {
                  opcionesCatedras = ['Cátedra Vargas'];
                } else if (nombreMat.includes('filosofía')) {
                  opcionesCatedras = ['Cátedra Beraldi'];
                } else if (nombreMat.includes('sociedad y estado')) {
                  opcionesCatedras = ['Cátedra Denkberg', 'Cátedra Pedrosa'];
                } else if (nombreMat.includes('pensamiento científico')) {
                  opcionesCatedras = ['Cátedra Buacar', 'Cátedra Gimeno', 'Cátedra Perot'];
                } else if (nombreMat.includes('economía')) {
                  opcionesCatedras = ['Cátedra Di Pelino', 'Cátedra Miliá'];
                } else if (nombreMat.includes('psicología')) {
                  opcionesCatedras = ['Cátedra Quattrocchi', 'Cátedra Fiotti'];
                } else if (nombreMat.includes('semiología')) {
                  opcionesCatedras = ['Cátedra Verzero'];
                } else if (nombreMat.includes('sociología')) {
                  opcionesCatedras = ['Cátedra Bustos'];
                } else {
                  opcionesCatedras = ['Cátedra Denkberg', 'Cátedra Pedrosa'];
                }

                return (
                  <div className="space-y-3 bg-sky-50 p-4 rounded-xl border border-sky-200">
                    {esEleccionCBC && (
                      <div>
                        <label className="text-xs font-bold uppercase text-sky-900 block mb-1">Seleccione la Materia Electiva:</label>
                        <select
                          value={st.materiaElectivaCBC || ''}
                          onChange={(e) => {
                            handleUpdateMateria(mat.id, 'materiaElectivaCBC', e.target.value);
                            handleUpdateMateria(mat.id, 'customName', '');
                          }}
                          className="w-full bg-white border border-sky-300 rounded-lg p-2 text-xs font-semibold"
                        >
                          <option value="">-- Seleccionar materia --</option>
                          <option value="Sociología">Sociología</option>
                          <option value="Semiología">Semiología</option>
                          <option value="Economía">Economía</option>
                          <option value="Psicología">Psicología</option>
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-bold uppercase text-sky-900 block mb-1">Seleccione la Cátedra del CBC:</label>
                      <select
                        value={st.customName || ''}
                        onChange={(e) => handleUpdateMateria(mat.id, 'customName', e.target.value)}
                        className="w-full bg-white border border-sky-300 rounded-lg p-2 text-xs font-semibold"
                      >
                        <option value="">-- Seleccionar cátedra --</option>
                        {opcionesCatedras.map((cat, idx) => (
                          <option key={idx} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })()}

              {esCFG && (() => {
                const nombreMat = mat.name.toLowerCase();
                let opcionesCatedrasCFG = [];

                if (nombreMat.includes('epistemología')) {
                  opcionesCatedrasCFG = ['Cátedra Glavich', 'Cátedra Hernández'];
                } else if (nombreMat.includes('historia y teoría de la antropología i')) {
                  opcionesCatedrasCFG = ['Cátedra Roca'];
                } else if (nombreMat.includes('historia y teoría de la antropología ii')) {
                  opcionesCatedrasCFG = ['Cátedra Brac', 'Cátedra Garaño'];
                } else if (nombreMat.includes('problemas de antropología económica')) {
                  opcionesCatedrasCFG = ['Cátedra Petz-Scaglia'];
                } else if (nombreMat.includes('problemas de antropología simbólica')) {
                  opcionesCatedrasCFG = ['Cátedra Wright'];
                } else if (nombreMat.includes('antropología biológica')) {
                  opcionesCatedrasCFG = ['Cátedra Avena'];
                } else if (nombreMat.includes('introducción a la arqueología')) {
                  opcionesCatedrasCFG = ['Cátedra Lanza'];
                } else if (nombreMat.includes('arqueología, legislación y comunidad')) {
                  opcionesCatedrasCFG = ['Cátedra Salerno'];
                } else if (nombreMat.includes('problemas de antropología social y política')) {
                  opcionesCatedrasCFG = ['Cátedra Novaro', 'Cátedra Balbi', 'Cátedra Fernández', 'Cátedra Pita'];
                } else {
                  opcionesCatedrasCFG = ['Cátedra Única / General'];
                }

                return (
                  <div className="space-y-2 bg-sky-50 p-4 rounded-xl border border-sky-200">
                    <label className="text-xs font-bold uppercase text-sky-900 block">Seleccione la Cátedra del CFG:</label>
                    <select
                      value={st.customName || ''}
                      onChange={(e) => handleUpdateMateria(mat.id, 'customName', e.target.value)}
                      className="w-full bg-white border border-sky-300 rounded-lg p-2 text-xs font-semibold"
                    >
                      <option value="">-- Seleccionar cátedra --</option>
                      {opcionesCatedrasCFG.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                );
              })()}

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
                {esCBC && (
                  <div className="mt-2 bg-white border border-slate-200 rounded-lg p-2.5 text-[10px] text-slate-600 space-y-1 leading-relaxed">
                    <p className="font-bold text-slate-800">Régimen de Evaluación CBC / UBA XXI:</p>
                    <p>• <strong>Promoción directa:</strong> promedio de las 2 instancias parciales ≥ 7 puntos (sin examen final).</p>
                    <p>• <strong>Promoción indirecta:</strong> promedio entre 4 y 6,99 puntos → rinde examen final (aprueba con ≥ 4; validez de 3 turnos consecutivos).</p>
                    <p>• <strong>Redondeo:</strong> ≥ 0,50 sube; ≤ 0,49 baja; entre 3,01 y 3,99 redondea siempre hacia abajo (3).</p>
                  </div>
                )}
                {esCFG && (
                  <div className="mt-2 bg-white border border-slate-200 rounded-lg p-2.5 text-[10px] text-slate-600 space-y-1 leading-relaxed">
                    <p className="font-bold text-slate-800">Régimen de Evaluación CFG (FFyL):</p>
                    <p>• <strong>Promocional:</strong> promedio de 3 parciales ≥ 7 puntos promociona directo (con .5 a favor). Si no llega a 7, rinde final.</p>
                    <p>• <strong>Final obligatorio:</strong> promedio de 2 parciales ≥ 4 puntos habilita a rendir final (con .5 a favor).</p>
                    <p>• <strong>Nota definitiva con final:</strong> se promedian todos los intentos de final rendidos (hasta 3), y ese resultado se promedia con el promedio de parciales.</p>
                  </div>
                )}
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
                
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-600 block">Notas de Parciales / Regularidad</span>
                  <div className={`grid ${ocultarTercerParcial ? 'grid-cols-2' : 'grid-cols-3'} gap-2`}>
                    <div>
                      <span className="text-[9px] font-bold text-slate-500 block mb-1">1er Parcial</span>
                      <input type="number" min="0" max="10" step="0.01" placeholder="Nota" value={st.parcial1 || ''} onChange={(e) => handleUpdateMateria(mat.id, 'parcial1', e.target.value)} className="w-full bg-white border rounded-lg p-2 text-xs text-center font-bold" />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-500 block mb-1">2do Parcial</span>
                      <input type="number" min="0" max="10" step="0.01" placeholder="Nota" value={st.parcial2 || ''} onChange={(e) => handleUpdateMateria(mat.id, 'parcial2', e.target.value)} className="w-full bg-white border rounded-lg p-2 text-xs text-center font-bold" />
                    </div>
                    {!ocultarTercerParcial && (
                      <div>
                        <span className="text-[9px] font-bold text-slate-500 block mb-1">{esCFG ? '3er Parcial' : '3ro / Recup'}</span>
                        <input type="number" min="0" max="10" step="0.01" placeholder="Nota" value={st.parcial3 || ''} onChange={(e) => handleUpdateMateria(mat.id, 'parcial3', e.target.value)} className="w-full bg-white border rounded-lg p-2 text-xs text-center font-bold" />
                      </div>
                    )}
                  </div>

                  {esCBC && promedioExactoCBC !== null && (
                    <div className="bg-sky-50 border border-sky-200 text-sky-900 p-2.5 rounded-xl text-xs flex items-center justify-between mt-2">
                      <span>Promedio parciales: <strong>{promedioExactoCBC.toFixed(2)}</strong></span>
                    </div>
                  )}

                  {esCFG && promedioExactoCFG !== null && (
                    <div className="bg-sky-50 border border-sky-200 text-sky-900 p-2.5 rounded-xl text-xs flex items-center justify-between mt-2">
                      <span>Promedio parciales: <strong>{promedioExactoCFG.toFixed(2)}</strong> (Redondeo: <strong>{notaParcialesCFG}</strong>)</span>
                    </div>
                  )}

                  {logroPromocion && (
                    <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 mt-2">
                      <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>¡Promocionaste crack! Zafaste del final.</span>
                    </div>
                  )}

                  {vaAFinalIndirectoCBC && (
                    <div className="bg-amber-100 border border-amber-300 text-amber-900 p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 mt-2">
                      <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>Promoción indirecta: debés rendir examen final (aprueba con ≥ 4 · validez 3 turnos).</span>
                    </div>
                  )}

                  {reprobadoParcialesCBC && (
                    <div className="bg-red-100 border border-red-300 text-red-900 p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 mt-2">
                      <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                      <span>Cursada reprobada (promedio inferior a 4).</span>
                    </div>
                  )}

                  {vaAFinalCFG && (
                    <div className="bg-amber-100 border border-amber-300 text-amber-900 p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 mt-2">
                      <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>Habilitado/a para examen final (tenés hasta 3 oportunidades).</span>
                    </div>
                  )}

                  {reprobadoParcialesCFG && (
                    <div className="bg-red-100 border border-red-300 text-red-900 p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 mt-2">
                      <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                      <span>Cursada reprobada (promedio inferior a 4).</span>
                    </div>
                  )}
                </div>

                <div className={`space-y-2 pt-2 border-t border-slate-200 transition ${logroPromocion ? 'opacity-40 pointer-events-none' : ''}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide">3 Intentos de Examen Final</span>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">Aplazos: {st.aplazos || '0'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-[9px] font-bold text-amber-700 block mb-1">1° Intento Final</span>
                      <input disabled={logroPromocion} type="number" min="1" max="10" placeholder="Nota" value={st.final1 || ''} onChange={(e) => handleUpdateMateria(mat.id, 'final1', e.target.value)} className="w-full bg-amber-50 border border-amber-300 rounded-lg p-2 text-xs text-center font-bold text-amber-950 disabled:bg-slate-100 disabled:text-slate-400" />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-amber-700 block mb-1">2° Intento Final</span>
                      <input disabled={logroPromocion} type="number" min="1" max="10" placeholder="Nota" value={st.final2 || ''} onChange={(e) => handleUpdateMateria(mat.id, 'final2', e.target.value)} className="w-full bg-amber-50 border border-amber-300 rounded-lg p-2 text-xs text-center font-bold text-amber-950 disabled:bg-slate-100 disabled:text-slate-400" />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-amber-700 block mb-1">3° Intento Final</span>
                      <input disabled={logroPromocion} type="number" min="1" max="10" placeholder="Nota" value={st.final3 || ''} onChange={(e) => handleUpdateMateria(mat.id, 'final3', e.target.value)} className="w-full bg-amber-50 border border-amber-300 rounded-lg p-2 text-xs text-center font-bold text-amber-950 disabled:bg-slate-100 disabled:text-slate-400" />
                    </div>
                  </div>
                  {esCFG && promedioFinalesCFG !== null && !logroPromocion && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-950 p-2 rounded-xl text-[11px] flex items-center justify-between mt-1">
                      <span>Promedio intentos final: <strong>{promedioFinalesCFG.toFixed(2)}</strong></span>
                      {notaDefinitivaCFG !== null && (
                        <span>Nota definitiva (Final + Parciales): <strong>{notaDefinitivaCFG}</strong></span>
                      )}
                    </div>
                  )}
                  {!logroPromocion && (
                    <p className="text-[9px] text-slate-500 mt-1">La nota de aprobación final es la que sacás al aprobar. Los aplazos previos (&lt; 4) computan para el promedio general de la carrera.</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button onClick={() => setActiveDetailMateria(null)} className="bg-slate-900 text-white text-xs font-bold px-5 py-2.5 rounded-xl">Guardar y Cerrar</button>
              </div>
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
