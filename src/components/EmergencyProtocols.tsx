import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Activity, Pill, AlertTriangle } from 'lucide-react';

export default function EmergencyProtocols() {
    const [pesoInput, setPesoInput] = useState<string>('15');

    const peso = useMemo(() => {
        const p = parseFloat(pesoInput);
        return isNaN(p) || p <= 0 ? 0 : p;
    }, [pesoInput]);

    const formatNumber = (num: number) => {
        return Number.isInteger(num) ? num.toString() : num.toFixed(2);
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-red-600 to-rose-700 p-6 sm:p-8 text-white sticky top-0 z-20 shadow-md">
                <h2 className="text-2xl font-black mb-2 shadow-sm">Protocolos de Urgencia y Bolos</h2>
                <p className="opacity-90 text-sm mb-6 max-w-2xl font-medium">Reanimación dirigida y manejo de crisis respiratorias o hemodinámicas graves. Cálculos exactos para bombas de infusión.</p>

                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-sm">
                    <label className="font-bold text-lg whitespace-nowrap min-w-max flex items-center gap-2">
                        <Activity className="w-5 h-5 text-red-200" />
                        Peso Paciente:
                    </label>
                    <div className="relative w-full sm:w-64">
                        <input
                            type="number"
                            value={pesoInput}
                            onChange={(e) => setPesoInput(e.target.value)}
                            className="w-full bg-white text-red-900 font-black text-2xl py-3 pl-4 pr-12 rounded-lg focus:outline-none focus:ring-4 focus:ring-red-300 transition-all shadow-inner font-mono text-right"
                            placeholder="0.0"
                            step="0.1"
                            min="0"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 select-none">kg</span>
                    </div>
                    {peso > 0 && peso < 3 && (
                        <span className="text-xs bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full font-bold animate-pulse flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Neonatal / Lactante
                        </span>
                    )}
                </div>
            </div>

            <div className="p-6">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

                    {/* Salbutamol EV Bloque */}
                    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-200 p-6 shadow-sm">
                        <h3 className="font-black text-red-800 text-xl border-b border-red-200 pb-3 mb-4 flex items-center gap-2">
                            <Activity className="w-6 h-6 text-red-500" /> Salbutamol Endovenoso (Asma Grave - UCI)
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl p-5 shadow-sm border border-red-100">
                                <h4 className="font-bold text-red-700 text-sm tracking-widest uppercase mb-3 border-b pb-2">1. Bolo de Carga Directa</h4>
                                <p className="text-sm text-gray-600 mb-4">Dosis: 10-15 mcg/kg en solución 0.9%. Ampolla base de 0.5mg/mL (500 mcg/mL).</p>
                                <div className="bg-red-50 p-3 rounded-lg flex justify-between items-center text-sm mb-2">
                                    <span className="font-semibold text-gray-700">Ampolla a extraer:</span>
                                    <span className="font-black text-red-600 font-mono text-lg">{peso > 0 ? formatNumber((peso * 10) / 500) : '-'} mL</span>
                                </div>
                                <div className="bg-blue-50 p-3 rounded-lg flex justify-between items-center text-sm">
                                    <span className="font-semibold text-gray-700">Solución Salina Normal (SSN):</span>
                                    <span className="font-black text-blue-600 font-mono text-lg">{peso > 0 ? formatNumber(10 - ((peso * 10) / 500)) : '-'} mL</span>
                                </div>
                                <p className="text-xs text-center text-gray-500 mt-2 italic">Aforar mezcla total a 10cc</p>
                            </div>

                            <div className="bg-white rounded-xl p-5 shadow-sm border border-red-100">
                                <h4 className="font-bold text-red-700 text-sm tracking-widest uppercase mb-3 border-b pb-2">2. Infusión Continua (Bomba)</h4>
                                <p className="text-sm text-gray-600 mb-4">Dosis inicial recomendada: 0.3 mcg/kg/min (Max: 2 mcg/kg/min titular). Velocidad fijada a 10ml/hr.</p>
                                {peso > 0 ? (
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                                            <span className="text-gray-600">Extraer Ampolla de Salbutamol EV:</span>
                                            <span className="font-bold text-gray-900">{formatNumber((peso * 0.5 * 60 * 0.3) / 500)} mL</span>
                                        </div>
                                        <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                                            <span className="text-gray-600">Añadir SSN 0.9%:</span>
                                            <span className="font-bold text-gray-900">{formatNumber((10 * 9.6) / (200 / (0.5 * 1000)))} mL</span>
                                        </div>
                                        <div className="bg-orange-50 rounded-lg p-3 text-center border border-orange-100 mt-2">
                                            <span className="block text-xs uppercase tracking-wider text-orange-600 font-bold mb-1">Velocidad Bomba de Infusión</span>
                                            <span className="text-2xl font-black text-orange-800 font-mono">10 ml/hra</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-gray-400 text-sm">Ingrese peso en la cabecera..</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sulfato de Magnesio */}
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-200 p-6 shadow-sm">
                        <h3 className="font-black text-emerald-800 text-xl border-b border-emerald-200 pb-3 mb-4 flex items-center gap-2">
                            <Pill className="w-6 h-6 text-emerald-500" /> Sulfato de Magnesio (Broncoespasmo Grave Pediátrico)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-600 mb-2">Composición: Ampolla estándar 10mL al 20% (es decir, 2g/10cc).</p>
                                <p className="text-sm text-gray-600 mb-4">Dosis típica sugerida: 40 mg/kg a pasar en 20 minutos por BIC. (Restricción máxima 2g).</p>
                            </div>
                            {peso > 0 ? (
                                <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-4 space-y-4">
                                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                        <span className="text-sm font-semibold text-gray-600">Masa total de fármaco (mg):</span>
                                        <span className="font-black text-gray-800 font-mono text-lg">{formatNumber(Math.min(peso * 40, 2000))} mg</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-semibold text-gray-600">Dosis volumétrica base:</span>
                                        <span className="font-black text-emerald-600 font-mono text-xl">{formatNumber((Math.min(peso * 40, 2000) * 10) / 2000)} mL</span>
                                    </div>
                                    <p className="text-xs text-center text-gray-500 italic mt-2">Extraer el volumen y forzar a dilución para infusión de 20 min.</p>
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-6 text-center text-sm text-gray-400">
                                    Calculadora inactiva sin peso.
                                </div>
                            )}
                        </div>
                    </div>

                </motion.div>
            </div>
        </div>
    );
}
