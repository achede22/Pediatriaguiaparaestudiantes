import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Search, Database, Calculator, FileText, ChevronRight, Pill, Droplet, Activity, Image as ImageIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Images
import glasgowImg from '../assets/img/GLASGOW.jpg';
import rabiaImg from '../assets/img/RABIA.jpg';
import remisionImg from '../assets/img/REMISION ORTOPEDIA.jpg';
import pesoTallaImg from '../assets/img/general/peso talla edad.jpg';
import cetoacidosisImg from '../assets/img/endocrino/cetoacidosis.png';
import correccionInsulinaImg from '../assets/img/endocrino/correccion_insulina.png';
import antidotosADImg from '../assets/img/toxico/antidotos A-D.jpg';
import antidotosDLImg from '../assets/img/toxico/Antidotos D-L.jpg';
import antidotosNVImg from '../assets/img/toxico/Antídotos N-V.jpg';
import acetaminofenImg from '../assets/img/toxico/Acetaminofen Anticolinergicos.jpg';
import carbonImg from '../assets/img/toxico/carbon activado.jpg';

type Section = 'main' | 'descarte' | 'vademecum' | 'calculadoras' | 'algoritmos' | 'referencias';

export default function NonEmergency() {
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>('main');
  const [searchTerm, setSearchTerm] = useState('');
  const [peso, setPeso] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  const vademecum = [
    { nombre: 'Paracetamol', dosis: '10-15 mg/kg/dosis', frecuencia: 'Cada 4-6 hs', max: '75 mg/kg/día' },
    { nombre: 'Ibuprofeno', dosis: '5-10 mg/kg/dosis', frecuencia: 'Cada 6-8 hs', max: '40 mg/kg/día' },
    { nombre: 'Amoxicilina', dosis: '40-50 mg/kg/día (baja) o 80-90 mg/kg/día (alta)', frecuencia: 'Cada 12 hs' },
    { nombre: 'Amoxicilina/Clavulánico', dosis: '40-80 mg/kg/día (base amoxicilina)', frecuencia: 'Cada 12 hs' },
    { nombre: 'Azitromicina', dosis: '10 mg/kg/día (día 1), luego 5 mg/kg/día', frecuencia: 'Cada 24 hs' },
    { nombre: 'Cefalexina', dosis: '25-50 mg/kg/día', frecuencia: 'Cada 6-8 hs' },
    { nombre: 'Prednisona', dosis: '1-2 mg/kg/día', frecuencia: 'Cada 24 hs (máx 60mg)' },
    { nombre: 'Salbutamol', dosis: '2 puff (200 mcg) o 0.15 mg/kg (NBZ)', frecuencia: 'Cada 4-6 hs' },
  ];

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

  const referencias = [
    { nombre: 'Escala de Glasgow', img: glasgowImg, categoria: 'General' },
    { nombre: 'Manejo de Rabia', img: rabiaImg, categoria: 'General' },
    { nombre: 'Remisión Ortopedia', img: remisionImg, categoria: 'General' },
    { nombre: 'Peso/Talla/Edad', img: pesoTallaImg, categoria: 'General' },
    { nombre: 'Cetoacidosis Diabética', img: cetoacidosisImg, categoria: 'Endocrino' },
    { nombre: 'Corrección Insulina', img: correccionInsulinaImg, categoria: 'Endocrino' },
    { nombre: 'Antídotos A-D', img: antidotosADImg, categoria: 'Toxicología' },
    { nombre: 'Antídotos D-L', img: antidotosDLImg, categoria: 'Toxicología' },
    { nombre: 'Antídotos N-V', img: antidotosNVImg, categoria: 'Toxicología' },
    { nombre: 'Acetaminofén/Anticolinérgicos', img: acetaminofenImg, categoria: 'Toxicología' },
    { nombre: 'Carbón Activado', img: carbonImg, categoria: 'Toxicología' },
  ];

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

        {/* Image Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <div className="relative max-w-full max-h-full">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-10 right-0 text-white p-2"
                >
                  <X className="w-8 h-8" />
                </button>
                <img
                  src={selectedImage}
                  alt="Referencia"
                  className="max-w-full max-h-[90vh] rounded-lg object-contain"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
                <h3 className="text-green-600">Vademécum Pediátrico</h3>
                <p className="text-gray-600 text-sm">Dosis, presentaciones y frecuencias</p>
              </div>
            </button>

            <button
              onClick={() => setSection('calculadoras')}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl active:scale-98 transition-all
                       border-2 border-orange-100 hover:border-orange-300 flex flex-col items-center gap-4 text-center"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center">
                <Calculator className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h3 className="text-orange-600">Calculadoras Clínicas</h3>
                <p className="text-gray-600 text-sm">Mantenimiento, SC, IMC, Filtrado</p>
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
                       border-2 border-teal-100 hover:border-teal-300 flex flex-col items-center gap-4 text-center md:col-span-2"
            >
              <div className="w-16 h-16 bg-teal-100 rounded-xl flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-teal-600" />
              </div>
              <div>
                <h3 className="text-teal-600">Galería de Referencias</h3>
                <p className="text-gray-600 text-sm">Tablas, Gráficos y Escalas (Glasgow, Antídotos, etc.)</p>
              </div>
            </button>
          </motion.div>
        )}

        {section === 'descarte' && (
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setSection('main')}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl active:scale-95 transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="flex-1 text-purple-600">Descarte de Enfermedades</h2>
            </div>

            <div className="mb-6 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por síntoma (ej. fiebre, exantema)..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="space-y-4">
              {filteredEnfermedades.map((enf) => (
                <div key={enf.id} className="border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-all">
                  <h3 className="font-bold text-gray-800 mb-2">{enf.nombre}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {enf.sintomas.map((sintoma, idx) => (
                      <span key={idx} className="bg-purple-50 text-purple-700 px-2 py-1 rounded-lg text-sm">
                        {sintoma}
                      </span>
                    ))}
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm">
                    <p><span className="font-bold">Criterios:</span> {enf.criterios.join(', ')}</p>
                    <p className="mt-1"><span className="font-bold text-purple-700">Tratamiento:</span> {enf.tratamiento}</p>
                    {enf.fuente && (
                      <p className="mt-2">
                        <a
                          href={enf.fuente}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline text-xs"
                        >
                          📚 Más información
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>


            {/* Fuentes Médicas */}
            <div className="mt-8 pt-6 border-t border-purple-200">
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
        )}

        {section === 'vademecum' && (
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setSection('main')}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl active:scale-95 transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="flex-1 text-green-600">Vademécum Pediátrico</h2>
            </div>

            <div className="space-y-4">
              {vademecum.map((med, idx) => (
                <div key={idx} className="bg-green-50 p-5 rounded-xl border border-green-200">
                  <h3 className="font-bold text-green-800 text-lg mb-2">{med.nombre}</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><span className="font-medium">Dosis:</span> {med.dosis}</p>
                    <p><span className="font-medium">Frecuencia:</span> {med.frecuencia}</p>
                    {med.max && <p><span className="font-medium text-red-600">Dosis Máxima:</span> {med.max}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {section === 'calculadoras' && (
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setSection('main')}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl active:scale-95 transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="flex-1 text-orange-600">Calculadoras Clínicas</h2>
            </div>

            <div className="mb-6 bg-orange-50 p-6 rounded-xl border-2 border-orange-200">
              <label className="block mb-3 font-bold text-orange-800">Peso del paciente (kg):</label>
              <input
                type="number"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                placeholder="Ingrese el peso"
                className="w-full p-4 border-2 border-orange-300 rounded-xl focus:border-orange-500 focus:outline-none text-lg"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              {calculadoras.map((calc) => (
                <div key={calc.id} className="border-2 border-gray-100 rounded-xl p-4 hover:border-orange-300 transition-all">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                        <calc.icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-gray-800">{calc.nombre}</h3>
                    </div>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">{calc.formula}</span>
                  </div>
                  {peso && (
                    <div className="mt-3 p-3 bg-orange-50 rounded-lg text-orange-800 font-medium">
                      Resultado: {calcularResultado(calc.id)}
                    </div>
                  )}
                </div>
              ))}
            </div>
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
              <h2 className="flex-1 text-teal-600">Galería de Referencias</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {referencias.map((ref, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(ref.img)}
                  className="bg-teal-50 p-4 rounded-xl border border-teal-200 hover:border-teal-400 
                           transition-all active:scale-95 flex items-center gap-4 text-left group"
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
          </div>
        )}
      </div>
    </motion.div>
  );
}
