import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Heart, AlertTriangle, Wind, Zap, Activity, Calculator, FileText, Phone } from 'lucide-react';

interface EmergenciaMedicoProps {
  onGoBack: () => void;
}

type Section = 'main' | 'algoritmos' | 'calculadoras' | 'procedimientos';

export function EmergenciaMedico({ onGoBack }: EmergenciaMedicoProps) {
  const [section, setSection] = useState<Section>('main');
  const [selectedAlgoritmo, setSelectedAlgoritmo] = useState<string | null>(null);
  const [selectedCalculadora, setSelectedCalculadora] = useState<string | null>(null);
  const [peso, setPeso] = useState('');

  const algoritmos = [
    { id: 'rcp', nombre: 'Paro Cardíaco (RCP Pediátrica)', icon: Heart },
    { id: 'anafilaxia', nombre: 'Anafilaxia', icon: AlertTriangle },
    { id: 'asma', nombre: 'Crisis Asmática Grave', icon: Wind },
    { id: 'convulsiones', nombre: 'Convulsiones', icon: Zap },
    { id: 'tce', nombre: 'Traumatismo Craneoencefálico Grave', icon: Activity },
  ];

  const medicamentosEmergencia = [
    { nombre: 'Adrenalina', dosis: '0.01 mg/kg (máx 0.5 mg) IM', presentacion: 'Ampolla 1mg/1ml' },
    { nombre: 'Atropina', dosis: '0.02 mg/kg (mín 0.1mg, máx 0.5mg)', presentacion: 'Ampolla 1mg/1ml' },
    { nombre: 'Bicarbonato', dosis: '1 mEq/kg IV', presentacion: '1 mEq/ml' },
    { nombre: 'Lidocaína', dosis: '1 mg/kg IV', presentacion: 'Ampolla 100mg/5ml' },
    { nombre: 'Midazolam', dosis: '0.1-0.2 mg/kg IM/IV', presentacion: 'Ampolla 5mg/5ml' },
  ];

  const calcularDosis = (medicamento: string, pesoKg: number) => {
    const dosis: any = {
      'Adrenalina': pesoKg * 0.01,
      'Atropina': Math.max(0.1, Math.min(0.5, pesoKg * 0.02)),
      'Bicarbonato': pesoKg * 1,
      'Lidocaína': pesoKg * 1,
      'Midazolam': pesoKg * 0.15,
    };
    return dosis[medicamento]?.toFixed(2) || '0';
  };

  const renderAlgoritmoDetalle = (id: string) => {
    const algoritmos: any = {
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
      }
    };

    const algoritmo = algoritmos[id];
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
      className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
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
              <p className="text-red-100">Modo Médico</p>
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
            {/* Algoritmos de Emergencia */}
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
                <p className="text-gray-600">RCP, Anafilaxia, Crisis Asmática, Convulsiones, TCE</p>
              </div>
            </button>

            {/* Calculadoras de Dosis */}
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
                <p className="text-gray-600">Adrenalina, Atropina, Bicarbonato, Lidocaína y más</p>
              </div>
            </button>

            {/* Guía de Procedimientos */}
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

            {/* Llamada de Emergencia */}
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
              <label className="block mb-3">Peso del paciente (kg):</label>
              <input
                type="number"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                placeholder="Ingrese el peso"
                className="w-full p-4 border-2 border-orange-300 rounded-xl focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div className="space-y-4">
              {medicamentosEmergencia.map((med) => (
                <div key={med.nombre} className="bg-gray-50 p-5 rounded-xl border-2 border-gray-200">
                  <h3 className="text-gray-900 mb-2">{med.nombre}</h3>
                  <p className="text-gray-600 mb-2">Dosis: {med.dosis}</p>
                  <p className="text-gray-600 mb-3">Presentación: {med.presentacion}</p>
                  {peso && parseFloat(peso) > 0 && (
                    <div className="bg-orange-100 p-4 rounded-lg border-2 border-orange-300">
                      <p className="text-orange-900">
                        Dosis calculada: <span>{calcularDosis(med.nombre, parseFloat(peso))} {med.nombre === 'Bicarbonato' ? 'mEq' : 'mg'}</span>
                      </p>
                    </div>
                  )}
                </div>
              ))}
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
                <h3 className="text-blue-600 mb-3">Intubación Endotraqueal</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Tubo endotraqueal: (Edad/4) + 4 mm</li>
                  <li>• Profundidad inserción: Edad/2 + 12 cm (a nivel labios)</li>
                  <li>• Preoxigenar con O2 al 100%</li>
                  <li>• Premedicación: Atropina 0.02 mg/kg</li>
                  <li>• Verificar posición: Auscultación + Capnografía</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
                <h3 className="text-blue-600 mb-3">Acceso Venoso</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Primera opción: Vía periférica (antecubital, mano)</li>
                  <li>• Si falla en 90 seg: Vía intraósea</li>
                  <li>• Sitios IO: Tibia proximal, fémur distal, húmero proximal</li>
                  <li>• Velocidad infusión IO: Usar presión para bolos</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
                <h3 className="text-blue-600 mb-3">Ventilación a Presión Positiva</h3>
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
