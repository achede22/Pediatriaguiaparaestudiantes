import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Search, Database, Calculator, FileText, ChevronRight, Pill, Droplet, Activity, Image as ImageIcon, X, AlertTriangle } from 'lucide-react';
import DiseaseMatcher from '../components/DiseaseMatcher';
import VademecumView from '../components/VademecumView';
import DehydrationFluids from '../components/DehydrationFluids';
import RespiratoryScales from '../components/RespiratoryScales';
import { useNavigate } from 'react-router-dom';

type Section = 'main' | 'descarte' | 'vademecum' | 'liquidos' | 'algoritmos' | 'referencias' | 'respiratorio';

// Datos de ejemplo - En producción esto vendría de una base de datos o archivo JSON
const enfermedades = [
  {
    id: 'otitis',
    nombre: 'Otitis Media Aguda',
    sintomas: ['Otalgia', 'Fiebre', 'Irritabilidad'],
    criterios: ['Abombamiento timpánico', 'Eritema timpánico'],
    tratamiento: 'Amoxicilina 80-90 mg/kg/día',
    fuente: 'https://enfamilia.aeped.es/temas-salud/otitis-media-aguda'
  },
  {
    id: 'faringitis',
    nombre: 'Faringoamigdalitis Estreptocócica',
    sintomas: ['Odinofagia', 'Fiebre', 'Ausencia de tos'],
    criterios: ['Exudado amigdalino', 'Adenopatías cervicales'],
    tratamiento: 'Penicilina V o Amoxicilina 50 mg/kg/día',
    fuente: 'https://enfamilia.aeped.es/temas-salud/faringoamigdalitis'
  },
  {
    id: 'kawasaki',
    nombre: 'Enfermedad de Kawasaki',
    sintomas: ['Fiebre >5d', 'Conjuntivitis', 'Lengua fresa', 'Labios fisurados', 'Exantema', 'Adenopatía', 'Cambios extremidades'],
    criterios: ['Fiebre persistente + 4/5 criterios clínicos'],
    tratamiento: 'Inmunoglobulina IV + Aspirina (Derivar)',
    fuente: 'https://enfamilia.aeped.es/temas-salud/enfermedad-kawasaki'
  },
  {
    id: 'mano_pie_boca',
    nombre: 'Enfermedad Mano-Pie-Boca',
    sintomas: ['Fiebre', 'Vesículas manos/pies', 'Úlceras orales'],
    criterios: ['Clínico'],
    tratamiento: 'Sintomático',
    fuente: 'https://enfamilia.aeped.es/temas-salud/enfermedad-boca-mano-pie'
  },
  {
    id: 'roseola',
    nombre: 'Exantema Súbito (Roséola/6ta Enfermedad)',
    sintomas: ['Fiebre alta 3-4 días', 'Exantema al ceder fiebre', 'Niño activo'],
    criterios: ['Clínico', 'VHH-6/VHH-7'],
    tratamiento: 'Sintomático',
    fuente: 'https://enfamilia.aeped.es/temas-salud/exantema-subito-roseola-infantil'
  },
  {
    id: 'eritema_infeccioso',
    nombre: 'Eritema Infeccioso (5ta Enfermedad)',
    sintomas: ['Exantema mejillas', 'Patrón reticular', 'Síntomas catarrales'],
    criterios: ['Clínico', 'Parvovirus B19'],
    tratamiento: 'Sintomático',
    fuente: 'https://enfamilia.aeped.es/temas-salud/eritema-infeccioso-quinta-enfermedad'
  },
  {
    id: 'escarlatina',
    nombre: 'Escarlatina',
    sintomas: ['Fiebre', 'Exantema áspero', 'Lengua aframbuesada', 'Faringitis'],
    criterios: ['Streptococcus pyogenes', 'Test rápido +'],
    tratamiento: 'Penicilina V o Amoxicilina 50 mg/kg/día',
    fuente: 'https://enfamilia.aeped.es/temas-salud/escarlatina'
  }
];

// Interfaz vieja de MedicamentoPediadosis eliminada. Su función ahora la cumple VademecumView.tsx

