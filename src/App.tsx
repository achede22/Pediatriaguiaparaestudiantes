import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { EmergenciaMedico } from './components/EmergenciaMedico';
import { EmergenciaNoMedico } from './components/EmergenciaNoMedico';
import { NoEmergenciaMedico } from './components/NoEmergenciaMedico';
import { NoEmergenciaNoMedico } from './components/NoEmergenciaNoMedico';
import { Switch } from './components/ui/switch';

type Screen = 'home' | 'emergencia-medico' | 'emergencia-no-medico' | 'no-emergencia-medico' | 'no-emergencia-no-medico';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [isMedico, setIsMedico] = useState(false);
  const [isEmergencia, setIsEmergencia] = useState(false);

  const handleContinuar = () => {
    if (isMedico && isEmergencia) {
      setCurrentScreen('emergencia-medico');
    } else if (isMedico && !isEmergencia) {
      setCurrentScreen('no-emergencia-medico');
    } else if (!isMedico && isEmergencia) {
      setCurrentScreen('emergencia-no-medico');
    } else {
      setCurrentScreen('no-emergencia-no-medico');
    }
  };

  const handleGoBack = () => {
    setCurrentScreen('home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden">
      <AnimatePresence mode="wait">
        {currentScreen === 'home' ? (
          <motion.div
            key="home"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="min-h-screen flex flex-col items-center justify-center p-6"
          >
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 md:p-12">
              <h1 className="text-center text-blue-600 mb-12">
                PediatrIA
              </h1>
              
              <div className="space-y-8 mb-12">
                {/* Switch 1: ¿Eres médico? */}
                <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200 transition-all hover:border-blue-400">
                  <div className="flex items-center justify-between gap-6">
                    <label htmlFor="medico-switch" className="cursor-pointer flex-1">
                      <span className="block mb-2 text-gray-600">Selecciona tu perfil:</span>
                      <span className="block">¿Eres médico?</span>
                    </label>
                    <div className="flex items-center gap-4">
                      <span className={`${isMedico ? 'text-gray-400' : 'text-green-600'}`}>
                        NO
                      </span>
                      <Switch
                        id="medico-switch"
                        checked={isMedico}
                        onCheckedChange={setIsMedico}
                        className="scale-150 data-[state=checked]:bg-blue-600"
                      />
                      <span className={`${isMedico ? 'text-green-600' : 'text-gray-400'}`}>
                        SÍ
                      </span>
                    </div>
                  </div>
                </div>

                {/* Switch 2: ¿Es emergencia? */}
                <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-200 transition-all hover:border-red-400">
                  <div className="flex items-center justify-between gap-6">
                    <label htmlFor="emergencia-switch" className="cursor-pointer flex-1">
                      <span className="block mb-2 text-gray-600">Tipo de situación:</span>
                      <span className="block">¿Es una emergencia?</span>
                    </label>
                    <div className="flex items-center gap-4">
                      <span className={`${isEmergencia ? 'text-gray-400' : 'text-green-600'}`}>
                        NO
                      </span>
                      <Switch
                        id="emergencia-switch"
                        checked={isEmergencia}
                        onCheckedChange={setIsEmergencia}
                        className="scale-150 data-[state=checked]:bg-red-600"
                      />
                      <span className={`${isEmergencia ? 'text-red-600' : 'text-gray-400'}`}>
                        SÍ
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón Continuar */}
              <button
                onClick={handleContinuar}
                className="w-full py-6 px-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl 
                         shadow-lg hover:shadow-xl active:scale-95 transition-all duration-150
                         hover:from-blue-700 hover:to-blue-800"
              >
                Continuar
              </button>
            </div>
          </motion.div>
        ) : currentScreen === 'emergencia-medico' ? (
          <EmergenciaMedico key="emergencia-medico" onGoBack={handleGoBack} />
        ) : currentScreen === 'emergencia-no-medico' ? (
          <EmergenciaNoMedico key="emergencia-no-medico" onGoBack={handleGoBack} />
        ) : currentScreen === 'no-emergencia-medico' ? (
          <NoEmergenciaMedico key="no-emergencia-medico" onGoBack={handleGoBack} />
        ) : (
          <NoEmergenciaNoMedico key="no-emergencia-no-medico" onGoBack={handleGoBack} />
        )}
      </AnimatePresence>
    </div>
  );
}
