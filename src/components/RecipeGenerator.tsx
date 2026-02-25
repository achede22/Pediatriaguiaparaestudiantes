import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Printer, X, Download, Share2, FileText, Phone, Activity } from 'lucide-react';
import { EnfermedadBase } from './DiseaseMatcher';

interface RecipeGeneratorProps {
    disease: EnfermedadBase;
    onClose: () => void;
}

export default function RecipeGenerator({ disease, onClose }: RecipeGeneratorProps) {
    const [generarPara, setGenerarPara] = useState<'paciente' | 'enfermeria'>('paciente');

    // Datos del form
    const [patientData, setPatientData] = useState({
        nombre: '',
        id: '',
        edad: '',
        sexo: 'Masculino',
        padre: '',
        madre: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setPatientData({ ...patientData, [e.target.name]: e.target.value });
    };

    const todayStr = new Date().toLocaleDateString('es-ES', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    // Funcioón para generar .docx (HTML Export)
    // Utilizamos el estándar de Blob "application/msword"
    const exportToDocx = () => {
        const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
            "xmlns:w='urn:schemas-microsoft-com:office:word' " +
            "xmlns='http://www.w3.org/TR/REC-html40'>" +
            "<head><meta charset='utf-8'><title>Orden Médica</title></head><body>";
        const footer = "</body></html>";

        const sourceHTML = header + document.getElementById("enfermeria-doc-content")?.innerHTML + footer;
        const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
        const fileDownload = document.createElement("a");

        document.body.appendChild(fileDownload);
        fileDownload.href = source;
        fileDownload.download = `Orden_Enfermeria_${patientData.nombre.replace(/ /g, '_')}.doc`;
        fileDownload.click();
        document.body.removeChild(fileDownload);
    };

    const handlePrint = () => {
        window.print();
    };

    // Plantilla oculta para PDF / Impresión
    return (
        <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm flex justify-center p-4 sm:p-6 overflow-y-auto print:bg-white print:p-0">

            {/* ===== CONTENEDOR MODO PANTALLA (No Imprimible) ===== */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl relative flex flex-col my-auto max-h-min print:hidden"
            >
                <div className="flex justify-between items-center p-5 border-b bg-gray-50 rounded-t-2xl">
                    <h2 className="font-black text-xl flex items-center gap-2">
                        <FileText className="w-6 h-6 text-blue-600" /> Generador de Órdenes y Recipes
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-5 overflow-y-auto">
                    {/* Fila de Datos del Paciente */}
                    <div className="bg-blue-50/50 p-4 border border-blue-100 rounded-xl mb-6 shadow-inner">
                        <h3 className="font-bold text-blue-800 mb-3 text-sm">Datos del Paciente</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <input type="text" name="nombre" placeholder="Nombre completo" value={patientData.nombre} onChange={handleChange} className="p-2 border rounded-lg focus:ring-2 ring-blue-500 outline-none w-full text-sm" />
                            <input type="text" name="id" placeholder="ID / Documento" value={patientData.id} onChange={handleChange} className="p-2 border rounded-lg focus:ring-2 ring-blue-500 outline-none w-full text-sm" />
                            <input type="text" name="edad" placeholder="Edad (ej: 5 años)" value={patientData.edad} onChange={handleChange} className="p-2 border rounded-lg focus:ring-2 ring-blue-500 outline-none w-full text-sm" />

                            <select name="sexo" value={patientData.sexo} onChange={handleChange} className="p-2 border rounded-lg focus:ring-2 ring-blue-500 outline-none w-full text-sm bg-white">
                                <option>Masculino</option>
                                <option>Femenino</option>
                            </select>
                            <input type="text" name="madre" placeholder="Nombre de la Madre" value={patientData.madre} onChange={handleChange} className="p-2 border rounded-lg focus:ring-2 ring-blue-500 outline-none w-full text-sm" />
                            <input type="text" name="padre" placeholder="Nombre del Padre" value={patientData.padre} onChange={handleChange} className="p-2 border rounded-lg focus:ring-2 ring-blue-500 outline-none w-full text-sm" />
                        </div>
                    </div>

                    {/* Opciones de tipo de documento */}
                    <div className="flex gap-4 mb-6">
                        <button
                            onClick={() => setGenerarPara('paciente')}
                            className={`flex-1 py-4 px-6 rounded-xl border-2 font-bold flex items-center justify-center gap-3 transition-all ${generarPara === 'paciente' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-md' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            <Printer className="w-5 h-5" />
                            Para el Paciente (Recipe)
                            <span className="block text-xs font-normal opacity-80 w-full text-center hidden md:inline">Carta A4 Mitades.</span>
                        </button>
                        <button
                            onClick={() => setGenerarPara('enfermeria')}
                            className={`flex-1 py-4 px-6 rounded-xl border-2 font-bold flex items-center justify-center gap-3 transition-all ${generarPara === 'enfermeria' ? 'bg-teal-50 border-teal-500 text-teal-700 shadow-md' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            <Activity className="w-5 h-5" />
                            Para Enfermería (Docs)
                            <span className="block text-xs font-normal opacity-80 w-full text-center hidden md:inline">Formato Clínico Word.</span>
                        </button>
                    </div>

                    <div className="border border-dashed border-gray-300 rounded-xl p-4 sm:p-8 bg-gray-50 flex flex-col items-center text-center justify-center mb-6">
                        <h4 className="font-bold text-gray-700 mb-2">
                            Se generará documento para: <span className="text-black uppercase">{disease.nombre}</span>
                        </h4>
                        <p className="text-sm text-gray-500 max-w-lg mb-6">
                            El {generarPara === 'paciente' ? 'Recipe' : 'Documento Médico'} constará del tratamiento predeterminado: <b>{disease.tratamiento}</b>, sumado a los signos de alarma específicos y próxima cita.
                        </p>

                        <div className="flex gap-4 flex-wrap justify-center">
                            {generarPara === 'paciente' ? (
                                <button onClick={handlePrint} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg active:scale-95 transition-all flex items-center gap-2">
                                    <Printer className="w-5 h-5" /> Imprimir Hoja (Divide en 2)
                                </button>
                            ) : (
                                <>
                                    <button onClick={exportToDocx} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg active:scale-95 transition-all flex items-center gap-2">
                                        <Download className="w-5 h-5" /> Descargar .DOCX (Word)
                                    </button>
                                    <button onClick={() => alert("Copie el texto descargando el doc o imprima a PDF y envíe por WhatsApp")} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg active:scale-95 transition-all flex items-center gap-2">
                                        <Share2 className="w-5 h-5" /> Compartir Whatsapp
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ===== PLANTILLAS IMPRIMIBLES (Ocultas en pantalla, Visibles al Imprimir) ===== */}

            {generarPara === 'paciente' && (
                <div className="hidden print:block w-[210mm] min-h-[297mm] mx-auto bg-white p-[10mm]">
                    {/* Parte 1: Original */}
                    <div className="h-[130mm] border-2 border-dashed border-gray-300 rounded-2xl p-6 relative">
                        <div className="text-center font-bold text-lg border-b pb-2 mb-4">
                            RÉCIPE E INDICACIONES MÉDICAS
                        </div>

                        <div className="flex justify-between text-sm mb-4">
                            <div>
                                <p><strong>Paciente:</strong> {patientData.nombre || '__________________'}</p>
                                <p><strong>Edad:</strong> {patientData.edad || '______'} - <strong>Sexo:</strong> {patientData.sexo || '______'}</p>
                            </div>
                            <div className="text-right">
                                <p><strong>Fecha:</strong> {todayStr}</p>
                                <p><strong>ID:</strong> {patientData.id || '__________________'}</p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h3 className="font-bold underline uppercase text-sm mb-1">Diagnóstico(s):</h3>
                            <p className="text-sm font-semibold pl-2">{disease.nombre}</p>
                        </div>

                        <div className="mb-4">
                            <h3 className="font-bold underline uppercase text-sm mb-1">Tratamiento e Indicaciones:</h3>
                            <ul className="text-sm pl-6 list-disc">
                                {disease.tratamiento.split('. ').map((item, idx) => (
                                    <li key={idx} className="mb-1">{item}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="mb-4 bg-gray-100 p-2 rounded border border-gray-300">
                            <h3 className="font-bold underline uppercase text-sm mb-1 text-red-700">⚠️ Signos de Alarma (Regresar urgente al hospital):</h3>
                            <p className="text-sm italic pl-2">{disease.signosDeAlarma || "Dificultad severa para respirar, inactividad atípica, cianosis (color azulado)."}</p>
                            <p className="text-sm italic pl-2 mt-2 font-bold text-red-600">• Consultar dentro de 48 horas de ser persistente.</p>
                        </div>

                        <div className="absolute bottom-4 left-0 w-full text-center text-xs text-gray-400">
                            *Documento válido por farmacia institucional.
                        </div>
                    </div>

                    {/* Linea de corte */}
                    <div className="text-center my-[10mm] text-gray-400 text-xs tracking-[1em]">
                        ✄ - - - - CORTAR AQUÍ - - - - ✄
                    </div>

                    {/* Parte 2: Duplicado (Mismo contenido) */}
                    <div className="h-[130mm] border-2 border-dashed border-gray-300 rounded-2xl p-6 relative">
                        <div className="text-center font-bold text-lg border-b pb-2 mb-4">
                            RÉCIPE E INDICACIONES MÉDICAS <span className="text-gray-400 font-normal text-sm ml-2">(DUPLICADO)</span>
                        </div>

                        <div className="flex justify-between text-sm mb-4">
                            <div>
                                <p><strong>Paciente:</strong> {patientData.nombre || '__________________'}</p>
                                <p><strong>Edad:</strong> {patientData.edad || '______'} - <strong>Sexo:</strong> {patientData.sexo || '______'}</p>
                            </div>
                            <div className="text-right">
                                <p><strong>Fecha:</strong> {todayStr}</p>
                                <p><strong>ID:</strong> {patientData.id || '__________________'}</p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h3 className="font-bold underline uppercase text-sm mb-1">Diagnóstico(s):</h3>
                            <p className="text-sm font-semibold pl-2">{disease.nombre}</p>
                        </div>

                        <div className="mb-4">
                            <h3 className="font-bold underline uppercase text-sm mb-1">Tratamiento e Indicaciones:</h3>
                            <ul className="text-sm pl-6 list-disc">
                                {disease.tratamiento.split('. ').map((item, idx) => (
                                    <li key={idx} className="mb-1">{item}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="mb-4 bg-gray-100 p-2 rounded border border-gray-300">
                            <h3 className="font-bold underline uppercase text-sm mb-1 text-red-700">⚠️ Signos de Alarma (Regresar urgente al hospital):</h3>
                            <p className="text-sm italic pl-2">{disease.signosDeAlarma || "Dificultad severa para respirar, inactividad atípica, cianosis (color azulado)."}</p>
                            <p className="text-sm italic pl-2 mt-2 font-bold text-red-600">• Consultar dentro de 48 horas de ser persistente.</p>
                        </div>

                        <div className="absolute bottom-4 left-0 w-full text-center text-xs text-gray-400">
                            *Duplicado referencial clínico.
                        </div>
                    </div>

                </div>
            )}

            {/* ===== CONTENEDOR EXPORTABLE WORD (Enfermeria) ===== */}
            <div id="enfermeria-doc-content" className="hidden">
                <h1 style={{ textAlign: "center", textDecoration: "underline", color: "#333" }}>ORDEN MÉDICA (SALA DE ENFERMERÍA / URGENCIAS)</h1>
                <br />
                <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ccc" }} border={1} cellPadding={5}>
                    <tbody>
                        <tr style={{ backgroundColor: "#eee" }}>
                            <td colSpan={2}><strong>DATOS DEL PACIENTE</strong></td>
                        </tr>
                        <tr>
                            <td style={{ width: "50%" }}><strong>Nombre:</strong> {patientData.nombre}</td>
                            <td style={{ width: "50%" }}><strong>Fecha:</strong> {todayStr}</td>
                        </tr>
                        <tr>
                            <td><strong>Edad:</strong> {patientData.edad}</td>
                            <td><strong>ID / Documento:</strong> {patientData.id}</td>
                        </tr>
                        <tr>
                            <td><strong>Sexo:</strong> {patientData.sexo}</td>
                            <td></td>
                        </tr>
                        <tr style={{ backgroundColor: "#eee" }}>
                            <td colSpan={2}><strong>DATOS DEL ACUDIENTE</strong></td>
                        </tr>
                        <tr>
                            <td><strong>Madre:</strong> {patientData.madre}</td>
                            <td><strong>Padre:</strong> {patientData.padre}</td>
                        </tr>
                    </tbody>
                </table>

                <br /><br />
                <h2><strong>Diagnóstico Admitido:</strong></h2>
                <p style={{ fontSize: "14pt", color: "blue" }}><b>{disease.nombre}</b></p>

                <h2><strong>Plan e Indicaciones Intrahospitalarias:</strong></h2>
                <ul>
                    {disease.tratamiento.split('. ').map((item, idx) => (
                        item ? <li key={idx}>{item}</li> : null
                    ))}
                </ul>

                <h2><strong>Observaciones (Signos de Alarma a monitorear por enfermería):</strong></h2>
                <p style={{ color: "red" }}><i>{disease.signosDeAlarma}</i></p>

                <br /><br />
                <p style={{ textAlign: "center" }}>_________________________________________</p>
                <p style={{ textAlign: "center" }}>Sello y Firma del Médico Tratante</p>
            </div>

        </div>
    );
}