export default function NonEmergency() {
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>('main');
  const [searchTerm, setSearchTerm] = useState('');
  const [peso, setPeso] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);



  // Estados viejos de búsqueda del vadecemum estático removidos

  const calculadoras = [
    { id: 'holliday', nombre: 'Mantenimiento (Holliday-Segar)', formula: 'Basado en peso', icon: Droplet },
    { id: 'imc', nombre: 'Índice de Masa Corporal', formula: 'Peso/Talla²', icon: Activity },
    { id: 'superficie', nombre: 'Superficie Corporal', formula: 'Mosteller', icon: Activity },
    { id: 'filtrado', nombre: 'Filtrado Glomerular (Schwartz)', formula: 'k * Talla / Cr', icon: Activity },
    { id: 'amox_80', nombre: 'Dosis Amoxicilina (80mg/kg)', formula: '80 mg/kg/día', icon: Pill },
    { id: 'ibuprofeno', nombre: 'Dosis Ibuprofeno (10mg/kg)', formula: '10 mg/kg/dosis', icon: Pill },
    { id: 'paracetamol', nombre: 'Dosis Paracetamol (15mg/kg)', formula: '15 mg/kg/dosis', icon: Pill },
  ];

  const algoritmosClinicos = [
    { id: 'itu', nombre: 'Infección Urinaria Febril', pasos: ['Muestra orina', 'Tira reactiva', 'Urocultivo', 'Antibiótico empírico'] },
    { id: 'neumonia', nombre: 'Neumonía Adquirida en Comunidad', pasos: ['Evaluación clínica', 'Saturación O2', 'Rx Tórax (si duda)', 'Antibiótico según edad'] },
    { id: 'gastroenteritis', nombre: 'Gastroenteritis Aguda', pasos: ['Evaluar deshidratación', 'SRO', 'Probióticos', 'Zinc'] },
    { id: 'cefalea', nombre: 'Cefalea en Niños', pasos: ['Anamnesis (Banderas rojas)', 'Examen neurológico', 'Neuroimagen si signos de alarma'] },
    { id: 'dolor_abdominal', nombre: 'Dolor Abdominal Agudo', pasos: ['Localización', 'Signos peritoneales', 'Ecografía/TAC si sospecha Qx'] },
  ];

  // Las referencias fueron removidas acá temporalmente por problemas de asset path. 
  const referencias: { nombre: string, img: string, categoria: string }[] = [];

  const fuentesMedicas = [
    { nombre: 'EnFamilia (AEP)', url: 'https://enfamilia.aeped.es/', descripcion: 'Asociación Española de Pediatría' },
    { nombre: 'MedlinePlus Español', url: 'https://medlineplus.gov/spanish/', descripcion: 'NIH - Instituto Nacional de Salud (USA)' },
    { nombre: 'Manual MSD', url: 'https://www.msdmanuals.com/es', descripcion: 'Información médica profesional' },
    { nombre: 'HealthyChildren (AAP)', url: 'https://www.healthychildren.org/spanish', descripcion: 'Academia Americana de Pediatría' },
  ];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const filteredEnfermedades = enfermedades.filter(enf =>
    enf.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enf.sintomas.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const calcularResultado = (calcId: string) => {
    if (!peso) return null;
    const p = parseFloat(peso);

    switch (calcId) {
      case 'holliday':
        if (p <= 10) return `${p * 100} ml/día`;
        if (p <= 20) return `${1000 + (p - 10) * 50} ml/día`;
        return `${1500 + (p - 20) * 20} ml/día`;
      case 'amox_80':
        return `${(p * 80).toFixed(0)} mg/día`;
      case 'ibuprofeno':
        return `${(p * 10).toFixed(0)} mg/dosis`;
      case 'paracetamol':
        return `${(p * 15).toFixed(0)} mg/dosis`;
      case 'imc':
        return 'Requiere talla (Pendiente)';
      default:
        return 'Seleccione calculadora';
    }
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6"
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-blue-600 text-white rounded-2xl p-6 mb-6 shadow-xl">
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={() => navigate('/')}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-xl active:scale-95 transition-all"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-white">CONSULTA GENERAL</h1>
              <p className="text-blue-100">Herramientas de Práctica Diaria</p>
            </div>
            <FileText className="w-12 h-12" />
          </div>
        </div>

        {/* Image Modal Removido. Ahora se mostrará al final de la sección Galería de Imágenes. */}

        {section === 'main' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <button
              onClick={() => setSection('descarte')}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl active:scale-98 transition-all
                       border-2 border-purple-100 hover:border-purple-300 flex flex-col items-center gap-4 text-center"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center">
                <Search className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-purple-600">Descarte de Enfermedades</h3>
                <p className="text-gray-600 text-sm">Búsqueda por signos y síntomas</p>
              </div>
            </button>

            <button
              onClick={() => setSection('vademecum')}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl active:scale-98 transition-all
                       border-2 border-green-100 hover:border-green-300 flex flex-col items-center gap-4 text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                <Database className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-green-600">Pediadosis</h3>
                <p className="text-gray-600 text-sm">Dosis y presentaciones pediátricas interactivo</p>
              </div>
            </button>

            <button
              onClick={() => setSection('liquidos')}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl active:scale-98 transition-all
                       border-2 border-orange-100 hover:border-orange-300 flex flex-col items-center gap-4 text-center"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center">
                <Calculator className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h3 className="text-orange-600">Líquidos y Deshidratación</h3>
                <p className="text-gray-600 text-sm">Cálculos para rehidratación rápida</p>
              </div>
            </button>

            <button
              onClick={() => setSection('algoritmos')}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl active:scale-98 transition-all
                       border-2 border-blue-100 hover:border-blue-300 flex flex-col items-center gap-4 text-center"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-blue-600">Algoritmos Clínicos</h3>
                <p className="text-gray-600 text-sm">Guías de manejo paso a paso</p>
              </div>
            </button>

            <button
              onClick={() => setSection('referencias')}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl active:scale-98 transition-all
                       border-2 border-teal-100 hover:border-teal-300 flex flex-col items-center gap-4 text-center"
            >
              <div className="w-16 h-16 bg-teal-100 rounded-xl flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-teal-600" />
              </div>
              <div>
                <h3 className="text-teal-600">Galería de Imágenes</h3>
                <p className="text-gray-600 text-sm">Tablas, Gráficos y Escalas visuales.</p>
              </div>
            </button>

            <button
              onClick={() => setSection('respiratorio')}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl active:scale-98 transition-all
                       border-2 border-indigo-100 hover:border-indigo-300 flex flex-col items-center gap-4 text-center"
            >
              <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Activity className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-indigo-600">Escalas Respiratorias</h3>
                <p className="text-gray-600 text-sm">Westley (Crup) y TAL (Asma/Bronquiolitis)</p>
              </div>
            </button>
          </motion.div>
        )}

        {section === 'descarte' && (
          <div className="flex flex-col gap-0">
            {/* Se reemplaza el layout del descarte simple por el DiseaseMatcher con generador de Recipes */}
            <DiseaseMatcher />

            {/* Fuentes Médicas */}
            <div className="bg-white px-6 pb-6 pt-2 rounded-b-2xl shadow-xl relative z-10">
              <div className="mt-4 pt-6 border-t border-purple-200">
                <h3 className="font-bold text-purple-700 mb-4">📖 Fuentes Médicas Recomendadas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {fuentesMedicas.map((fuente, idx) => (
                    <a
                      key={idx}
                      href={fuente.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-purple-50 border border-purple-200 rounded-lg p-3 hover:bg-purple-100 transition-all"
                    >
                      <h4 className="font-bold text-purple-800 text-sm">{fuente.nombre}</h4>
                      <p className="text-xs text-gray-600 mt-1">{fuente.descripcion}</p>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {section === 'vademecum' && (
          <VademecumView onBack={() => setSection('main')} />
        )}

        {/* Sección de REHIDRATACIÓN */}
        {section === 'liquidos' && (
          <div className="bg-white rounded-2xl p-6 shadow-xl w-full">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setSection('main')}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl active:scale-95 transition-all text-gray-700"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="flex-1 text-orange-600 font-bold text-xl">Líquidos y Deshidratación</h2>
            </div>
            <DehydrationFluids />
          </div>
        )}

        {section === 'algoritmos' && (
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setSection('main')}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl active:scale-95 transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="flex-1 text-blue-600">Algoritmos Clínicos</h2>
            </div>

            <div className="space-y-4">
              {algoritmosClinicos.map((algo) => (
                <div key={algo.id} className="border-2 border-blue-50 rounded-xl p-5 hover:border-blue-200 transition-all">
                  <h3 className="font-bold text-blue-700 mb-4">{algo.nombre}</h3>
                  <div className="space-y-3">
                    {algo.pasos.map((paso, idx) => (
                      <div key={idx} className="flex gap-3 items-center">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {idx + 1}
                        </div>
                        <p className="text-gray-600">{paso}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {section === 'referencias' && (
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setSection('main')}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl active:scale-95 transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="flex-1 text-teal-600">Galería de Imágenes</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {referencias.map((ref, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedImage(ref.img);
                    // Scroll suave hacia la imagen que aparecerá abajo
                    setTimeout(() => {
                      document.getElementById('imagen-seleccionada-container')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className={`bg-teal-50 p-4 rounded-xl border-2 transition-all active:scale-95 flex items-center gap-4 text-left group ${selectedImage === ref.img ? 'border-teal-500 shadow-md ring-4 ring-teal-500/20' : 'border-teal-200 hover:border-teal-400'}`}
                >
                  <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-teal-100">
                    <img src={ref.img} alt={ref.nombre} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-teal-800 group-hover:text-teal-600 transition-colors">{ref.nombre}</h3>
                    <span className="text-xs bg-white px-2 py-1 rounded text-teal-600 border border-teal-100">
                      {ref.categoria}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <AnimatePresence>
              {selectedImage && (
                <motion.div
                  id="imagen-seleccionada-container"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-8 pt-8 border-t-2 border-dashed border-teal-200 flex flex-col items-center"
                >
                  <div className="w-full flex justify-between items-center mb-4">
                    <h3 className="font-black text-teal-800 text-xl">Imagen Seleccionada</h3>
                    <button
                      onClick={() => {
                        setSelectedImage(null);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-gray-500 hover:text-red-500 bg-gray-100 hover:bg-red-50 p-2 rounded-lg transition-colors flex items-center gap-2 font-bold"
                    >
                      <X className="w-5 h-5" /> Cerrar Imagen
                    </button>
                  </div>
                  <img
                    src={selectedImage}
                    alt="Referencia Ampliada"
                    className="max-w-full rounded-2xl shadow-2xl border-4 border-gray-100"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {section === 'respiratorio' && (
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setSection('main')}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl active:scale-95 transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="flex-1 text-indigo-600">Escalas Respiratorias Clínicas</h2>
            </div>

            <RespiratoryScales />
          </div>
        )}
      </div>
    </motion.div>
  );
}
