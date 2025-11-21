import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Baby, Apple, Syringe, Activity, Heart, Thermometer, Coffee, HeartPulse, Calculator } from 'lucide-react';

interface NoEmergenciaNoMedicoProps {
  onGoBack: () => void;
}

type Section = 'main' | 'cuidado' | 'alimentacion' | 'vacunacion' | 'desarrollo' | 'enfermedades' | 'lavado-nasal' | 'sintomas';

export function NoEmergenciaNoMedico({ onGoBack }: NoEmergenciaNoMedicoProps) {
  const [section, setSection] = useState<Section>('main');
  const [selectedTema, setSelectedTema] = useState<string | null>(null);
  const [cantidadMl, setCantidadMl] = useState('250');

  const calcularLavadoNasal = () => {
    const ml = parseFloat(cantidadMl) || 250;
    const sal = (ml * 0.9 / 100).toFixed(1); // Solución salina 0.9%
    return {
      agua: ml,
      sal: sal,
      bicarbonato: (ml * 0.1 / 100).toFixed(1) // Opcional: bicarbonato 0.1%
    };
  };

  const contenidoEducativo: any = {
    'cuidado': {
      titulo: 'Cuidado Infantil',
      temas: [
        {
          titulo: 'Higiene del bebé',
          contenido: [
            'Baño diario con agua tibia (no caliente)',
            'Limpieza del cordón umbilical con alcohol al 70%',
            'Cambio frecuente de pañales',
            'Limpieza de genitales de adelante hacia atrás',
            'Corte de uñas cuando sea necesario',
          ]
        },
        {
          titulo: 'Sueño seguro',
          contenido: [
            'Siempre boca arriba para dormir',
            'Superficie firme sin almohadas ni peluches',
            'Temperatura ambiente confortable (18-20°C)',
            'Evitar el sobreabrigo',
            'Compartir habitación pero no la cama',
          ]
        },
        {
          titulo: 'Señales de alarma',
          contenido: [
            'Fiebre mayor a 38°C en menores de 3 meses',
            'Rechazo completo del alimento',
            'Llanto inconsolable por más de 2 horas',
            'Somnolencia excesiva o dificultad para despertar',
            'Dificultad respiratoria o labios azulados',
            'Vómitos persistentes o con sangre',
            'Diarrea con sangre o signos de deshidratación',
          ]
        }
      ]
    },
    'alimentacion': {
      titulo: 'Alimentación Infantil',
      temas: [
        {
          titulo: 'Lactancia materna (0-6 meses)',
          contenido: [
            'Exclusiva durante los primeros 6 meses',
            'A demanda, sin horarios fijos',
            'Posición correcta: boca amplia, labios evertidos',
            'Alternar pechos en cada toma',
            'La madre debe tener una dieta balanceada',
            'Hidratación adecuada de la madre',
          ]
        },
        {
          titulo: 'Alimentación complementaria (6+ meses)',
          contenido: [
            'Inicio a los 6 meses, nunca antes de los 4',
            'Texturas progresivas: papillas, trozos pequeños',
            'Un alimento nuevo cada 3-5 días',
            'Evitar sal, azúcar y miel en el primer año',
            'Incluir frutas, verduras, cereales, proteínas',
            'Continuar lactancia materna hasta los 2 años o más',
          ]
        },
        {
          titulo: 'Alimentos a evitar',
          contenido: [
            'Miel (primer año): riesgo de botulismo',
            'Frutos secos enteros: riesgo de aspiración',
            'Alimentos con mucha sal o azúcar',
            'Bebidas azucaradas y gaseosas',
            'Embutidos y alimentos procesados',
          ]
        }
      ]
    },
    'vacunacion': {
      titulo: 'Calendario de Vacunación',
      temas: [
        {
          titulo: 'Vacunas del primer año',
          contenido: [
            'Al nacer: BCG, Hepatitis B',
            '2 meses: Pentavalente, Rotavirus, Neumococo',
            '4 meses: Pentavalente, Rotavirus, Neumococo',
            '6 meses: Pentavalente, Hepatitis B, Influenza',
            '12 meses: SRP (Sarampión, Rubeola, Parotiditis), Neumococo',
          ]
        },
        {
          titulo: 'Importancia de las vacunas',
          contenido: [
            'Previenen enfermedades graves',
            'Protegen a toda la comunidad',
            'Son seguras y efectivas',
            'Pueden producir efectos leves temporales',
            'El riesgo de enfermarse sin vacuna es mucho mayor',
          ]
        },
        {
          titulo: 'Después de vacunar',
          contenido: [
            'Puede haber fiebre leve o dolor en el sitio',
            'Aplicar paños fríos si hay molestia',
            'Dar acetaminofén si hay fiebre',
            'Observar al niño las primeras 24-48 horas',
            'Consultar si hay reacciones graves',
          ]
        }
      ]
    },
    'desarrollo': {
      titulo: 'Desarrollo Infantil',
      temas: [
        {
          titulo: 'Hitos del desarrollo 0-12 meses',
          contenido: [
            '2 meses: Sonríe, sigue objetos con la mirada',
            '4 meses: Se ríe, agarra objetos, sostiene la cabeza',
            '6 meses: Se sienta con apoyo, balbucea',
            '9 meses: Gatea, dice "mamá/papá", se para con apoyo',
            '12 meses: Camina con ayuda, dice 2-3 palabras, señala',
          ]
        },
        {
          titulo: 'Hitos del desarrollo 1-3 años',
          contenido: [
            '18 meses: Camina solo, usa 10-20 palabras, come con cuchara',
            '2 años: Corre, sube escaleras, frases de 2 palabras',
            '3 años: Salta, pedalea triciclo, frases completas',
          ]
        },
        {
          titulo: 'Estimulación temprana',
          contenido: [
            'Hablar mucho con el bebé desde el nacimiento',
            'Juegos de estimulación visual y auditiva',
            'Tiempo boca abajo cuando está despierto',
            'Lectura de cuentos desde pequeños',
            'Juego libre y tiempo de calidad',
            'Evitar pantallas antes de los 2 años',
          ]
        }
      ]
    },
    'enfermedades': {
      titulo: 'Enfermedades Comunes',
      temas: [
        {
          titulo: 'Resfriado común',
          contenido: [
            'Síntomas: Congestión, mocos, tos, fiebre leve',
            'Tratamiento: Hidratación, lavados nasales, reposo',
            'Duración: 7-10 días',
            'Consultar si: fiebre alta persistente, dificultad respiratoria',
          ]
        },
        {
          titulo: 'Diarrea',
          contenido: [
            'Causas: Virus, bacterias, intolerancia alimentaria',
            'Tratamiento: Hidratación oral frecuente',
            'Continuar alimentación normal',
            'Evitar bebidas azucaradas',
            'Consultar si: sangre en heces, signos de deshidratación',
          ]
        },
        {
          titulo: 'Dermatitis del pañal',
          contenido: [
            'Cambio frecuente de pañales',
            'Limpiar suavemente con agua tibia',
            'Dejar secar al aire cuando sea posible',
            'Crema protectora con óxido de zinc',
            'Consultar si no mejora en 3 días',
          ]
        }
      ]
    }
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 p-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-2xl p-6 mb-6 shadow-xl">
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={onGoBack}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-xl active:scale-95 transition-all"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-white">Información de Salud</h1>
              <p className="text-green-100">Portal para Padres y Cuidadores</p>
            </div>
            <Baby className="w-12 h-12" />
          </div>
        </div>

        {section === 'main' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Cuidado infantil */}
            <button
              onClick={() => setSection('cuidado')}
              className="w-full bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl active:scale-98 transition-all
                       border-2 border-blue-200 hover:border-blue-400 flex items-center gap-4"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                <Baby className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-blue-600">Cuidado Infantil</h3>
                <p className="text-gray-600">Higiene, sueño seguro, señales de alarma</p>
              </div>
            </button>

            {/* Alimentación */}
            <button
              onClick={() => setSection('alimentacion')}
              className="w-full bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl active:scale-98 transition-all
                       border-2 border-orange-200 hover:border-orange-400 flex items-center gap-4"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center">
                <Apple className="w-8 h-8 text-orange-600" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-orange-600">Alimentación</h3>
                <p className="text-gray-600">Lactancia, alimentación complementaria</p>
              </div>
            </button>

            {/* Vacunación */}
            <button
              onClick={() => setSection('vacunacion')}
              className="w-full bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl active:scale-98 transition-all
                       border-2 border-purple-200 hover:border-purple-400 flex items-center gap-4"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center">
                <Syringe className="w-8 h-8 text-purple-600" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-purple-600">Vacunación</h3>
                <p className="text-gray-600">Calendario, importancia, efectos</p>
              </div>
            </button>

            {/* Desarrollo infantil */}
            <button
              onClick={() => setSection('desarrollo')}
              className="w-full bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl active:scale-98 transition-all
                       border-2 border-green-200 hover:border-green-400 flex items-center gap-4"
            >
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                <Activity className="w-8 h-8 text-green-600" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-green-600">Desarrollo Infantil</h3>
                <p className="text-gray-600">Hitos del desarrollo, estimulación</p>
              </div>
            </button>

            {/* Enfermedades comunes */}
            <button
              onClick={() => setSection('enfermedades')}
              className="w-full bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl active:scale-98 transition-all
                       border-2 border-red-200 hover:border-red-400 flex items-center gap-4"
            >
              <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center">
                <HeartPulse className="w-8 h-8 text-red-600" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-red-600">Enfermedades Comunes</h3>
                <p className="text-gray-600">Resfriado, diarrea, dermatitis</p>
              </div>
            </button>

            {/* Calculadora de lavado nasal */}
            <button
              onClick={() => setSection('lavado-nasal')}
              className="w-full bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl active:scale-98 transition-all
                       border-2 border-cyan-200 hover:border-cyan-400 flex items-center gap-4"
            >
              <div className="w-16 h-16 bg-cyan-100 rounded-xl flex items-center justify-center">
                <Calculator className="w-8 h-8 text-cyan-600" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-cyan-600">Calculadora de Lavado Nasal</h3>
                <p className="text-gray-600">Preparar solución salina casera</p>
              </div>
            </button>

            {/* Manejo de síntomas */}
            <button
              onClick={() => setSection('sintomas')}
              className="w-full bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl active:scale-98 transition-all
                       border-2 border-yellow-200 hover:border-yellow-400 flex items-center gap-4"
            >
              <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Thermometer className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-yellow-600">Manejo de Síntomas</h3>
                <p className="text-gray-600">Fiebre, tos, dolor de cabeza</p>
              </div>
            </button>
          </motion.div>
        )}

        {/* Secciones educativas */}
        {(section === 'cuidado' || section === 'alimentacion' || section === 'vacunacion' || 
          section === 'desarrollo' || section === 'enfermedades') && (
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setSection('main')}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl active:scale-95 transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="flex-1 text-green-600">{contenidoEducativo[section].titulo}</h2>
            </div>

            <div className="space-y-6">
              {contenidoEducativo[section].temas.map((tema: any, index: number) => (
                <div key={index} className="bg-green-50 p-6 rounded-xl border-2 border-green-200">
                  <h3 className="text-green-700 mb-4">{tema.titulo}</h3>
                  <ul className="space-y-3">
                    {tema.contenido.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full flex-shrink-0 mt-2"></div>
                        <span className="flex-1 text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calculadora de lavado nasal */}
        {section === 'lavado-nasal' && (
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setSection('main')}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl active:scale-95 transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="flex-1 text-cyan-600">Calculadora de Lavado Nasal</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-cyan-50 p-6 rounded-xl border-2 border-cyan-200">
                <h3 className="text-cyan-700 mb-4">¿Para qué sirve?</h3>
                <p className="text-gray-700 mb-4">
                  El lavado nasal con solución salina ayuda a limpiar las fosas nasales de mocos y 
                  facilita la respiración del bebé. Es especialmente útil en resfriados.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
                <label className="block mb-3">Cantidad de agua a preparar (ml):</label>
                <input
                  type="number"
                  value={cantidadMl}
                  onChange={(e) => setCantidadMl(e.target.value)}
                  className="w-full p-4 border-2 border-cyan-300 rounded-xl focus:border-cyan-500 focus:outline-none mb-6"
                />

                <div className="bg-cyan-100 p-6 rounded-xl border-2 border-cyan-300">
                  <h3 className="text-cyan-900 mb-4">Receta de solución salina:</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <span>Agua hervida (tibia)</span>
                      <span className="px-4 py-2 bg-cyan-600 text-white rounded-lg">
                        {calcularLavadoNasal().agua} ml
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <span>Sal (sin yodo)</span>
                      <span className="px-4 py-2 bg-cyan-600 text-white rounded-lg">
                        {calcularLavadoNasal().sal} g
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <span>Bicarbonato (opcional)</span>
                      <span className="px-4 py-2 bg-cyan-600 text-white rounded-lg">
                        {calcularLavadoNasal().bicarbonato} g
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-6 rounded-xl border-2 border-yellow-300">
                <h3 className="text-yellow-900 mb-4">Instrucciones:</h3>
                <ol className="space-y-3">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center">1</span>
                    <span className="flex-1 text-gray-700">Hierva el agua y deje enfriar hasta que esté tibia</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center">2</span>
                    <span className="flex-1 text-gray-700">Agregue la sal y mezcle hasta disolver completamente</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center">3</span>
                    <span className="flex-1 text-gray-700">Puede agregar bicarbonato para que sea menos irritante (opcional)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center">4</span>
                    <span className="flex-1 text-gray-700">Use la solución el mismo día, no la guarde por más de 24 horas</span>
                  </li>
                </ol>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
                <h3 className="text-blue-900 mb-4">Cómo aplicar:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Acueste al bebé de lado</li>
                  <li>• Aplique 2-3 gotas en la fosa nasal superior</li>
                  <li>• Espere unos segundos</li>
                  <li>• Gire al bebé al otro lado y repita</li>
                  <li>• Puede repetir varias veces al día según necesidad</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Manejo de síntomas */}
        {section === 'sintomas' && (
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setSection('main')}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl active:scale-95 transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="flex-1 text-yellow-600">Manejo de Síntomas Comunes</h2>
            </div>

            <div className="space-y-6">
              {/* Fiebre */}
              <div className="bg-red-50 p-6 rounded-xl border-2 border-red-200">
                <h3 className="text-red-600 mb-4">Fiebre</h3>
                <div className="space-y-3 text-gray-700">
                  <p><strong>Medidas generales:</strong></p>
                  <ul className="ml-6 space-y-2">
                    <li>• Ropa ligera, no abrigar en exceso</li>
                    <li>• Ambiente fresco y ventilado</li>
                    <li>• Ofrecer líquidos frecuentemente</li>
                    <li>• Baño con agua tibia (NO fría)</li>
                  </ul>
                  <p className="mt-4"><strong>Medicamentos:</strong></p>
                  <ul className="ml-6 space-y-2">
                    <li>• Paracetamol: cada 4-6 horas si es necesario</li>
                    <li>• Ibuprofeno (mayor de 6 meses): cada 6-8 horas</li>
                    <li>• NO dar aspirina a niños</li>
                  </ul>
                  <div className="mt-4 p-4 bg-red-100 rounded-lg border-2 border-red-300">
                    <p className="text-red-900"><strong>Consultar si:</strong></p>
                    <ul className="ml-6 mt-2 space-y-1 text-red-900">
                      <li>• Menor de 3 meses con fiebre</li>
                      <li>• Fiebre mayor a 40°C</li>
                      <li>• Fiebre por más de 3 días</li>
                      <li>• Convulsiones, rigidez de nuca o alteración de conciencia</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Tos */}
              <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
                <h3 className="text-blue-600 mb-4">Tos</h3>
                <div className="space-y-3 text-gray-700">
                  <p><strong>Medidas generales:</strong></p>
                  <ul className="ml-6 space-y-2">
                    <li>• Mantener al niño bien hidratado</li>
                    <li>• Humidificar el ambiente</li>
                    <li>• Elevar la cabecera de la cama</li>
                    <li>• Evitar irritantes (humo de cigarrillo)</li>
                    <li>• Miel (mayor de 1 año): 1 cucharadita</li>
                  </ul>
                  <div className="mt-4 p-4 bg-blue-100 rounded-lg border-2 border-blue-300">
                    <p className="text-blue-900"><strong>Consultar si:</strong></p>
                    <ul className="ml-6 mt-2 space-y-1 text-blue-900">
                      <li>• Tos con dificultad para respirar</li>
                      <li>• Tos con sangre</li>
                      <li>• Tos que dura más de 2 semanas</li>
                      <li>• Tos con fiebre alta persistente</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Dolor de cabeza */}
              <div className="bg-purple-50 p-6 rounded-xl border-2 border-purple-200">
                <h3 className="text-purple-600 mb-4">Dolor de Cabeza</h3>
                <div className="space-y-3 text-gray-700">
                  <p><strong>Medidas generales:</strong></p>
                  <ul className="ml-6 space-y-2">
                    <li>• Reposo en ambiente tranquilo y oscuro</li>
                    <li>• Aplicar paño frío en la frente</li>
                    <li>• Asegurar buena hidratación</li>
                    <li>• Evitar pantallas</li>
                  </ul>
                  <p className="mt-4"><strong>Medicamentos:</strong></p>
                  <ul className="ml-6 space-y-2">
                    <li>• Paracetamol o Ibuprofeno según peso</li>
                  </ul>
                  <div className="mt-4 p-4 bg-purple-100 rounded-lg border-2 border-purple-300">
                    <p className="text-purple-900"><strong>Consultar si:</strong></p>
                    <ul className="ml-6 mt-2 space-y-1 text-purple-900">
                      <li>• Dolor severo o repentino ("el peor dolor de su vida")</li>
                      <li>• Con fiebre, rigidez de cuello o vómitos</li>
                      <li>• Alteración de conciencia o visión</li>
                      <li>• Después de golpe en la cabeza</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
