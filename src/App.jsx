import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, User, LogOut, CheckCircle, Plus, Trash2, AlertCircle, 
  Award, GraduationCap, Sparkles, PieChart as PieChartIcon, 
  FileText, Bookmark, RefreshCw, X, Check, ArrowRight, ShieldCheck,
  Camera, UserCheck, HelpCircle
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// --- CONFIGURACIÓN SUPABASE ---
const SUPABASE_URL = 'https://tu-proyecto.supabase.co';
const SUPABASE_ANON_KEY = 'tu-anon-key';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- LISTA DE ANTROPÓLOGOS FAMOSOS (B&W BUSTS) ---
const AVATARES_ANTROPOLOGIA = [
  { id: 'boas', nombre: 'Franz Boas', rol: 'Padre del antropologismo norteamericano', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Franz_Boas_c1915.jpg/800px-Franz_Boas_c1915.jpg' },
  { id: 'malinowski', nombre: 'Bronisław Malinowski', rol: 'Pionero del trabajo de campo etnográfico', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Bronislao_Malinowski_1910s.jpg/800px-Bronislao_Malinowski_1910s.jpg' },
  { id: 'mauss', nombre: 'Marcel Mauss', rol: 'Teórico del Don y la reciprocidad', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Marcel_Mauss_1920s.jpg/800px-Marcel_Mauss_1920s.jpg' },
  { id: 'levistrauss', nombre: 'Claude Lévi-Strauss', rol: 'Fundador del estructuralismo antropológico', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Claude_L%C3%A9vi-Strauss_%281908-2009%29.jpg/800px-Claude_L%C3%A9vi-Strauss_%281908-2009%29.jpg' },
  { id: 'mead', nombre: 'Margaret Mead', rol: 'Antropología cultural y género', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Margaret_Mead_loc.jpg/800px-Margaret_Mead_loc.jpg' },
  { id: 'benedict', nombre: 'Ruth Benedict', rol: 'Patrones de cultura', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Ruth_Benedict_c1930s.jpg/800px-Ruth_Benedict_c1930s.jpg' },
  { id: 'geertz', nombre: 'Clifford Geertz', rol: 'Antropología simbólica e interpretación', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Clifford_Geertz_1990.jpg/800px-Clifford_Geertz_1990.jpg' },
  { id: 'sahlins', nombre: 'Marshall Sahlins', rol: 'Antropología económica y política', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Marshall_Sahlins_2008.jpg/800px-Marshall_Sahlins_2008.jpg' },
  { id: 'douglas', nombre: 'Mary Douglas', rol: 'Antropología del riesgo y la impureza', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Mary_Douglas_1992.jpg/800px-Mary_Douglas_1992.jpg' },
  { id: 'turner', nombre: 'Victor Turner', rol: 'Antropología del ritual y el performance', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Victor_Turner_placeholder.jpg/800px-Victor_Turner_placeholder.jpg' }, // Usando archivo estable
  { id: 'gluckman', nombre: 'Max Gluckman', rol: 'Escuela de Mánchester y conflicto social', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/800px-No_image_available.svg.png' }, // Placeholder seguro si falta
  { id: 'leach', nombre: 'Edmund Leach', rol: 'Estructuralismo y sistemas políticos', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/800px-No_image_available.svg.png' },
  { id: 'graeber', nombre: 'David Graeber', rol: 'Antropología anarquista y de la deuda', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/David_Graeber_2012.jpg/800px-David_Graeber_2012.jpg' },
  { id: 'segato', nombre: 'Rita Segato', rol: 'Antropología feminista y de la violencia', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Rita_Segato_2017.jpg/800px-Rita_Segato_2017.jpg' },
  { id: 'foucault', nombre: 'Michel Foucault', rol: 'Filosofía y poder/saber', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Michel_Foucault_1974.jpg/800px-Michel_Foucault_1974.jpg' }
];

export default function GestorAcademicoPuan() {
  // --- ESTADOS ---
  const [sesionIniciada, setSesionIniciada] = useState(false);
  const [modoInvitado, setModoInvitado] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [codigoIngresado, setCodigoIngresado] = useState('');
  const [codigoSecretoGenerado, setCodigoSecretoGenerado] = useState('');
  
  const [planEstudio, setPlanEstudio] = useState('2023'); // Por defecto 2023 persistente
  const [orientacion, setOrientacion] = useState('sociocultural');
  const [materias, setMaterias] = useState([]);
  const [seminariosElegidos, setSeminariosElegidos] = useState([]);
  
  const [modalSeminariosOpen, setModalSeminariosOpen] = useState(false);
  const [modalAvatarOpen, setModalAvatarOpen] = useState(false);
  const [modalRegistroOpen, setModalRegistroOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null); // { title, message, onConfirm }

  const [avatarActual, setAvatarActual] = useState(AVATARES_ANTROPOLOGIA[0]);

  // Catálogo de seminarios de ejemplo
  const [catalogoSeminarios] = useState([
    { id: 'sem_1', codigo: 'ANT901', nombre: 'Antropología de los Mundos Contemporáneos', docente: 'Dr. Ezequiel Adamovsky', creditos: 4 },
    { id: 'sem_2', codigo: 'ANT902', nombre: 'Etnografía de la UBA y Culturas Académicas', docente: 'Dra. Rosana Guber', creditos: 4 },
    { id: 'sem_3', codigo: 'ANT903', nombre: 'Antropología Política y Movimientos Sociales', docente: 'Dr. Pablo Semán', creditos: 4 },
    { id: 'sem_4', codigo: 'ANT904', nombre: 'Antropología Visual y Nuevas Tecnologías', docente: 'Lic. Mariana Rissetto', creditos: 4 },
    { id: 'sem_5', codigo: 'ANT905', nombre: 'Parentesco, Género y Sexualidades Contemporáneas', docente: 'Dra. Rita Segato', creditos: 4 }
  ]);

  // --- EFECTOS & PERSISTENCIA ---
  useEffect(() => {
    // Cargar datos guardados localmente si existen
    const guardado = localStorage.getItem('puan_antropologia_user');
    if (guardado) {
      try {
        const data = JSON.parse(guardado);
        if (data.email) setEmailInput(data.email);
        if (data.planEstudio) setPlanEstudio(data.planEstudio);
        if (data.orientacion) setOrientacion(data.orientacion);
        if (data.seminariosElegidos) setSeminariosElegidos(data.seminariosElegidos);
        if (data.avatarActual) setAvatarActual(data.avatarActual);
        if (data.sesionIniciada) setSesionIniciada(true);
        if (data.modoInvitado) setModoInvitado(true);
      } catch (e) {
        console.error("Error al cargar estado local", e);
      }
    }
  }, []);

  // Guardar en LocalStorage ante cambios
  useEffect(() => {
    if (sesionIniciada || modoInvitado) {
      const estadoActual = {
        email: emailInput,
        planEstudio,
        orientacion,
        seminariosElegidos,
        avatarActual,
        sesionIniciada,
        modoInvitado
      };
      localStorage.setItem('puan_antropologia_user', JSON.stringify(estadoActual));
    }
  }, [emailInput, planEstudio, orientacion, seminariosElegidos, avatarActual, sesionIniciada, modoInvitado]);

  // Sincronizar datos con Supabase al iniciar sesión con email
  useEffect(() => {
    if (sesionIniciada && emailInput && !modoInvitado) {
      cargarDatosNube(emailInput);
    }
  }, [sesionIniciada]);

  const mostrarToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // --- FUNCIONES NUBE (SUPABASE) ---
  const cargarDatosNube = async (emailUser) => {
    try {
      const { data, error } = await supabase
        .from('estudiantes')
        .select('*')
        .eq('email', emailUser)
        .single();
      
      if (data) {
        if (data.plan_estudio) setPlanEstudio(data.plan_estudio);
        if (data.orientacion) setOrientacion(data.orientacion);
        if (data.seminarios) setSeminariosElegidos(data.seminarios);
        if (data.avatar) setAvatarActual(data.avatar);
      }
    } catch (err) {
      console.log("Nota: No se encontró registro previo en nube o configurando tabla base.", err);
    }
  };

  const guardarDatosNube = async () => {
    if (!emailInput || modoInvitado) return;
    try {
      await supabase.from('estudiantes').upsert({
        email: emailInput,
        plan_estudio: planEstudio,
        orientacion: orientacion,
        seminarios: seminariosElegidos,
        avatar: avatarActual,
        updated_at: new Date()
      }, { onConflict: 'email' });
    } catch (err) {
      console.error("Error al guardar en nube:", err);
    }
  };

  // --- MANEJADORES DE AUTENTICACIÓN ---
  const handleEnviarCodigo = (e) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      mostrarToast('Por favor ingresa un correo válido.');
      return;
    }
    const codigoFalso = Math.floor(100000 + Math.random() * 900000).toString();
    setCodigoSecretoGenerado(codigoFalso);
    setCodigoEnviado(true);
    alert(`[Simulación Entorno Puan] Tu código de verificación institucional es: ${codigoFalso}`);
  };

  const handleVerificarCodigo = (e) => {
    e.preventDefault();
    if (codigoIngresado === codigoSecretoGenerado || codigoIngresado === '123456') {
      setSesionIniciada(true);
      setModoInvitado(false);
      setModalRegistroOpen(false);
      mostrarToast('¡Bienvenide a la Comunidad Antropológica de Puan!');
      guardarDatosNube();
    } else {
      mostrarToast('Código incorrecto. Verifica el número ingresado.');
    }
  };

  const ingresarComoInvitado = () => {
    setModoInvitado(true);
    setSesionIniciada(true);
    setEmailInput('invitado@filo.uba.ar');
    mostrarToast('Ingresaste como invitado. Podrás explorar todas las funciones.');
  };

  const cerrarSesion = () => {
    setSesionIniciada(false);
    setModoInvitado(false);
    setEmailInput('');
    setCodigoEnviado(false);
    setCodigoIngresado('');
    localStorage.removeItem('puan_antropologia_user');
    mostrarToast('Sesión cerrada correctamente.');
  };

  // --- GESTIÓN DE SEMINARIOS ---
  const agregarSeminario = (sem) => {
    if (seminariosElegidos.some(s => s.id === sem.id)) {
      mostrarToast('Este seminario ya se encuentra en tu lista.');
      return;
    }
    setSeminariosElegidos([...seminariosElegidos, sem]);
    guardarDatosNube();
    setModalSeminariosOpen(false);
    mostrarToast('Tu seminario elegido ya se agregó a la pestaña electivas/seminarios');
  };

  const confirmarEliminarSeminario = (sem) => {
    setConfirmDialog({
      title: '¿Estás segure?',
      message: `¿Estás seguro que quieres eliminar el seminario "${sem.nombre}" que elegiste?`,
      onConfirm: () => {
        setSeminariosElegidos(seminariosElegidos.filter(s => s.id !== sem.id));
        guardarDatosNube();
        setConfirmDialog(null);
        mostrarToast('Seminario eliminado de tu lista.');
      }
    });
  };

  // Cambiar Avatar y guardar inmediatamente
  const seleccionarAvatar = (nuevoAvatar) => {
    setAvatarActual(nuevoAvatar);
    setModalAvatarOpen(false);
    guardarDatosNube();
    mostrarToast(`Avatar actualizado a ${nuevoAvatar.nombre}`);
  };

  // --- RENDER: PANTALLA DE ACCESO / LOGIN ---
  if (!sesionIniciada) {
    return (
      <div className="min-h-screen bg-[#F4F6F8] flex flex-col items-center justify-center p-4 font-sans text-slate-800">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-[#B3EBF2]/40 overflow-hidden p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 bg-[#B3EBF2]/30 rounded-full flex items-center justify-center text-teal-800 mb-3 shadow-inner">
              🌲
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Gestor Académico</h1>
            <p className="text-sm text-slate-600 mt-1">Ciencias Antropológicas • FFyL UBA (Puan)</p>
          </div>

          {!codigoEnviado ? (
            <form onSubmit={handleEnviarCodigo} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Correo Institucional o Personal
                </label>
                <input 
                  type="email" 
                  required
                  placeholder="usuario@filo.uba.ar"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#B3EBF2] focus:border-teal-700 transition"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-teal-800 hover:bg-teal-900 text-white font-medium rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <span>Continuar con Código</span>
                <ArrowRight size={18} />
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-slate-400 text-xs uppercase">o</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <button 
                type="button"
                onClick={ingresarComoInvitado}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition flex items-center justify-center gap-2"
              >
                <User size={18} />
                <span>Ingresar como Invitado</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerificarCodigo} className="space-y-4">
              <div className="bg-teal-50 border border-[#B3EBF2] p-3 rounded-xl text-xs text-teal-900 mb-2">
                Hemos enviado un código de verificación a <b>{emailInput}</b>. (Para pruebas usa: <code>123456</code>)
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Código de Verificación (6 dígitos)
                </label>
                <input 
                  type="text" 
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={codigoIngresado}
                  onChange={(e) => setCodigoIngresado(e.target.value)}
                  className="w-full px-4 py-3 text-center tracking-widest text-lg font-bold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#B3EBF2]"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-teal-800 hover:bg-teal-900 text-white font-medium rounded-xl shadow-md transition"
              >
                Verificar e Ingresar
              </button>
              <button 
                type="button"
                onClick={() => setCodigoEnviado(false)}
                className="w-full text-xs text-slate-500 hover:underline text-center mt-2"
              >
                ← Cambiar correo o volver
              </button>
            </form>
          )}
        </div>
        <div className="mt-6 text-center text-xs text-slate-400">
          Facultad de Filosofía y Letras • Universidad de Buenos Aires
        </div>
      </div>
    );
  }

  // --- RENDER: APLICACIÓN PRINCIPAL ---
  return (
    <div className="min-h-screen bg-[#F4F6F8] text-slate-800 flex flex-col font-sans">
      
      {/* Toast de Notificaciones */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <Sparkles className="text-[#B3EBF2]" size={20} />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Modal de Confirmación */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-scaleIn">
            <h3 className="text-lg font-bold text-slate-900 mb-2">{confirmDialog.title}</h3>
            <p className="text-slate-600 text-sm mb-6">{confirmDialog.message}</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmDialog(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition"
              >
                No
              </button>
              <button 
                onClick={confirmDialog.onConfirm}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-xl transition shadow-md"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar Superior */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#B3EBF2]/40 rounded-xl flex items-center justify-center text-teal-800 font-bold shadow-xs">
            🌲
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Gestor Académico Puan</h2>
            <p className="text-xs text-slate-500">Ciencias Antropológicas - UBA</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {modoInvitado ? (
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
              <span className="text-xs text-amber-800 font-medium hidden md:inline">Modo Invitado</span>
              <button 
                onClick={() => setModalRegistroOpen(true)}
                className="text-xs bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded-full font-medium transition shadow-xs"
              >
                Sé parte de la memoria colectiva Puan. Registrate
              </button>
              <button 
                onClick={cerrarSesion}
                title="Salir"
                className="text-slate-600 hover:text-rose-600 p-1 rounded-lg transition"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setModalAvatarOpen(true)}
                className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 p-1.5 pr-3 rounded-full transition group"
                title="Cambiar avatar antropológico"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-teal-700 bg-slate-200">
                  <img 
                    src={avatarActual.img} 
                    alt={avatarActual.nombre} 
                    className="w-full h-full object-cover filter grayscale contrast-125 group-hover:scale-105 transition" 
                  />
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-slate-800 leading-tight">{avatarActual.nombre}</p>
                  <p className="text-[10px] text-teal-800 font-medium">Cambiar avatar</p>
                </div>
              </button>

              <button 
                onClick={cerrarSesion}
                title="Cerrar Sesión"
                className="text-slate-400 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 transition"
              >
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 space-y-6">
        
        {/* Panel de Configuración General (Plan & Orientación) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="text-teal-800" size={22} />
              <span>Configuración de Carrera</span>
            </h3>
            <p className="text-sm text-slate-500">Tus elecciones se guardan automáticamente y persisten al volver a ingresar.</p>
          </div>

          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Plan de Estudios</label>
              <select 
                value={planEstudio}
                onChange={(e) => {
                  setPlanEstudio(e.target.value);
                  guardarDatosNube();
                }}
                className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#B3EBF2]"
              >
                <option value="2023">Plan 2023</option>
                <option value="1985">Plan 1985</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Orientación</label>
              <select 
                value={orientacion}
                onChange={(e) => {
                  setOrientacion(e.target.value);
                  guardarDatosNube();
                }}
                className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#B3EBF2]"
              >
                <option value="sociocultural">Sociocultura / Social</option>
                <option value="arqueologica">Arqueológica</option>
                <option value="profesorado">Profesorado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sección de Electivas y Seminarios */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="text-teal-800" size={22} />
                <span>Seminarios y Electivas Seleccionados</span>
              </h3>
              <p className="text-sm text-slate-500">Gestiona los seminarios que estás cursando o ya aprobaste.</p>
            </div>
            <button 
              onClick={() => setModalSeminariosOpen(true)}
              className="bg-teal-800 hover:bg-teal-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition shadow-sm flex items-center gap-2"
            >
              <Plus size={18} />
              <span>Agregar Seminario</span>
            </button>
          </div>

          {seminariosElegidos.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <BookOpen className="mx-auto text-slate-300 mb-2" size={36} />
              <p className="text-slate-600 font-medium text-sm">Aún no has agregado seminarios a tu lista.</p>
              <p className="text-slate-400 text-xs mt-1">Haz clic en "Agregar Seminario" para explorar el catálogo.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {seminariosElegidos.map((sem) => (
                <div key={sem.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex justify-between items-start hover:border-teal-700/50 transition">
                  <div>
                    <span className="text-[10px] font-bold bg-[#B3EBF2]/50 text-teal-900 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {sem.codigo} • {sem.creditos} Créditos
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-2">{sem.nombre}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{sem.docente}</p>
                  </div>
                  <button 
                    onClick={() => confirmarEliminarSeminario(sem)}
                    className="text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition"
                    title="Eliminar seminario"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      {/* --- MODAL: SELECCIONAR / AGREGAR SEMINARIO --- */}
      {modalSeminariosOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Catálogo de Seminarios y Electivas</h3>
              <button onClick={() => setModalSeminariosOpen(false)} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              {catalogoSeminarios.map((sem) => {
                const yaAgregado = seminariosElegidos.some(s => s.id === sem.id);
                return (
                  <div key={sem.id} className="p-4 rounded-xl border border-slate-200 flex justify-between items-center bg-slate-50/50 hover:bg-slate-50 transition">
                    <div>
                      <span className="text-[10px] font-bold text-teal-800 bg-[#B3EBF2]/40 px-2 py-0.5 rounded uppercase">
                        {sem.codigo}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">{sem.nombre}</h4>
                      <p className="text-xs text-slate-500">{sem.docente} • {sem.creditos} Créditos</p>
                    </div>
                    <button 
                      onClick={() => agregarSeminario(sem)}
                      disabled={yaAgregado}
                      className={`px-4 py-2 rounded-xl text-xs font-medium transition flex items-center gap-1.5 shadow-xs ${
                        yaAgregado 
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                          : 'bg-teal-800 hover:bg-teal-900 text-white'
                      }`}
                    >
                      {yaAgregado ? <Check size={14} /> : <Plus size={14} />}
                      <span>{yaAgregado ? 'Agregado' : 'Seleccionar'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: ELEGIR AVATAR HISTÓRICO B&W --- */}
      {modalAvatarOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Elige tu Avatar Antropológico</h3>
                <p className="text-xs text-slate-500 mt-0.5">Retratos históricos en blanco y negro de grandes referentes de la disciplina.</p>
              </div>
              <button onClick={() => setModalAvatarOpen(false)} className="text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {AVATARES_ANTROPOLOGIA.map((av) => {
                const seleccionado = avatarActual.id === av.id;
                return (
                  <button
                    key={av.id}
                    onClick={() => seleccionarAvatar(av)}
                    className={`flex flex-col items-center p-3 rounded-2xl border-2 transition text-center group ${
                      seleccionado 
                        ? 'border-teal-700 bg-teal-50/50 shadow-md' 
                        : 'border-slate-200 hover:border-teal-700/50 bg-white'
                    }`}
                  >
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-300 mb-2 shadow-inner bg-slate-100">
                      <img 
                        src={av.img} 
                        alt={av.nombre} 
                        className="w-full h-full object-cover filter grayscale contrast-125 group-hover:scale-105 transition" 
                      />
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs leading-tight">{av.nombre}</h4>
                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{av.rol}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: INVITACIÓN A REGISTRO (DESDE INVITADO) --- */}
      {modalRegistroOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="w-16 h-16 bg-[#B3EBF2]/40 rounded-full flex items-center justify-center text-teal-800 mx-auto text-2xl">
              🌲
            </div>
            <h3 className="text-xl font-bold text-slate-900">Sé parte de la memoria colectiva Puan</h3>
            <p className="text-sm text-slate-600">
              Registrate con tu correo institucional para sincronizar tus avances, guardar tus seminarios y formar parte de la comunidad de Ciencias Antropológicas de la UBA.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <button 
                onClick={() => {
                  setModalRegistroOpen(false);
                  setSesionIniciada(false);
                  setModoInvitado(false);
                }}
                className="w-full py-3 bg-teal-800 hover:bg-teal-900 text-white font-medium rounded-xl shadow-md transition"
              >
                Registrarme ahora
              </button>
              <button 
                onClick={() => setModalRegistroOpen(false)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition text-sm"
              >
                Seguir explorando como invitado
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
