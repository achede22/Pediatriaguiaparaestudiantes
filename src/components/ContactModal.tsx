import { motion, AnimatePresence } from 'motion/react';
import { X, MessageSquare, Bug, Mail, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
    const [type, setType] = useState<'bug' | 'suggestion' | null>(null);

    // URLs de contacto
    const GOOGLE_FORM_BUG = "https://forms.gle/7BLqXuBZewnhse1R7";
    const GOOGLE_FORM_SUGGESTION = "https://forms.gle/sdUy4rzBSJ2aMhUWA";
    const EMAIL = "hernan.david.hd@gmail.com";

    const handleSubmitBug = () => {
        window.open(GOOGLE_FORM_BUG, '_blank');
        onClose();
    };

    const handleSubmitSuggestion = () => {
        window.open(GOOGLE_FORM_SUGGESTION, '_blank');
        onClose();
    };

    const handleEmailContact = () => {
        const subject = type === 'bug' ? 'Reporte de Error - App Pediatría' : 'Sugerencia - App Pediatría';
        window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('Describe aquí tu ' + (type === 'bug' ? 'error' : 'sugerencia') + ':')}`;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 m-auto w-full max-w-md h-fit bg-white rounded-3xl shadow-2xl z-50 overflow-hidden"
                    >
                        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-center">
                            <h2 className="text-xl font-bold">Contáctanos</h2>
                            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6">
                            {!type ? (
                                <div className="space-y-4">
                                    <p className="text-gray-600 text-sm mb-4">
                                        Tu feedback es fundamental para mejorar esta herramienta. Selecciona una opción:
                                    </p>

                                    <button
                                        onClick={() => setType('bug')}
                                        className="w-full p-4 bg-red-50 hover:bg-red-100 border-2 border-red-200 rounded-xl flex items-center gap-4 transition-all group"
                                    >
                                        <div className="p-3 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                                            <Bug className="w-6 h-6 text-red-600" />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-bold text-red-700">Reportar un Error</h3>
                                            <p className="text-sm text-red-600/80">Algo no funciona como debería</p>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => setType('suggestion')}
                                        className="w-full p-4 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-xl flex items-center gap-4 transition-all group"
                                    >
                                        <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                                            <MessageSquare className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-bold text-blue-700">Sugerir Mejora</h3>
                                            <p className="text-sm text-blue-600/80">Ideas para nuevas funciones</p>
                                        </div>
                                    </button>

                                    <div className="pt-4 border-t border-gray-200">
                                        <p className="text-xs text-gray-500 text-center">
                                            Creado por estudiantes de medicina para estudiantes
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <button
                                        onClick={() => setType(null)}
                                        className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                                    >
                                        ← Volver
                                    </button>

                                    <h3 className="font-bold text-gray-800 text-lg">
                                        {type === 'bug' ? 'Reportar Error' : 'Sugerir Mejora'}
                                    </h3>

                                    <p className="text-sm text-gray-600">
                                        Selecciona cómo prefieres contactarnos:
                                    </p>

                                    {/* Opción Principal: Google Forms */}
                                    <button
                                        onClick={type === 'bug' ? handleSubmitBug : handleSubmitSuggestion}
                                        className="w-full py-4 px-5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all flex items-center justify-between gap-3 group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <MessageSquare className="w-5 h-5" />
                                            <div className="text-left">
                                                <div className="font-bold">Formulario Rápido</div>
                                                <div className="text-xs text-blue-100">Preferido - Respuestas organizadas</div>
                                            </div>
                                        </div>
                                        <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>

                                    {/* Opción Alternativa: Email */}
                                    <button
                                        onClick={handleEmailContact}
                                        className="w-full py-3 px-5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all flex items-center justify-between gap-3"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Mail className="w-5 h-5" />
                                            <span>Enviar por Email</span>
                                        </div>
                                        <span className="text-xs text-gray-500">{EMAIL}</span>
                                    </button>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                                        <p className="font-medium mb-1">💡 Tip para reportes efectivos:</p>
                                        <ul className="text-xs space-y-1 text-blue-700">
                                            <li>• Describe qué esperabas que pasara</li>
                                            <li>• Qué pasó en realidad</li>
                                            <li>• En qué sección ocurrió</li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
