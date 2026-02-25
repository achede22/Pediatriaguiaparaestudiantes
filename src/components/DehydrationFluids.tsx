import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Droplet, Activity, AlertTriangle } from 'lucide-react';

export default function DehydrationFluids() {
    const [pesoInput, setPesoInput] = useState<string>('10');

    const peso = useMemo(() => {
        const p = parseFloat(pesoInput);
        return isNaN(p) || p <= 0 ? 0 : p;
    }, [pesoInput]);

    const formatNumber = (num: number) => {
        return Number.isInteger(num) ? num.toString() : num.toFixed(1);
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-teal-600 to-cyan-700 p-6 sm:p-8 text-white sticky top-0 z-20 shadow-md">
                <h2 className="text-2xl font-black mb-2 shadow-sm">Protocolo de Deshidratación y Líquidos</h2>
                <p className="opacity-90 text-sm mb-6 max-w-2xl font-medium">Cálculos rápidos para la fase de expansión de líquidos (Bolos de Cristaloides SSN o Lactato de Ringer) pediátricos.</p>

                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-sm">
                    <label className="font-bold text-lg whitespace-nowrap min-w-max flex items-center gap-2">
                        <Activity className="w-5 h-5 text-teal-200" />
                        Peso Paciente:
                    </label>
                    <div className="relative w-full sm:w-64">
                        <input
                            type="number"
                            value={pesoInput}
                            onChange={(e) => setPesoInput(e.target.value)}
                            className="w-full bg-white text-teal-900 font-black text-2xl py-3 pl-4 pr-12 rounded-lg focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all shadow-inner font-mono text-right"
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
                    <div className="bg-teal-50 rounded-2xl border border-teal-200 p-6 shadow-sm">
                        <h3 className="font-black text-teal-800 text-xl border-b border-teal-200 pb-3 mb-4 flex items-center gap-2">
                            <Droplet className="w-6 h-6 text-teal-500" /> Plan de Rehidratación Intravenosa Rápida
                        </h3>
                        <p className="text-sm text-teal-700 mb-6 font-medium">Bolo de Cristaloides (Solución Salina Normal 0.9% o Lactato de Ringer).</p>

                        <div className="bg-white rounded-xl p-6 border border-teal-100 shadow-sm">
                            {peso > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-center">
                                        <div className="bg-teal-50/50 p-4 rounded-xl border border-teal-100">
                                            <span className="block text-xs font-bold text-teal-600 uppercase mb-1">Deshidratación Leve/Moderada</span>
                                            <span className="text-lg font-black text-teal-800">10 mL/kg</span>
                                        </div>
                                        <div className="bg-teal-50 p-4 rounded-xl border-2 border-teal-400 shadow-sm relative">
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">ESTANDAR (Shock compensado)</div>
                                            <span className="block text-xs font-bold text-teal-700 uppercase mb-1">Dosis Media</span>
                                            <span className="text-xl font-black text-teal-900">20 mL/kg</span>
                                        </div>
                                        <div className="bg-teal-50/50 p-4 rounded-xl border border-teal-100">
                                            <span className="block text-xs font-bold text-teal-600 uppercase mb-1">Shock Descompensado severo</span>
                                            <span className="text-lg font-black text-teal-800">30 mL/kg</span>
                                        </div>
                                    </div>

                                    <div className="bg-gray-900 text-white p-6 rounded-xl relative overflow-hidden">
                                        <div className="absolute right-0 top-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl"></div>
                                        <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                                            <div>
                                                <h4 className="text-teal-400 font-bold text-sm tracking-widest uppercase mb-1">Bolo a administrar (Media - 20)</h4>
                                                <p className="text-gray-300 text-sm">A pasar lo más rápido posible (10-20 minutos).</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-4xl font-black text-white font-mono">{formatNumber(peso * 20)}</span>
                                                <span className="text-teal-300 ml-2 font-bold text-lg">mL / cc</span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-12 text-gray-400">
                                    <p className="text-lg font-bold mb-2">Calculadora Inactiva</p>
                                    <p className="text-sm">Por favor ingresa un peso superior a 0kg en la barra superior.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
