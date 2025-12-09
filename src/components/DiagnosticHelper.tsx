import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Activity, Check, X, AlertCircle } from 'lucide-react';

interface DiagnosticHelperProps {
  onGoBack: () => void;
}

type Question = {
  id: string;
  text: string;
  yesNext?: string;
  noNext?: string;
  diagnosis?: string;
  urgency?: 'high' | 'medium' | 'low';
};

const decisionTrees: Record<string, Record<string, Question>> = {
  fiebre: {
    start: {
      id: 'start',
      text: '¿El paciente tiene menos de 3 meses de edad?',
      yesNext: 'q_menor3m',
      noNext: 'q_toxico',
    },
    q_menor3m: {
      id: 'q_menor3m',
      text: '¿Temperatura > 38°C?',
      yesNext: 'd_sepsis_neonatal',
      noNext: 'q_toxico',
    },
    q_toxico: {
      id: 'q_toxico',
      text: '¿Apariencia tóxica? (Irritabilidad, letargia, mala perfusión)',
      yesNext: 'd_sepsis',
      noNext: 'q_foco',
    },
    q_foco: {
      id: 'q_foco',
      text: '¿Tiene foco infeccioso evidente (otitis, faringitis)?',
      yesNext: 'd_infeccion_focal',
      noNext: 'q_duracion',
    },
    q_duracion: {
      id: 'q_duracion',
      text: '¿Fiebre por más de 5 días?',
      yesNext: 'd_kawasaki',
      noNext: 'd_virosis',
    },
    d_sepsis_neonatal: { id: 'd_sepsis_neonatal', text: '', diagnosis: 'Posible Sepsis Neonatal - Derivar Urgente', urgency: 'high' },
    d_sepsis: { id: 'd_sepsis', text: '', diagnosis: 'Posible Sepsis / Infección Bacteriana Grave', urgency: 'high' },
    d_infeccion_focal: { id: 'd_infeccion_focal', text: '', diagnosis: 'Infección Focalizada (Tratar según foco)', urgency: 'medium' },
    d_kawasaki: { id: 'd_kawasaki', text: '', diagnosis: 'Descartar Enf. Kawasaki / Síndrome Inflamatorio', urgency: 'medium' },
    d_virosis: { id: 'd_virosis', text: '', diagnosis: 'Probable Cuadro Viral Autolimitado', urgency: 'low' },
  },
  respiratorio: {
    start: {
      id: 'start',
      text: '¿Presenta estridor inspiratorio?',
      yesNext: 'q_estridor_reposo',
      noNext: 'q_sibilancias',
    },
    q_estridor_reposo: {
      id: 'q_estridor_reposo',
      text: '¿Estridor en reposo?',
      yesNext: 'd_laringitis_grave',
      noNext: 'd_laringitis_leve',
    },
    q_sibilancias: {
      id: 'q_sibilancias',
      text: '¿Presenta sibilancias?',
      yesNext: 'q_primer_episodio',
      noNext: 'q_crepitos',
    },
    q_primer_episodio: {
      id: 'q_primer_episodio',
      text: '¿Es el primer episodio y < 2 años?',
      yesNext: 'd_bronquiolitis',
      noNext: 'd_crisis_asmatica',
    },
    q_crepitos: {
      id: 'q_crepitos',
      text: '¿Presenta crépitos o fiebre alta?',
      yesNext: 'd_neumonia',
      noNext: 'd_ira_alta',
    },
    d_laringitis_grave: { id: 'd_laringitis_grave', text: '', diagnosis: 'Laringitis Obstructiva Grave', urgency: 'high' },
    d_laringitis_leve: { id: 'd_laringitis_leve', text: '', diagnosis: 'Laringitis Leve/Moderada', urgency: 'medium' },
    d_bronquiolitis: { id: 'd_bronquiolitis', text: '', diagnosis: 'Bronquiolitis Aguda', urgency: 'medium' },
    d_crisis_asmatica: { id: 'd_crisis_asmatica', text: '', diagnosis: 'Crisis Asmática / SBO', urgency: 'medium' },
    d_neumonia: { id: 'd_neumonia', text: '', diagnosis: 'Probable Neumonía', urgency: 'medium' },
    d_ira_alta: { id: 'd_ira_alta', text: '', diagnosis: 'Infección Respiratoria Alta', urgency: 'low' },
    // Nuevos diagnósticos respiratorios
    q_inicio_brusco: {
      id: 'q_inicio_brusco',
      text: '¿El inicio fue brusco (atragantamiento)?',
      yesNext: 'd_cuerpo_extrano',
      noNext: 'q_fiebre_alta_toxico',
    },
    d_cuerpo_extrano: { id: 'd_cuerpo_extrano', text: '', diagnosis: 'Sospecha de Cuerpo Extraño (OVACE)', urgency: 'high' },
    q_fiebre_alta_toxico: {
      id: 'q_fiebre_alta_toxico',
      text: '¿Fiebre alta, apariencia tóxica, sialorrea (babeo)?',
      yesNext: 'd_epiglotitis',
      noNext: 'q_tos_perruna',
    },
    d_epiglotitis: { id: 'd_epiglotitis', text: '', diagnosis: 'Sospecha de Epiglotitis - EMERGENCIA', urgency: 'high' },
    q_tos_perruna: {
      id: 'q_tos_perruna',
      text: '¿Tos perruna/metálica predominante?',
      yesNext: 'd_laringitis',
      noNext: 'd_traqueitis',
    },
    d_laringitis: { id: 'd_laringitis', text: '', diagnosis: 'Laringitis Aguda (Crup)', urgency: 'medium' },
    d_traqueitis: { id: 'd_traqueitis', text: '', diagnosis: 'Posible Traqueítis Bacteriana', urgency: 'high' },
  },
};

