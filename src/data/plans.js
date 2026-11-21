export const PLANS_DATA = {
  "2023": {
    name: "Plan de Estudios 2023 (Nuevo)",
    cbc: [
      { id: "cbc-1", name: "Introducción al Pensamiento Científico", etapa: "CBC", creditos: 6 },
      { id: "cbc-2", name: "Introducción al Conocimiento de la Sociedad y el Estado", etapa: "CBC", creditos: 6 },
      { id: "cbc-3", name: "Antropología", etapa: "CBC", creditos: 6 },
      { id: "cbc-4", name: "Filosofía", etapa: "CBC", creditos: 6 },
      { id: "cbc-opt-1", name: "Materia a elección CBC 1", etapa: "CBC", creditos: 6, isChoice: true, options: ["Semiología", "Sociología", "Economía", "Psicología"] },
      { id: "cbc-opt-2", name: "Materia a elección CBC 2", etapa: "CBC", creditos: 6, isChoice: true, options: ["Semiología", "Sociología", "Economía", "Psicología"] },
    ],
    cfg: [
      { id: "cfg-1", name: "Epistemología de las Ciencias Sociales", etapa: "CFG", correlativa: "CBC aprobado" },
      { id: "cfg-2", name: "Historia y Teoría de la Antropología 1", etapa: "CFG", correlativa: "CBC aprobado" },
      { id: "cfg-3", name: "Historia y Teoría de la Antropología 2", etapa: "CFG", correlativa: "CBC aprobado" },
      { id: "cfg-4", name: "Problemas de Antropología Social y Política", etapa: "CFG", correlativa: "CBC aprobado" },
      { id: "cfg-5", name: "Problemas de Antropología Económica", etapa: "CFG", correlativa: "CBC aprobado" },
      { id: "cfg-6", name: "Problemas de Antropología Simbólica", etapa: "CFG", correlativa: "CBC aprobado" },
      { id: "cfg-7", name: "Antropología Biológica", etapa: "CFG", correlativa: "CBC aprobado" },
      { id: "cfg-8", name: "Introducción a la Arqueología", etapa: "CFG", correlativa: "CBC aprobado" },
      { id: "cfg-9", name: "Arqueología, Legislación y Comunidad", etapa: "CFG", correlativa: "CBC aprobado" },
    ],
    orientaciones: {
      sociocultural: {
        name: "Licenciatura - Orientación Sociocultural",
        cfo: [
          { id: "soc-1", name: "Sociedades, Culturas y Estados en América Prehispánica y Colonial", etapa: "CFO", correlativa: "Al menos 5 materias cursadas del CFG" },
          { id: "soc-2", name: "Pueblos Indígenas Americanos", etapa: "CFO", correlativa: "Al menos 5 materias cursadas del CFG" },
          { id: "soc-3", name: "Procesos Culturales, Folklore y Prácticas Subalternas", etapa: "CFO", correlativa: "Al menos 5 materias cursadas del CFG" },
          { id: "soc-4", name: "Antropología Lingüística", etapa: "CFO", correlativa: "Al menos 5 materias cursadas del CFG" },
          { id: "soc-5", name: "Teoría Social", etapa: "CFO", correlativa: "Al menos 5 materias cursadas del CFG" },
          { id: "soc-6", name: "Teorías de la Subjetividad", etapa: "CFO", correlativa: "Al menos 5 materias cursadas del CFG" },
          { id: "soc-7", name: "Metodología e investigación antropológica (anual)", etapa: "CFO", correlativa: "Al menos 5 materias cursadas del CFG", isAnnual: true },
          { id: "soc-sem-1", name: "Seminario de Antropología Sociocultural", etapa: "CFO", isSeminar: true, seminarType: "sociocultural" },
          { id: "soc-opt-choice", name: "Materia metodológica / ejercicio profesional", etapa: "CFO", isChoice: true, options: ["Enfoque Cuantitativo de Investigación en Antrop. Sociocultural", "Ejercicio Profesional de la Antropología"] },
          { id: "soc-area-1", name: "Materia Área Temática (1)", etapa: "CFO", isAreaChoice: true },
          { id: "soc-area-2", name: "Materia Área Temática (2)", etapa: "CFO", isAreaChoice: true },
          { id: "soc-opt-uba", name: "Materia electiva (cualquier carrera/facultad UBA)", etapa: "CFO", isFreeText: true },
          { id: "soc-pst", name: "Seminario de Prácticas Socioeducativas Territorializadas (PST)", etapa: "CFO", correlativa: "CBC aprobado" },
          { id: "soc-sem-inv", name: "Seminario de investigación en antropología sociocultural (anual)", etapa: "CFO", correlativa: "Al menos 10 materias cursadas en total, incluyendo Metodología", isAnnual: true },
          { id: "soc-tesis", name: "Tesis de Licenciatura", etapa: "CFO", isTesis: true }
        ],
        areasTematicas: [
          "Antropología histórica y memoria",
          "Procesos socioeconómicos: producción, reproducción y transformación social",
          "Procesos políticos, instituciones y prácticas",
          "Procesos culturales, ideología y poder"
        ],
        materiasPorArea: {
          "Antropología histórica y memoria": ["Conquistas, resistencias y memorias indígenas", "Pueblos indígenas y estados", "Antropologías latinoamericanas", "América en contexto"],
          "Procesos socioeconómicos: producción, reproducción y transformación social": ["Capitalismo actual, trabajo y trabajadores", "Configuraciones socio-ambientales y territoriales en el espacio urbano y rural", "Relaciones de género y organización social de los cuidados"],
          "Procesos políticos, instituciones y prácticas": ["Antropología del estado y las políticas públicas", "Sujetos sociales y políticos en perspectiva Antropológica", "Abordajes antropológicos de la salud y las Biociencias", "Antropología y Educación"],
          "Procesos culturales, ideología y poder": ["Dinámicas contemporáneas del campo de la cultura", "Discurso, imagen y alteridad", "Religiones, mitos y rituales en la modernidad"]
        }
      },
      arqueologia: {
        name: "Licenciatura - Orientación Arqueología",
        cfo: [
          { id: "arq-1", name: "Arqueología de África, Eurasia y Oceanía", etapa: "CFO", correlativa: "Al menos 5 materias cursadas del CFG, incluyendo Introducción a la Arqueología" },
          { id: "arq-2", name: "Arqueología Americana y Argentina I", etapa: "CFO", correlativa: "Al menos 5 materias cursadas del CFG, incluyendo Introducción a la Arqueología" },
          { id: "arq-3", name: "Arqueología Americana y Argentina II", etapa: "CFO", correlativa: "Al menos 5 materias cursadas del CFG, incluyendo Introducción a la Arqueología" },
          { id: "arq-4", name: "Arqueología Argentina", etapa: "CFO", correlativa: "Al menos 5 materias cursadas del CFG, incluyendo Introducción a la Arqueología" },
          { id: "arq-5", name: "Materiales Arqueológicos y sus Tecnologías", etapa: "CFO", correlativa: "Al menos 5 materias cursadas del CFG, incluyendo Introducción a la Arqueología" },
          { id: "arq-6", name: "Geología para Arqueólogos", etapa: "CFO", correlativa: "Al menos 5 materias cursadas del CFG, incluyendo Introducción a la Arqueología" },
          { id: "arq-7", name: "Teorías Arqueológicas Contemporáneas", etapa: "CFO", correlativa: "Al menos 5 materias cursadas del CFG, incluyendo Introducción a la Arqueología" },
          { id: "arq-8", name: "Modelos y Métodos de Análisis en Arqueología", etapa: "CFO", correlativa: "Al menos 5 materias cursadas del CFG, incluyendo Introducción a la Arqueología" },
          { id: "arq-9", name: "Metodología y Técnicas de Investigación Arqueológica", etapa: "CFO", correlativa: "Al menos 5 materias cursadas del CFG, incluyendo Introducción a la Arqueología" },
          { id: "arq-10", name: "Métodos Cuantitativos en Arqueología", etapa: "CFO", correlativa: "Al menos 5 materias cursadas del CFG, incluyendo Intro a la Arqueología y Metodología y Técnicas" },
          { id: "arq-pst", name: "Seminario de Prácticas Socioeducativas Territorializadas (PST)", etapa: "CFO", correlativa: "CBC aprobado" },
          { id: "arq-sem", name: "Seminario de la Orientación en Arqueología", etapa: "CFO", isSeminar: true, seminarType: "arqueologia" },
          { id: "arq-electiva-1", name: "Materia electiva arqueología (1)", etapa: "CFO", isChoice: true, options: ["Ejercicio profesional de la arqueología", "Arqueología de Tiempos Modernos", "Materiales Biológicos en Arqueología", "Estudios Interdisciplinarios en Arqueología"] },
          { id: "arq-electiva-2", name: "Materia electiva arqueología (2)", etapa: "CFO", isChoice: true, options: ["Ejercicio profesional de la arqueología", "Arqueología de Tiempos Modernos", "Materiales Biológicos en Arqueología", "Estudios Interdisciplinarios en Arqueología"] },
          { id: "arq-sem-inv", name: "Seminario de investigación en Arqueología, Trabajo de Campo y Laboratorio (anual)", etapa: "CFO", correlativa: "Al menos 10 materias aprobadas", isAnnual: true },
          { id: "arq-tesis", name: "Tesis de Licenciatura", etapa: "CFO", isTesis: true }
        ]
      },
      profesorado: {
        name: "Profesorado en Ciencias Antropológicas",
        cfo: [
          { id: "prof-m1", name: "América en contexto", etapa: "CFE", correlativa: "CBC aprobado" },
          { id: "prof-m2", name: "Metodología de la investigación antropológica en educación", etapa: "CFE", correlativa: "Al menos 5 materias cursadas del CFG" },
          { id: "prof-elec-1", name: "Materia electiva licenciatura (1)", etapa: "CFE", isLicChoice: true },
          { id: "prof-elec-2", name: "Materia electiva licenciatura (2)", etapa: "CFE", isLicChoice: true },
          { id: "prof-elec-3", name: "Materia electiva licenciatura (3)", etapa: "CFE", isLicChoice: true },
          { id: "prof-elec-4", name: "Materia electiva licenciatura (4)", etapa: "CFE", isLicChoice: true },
          { id: "prof-elec-5", name: "Materia electiva licenciatura (5)", etapa: "CFE", isLicChoice: true },
          { id: "prof-pst", name: "Seminario de Prácticas Socioeducativas Territorializadas (PST)", etapa: "CFE", correlativa: "CBC aprobado" },
          { id: "cfe-1", name: "Seminario de Educación Sexual Integral (ESI)", etapa: "CFE" },
          { id: "cfe-2", name: "Didáctica General", etapa: "CFE" },
          { id: "cfe-3", name: "Didáctica Especial y Prácticas de la Enseñanza", etapa: "CFE" },
          { id: "cfe-4", name: "Experiencias Socioeducativas Situadas", etapa: "CFE" },
          { id: "cfe-ed-1", name: "Materia Cs. de la Educación (1)", etapa: "CFE", isChoice: true, options: ["Historia Social General de la Educación", "Historia de la Educación Argentina", "Política Educacional", "Sociología de la Educación"] },
          { id: "cfe-ed-2", name: "Materia Cs. de la Educación (2)", etapa: "CFE", isChoice: true, options: ["Historia Social General de la Educación", "Historia de la Educación Argentina", "Política Educacional", "Sociología de la Educación"] }
        ]
      }
    },
    idiomas: [
      { id: "id-anglo-1", name: "Idioma Anglosajón - Nivel 1 (Elemental)", etapa: "Idiomas" },
      { id: "id-anglo-2", name: "Idioma Anglosajón - Nivel 2 (Medio)", etapa: "Idiomas" },
      { id: "id-anglo-3", name: "Idioma Anglosajón - Nivel 3 (Superior)", etapa: "Idiomas" },
      { id: "id-lat-1", name: "Idioma Latino - Nivel 1 (Elemental)", etapa: "Idiomas" },
      { id: "id-lat-2", name: "Idioma Latino - Nivel 2 (Medio)", etapa: "Idiomas" },
      { id: "id-lat-3", name: "Idioma Latino - Nivel 3 (Superior)", etapa: "Idiomas" },
    ]
  },
  "1985": {
    name: "Plan de Estudios 1985 (Res. CS 79/85)",
    cbc: [
      { id: "cbc85-1", name: "Introducción al Pensamiento Científico", etapa: "CBC", creditos: 6 },
      { id: "cbc85-2", name: "Introducción al Conocimiento de la Sociedad y el Estado", etapa: "CBC", creditos: 6 },
      { id: "cbc85-3", name: "Antropología", etapa: "CBC", creditos: 6 },
      { id: "cbc85-4", name: "Sociología", etapa: "CBC", creditos: 6 },
      { id: "cbc85-opt-1", name: "Materia a elección CBC 1", etapa: "CBC", creditos: 6, isChoice: true, options: ["Semiología", "Filosofía", "Economía", "Psicología"] },
      { id: "cbc85-opt-2", name: "Materia a elección CBC 2", etapa: "CBC", creditos: 6, isChoice: true, options: ["Semiología", "Filosofía", "Economía", "Psicología"] },
    ],
    cfg: [
      { id: "bas-1", name: "Antropología Sistemática I (organización social y política)", etapa: "Materias Básicas" },
      { id: "bas-2", name: "Historia Social General", etapa: "Materias Básicas" },
      { id: "bas-3", name: "Fundamentos de Prehistoria", etapa: "Materias Básicas" },
      { id: "bas-4", name: "Historia de la Teoría Antropológica", etapa: "Materias Básicas" },
      { id: "bas-5", name: "Elementos de Lingüística y Semiótica", etapa: "Materias Básicas" },
      { id: "bas-6", name: "Sistemas Socioculturales de América I (cazadores, recolectores, agricultores incipientes)", etapa: "Materias Básicas" },
      { id: "bas-7", name: "Antropología Sistemática II (organización económica)", etapa: "Materias Básicas" },
      { id: "bas-8", name: "Métodos Cuantitativos en Antropología", etapa: "Materias Básicas" },
      { id: "bas-9", name: "Antropología Biológica y Paleoantropología", etapa: "Materias Básicas" },
      { id: "bas-10", name: "Antropología Sistemática III (sistemas simbólicos)", etapa: "Materias Básicas" },
      { id: "bas-11", name: "Folklore General", etapa: "Materias Básicas" },
    ],
    orientaciones: {
      sociocultural: {
        name: "Licenciatura 1985 - Orientación Sociocultural",
        cfo: [
          { id: "85soc-1", name: "Sistemas Socioculturales de América II", etapa: "CFO 1985" },
          { id: "85soc-2", name: "Teorías Antropológicas Contemporáneas", etapa: "CFO 1985" },
          { id: "85soc-3", name: "Epistemología y Métodos de Investigación Social", etapa: "CFO 1985" },
          { id: "85soc-4", name: "Metodología y Técnicas de la Investigación de Campo", etapa: "CFO 1985" },
          { id: "85soc-5", name: "Psicología General o Evolutiva", etapa: "CFO 1985", isChoice: true, options: ["Psicología General (Cs. Antropológicas)", "Psicología Evolutiva (Cs. de la Educación)"] },
          { id: "85soc-6", name: "Teoría Sociológica o Sociología de la Educación", etapa: "CFO 1985", isChoice: true, options: ["Teoría Sociológica (Cs. Antropológicas)", "Sociología de la Educación (Cs. de la Educación)"] },
          { id: "85soc-opt1", name: "Materia optativa 1", etapa: "CFO 1985", isFreeText: true },
          { id: "85soc-opt2", name: "Materia optativa 2", etapa: "CFO 1985", isFreeText: true },
          { id: "85soc-sem1", name: "Seminario de antropología social 1", etapa: "CFO 1985", isSeminar: true, seminarType: "sociocultural" },
          { id: "85soc-sem2", name: "Seminario de antropología social 2", etapa: "CFO 1985", isSeminar: true, seminarType: "sociocultural" },
          { id: "85soc-sem3", name: "Seminario de antropología social 3", etapa: "CFO 1985", isSeminar: true, seminarType: "sociocultural" },
          { id: "85soc-inv", name: "Seminario de Investigación (anual) en Antropología Social", etapa: "CFO 1985", isAnnual: true },
          { id: "85soc-tesis", name: "Tesis de Licenciatura", etapa: "CFO 1985", isTesis: true }
        ]
      },
      arqueologia: {
        name: "Licenciatura 1985 - Orientación Arqueología",
        cfo: [
          { id: "85arq-1", name: "Teoría Arqueológica Contemporánea", etapa: "CFO 1985" },
          { id: "85arq-2", name: "Metodología y Técnicas de la Investigación Arqueológica", etapa: "CFO 1985" },
          { id: "85arq-3", name: "Prehistoria del Viejo Mundo", etapa: "CFO 1985" },
          { id: "85arq-4", name: "Prehistoria Americana y Argentina I (cazadores - recolectores)", etapa: "CFO 1985" },
          { id: "85arq-5", name: "Geología General y Geología del Cuartario", etapa: "CFO 1985" },
          { id: "85arq-6", name: "Prehistoria Americana y Argentina II (agroalfareras)", etapa: "CFO 1985" },
          { id: "85arq-7", name: "Modelos y Métodos de Análisis en Economía Prehistórica", etapa: "CFO 1985" },
          { id: "85arq-8", name: "Ergología y Tecnología", etapa: "CFO 1985" },
          { id: "85arq-9", name: "Arqueología Argentina", etapa: "CFO 1985" },
          { id: "85arq-opt", name: "Materia optativa arqueología", etapa: "CFO 1985", isFreeText: true },
          { id: "85arq-sem", name: "Seminario de arqueología", etapa: "CFO 1985", isSeminar: true, seminarType: "arqueologia" },
          { id: "85arq-inv", name: "Seminario de Investigación (anual) en Arqueología", etapa: "CFO 1985", isAnnual: true },
          { id: "85arq-tesis", name: "Tesis de Licenciatura", etapa: "CFO 1985", isTesis: true }
        ]
      },
      profesorado: {
        name: "Profesorado en Ciencias Antropológicas (1985)",
        cfo: [
          { id: "85prof-1", name: "Didáctica General (Cs. de la Educación)", etapa: "CFE 1985" },
          { id: "85prof-2", name: "Didáctica Especial y Prácticas de la Enseñanza", etapa: "CFE 1985" }
        ]
      }
    },
    idiomas: [
      { id: "85id-lat-1", name: "Idioma Latino - Nivel 1", etapa: "Idiomas 1985" },
      { id: "85id-lat-2", name: "Idioma Latino - Nivel 2", etapa: "Idiomas 1985" },
      { id: "85id-lat-3", name: "Idioma Latino - Nivel 3", etapa: "Idiomas 1985" },
      { id: "85id-saj-1", name: "Idioma Sajón - Nivel 1", etapa: "Idiomas 1985" },
      { id: "85id-saj-2", name: "Idioma Sajón - Nivel 2", etapa: "Idiomas 1985" },
      { id: "85id-saj-3", name: "Idioma Sajón - Nivel 3", etapa: "Idiomas 1985" },
    ]
  }
};
