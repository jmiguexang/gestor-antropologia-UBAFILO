import React, { useState, useEffect, useRef } from 'react';
import { PLANS_DATA } from './data/plans';
import { DonutChart } from './components/DonutChart';
import { supabase } from './supabaseClient';
import { 
  BookOpen, Award, AlertCircle, 
  Bookmark, User, LogOut, Trash2, 
  Mail, Users, FileText, CheckSquare, Layers, Loader2,
  Share2, Download, RefreshCw, Sparkles,
  Star, Trophy, Coffee, Copy, Check, Plus, Camera, Heart, Pencil
} from 'lucide-react';

const MP_ALIAS = 'juan.miguel.ch';

// Respaldo inicial si la tabla seminarios_catalogo no responde
const SEMINARIOS_OFERTA_2C_2026 = [
  { id: 'sem-1', tipo: 'sociocultural', codigo: '', nombre: 'SEMINARIO DE ANTROPOLOGIA SOCIAL (ANTROPOLOGIA RURAL Y ANTROPOLOGIA SOCIAL) - SOLO PLAN 1985', docente: 'PROF. VALVERDE, Sebastián', anio: '2026', cuatrimestre: '2° Cuatrimestre', es_pst: false },
  { id: 'sem-2', tipo: 'sociocultural', codigo: '', nombre: 'REPRODUCCIÓN SOCIAL, DESIGUALDADES Y DIGITALIZACIÓN EN EL MUNDO DEL TRABAJO', docente: 'PROF. Hernán PALERMO y PROF. Verónica CASAS', anio: '2026', cuatrimestre: '2° Cuatrimestre', es_pst: false },
  { id: 'sem-3', tipo: 'sociocultural', codigo: '', nombre: 'PODER POLICIAL, BUROCRACIAS PENALES Y ACTIVISMOS. TEMAS Y PROBLEMAS DE INVESTIGACIÓN', docente: 'PROF. María Victoria PITA y PROF. Florencia CORBELLE', anio: '2026', cuatrimestre: '2° Cuatrimestre', es_pst: false },
  { id: 'sem-4', tipo: 'sociocultural', codigo: '', nombre: 'COLONIALIDAD, MODERNIDAD E IMAGINARIOS DE NACIÓN (MODALIDAD PRESENCIAL)', docente: 'PROF. URBANO, Eduardo Luis', anio: '2026', cuatrimestre: '2° Cuatrimestre', es_pst: false },
  { id: 'sem-5', tipo: 'sociocultural', codigo: '', nombre: 'HETERODOXIAS SOCIORELIGIOSAS DESDE UNA PERSPECTIVA HISTÓRICA Y ANTROPOLÓGICA. ALGUNOS EJEMPLOS DE EUROPA Y ARGENTINA (MODALIDAD PRESENCIAL)', docente: 'PROF. Pablo WRIGHT', anio: '2026', cuatrimestre: '2° Cuatrimestre', es_pst: false },
  { id: 'sem-6', tipo: 'sociocultural', codigo: '', nombre: 'CONFLICTIVIDAD PENAL JUVENIL ENFOQUES, METODOS Y ESTUDIOS DESDE LA ANTROPOLOGÍA JURÍDICA', docente: 'PROF. María Florencia GRAZIANO y Federico MEDINA', anio: '2026', cuatrimestre: '2° Cuatrimestre', es_pst: false },
  { id: 'sem-7', tipo: 'sociocultural', codigo: '', nombre: 'ANTROPOLOGÍA y ECONOMÍA POLÍTICA: PODER, TRABAJO Y AMBIENTE.', docente: 'PROF. Santiago SORROCHE', anio: '2026', cuatrimestre: '2° Cuatrimestre', es_pst: false },
  { id: 'sem-8', tipo: 'sociocultural', codigo: '', nombre: 'COMUNICAR LA ANTROPOLOGÍA (MODALIDAD PRESENCIAL)', docente: 'PROF. Marisol GARCIA y PROF. Roberta ALLER', anio: '2026', cuatrimestre: '2° Cuatrimestre', es_pst: false },
  { id: 'sem-9', tipo: 'arqueologia', codigo: '', nombre: 'CAMBIO CLIMÁTICO, TRANSDISCIPLINA Y ADAPTACIÓN BASADA EN ECOSISTEMAS', docente: 'PROF. Constanza RIERA y PROF. Paula Beatriz MARTIN', anio: '2026', cuatrimestre: '2° Cuatrimestre', es_pst: false },
  { id: 'sem-10', tipo: 'sociocultural', codigo: '', nombre: 'PST: LAS EMPRESAS AUTOGESTIONADAS FRENTE AL PLURIEMPLEO, EL CAPITALISMO DE PLATAFORMAS Y LA SUPEREXPLOTACIÓN DEL TRABAJO EN ULTRALIBERALISMO', docente: 'PROF. Andres Eduardo Ruggeri y PROF. Natalia POLTI', anio: '2026', cuatrimestre: '2° Cuatrimestre', es_pst: true },
  { id: 'sem-11', tipo: 'arqueologia', codigo: '', nombre: 'TEORÍA, INTERDISCIPLINARIEDAD Y DEBATES CONTEMPORÁNEOS EN ARQUEOLOGÍA HISTÓRICA', docente: 'PROF. María Jimena CRUZ y Melisa SALERNO', anio: '2026', cuatrimestre: '2° Cuatrimestre', es_pst: false },
  { id: 'sem-12', tipo: 'arqueologia', codigo: '', nombre: 'LA CULTURA BAJO UNA NUEVA PERSPECTIVA EVOLUTIVA.', docente: 'PROF. Viviana SCHEINSOHN', anio: '2026', cuatrimestre: '2° Cuatrimestre', es_pst: false },
  { id: 'sem-13', tipo: 'sociocultural', codigo: '', nombre: 'PST: PRODUCCIÓN Y GESTIÓN DE PROYECTOS CULTURALES EN FILO', docente: 'PROF. Victoria Julia LENCINA (Depto de Artes)', anio: '2026', cuatrimestre: '2° Cuatrimestre', es_pst: true },
  { id: 'sem-14', tipo: 'sociocultural', codigo: '', nombre: 'PST: DIÁLOGOS ENTRE ARTE Y EDUCACIÓN EN EL MUSEO ETNOGRÁFICO', docente: 'PROF. Mariana Denise LUTERSTEIN y PROF. María Eugenia LANZA (Depto de Artes)', anio: '2026', cuatrimestre: '2° Cuatrimestre', es_pst: true },
  { id: 'sem-15', tipo: 'sociocultural', codigo: '', nombre: 'PST: CONSTRUCCIÓN DE UN ESPACIO DE RECREACIÓN EDUCATIVA PARA LAS INFANCIAS EN EL CIDAC', docente: 'PROF. Anahi GUELMAN y PROF. Mariel KAROLONSKI (Depto de Cs. de la Educación)', anio: '2026', cuatrimestre: '2° Cuatrimestre', es_pst: true },
  { id: 'sem-16', tipo: 'sociocultural', codigo: '', nombre: 'PST: SABERES Y EXPERIENCIAS AMBIENTALES EN DIÁLOGOS COMUNITARIOS. EL CASO DE LA COOPERATIVA RECUPERADORES URBANOS DEL OESTE', docente: 'PROF. María Inés CARABAJAL y PROF. Lia Inés BACHMAN (Depto de Geografía)', anio: '2026', cuatrimestre: '2° Cuatrimestre', es_pst: true }
];

const ANIOS_OPCIONES = Array.from({ length: 27 }, (_, idx) => String(2026 - idx));

const PARTICULAS_APELLIDO = new Set([
  'de', 'del', 'la', 'las', 'los', 'van', 'von', 'san', 'santa', 'mac', 'mc', 'da', 'do', 'dos'
]);

const capitalizarPalabra = (pal) => {
  if (!pal) return '';
  const lower = pal.toLowerCase();
  if (PARTICULAS_APELLIDO.has(lower)) return lower;
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

const formatearNombreDocente = (raw) => {
  if (!raw || !raw.trim()) return '';

  let sufijo = '';
  let texto = raw.trim().replace(/\s*\(([^)]+)\)\s*$/, (_, inner) => {
    sufijo = ` (${inner.trim()})`;
    return '';
  }).trim();

  texto = texto.replace(/^(prof\.?|profesor(?:a)?|doc\.?|lic\.?|dr\.?|dra\.?)\s+/i, '').trim();
  if (!texto) return '';

  let apellido = '';
  let nombre = '';

  if (texto.includes(',')) {
    const [izq, der] = texto.split(',', 2);
    const izqTrim = izq.trim();
    const derTrim = der.trim();
    const izqEsMayus = izqTrim === izqTrim.toUpperCase() && /[A-ZÁÉÍÓÚÜÑ]/.test(izqTrim);
    const derEsMayus = derTrim === derTrim.toUpperCase() && /[A-ZÁÉÍÓÚÜÑ]/.test(derTrim);

    if (derEsMayus && !izqEsMayus) {
      apellido = derTrim;
      nombre = izqTrim;
    } else {
      apellido = izqTrim;
      nombre = derTrim;
    }
  } else {
    const tokens = texto.split(/\s+/).filter(Boolean);
    if (tokens.length === 1) {
      apellido = tokens[0];
    } else {
      const esMayusToken = (t) => t === t.toUpperCase() && /[A-ZÁÉÍÓÚÜÑ]/.test(t);
      const mayusTokens = tokens.filter(esMayusToken);

      if (mayusTokens.length > 0 && mayusTokens.length < tokens.length) {
        const apArr = [];
        const nomArr = [];
        tokens.forEach((t, idx) => {
          if (esMayusToken(t) || (apArr.length > 0 && PARTICULAS_APELLIDO.has(t.toLowerCase()) && idx < tokens.length - 1)) {
            apArr.push(t);
          } else {
            nomArr.push(t);
          }
        });
        apellido = apArr.join(' ');
        nombre = nomArr.join(' ');
      } else {
        if (tokens.length >= 3 && PARTICULAS_APELLIDO.has(tokens[tokens.length - 2].toLowerCase())) {
          apellido = tokens.slice(-2).join(' ');
          nombre = tokens.slice(0, -2).join(' ');
        } else {
          apellido = tokens[tokens.length - 1];
          nombre = tokens.slice(0, -1).join(' ');
        }
      }
    }
  }

  const apellidoFmt = apellido
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => (PARTICULAS_APELLIDO.has(p.toLowerCase()) ? p.toLowerCase() : p.toUpperCase()))
    .join(' ');

  const nombreFmt = nombre
    .split(/\s+/)
    .filter(Boolean)
    .map(capitalizarPalabra)
    .join(' ');

  const cuerpo = nombreFmt ? `${apellidoFmt}, ${nombreFmt}` : apellidoFmt;
  return `PROF. ${cuerpo}${sufijo}`;
};

const formatearListaDocentes = (lista) =>
  lista
    .map((d) => formatearNombreDocente(d))
    .filter(Boolean)
    .join(' / ');

const esSeminarioPst = (sem) => {
  if (typeof sem?.es_pst === 'boolean') return sem.es_pst;
  if (typeof sem?.esPst === 'boolean') return sem.esPst;
  const n = (sem?.nombre || '').toLowerCase();
  return (
    n.startsWith('pst:') ||
    n.startsWith('pst ') ||
    n.includes('prácticas socioeducativas territorializadas') ||
    n.includes('practicas socioeducativas territorializadas')
  );
};

const limpiarTituloSeminarioCFO = (rawNombre) => {
  if (!rawNombre) return '';
  let limpio = rawNombre.trim();
  limpio = limpio.replace(/\s*\([^)]*\)\s*$/, '').trim();
  limpio = limpio.replace(/^(pst\s*:\s*|pst\s+)/i, '').trim();
  limpio = limpio.replace(/\bseminarios?\b/gi, ' ');
  limpio = limpio.replace(/\s{2,}/g, ' ').replace(/^[\s\-–—:]+|[\s\-–—:]+$/g, '').trim();
  return limpio;
};

const esSlotPstCFO = (nombreMateria = '') => {
  const n = nombreMateria.toLowerCase();
  return (
    n.includes('prácticas socioeducativas territorializadas') ||
    n.includes('practicas socioeducativas territorializadas') ||
    n.includes('pst')
  );
};