export function DiagnosticHelper({ onGoBack }: DiagnosticHelperProps) {
  const [selectedTree, setSelectedTree] = useState<string | null>(null);
  const [currentQuestionId, setCurrentQuestionId] = useState<string>('start');
  const [history, setHistory] = useState<string[]>([]);

  const reset = () => {
    setSelectedTree(null);
    setCurrentQuestionId('start');
    setHistory([]);
  };

  const handleAnswer = (answer: 'yes' | 'no') => {
    if (!selectedTree) return;

    const currentQ = decisionTrees[selectedTree][currentQuestionId];
    // Lógica específica para redirigir a nuevas ramas si es necesario
    let nextId = answer === 'yes' ? currentQ.yesNext : currentQ.noNext;

    // Redirección especial para conectar con la nueva rama de estridor si estamos en el nodo start de respiratorio
    if (selectedTree === 'respiratorio' && currentQuestionId === 'start' && answer === 'yes') {
      nextId = 'q_inicio_brusco'; // Saltamos a la nueva lógica detallada
    }

    if (nextId) {
      setHistory([...history, currentQuestionId]);
      setCurrentQuestionId(nextId);
    }
  };

  const handleBackStep = () => {
    if (history.length > 0) {
      const prevId = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setCurrentQuestionId(prevId);
    } else {
      reset();
    }
  };

  const currentQ = selectedTree ? decisionTrees[selectedTree][currentQuestionId] : null;
  const isDiagnosis = currentQ?.diagnosis;

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 p-6"
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-6 shadow-xl mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={history.length > 0 ? handleBackStep : onGoBack}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl active:scale-95 transition-all"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-teal-700 flex-1">
              {selectedTree ? 'Ayudante Diagnóstico' : 'Seleccione Síntoma Principal'}
            </h1>
            <Activity className="w-8 h-8 text-teal-600" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!selectedTree ? (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid gap-4"
            >
              <button
                onClick={() => setSelectedTree('fiebre')}
                className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl border-2 border-transparent hover:border-purple-400 transition-all text-left"
              >
                <h3 className="text-lg font-bold text-purple-700 mb-2">Fiebre sin Foco</h3>
                <p className="text-gray-600">Algoritmo para evaluación de fiebre en lactantes y niños.</p>
              </button>
              <button
                onClick={() => setSelectedTree('respiratorio')}
                className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl border-2 border-transparent hover:border-blue-400 transition-all text-left"
              >
                <h3 className="text-lg font-bold text-blue-700 mb-2">Dificultad Respiratoria</h3>
                <p className="text-gray-600">Evaluación de estridor, sibilancias y dificultad respiratoria.</p>
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={currentQuestionId}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl shadow-2xl p-8"
            >
              {isDiagnosis ? (
                <div className="text-center space-y-6">
                  <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center
                    ${currentQ?.urgency === 'high' ? 'bg-red-100 text-red-600' :
                      currentQ?.urgency === 'medium' ? 'bg-orange-100 text-orange-600' :
                        'bg-green-100 text-green-600'}`}
                  >
                    <AlertCircle className="w-10 h-10" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Diagnóstico Sugerido</h2>
                    <p className="text-xl text-teal-700 font-medium">{currentQ?.diagnosis}</p>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500 mb-3">Para más información clínica detallada:</p>
                    <a
                      href="https://www.aeped.es/protocolos/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium underline"
                    >
                      Ver Protocolos AEPED <Activity className="w-4 h-4" />
                    </a>
                  </div>

                  <button
                    onClick={reset}
                    className="px-8 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all w-full"
                  >
                    Nueva Consulta
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  <h2 className="text-2xl font-medium text-center text-gray-800">
                    {currentQ?.text}
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleAnswer('no')}
                      className="p-6 bg-red-50 hover:bg-red-100 border-2 border-red-200 rounded-2xl flex flex-col items-center gap-2 transition-all"
                    >
                      <X className="w-8 h-8 text-red-500" />
                      <span className="text-lg font-bold text-red-700">NO</span>
                    </button>
                    <button
                      onClick={() => handleAnswer('yes')}
                      className="p-6 bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-2xl flex flex-col items-center gap-2 transition-all"
                    >
                      <Check className="w-8 h-8 text-green-500" />
                      <span className="text-lg font-bold text-green-700">SÍ</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
