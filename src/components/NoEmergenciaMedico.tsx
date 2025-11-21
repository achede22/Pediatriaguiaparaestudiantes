import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Stethoscope, Search, Database, Calculator, GitBranch, FileText, Camera } from 'lucide-react';

interface NoEmergenciaMedicoProps {
  onGoBack: () => void;
}

type Section = 'main' | 'entrevista' | 'diagnostico' | 'base-datos' | 'calculadoras' | 'algoritmos';

export function NoEmergenciaMedico({ onGoBack }: NoEmergenciaMedicoProps) {
  const [section, setSection] = useState<Section>('main');
  const [pesoKg, setPesoKg] = useState('');
  const [edadAnios, setEdadAnios] = useState('');
  const [selectedCalculadora, setSelectedCalculadora] = useState('');

  const calculadoras = [
    { id: 'superficie', nombre: 'Superficie Corporal', formula: 'Mosteller' },
    { id: 'imc', nombre: 'IMC Pediátrico', formula: 'peso(kg) / altura(m)²' },
    { id: 'liquidos', nombre: 'Líquidos de Mantenimiento', formula: 'Holliday-Segar' },
    { id: 'dosis-peso', nombre: 'Dosis por Peso', formula: 'mg/kg' },
  ];

  const calcularResultado = () => {
    const peso = parseFloat(pesoKg);
    const edad = parseFloat(edadAnios);
    
    if (selectedCalculadora === 'liquidos' && peso) {
      let ml = 0;
      if (peso <= 10) {
        ml = peso * 100;
      } else if (peso <= 20) {
        ml = 1000 + (peso - 10) * 50;
      } else {
        ml = 1500 + (peso - 20) * 20;
      }
      return `${ml} ml/día (${(ml / 24).toFixed(1)} ml/hora)`;
    }
    
    if (selectedCalculadora === 'superficie' && peso) {
      const altura = 100; // Valor de ejemplo, debería ser input
      const sc = Math.sqrt((peso * altura) / 3600);
      return `${sc.toFixed(2)} m²`;
    }

    if (selectedCalculadora === 'imc' && peso) {
      const altura = 1.2; // Valor de ejemplo
      const imc = peso / (altura * altura);
      return `${imc.toFixed(1)} kg/m²`;
    }

    return 'Ingrese los datos requeridos';
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-6 mb-6 shadow-xl">
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={onGoBack}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-xl active:scale-95 transition-all"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-white">Consulta General</h1>
              <p className="text-blue-100">Modo Médico - Herramientas Completas</p>
            </div>
            <Stethoscope className="w-12 h-12" />
          </div>
        </div>

        {section === 'main' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Entrevista inicial */}
            <button
              onClick={() => setSection('entrevista')}
              className="w-full bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl active:scale-98 transition-all
                       border-2 border-blue-200 hover:border-blue-400 flex items-center gap-4"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-blue-600">Entrevista Inicial Avanzada</h3>
                <p className="text-gray-600">Antecedentes, signos vitales, escala de dolor</p>
              </div>
            </button>

            {/* Descarte de enfermedades */}
            <button
              onClick={() => setSection('diagnostico')}
              className="w-full bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl active:scale-98 transition-all
                       border-2 border-purple-200 hover:border-purple-400 flex items-center gap-4"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center">
                <Search className="w-8 h-8 text-purple-600" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-purple-600">Descarte de Enfermedades</h3>
                <p className="text-gray-600">Búsqueda por síntomas, diagnóstico diferencial</p>
              </div>
            </button>

            {/* Base de datos */}
            <button
              onClick={() => setSection('base-datos')}
              className="w-full bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl active:scale-98 transition-all
                       border-2 border-green-200 hover:border-green-400 flex items-center gap-4"
            >
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                <Database className="w-8 h-8 text-green-600" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-green-600">Base de Datos Offline</h3>
                <p className="text-gray-600">Enfermedades, drogas, guías de práctica clínica</p>
              </div>
            </button>

            {/* Calculadoras */}
            <button
              onClick={() => setSection('calculadoras')}
              className="w-full bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl active:scale-98 transition-all
                       border-2 border-orange-200 hover:border-orange-400 flex items-center gap-4"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center">
                <Calculator className="w-8 h-8 text-orange-600" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-orange-600">Calculadoras y Fórmulas</h3>
                <p className="text-gray-600">Dosis, líquidos, nutrición, superficie corporal</p>
              </div>
            </button>

            {/* Algoritmos */}
            <button
              onClick={() => setSection('algoritmos')}
              className="w-full bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl active:scale-98 transition-all
                       border-2 border-indigo-200 hover:border-indigo-400 flex items-center gap-4"
            >
              <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center">
                <GitBranch className="w-8 h-8 text-indigo-600" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-indigo-600">Algoritmos Interactivos</h3>
                <p className="text-gray-600">Cardiovascular, respiratorio, neurológico</p>
              </div>
            </button>
          </motion.div>
        )}

        {section === 'entrevista' && (
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setSection('main')}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl active:scale-95 transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="flex-1 text-blue-600">Entrevista Inicial</h2>
            </div>

            <div className="space-y-6">
              {/* Datos del paciente */}
              <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
                <h3 className="text-blue-600 mb-4">Datos del Paciente</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-gray-700">Nombre completo</label>
                    <input type="text" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-700">Edad</label>
                    <input type="number" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-700">Peso (kg)</label>
                    <input type="number" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-700">Altura (cm)</label>
                    <input type="number" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none" />
                  </div>
                </div>
              </div>

              {/* Signos vitales */}
              <div className="bg-green-50 p-6 rounded-xl border-2 border-green-200">
                <h3 className="text-green-600 mb-4">Signos Vitales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-gray-700">Frecuencia cardíaca (lpm)</label>
                    <input type="number" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-700">Frecuencia respiratoria (rpm)</label>
                    <input type="number" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-700">Presión arterial (mmHg)</label>
                    <input type="text" placeholder="120/80" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-700">Temperatura (°C)</label>
                    <input type="number" step="0.1" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-700">Saturación O₂ (%)</label>
                    <input type="number" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none" />
                  </div>
                </div>
              </div>

              {/* Escala de dolor */}
              <div className="bg-purple-50 p-6 rounded-xl border-2 border-purple-200">
                <h3 className="text-purple-600 mb-4">Escala de Dolor Pediátrico</h3>
                <div className="flex justify-between mb-3">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      className={`w-12 h-12 rounded-lg border-2 transition-all hover:scale-110 active:scale-95
                        ${num <= 3 ? 'border-green-400 hover:bg-green-100' : 
                          num <= 6 ? 'border-yellow-400 hover:bg-yellow-100' : 
                          'border-red-400 hover:bg-red-100'}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <p className="text-gray-600">0 = Sin dolor | 10 = Dolor máximo</p>
              </div>

              {/* Motivo de consulta */}
              <div className="bg-orange-50 p-6 rounded-xl border-2 border-orange-200">
                <h3 className="text-orange-600 mb-4">Motivo de Consulta</h3>
                <textarea
                  className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                  rows={4}
                  placeholder="Describa el motivo de la consulta..."
                ></textarea>
              </div>

              {/* Antecedentes */}
              <div className="bg-red-50 p-6 rounded-xl border-2 border-red-200">
                <h3 className="text-red-600 mb-4">Antecedentes</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block mb-2 text-gray-700">Alergias</label>
                    <input type="text" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-700">Medicamentos actuales</label>
                    <input type="text" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-700">Enfermedades previas</label>
                    <textarea className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none" rows={3}></textarea>
                  </div>
                </div>
              </div>

              {/* Adjuntar fotos */}
              <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-300">
                <h3 className="text-gray-700 mb-4 flex items-center gap-2">
                  <Camera className="w-6 h-6" />
                  Adjuntar Fotos
                </h3>
                <button className="w-full p-6 border-2 border-dashed border-gray-400 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all">
                  <p className="text-gray-600">Click para seleccionar imágenes</p>
                </button>
              </div>

              <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl active:scale-98 transition-all">
                Guardar Entrevista
              </button>
            </div>
          </div>
        )}

        {section === 'diagnostico' && (
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

            {/* Búsqueda por síntomas */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-4 w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por síntomas (ej: fiebre, tos, vómitos)..."
                  className="w-full pl-14 pr-4 py-4 border-2 border-purple-300 rounded-xl focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Enfermedades más probables */}
            <h3 className="text-gray-700 mb-4">Enfermedades Comunes en Pediatría:</h3>
            <div className="space-y-3">
              {[
                { nombre: 'Faringitis aguda', categoria: 'Respiratorio', prevalencia: 'Alta' },
                { nombre: 'Gastroenteritis aguda', categoria: 'Digestivo', prevalencia: 'Alta' },
                { nombre: 'Bronquiolitis', categoria: 'Respiratorio', prevalencia: 'Media' },
                { nombre: 'Otitis media aguda', categoria: 'ORL', prevalencia: 'Alta' },
                { nombre: 'Exantema viral', categoria: 'Dermatológico', prevalencia: 'Media' },
              ].map((enfermedad, index) => (
                <div
                  key={index}
                  className="p-5 bg-purple-50 rounded-xl border-2 border-purple-200 hover:border-purple-400 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-purple-900 mb-1">{enfermedad.nombre}</h4>
                      <p className="text-gray-600">Categoría: {enfermedad.categoria}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-lg ${
                      enfermedad.prevalencia === 'Alta' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {enfermedad.prevalencia}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {section === 'base-datos' && (
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setSection('main')}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl active:scale-95 transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="flex-1 text-green-600">Base de Datos Offline</h2>
            </div>

            <div className="space-y-4">
              {/* Categorías */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 bg-green-50 rounded-xl border-2 border-green-200 hover:border-green-400 cursor-pointer transition-all">
                  <h3 className="text-green-600 mb-2">Enfermedades</h3>
                  <p className="text-gray-600">Etiología, diagnóstico, tratamiento</p>
                </div>
                <div className="p-5 bg-blue-50 rounded-xl border-2 border-blue-200 hover:border-blue-400 cursor-pointer transition-all">
                  <h3 className="text-blue-600 mb-2">Drogas</h3>
                  <p className="text-gray-600">Dosis, presentación, contraindicaciones</p>
                </div>
                <div className="p-5 bg-purple-50 rounded-xl border-2 border-purple-200 hover:border-purple-400 cursor-pointer transition-all">
                  <h3 className="text-purple-600 mb-2">Guías Clínicas</h3>
                  <p className="text-gray-600">Protocolos actualizados</p>
                </div>
              </div>

              {/* Ejemplo de contenido */}
              <div className="bg-gray-50 p-6 rounded-xl mt-6">
                <h3 className="text-gray-700 mb-4">Medicamentos Frecuentes:</h3>
                <div className="space-y-3">
                  {[
                    { nombre: 'Amoxicilina', dosis: '40-50 mg/kg/día c/8h', presentacion: 'Suspensión 250mg/5ml' },
                    { nombre: 'Ibuprofeno', dosis: '5-10 mg/kg/dosis c/6-8h', presentacion: 'Suspensión 100mg/5ml' },
                    { nombre: 'Paracetamol', dosis: '10-15 mg/kg/dosis c/4-6h', presentacion: 'Suspensión 160mg/5ml' },
                  ].map((med, index) => (
                    <div key={index} className="p-4 bg-white rounded-lg border-2 border-gray-200">
                      <h4 className="mb-2">{med.nombre}</h4>
                      <p className="text-gray-600">Dosis: {med.dosis}</p>
                      <p className="text-gray-600">Presentación: {med.presentacion}</p>
                    </div>
                  ))}
                </div>
              </div>
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
              <h2 className="flex-1 text-orange-600">Calculadoras Médicas</h2>
            </div>

            {/* Datos del paciente */}
            <div className="bg-orange-50 p-6 rounded-xl border-2 border-orange-200 mb-6">
              <h3 className="text-orange-600 mb-4">Datos del Paciente</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-gray-700">Peso (kg)</label>
                  <input
                    type="number"
                    value={pesoKg}
                    onChange={(e) => setPesoKg(e.target.value)}
                    className="w-full p-3 border-2 border-orange-300 rounded-lg focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-700">Edad (años)</label>
                  <input
                    type="number"
                    value={edadAnios}
                    onChange={(e) => setEdadAnios(e.target.value)}
                    className="w-full p-3 border-2 border-orange-300 rounded-lg focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Selección de calculadora */}
            <h3 className="text-gray-700 mb-4">Seleccione una calculadora:</h3>
            <div className="space-y-3 mb-6">
              {calculadoras.map((calc) => (
                <button
                  key={calc.id}
                  onClick={() => setSelectedCalculadora(calc.id)}
                  className={`w-full p-5 rounded-xl border-2 transition-all active:scale-98
                    ${selectedCalculadora === calc.id
                      ? 'bg-orange-100 border-orange-500'
                      : 'bg-gray-50 border-gray-300 hover:border-orange-400'
                    }`}
                >
                  <div className="text-left">
                    <h4 className="text-gray-900 mb-1">{calc.nombre}</h4>
                    <p className="text-gray-600">Fórmula: {calc.formula}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Resultado */}
            {selectedCalculadora && pesoKg && (
              <div className="bg-gradient-to-r from-orange-100 to-orange-50 p-6 rounded-xl border-2 border-orange-400">
                <h3 className="text-orange-900 mb-3">Resultado:</h3>
                <p className="text-orange-900">{calcularResultado()}</p>
              </div>
            )}
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
              <h2 className="flex-1 text-indigo-600">Algoritmos Interactivos</h2>
            </div>

            <div className="space-y-4">
              {[
                { nombre: 'Manejo de Fiebre en Pediatría', categoria: 'General' },
                { nombre: 'Sibilancias en Lactantes', categoria: 'Respiratorio' },
                { nombre: 'Diarrea Aguda', categoria: 'Digestivo' },
                { nombre: 'Dolor Abdominal', categoria: 'Digestivo' },
                { nombre: 'Cefalea en Niños', categoria: 'Neurológico' },
              ].map((algo, index) => (
                <div
                  key={index}
                  className="p-5 bg-indigo-50 rounded-xl border-2 border-indigo-200 hover:border-indigo-400 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-4">
                    <GitBranch className="w-8 h-8 text-indigo-600" />
                    <div className="flex-1">
                      <h3 className="text-indigo-900 mb-1">{algo.nombre}</h3>
                      <p className="text-gray-600">Categoría: {algo.categoria}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
