import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Beaker, FileText, CheckCircle2, ChevronRight, X, Search } from 'lucide-react';
import RecipeGenerator from './RecipeGenerator';

export interface EnfermedadBase {
    id: string;
    nombre: string;
    sintomas: string[];
    criterios: string[];
    tratamiento: string;
    signosDeAlarma?: string;
    fuente?: string;
}

const enfermedadesData: EnfermedadBase[] = [
    {
        id: 'otitis',
        nombre: 'Otitis Media Aguda',
        sintomas: ['Otalgia', 'Fiebre', 'Irritabilidad'],
        criterios: ['Abombamiento timpánico', 'Eritema timpánico'],
        tratamiento: 'Amoxicilina 80-90 mg/kg/día',
        signosDeAlarma: 'Fiebre persistente tras 48h de antibiótico, letargo, supuración de oído.',
        fuente: 'https://enfamilia.aeped.es/temas-salud/otitis-media-aguda'
    },
    {
        id: 'faringitis',
        nombre: 'Faringoamigdalitis Estreptocócica',
        sintomas: ['Odinofagia', 'Fiebre', 'Ausencia de tos'],
        criterios: ['Exudado amigdalino', 'Adenopatías cervicales'],
        tratamiento: 'Penicilina V o Amoxicilina 50 mg/kg/día',
        signosDeAlarma: 'Dificultad para tragar saliva, dificultad para respirar, limitación apertura bucal.',
        fuente: 'https://enfamilia.aeped.es/temas-salud/faringoamigdalitis'
    },
    {
        id: 'kawasaki',
        nombre: 'Enfermedad de Kawasaki',
        sintomas: ['Fiebre >5d', 'Conjuntivitis', 'Lengua Aframbuesada (Fresa)', 'Labios fisurados', 'Exantema', 'Adenopatía', 'Cambios extremidades'],
        criterios: ['Fiebre persistente + 4/5 criterios clínicos'],
        tratamiento: 'Inmunoglobulina IV + Aspirina (Derivar URGENTE)',
        signosDeAlarma: 'EMERGENCIA (Riesgo aneurismas). Descamación severa, irritabilidad extrema, rechazo vía oral.',
        fuente: 'https://enfamilia.aeped.es/temas-salud/enfermedad-kawasaki'
    },
    {
        id: 'mano_pie_boca',
        nombre: 'Enfermedad Mano-Pie-Boca',
        sintomas: ['Fiebre', 'Vesículas manos/pies', 'Úlceras orales'],
        criterios: ['Clínico'],
        tratamiento: 'Sintomático (Paracetamol o Ibuprofeno), hidratación',
        signosDeAlarma: 'Signos de deshidratación, falta de control cefálico o temblores (sospecha neurológica).',
        fuente: 'https://enfamilia.aeped.es/temas-salud/enfermedad-boca-mano-pie'
    },
    {
        id: 'roseola',
        nombre: 'Exantema Súbito (Roséola / 6ta Enfermedad)',
        sintomas: ['Fiebre alta 3-4 días', 'Exantema al ceder fiebre', 'Niño activo'],
        criterios: ['Clínico', 'VHH-6/VHH-7'],
        tratamiento: 'Sintomático (Antitérmicos)',
        signosDeAlarma: 'Convulsiones febriles (por pico de alta temperatura), decaimiento inusual.',
        fuente: 'https://enfamilia.aeped.es/temas-salud/exantema-subito-roseola-infantil'
    },
    {
        id: 'eritema_infeccioso',
        nombre: 'Eritema Infeccioso (5ta Enfermedad)',
        sintomas: ['Exantema mejillas', 'Patrón reticular', 'Síntomas catarrales'],
        criterios: ['Clínico', 'Parvovirus B19'],
        tratamiento: 'Sintomático',
        signosDeAlarma: 'Palidez extrema (riesgo crisis aplásica), dolor articular severo.',
        fuente: 'https://enfamilia.aeped.es/temas-salud/eritema-infeccioso-quinta-enfermedad'
    },
    {
        id: 'escarlatina',
        nombre: 'Escarlatina',
        sintomas: ['Fiebre', 'Exantema áspero (lija)', 'Lengua Aframbuesada (Fresa)', 'Faringitis'],
        criterios: ['Streptococcus pyogenes', 'Test rápido +'],
        tratamiento: 'Penicilina V o Amoxicilina 50 mg/kg/día por 10 días',
        signosDeAlarma: 'Dificultad respiratoria, decaimiento marcado, orina oscura o escasa.',
        fuente: 'https://enfamilia.aeped.es/temas-salud/escarlatina'
    },
    {
        id: 'crup',
        nombre: 'CRUP',
        sintomas: ['Estridor agudo', 'No tiene tiraje subcostal ni supraclavicular', 'Saturación > 92%', 'Sin alteracion de conciencia'],
        criterios: ['Mayor a 3 meses', 'Estridor agudo sin tiraje'],
        tratamiento: 'Administrar dosis de Dexametasona. Clasificar severidad.',
        signosDeAlarma: 'Aparición de dificultad respiratoria en reposo (tiraje), coloración azul, agitación o decaimiento severo. Consultar en 24h si no mejora.'
    },
    {
        id: 'bronquiolitis',
        nombre: 'BRONQUIOLITIS',
        sintomas: ['Primer episodio sibilante', 'Cuadro gripal de hace 2 o 3 días', 'No tiene tiraje subcostal', 'No tiene respiración rápida', 'Sin apneas', 'Saturación ≥ 92%'],
        criterios: ['Menor de 2 años', 'Mayor de 3 meses', 'Sin antecedente prematuridad (o >6m)'],
        tratamiento: 'Aseo nasal con suero fisiológico cada 3-4h. Aumentar ingesta líquidos y leche materna. Consulta seguimiento 2 días.',
        signosDeAlarma: 'Consultar si deja de comer/beber, respira muy rápido, hunde las costillas, aleteo nasal, y sobre todo si se pone azul (cianosis) o hace pausas al respirar (apneas).'
    },
    {
        id: 'sibilancia',
        nombre: 'SIBILANCIA O SIBILANCIA RECURRENTE',
        sintomas: ['Sibilancias recurrentes a cualquier edad', 'Puede hablar y beber', 'Sin alteracion de conciencia', 'Saturacion > 84%'],
        criterios: ['Mayor de 2 años o cualquier edad (recurrente)', 'Sin criterios de gravedad extremos'],
        tratamiento: 'Esquema Beta-agonista en sala ERA. Si recurrente: 1ra dosis corticosteroide. Reclasificar.',
        signosDeAlarma: 'Si empeora la dificultad, rechaza líquidos, no puede terminar frases o el pecho se hunde demasiado. Consultar de inmediato al hospital.'
    },
    {
        id: 'bronquiolitis_grava',
        nombre: 'BRONQUIOLITIS GRAVE',
        sintomas: ['Primer episodio sibilante', 'Cuadro gripal de hace 2 o 3 días', 'Tiraje subcostal', 'Respiración rápida', 'Apneas', 'Saturación < 92%'],
        criterios: ['Menor de 2 años', 'O menor 3 meses', 'O prematuro menor 6 meses'],
        tratamiento: 'URGENTE HOSPITAL (REFIERA). Oxígeno. Mantener vía oral si tolera.',
        signosDeAlarma: 'Emergencia médica. Riesgo de paro respiratorio inminente. Monitoreo constante.'
    },
    {
        id: 'crup_grave',
        nombre: 'CRUP GRAVE',
        sintomas: ['Estridor agudo', 'Somnoliento, confuso y agitado', 'Tiraje subcostal y/o supraclavicular', 'Saturacion < 92%'],
        criterios: ['Edad menor 3 meses', 'O criterios graves acoplados'],
        tratamiento: 'URGENTE HOSPITAL. Oxígeno, Dexametasona INMEDIATA, Nebulización Adrenalina.',
        signosDeAlarma: 'Emergencia inminente, obstrucción de vía aérea superior. Hospitalizar y observar agresivamente.'
    },
    {
        id: 'sibilancia_grave',
        nombre: 'SIBILANCIA GRAVE (RECURRENTE GRAVE)',
        sintomas: ['Sibilancias recurrentes a cualquier edad', 'Incapaz de hablar o de beber', 'Somnoliento, confuso y agitado', 'Tiraje que no mejora', 'Saturacion < 90% y no mejora'],
        criterios: ['Mayor de 2 años / Recurrente', 'No mejora en sala ERA', 'Sat < 84% al ingreso'],
        tratamiento: 'URGENTE HOSPITAL. Oxígeno, Beta-agonista c/20 min x 3 veces. Corticosteroides IV.',
        signosDeAlarma: 'Emergencia severa. Riesgo de fatiga muscular inminente.'
    }
];

