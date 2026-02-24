import { useState } from 'react';
import { Activity } from 'lucide-react';

export default function DripRateCalculator() {
    const [volume, setVolume] = useState('');
    const [time, setTime] = useState('');
    const [dripFactor, setDripFactor] = useState<number>(20);

    const vol = parseFloat(volume);
    const min = parseFloat(time);

    const calculateDropsPerMin = () => {
        if (!vol || !min || min <= 0) return 0;
        return Math.round((vol * dripFactor) / min);
    };

    return (
        <div className="mb-6 bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <Activity className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-blue-800 text-lg">Calculadora de Goteo (Velocidad de Infusión)</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">Volumen Total (mL):</label>
                    <input
                        type="number"
                        value={volume}
                        onChange={e => setVolume(e.target.value)}
                        className="w-full p-3 rounded-lg border border-blue-200 focus:outline-none focus:border-blue-400"
                        placeholder="Ej: 500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">Tiempo de Infusión (minutos):</label>
                    <input
                        type="number"
                        value={time}
                        onChange={e => setTime(e.target.value)}
                        className="w-full p-3 rounded-lg border border-blue-200 focus:outline-none focus:border-blue-400"
                        placeholder="Ej: 60"
                    />
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-blue-800 mb-2">Seleccione el Gotero (Factor de Goteo):</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[10, 15, 20, 60].map(factor => (
                        <label key={factor} className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all ${dripFactor === factor ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-800 border-blue-200 hover:bg-blue-100'}`}>
                            <input
                                type="radio"
                                name="dripFactor"
                                value={factor}
                                checked={dripFactor === factor}
                                onChange={() => setDripFactor(factor)}
                                className="hidden"
                            />
                            <span className="font-medium text-sm md:text-base">{factor} gotas/mL</span>
                        </label>
                    ))}
                </div>
            </div>

            {(vol > 0 && min > 0) && (
                <div className="bg-white p-4 rounded-lg border-2 border-green-400 flex flex-col items-center justify-center text-center">
                    <p className="text-gray-500 text-sm mb-1">Velocidad de Infusión</p>
                    <p className="text-3xl font-bold text-green-600">{calculateDropsPerMin()} <span className="text-lg">gotas/min</span></p>
                </div>
            )}
        </div>
    );
}