const esSlotSeminarioOrientacionCFO = (nombreMateria = '') => {
  const n = nombreMateria.toLowerCase();
  if (esSlotPstCFO(n)) return false;
  return (
    n.includes('seminario') ||
    n.includes('orientación') ||
    n.includes('orientacion')
  );
};

const getEtiquetaOrientacion = (tipo) => {
  const t = (tipo || '').toLowerCase();
  if (t === 'ambas') return 'SOCIOCULTURAL Y ARQUEOLOGÍA';
  if (t === 'arqueologia') return 'ARQUEOLOGÍA';
  return 'SOCIOCULTURAL';
};

const getClaseEtiquetaOrientacion = (tipo) => {
  const t = (tipo || '').toLowerCase();
  if (t === 'ambas') return 'bg-purple-100 text-purple-900 border border-purple-200';
  if (t === 'arqueologia') return 'bg-amber-100 text-amber-900 border border-amber-200';
  return 'bg-sky-100 text-sky-900 border border-sky-200';
};

const FACULTADES_UBA = [
  'Facultad de Filosofía y Letras (FFyL)',
  'Facultad de Ciencias Sociales (FSOC)',
  'Facultad de Ciencias Exactas y Naturales (FCEN)',
  'Facultad de Psicología',
  'Facultad de Ciencias Económicas (FCE)',
  'Facultad de Derecho',
  'Facultad de Medicina',
  'Facultad de Arquitectura, Diseño y Urbanismo (FADU)',
  'Facultad de Ingeniería (FIUBA)',
  'Facultad de Agronomía (FAUBA)',
  'Facultad de Ciencias Veterinarias (FCV)',
  'Facultad de Farmacia y Bioquímica (FFyB)',
  'Facultad de Odontología',
  'Ciclo Básico Común (CBC) / UBA XXI'
];

const AREAS_TEMATICAS_SOCIOCULTURAL = {
  'Antropología histórica y memoria': [
    'Conquistas, resistencias y memorias indígenas',
    'Pueblos indígenas y estados',
    'Antropologías latinoamericanas',
    'América en contexto'
  ],
  'Procesos socioeconómicos: producción, reproducción y transformación social': [
    'Capitalismo actual, trabajo y trabajadores',
    'Configuraciones socio-ambientales y territoriales en el espacio urbano y rural',
    'Relaciones de género y organización social de los cuidados'
  ],
  'Procesos políticos, instituciones y prácticas': [
    'Antropología del estado y las políticas públicas',
    'Sujetos sociales y políticos en perspectiva Antropológica',
    'Abordajes antropológicos de la salud y las Biociencias',
    'Antropología y Educación'
  ],
  'Procesos culturales, ideología y poder': [
    'Dinámicas contemporáneas del campo de la cultura',
    'Discurso, imagen y alteridad',
    'Religiones, mitos y rituales en la modernidad'
  ]
};

const OPCIONES_MATERIA_METODOLOGICA_EJERCICIO = [
  'Enfoque Cuantitativo de Investigación en Antrop. Sociocultural',
  'Ejercicio Profesional de la Antropología'
];

const OPCIONES_PSICOLOGIA_1985 = [
  'Psicología General',
  'Psicología Evolutiva'
];

