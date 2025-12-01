import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Heart, AlertTriangle, Wind, Zap, Activity, Calculator, FileText, Phone, AlertCircle, Check, ChevronRight, RotateCcw, Image as ImageIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Images
import rcpImg from '../assets/img/cardio/ALGORITMO DE PARO.jpg';
import anafilaxiaImg from '../assets/img/cardio/ALGORITMO DE SINDROME CORONARIO AGUDO.jpg'; // Placeholder/Best fit
import asmaImg from '../assets/img/respiratorio/algoritmo asma niños.jpg';
import acvImg from '../assets/img/neuro/algoritmo_acv.jpg';
import shockImg from '../assets/img/cardio/TAQUICARDIA CON PULSO.jpg'; // Placeholder/Best fit

type Section = 'main' | 'algoritmos' | 'calculadoras' | 'procedimientos';

interface AlgorithmStep {
  id: string;
  question: string;
  description?: string;
  options: {
    label: string;
    nextStepId: string | null; // null means end of branch
    action?: string; // e.g., "Administer Adrenaline"
    variant?: 'primary' | 'secondary' | 'danger';
  }[];
}

interface Algorithm {
  id: string;
  nombre: string;
  icon: any;
  image?: string; // Path to the algorithm image
  steps: Record<string, AlgorithmStep>;
  initialStep: string;
}

