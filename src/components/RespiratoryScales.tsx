import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Activity, Stethoscope, AlertTriangle, Wind, Info, CheckCircle2 } from 'lucide-react';

type ScaleType = 'westley' | 'tal';

interface Option {
    label: string;
    points: number;
}

interface Category {
    id: string;
    title: string;
    options: Option[];
}

const westleyScale: Category[] = [
    {
        id: 'estridor',
        title: 'Estridor',
        options: [
            { label: 'Ausente', points: 0 },
            { label: 'Audible con estetoscopio / agitación', points: 1 },
            { label: 'Audible a distancia / reposo', points: 2 },
        ]
    },
    {
        id: 'retracciones',
        title: 'Retracciones',
        options: [
            { label: 'Ninguna', points: 0 },
            { label: 'Leve (solo supraesternal)', points: 1 },
            { label: 'Moderada (intercostal + supraesternal)', points: 2 },
            { label: 'Severa (supra + inter + subcostal + aleteo)', points: 3 },
        ]
    },
    {
        id: 'entradaAire',
        title: 'Entrada de Aire',
        options: [
            { label: 'Normal', points: 0 },
            { label: 'Disminuida', points: 1 },
            { label: 'Muy disminuida / silencio torácico', points: 2 },
        ]
    },
    {
        id: 'cianosis',
        title: 'Cianosis',
        options: [
            { label: 'Ausente', points: 0 },
            { label: 'Con agitación', points: 4 },
            { label: 'En reposo', points: 5 },
        ]
    },
    {
        id: 'conciencia',
        title: 'Nivel de Conciencia',
        options: [
            { label: 'Normal', points: 0 },
            { label: 'Alterado (letargia, confusión)', points: 5 },
        ]
    },
];

const talScaleUnder6m: Category[] = [
    {
        id: 'fr',
        title: 'Frecuencia Respiratoria (Menor de 6 meses)',
        options: [
            { label: 'Menos de 40 rpm', points: 0 },
            { label: '41 - 55 rpm', points: 1 },
            { label: '56 - 70 rpm', points: 2 },
            { label: 'Mayor de 70 rpm', points: 3 },
        ]
    },
];

const talScaleOver6m: Category[] = [
    {
        id: 'fr',
        title: 'Frecuencia Respiratoria (Mayor de 6 meses)',
        options: [
            { label: 'Menos de 30 rpm', points: 0 },
            { label: '31 - 45 rpm', points: 1 },
            { label: '46 - 60 rpm', points: 2 },
            { label: 'Mayor de 60 rpm', points: 3 },
        ]
    },
];

const talScaleCommon: Category[] = [
    {
        id: 'sibilancias',
        title: 'Sibilancias',
        options: [
            { label: 'Ausentes', points: 0 },
            { label: 'Terminales / solo con estetoscopio', points: 1 },
            { label: 'Toda espiración (audible con fonendo)', points: 2 },
            { label: 'Inspiración + espiración audibles sin estetoscopio', points: 3 },
        ]
    },
    {
        id: 'retracciones',
        title: 'Trabajo Respiratorio / Retracciones',
        options: [
            { label: 'Ausente', points: 0 },
            { label: '+ (leve, aleteo nasal)', points: 1 },
            { label: '++ (intercostal)', points: 2 },
            { label: '+++ (supra/subcostal + paradójico)', points: 3 },
        ]
    },
    {
        id: 'satO2',
        title: 'Saturación O₂ (aire ambiente)',
        options: [
            { label: '95% o más', points: 0 },
            { label: '90 – 94%', points: 1 },
            { label: '< 90%', points: 2 }, // o 3 según algunos protocolos, usaremos 3 para gravedad máxima
            { label: '< 90% (requiere O₂ para sat ≥ 92%)', points: 3 },
        ]
    },
];