const OPCIONES_TEORIA_SOCIOLOGICA_1985 = [
  'Teoría Sociológica',
  'Sociología Sistémica'
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

const OPCIONES_ELECTIVAS_ARQUEOLOGIA = [
  'Ejercicio profesional de la arqueología',
  'Arqueología de Tiempos Modernos',
  'Materiales Biológicos en Arqueología',
  'Estudios Interdisciplinarios en Arqueología'
];

const ELECTIVAS_CFG_PROFESORADO_2023 = {
  'Orientación Sociocultural': [
    'Sociedades, Culturas Y Estados en América Prehispánica Y Colonial',
    'Antropología Lingüística',
    'Procesos Culturales, Folklore Y Prácticas Subalternas',
    'Teoría Social',
    'Teorías de la Subjetividad',
    'Pueblos Indígenas Americanos'
  ],
  'Orientación en Arqueología': [
    'Arqueología Americana Y Argentina I',
    'Arqueología Americana Y Argentina II',
    'Arqueología Argentina',
    'Arqueología de África, Eurasia Y Oceanía',
    'Metodología Y Técnicas de la Investigación Arqueológica',
    'Geología Para Arqueólogos',
    'Materiales Arqueológicos Y Sus Tecnologías'
  ]
};

const CFG_PROFESORADO_2023_MATERIAS = [
  { id: 'prof-2023-cfg-ob-1', name: 'América en contexto', etapa: 'CFG · Obligatoria', regimen: 'promocion' },
  { id: 'prof-2023-cfg-ob-2', name: 'Metodología de la investigación antropológica en educación', etapa: 'CFG · Obligatoria', regimen: 'promocion' },
  { id: 'prof-2023-cfg-ob-3', name: 'Antropología y Conocimiento', etapa: 'CFG · Obligatoria', regimen: 'promocion' },
  { id: 'prof-2023-cfg-ob-4', name: 'Antropología y Educación', etapa: 'CFG · Obligatoria', regimen: 'promocion' },
  { id: 'prof-2023-cfg-el-1', name: 'Materia Electiva 1', etapa: 'CFG · Electiva', regimen: 'promocion', esElectivaProfesoradoCFG: true },
  { id: 'prof-2023-cfg-el-2', name: 'Materia Electiva 2', etapa: 'CFG · Electiva', regimen: 'promocion', esElectivaProfesoradoCFG: true },
  { id: 'prof-2023-cfg-el-3', name: 'Materia Electiva 3', etapa: 'CFG · Electiva', regimen: 'promocion', esElectivaProfesoradoCFG: true },
  { id: 'prof-2023-cfg-el-4', name: 'Materia Electiva 4', etapa: 'CFG · Electiva', regimen: 'promocion', esElectivaProfesoradoCFG: true },
  { id: 'prof-2023-cfg-el-5', name: 'Materia Electiva 5', etapa: 'CFG · Electiva', regimen: 'promocion', esElectivaProfesoradoCFG: true },
  { id: 'prof-2023-cfg-pst-1', name: 'Seminario de Prácticas Socioeducativas Territorializadas (PST)', etapa: 'CFG · Seminario PST', regimen: 'promocion' }
];

const OPCIONES_ELECTIVAS_CS_EDUCACION_CFE = [
  'Historia Social General de la Educación',
  'Política Educacional',
  'Historia de la Educación Argentina',
  'Sociología de la Educación'
];

const CFE_PROFESORADO_2023_MATERIAS = [
  { id: 'prof-2023-cfe-esi', name: 'Seminario de Educación Sexual Integral', etapa: 'CFE · Seminario', regimen: 'promocion' },
  { id: 'prof-2023-cfe-did-gral', name: 'Didáctica General', etapa: 'CFE · Obligatoria', regimen: 'promocion' },
  { id: 'prof-2023-cfe-did-esp', name: 'Didáctica Especial y Prácticas de la Enseñanza', etapa: 'CFE · Obligatoria', regimen: 'promocion' },
  { id: 'prof-2023-cfe-exp-sit', name: 'Experiencias Socioeducativas Situadas', etapa: 'CFE · Obligatoria', regimen: 'promocion' },
  { id: 'prof-2023-cfe-el-edu-1', name: 'Materia Electiva de Cs. de la Educación 1', etapa: 'CFE · Electiva Cs. de la Educación', regimen: 'promocion', esElectivaCsEducacionCFE: true },
  { id: 'prof-2023-cfe-el-edu-2', name: 'Materia Electiva de Cs. de la Educación 2', etapa: 'CFE · Electiva Cs. de la Educación', regimen: 'promocion', esElectivaCsEducacionCFE: true }
];

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

const redondearFFyL = (promedio) => {
  const decimales = Number((promedio - Math.floor(promedio)).toFixed(4));
  if (decimales >= 0.5) {
    return Math.ceil(promedio);
  }
  return Math.floor(promedio);
};

const esMateriaTesis = (m) => {
  const nameLower = (m?.name || '').toLowerCase();
  const idLower = (m?.id || '').toLowerCase();
  return nameLower.includes('tesis de licenciatura') || idLower.includes('tesis');
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

  const [seminariosOferta, setSeminariosOferta] = useState([]);
  const [showSeminarioModal, setShowSeminarioModal] = useState(false);
  const [editandoSemId, setEditandoSemId] = useState(null);
  const [nuevoSemNombre, setNuevoSemNombre] = useState('');
  const [nuevoSemCodigo, setNuevoSemCodigo] = useState('');
  const [nuevoSemDocente1, setNuevoSemDocente1] = useState('');
  const [nuevoSemDocente2, setNuevoSemDocente2] = useState('');
  const [nuevoSemDocente3, setNuevoSemDocente3] = useState('');
  const [nuevoSemTipo, setNuevoSemTipo] = useState('sociocultural');
  const [nuevoSemAnio, setNuevoSemAnio] = useState('2026');
  const [nuevoSemCuatrimestre, setNuevoSemCuatrimestre] = useState('2° Cuatrimestre');
  const [nuevoSemEsPst, setNuevoSemEsPst] = useState(false);
  const [filtroSemAnio, setFiltroSemAnio] = useState('todos');
  const [filtroSemAnioInput, setFiltroSemAnioInput] = useState('');
  const [filtroSemCuatrimestre, setFiltroSemCuatrimestre] = useState('todos');
  
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

  const cargarCatalogoSeminarios = async () => {
    try {
      const { data, error } = await supabase
        .from('seminarios_catalogo')
        .select('*')
        .order('creado_en', { ascending: false });

      if (error) {
        console.error("Error consultando seminarios_catalogo:", error);
        setSeminariosOferta(SEMINARIOS_OFERTA_2C_2026);
        return;
      }

      if (Array.isArray(data)) {
        setSeminariosOferta(data);
      }
    } catch (err) {
      console.error("Error al cargar seminarios_catalogo:", err);
      setSeminariosOferta(SEMINARIOS_OFERTA_2C_2026);
    }
  };

  useEffect(() => {
    if (!session) return;
    cargarCatalogoSeminarios();

    if (session.tipo === 'registrado') {
      cargarDatosNube(session.email);
    } else if (session.tipo === 'invitado') {
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
    guardarDatosNube(studentData, avatarObj, selectedPlan, selectedOrientation);
    setToastMessage(`¡Avatar actualizado a ${avatarObj.nombre}! 🏛️`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const limpiarFormularioSeminario = () => {
    setEditandoSemId(null);
    setNuevoSemNombre('');
    setNuevoSemCodigo('');
    setNuevoSemDocente1('');
    setNuevoSemDocente2('');
    setNuevoSemDocente3('');
    setNuevoSemTipo('sociocultural');
    setNuevoSemAnio('2026');
    setNuevoSemCuatrimestre('2° Cuatrimestre');
    setNuevoSemEsPst(false);
  };

  const handleIniciarEdicionSeminario = (sem) => {
    setEditandoSemId(sem.id);
    setNuevoSemNombre(sem.nombre || '');
    setNuevoSemCodigo(sem.codigo || '');
    setNuevoSemTipo(sem.tipo || 'sociocultural');
    setNuevoSemAnio(sem.anio || '2026');
    setNuevoSemCuatrimestre(sem.cuatrimestre || '2° Cuatrimestre');
    setNuevoSemEsPst(esSeminarioPst(sem));
    const docentesSeparados = (sem.docente || '').split('/').map((d) => d.trim());
    setNuevoSemDocente1(docentesSeparados[0] || '');
    setNuevoSemDocente2(docentesSeparados[1] || '');
    setNuevoSemDocente3(docentesSeparados[2] || '');
  };

  const handleAgregarSeminarioManualACatalogo = async (e) => {
    e.preventDefault();
    const nombreLimpio = nuevoSemNombre.trim();
    const codigoLimpio = nuevoSemCodigo.trim();
    const docentesLista = [nuevoSemDocente1, nuevoSemDocente2, nuevoSemDocente3]
      .map((d) => d.trim())
      .filter(Boolean);
    const docenteLimpio = formatearListaDocentes(docentesLista);

    if (!nombreLimpio || !docenteLimpio || !nuevoSemTipo || !nuevoSemAnio || !nuevoSemCuatrimestre) {
      alert("Completá nombre, tipo, año, cuatrimestre y al menos un docente.");
      return;
    }

    const otrosSeminarios = editandoSemId
      ? seminariosOferta.filter((s) => s.id !== editandoSemId)
      : seminariosOferta;

    const yaExistePorCodigo =
      codigoLimpio !== '' &&
      otrosSeminarios.some(
        (s) => (s.codigo || '').trim().toLowerCase() === codigoLimpio.toLowerCase()
      );

    const yaExistePorNombre = otrosSeminarios.some(
      (s) =>
        (s.nombre || '').trim().toLowerCase() === nombreLimpio.toLowerCase() &&
        (s.anio || '').trim() === nuevoSemAnio.trim() &&
        (s.cuatrimestre || '').trim() === nuevoSemCuatrimestre.trim()
    );

    if (yaExistePorCodigo || yaExistePorNombre) {
      alert("Este seminario ya está agregado en el catálogo.");
      return;
    }

    if (editandoSemId) {
      const datosActualizados = {
        tipo: nuevoSemTipo,
        codigo: codigoLimpio,
        nombre: nombreLimpio.toUpperCase(),
        docente: docenteLimpio,
        anio: nuevoSemAnio,
        cuatrimestre: nuevoSemCuatrimestre,
        es_pst: Boolean(nuevoSemEsPst)
      };

      const { error } = await supabase
        .from('seminarios_catalogo')
        .update(datosActualizados)
        .eq('id', editandoSemId);

      if (error) {
        console.error("Error actualizando en seminarios_catalogo:", error);
        alert(`No se pudo actualizar el seminario en la base de datos: ${error.message}`);
        return;
      }

      setSeminariosOferta((prev) =>
        prev.map((item) => (item.id === editandoSemId ? { ...item, ...datosActualizados, esPst: Boolean(nuevoSemEsPst) } : item))
      );
      limpiarFormularioSeminario();
      setToastMessage("¡Seminario actualizado!");
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }

    const nuevoSem = {
      id: 'sem-manual-' + Date.now(),
      tipo: nuevoSemTipo,
      codigo: codigoLimpio,
      nombre: nombreLimpio.toUpperCase(),
      docente: docenteLimpio,
      anio: nuevoSemAnio,
      cuatrimestre: nuevoSemCuatrimestre,
      es_pst: Boolean(nuevoSemEsPst)
    };

    const { error } = await supabase
      .from('seminarios_catalogo')
      .insert([nuevoSem]);

    if (error) {
      console.error("Error insertando en seminarios_catalogo:", error);
      alert(`No se pudo guardar el seminario en la base de datos: ${error.message}`);
      return;
    }

    setSeminariosOferta((prev) => [{ ...nuevoSem, esPst: Boolean(nuevoSemEsPst) }, ...prev]);
    limpiarFormularioSeminario();
    setToastMessage("¡Seminario agregado al catálogo!");
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleEliminarSeminarioCatalogo = async (sem) => {
    const confirmar = window.confirm(`¿Eliminar "${sem.nombre}" del catálogo?`);
    if (!confirmar) return;

    const { error } = await supabase
      .from('seminarios_catalogo')
      .delete()
      .eq('id', sem.id);

    if (error) {
      console.error("Error eliminando de seminarios_catalogo:", error);
      alert(`No se pudo eliminar el seminario del catálogo: ${error.message}`);
      return;
    }

    if (editandoSemId === sem.id) {
      limpiarFormularioSeminario();
    }
    setSeminariosOferta((prev) => prev.filter((item) => item.id !== sem.id));
    setToastMessage("Seminario eliminado del catálogo.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAgregarSeminarioACursada = (sem) => {
    const planObjActual = PLANS_DATA[selectedPlan];
    const orientObjActual =
      planObjActual?.orientaciones?.[selectedOrientation] ||
      planObjActual?.orientaciones?.['sociocultural'];
    const cfoList = (orientObjActual?.cfo || []).filter(m => !esMateriaTesis(m));

    const esPstSem = esSeminarioPst(sem);

    const slotsPstCFO = cfoList.filter((m) => esSlotPstCFO(m.name));
    const slotsOrientacionCFO = cfoList.filter((m) => esSlotSeminarioOrientacionCFO(m.name));

    const candidatosSlot = esPstSem ? slotsPstCFO : slotsOrientacionCFO;
    const planStateActual = studentData[selectedPlan] || {};

    const slotLibre =
      candidatosSlot.find((m) => {
        const stSlot = planStateActual[m.id] || {};
        return !stSlot.customName && (!stSlot.estado || stSlot.estado === 'pendiente');
      }) ||
      candidatosSlot.find((m) => !(planStateActual[m.id]?.customName)) ||
      candidatosSlot[0];

    const tituloLimpio = limpiarTituloSeminarioCFO(sem.nombre);
    const docentesPartes = (sem.docente || '').split('/').map((d) => d.trim());

    if (slotLibre) {
      setStudentData((prev) => {
        const planState = prev[selectedPlan] || {};
        const matPrev = planState[slotLibre.id] || {};
        const updated = {
          ...prev,
          [selectedPlan]: {
            ...planState,
            [slotLibre.id]: {
              ...matPrev,
              estado: 'cursando',
              customName: tituloLimpio,
              desdeCatalogoSeminarios: true,
              docente1: docentesPartes[0] || matPrev.docente1 || '',
              docente2: docentesPartes[1] || matPrev.docente2 || '',
              docente3: docentesPartes[2] || matPrev.docente3 || '',
              emailDocente1: matPrev.emailDocente1 || '',
              emailDocente2: matPrev.emailDocente2 || '',
              emailDocente3: matPrev.emailDocente3 || '',
              cuatrimestreCursada: sem.cuatrimestre || '2° Cuatrimestre',
              anioCursada: sem.anio || '2026'
            }
          }
        };
        guardarDatosNube(updated, avatarActual, selectedPlan, selectedOrientation);
        return updated;
      });

      setShowSeminarioModal(false);
      setOnlyFavorites(false);
      setActiveBlock('cfo');
      setToastMessage(`¡Seminario asignado en CFE (${slotLibre.name})!`);
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }

    const customId = 'electiva-sem-' + sem.id + '-' + Date.now();
    setStudentData((prev) => {
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
            customName: tituloLimpio,
            desdeCatalogoSeminarios: true,
            docente1: docentesPartes[0] || '',
            docente2: docentesPartes[1] || '',
            docente3: docentesPartes[2] || '',
            emailDocente1: '',
            emailDocente2: '',
            emailDocente3: '',
            favorita: true,
            cuatrimestreCursada: sem.cuatrimestre || '2° Cuatrimestre',
            anioCursada: sem.anio || '2026'
          }
        }
      };
      guardarDatosNube(updated, avatarActual, selectedPlan, selectedOrientation);
      return updated;
    });

    setShowSeminarioModal(false);
    setOnlyFavorites(false);
    setActiveBlock('electivas');
    setToastMessage("¡Seminario agregado a tu cursada!");
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleVaciarSeminarioEnLibreta = (id) => {
    setStudentData((prev) => {
      const planState = prev[selectedPlan] || {};
      const matPrev = planState[id] || {};
      const updated = {
        ...prev,
        [selectedPlan]: {
          ...planState,
          [id]: {
            ...matPrev,
            estado: 'pendiente',
            nota: '',
            customName: '',
            desdeCatalogoSeminarios: false,
            docente1: '',
            docente2: '',
            docente3: '',
            emailDocente1: '',
            emailDocente2: '',
            emailDocente3: ''
          }
        }
      };
      guardarDatosNube(updated, avatarActual, selectedPlan, selectedOrientation);
      return updated;
    });
    setActiveDetailMateria(null);
    setToastMessage("Seminario eliminado de la cursada. El espacio quedó disponible.");
    setTimeout(() => setToastMessage(null), 3500);
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
      guardarDatosNube(updated, avatarActual, selectedPlan, selectedOrientation);
      return updated;
    });
  };

  const esProfesorado2023 = selectedPlan === '2023' && selectedOrientation === 'profesorado';
  const etiquetaBloqueEspecifico = esProfesorado2023 ? 'CFE' : 'CFO';

  const getCfgMateriasActuales = () => {
    if (esProfesorado2023) {
      return CFG_PROFESORADO_2023_MATERIAS;
    }
    return planObj.cfg || [];
  };

  const handleUpdateMateria = (id, field, value) => {
    setStudentData(prev => {
      const planState = prev[selectedPlan] || {};
      const matState = planState[id] || { 
        estado: 'pendiente', nota: '', aplazos: '0', aplazosCBC: [], aplazosCFG: [], aplazosCFO: [], regimen: 'promocion', 
        modalidadCursada: '', trabajoPractico: '', trabajoFinal: '',
        comision: '', anioCursada: '', cuatrimestreCursada: '',
        docenteTeorico: '', emailTeorico: '', docentePractico: '', emailPractico: '',
        docente1: '', emailDocente1: '', docente2: '', emailDocente2: '', docente3: '', emailDocente3: '',
        desdeCatalogoSeminarios: false,
        parcial1: '', parcial2: '', parcial3: '', 
        final1: '', final2: '', final3: '', 
        customName: '', codigoOptativa: '', facultadElectiva: '', carreraElectiva: '', areaTematicaElectiva: '', orientacionElectivaCFG: '',
        favorita: false, materiaElectivaCBC: ''
      };

      let updatedMat = { ...matState, [field]: value };

      const cbcIds = new Set((PLANS_DATA[selectedPlan]?.cbc || []).map(c => c.id));
      const cfgIds = new Set(getCfgMateriasActuales().map(c => c.id));
      const esMateriaCBC = cbcIds.has(id);
      const esMateriaCFG = cfgIds.has(id);

      if (field === 'trabajoFinal') {
        updatedMat.nota = value;
      }

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

      guardarDatosNube(updated, avatarActual, selectedPlan, selectedOrientation);
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

  const getCfoArqueologia1985Ajustado = () => {
    if (esProfesorado2023) {
      return CFE_PROFESORADO_2023_MATERIAS;
    }
    const baseCfo = (orientationObj.cfo || []).filter(m => !esMateriaTesis(m));
    if (selectedPlan === '1985' && selectedOrientation === 'arqueologia') {
      const resultado = [];
      let optativaProcesada = false;
      let seminariosProcesados = false;

      baseCfo.forEach((m, idx) => {
        const n = (m.name || '').toLowerCase();
        const esOpt = n.includes('optativa');
        const esSem = n.includes('seminario');

        if (esOpt) {
          if (!optativaProcesada) {
            optativaProcesada = true;
            resultado.push({ ...m, id: `${m.id}-1`, name: 'Materia Optativa 1' });
            resultado.push({ ...m, id: `${m.id}-2`, name: 'Materia Optativa 2' });
          }
          return;
        }

        if (esSem) {
          if (!seminariosProcesados) {
            seminariosProcesados = true;
            resultado.push({ ...m, id: `${m.id}-arq-1`, name: 'Seminario de Investigación en Arqueología I' });
            resultado.push({ ...m, id: `${m.id}-arq-2`, name: 'Seminario de Investigación en Arqueología II' });
          }
          return;
        }

        resultado.push({ ...m, id: m.id || `cfo-1985-arq-${idx}` });
      });

      return resultado;
    }
    return baseCfo;
  };

  const currentCfoList = getCfoArqueologia1985Ajustado();
  const currentCfgList = getCfgMateriasActuales();

  const getTesisMaterias = () => {
    if (Array.isArray(planObj.tesis)) return planObj.tesis;
    if (Array.isArray(orientationObj.tesis)) return orientationObj.tesis;
    const fromCfo = (orientationObj.cfo || []).filter(esMateriaTesis);
    if (fromCfo.length > 0) return fromCfo;
    const fromPlanCfo = Object.values(planObj.orientaciones || {})
      .flatMap(o => o?.cfo || [])
      .filter(esMateriaTesis);
    if (fromPlanCfo.length > 0) return [fromPlanCfo[0]];
    return [];
  };

  const getBlockMaterias = (block) => {
    switch (block) {
      case 'cbc': return planObj.cbc || [];
      case 'cfg': return currentCfgList;
      case 'cfo': return currentCfoList;
      case 'electivas': return orientationObj.electivas || planObj.electivas || [];
      case 'tesis': return getTesisMaterias();
      case 'idiomas': return planObj.idiomas || [];
      case 'profesorado':
        const profObj = planObj.orientaciones['profesorado'];
        return profObj ? profObj.cfo : [];
      default: return [];
    }
  };

  const getAllMaterias = () => {
    let list = [
      ...(planObj.cbc || []),
      ...currentCfgList,
      ...currentCfoList
    ];
    const electivasList = orientationObj.electivas || planObj.electivas || [];
    if (electivasList) list = [...list, ...electivasList];

    const planState = studentData[selectedPlan] || {};
    Object.keys(planState).forEach(k => {
      if (k.startsWith('electiva-sem-')) {
        list.push({ id: k, name: 'Seminario / Electiva', etapa: 'Electiva', correlativa: '' });
      }
    });

    list = [...list, ...getTesisMaterias()];
    if (planObj.idiomas) list = [...list, ...planObj.idiomas];

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
  let sumNotasCBC = 0;
  let countNotasCBC = 0;
  let sumNotasCFG = 0;
  let countNotasCFG = 0;
  let sumNotasCFO = 0;
  let countNotasCFO = 0;
  let notasAprobadasList = [];

  const idiomasIds = new Set((planObj.idiomas || []).map(i => i.id));
  const cbcIdsSet = new Set((planObj.cbc || []).map(c => c.id));
  const cfgIdsSet = new Set(currentCfgList.map(c => c.id));
  const cfoIdsSet = new Set(currentCfoList.map(c => c.id));

  currentMateriasAll.forEach(m => {
    const st = studentData[selectedPlan]?.[m.id] || {};
    const estado = st.estado || 'pendiente';
    const notaNum = st.nota !== '' && !isNaN(st.nota) ? parseFloat(st.nota) : null;
    const esIdioma = idiomasIds.has(m.id);
    const esCBCMat = cbcIdsSet.has(m.id);
    const esCFGMat = cfgIdsSet.has(m.id);
    const esCFOMat = cfoIdsSet.has(m.id);

    if (st.favorita) favoritasCount++;

    if (esCBCMat && Array.isArray(st.aplazosCBC)) {
      st.aplazosCBC.forEach(apVal => {
        if (apVal !== '' && !isNaN(apVal)) {
          const apNum = parseFloat(apVal);
          if (apNum >= 0 && apNum < 4) {
            sumNotasPromedio += apNum;
            countNotasPromedio++;
            sumNotasCBC += apNum;
            countNotasCBC++;
          }
        }
      });
    }

    if (esCFGMat && Array.isArray(st.aplazosCFG)) {
      st.aplazosCFG.forEach(apVal => {
        if (apVal !== '' && !isNaN(apVal)) {
          const apNum = parseFloat(apVal);
          if (apNum >= 0 && apNum < 4) {
            sumNotasPromedio += apNum;
            countNotasPromedio++;
            sumNotasCFG += apNum;
            countNotasCFG++;
          }
        }
      });
    }

    if (esCFOMat && Array.isArray(st.aplazosCFO)) {
      st.aplazosCFO.forEach(apVal => {
        if (apVal !== '' && !isNaN(apVal)) {
          const apNum = parseFloat(apVal);
          if (apNum >= 0 && apNum < 4) {
            sumNotasPromedio += apNum;
            countNotasPromedio++;
            sumNotasCFO += apNum;
            countNotasCFO++;
          }
        }
      });
    }

    if (estado === 'aprobada') {
      aprobadasCount++;
      if (notaNum !== null && notaNum >= 4 && !esIdioma) {
        sumNotasPromedio += notaNum;
        countNotasPromedio++;
        if (esCBCMat) {
          sumNotasCBC += notaNum;
          countNotasCBC++;
        }
        if (esCFGMat) {
          sumNotasCFG += notaNum;
          countNotasCFG++;
        }
        if (esCFOMat) {
          sumNotasCFO += notaNum;
          countNotasCFO++;
        }
        const nombreMostrar = esCBCMat && st.materiaElectivaCBC ? st.materiaElectivaCBC : m.name;
        notasAprobadasList.push({ name: st.customName ? `${nombreMostrar}: ${st.customName}` : nombreMostrar, nota: notaNum });
      }

      if (!esIdioma && !esCFGMat) {
        [st.final1, st.final2, st.final3].forEach(fVal => {
          const fNum = parseFloat(fVal);
          if (!isNaN(fNum) && fNum > 0 && fNum < 4) {
            sumNotasPromedio += fNum;
            countNotasPromedio++;
            if (esCBCMat) {
              sumNotasCBC += fNum;
              countNotasCBC++;
            }
          }
        });
      }
    } else if (estado === 'regularizada') {
      regularizadasCount++;
    } else if (estado === 'cursando') {
      cursandoCount++;
    } else {
      pendientesCount++;
    }
  });

  notasAprobadasList.sort((a, b) => b.nota - a.nota);
  const podioTop3 = notasAprobadasList.slice(0, 3);

  const promedioGeneralUBA = countNotasPromedio > 0 ? (sumNotasPromedio / countNotasPromedio).toFixed(2) : '-';
  const promedioCBC = countNotasCBC > 0 ? (sumNotasCBC / countNotasCBC).toFixed(2) : '-';
  const promedioCFG = countNotasCFG > 0 ? (sumNotasCFG / countNotasCFG).toFixed(2) : '-';
  const promedioCFO = countNotasCFO > 0 ? (sumNotasCFO / countNotasCFO).toFixed(2) : '-';
  const totalMaterias = currentMateriasAll.length;

  const getHorasMateria = (m) => {
    const idLower = (m.id || '').toLowerCase();
    const nameLower = (m.name || '').toLowerCase();
    const etapaLower = (m.etapa || '').toLowerCase();

    if (selectedPlan === '2023') {
      const esSeminario =
        m.esCustomSeminario ||
        idLower.includes('sem') ||
        idLower.includes('pst') ||
        nameLower.includes('seminario') ||
        nameLower.includes('pst') ||
        etapaLower.includes('seminario');

      const esAnual =
        nameLower.includes('anual') ||
        etapaLower.includes('anual') ||
        nameLower.includes('2 cuatrimestres');

      if (esSeminario) {
        return esAnual ? 128 : 64;
      }
      return esAnual ? 192 : 96;
    }

    if (cbcIdsSet.has(m.id) || etapaLower.includes('cbc')) return 64;
    if (nameLower.includes('tesis') || idLower.includes('tesis')) return 160;
    if (idiomasIds.has(m.id) || etapaLower.includes('idioma')) {
      return nameLower.includes('nivel') ? 64 : 192;
    }
    if (
      m.esCustomSeminario ||
      idLower.includes('sem') ||
      nameLower.includes('seminario') ||
      nameLower.includes('pst') ||
      etapaLower.includes('seminario')
    ) {
      return nameLower.includes('anual') || nameLower.includes('investigación') ? 128 : 64;
    }
    if (nameLower.includes('anual')) return 192;
    return 96;
  };

  let horasAprobadas = 0;
  let horasTotalesPlan = 0;

  currentMateriasAll.forEach(m => {
    const hs = getHorasMateria(m);
    const esIdiomaItem = idiomasIds.has(m.id) || (m.etapa || '').toLowerCase().includes('idioma');
    if (!esIdiomaItem) {
      horasTotalesPlan += hs;
    }
    const st = studentData[selectedPlan]?.[m.id] || {};

    if (st.estado === 'aprobada' && !esIdiomaItem) {
      horasAprobadas += hs;
    }
  });

  const denominadorHoras = selectedPlan === '1985' ? 2867.2 : (selectedPlan === '2023' ? 3200 : Math.max(horasTotalesPlan, 1));
  const porcentajeAvance = Math.min(100, Math.round((horasAprobadas / denominadorHoras) * 100));

  const materiasDelBloqueActual = getBlockMateriasExtended(activeBlock);
  let horasTotalBloque = 0;
  let horasAvanzadasBloque = 0;

  materiasDelBloqueActual.forEach(m => {
    const hs = getHorasMateria(m);
    horasTotalBloque += hs;
    const st = studentData[selectedPlan]?.[m.id] || {};
    const esIdiomaItem = idiomasIds.has(m.id) || (m.etapa || '').toLowerCase().includes('idioma');

    if (st.estado === 'aprobada' && !esIdiomaItem) {
      horasAvanzadasBloque += hs;
    }
  });

  const getMotivationalQuotes = (pct) => {
    if (pct >= 100) {
      return [
        `¡100% completado! Se cerró el rito de pasaje: salimos de la liminidad para reintegrarnos al mundo con título en mano 🎓✨`,
        `Después de tanto potlatch de horas de sueño y resúmenes, el prestigio académico es nuestro: ¡100% adentro! 🏆🥂`,
        `La tesis está defendida y el mito de origen concluyó: de nativos en Puan a colegas en el campo 🚀🌿`,
        `Rendir la última materia fue un auténtico hecho social total: cuerpo, mente, mates y familia celebrando el 100% 🎉🎁`
      ];
    }
    if (pct >= 70) {
      return [
        `Al ${pct}% de la carrera: ya practicamos el extrañamiento con nosotros mismos cuando nos vemos subrayando un domingo a la noche 📖⛺`,
        `Con el ${pct}% adentro, esquivamos el peligro de las correlativas y mantenemos la pureza del promedio al estilo Mary Douglas ⚖️🔥`,
        `Cruzando el ${pct}%: la mirada etnográfica ya está tan incorporada que hasta las charlas de sobremesa nos parecen trabajo de campo 🔍✨`,
        `En el tramo final (${pct}%): aplicando la descripción densa de Geertz para entender qué quiso decir el docente en la consigna del parcial ✍️📚`
      ];
    }
    if (pct >= 50) {
      return [
        `Mitad de carrera adentro (${pct}%): habitando de lleno la liminidad de Turner. Ni ingresantes ni graduados, pero firmes en la trinchera 🌿🚀`,
        `Con el ${pct}% aprobado, hacemos bricolaje teórico como Lévi-Strauss: armando respuestas brillantes con los apuntes que sobrevivieron 🧩💪`,
        `Superando el ${pct}%: desnaturalizando el sentido común de que "no se llega al final" y deconstruyendo los mandatos de la cursada 🔥🏛️`,
        `Al ${pct}% del recorrido: desde el perspectivismo amerindio, el aula y la biblioteca ya nos ven como parte de su propia especie 🐆✨`
      ];
    }
    if (pct >= 25) {
      return [
        `Llevás el ${pct}% adentro: escapando del panóptico del SIU Guaraní a fuerza de constancia, resúmenes y café 📝☕`,
        `Construyendo el habitus puaner al ${pct}%: cada final aprobado reconfigura nuestra forma de leer y pensar la realidad 📖🌿`,
        `Con el ${pct}% completado, ya sabemos que aprobar un parcial depende de una compleja red de reciprocidad entre compañeros/as 🎁🤝`,
        `Marchando al ${pct}%: recolectando categorías analíticas con la paciencia de Boas armando su archivo etnográfico 📚🚀`
      ];
    }
    return [
      `Arrancando la etnografía en Puan (${pct}%): aprendiendo los códigos simbólicos de la tribu universitaria 🌱📚`,
      `Recién al ${pct}%: ejercitando el relativismo cultural para no entrar en pánico ante el primer programa de 40 textos ✨🚀`,
      `Primeros pasos en la alteridad académica (${pct}%): observadores participantes en aulas llenas y pasillos con historia 💪🎓`,
      `Con el ${pct}% adentro: iniciando el ciclo de dar, recibir y devolver apuntes en el ecosistema de Filo ✍️☕`
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
                          datos_academicos: datosVacios, avatar: avatarPorDefecto
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

  const anioFiltroActivo = filtroSemAnioInput.trim() || (filtroSemAnio === 'todos' ? '' : filtroSemAnio);

  const seminariosFiltrados = seminariosOferta.filter((s) => {
    const matchAnio = !anioFiltroActivo || (s.anio || '').trim().toLowerCase() === anioFiltroActivo.toLowerCase();
    const matchCuatri = filtroSemCuatrimestre === 'todos' || (s.cuatrimestre || '') === filtroSemCuatrimestre;
    return matchAnio && matchCuatri;
  });

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
                    guardarDatosNube(studentData, avatarActual, nuevoP, selectedOrientation);
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
                    guardarDatosNube(studentData, avatarActual, selectedPlan, nuevaO);
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
              <DonutChart
                total={currentMateriasAll.length}
                aprobadas={aprobadasCount}
                regularizadas={regularizadasCount}
                cursando={cursandoCount}
                pendientes={pendientesCount}
                porcentaje={porcentajeAvance}
                horasAprobadas={horasAprobadas}
                horasTotales={denominadorHoras}
              />
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
              <button onClick={() => { setOnlyFavorites(false); setActiveBlock('cfo'); }} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${!onlyFavorites && activeBlock === 'cfo' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'}`}><Layers className="w-4 h-4 text-sky-600" /> {etiquetaBloqueEspecifico}</button>
              <button onClick={() => { setOnlyFavorites(false); setActiveBlock('electivas'); }} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${!onlyFavorites && activeBlock === 'electivas' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'}`}><Layers className="w-4 h-4 text-sky-600" /> Electivas / Seminarios</button>
              <button onClick={() => { setOnlyFavorites(false); setActiveBlock('tesis'); }} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${!onlyFavorites && activeBlock === 'tesis' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'}`}><Layers className="w-4 h-4 text-sky-600" /> Tesis</button>
              <button onClick={() => { setOnlyFavorites(false); setActiveBlock('idiomas'); }} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${!onlyFavorites && activeBlock === 'idiomas' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'}`}><Layers className="w-4 h-4 text-sky-600" /> Idiomas</button>
            </div>
            <button onClick={() => setOnlyFavorites(prev => !prev)} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 border ${onlyFavorites ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-sm' : 'bg-amber-50 text-amber-900 border-amber-200'}`}>
              <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-amber-950' : 'fill-amber-400 text-amber-500'}`} /> Mis Favoritas ({favoritasCount})
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold flex items-center gap-2 uppercase tracking-wide">
                  {onlyFavorites ? <><Star className="w-5 h-5 text-amber-400 fill-amber-400" /> Materias Favoritas</> : <><BookOpen className="w-5 h-5 text-sky-400" /> Bloque: {activeBlock === 'cfo' ? etiquetaBloqueEspecifico : activeBlock.toUpperCase()}</>}
                </h2>
                {!onlyFavorites && (
                  <div className="mt-1 text-[11px] text-sky-200 leading-tight">
                    {activeBlock !== 'tesis' && (
                      <>
                        <p>Carga horaria total del bloque: <strong>{horasTotalBloque} hs</strong></p>
                        <p className="text-emerald-300">Carga horaria avanzada: <strong>{horasAvanzadasBloque} hs</strong></p>
                      </>
                    )}
                    {activeBlock === 'cbc' && (
                      <p className="text-amber-300 mt-0.5">Promedio CBC (con aplazos): <strong>{promedioCBC}</strong></p>
                    )}
                    {activeBlock === 'cfg' && (
                      <p className="text-amber-300 mt-0.5">Promedio CFG (con aplazos): <strong>{promedioCFG}</strong></p>
                    )}
                    {activeBlock === 'cfo' && (
                      <p className="text-amber-300 mt-0.5">Promedio {etiquetaBloqueEspecifico} (con aplazos): <strong>{promedioCFO}</strong></p>
                    )}
                  </div>
                )}
              </div>
              <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700 shrink-0">{currentBlockMaterias.length} materias</span>
            </div>

            <div className="divide-y divide-slate-100">
              {currentBlockMaterias.map((m) => {
                const st = studentData[selectedPlan]?.[m.id] || { estado: 'pendiente', nota: '', favorita: false };
                const regimenActual = st.regimen || (m.regimen === 'final' ? 'final' : 'promocion');
                const esPromocional = regimenActual === 'promocion';
                const esFavorita = Boolean(st.favorita);
                const esMateriaCBC = cbcIdsSet.has(m.id);
                const nombreMatCardLower = (m.name || '').toLowerCase();
                const esSeminarioCard64 =
                  getHorasMateria(m) === 64 &&
                  (esSlotPstCFO(nombreMatCardLower) || esSlotSeminarioOrientacionCFO(nombreMatCardLower));
                const iconoModalidadCard =
                  st.modalidadCursada === '100% virtual'
                    ? '💻'
                    : st.modalidadCursada === '100% presencial'
                      ? '🏛️'
                      : st.modalidadCursada === 'Híbrido'
                        ? '🔄'
                        : '🧭';

                return (
                  <div key={m.id} className="p-4 sm:p-5 hover:bg-slate-50 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">{m.etapa}</span>
                        {esSeminarioCard64 ? (
                          <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border bg-sky-50 text-sky-800 border-sky-200">
                            {st.modalidadCursada ? `${iconoModalidadCard} Modalidad: ${st.modalidadCursada}` : `${iconoModalidadCard} Modalidad sin elegir`}
                          </span>
                        ) : (
                          <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${esPromocional ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'}`}>
                            {esPromocional ? '✨ Promocional' : '📝 Examen Final Obligatorio'}
                          </span>
                        )}
                      </div>
                      <div className="flex items-start gap-2.5">
                        <button type="button" onClick={() => handleUpdateMateria(m.id, 'favorita', !esFavorita)} className="p-1 rounded-lg hover:bg-amber-50 transition mt-0.5">
                          <Star className={`w-5 h-5 transition ${esFavorita ? 'fill-amber-400 text-amber-500 scale-110' : 'text-slate-300'}`} />
                        </button>
                        {esMateriaCBC ? (
                          <div>
                            <h3 className="font-bold text-slate-800 text-base">{st.materiaElectivaCBC || m.name}</h3>
                            {st.customName && (
                              <p className="text-xs font-semibold text-sky-700 mt-0.5">({st.customName})</p>
                            )}
                          </div>
                        ) : (
                          <div>
                            <h3 className="font-bold text-slate-800 text-base">{m.name}</h3>
                            {st.customName && (
                              <p className="text-xs font-semibold text-sky-700 mt-0.5">({st.customName})</p>
                            )}
                          </div>
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
                      {(st.estado === 'aprobada' || ((esMateriaCBC || cfgIdsSet.has(m.id) || cfoIdsSet.has(m.id)) && st.nota !== '')) && (
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
        const esCFO = activeBlock === 'cfo' || cfoIdsSet.has(mat.id);
        const esIdioma = activeBlock === 'idiomas';
        const esElectiva = activeBlock === 'electivas';
        const horasMateriaDetalle = getHorasMateria(mat);

        const esElectivaProfCFG = Boolean(esProfesorado2023 && esCFG && mat.esElectivaProfesoradoCFG);
        const orientacionElectivaProfCFG = st.orientacionElectivaCFG || '';
        const opcionesMateriasElectivasProfCFG = ELECTIVAS_CFG_PROFESORADO_2023[orientacionElectivaProfCFG] || [];

        const esElectivaCsEducacionCFE = Boolean(esProfesorado2023 && esCFO && mat.esElectivaCsEducacionCFE);
        const opcionesElectivasEduOcupadasEnOtras = new Set();
        if (esElectivaCsEducacionCFE) {
          CFE_PROFESORADO_2023_MATERIAS.forEach(el => {
            if (el.esElectivaCsEducacionCFE && el.id !== mat.id) {
              const otraVal = studentData[selectedPlan]?.[el.id]?.customName;
              if (OPCIONES_ELECTIVAS_CS_EDUCACION_CFE.includes(otraVal)) {
                opcionesElectivasEduOcupadasEnOtras.add(otraVal);
              }
            }
          });
        }

        const nombreMatLower = (mat.name || '').toLowerCase();
        const esSeminarioCuatrimestral64 =
          horasMateriaDetalle === 64 &&
          (esSlotPstCFO(nombreMatLower) || esSlotSeminarioOrientacionCFO(nombreMatLower));
        const modalidadActual = st.modalidadCursada || '';
        const esSeminarioCargadoCatalogo = Boolean(st.desdeCatalogoSeminarios) || (esSeminarioCuatrimestral64 && Boolean(st.customName));

        const esMateriaMetodologicaEjercicio =
          nombreMatLower.includes('materia metodológica') ||
          nombreMatLower.includes('materia metodologica') ||
          nombreMatLower.includes('ejercicio profesional');

        const esPsicologia1985CFO =
          selectedPlan === '1985' &&
          activeBlock === 'cfo' &&
          (nombreMatLower.includes('psicología general o evolutiva') ||
            nombreMatLower.includes('psicologia general o evolutiva'));

        const esTeoriaSociologica1985CFO =
          selectedPlan === '1985' &&
          activeBlock === 'cfo' &&
          (nombreMatLower.includes('teoría sociológica o sociología de la educación') ||
            nombreMatLower.includes('teoria sociologica o sociologia de la educacion'));

        const esElectivaArqueologiaCFO =
          activeBlock === 'cfo' &&
          (nombreMatLower.includes('materia electiva arqueología') ||
            nombreMatLower.includes('materia electiva arqueologia') ||
            nombreMatLower.includes('electiva arqueología') ||
            nombreMatLower.includes('electiva arqueologia'));

        const materiasElectivasArqCFO = (orientationObj.cfo || []).filter(m => {
          const n = (m.name || '').toLowerCase();
          return (
            n.includes('materia electiva arqueología') ||
            n.includes('materia electiva arqueologia') ||
            n.includes('electiva arqueología') ||
            n.includes('electiva arqueologia')
          );
        });

        const opcionesElectivasOcupadasEnOtras = new Set();
        if (esElectivaArqueologiaCFO) {
          materiasElectivasArqCFO.forEach(el => {
            if (el.id !== mat.id) {
              const otraVal = studentData[selectedPlan]?.[el.id]?.customName;
              if (OPCIONES_ELECTIVAS_ARQUEOLOGIA.includes(otraVal)) {
                opcionesElectivasOcupadasEnOtras.add(otraVal);
              }
            }
          });
        }

        const esElectivaSociocultural =
          selectedOrientation === 'sociocultural' &&
          (esElectiva || nombreMatLower.includes('electiva') || nombreMatLower.includes('área temática') || nombreMatLower.includes('area tematica'));

        const esElectivaLibreUBA =
          esElectivaSociocultural &&
          (nombreMatLower.includes('cualquier orientación') ||
            nombreMatLower.includes('cualquier orientacion') ||
            nombreMatLower.includes('facultad') ||
            nombreMatLower.includes('libre'));

        const esElectivaAreaTematica =
          esElectivaSociocultural && !esElectivaLibreUBA;

        const areaSeleccionada = st.areaTematicaElectiva || '';
        const materiasAreaSeleccionada = AREAS_TEMATICAS_SOCIOCULTURAL[areaSeleccionada] || [];

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
        const aplazosCBCList = Array.isArray(st.aplazosCBC) ? st.aplazosCBC : [];
        const aplazosCFGList = Array.isArray(st.aplazosCFG) ? st.aplazosCFG : [];
        const aplazosCFOList = Array.isArray(st.aplazosCFO) ? st.aplazosCFO : [];

        return (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="text-base font-black text-slate-900">{mat.name}</h3>
                  {st.customName && (
                    <p className="text-xs font-bold text-sky-700 mt-0.5">{st.customName}</p>
                  )}
                  <p className="text-[10px] text-slate-500">Configuración, selección de cátedra y notas</p>
                  <p className="text-[11px] font-bold text-sky-800 mt-0.5">Carga horaria asignada: {horasMateriaDetalle} hs</p>
                </div>
                <button onClick={() => setActiveDetailMateria(null)} className="text-slate-400 font-bold text-xl">×</button>
              </div>

              {esSeminarioCargadoCatalogo && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center justify-between gap-2">
                  <p className="text-[11px] font-semibold text-red-900">
                    ¿Cargaste un seminario que no correspondía? Podés eliminarlo para dejar este espacio vacío.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleVaciarSeminarioEnLibreta(mat.id)}
                    className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Eliminar seminario
                  </button>
                </div>
              )}

              {(() => {
                const textoMateria = `${mat.id || ''} ${mat.name || ''} ${mat.etapa || ''}`.toLowerCase();
                const esOptativa = textoMateria.includes('optativa') && !mat.esCustomSeminario && !esElectivaSociocultural && !esElectivaProfCFG && !esElectivaCsEducacionCFE;

                if (!esOptativa) return null;

                return (
                  <div className="space-y-3 bg-sky-50 p-4 rounded-xl border border-sky-200">
                    <div>
                      <label className="text-xs font-bold uppercase text-sky-900 block mb-1">Facultad:</label>
                      <select
                        value={st.facultadElectiva || ''}
                        onChange={(e) => handleUpdateMateria(mat.id, 'facultadElectiva', e.target.value)}
                        className="w-full bg-white border border-sky-300 rounded-lg p-2 text-xs font-semibold"
                      >
                        <option value="">-- Seleccionar facultad --</option>
                        {FACULTADES_UBA.map((fac) => (
                          <option key={fac} value={fac}>{fac}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-sky-900 block mb-1">Carrera:</label>
                      <input
                        type="text"
                        placeholder="Escribí la carrera..."
                        value={st.carreraElectiva || ''}
                        onChange={(e) => handleUpdateMateria(mat.id, 'carreraElectiva', e.target.value)}
                        className="w-full bg-white border border-sky-300 rounded-lg p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-sky-900 block mb-1">Nombre de la materia:</label>
                      <input
                        type="text"
                        placeholder="Escribí el nombre de la materia optativa..."
                        value={st.customName || ''}
                        onChange={(e) => handleUpdateMateria(mat.id, 'customName', e.target.value)}
                        className="w-full bg-white border border-sky-300 rounded-lg p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-sky-900 block mb-1">Código de materia:</label>
                      <input
                        type="text"
                        placeholder="Ej: 0421"
                        value={st.codigoOptativa || ''}
                        onChange={(e) => handleUpdateMateria(mat.id, 'codigoOptativa', e.target.value)}
                        className="w-full bg-white border border-sky-300 rounded-lg p-2 text-xs"
                      />
                    </div>
                  </div>
                );
              })()}

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

              {esElectivaProfCFG && (
                <div className="space-y-3 bg-sky-50 p-4 rounded-xl border border-sky-200">
                  <div>
                    <label className="text-xs font-bold uppercase text-sky-900 block mb-1">Seleccione la Orientación:</label>
                    <select
                      value={orientacionElectivaProfCFG}
                      onChange={(e) => {
                        handleUpdateMateria(mat.id, 'orientacionElectivaCFG', e.target.value);
                        handleUpdateMateria(mat.id, 'customName', '');
                      }}
                      className="w-full bg-white border border-sky-300 rounded-lg p-2 text-xs font-semibold"
                    >
                      <option value="">-- Seleccionar orientación --</option>
                      {Object.keys(ELECTIVAS_CFG_PROFESORADO_2023).map((ori) => (
                        <option key={ori} value={ori}>{ori}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-sky-900 block mb-1">Seleccione la Materia:</label>
                    <select
                      value={st.customName || ''}
                      onChange={(e) => handleUpdateMateria(mat.id, 'customName', e.target.value)}
                      disabled={!orientacionElectivaProfCFG}
                      className="w-full bg-white border border-sky-300 rounded-lg p-2 text-xs font-semibold disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      <option value="">
                        {orientacionElectivaProfCFG ? '-- Seleccionar materia --' : '-- Primero elegí una orientación --'}
                      </option>
                      {opcionesMateriasElectivasProfCFG.map((opcionMat) => (
                        <option key={opcionMat} value={opcionMat}>{opcionMat}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {esCFG && !esElectivaProfCFG && (() => {
                const nombreMat = mat.name.toLowerCase();
                const idMat = mat.id.toLowerCase();
                let opcionesCatedrasCFG = [];

                if (nombreMat.includes('epistemología') || idMat.includes('epistemologia')) {
                  opcionesCatedrasCFG = ['Cátedra Glavich', 'Cátedra Hernández'];
                } else if (nombreMat.includes('historia y teoría de la antropología 1') || nombreMat.includes('historia y teoria de la antropología 1') || idMat.includes('antropologia-1') || idMat.includes('historia-1')) {
                  opcionesCatedrasCFG = ['Cátedra Roca'];
                } else if (nombreMat.includes('historia y teoría de la antropología 2') || nombreMat.includes('historia y teoria de la antropología 2') || idMat.includes('antropologia-2') || idMat.includes('historia-2')) {
                  opcionesCatedrasCFG = ['Cátedra Brac', 'Cátedra Garaño'];
                } else if (nombreMat.includes('problemas de antropología económica') || idMat.includes('economica')) {
                  opcionesCatedrasCFG = ['Cátedra Petz-Scaglia'];
                } else if (nombreMat.includes('problemas de antropología simbólica') || idMat.includes('simbolica')) {
                  opcionesCatedrasCFG = ['Cátedra Wright'];
                } else if (nombreMat.includes('antropología biológica') || idMat.includes('biologica')) {
                  opcionesCatedrasCFG = ['Cátedra Avena'];
                } else if (nombreMat.includes('introducción a la arqueología') || idMat.includes('arqueologia')) {
                  opcionesCatedrasCFG = ['Cátedra Lanza'];
                } else if (nombreMat.includes('arqueología, legislación y comunidad') || idMat.includes('legislacion')) {
                  opcionesCatedrasCFG = ['Cátedra Salerno'];
                } else if (nombreMat.includes('problemas de antropología social y política') || idMat.includes('social-y-politica')) {
                  opcionesCatedrasCFG = ['Cátedra Novaro', 'Cátedra Balbi', 'Cátedra Fernández', 'Cátedra Pita'];
                } else {
                  opcionesCatedrasCFG = ['Cátedra por confirmar'];
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

              {esElectivaCsEducacionCFE && (
                <div className="space-y-2 bg-sky-50 p-4 rounded-xl border border-sky-200">
                  <label className="text-xs font-bold uppercase text-sky-900 block">Seleccione la Materia Electiva de Cs. de la Educación:</label>
                  <select
                    value={st.customName || ''}
                    onChange={(e) => handleUpdateMateria(mat.id, 'customName', e.target.value)}
                    className="w-full bg-white border border-sky-300 rounded-lg p-2 text-xs font-semibold"
                  >
                    <option value="">-- Seleccionar materia --</option>
                    {OPCIONES_ELECTIVAS_CS_EDUCACION_CFE.map((opcionMat) => (
                      <option
                        key={opcionMat}
                        value={opcionMat}
                        disabled={opcionesElectivasEduOcupadasEnOtras.has(opcionMat)}
                      >
                        {opcionMat}{opcionesElectivasEduOcupadasEnOtras.has(opcionMat) ? ' (Ya elegida en la otra electiva)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {!esElectivaCsEducacionCFE && (esPsicologia1985CFO ? (
                <div className="space-y-2 bg-sky-50 p-4 rounded-xl border border-sky-200">
                  <label className="text-xs font-bold uppercase text-sky-900 block">Seleccione la materia:</label>
                  <select
                    value={st.customName || ''}
                    onChange={(e) => handleUpdateMateria(mat.id, 'customName', e.target.value)}
                    className="w-full bg-white border border-sky-300 rounded-lg p-2 text-xs font-semibold"
                  >
                    <option value="">-- Seleccionar opción --</option>
                    {OPCIONES_PSICOLOGIA_1985.map((opcion) => (
                      <option key={opcion} value={opcion}>{opcion}</option>
                    ))}
                  </select>
                </div>
              ) : esTeoriaSociologica1985CFO ? (
                <div className="space-y-2 bg-sky-50 p-4 rounded-xl border border-sky-200">
                  <label className="text-xs font-bold uppercase text-sky-900 block">Seleccione la materia:</label>
                  <select
                    value={st.customName || ''}
                    onChange={(e) => handleUpdateMateria(mat.id, 'customName', e.target.value)}
                    className="w-full bg-white border border-sky-300 rounded-lg p-2 text-xs font-semibold"
                  >
                    <option value="">-- Seleccionar opción --</option>
                    {OPCIONES_TEORIA_SOCIOLOGICA_1985.map((opcion) => (
                      <option key={opcion} value={opcion}>{opcion}</option>
                    ))}
                  </select>
                </div>
              ) : esMateriaMetodologicaEjercicio ? (
                <div className="space-y-2 bg-sky-50 p-4 rounded-xl border border-sky-200">
                  <label className="text-xs font-bold uppercase text-sky-900 block">Seleccione la materia:</label>
                  <select
                    value={st.customName || ''}
                    onChange={(e) => handleUpdateMateria(mat.id, 'customName', e.target.value)}
                    className="w-full bg-white border border-sky-300 rounded-lg p-2 text-xs font-semibold"
                  >
                    <option value="">-- Seleccionar opción --</option>
                    {OPCIONES_MATERIA_METODOLOGICA_EJERCICIO.map((opcion) => (
                      <option key={opcion} value={opcion}>{opcion}</option>
                    ))}
                  </select>
                </div>
              ) : esElectivaArqueologiaCFO ? (
                <div className="space-y-3 bg-sky-50 p-4 rounded-xl border border-sky-200">
                  <div>
                    <label className="text-xs font-bold uppercase text-sky-900 block mb-1">Facultad:</label>
                    <select
                      value={st.facultadElectiva || ''}
                      onChange={(e) => handleUpdateMateria(mat.id, 'facultadElectiva', e.target.value)}
                      className="w-full bg-white border border-sky-300 rounded-lg p-2 text-xs font-semibold"
                    >
                      <option value="">-- Seleccionar facultad --</option>
                      {FACULTADES_UBA.map((fac) => (
                        <option key={fac} value={fac}>{fac}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-sky-900 block mb-1">Carrera:</label>
                    <input
                      type="text"
                      placeholder="Escribí la carrera..."
                      value={st.carreraElectiva || ''}
                      onChange={(e) => handleUpdateMateria(mat.id, 'carreraElectiva', e.target.value)}
                      className="w-full bg-white border border-sky-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-sky-900 block mb-1">Nombre de la materia electiva:</label>
                    <select
                      value={st.customName || ''}
                      onChange={(e) => handleUpdateMateria(mat.id, 'customName', e.target.value)}
                      className="w-full bg-white border border-sky-300 rounded-lg p-2 text-xs font-semibold"
                    >
                      <option value="">-- Seleccionar opción --</option>
                      {OPCIONES_ELECTIVAS_ARQUEOLOGIA.map((opcion) => (
                        <option
                          key={opcion}
                          value={opcion}
                          disabled={opcionesElectivasOcupadasEnOtras.has(opcion)}
                        >
                          {opcion}{opcionesElectivasOcupadasEnOtras.has(opcion) ? ' (Ya elegida en la otra electiva)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-sky-900 block mb-1">Código de materia:</label>
                    <input
                      type="text"
                      placeholder="Escribí el código de la materia..."
                      value={st.codigoOptativa || ''}
                      onChange={(e) => handleUpdateMateria(mat.id, 'codigoOptativa', e.target.value)}
                      className="w-full bg-white border border-sky-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                </div>
              ) : (() => {
                const nombreMat = (mat.name || '').toLowerCase();
                const idMat = (mat.id || '').toLowerCase();
                let opcionesCatedrasCFO = [];

                if (nombreMat.includes('sociedades, culturas y estados') || idMat.includes('soc-1')) {
                  opcionesCatedrasCFO = ['Cátedra Estruch - Rodríguez'];
                } else if (nombreMat.includes('pueblos indígenas americanos') || idMat.includes('soc-2') || idMat.includes('arq-2')) {
                  opcionesCatedrasCFO = ['Cátedra Lenton'];
                } else if (nombreMat.includes('procesos culturales, folklore') || idMat.includes('soc-3')) {
                  opcionesCatedrasCFO = ['Cátedra Fischman'];
                } else if (nombreMat.includes('antropología lingüística') || idMat.includes('soc-4')) {
                  opcionesCatedrasCFO = ['Cátedra Skura - Hecht'];
                } else if (nombreMat.includes('teoría social') || idMat.includes('soc-5')) {
                  opcionesCatedrasCFO = ['Cátedra Cabrera - Murgida'];
                } else if (nombreMat.includes('teorías de la subjetividad') || idMat.includes('soc-6')) {
                  opcionesCatedrasCFO = ['Cátedra Varela - Orellano'];
                } 
                else if (nombreMat.includes('arqueología de áfrica') || idMat.includes('arq-1')) {
                  opcionesCatedrasCFO = ['Cátedra Arqueología'];
                } else if (nombreMat.includes('arqueología americana y argentina i') || idMat.includes('arq-2')) {
                  opcionesCatedrasCFO = ['Cátedra Arqueología Americana I'];
                } else if (nombreMat.includes('arqueología americana y argentina ii') || idMat.includes('arq-3')) {
                  opcionesCatedrasCFO = ['Cátedra Williams'];
                } else if (nombreMat.includes('arqueología argentina') || idMat.includes('arq-4')) {
                  opcionesCatedrasCFO = ['Cátedra Scheinsohn'];
                } else if (nombreMat.includes('materiales arqueológicos') || idMat.includes('arq-5')) {
                  opcionesCatedrasCFO = ['Cátedra Sacchi - Borrazo'];
                } else if (nombreMat.includes('geología para arqueólogos') || idMat.includes('arq-6')) {
                  opcionesCatedrasCFO = ['Cátedra Favier Dubois'];
                } else if (nombreMat.includes('teorías arqueológicas contemporáneas') || idMat.includes('arq-7')) {
                  opcionesCatedrasCFO = ['Cátedra Arqueología Contemporánea'];
                } else if (nombreMat.includes('modelos y métodos de análisis en arqueología') || idMat.includes('arq-8')) {
                  opcionesCatedrasCFO = ['Cátedra Franco - Manzi'];
                } else if (nombreMat.includes('metodología y técnicas de investigación arqueológica') || idMat.includes('arq-9')) {
                  opcionesCatedrasCFO = ['Cátedra Metodología Arqueológica'];
                } else if (nombreMat.includes('métodos cuantitativos en arqueología') || idMat.includes('arq-10')) {
                  opcionesCatedrasCFO = ['Cátedra Cuantitativos Arqueología'];
                }

                if (opcionesCatedrasCFO.length > 0) {
                  return (
                    <div className="space-y-2 bg-sky-50 p-4 rounded-xl border border-sky-200">
                      <label className="text-xs font-bold uppercase text-sky-900 block">Seleccione la Cátedra del {etiquetaBloqueEspecifico}:</label>
                      <select
                        value={st.customName || ''}
                        onChange={(e) => handleUpdateMateria(mat.id, 'customName', e.target.value)}
                        className="w-full bg-white border border-sky-300 rounded-lg p-2 text-xs font-semibold"
                      >
                        <option value="">-- Seleccionar cátedra --</option>
                        {opcionesCatedrasCFO.map((cat, idx) => (
                          <option key={idx} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  );
                }
                return null;
              })())}

              {esElectivaLibreUBA && (
                <div className="space-y-3 bg-sky-50 p-4 rounded-xl border border-sky-200">
                  <label className="text-xs font-bold uppercase text-sky-900 block">Materia Electiva Libre (UBA):</label>
                  <div>
                    <span className="text-[10px] font-bold text-sky-900 block mb-1">Facultad de la UBA:</span>
                    <select
                      value={st.facultadElectiva || ''}
                      onChange={(e) => handleUpdateMateria(mat.id, 'facultadElectiva', e.target.value)}
                      className="w-full bg-white border border-sky-300 rounded-lg p-2 text-xs font-semibold"
                    >
                      <option value="">-- Seleccionar facultad --</option>
                      {FACULTADES_UBA.map((fac) => (
                        <option key={fac} value={fac}>{fac}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-sky-900 block mb-1">Carrera:</span>
                    <input
                      type="text"
                      placeholder="Escribí la carrera..."
                      value={st.carreraElectiva || ''}
                      onChange={(e) => handleUpdateMateria(mat.id, 'carreraElectiva', e.target.value)}
                      className="w-full bg-white border border-sky-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-sky-900 block mb-1">Nombre de la materia:</span>
                    <input
                      type="text"
                      placeholder="Escribí el nombre de la materia..."
                      value={st.customName || ''}
                      onChange={(e) => handleUpdateMateria(mat.id, 'customName', e.target.value)}
                      className="w-full bg-white border border-sky-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-sky-900 block mb-1">Código de la materia:</span>
                    <input
                      type="text"
                      placeholder="Escribí el código de la materia..."
                      value={st.codigoOptativa || ''}
                      onChange={(e) => handleUpdateMateria(mat.id, 'codigoOptativa', e.target.value)}
                      className="w-full bg-white border border-sky-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                </div>
              )}

              {esElectivaAreaTematica && (
                <div className="space-y-3 bg-sky-50 p-4 rounded-xl border border-sky-200">
                  <div>
                    <label className="text-xs font-bold uppercase text-sky-900 block mb-1">Seleccione el Área Temática:</label>
                    <select
                      value={areaSeleccionada}
                      onChange={(e) => {
                        handleUpdateMateria(mat.id, 'areaTematicaElectiva', e.target.value);
                        handleUpdateMateria(mat.id, 'customName', '');
                      }}
                      className="w-full bg-white border border-sky-300 rounded-lg p-2 text-xs font-semibold"
                    >
                      <option value="">-- Seleccionar área temática --</option>
                      {Object.keys(AREAS_TEMATICAS_SOCIOCULTURAL).map((area) => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-sky-900 block mb-1">Seleccione la Materia del Área Temática:</label>
                    <select
                      value={st.customName || ''}
                      onChange={(e) => handleUpdateMateria(mat.id, 'customName', e.target.value)}
                      disabled={!areaSeleccionada}
                      className="w-full bg-white border border-sky-300 rounded-lg p-2 text-xs font-semibold disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      <option value="">
                        {areaSeleccionada ? '-- Seleccionar materia --' : '-- Primero elegí un área temática --'}
                      </option>
                      {materiasAreaSeleccionada.map((opcionMat) => (
                        <option key={opcionMat} value={opcionMat}>{opcionMat}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {esElectiva && !esElectivaSociocultural && (
                <div className="space-y-3 bg-sky-50 p-4 rounded-xl border border-sky-200">
                  <div>
                    <label className="text-xs font-bold uppercase text-sky-900 block mb-1">Facultad:</label>
                    <select
                      value={st.facultadElectiva || ''}
                      onChange={(e) => handleUpdateMateria(mat.id, 'facultadElectiva', e.target.value)}
                      className="w-full bg-white border border-sky-300 rounded-lg p-2 text-xs font-semibold"
                    >
                      <option value="">-- Seleccionar facultad --</option>
                      {FACULTADES_UBA.map((fac) => (
                        <option key={fac} value={fac}>{fac}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-sky-900 block mb-1">Carrera:</label>
                    <input
                      type="text"
                      placeholder="Escribí la carrera..."
                      value={st.carreraElectiva || ''}
                      onChange={(e) => handleUpdateMateria(mat.id, 'carreraElectiva', e.target.value)}
                      className="w-full bg-white border border-sky-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-sky-900 block mb-1">Nombre de la materia:</label>
                    <select
                      value={st.customName || ''}
                      onChange={(e) => handleUpdateMateria(mat.id, 'customName', e.target.value)}
                      className="w-full bg-white border border-sky-300 rounded-lg p-2 text-xs font-semibold mb-2"
                    >
                      <option value="">-- Seleccionar de la oferta disponible --</option>
                      {seminariosOferta.map(sem => (
                        <option key={sem.id} value={`${sem.nombre} (${sem.docente})`}>
                          {sem.nombre} - {sem.docente} ({getEtiquetaOrientacion(sem.tipo)})
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="O escribí el nombre de la materia electiva..."
                      value={st.customName || ''}
                      onChange={(e) => handleUpdateMateria(mat.id, 'customName', e.target.value)}
                      className="w-full bg-white border border-sky-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-sky-900 block mb-1">Código de la materia:</label>
                    <input
                      type="text"
                      placeholder="Escribí el código de la materia..."
                      value={st.codigoOptativa || ''}
                      onChange={(e) => handleUpdateMateria(mat.id, 'codigoOptativa', e.target.value)}
                      className="w-full bg-white border border-sky-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                </div>
              )}

              {esSeminarioCuatrimestral64 ? (
                <div className="space-y-2 bg-slate-100 p-4 rounded-xl border border-slate-200">
                  <label className="text-xs font-bold uppercase text-slate-800 block">Modalidad de cursada:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['100% virtual', '100% presencial', 'Híbrido'].map((opcionMod) => (
                      <button
                        key={opcionMod}
                        type="button"
                        onClick={() => handleUpdateMateria(mat.id, 'modalidadCursada', opcionMod)}
                        className={`py-2 px-2.5 text-xs font-bold rounded-xl border transition ${modalidadActual === opcionMod ? 'bg-sky-700 text-white border-sky-800 shadow-sm' : 'bg-white text-slate-700 border-slate-200'}`}
                      >
                        {opcionMod}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
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
              )}

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
                      {ANIOS_OPCIONES.map((yr) => (
                        <option key={yr} value={yr}>{yr}</option>
                      ))}
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
                      <option value="Anual">Anual</option>
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

                {esSeminarioCargadoCatalogo ? (
                  <div className="space-y-2 pt-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" placeholder="Profesor/a 1" value={st.docente1 || ''} onChange={(e) => handleUpdateMateria(mat.id, 'docente1', e.target.value)} className="bg-white border rounded-lg p-2 text-xs" />
                      <input type="email" placeholder="Correo Profesor/a 1" value={st.emailDocente1 || ''} onChange={(e) => handleUpdateMateria(mat.id, 'emailDocente1', e.target.value)} className="bg-white border rounded-lg p-2 text-xs" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" placeholder="Profesor/a 2" value={st.docente2 || ''} onChange={(e) => handleUpdateMateria(mat.id, 'docente2', e.target.value)} className="bg-white border rounded-lg p-2 text-xs" />
                      <input type="email" placeholder="Correo Profesor/a 2" value={st.emailDocente2 || ''} onChange={(e) => handleUpdateMateria(mat.id, 'emailDocente2', e.target.value)} className="bg-white border rounded-lg p-2 text-xs" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" placeholder="Profesor/a 3" value={st.docente3 || ''} onChange={(e) => handleUpdateMateria(mat.id, 'docente3', e.target.value)} className="bg-white border rounded-lg p-2 text-xs" />
                      <input type="email" placeholder="Correo Profesor/a 3" value={st.emailDocente3 || ''} onChange={(e) => handleUpdateMateria(mat.id, 'emailDocente3', e.target.value)} className="bg-white border rounded-lg p-2 text-xs" />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <input type="text" placeholder="Profesor Teórico" value={st.docenteTeorico || ''} onChange={(e) => handleUpdateMateria(mat.id, 'docenteTeorico', e.target.value)} className="bg-white border rounded-lg p-2 text-xs" />
                      <input type="email" placeholder="Correo Teórico" value={st.emailTeorico || ''} onChange={(e) => handleUpdateMateria(mat.id, 'emailTeorico', e.target.value)} className="bg-white border rounded-lg p-2 text-xs" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <input type="text" placeholder="Profesor Práctico" value={st.docentePractico || ''} onChange={(e) => handleUpdateMateria(mat.id, 'docentePractico', e.target.value)} className="bg-white border rounded-lg p-2 text-xs" />
                      <input type="email" placeholder="Correo Práctico" value={st.emailPractico || ''} onChange={(e) => handleUpdateMateria(mat.id, 'emailPractico', e.target.value)} className="bg-white border rounded-lg p-2 text-xs" />
                    </div>
                  </>
                )}
              </div>

              {esSeminarioCuatrimestral64 ? (
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5"><CheckSquare className="w-4 h-4 text-sky-600" /> Evaluaciones y Notas</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch">
                    <div className="flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-slate-600 block mb-1.5">Trabajo práctico o examen domiciliario</span>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.01"
                        placeholder="Nota"
                        value={st.trabajoPractico || ''}
                        onChange={(e) => handleUpdateMateria(mat.id, 'trabajoPractico', e.target.value)}
                        className="w-full bg-white border rounded-lg p-2 text-xs text-center font-bold"
                      />
                    </div>
                    <div className="flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-slate-600 block mb-1.5">Trabajo final o monografía</span>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.01"
                        placeholder="Nota"
                        value={st.trabajoFinal || ''}
                        onChange={(e) => handleUpdateMateria(mat.id, 'trabajoFinal', e.target.value)}
                        className="w-full bg-white border rounded-lg p-2 text-xs text-center font-bold"
                      />
                    </div>
                  </div>
                </div>
              ) : (
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
                      <p className="text-[9px] text-slate-500 mt-1">La nota de aprobación final es la que sacás al aprobar. Los aplazos previos (menor a 4) computan para el promedio general de la carrera.</p>
                    )}
                  </div>
                </div>
              )}

              {esCBC && (
                <div className="space-y-2 bg-red-50/40 p-4 rounded-xl border border-red-200">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-red-800 uppercase tracking-wide">Cursadas anteriores reprobadas (Aplazos CBC)</span>
                    <button
                      type="button"
                      onClick={() => handleUpdateMateria(mat.id, 'aplazosCBC', [...aplazosCBCList, ''])}
                      className="flex items-center gap-1 bg-white hover:bg-red-100 text-red-800 border border-red-200 text-[10px] font-bold px-2.5 py-1 rounded-lg transition"
                    >
                      <Plus className="w-3 h-3" /> Agregar aplazo
                    </button>
                  </div>
                  {aplazosCBCList.length > 0 && (
                    <div className="space-y-1.5">
                      {aplazosCBCList.map((notaAp, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-white border border-red-200 rounded-lg px-2.5 py-1.5">
                          <span className="text-[10px] font-bold text-red-900 flex-1">Intento {idx + 1} reprobado:</span>
                          <input
                            type="number"
                            min="0"
                            max="3"
                            step="1"
                            placeholder="0-3"
                            value={notaAp}
                            onChange={(e) => {
                              const nuevaLista = [...aplazosCBCList];
                              nuevaLista[idx] = e.target.value;
                              handleUpdateMateria(mat.id, 'aplazosCBC', nuevaLista);
                            }}
                            className="w-16 bg-white border border-red-300 rounded-md p-1 text-xs text-center font-bold text-red-900"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const nuevaLista = aplazosCBCList.filter((_, i) => i !== idx);
                              handleUpdateMateria(mat.id, 'aplazosCBC', nuevaLista);
                            }}
                            className="text-red-500 hover:text-red-700 font-bold text-sm px-1"
                            title="Eliminar intento"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-[9px] text-slate-600">Si recursaste esta materia del CBC en una cursada pasada, cargá aquí las notas reprobadas (menores a 4) para que computen en el promedio del CBC y de la carrera.</p>
                </div>
              )}

              {esCFG && (
                <div className="space-y-2 bg-red-50/40 p-4 rounded-xl border border-red-200">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-red-800 uppercase tracking-wide">Cursadas anteriores reprobadas (Aplazos CFG)</span>
                    <button
                      type="button"
                      onClick={() => handleUpdateMateria(mat.id, 'aplazosCFG', [...aplazosCFGList, ''])}
                      className="flex items-center gap-1 bg-white hover:bg-red-100 text-red-800 border border-red-200 text-[10px] font-bold px-2.5 py-1 rounded-lg transition"
                    >
                      <Plus className="w-3 h-3" /> Agregar aplazo
                    </button>
                  </div>
                  {aplazosCFGList.length > 0 && (
                    <div className="space-y-1.5">
                      {aplazosCFGList.map((notaAp, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-white border border-red-200 rounded-lg px-2.5 py-1.5">
                          <span className="text-[10px] font-bold text-red-900 flex-1">Intento {idx + 1} reprobado:</span>
                          <input
                            type="number"
                            min="0"
                            max="3"
                            step="1"
                            placeholder="0-3"
                            value={notaAp}
                            onChange={(e) => {
                              const nuevaLista = [...aplazosCFGList];
                              nuevaLista[idx] = e.target.value;
                              handleUpdateMateria(mat.id, 'aplazosCFG', nuevaLista);
                            }}
                            className="w-16 bg-white border border-red-300 rounded-md p-1 text-xs text-center font-bold text-red-900"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const nuevaLista = aplazosCFGList.filter((_, i) => i !== idx);
                              handleUpdateMateria(mat.id, 'aplazosCFG', nuevaLista);
                            }}
                            className="text-red-500 hover:text-red-700 font-bold text-sm px-1"
                            title="Eliminar intento"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-[9px] text-slate-600">Si recursaste esta materia del CFG en una cursada pasada, cargá aquí las notas reprobadas (menores a 4) para que computen en el promedio del CFG y de la carrera.</p>
                </div>
              )}

              {esCFO && (
                <div className="space-y-2 bg-red-50/40 p-4 rounded-xl border border-red-200">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-red-800 uppercase tracking-wide">Cursadas anteriores reprobadas (Aplazos {etiquetaBloqueEspecifico})</span>
                    <button
                      type="button"
                      onClick={() => handleUpdateMateria(mat.id, 'aplazosCFO', [...aplazosCFOList, ''])}
                      className="flex items-center gap-1 bg-white hover:bg-red-100 text-red-800 border border-red-200 text-[10px] font-bold px-2.5 py-1 rounded-lg transition"
                    >
                      <Plus className="w-3 h-3" /> Agregar aplazo
                    </button>
                  </div>
                  {aplazosCFOList.length > 0 && (
                    <div className="space-y-1.5">
                      {aplazosCFOList.map((notaAp, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-white border border-red-200 rounded-lg px-2.5 py-1.5">
                          <span className="text-[10px] font-bold text-red-900 flex-1">Intento {idx + 1} reprobado:</span>
                          <input
                            type="number"
                            min="0"
                            max="3"
                            step="1"
                            placeholder="0-3"
                            value={notaAp}
                            onChange={(e) => {
                              const nuevaLista = [...aplazosCFOList];
                              nuevaLista[idx] = e.target.value;
                              handleUpdateMateria(mat.id, 'aplazosCFO', nuevaLista);
                            }}
                            className="w-16 bg-white border border-red-300 rounded-md p-1 text-xs text-center font-bold text-red-900"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const nuevaLista = aplazosCFOList.filter((_, i) => i !== idx);
                              handleUpdateMateria(mat.id, 'aplazosCFO', nuevaLista);
                            }}
                            className="text-red-500 hover:text-red-700 font-bold text-sm px-1"
                            title="Eliminar intento"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-[9px] text-slate-600">Si recursaste esta materia del {etiquetaBloqueEspecifico} en una cursada pasada, cargá aquí las notas reprobadas (menores a 4) para que computen en el promedio del {etiquetaBloqueEspecifico} y de la carrera.</p>
                </div>
              )}

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
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Bookmark className="w-5 h-5 text-sky-600" /> Catálogo de Seminarios</h3>
              <button onClick={() => { limpiarFormularioSeminario(); setShowSeminarioModal(false); }} className="text-slate-400 font-bold text-lg">×</button>
            </div>

            <form onSubmit={handleAgregarSeminarioManualACatalogo} className="bg-sky-50 border border-sky-200 rounded-xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase text-sky-900">
                  {editandoSemId ? 'Editando seminario del catálogo' : 'Agregar seminario al catálogo'}
                </p>
                {editandoSemId && (
                  <button
                    type="button"
                    onClick={limpiarFormularioSeminario}
                    className="text-[11px] font-bold text-slate-600 hover:text-slate-900 underline"
                  >
                    Cancelar edición
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Nombre del seminario *"
                  value={nuevoSemNombre}
                  onChange={(e) => setNuevoSemNombre(e.target.value)}
                  className="sm:col-span-2 bg-white border border-sky-300 rounded-lg px-3 py-2 text-xs font-semibold"
                />
                <input
                  type="text"
                  placeholder="Código (opcional)"
                  value={nuevoSemCodigo}
                  onChange={(e) => setNuevoSemCodigo(e.target.value)}
                  className="bg-white border border-sky-300 rounded-lg px-3 py-2 text-xs"
                />
                <select
                  required
                  value={nuevoSemTipo}
                  onChange={(e) => setNuevoSemTipo(e.target.value)}
                  className="bg-white border border-sky-300 rounded-lg px-2.5 py-2 text-xs font-semibold"
                >
                  <option value="sociocultural">Sociocultural</option>
                  <option value="arqueologia">Arqueología</option>
                  <option value="ambas">Ambas</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <select
                  required
                  value={nuevoSemAnio}
                  onChange={(e) => setNuevoSemAnio(e.target.value)}
                  className="bg-white border border-sky-300 rounded-lg px-2.5 py-2 text-xs font-semibold"
                >
                  {ANIOS_OPCIONES.map((yr) => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
                <select
                  required
                  value={nuevoSemCuatrimestre}
                  onChange={(e) => setNuevoSemCuatrimestre(e.target.value)}
                  className="bg-white border border-sky-300 rounded-lg px-2.5 py-2 text-xs font-semibold"
                >
                  <option value="1° Cuatrimestre">1° Cuatrimestre</option>
                  <option value="2° Cuatrimestre">2° Cuatrimestre</option>
                  <option value="Anual">Anual</option>
                  <option value="Verano">Verano</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Docente / Cátedra 1 *"
                  value={nuevoSemDocente1}
                  onChange={(e) => setNuevoSemDocente1(e.target.value)}
                  className="bg-white border border-sky-300 rounded-lg px-3 py-2 text-xs"
                />
                <input
                  type="text"
                  placeholder="Docente / Cátedra 2 (opcional)"
                  value={nuevoSemDocente2}
                  onChange={(e) => setNuevoSemDocente2(e.target.value)}
                  className="bg-white border border-sky-300 rounded-lg px-3 py-2 text-xs"
                />
                <input
                  type="text"
                  placeholder="Docente / Cátedra 3 (opcional)"
                  value={nuevoSemDocente3}
                  onChange={(e) => setNuevoSemDocente3(e.target.value)}
                  className="bg-white border border-sky-300 rounded-lg px-3 py-2 text-xs"
                />
              </div>
              <div className="flex items-center justify-between gap-2 pt-1">
                <label className="flex items-center gap-2 text-xs font-bold text-sky-950 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={nuevoSemEsPst}
                    onChange={(e) => setNuevoSemEsPst(e.target.checked)}
                    className="w-4 h-4 rounded border-sky-400 text-sky-700 focus:ring-sky-500"
                  />
                  Es un PST (Práctica Socioeducativa Territorializada)
                </label>
                <div className="flex items-center gap-2">
                  {editandoSemId && (
                    <button
                      type="button"
                      onClick={limpiarFormularioSeminario}
                      className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-lg transition"
                    >
                      Cancelar
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition shrink-0"
                  >
                    {editandoSemId ? <><Check className="w-4 h-4" /> Guardar Cambios</> : <><Plus className="w-4 h-4" /> Guardar en Catálogo</>}
                  </button>
                </div>
              </div>
            </form>

            <div className="space-y-2.5 bg-slate-100 p-3 rounded-xl border border-slate-200">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase text-slate-600">Año:</span>
                {['2026', '2025', '2024'].map((yr) => {
                  const activo = !filtroSemAnioInput.trim() && filtroSemAnio === yr;
                  return (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => {
                        setFiltroSemAnioInput('');
                        setFiltroSemAnio(activo ? 'todos' : yr);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold border transition ${
                        activo
                          ? 'bg-sky-700 text-white border-sky-800 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {yr}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => {
                    setFiltroSemAnioInput('');
                    setFiltroSemAnio('todos');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                    !filtroSemAnioInput.trim() && filtroSemAnio === 'todos'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  Todos
                </button>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Otro año..."
                  value={filtroSemAnioInput}
                  onChange={(e) => {
                    setFiltroSemAnioInput(e.target.value);
                    if (e.target.value.trim()) setFiltroSemAnio('todos');
                  }}
                  className="w-28 bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-semibold outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-600 mr-1">Cuatrimestre:</span>
                {[
                  { value: 'todos', label: 'Todos' },
                  { value: '1° Cuatrimestre', label: '1er cuatrimestre' },
                  { value: '2° Cuatrimestre', label: '2do cuatrimestre' },
                  { value: 'Anual', label: 'Anual' },
                  { value: 'Verano', label: 'Verano' }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFiltroSemCuatrimestre(opt.value)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                      filtroSemCuatrimestre === opt.value
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {seminariosFiltrados.map(s => (
                <div key={s.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border gap-3 ${editandoSemId === s.id ? 'bg-sky-50 border-sky-400' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${getClaseEtiquetaOrientacion(s.tipo)}`}>
                        {getEtiquetaOrientacion(s.tipo)}
                      </span>
                      {esSeminarioPst(s) && (
                        <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-200">
                          PST
                        </span>
                      )}
                      {s.codigo && <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">Cód: {s.codigo}</span>}
                      {(s.anio || s.cuatrimestre) && (
                        <span className="text-[9px] font-semibold text-slate-500">
                          {[s.anio, s.cuatrimestre].filter(Boolean).join(' · ')}
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-slate-800 text-xs mt-1">{s.nombre}</p>
                    <p className="text-[11px] text-slate-500">{s.docente}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => handleAgregarSeminarioACursada(s)} className="flex items-center justify-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition">
                      <Plus className="w-4 h-4" /> Agregar a mi cursada
                    </button>
                    <button type="button" onClick={() => handleIniciarEdicionSeminario(s)} title="Editar seminario" className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl transition">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => handleEliminarSeminarioCatalogo(s)} title="Eliminar del catálogo" className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end"><button onClick={() => { limpiarFormularioSeminario(); setShowSeminarioModal(false); }} className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl">Cerrar</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