export default function Emergency() {
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>('main');
  const [selectedAlgoritmo, setSelectedAlgoritmo] = useState<string | null>(null);
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [peso, setPeso] = useState('');
  const [showImage, setShowImage] = useState(false);

  const algoritmos: Algorithm[] = [
    {
      id: 'rcp',
      nombre: 'Paro Cardíaco (RCP Pediátrica)',
      icon: Heart,
      image: rcpImg,
      initialStep: 'seguridad',
      steps: {
        'seguridad': {
          id: 'seguridad',
          question: '¿La escena es segura?',
          options: [
            { label: 'Sí', nextStepId: 'consciencia', variant: 'primary' },
            { label: 'No', nextStepId: null, action: 'Asegurar la escena antes de ingresar.', variant: 'danger' }
          ]
        },
        'consciencia': {
          id: 'consciencia',
          question: '¿El paciente responde?',
          description: 'Estimular y llamar en voz alta.',
          options: [
            { label: 'Sí', nextStepId: 'evaluacion', variant: 'secondary' },
            { label: 'No', nextStepId: 'respiracion', variant: 'danger' }
          ]
        },
        'respiracion': {
          id: 'respiracion',
          question: 'Verificar respiración y pulso (< 10 seg)',
          description: '¿Respira normal y tiene pulso?',
          options: [
            { label: 'Respira y tiene pulso', nextStepId: 'evaluacion', variant: 'primary' },
            { label: 'No respira pero tiene pulso', nextStepId: 'ventilacion', variant: 'secondary' },
            { label: 'No respira y NO tiene pulso', nextStepId: 'rcp_inicio', variant: 'danger' }
          ]
        },
        'rcp_inicio': {
          id: 'rcp_inicio',
          question: 'INICIAR RCP',
          description: '30:2 (1 rescatador) o 15:2 (2 rescatadores). Comprimir fuerte y rápido (100-120 lpm).',
          options: [
            { label: 'DEA/Desfibrilador llegó', nextStepId: 'ritmo', variant: 'primary' }
          ]
        },
        'ventilacion': {
          id: 'ventilacion',
          question: 'Ventilación de Rescate',
          description: '1 ventilación cada 2-3 segundos (20-30 vpm).',
          options: [
            { label: 'Reevaluar pulso cada 2 min', nextStepId: 'respiracion', variant: 'primary' }
          ]
        },
        'ritmo': {
          id: 'ritmo',
          question: 'Analizar Ritmo',
          description: '¿El ritmo es desfibrilable? (FV/TV sin pulso)',
          options: [
            { label: 'Sí (Desfibrilable)', nextStepId: 'descarga', variant: 'danger' },
            { label: 'No (Asistolia/AESP)', nextStepId: 'rcp_continuar', variant: 'secondary' }
          ]
        },
        'descarga': {
          id: 'descarga',
          question: 'Administrar Descarga',
          description: '2 J/kg (primera), luego 4 J/kg. Reanudar RCP inmediatamente.',
          options: [
            { label: 'Continuar RCP 2 min', nextStepId: 'ritmo', variant: 'primary' }
          ]
        },
        'rcp_continuar': {
          id: 'rcp_continuar',
          question: 'Continuar RCP',
          description: 'Administrar Adrenalina lo antes posible. Considerar vía aérea avanzada.',
          options: [
            { label: 'Reevaluar ritmo cada 2 min', nextStepId: 'ritmo', variant: 'primary' }
          ]
        },
        'evaluacion': {
          id: 'evaluacion',
          question: 'Evaluación Secundaria',
          description: 'Monitorear ABCDE y buscar causa reversible.',
          options: [
            { label: 'Finalizar', nextStepId: null, variant: 'secondary' }
          ]
        }
      }
    },
    {
      id: 'anafilaxia',
      nombre: 'Anafilaxia',
      icon: AlertTriangle,
      initialStep: 'reconocimiento',
      steps: {
        'reconocimiento': {
          id: 'reconocimiento',
          question: 'Signos de Anafilaxia',
          description: 'Inicio agudo + Piel/Mucosas + (Respiratorio O Circulatorio O Gastrointestinal).',
          options: [
            { label: 'Confirmar Anafilaxia', nextStepId: 'adrenalina', variant: 'danger' },
            { label: 'Solo síntomas leves (piel)', nextStepId: 'antihistaminico', variant: 'secondary' }
          ]
        },
        'adrenalina': {
          id: 'adrenalina',
          question: 'Adrenalina IM Inmediata',
          description: 'Dosis: 0.01 mg/kg (máx 0.5 mg). Cara anterolateral del muslo.',
          options: [
            { label: 'Mejoría', nextStepId: 'observacion', variant: 'primary' },
            { label: 'Sin mejoría en 5-15 min', nextStepId: 'repetir_adrenalina', variant: 'danger' }
          ]
        },
        'repetir_adrenalina': {
          id: 'repetir_adrenalina',
          question: 'Repetir Adrenalina',
          description: 'Considerar infusión IV si refractario. Líquidos IV 20 ml/kg.',
          options: [
            { label: 'Mejoría', nextStepId: 'observacion', variant: 'primary' }
          ]
        },
        'antihistaminico': {
          id: 'antihistaminico',
          question: 'Tratamiento Sintomático',
          description: 'Antihistamínicos orales/IV. Observar progresión.',
          options: [
            { label: 'Finalizar', nextStepId: null, variant: 'secondary' }
          ]
        },
        'observacion': {
          id: 'observacion',
          question: 'Observación',
          description: 'Vigilar por efecto bifásico (4-6 horas mínimo). Corticoides/Antihistamínicos como coadyuvantes.',
          options: [
            { label: 'Finalizar', nextStepId: null, variant: 'secondary' }
          ]
        }
      }
    },
    {
      id: 'asma', nombre: 'Crisis Asmática Grave', icon: Wind, image: asmaImg, initialStep: 'evaluacion', steps: {
        'evaluacion': {
          id: 'evaluacion',
          question: 'Evaluación de Gravedad',
          description: 'Score pulmonar, SatO2, Trabajo respiratorio.',
          options: [
            { label: 'Leve/Moderada', nextStepId: 'salbutamol', variant: 'primary' },
            { label: 'Grave/Fallo inminente', nextStepId: 'grave', variant: 'danger' }
          ]
        },
        'salbutamol': {
          id: 'salbutamol',
          question: 'Salbutamol + Ipratropio',
          description: 'NBZ o MDI con aerocámara. Corticoides sistémicos.',
          options: [
            { label: 'Mejoría', nextStepId: 'alta', variant: 'primary' },
            { label: 'Sin mejoría', nextStepId: 'grave', variant: 'danger' }
          ]
        },
        'grave': {
          id: 'grave',
          question: 'Manejo Crisis Grave',
          description: 'O2 alto flujo. Sulfato de Magnesio IV. Considerar Adrenalina IM/SC.',
          options: [
            { label: 'UCI/Traslado', nextStepId: null, variant: 'danger' }
          ]
        },
        'alta': {
          id: 'alta',
          question: 'Plan de Alta',
          description: 'Beta-2 cada 4-6h, Prednisona 3-5 días, Control en 24h.',
          options: [
            { label: 'Finalizar', nextStepId: null, variant: 'secondary' }
          ]
        }
      }
    },
    {
      id: 'convulsiones', nombre: 'Convulsiones', icon: Zap, initialStep: 'abc', steps: {
        'abc': {
          id: 'abc',
          question: 'Manejo Inicial',
          description: 'ABC, O2, Glucemia. No sujetar. Posición lateral.',
          options: [
            { label: 'Cede < 5 min', nextStepId: 'observacion', variant: 'primary' },
            { label: 'Persiste > 5 min', nextStepId: 'benzodiacepina1', variant: 'danger' }
          ]
        },
        'benzodiacepina1': {
          id: 'benzodiacepina1',
          question: '1ª Línea: Benzodiacepina',
          description: 'Midazolam IM/IV o Diazepam IV/Rectal.',
          options: [
            { label: 'Cede', nextStepId: 'observacion', variant: 'primary' },
            { label: 'Persiste + 5-10 min', nextStepId: 'benzodiacepina2', variant: 'danger' }
          ]
        },
        'benzodiacepina2': {
          id: 'benzodiacepina2',
          question: '2ª Dosis Benzodiacepina',
          description: 'Repetir dosis una vez.',
          options: [
            { label: 'Cede', nextStepId: 'observacion', variant: 'primary' },
            { label: 'Persiste (Estatus)', nextStepId: 'segunda_linea', variant: 'danger' }
          ]
        },
        'segunda_linea': {
          id: 'segunda_linea',
          question: '2ª Línea: Anticonvulsivante',
          description: 'Fenitoína, Fenobarbital o Levetiracetam IV.',
          options: [
            { label: 'UCI', nextStepId: null, variant: 'danger' }
          ]
        },
        'observacion': {
          id: 'observacion',
          question: 'Post-ictal',
          description: 'Vigilar vía aérea y estado neurológico. Buscar causa.',
          options: [
            { label: 'Finalizar', nextStepId: null, variant: 'secondary' }
          ]
        }
      }
    },
    {
      id: 'tce', nombre: 'Traumatismo Craneoencefálico Grave', icon: Activity, initialStep: 'abc', steps: {
        'abc': {
          id: 'abc',
          question: 'Estabilización Inicial',
          description: 'Inmovilización cervical. ABC. Glasgow.',
          options: [
            { label: 'GCS <= 8', nextStepId: 'intubacion', variant: 'danger' },
            { label: 'GCS > 8', nextStepId: 'tac', variant: 'primary' }
          ]
        },
        'intubacion': {
          id: 'intubacion',
          question: 'Protección Vía Aérea',
          description: 'Intubación secuencia rápida. Mantener normocapnia.',
          options: [
            { label: 'Signos de Herniación?', nextStepId: 'herniacion', variant: 'danger' },
            { label: 'Estable', nextStepId: 'tac', variant: 'primary' }
          ]
        },
        'herniacion': {
          id: 'herniacion',
          question: 'Manejo Hipertensión Endocraneana',
          description: 'Manitol o Salino Hipertónico. Hiperventilación leve transitoria.',
          options: [
            { label: 'TAC Urgente', nextStepId: 'tac', variant: 'danger' }
          ]
        },
        'tac': {
          id: 'tac',
          question: 'Neuroimagen y Consulta',
          description: 'TAC cerebral simple. Interconsulta Neurocirugía.',
          options: [
            { label: 'Finalizar', nextStepId: null, variant: 'secondary' }
          ]
        }
      }
    },
    {
      id: 'deshidratacion', nombre: 'Deshidratación Severa / Shock', icon: Activity, image: shockImg, initialStep: 'shock', steps: {
        'shock': {
          id: 'shock',
          question: '¿Signos de Shock?',
          description: 'Taquicardia, pulsos débiles, relleno capilar > 2s, hipotensión (tardío).',
          options: [
            { label: 'Sí (Shock)', nextStepId: 'bolo', variant: 'danger' },
            { label: 'No (Deshidratación)', nextStepId: 'rehidratacion', variant: 'primary' }
          ]
        },
        'bolo': {
          id: 'bolo',
          question: 'Resucitación con Líquidos',
          description: 'Bolo 20 ml/kg Isotónico (SS 0.9% o Ringer) rápido.',
          options: [
            { label: 'Mejora', nextStepId: 'rehidratacion', variant: 'primary' },
            { label: 'No mejora', nextStepId: 'repetir_bolo', variant: 'danger' }
          ]
        },
        'repetir_bolo': {
          id: 'repetir_bolo',
          question: 'Repetir Bolo',
          description: 'Hasta 60 ml/kg total. Considerar inotrópicos si refractario.',
          options: [
            { label: 'UCI', nextStepId: null, variant: 'danger' }
          ]
        },
        'rehidratacion': {
          id: 'rehidratacion',
          question: 'Plan de Rehidratación',
          description: 'Plan B (Oral) o Plan C (IV mantenimiento + déficit).',
          options: [
            { label: 'Finalizar', nextStepId: null, variant: 'secondary' }
          ]
        }
      }
    },
    {
      id: 'acv', nombre: 'Accidente Cerebrovascular (ACV)', icon: Activity, image: acvImg, initialStep: 'sospecha', steps: {
        'sospecha': {
          id: 'sospecha',
          question: 'Sospecha de ACV',
          description: 'Déficit neurológico focal agudo (paresia, afasia, alteración conciencia).',
          options: [
            { label: 'Confirmar Hipoglucemia', nextStepId: 'glucemia', variant: 'primary' },
            { label: 'No es hipoglucemia', nextStepId: 'codigo_ictus', variant: 'danger' }
          ]
        },
        'glucemia': {
          id: 'glucemia',
          question: 'Descartar Hipoglucemia',
          description: 'Si glucemia < 60 mg/dl, corregir y reevaluar.',
          options: [
            { label: 'Síntomas persisten', nextStepId: 'codigo_ictus', variant: 'danger' },
            { label: 'Síntomas resuelven', nextStepId: null, variant: 'secondary' }
          ]
        },
        'codigo_ictus': {
          id: 'codigo_ictus',
          question: 'ACTIVAR CÓDIGO ICTUS',
          description: 'TAC Craneal urgente. Estabilizar ABC. No bajar TA bruscamente.',
          options: [
            { label: 'Hemorrágico', nextStepId: 'neurocirugia', variant: 'danger' },
            { label: 'Isquémico', nextStepId: 'trombolisis', variant: 'danger' }
          ]
        },
        'neurocirugia': {
          id: 'neurocirugia',
          question: 'Interconsulta Neurocirugía',
          description: 'Manejo de hipertensión endocraneana. Valorar drenaje.',
          options: [
            { label: 'Finalizar', nextStepId: null, variant: 'secondary' }
          ]
        },
        'trombolisis': {
          id: 'trombolisis',
          question: 'Valorar Trombólisis',
          description: 'Si < 4.5 horas y sin contraindicaciones. Alteplasa.',
          options: [
            { label: 'Finalizar', nextStepId: null, variant: 'secondary' }
          ]
        }
      }
    },
  ];

  const medicamentosEmergencia = [
    { nombre: 'Adrenalina', dosis: '0.01 mg/kg (máx 0.5 mg) IM', presentacion: 'Ampolla 1mg/1ml', maxDosis: 0.5 },
    { nombre: 'Atropina', dosis: '0.02 mg/kg (mín 0.1mg, máx 0.5mg)', presentacion: 'Ampolla 1mg/1ml', maxDosis: 0.5, minDosis: 0.1 },
    { nombre: 'Bicarbonato', dosis: '1 mEq/kg IV', presentacion: '1 mEq/ml', maxDosis: 50 },
    { nombre: 'Lidocaína', dosis: '1 mg/kg IV', presentacion: 'Ampolla 100mg/5ml', maxDosis: 100 },
    { nombre: 'Midazolam', dosis: '0.1-0.2 mg/kg IM/IV', presentacion: 'Ampolla 5mg/5ml', maxDosis: 10 },
    { nombre: 'Diazepam', dosis: '0.3-0.5 mg/kg Rectal', presentacion: 'Ampolla 10mg/2ml', maxDosis: 10 },
  ];

  const calcularDosis = (medicamento: string, pesoKg: number) => {
    const med = medicamentosEmergencia.find(m => m.nombre === medicamento);
    if (!med) return '0';

    let dosisCalculada = 0;

    switch (medicamento) {
      case 'Adrenalina': dosisCalculada = pesoKg * 0.01; break;
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

  const startAlgorithm = (id: string) => {
    const algo = algoritmos.find(a => a.id === id);
    if (algo) {
      setSelectedAlgoritmo(id);
      setCurrentStepId(algo.initialStep);
      setHistory([]);
      setShowImage(false);
    }
  };

  const handleOptionClick = (nextStepId: string | null) => {
    if (nextStepId) {
      setHistory(prev => [...prev, currentStepId!]);
      setCurrentStepId(nextStepId);
    } else {
      // End of algorithm
      // Could show a summary or reset
    }
  };

  const handleBack = () => {
    if (history.length > 0) {
      const prevStep = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      setCurrentStepId(prevStep);
    } else {
      setSelectedAlgoritmo(null);
      setCurrentStepId(null);
    }
  };

  const renderAlgorithmWizard = () => {
    const algo = algoritmos.find(a => a.id === selectedAlgoritmo);
    if (!algo || !currentStepId) return null;

    const step = algo.steps[currentStepId];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <button
              onClick={handleBack}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg active:scale-95 transition-all text-sm flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              {history.length > 0 ? 'Atrás' : 'Salir'}
            </button>
            {algo.image && (
              <button
                onClick={() => setShowImage(true)}
                className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg active:scale-95 transition-all text-sm flex items-center gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                Ver Diagrama
              </button>
            )}
          </div>
          <h3 className="text-lg font-bold text-red-700 text-right">{algo.nombre}</h3>
        </div>

        {/* Image Modal */}
        <AnimatePresence>
          {showImage && algo.image && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
              onClick={() => setShowImage(false)}
            >
              <div className="relative max-w-full max-h-full">
                <button
                  onClick={() => setShowImage(false)}
                  className="absolute -top-10 right-0 text-white p-2"
                >
                  <X className="w-8 h-8" />
                </button>
                <img
                  src={algo.image}
                  alt="Algoritmo"
                  className="max-w-full max-h-[90vh] rounded-lg object-contain"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white p-6 rounded-2xl border-2 border-red-100 shadow-lg"
          >
            <h4 className="text-2xl font-bold text-gray-800 mb-3">{step.question}</h4>
            {step.description && (
              <p className="text-gray-600 mb-6 text-lg">{step.description}</p>
            )}

            <div className="space-y-3">
              {step.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(option.nextStepId)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all active:scale-98 flex items-center justify-between group
                    ${option.variant === 'danger'
                      ? 'bg-red-50 border-red-200 hover:bg-red-100 text-red-800'
                      : option.variant === 'primary'
                        ? 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-800'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-800'
                    }`}
                >
                  <div>
                    <span className="font-bold text-lg block">{option.label}</span>
                    {option.action && (
                      <span className="text-sm opacity-80 mt-1 block">{option.action}</span>
                    )}
                  </div>
                  <ChevronRight className={`w-6 h-6 opacity-50 group-hover:opacity-100 transition-opacity
                    ${option.variant === 'danger' ? 'text-red-600' : 'text-gray-600'}`} />
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {step.options.every(o => o.nextStepId === null) && (
          <div className="bg-green-50 p-4 rounded-xl border border-green-200 text-green-800 flex items-center gap-3">
            <Check className="w-6 h-6" />
            <p>Fin del algoritmo. Reevaluar al paciente.</p>
          </div>
        )}
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
        <div className="bg-red-600 text-white rounded-2xl p-6 mb-6 shadow-xl">
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={() => navigate('/')}
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
            {!selectedAlgoritmo ? (
              <>
                <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={() => setSection('main')}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl active:scale-95 transition-all"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                  <h2 className="flex-1 text-red-600">Algoritmos de Emergencia</h2>
                </div>
                <div className="space-y-3">
                  {algoritmos.map((algo) => (
                    <button
                      key={algo.id}
                      onClick={() => startAlgorithm(algo.id)}
                      className="w-full p-5 bg-red-50 hover:bg-red-100 rounded-xl border-2 border-red-200 
                               hover:border-red-400 active:scale-98 transition-all flex items-center gap-4"
                    >
                      <algo.icon className="w-8 h-8 text-red-600" />
                      <span className="flex-1 text-left font-medium text-lg">{algo.nombre}</span>
                      <ChevronRight className="w-5 h-5 text-red-400" />
                    </button>
                  ))}
                </div>
              </>
            ) : (
              renderAlgorithmWizard()
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

            <div className="space-y-4">
              {medicamentosEmergencia.map((med) => (
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
                  {peso && parseFloat(peso) > 0 && (
                    <div className="bg-orange-100 p-4 rounded-lg border-2 border-orange-300">
                      <p className="text-orange-900 font-medium">
                        Dosis calculada: <span className="text-xl font-bold">{calcularDosis(med.nombre, parseFloat(peso))} {med.nombre === 'Bicarbonato' ? 'mEq' : 'mg'}</span>
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