export default function DiseaseMatcher() {
    const [activeSymptoms, setActiveSymptoms] = useState<Set<string>>(new Set());
    const [selectedDiseaseForRecipe, setSelectedDiseaseForRecipe] = useState<EnfermedadBase | null>(null);

    // Extraer todos los síntomas únicos y ordenarlos alfabéticamente
    const todosLosSintomas = useMemo(() => {
        const list = new Set<string>();
        enfermedadesData.forEach(enf => {
            enf.sintomas.forEach(s => list.add(s));
        });
        return Array.from(list).sort((a, b) => a.localeCompare(b));
    }, []);

    const [searchTerm, setSearchTerm] = useState('');

    const filteredSintomas = useMemo(() => {
        if (!searchTerm) return todosLosSintomas;
        const lowerSearch = searchTerm.toLowerCase();
        return todosLosSintomas.filter(s => s.toLowerCase().includes(lowerSearch));
    }, [todosLosSintomas, searchTerm]);

    const toggleSymptom = (symptom: string) => {
        setActiveSymptoms(prev => {
            const next = new Set(prev);
            if (next.has(symptom)) {
                next.delete(symptom);
            } else {
                next.add(symptom);
            }
            return next;
        });
    };

    // Buscar mejor match (Diagnósticos Posibles)
    const matches = useMemo(() => {
        if (activeSymptoms.size === 0) return [];

        const results = enfermedadesData.map(enf => {
            const coinciden = enf.sintomas.filter(s => activeSymptoms.has(s));
            const puntaje = coinciden.length;
            const porcentaje = (puntaje / enf.sintomas.length) * 100;
            return { enf, puntaje, porcentaje, coinciden };
        }).filter(r => r.puntaje > 0);

        // Ordenar de mayor a menor coincidencia
        return results.sort((a, b) => b.porcentaje - a.porcentaje);
    }, [activeSymptoms]);

    return (
        <div className="bg-white rounded-2xl p-6 shadow-xl overflow-hidden">
            <div className="flex items-center gap-4 mb-6">
                <h2 className="flex-1 text-purple-600 font-bold text-xl flex items-center gap-2">
                    <Activity className="w-6 h-6" /> Descarte Interactivo de Enfermedades
                </h2>
            </div>

            <div className="bg-purple-50 p-4 border border-purple-100 rounded-xl mb-6 text-purple-800 text-sm">
                Evalúa a tu paciente marcando los síntomas presentes con los switches. El sistema analizará las coincidencias e indicará los diagnósticos más probables así como las sugerencias de tratamiento.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Lado 1: Lista Alfabética de Síntomas con Switches */}
                <div className="flex flex-col overflow-hidden">
                    <h3 className="font-bold text-gray-700 mb-2 bg-white pt-2 z-10 w-full flex-shrink-0">
                        Lista de Síntomas ({activeSymptoms.size} marcados)
                    </h3>

                    <div className="bg-white z-10 pb-4 border-b mb-4 flex-shrink-0">
                        <div className="relative">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Buscar síntoma..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 overflow-y-auto pr-2 pb-6" style={{ maxHeight: '330vh' }}>
                        {filteredSintomas.map((sintoma, idx) => {
                            const isActive = activeSymptoms.has(sintoma);
                            const baseColor = isActive
                                ? 'border-green-500 bg-green-50 text-green-900 shadow-sm'
                                : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/50';

                            return (
                                <button
                                    key={idx}
                                    onClick={() => toggleSymptom(sintoma)}
                                    className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all active:scale-95 text-left group ${baseColor}`}
                                >
                                    <div className="flex items-center gap-3 pr-4 flex-1">
                                        <span className={`font-bold text-xs w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0 transition-colors ${isActive ? 'bg-green-200 text-green-800' : 'bg-gray-100 text-gray-500 group-hover:bg-green-100 group-hover:text-green-600'}`}>
                                            {idx + 1}
                                        </span>
                                        <span className={`text-sm leading-tight transition-colors ${isActive ? 'font-bold text-green-900' : 'font-medium text-gray-700 group-hover:text-green-800'}`}>
                                            {sintoma}
                                        </span>
                                    </div>

                                    <div className="flex-shrink-0">
                                        {isActive ? (
                                            <CheckCircle2 className="w-6 h-6 text-green-500 drop-shadow-sm" />
                                        ) : (
                                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-green-400 transition-colors" />
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Lado 2: Análisis y Matches */}
                <div className="flex flex-col">
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-700 mb-4 bg-white py-2 border-b">
                            Diagnósticos Sugeridos
                        </h3>

                        {matches.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-48 text-gray-400 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200 mt-4">
                                <Beaker className="w-12 h-12 mb-3 text-gray-300" />
                                <p>Selecciona síntomas a la izquierda para ver los diagnósticos más probables aquí.</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 pb-6 mt-4">
                                <AnimatePresence>
                                    {matches.slice(0, 5).map((match, idx) => (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            key={match.enf.id}
                                            className={`p-4 rounded-xl border-2 shadow-sm mb-4 ${idx === 0 ? 'border-purple-400 bg-purple-50' : 'border-gray-200 bg-white'}`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className={`font-black ${idx === 0 ? 'text-purple-800 text-lg' : 'text-gray-800'}`}>
                                                    {match.enf.nombre}
                                                </h4>
                                                <span className={`px-2 py-1 text-xs font-bold rounded-lg ${idx === 0 ? 'bg-purple-200 text-purple-800' : 'bg-gray-100 text-gray-600'}`}>
                                                    {Math.round(match.porcentaje)}% Match
                                                </span>
                                            </div>

                                            <div className="mb-3">
                                                <p className="text-xs text-green-700 font-bold mb-1">Síntomas presentes descubiertos ({match.puntaje}/{match.enf.sintomas.length}):</p>
                                                <p className="text-xs text-gray-600">{match.coinciden.join(', ')}.</p>
                                            </div>

                                            <div className="bg-white/80 p-3 rounded-lg border border-gray-100 text-sm mb-4">
                                                <p><strong className="text-gray-800">Tratamiento sugerido:</strong></p>
                                                <p className="text-gray-700 mt-1">{match.enf.tratamiento}</p>
                                            </div>

                                            <div className="flex flex-col md:flex-row gap-2 mt-4">
                                                <button
                                                    onClick={() => setSelectedDiseaseForRecipe(match.enf)}
                                                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-900 hover:bg-black text-white rounded-lg font-bold text-sm transition-all shadow-md active:scale-95 group"
                                                >
                                                    <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                    <span className="font-bold whitespace-nowrap">Generar Órdenes Médicas / Recipe</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* Footer / Fuentes Médicas Integradas */}
                        <div className="mt-8 pt-6 border-t border-purple-200 bg-purple-50/50 rounded-xl p-4 mt-auto">
                            <h3 className="font-bold text-purple-700 mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5" /> Fuentes Médicas Recomendadas
                            </h3>
                            <div className="grid grid-cols-1 gap-3">
                                <a href="https://www.aeped.es/documentos/protocolos-urgencias-pediatricas" target="_blank" rel="noopener noreferrer" className="bg-white border border-purple-200 rounded-lg p-3 hover:bg-purple-50 transition-all flex items-start gap-3 shadow-sm group">
                                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600 group-hover:bg-purple-200 transition-colors">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-purple-800 text-sm">Protocolos Urgencias AEPED</h4>
                                        <p className="text-xs text-gray-600 mt-1">Asociación Española de Pediatría. Guías actualizadas de actuación.</p>
                                    </div>
                                </a>
                                <a href="https://www.minsal.cl/ministerio-de-salud-presenta-nueva-guia-clinica-de-infecciones-respiratorias-agudas-bajas-en-menores-de-5-anos/" target="_blank" rel="noopener noreferrer" className="bg-white border border-purple-200 rounded-lg p-3 hover:bg-purple-50 transition-all flex items-start gap-3 shadow-sm group">
                                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600 group-hover:bg-purple-200 transition-colors">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-purple-800 text-sm">Guía Clínica MINSAL (Chile)</h4>
                                        <p className="text-xs text-gray-600 mt-1">Ministerio de Salud. Criterios diagnósticos y escalas locales recomendadas.</p>
                                    </div>
                                </a>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Modal RecipeGenerator */}
                {selectedDiseaseForRecipe && (
                    <RecipeGenerator
                        disease={selectedDiseaseForRecipe}
                        onClose={() => setSelectedDiseaseForRecipe(null)}
                    />
                )}
            </div>
        </div>
    );
}
