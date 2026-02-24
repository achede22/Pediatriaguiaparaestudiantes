import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Heart, AlertTriangle, Wind, Zap, Activity, Calculator, FileText, Phone, AlertCircle, ChevronDown, Search } from 'lucide-react';
import { medicamentosEmergencia, calcularDosisEmergencia } from '../data/emergencyMedications';
import type { MedicamentoEmergencia } from '../data/emergencyMedications';

interface EmergenciaMedicoProps {
  onGoBack: () => void;
}

type Section = 'main' | 'algoritmos' | 'calculadoras' | 'procedimientos';

export function EmergenciaMedico({ onGoBack }: EmergenciaMedicoProps) {
  const [section, setSection] = useState<Section>('main');
  const [selectedAlgoritmo, setSelectedAlgoritmo] = useState<string | null>(null);
  const [peso, setPeso] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPresentaciones, setSelectedPresentaciones] = useState<Record<string, number>>({});
  const [categoriaFilter, setCategoriaFilter] = useState<string>('todas');

  const algoritmos = [
    { id: 'rcp', nombre: 'Paro Cardíaco (RCP Pediátrica)', icon: Heart },
    { id: 'anafilaxia', nombre: 'Anafilaxia', icon: AlertTriangle },
    { id: 'asma', nombre: 'Crisis Asmática Grave', icon: Wind },
    { id: 'convulsiones', nombre: 'Convulsiones', icon: Zap },
    { id: 'tce', nombre: 'Traumatismo Craneoencefálico Grave', icon: Activity },
    { id: 'deshidratacion', nombre: 'Deshidratación Severa / Shock', icon: Activity },
  ];

  // Obtener categorías únicas
  const categorias = ['todas', ...Array.from(new Set(medicamentosEmergencia.map(m => m.categoria)))];

  // Filtrar por nombre y categoría
  const filteredMedicamentos = medicamentosEmergencia.filter(med => {
    const matchesSearch = med.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = categoriaFilter === 'todas' || med.categoria === categoriaFilter;
    return matchesSearch && matchesCategoria;
  });

  const getPresentacionIdx = (medNombre: string) => selectedPresentaciones[medNombre] || 0;

  const renderDosisCalculada = (med: MedicamentoEmergencia, pesoKg: number) => {
    const presIdx = getPresentacionIdx(med.nombre);
    const resultado = calcularDosisEmergencia(med, pesoKg, presIdx);

    if (resultado.esFija) {
      return (
        <div className="space-y-2">
          <p className="text-orange-800 text-sm font-medium">{resultado.textoFijo || 'Dosis fija'}</p>
          <div className="flex flex-wrap gap-3">
            <div className="bg-white px-4 py-2 rounded-lg border border-orange-200">
              <span className="text-xs text-gray-500 block">Dosis</span>
              <span className="text-lg font-bold text-orange-900">{resultado.dosisMg} {resultado.unidad}</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg border border-blue-200">
              <span className="text-xs text-gray-500 block">Volumen</span>
              <span className="text-lg font-bold text-blue-700">{resultado.dosisMl.toFixed(2)} mL</span>
            </div>
          </div>
        </div>
      );
    }

    // Rango de dosis
    if (resultado.dosisMinMg !== undefined && resultado.dosisMaxMg !== undefined) {
      return (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-3">
            <div className="bg-white px-4 py-2 rounded-lg border border-orange-200 flex-1 min-w-[120px]">
              <span className="text-xs text-gray-500 block">Dosis (rango)</span>
              <span className="text-lg font-bold text-orange-900">
                {resultado.dosisMinMg.toFixed(2)} – {resultado.dosisMaxMg.toFixed(2)} {resultado.unidad}
              </span>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg border border-blue-200 flex-1 min-w-[120px]">
              <span className="text-xs text-gray-500 block">Volumen (rango)</span>
              <span className="text-lg font-bold text-blue-700">
                {resultado.dosisMinMl!.toFixed(2)} – {resultado.dosisMaxMl!.toFixed(2)} mL
              </span>
            </div>
          </div>
          {resultado.excedeDosisMax && (
            <div className="flex items-center gap-2 text-red-700 bg-red-50 p-2 rounded-lg border border-red-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs font-medium">Dosis máx por toma alcanzada: {med.maxDosisPorToma} {resultado.unidad}</span>
            </div>
          )}
        </div>
      );
    }

    // Dosis simple
    return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-3">
          <div className="bg-white px-4 py-2 rounded-lg border border-orange-200 flex-1 min-w-[120px]">
            <span className="text-xs text-gray-500 block">Dosis</span>
            <span className="text-lg font-bold text-orange-900">{resultado.dosisMg.toFixed(2)} {resultado.unidad}</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border border-blue-200 flex-1 min-w-[120px]">
            <span className="text-xs text-gray-500 block">Volumen</span>
            <span className="text-lg font-bold text-blue-700">{resultado.dosisMl.toFixed(2)} mL</span>
          </div>
        </div>
        {resultado.porDebajoDosisMin && (
          <div className="flex items-center gap-2 text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs font-medium">Dosis mínima aplicada: {med.minDosis} {resultado.unidad}</span>
          </div>
        )}
        {resultado.excedeDosisMax && (
          <div className="flex items-center gap-2 text-red-700 bg-red-50 p-2 rounded-lg border border-red-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs font-medium">⚠️ Dosis máx por toma alcanzada: {med.maxDosisPorToma} {resultado.unidad}</span>
          </div>
        )}
        {resultado.excedeDosisMaxDia && (
          <div className="flex items-center gap-2 text-red-700 bg-red-50 p-2 rounded-lg border border-red-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs font-medium">⚠️ Dosis máx por DÍA alcanzada: {med.maxDosisPorDia} {resultado.unidad}</span>
          </div>
        )}
      </div>
    );
  };

  const renderAlgoritmoDetalle = (id: string) => {
    const algoritmosData: Record<string, { titulo: string; pasos: string[] }> = {
      'rcp': {
        titulo: 'RCP Pediátrica',
        pasos: [
          'Verificar seguridad de la escena',
          'Evaluar respuesta - estimular y llamar',
          'Activar código de emergencia',
          'Verificar respiración (no más de 10 seg)',
          'Compresiones: 100-120/min, profundidad 1/3 del diámetro torácico',
          'Relación compresión-ventilación: 30:2 (1 rescatador) o 15:2 (2 rescatadores)',
          'Continuar hasta recuperación o llegada de equipo avanzado',
        ]
      },
      'anafilaxia': {
        titulo: 'Anafilaxia',
        pasos: [
          'Reconocer signos: urticaria, angioedema, broncoespasmo, hipotensión',
          'Adrenalina IM 0.01 mg/kg (máx 0.5mg) en cara anterolateral del muslo',
          'Posición supina con piernas elevadas',
          'Oxígeno suplementario',
          'Monitoreo continuo',
          'Repetir adrenalina cada 5-15 min si es necesario',
          'Antihistamínicos y corticoides como terapia adjunta',
        ]
      },
      'asma': {
        titulo: 'Crisis Asmática Grave',
        pasos: [
          'Evaluación rápida: saturación O2, frecuencia respiratoria, trabajo respiratorio',
          'Oxígeno para mantener SatO2 >90%',
          'Salbutamol nebulizado: 0.15 mg/kg (mín 2.5mg, máx 5mg) cada 20 min',
          'Bromuro de ipratropio nebulizado: 250-500 mcg',
          'Corticoides sistémicos: Prednisolona 1-2 mg/kg VO o Hidrocortisona 4-8 mg/kg IV',
          'Si no responde: Sulfato de magnesio 40-50 mg/kg IV en 20 min',
          'Considerar ventilación mecánica si deterioro',
        ]
      },
      'convulsiones': {
        titulo: 'Convulsiones',
        pasos: [
          'Asegurar vía aérea permeable',
          'Posición lateral de seguridad',
          'Proteger de lesiones, no restringir',
          'Si >5 min: Midazolam 0.2 mg/kg IM o bucal (máx 10mg)',
          'Alternativa: Diazepam 0.3-0.5 mg/kg rectal (máx 10mg)',
          'Si persiste >10 min: segunda dosis de benzodiacepina',
          'Si persiste >20 min: Fenitoína 15-20 mg/kg IV en 20 min (máx 1g)',
          'Alternativa a fenitoína: Fenobarbital 15-20 mg/kg IV en 15-30 min',
        ]
      },
      'tce': {
        titulo: 'Traumatismo Craneoencefálico Grave',
        pasos: [
          'ABC: asegurar vía aérea y ventilación',
          'Inmovilización cervical',
          'Evaluar Glasgow pediátrico',
          'Mantener normotensión y normoxia',
          'Cabeza en línea media, elevada 30°',
          'Evitar hipotermia e hipertermia',
          'Considerar manitol si signos de herniación: 0.25-1 g/kg IV',
          'Derivación urgente a neurocirugía',
        ]
      },
      'deshidratacion': {
        titulo: 'Deshidratación Severa / Shock',
        pasos: [
          'Evaluar signos de shock: taquicardia, pulsos débiles, llenado capilar >2s',
          'Acceso vascular inmediato (IV o IO)',
          'Bolo de Suero Fisiológico o Ringer Lactato: 20 ml/kg en 5-10 min',
          'Reevaluar signos de perfusión y sobrecarga',
          'Repetir bolo si es necesario (hasta 60 ml/kg)',
          'Si no responde: considerar inotrópicos y causa cardiogénica',
          'Corregir hipoglicemia e hipocalcemia si presentes',
        ]
      }
    };

    const algoritmo = algoritmosData[id];
    if (!algoritmo) return null;
    return (
      <div className="space-y-4">
        <h3 className="text-blue-600 mb-4">{algoritmo.titulo}</h3>
        <div className="space-y-3">
          {algoritmo.pasos.map((paso: string, index: number) => (
            <div key={index} className="flex gap-4 bg-white p-4 rounded-xl border-2 border-blue-100">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                {index + 1}
              </div>
              <p className="flex-1">{paso}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 p-6"
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-600 text-white rounded-2xl p-6 mb-6 shadow-xl">
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={onGoBack}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-xl active:scale-95 transition-all"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-white">EMERGENCIA</h1>
              <p className="text-red-100">Algoritmos y Dosis Críticas</p>
            </div>
            <AlertTriangle className="w-12 h-12" />
          </div>
        </div>

        {section === 'main' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <button
              onClick={() => setSection('algoritmos')}
              className="w-full bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl active:scale-98 transition-all
                       border-2 border-red-200 hover:border-red-400 flex items-center gap-4"
            >
              <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center">
                <Heart className="w-8 h-8 text-red-600" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-red-600">Algoritmos de Emergencia</h3>
                <p className="text-gray-600">RCP, Anafilaxia, Crisis Asmática, Shock</p>
              </div>
            </button>

            <button
              onClick={() => setSection('calculadoras')}
              className="w-full bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl active:scale-98 transition-all
                       border-2 border-orange-200 hover:border-orange-400 flex items-center gap-4"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center">
                <Calculator className="w-8 h-8 text-orange-600" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-orange-600">Calculadoras de Dosis</h3>
                <p className="text-gray-600">Dosis de emergencia con alertas de seguridad</p>
              </div>
            </button>

            <button
              onClick={() => setSection('procedimientos')}
              className="w-full bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl active:scale-98 transition-all
                       border-2 border-blue-200 hover:border-blue-400 flex items-center gap-4"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-blue-600">Guía de Procedimientos</h3>
                <p className="text-gray-600">Intubación, Acceso venoso, Ventilación</p>
              </div>
            </button>

            <a
              href="tel:911"
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-2xl shadow-lg 
                       hover:shadow-xl active:scale-98 transition-all flex items-center gap-4 justify-center"
            >
              <Phone className="w-8 h-8" />
              <span>Llamar Emergencias</span>
            </a>
          </motion.div>
        )}

        {section === 'algoritmos' && (
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => {
                  setSelectedAlgoritmo(null);
                  setSection('main');
                }}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl active:scale-95 transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="flex-1 text-red-600">Algoritmos de Emergencia</h2>
            </div>

            {!selectedAlgoritmo ? (
              <div className="space-y-3">
                {algoritmos.map((algo) => (
                  <button
                    key={algo.id}
                    onClick={() => setSelectedAlgoritmo(algo.id)}
                    className="w-full p-5 bg-red-50 hover:bg-red-100 rounded-xl border-2 border-red-200 
                             hover:border-red-400 active:scale-98 transition-all flex items-center gap-4"
                  >
                    <algo.icon className="w-8 h-8 text-red-600" />
                    <span className="flex-1 text-left">{algo.nombre}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div>
                <button
                  onClick={() => setSelectedAlgoritmo(null)}
                  className="mb-6 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl active:scale-95 transition-all"
                >
                  ← Volver a algoritmos
                </button>
                {renderAlgoritmoDetalle(selectedAlgoritmo)}
              </div>
            )}
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
              <h2 className="flex-1 text-orange-600">Calculadoras de Dosis</h2>
            </div>

            {/* Peso del paciente */}
            <div className="mb-6 bg-orange-50 p-6 rounded-xl border-2 border-orange-200">
              <label className="block mb-3 font-bold text-orange-800">Peso del paciente (kg):</label>
              <input
                type="number"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                placeholder="Ingrese el peso"
                className="w-full p-4 border-2 border-orange-300 rounded-xl focus:border-orange-500 focus:outline-none text-lg"
              />
              {peso && parseFloat(peso) > 40 && (
                <div className="mt-2 flex items-center gap-2 text-orange-700 bg-orange-100 p-2 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm">Peso adulto: verificar dosis máximas.</span>
                </div>
              )}
            </div>

            {/* Buscador */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar medicamento por nombre..."
                  className="w-full pl-12 p-3 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Filtro por categoría */}
            <div className="mb-6 flex flex-wrap gap-2">
              {categorias.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoriaFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${categoriaFilter === cat
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {cat === 'todas' ? 'Todas' : cat}
                </button>
              ))}
            </div>

            {/* Lista de medicamentos */}
            <div className="space-y-4">
              {filteredMedicamentos.length > 0 ? (
                filteredMedicamentos.map((med) => (
                  <div key={med.nombre} className="bg-gray-50 p-5 rounded-xl border-2 border-gray-200">
                    {/* Header */}
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{med.nombre}</h3>
                        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">{med.categoria}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {med.maxDosisPorToma && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full border border-red-200">
                            Máx/toma: {med.maxDosisPorToma} {med.unidadDosis}
                          </span>
                        )}
                        {med.maxDosisPorDia && (
                          <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full border border-purple-200">
                            Máx/día: {med.maxDosisPorDia} {med.unidadDosis}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-1 mb-3">
                      <p className="text-gray-700 text-sm"><span className="font-medium">Dosis:</span> {med.dosisTexto}</p>
                      <p className="text-gray-700 text-sm"><span className="font-medium">Vía:</span> {med.via}</p>
                      <p className="text-gray-700 text-sm"><span className="font-medium">Frecuencia:</span> {med.frecuencia}</p>
                      <p className="text-gray-700 text-sm"><span className="font-medium">Tomas:</span> {med.numTomasDia}</p>
                    </div>

                    {/* Selector de presentación */}
                    {med.presentaciones.length > 1 && (
                      <div className="mb-3">
                        <label className="text-xs text-gray-500 block mb-1">Presentación:</label>
                        <div className="relative">
                          <select
                            value={getPresentacionIdx(med.nombre)}
                            onChange={(e) => setSelectedPresentaciones(prev => ({
                              ...prev,
                              [med.nombre]: parseInt(e.target.value)
                            }))}
                            className="w-full p-2.5 pr-10 border-2 border-blue-200 rounded-lg text-sm bg-white focus:border-blue-400 focus:outline-none appearance-none"
                          >
                            {med.presentaciones.map((pres, idx) => (
                              <option key={idx} value={idx}>
                                {pres.nombre} ({pres.concentracion} {pres.unidadConcentracion})
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    )}

                    {/* Presentación única */}
                    {med.presentaciones.length === 1 && (
                      <p className="text-gray-600 text-sm mb-3">
                        <span className="font-medium">Presentación:</span> {med.presentaciones[0].nombre} ({med.presentaciones[0].concentracion} {med.presentaciones[0].unidadConcentracion})
                      </p>
                    )}

                    {/* Notas */}
                    {med.notas && (
                      <p className="text-blue-700 mb-3 text-xs italic bg-blue-50 p-2.5 rounded-lg border border-blue-100">
                        💡 {med.notas}
                      </p>
                    )}

                    {/* Alertas */}
                    {med.alertas && med.alertas.length > 0 && (
                      <div className="mb-3 bg-red-50 p-2.5 rounded-lg border border-red-100">
                        {med.alertas.map((alerta, idx) => (
                          <p key={idx} className="text-red-700 text-xs flex items-start gap-1">
                            <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            {alerta}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Resultado calculado */}
                    {peso && parseFloat(peso) > 0 && (
                      <div className="bg-gradient-to-r from-orange-50 to-blue-50 p-4 rounded-lg border-2 border-orange-300">
                        <p className="text-sm font-bold text-gray-700 mb-2">📊 Resultado para {peso} kg:</p>
                        {renderDosisCalculada(med, parseFloat(peso))}
                      </div>
                    )}

                    {/* Fuente */}
                    {med.fuente && (
                      <a
                        href={med.fuente}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 text-xs text-gray-400 hover:text-blue-500 underline flex items-center gap-1"
                      >
                        Fuente: Guía Farmacológica Pediátrica
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">No se encontraron medicamentos.</p>
              )}
            </div>
          </div>
        )}

        {section === 'procedimientos' && (
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setSection('main')}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl active:scale-95 transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="flex-1 text-blue-600">Guía de Procedimientos</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
                <h3 className="text-blue-600 mb-3 font-bold">Intubación Endotraqueal</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Tubo endotraqueal: (Edad/4) + 4 mm</li>
                  <li>• Profundidad inserción: Edad/2 + 12 cm (a nivel labios)</li>
                  <li>• Preoxigenar con O2 al 100%</li>
                  <li>• Premedicación: Atropina 0.02 mg/kg</li>
                  <li>• Verificar posición: Auscultación + Capnografía</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
                <h3 className="text-blue-600 mb-3 font-bold">Acceso Venoso</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Primera opción: Vía periférica (antecubital, mano)</li>
                  <li>• Si falla en 90 seg: Vía intraósea</li>
                  <li>• Sitios IO: Tibia proximal, fémur distal, húmero proximal</li>
                  <li>• Velocidad infusión IO: Usar presión para bolos</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
                <h3 className="text-blue-600 mb-3 font-bold">Ventilación a Presión Positiva</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Frecuencia: 20-30 respiraciones/min</li>
                  <li>• Volumen: elevar tórax visiblemente</li>
                  <li>• Máscara tamaño apropiado (cubre nariz y boca, no ojos)</li>
                  <li>• Técnica E-C para sellado</li>
                  <li>• Monitoreo continuo de saturación</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
