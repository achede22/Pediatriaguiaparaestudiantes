import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Heart, AlertTriangle, Wind, Zap, Activity, Calculator, FileText, Phone, AlertCircle } from 'lucide-react';

interface EmergenciaMedicoProps {
  onGoBack: () => void;
}

type Section = 'main' | 'algoritmos' | 'calculadoras' | 'procedimientos';

export function EmergenciaMedico({ onGoBack }: EmergenciaMedicoProps) {
  const [section, setSection] = useState<Section>('main');
  const [selectedAlgoritmo, setSelectedAlgoritmo] = useState<string | null>(null);
  const [peso, setPeso] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const algoritmos = [
    { id: 'rcp', nombre: 'Paro Cardíaco (RCP Pediátrica)', icon: Heart },
    { id: 'anafilaxia', nombre: 'Anafilaxia', icon: AlertTriangle },
    { id: 'asma', nombre: 'Crisis Asmática Grave', icon: Wind },
    { id: 'convulsiones', nombre: 'Convulsiones', icon: Zap },
    { id: 'tce', nombre: 'Traumatismo Craneoencefálico Grave', icon: Activity },
    { id: 'deshidratacion', nombre: 'Deshidratación Severa / Shock', icon: Activity },
  ];

  const medicamentosEmergencia = [
    {
      nombre: 'Adrenalina (IM/SC)',
      dosis: '0.01 mg/kg (máx 0.5 mg)',
      presentacion: 'Ampolla 1mg/1ml (1:1000)',
      maxDosis: 0.5,
      notas: 'Repetir cada 5-15 min si es necesario. Vía IM preferente (muslo).',
      fuente: 'https://www.guiafarmapediatrica.es/indice/farmacos-de-uso-en-emergencias/anafilaxia/adrenalina-im-o-sc'
    },
    {
      nombre: 'Adrenalina (Nebulizada)',
      dosis: '3-5 mg/dosis (3-5 ml)',
      presentacion: 'Ampolla 1mg/1ml',
      maxDosis: 5,
      notas: 'Diluir con suero fisiológico hasta 4ml. Flujo O2 4-6 l/min.',
      fuente: 'https://www.guiafarmapediatrica.es/indice/farmacos-de-uso-en-emergencias/urgencias-respiratorias/adrenalina-nebulizada'
    },
    {
      nombre: 'Atropina',
      dosis: '0.02 mg/kg (mín 0.1mg, máx 0.5mg)',
      presentacion: 'Ampolla 1mg/1ml',
      maxDosis: 0.5,
      minDosis: 0.1,
      fuente: 'https://www.guiafarmapediatrica.es/node/549'
    },
    {
      nombre: 'Bromuro de Ipratropio',
      dosis: '<30kg: 250mcg | >30kg: 500mcg',
      presentacion: 'Solución para inhalación',
      maxDosis: 0.5,
      notas: 'Cada 20 min, máx 3 dosis en 1 hora. Asociar a Salbutamol.',
      fuente: 'https://www.guiafarmapediatrica.es/indice/farmacos-de-uso-en-emergencias/urgencias-respiratorias/bromuro-de-ipratropio-nebulizado'
    },
    {
      nombre: 'Bicarbonato',
      dosis: '1 mEq/kg IV',
      presentacion: '1 mEq/ml',
      maxDosis: 50,
      fuente: 'https://www.guiafarmapediatrica.es/indice/farmacos-de-uso-en-emergencias/urgencias-respiratorias/bicarbonato'
    },
    {
      nombre: 'Lidocaína',
      dosis: '1 mg/kg IV',
      presentacion: 'Ampolla 100mg/5ml',
      maxDosis: 100
    },
    {
      nombre: 'Midazolam',
      dosis: '0.1-0.2 mg/kg IM/IV',
      presentacion: 'Ampolla 5mg/5ml',
      maxDosis: 10
    },
    {
      nombre: 'Diazepam',
      dosis: '0.3-0.5 mg/kg Rectal',
      presentacion: 'Ampolla 10mg/2ml',
      maxDosis: 10
    },
  ];

  const filteredMedicamentos = medicamentosEmergencia.filter(med =>
    med.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calcularDosis = (medicamento: string, pesoKg: number) => {
    const med = medicamentosEmergencia.find(m => m.nombre === medicamento);
    if (!med) return '0';

    // Lógica especial para medicamentos con dosis fijas por rango de peso
    if (medicamento === 'Bromuro de Ipratropio') {
      return pesoKg < 30 ? '250 mcg' : '500 mcg';
    }

    if (medicamento === 'Adrenalina (Nebulizada)') {
      return '3 - 5 mg';
    }

    let dosisCalculada = 0;

    switch (medicamento) {
      case 'Adrenalina (IM/SC)': dosisCalculada = pesoKg * 0.01; break;
      case 'Atropina': dosisCalculada = pesoKg * 0.02; break;
      case 'Bicarbonato': dosisCalculada = pesoKg * 1; break;
      case 'Lidocaína': dosisCalculada = pesoKg * 1; break;
      case 'Midazolam': dosisCalculada = pesoKg * 0.15; break;
      case 'Diazepam': dosisCalculada = pesoKg * 0.4; break;
      default: dosisCalculada = 0;
    }

    if (med.minDosis && dosisCalculada < med.minDosis) dosisCalculada = med.minDosis;
    if (med.maxDosis && dosisCalculada > med.maxDosis) return `${med.maxDosis} (Dosis Máxima)`;

    return dosisCalculada.toFixed(2);
  };

  const renderAlgoritmoDetalle = (id: string) => {
    const algoritmosData: any = {
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
          'Si persiste >20 min: considerar fenitoína o fenobarbital',
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
              <span>Llamar al 911</span>
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

            <div className="mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar medicación..."
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:outline-none"
              />
            </div>

            <div className="space-y-4">
              {filteredMedicamentos.length > 0 ? (
                filteredMedicamentos.map((med: any) => (
                  <div key={med.nombre} className="bg-gray-50 p-5 rounded-xl border-2 border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{med.nombre}</h3>
                      {med.maxDosis && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full border border-red-200">
                          Máx: {med.maxDosis} {med.nombre === 'Bicarbonato' ? 'mEq' : 'mg'}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-1 text-sm">Dosis: {med.dosis}</p>
                    <p className="text-gray-600 mb-3 text-sm">Presentación: {med.presentacion}</p>
                    {med.notas && (
                      <p className="text-blue-600 mb-2 text-xs italic bg-blue-50 p-2 rounded">
                        Nota: {med.notas}
                      </p>
                    )}
                    {peso && parseFloat(peso) > 0 && (
                      <div className="bg-orange-100 p-4 rounded-lg border-2 border-orange-300 mb-2">
                        <p className="text-orange-900 font-medium">
                          Dosis calculada: <span className="text-xl font-bold">{calcularDosis(med.nombre, parseFloat(peso))} {med.nombre === 'Bicarbonato' ? 'mEq' : 'mg'}</span>
                        </p>
                      </div>
                    )}
                    {med.fuente && (
                      <a
                        href={med.fuente}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-400 hover:text-blue-500 underline flex items-center gap-1"
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