export default function RespiratoryScales() {
    const [activeScale, setActiveScale] = useState<ScaleType>('westley');

    // Westley State
    const [westleyAge, setWestleyAge] = useState<'under3m' | 'over3m'>('over3m');
    const [westleySelections, setWestleySelections] = useState<Record<string, number>>({
        estridor: 0,
        retracciones: 0,
        entradaAire: 0,
        cianosis: 0,
        conciencia: 0,
    });

    // TAL State
    const [talAge, setTalAge] = useState<'under2y' | 'over2y'>('under2y');
    const [talFrAge, setTalFrAge] = useState<'under6m' | 'over6m'>('under6m');
    const [talSelections, setTalSelections] = useState<Record<string, number>>({
        fr: 0,
        sibilancias: 0,
        retracciones: 0,
        satO2: 0,
    });

    const handleWestleyChange = (categoryId: string, points: number) => {
        setWestleySelections(prev => ({ ...prev, [categoryId]: points }));
    };

    const handleTalChange = (categoryId: string, points: number) => {
        setTalSelections(prev => ({ ...prev, [categoryId]: points }));
    };

    const calculateWestleyScore = () => {
        return Object.values(westleySelections).reduce((a, b) => a + b, 0);
    };

    const getWestleySeverityAndTreatment = (score: number) => {
        // Override por riesgo alto anatómico (CRUP)
        if (westleyAge === 'under3m') {
            return {
                severity: 'Grave (Por Edad < 3 meses)',
                color: 'bg-red-100 text-red-800 border-red-300',
                dx: 'Crup (Riesgo Alto por Edad)',
                tx: [
                    'URGENTE HOSPITAL. Menores de 3 meses tienen alto riesgo de obstrucción rápida.',
                    'Oxígeno para mantener SatO2 > 92-94%.',
                    'Dexametasona INMEDIATA.',
                    'Nebulización con Adrenalina según indicación.',
                    'Hospitalizar y observar agresivamente.'
                ]
            };
        }

        if (score <= 2) {
            return {
                severity: 'Leve',
                color: 'bg-green-100 text-green-800 border-green-300',
                dx: 'Crup Leve',
                tx: [
                    'Manejo ambulatorio en la mayoría de los casos.',
                    'Dexametasona 0.15 - 0.6 mg/kg VO/IM (dosis única). Máx 16 mg.',
                    'Medidas generales, enseñar signos de alarma.',
                ]
            };
        } else if (score >= 3 && score <= 7) {
            return {
                severity: 'Moderado',
                color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
                dx: 'Crup Moderado',
                tx: [
                    'Observación en urgencias / hospitalización abreviada.',
                    'Dexametasona 0.6 mg/kg VO/IM o Budesonida NBZ 2 mg.',
                    'Adrenalina racémica o Adrenalina L (ampolla 1mg/1ml) NBZ: 0.5 mg/kg (máx 5 mg) aforado en 3-5 cc SSN.',
                    'Reevaluar en 2 horas.'
                ]
            };
        } else {
            return {
                severity: 'Grave / Severo',
                color: 'bg-red-100 text-red-800 border-red-300',
                dx: 'Crup Grave',
                tx: [
                    'Hospitalización probable / UCI.',
                    'Oxígeno para mantener SatO2 > 92-94%.',
                    'Adrenalina NBZ INMEDIATA (0.5 mg/kg, máx 5 mg).',
                    'Dexametasona 0.6 mg/kg IM/IV o Budesonida NBZ.',
                    'Monitorización cardiopulmonar. Considerar vía aérea avanzada.'
                ]
            };
        }
    };

    const calculateTalScore = () => {
        return Object.values(talSelections).reduce((a, b) => a + b, 0);
    };

    const getTalSeverityAndTreatment = (score: number) => {
        if (score < 5) {
            return {
                severity: 'Obstrucción Leve',
                color: 'bg-green-100 text-green-800 border-green-300',
                tx: [
                    'Salbutamol 2 puff con aerocámara cada 4 - 6 horas por 5 - 7 días.',
                    'Control en SAPU / CESFAM en 24-48hrs.',
                    'Educar a los padres sobre técnica inhalatoria y signos de alarma.',
                ]
            };
        } else if (score >= 5 && score <= 8) {
            return {
                severity: 'Obstrucción Moderada',
                color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
                tx: [
                    'Manejo en Sala ERA / Hospital abreviado (1-2 horas).',
                    'Salbutamol 2 puff con aerocámara cada 10 min por 5 dosis (1 hora).',
                    'Evaluar corticoides sistémicos: Prednisona 1 - 2 mg/kg/día VO (máx 40-60mg).',
                    'Reevaluar con score TAL post-terapia: Si < 5 alta, si ≥ 5 continuar hospitalizado.'
                ]
            };
        } else {
            return {
                severity: 'Obstrucción Severa',
                color: 'bg-red-100 text-red-800 border-red-300',
                tx: [
                    'Oxigenoterapia para mantener SatO2 ≥ 93%.',
                    'Hospitalización / Derivación a urgencia de mayor complejidad.',
                    'Salbutamol NBZ continuo o esquema de crisis + Ipratropio.',
                    'Corticoides sistémicos: Hidrocortisona o Metilprednisolona IV.',
                    'Considerar Sulfato de Magnesio IV según respuesta.',
                ]
            };
        }
    };

    const renderCategory = (cat: Category, selectedValue: number, onChange: (id: string, val: number) => void) => (
        <div key={cat.id} className="mb-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3">{cat.title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                {cat.options.map((opt, idx) => {
                    const isSelected = selectedValue === opt.points;
                    return (
                        <button
                            key={idx}
                            onClick={() => onChange(cat.id, opt.points)}
                            className={`p-3 rounded-lg text-sm text-left transition-all relative overflow-hidden border-2 ${isSelected
                                ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-sm'
                                : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-blue-200 hover:bg-gray-100'
                                }`}
                        >
                            <div className="flex justify-between items-start gap-2">
                                <span className="font-medium leading-tight">{opt.label}</span>
                                {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />}
                            </div>
                            <span className={`block mt-2 text-xs font-bold ${isSelected ? 'text-blue-700' : 'text-gray-400'}`}>
                                {opt.points} {opt.points === 1 ? 'pto' : 'ptos'}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );

    const westleyTotal = calculateWestleyScore();
    const westleyResult = getWestleySeverityAndTreatment(westleyTotal);

    const talTotal = calculateTalScore();
    const talResult = getTalSeverityAndTreatment(talTotal);

    return (
        <div className="space-y-6">
            <div className="flex gap-2 p-1 bg-gray-100 rounded-xl overflow-x-auto">
                <button
                    onClick={() => setActiveScale('westley')}
                    className={`flex-1 min-w-[150px] py-3 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeScale === 'westley'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Activity className="w-5 h-5" />
                    Escala Westley (Crup)
                </button>
                <button
                    onClick={() => setActiveScale('tal')}
                    className={`flex-1 min-w-[150px] py-3 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeScale === 'tal'
                        ? 'bg-white text-purple-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Stethoscope className="w-5 h-5" />
                    Escala TAL (Asma/BO)
                </button>
            </div>

            <motion.div
                key={activeScale}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {activeScale === 'westley' && (
                    <div>
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-blue-800 text-sm flex gap-3 items-start">
                            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <div className="w-full">
                                <p className="mb-3">
                                    <strong>Objetivo:</strong> Evaluar la gravedad del Crup (Laringotraqueobronquitis).<br />
                                    <strong>Signo Cardinal:</strong> Estridor inspiratorio (afectación de vía aérea superior).
                                </p>
                                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-100 shadow-sm mt-3">
                                    <span className="font-bold whitespace-nowrap">Edad del paciente:</span>
                                    <select
                                        value={westleyAge}
                                        onChange={(e) => setWestleyAge(e.target.value as any)}
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                    >
                                        <option value="under3m">Menor de 3 meses (CRUP Grave Inmediato)</option>
                                        <option value="over3m">Mayor de 3 meses (CRUP Moderado/Leve inicialmente)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {westleyScale.map(cat => renderCategory(cat, westleySelections[cat.id], handleWestleyChange))}
                        </div>

                        <div className={`mt-6 p-6 rounded-2xl border-2 ${westleyResult.color} transition-all`}>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-black">Puntaje Total: {westleyTotal}/17</h3>
                                <span className="px-3 py-1 bg-white/50 rounded-lg font-bold shadow-sm backdrop-blur-sm">
                                    {westleyResult.severity}
                                </span>
                            </div>

                            <div className="bg-white/60 p-4 rounded-xl mb-4">
                                <p className="font-bold flex items-center gap-2 mb-2">
                                    <AlertTriangle className="w-5 h-5" />
                                    Diagnóstico: {westleyResult.dx}
                                </p>
                                <h4 className="font-semibold mt-4 mb-2 text-sm uppercase opacity-80">Tratamiento Recomendado:</h4>
                                <ul className="list-disc pl-5 space-y-1 text-sm font-medium">
                                    {westleyResult.tx.map((item, idx) => (
                                        <li key={idx} className="leading-tight">{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {activeScale === 'tal' && (
                    <div>
                        <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 mb-6 text-purple-800 text-sm flex gap-3 items-start">
                            <Wind className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                            <div className="w-full">
                                <p className="mb-3">
                                    <strong>Objetivo:</strong> Cuantificar gravedad de obstrucción respiratoria inferior (Sibilancias, Asma, Bronquiolitis).
                                </p>

                                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-100 shadow-sm mt-3">
                                    <span className="font-bold whitespace-nowrap">Edad del paciente para diagnóstico:</span>
                                    <select
                                        value={talAge}
                                        onChange={(e) => setTalAge(e.target.value as any)}
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                                    >
                                        <option value="under2y">Menor de 2 años (Bronquiolitis, 1er ep.)</option>
                                        <option value="over2y">2 años o más (Asma / Sibilancia recurrente)</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-100 shadow-sm mt-3">
                                    <span className="font-bold whitespace-nowrap">Edad para FR en escala:</span>
                                    <select
                                        value={talFrAge}
                                        onChange={(e) => {
                                            setTalFrAge(e.target.value as any);
                                            setTalSelections(prev => ({ ...prev, fr: 0 })); // Reset FR score on change
                                        }}
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                                    >
                                        <option value="under6m">Menor de 6 meses</option>
                                        <option value="over6m">Mayor de 6 meses</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {talFrAge === 'under6m'
                                ? talScaleUnder6m.map(cat => renderCategory(cat, talSelections[cat.id], handleTalChange))
                                : talScaleOver6m.map(cat => renderCategory(cat, talSelections[cat.id], handleTalChange))
                            }
                            {talScaleCommon.map(cat => renderCategory(cat, talSelections[cat.id], handleTalChange))}
                        </div>

                        <div className={`mt-6 p-6 rounded-2xl border-2 ${talResult.color} transition-all`}>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-black">Puntaje Total: {talTotal}/12</h3>
                                <span className="px-3 py-1 bg-white/50 rounded-lg font-bold shadow-sm backdrop-blur-sm">
                                    {talResult.severity}
                                </span>
                            </div>

                            <div className="bg-white/60 p-4 rounded-xl mb-4">
                                <p className="font-bold flex items-center gap-2 mb-2">
                                    <AlertTriangle className="w-5 h-5" />
                                    Gravedad Obtenida: {talResult.severity}
                                </p>
                                <h4 className="font-semibold mt-4 mb-2 text-sm uppercase opacity-80">Tratamiento Recomendado (Protocolo MINSAL):</h4>
                                <ul className="list-disc pl-5 space-y-1 text-sm font-medium">
                                    {talResult.tx.map((item, idx) => (
                                        <li key={idx} className="leading-tight">{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
