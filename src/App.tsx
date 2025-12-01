import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Stethoscope, Activity, MessageSquare } from 'lucide-react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Emergency from './pages/Emergency';
import NonEmergency from './pages/NonEmergency';
import { DiagnosticHelper } from './components/DiagnosticHelper';
import { ContactModal } from './components/ContactModal';

function Home() {
  const navigate = useNavigate();
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="min-h-screen flex flex-col p-6"
    >
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full justify-center">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            PediatrIA
          </h1>
          <p className="text-gray-500 text-lg">Guía para Estudiantes</p>
        </div>

        <div className="grid gap-4">
          {/* Emergencia */}
          <button
            onClick={() => navigate('/emergency')}
            className="group relative overflow-hidden bg-red-100 text-gray-900 p-6 rounded-3xl shadow-lg hover:shadow-red-500/20 transition-all active:scale-98 border-2 border-red-200 hover:border-red-300"
          >
            <div className="relative flex items-center gap-4">
              <div className="p-3 bg-white/60 rounded-2xl backdrop-blur-sm text-red-600">
                <Heart className="w-8 h-8" />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-bold text-gray-900">Emergencia</h2>
                <p className="text-gray-700 text-sm font-medium">Algoritmos y Dosis Críticas</p>
              </div>
            </div>
          </button>

          {/* Consulta General */}
          <button
            onClick={() => navigate('/non-emergency')}
            className="group relative overflow-hidden bg-blue-100 text-gray-900 p-6 rounded-3xl shadow-lg hover:shadow-blue-500/20 transition-all active:scale-98 border-2 border-blue-200 hover:border-blue-300"
          >
            <div className="relative flex items-center gap-4">
              <div className="p-3 bg-white/60 text-blue-600 rounded-2xl backdrop-blur-sm">
                <Stethoscope className="w-8 h-8" />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-bold text-gray-900">Consulta General</h2>
                <p className="text-gray-700 text-sm font-medium">Herramientas y Guías</p>
              </div>
            </div>
          </button>

          {/* Ayudante Diagnóstico */}
          <button
            onClick={() => navigate('/diagnostic')}
            className="group relative overflow-hidden bg-indigo-100 text-gray-900 p-6 rounded-3xl shadow-lg hover:shadow-indigo-500/20 transition-all active:scale-98 border-2 border-indigo-200 hover:border-indigo-300"
          >
            <div className="relative flex items-center gap-4">
              <div className="p-3 bg-white/60 rounded-2xl backdrop-blur-sm text-indigo-600">
                <Activity className="w-8 h-8" />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-bold text-gray-900">Ayudante Diagnóstico</h2>
                <p className="text-gray-700 text-sm font-medium">Sistema de Decisiones Clínicas</p>
              </div>
            </div>
          </button>

          {/* Contacto */}
          <button
            onClick={() => setIsContactOpen(true)}
            className="mt-4 flex items-center justify-center gap-2 text-gray-400 hover:text-gray-600 transition-colors py-4"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Sugerencias y Reportes</span>
          </button>
        </div>
      </div>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </motion.div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden font-sans">
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/non-emergency" element={<NonEmergency />} />
          <Route path="/diagnostic" element={<DiagnosticHelper onGoBack={() => window.history.back()} />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}
