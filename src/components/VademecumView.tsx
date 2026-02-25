import React, { useState, useMemo } from 'react';
import { Search, Activity, Pill, AlertTriangle, ChevronDown } from 'lucide-react';

interface PresentacionMedicamento {
    tipo: string; // Ej: 'Jarabe 150mg/5mL', 'Gotas 100mg/mL'
    concentracion: string; // Para mostrar
    calculo?: (peso: number) => number | string; // Devuelve CC, mL o Gotas
    unidadResultado?: string; // Ej: 'mL', 'Gotas'
}

interface MedicamentoPediadosisV2 {
    nombre: string;
    dosis: string;
    frecuencia: string;
    observaciones?: string;
    presentaciones: PresentacionMedicamento[];
}

interface CategoriaVademecumV2 {
    categoria: string;
    medicamentos: MedicamentoPediadosisV2[];
}

// Base de datos COMPLETA basada en PEDIADOSIS (Oscar Jaime Velásquez Gaviria)
// Transcripción fiel del Excel original + presentaciones con cálculos dinámicos
const vademecumDataV2: CategoriaVademecumV2[] = [
    {
        categoria: "ANALGÉSICOS Y ANTIPIRÉTICOS",
        medicamentos: [
            {
                nombre: "ACETAMINOFÉN (Paracetamol)",
                dosis: "15 mg/Kg/dosis",
                frecuencia: "C/ 4 - 6 H",
                observaciones: "Máximo 75-90 mg/kg/día para evitar hepatotoxicidad.",
                presentaciones: [
                    { tipo: "Gotas", concentracion: "100 mg / 1 mL", calculo: (p) => Math.round((15 * p) / 100 * 20), unidadResultado: "Gotas" },
                    { tipo: "Jarabe", concentracion: "150 mg / 5 mL", calculo: (p) => ((15 * p) / 150) * 5, unidadResultado: "mL" },
                    { tipo: "Jarabe Forte", concentracion: "250 mg / 5 mL", calculo: (p) => ((15 * p) / 250) * 5, unidadResultado: "mL" }
                ]
            },
            {
                nombre: "DICLOFENACO",
                dosis: "1 mg/Kg/dosis",
                frecuencia: "C/ 12 H",
                presentaciones: [
                    { tipo: "Suspensión", concentracion: "90 mg / 5 mL", calculo: (p) => ((1 * p) / 90) * 5, unidadResultado: "mL" },
                    { tipo: "Ampolla", concentracion: "75 mg / 3 mL", calculo: (p) => ((1 * p) / 75) * 3, unidadResultado: "mL (IM)" },
                    { tipo: "Grageas", concentracion: "50 mg", calculo: (p) => (1 * p) / 50, unidadResultado: "Grageas" }
                ]
            },
            {
                nombre: "DIPIRONA",
                dosis: "20 mg/Kg/dosis",
                frecuencia: "C/ 8 H",
                observaciones: "Vigilar riesgo de agranulocitosis. Vía EV: administración lenta.",
                presentaciones: [
                    { tipo: "Jarabe", concentracion: "250 mg / 5 mL", calculo: (p) => ((20 * p) / 250) * 5, unidadResultado: "mL" },
                    { tipo: "Ampolla", concentracion: "2 g / 5 mL", calculo: (p) => ((20 * p) / 2000) * 5, unidadResultado: "mL (EV lento)" },
                    { tipo: "Tableta", concentracion: "500 mg", calculo: (p) => (20 * p) / 500, unidadResultado: "Tab" }
                ]
            },
            {
                nombre: "HIOSCINA",
                dosis: "10 mg/Kg/dosis",
                frecuencia: "C/ 8 H",
                presentaciones: [
                    { tipo: "Ampolla", concentracion: "20 mg / 1 mL", calculo: (p) => ((10 * p) / 20) * 1, unidadResultado: "mL (EV)" },
                    { tipo: "Grageas", concentracion: "10 mg", calculo: (p) => (10 * p) / 10, unidadResultado: "Grageas" }
                ]
            },
            {
                nombre: "IBUPROFENO",
                dosis: "10 mg/Kg/dosis",
                frecuencia: "C/ 8 H",
                presentaciones: [
                    { tipo: "Suspensión", concentracion: "100 mg / 5 mL", calculo: (p) => ((10 * p) / 100) * 5, unidadResultado: "mL" },
                    { tipo: "Suspensión Forte", concentracion: "200 mg / 5 mL", calculo: (p) => ((10 * p) / 200) * 5, unidadResultado: "mL" },
                    { tipo: "Grageas", concentracion: "200 - 400 mg", calculo: (p) => (10 * p) / 200, unidadResultado: "Grageas (200mg)" }
                ]
            },
            {
                nombre: "MORFINA",
                dosis: "0.1 mg/Kg/dosis",
                frecuencia: "Bolo IV",
                observaciones: "Solo uso hospitalario. Monitoreo de depresión respiratoria obligatorio.",
                presentaciones: [
                    { tipo: "Ampolla", concentracion: "10 mg / 1 mL", calculo: (p) => ((0.1 * p) / 10) * 1, unidadResultado: "mL (EV)" }
                ]
            },
            {
                nombre: "NAPROXENO",
                dosis: "20 mg/Kg/día",
                frecuencia: "C/ 8 - 12 H",
                presentaciones: [
                    { tipo: "Suspensión", concentracion: "125 mg / 5 mL", calculo: (p) => (((20 * p) / 3) / 125) * 5, unidadResultado: "mL (C/8H)" },
                    { tipo: "Tableta", concentracion: "275 mg", calculo: (p) => (20 * p) / 275, unidadResultado: "Tab/día" }
                ]
            },
            {
                nombre: "TRAMADOL",
                dosis: "1 mg/Kg/dosis",
                frecuencia: "C/ 6 - 8 H",
                observaciones: "No recomendado en menores de 12 años sin supervisión estricta.",
                presentaciones: [
                    { tipo: "Gotas", concentracion: "100 mg / 40 gotas", calculo: (p) => Math.round((1 * p) / 100 * 40), unidadResultado: "Gotas" },
                    { tipo: "Ampolla", concentracion: "50 mg / 1 mL", calculo: (p) => ((1 * p) / 50) * 1, unidadResultado: "mL (EV/IM)" }
                ]
            }
        ]
    },
    {
        categoria: "ANTIBIÓTICOS",
        medicamentos: [
            {
                nombre: "ÁCIDO NALIDÍXICO",
                dosis: "55 mg/Kg/día",
                frecuencia: "C/ 8 H",
                presentaciones: [
                    { tipo: "Suspensión", concentracion: "250 mg / 5 mL", calculo: (p) => (((55 * p) / 3) / 250) * 5, unidadResultado: "mL (C/8H)" }
                ]
            },
            {
                nombre: "AMIKACINA",
                dosis: "15 mg/Kg/día",
                frecuencia: "C/ 8 - 12 H",
                presentaciones: [
                    { tipo: "Ampolla 100mg", concentracion: "100 mg / 2 mL", calculo: (p) => ((15 * p) / 100) * 2, unidadResultado: "mL (EV)" },
                    { tipo: "Ampolla 500mg", concentracion: "500 mg / 2 mL", calculo: (p) => ((15 * p) / 500) * 2, unidadResultado: "mL (EV)" }
                ]
            },
            {
                nombre: "AMOXICILINA",
                dosis: "80 mg/Kg/día",
                frecuencia: "C/ 8 H x 10 días",
                presentaciones: [
                    { tipo: "Suspensión", concentracion: "250 mg / 5 mL", calculo: (p) => (((80 * p) / 3) / 250) * 5, unidadResultado: "mL (C/8H)" },
                    { tipo: "Suspensión Forte", concentracion: "500 mg / 5 mL", calculo: (p) => (((80 * p) / 2) / 500) * 5, unidadResultado: "mL (C/12H)" }
                ]
            },
            {
                nombre: "AMPICILINA",
                dosis: "100 mg/Kg/día",
                frecuencia: "C/ 8 H",
                presentaciones: [
                    { tipo: "Ampolla", concentracion: "500 mg - 1 g", calculo: (p) => (100 * p) / 3, unidadResultado: "mg (C/8H)" },
                    { tipo: "Jarabe", concentracion: "250 mg / 5 mL", calculo: (p) => (((100 * p) / 3) / 250) * 5, unidadResultado: "mL (C/8H)" }
                ]
            },
            {
                nombre: "AMPICILINA / SULBACTAM",
                dosis: "50 mg/Kg/día",
                frecuencia: "C/ 6 - 12 H",
                presentaciones: [
                    { tipo: "Suspensión", concentracion: "250 mg / 5 mL", calculo: (p) => (((50 * p) / 3) / 250) * 5, unidadResultado: "mL (C/8H)" },
                    { tipo: "Ampolla", concentracion: "750 mg - 1.5 g - 3 g", calculo: (p) => (50 * p) / 4, unidadResultado: "mg (C/6H)" }
                ]
            },
            {
                nombre: "AZITROMICINA",
                dosis: "10 mg/Kg/día",
                frecuencia: "C/ Día x 3 días",
                presentaciones: [
                    { tipo: "Suspensión", concentracion: "200 mg / 5 mL", calculo: (p) => ((10 * p) / 200) * 5, unidadResultado: "mL/Día" },
                    { tipo: "Tableta", concentracion: "500 mg", calculo: (p) => (10 * p) / 500, unidadResultado: "Tab/Día" }
                ]
            },
            {
                nombre: "CEFALOTINA",
                dosis: "150 mg/Kg/día",
                frecuencia: "C/ 4 - 6 H",
                presentaciones: [
                    { tipo: "Ampolla", concentracion: "1 g / 10 mL", calculo: (p) => ((150 * p) / 4) / 100, unidadResultado: "mL (C/6H, EV)" }
                ]
            },
            {
                nombre: "CEFALEXINA",
                dosis: "30 mg/Kg/día",
                frecuencia: "C/ 6 H",
                presentaciones: [
                    { tipo: "Suspensión", concentracion: "250 mg / 5 mL", calculo: (p) => (((30 * p) / 4) / 250) * 5, unidadResultado: "mL (C/6H)" },
                    { tipo: "Tableta", concentracion: "500 mg", calculo: (p) => (30 * p) / 4 / 500, unidadResultado: "Tab (C/6H)" }
                ]
            },
            {
                nombre: "CEFAZOLINA",
                dosis: "50 mg/Kg/día",
                frecuencia: "C/ 8 H",
                presentaciones: [
                    { tipo: "Ampolla", concentracion: "500 mg - 1 g", calculo: (p) => (50 * p) / 3, unidadResultado: "mg (C/8H, EV)" }
                ]
            },
            {
                nombre: "CEFTRIAXONA",
                dosis: "50 mg/Kg/día",
                frecuencia: "C/ 12 - 24 H",
                presentaciones: [
                    { tipo: "Ampolla", concentracion: "250 - 500 mg - 1 g", calculo: (p) => 50 * p, unidadResultado: "mg/Día (EV/IM)" }
                ]
            },
            {
                nombre: "CIPROFLOXACINA",
                dosis: "20 mg/Kg/día",
                frecuencia: "C/ 12 H",
                presentaciones: [
                    { tipo: "Suspensión", concentracion: "250 mg / 5 mL", calculo: (p) => (((20 * p) / 2) / 250) * 5, unidadResultado: "mL (C/12H)" },
                    { tipo: "Tableta", concentracion: "500 mg", calculo: (p) => (20 * p) / 2 / 500, unidadResultado: "Tab (C/12H)" }
                ]
            },
            {
                nombre: "CLARITROMICINA",
                dosis: "15 mg/Kg/día",
                frecuencia: "C/ 12 H x 5 - 10 días",
                presentaciones: [
                    { tipo: "Suspensión", concentracion: "250 mg / 5 mL", calculo: (p) => (((15 * p) / 2) / 250) * 5, unidadResultado: "mL (C/12H)" },
                    { tipo: "Tableta", concentracion: "500 mg", calculo: (p) => (15 * p) / 2 / 500, unidadResultado: "Tab (C/12H)" }
                ]
            },
            {
                nombre: "CLINDAMICINA",
                dosis: "30 mg/Kg/día",
                frecuencia: "C/ 6 H",
                presentaciones: [
                    { tipo: "Cápsulas", concentracion: "300 mg", calculo: (p) => (30 * p) / 4 / 300, unidadResultado: "Caps (C/6H)" },
                    { tipo: "Ampolla", concentracion: "600 mg / 4 mL", calculo: (p) => (((30 * p) / 4) / 600) * 4, unidadResultado: "mL (C/6H, EV)" }
                ]
            },
            {
                nombre: "DICLOXACILINA",
                dosis: "50 mg/Kg/día",
                frecuencia: "C/ 6 H",
                presentaciones: [
                    { tipo: "Suspensión", concentracion: "125 mg / 5 mL", calculo: (p) => (((50 * p) / 4) / 125) * 5, unidadResultado: "mL (C/6H)" },
                    { tipo: "Cápsulas", concentracion: "500 mg", calculo: (p) => (50 * p) / 4 / 500, unidadResultado: "Caps (C/6H)" }
                ]
            },
            {
                nombre: "DOXICICLINA",
                dosis: "5 mg/Kg/día",
                frecuencia: "C/ 12 H",
                observaciones: "Contraindicada en menores de 8 años (daño dental).",
                presentaciones: [
                    { tipo: "Cápsulas", concentracion: "100 mg", calculo: (p) => (5 * p) / 2 / 100, unidadResultado: "Caps (C/12H, VO)" }
                ]
            },
            {
                nombre: "ERITROMICINA",
                dosis: "50 mg/Kg/día",
                frecuencia: "C/ 6 H x 10 días",
                presentaciones: [
                    { tipo: "Suspensión", concentracion: "250 mg / 5 mL", calculo: (p) => (((50 * p) / 4) / 250) * 5, unidadResultado: "mL (C/6H)" },
                    { tipo: "Tableta", concentracion: "500 mg", calculo: (p) => (50 * p) / 4 / 500, unidadResultado: "Tab (C/6H)" }
                ]
            },
            {
                nombre: "GENTAMICINA",
                dosis: "6 mg/Kg/día",
                frecuencia: "C/ 8 H",
                presentaciones: [
                    { tipo: "Ampolla 40mg", concentracion: "40 mg / 1 mL", calculo: (p) => ((6 * p) / 3) / 40, unidadResultado: "mL (C/8H, EV)" },
                    { tipo: "Ampolla 80mg", concentracion: "80 mg / 2 mL", calculo: (p) => (((6 * p) / 3) / 80) * 2, unidadResultado: "mL (C/8H, EV)" }
                ]
            },
            {
                nombre: "METRONIDAZOL",
                dosis: "15 mg/Kg/día",
                frecuencia: "C/ 6 H",
                presentaciones: [
                    { tipo: "Solución Iny.", concentracion: "500 mg / 100 mL", calculo: (p) => (((15 * p) / 4) / 500) * 100, unidadResultado: "mL (C/6H, EV)" }
                ]
            },
            {
                nombre: "OXACILINA",
                dosis: "100 mg/Kg/día",
                frecuencia: "C/ 6 H",
                presentaciones: [
                    { tipo: "Ampolla", concentracion: "1 g - 2 g", calculo: (p) => (100 * p) / 4, unidadResultado: "mg (C/6H, EV)" }
                ]
            },
            {
                nombre: "PENICILINA BENZATÍNICA",
                dosis: "50,000 U/Kg",
                frecuencia: "DOSIS ÚNICA",
                presentaciones: [
                    { tipo: "Ampolla", concentracion: "1'200.000 - 2'400.000 U", calculo: (p) => 50000 * p, unidadResultado: "Unidades (IM)" }
                ]
            },
            {
                nombre: "PENICILINA G CRISTALINA",
                dosis: "200 U/Kg/día",
                frecuencia: "C/ 6 H",
                presentaciones: [
                    { tipo: "Ampolla", concentracion: "1'000.000 U", calculo: (p) => (200 * p) / 4, unidadResultado: "U (C/6H, EV)" }
                ]
            },
            {
                nombre: "PENICILINA V ORAL",
                dosis: "50 mg/Kg/día",
                frecuencia: "C/ 6 - 8 H",
                presentaciones: [
                    { tipo: "Suspensión", concentracion: "250 mg / 5 mL", calculo: (p) => (((50 * p) / 4) / 250) * 5, unidadResultado: "mL (C/6H)" },
                    { tipo: "Tableta", concentracion: "500 mg", calculo: (p) => (50 * p) / 4 / 500, unidadResultado: "Tab (C/6H)" }
                ]
            },
            {
                nombre: "TRIMETOPRIM / SULFAMETOXAZOL",
                dosis: "8 mg/Kg/día (base TMP)",
                frecuencia: "C/ 12 H x 5 - 10 días",
                presentaciones: [
                    { tipo: "Suspensión", concentracion: "40/200 mg / 5 mL", calculo: (p) => (((8 * p) / 2) / 40) * 5, unidadResultado: "mL (C/12H)" },
                    { tipo: "Tableta", concentracion: "80/400 mg", calculo: (p) => (8 * p) / 2 / 80, unidadResultado: "Tab (C/12H)" }
                ]
            }
        ]
    },
    {
        categoria: "ANTIVIRALES",
        medicamentos: [
            {
                nombre: "ACICLOVIR",
                dosis: "30 mg/Kg/día",
                frecuencia: "C/ 6 H x 7 - 10 días",
                observaciones: "IV para encefalitis herpética a 30-60 mg/kg/día. Hidratación adecuada para prevenir nefrotoxicidad.",
                presentaciones: [
                    { tipo: "Suspensión", concentracion: "200 mg / 5 mL", calculo: (p) => (((30 * p) / 4) / 200) * 5, unidadResultado: "mL (C/6H)" },
                    { tipo: "Tableta 200mg", concentracion: "200 mg", calculo: (p) => (30 * p) / 4 / 200, unidadResultado: "Tab (C/6H)" },
                    { tipo: "Tableta 800mg", concentracion: "800 mg", calculo: (p) => (30 * p) / 4 / 800, unidadResultado: "Tab (C/6H)" }
                ]
            }
        ]
    },
    {
        categoria: "ANTICONVULSIVANTES",
        medicamentos: [
            {
                nombre: "CARBAMAZEPINA",
                dosis: "10 mg/Kg/día",
                frecuencia: "C/ 8 H",
                observaciones: "Énfasis en monitoreo de niveles séricos. Puede causar aplasia medular.",
                presentaciones: [
                    { tipo: "Suspensión", concentracion: "100 mg / 5 mL", calculo: (p) => (((10 * p) / 3) / 100) * 5, unidadResultado: "mL (C/8H)" },
                    { tipo: "Tableta 200mg", concentracion: "200 mg", calculo: (p) => (10 * p) / 3 / 200, unidadResultado: "Tab (C/8H)" },
                    { tipo: "Tableta 400mg", concentracion: "400 mg", calculo: (p) => (10 * p) / 3 / 400, unidadResultado: "Tab (C/8H)" }
                ]
            },
            {
                nombre: "DIAZEPAM",
                dosis: "0.3 mg/Kg/dosis",
                frecuencia: "Dosis única (convulsión activa)",
                observaciones: "Máx 10 mg. Vigilar depresión respiratoria.",
                presentaciones: [
                    { tipo: "Ampolla", concentracion: "5 mg / 1 mL (2 mL)", calculo: (p) => Math.min((0.3 * p) / 5, 2), unidadResultado: "mL (EV lento)" }
                ]
            },
            {
                nombre: "FENITOÍNA",
                dosis: "10 mg/Kg (carga)",
                frecuencia: "Bolo EV (velocidad máx 1 mg/kg/min)",
                observaciones: "Monitoreo de niveles séricos obligatorio. No mezclar con dextrosa.",
                presentaciones: [
                    { tipo: "Jarabe", concentracion: "125 mg / 5 mL", calculo: (p) => ((10 * p) / 125) * 5, unidadResultado: "mL" },
                    { tipo: "Ampolla", concentracion: "50 mg / 1 mL", calculo: (p) => (10 * p) / 50, unidadResultado: "mL (EV)" }
                ]
            },
            {
                nombre: "FENOBARBITAL",
                dosis: "3.5 mg/Kg/día (mantenimiento)",
                frecuencia: "C/ 12 H",
                presentaciones: [
                    { tipo: "Ampolla 40mg", concentracion: "40 mg / 1 mL", calculo: (p) => ((3.5 * p) / 2) / 40, unidadResultado: "mL (C/12H, EV)" },
                    { tipo: "Tableta", concentracion: "50 mg", calculo: (p) => (3.5 * p) / 2 / 50, unidadResultado: "Tab (C/12H)" }
                ]
            },
            {
                nombre: "MIDAZOLAM",
                dosis: "0.05 mg/Kg/dosis",
                frecuencia: "Bolo EV / IM / Intranasal",
                observaciones: "Alternativa de primera línea en estatus epiléptico fuera de hospital (IM/Intranasal).",
                presentaciones: [
                    { tipo: "Ampolla", concentracion: "5 mg / 5 mL", calculo: (p) => ((0.05 * p) / 5) * 5, unidadResultado: "mL (EV)" }
                ]
            }
        ]
    },
    {
        categoria: "CORTICOIDES",
        medicamentos: [
            {
                nombre: "BETAMETASONA",
                dosis: "0.125 mg/Kg/dosis",
                frecuencia: "C/ 6 - 12 H",
                observaciones: "Equivalencias: Dexametasona 0.75mg = Prednisona 5mg.",
                presentaciones: [
                    { tipo: "Ampolla", concentracion: "4 mg / 1 mL", calculo: (p) => ((0.125 * p) / 4) * 1, unidadResultado: "mL (EV)" },
                    { tipo: "Tableta 0.5mg", concentracion: "0.5 mg", calculo: (p) => (0.125 * p) / 0.5, unidadResultado: "Tab" },
                    { tipo: "Tableta 2mg", concentracion: "2 mg", calculo: (p) => (0.125 * p) / 2, unidadResultado: "Tab" }
                ]
            },
            {
                nombre: "PREDNISOLONA",
                dosis: "1 - 2 mg/Kg/día",
                frecuencia: "Dosis única matinal x 3-5 días",
                observaciones: "Recomendado para terapia corta de asma.",
                presentaciones: [
                    { tipo: "Jarabe", concentracion: "15 mg / 5 mL", calculo: (p) => ((1 * p) / 15) * 5, unidadResultado: "mL (1mg/kg)" },
                    { tipo: "Jarabe Forte", concentracion: "5 mg / 1 mL", calculo: (p) => ((2 * p) / 5) * 1, unidadResultado: "mL (Crisis 2mg/kg)" }
                ]
            },
            {
                nombre: "DEXAMETASONA",
                dosis: "0.15 - 0.6 mg/Kg/dosis",
                frecuencia: "Dosis única o dividida. Croup: MÁX 10mg.",
                presentaciones: [
                    { tipo: "Elixir/Jarabe", concentracion: "0.5 mg / 5 mL", calculo: (p) => ((0.15 * p) / 0.5) * 5, unidadResultado: "mL (0.15mg/kg)" },
                    { tipo: "Ampolla", concentracion: "4 mg / 1 mL", calculo: (p) => ((0.6 * p) / 4) * 1, unidadResultado: "mL (Croup 0.6mg/kg)" },
                    { tipo: "Ampolla Forte", concentracion: "8 mg / 2 mL", calculo: (p) => ((0.6 * p) / 8) * 2, unidadResultado: "mL (Croup 0.6mg/kg)" }
                ]
            },
            {
                nombre: "METILPREDNISOLONA",
                dosis: "10 mg/Kg (Pulsos EV)",
                frecuencia: "Bolo EV (pulsos 3 días)",
                observaciones: "Indicada en status asmático y condiciones autoinmunes graves.",
                presentaciones: [
                    { tipo: "Ampolla", concentracion: "40 mg / 1 mL", calculo: (p) => (10 * p) / 40, unidadResultado: "mL (EV)" },
                    { tipo: "Tableta 4mg", concentracion: "4 mg", calculo: (p) => (10 * p) / 4, unidadResultado: "Tab" },
                    { tipo: "Tableta 16mg", concentracion: "16 mg", calculo: (p) => (10 * p) / 16, unidadResultado: "Tab" }
                ]
            }
        ]
    },
    {
        categoria: "ANTIEMÉTICOS / ANTIÁCIDOS",
        medicamentos: [
            {
                nombre: "METOCLOPRAMIDA",
                dosis: "0.4 mg/Kg/día",
                frecuencia: "C/ 8 H",
                observaciones: "Evitar en lactantes por riesgo de síndrome extrapiramidal.",
                presentaciones: [
                    { tipo: "Gotas", concentracion: "0.2 mg / gota", calculo: (p) => Math.round((0.4 * p) / 3 / 0.2), unidadResultado: "Gotas (C/8H)" },
                    { tipo: "Jarabe", concentracion: "1 mg / 1 mL", calculo: (p) => (0.4 * p) / 3, unidadResultado: "mL (C/8H)" },
                    { tipo: "Ampolla", concentracion: "10 mg / 2 mL", calculo: (p) => (((0.4 * p) / 3) / 10) * 2, unidadResultado: "mL (C/8H, EV)" },
                    { tipo: "Tableta", concentracion: "10 mg", calculo: (p) => (0.4 * p) / 3 / 10, unidadResultado: "Tab (C/8H)" }
                ]
            },
            {
                nombre: "RANITIDINA",
                dosis: "2 - 4 mg/Kg/día",
                frecuencia: "C/ 8 - 12 H",
                presentaciones: [
                    { tipo: "Jarabe", concentracion: "15 mg / 1 mL", calculo: (p) => ((4 * p) / 3) / 15, unidadResultado: "mL (C/8H)" },
                    { tipo: "Ampolla", concentracion: "50 mg / 2 mL", calculo: (p) => (((4 * p) / 3) / 50) * 2, unidadResultado: "mL (C/8H, EV)" }
                ]
            },
            {
                nombre: "ONDANSETRÓN",
                dosis: "0.15 mg/Kg/dosis",
                frecuencia: "Dosis única. Si >15kg: 4mg fijo",
                presentaciones: [
                    { tipo: "Ampolla", concentracion: "8 mg / 4 mL", calculo: (p) => ((0.15 * p) / 8) * 4, unidadResultado: "mL (EV/IM)" },
                    { tipo: "Tableta Orosoluble", concentracion: "4 mg", calculo: (p) => p > 15 ? 1 : 0.5, unidadResultado: "Tableta" }
                ]
            }
        ]
    },
    {
        categoria: "BRONCODILATADORES",
        medicamentos: [
            {
                nombre: "SALBUTAMOL",
                dosis: "0.15 mg/Kg/dosis",
                frecuencia: "C/ 6 H. Crisis: 2 Inh C/20 min x 3 dosis, C/1-2-4-6 H",
                observaciones: "En crisis severa prefiera Inhalador con Espaciador sobre nebulización.",
                presentaciones: [
                    { tipo: "Inhalador (Puff)", concentracion: "100 mcg / dosis", calculo: (p) => p < 20 ? 2 : (p < 30 ? 3 : 4), unidadResultado: "Puffs (con aerocámara)" },
                    { tipo: "Gotas Nebulizar", concentracion: "0.5% (5 mg/mL)", calculo: (p) => Math.round((0.15 * p) / 0.25), unidadResultado: "Gotas (en 3cc SSN)" },
                    { tipo: "Jarabe", concentracion: "2 mg / 5 mL", calculo: (p) => ((0.15 * p) / 2) * 5, unidadResultado: "mL" }
                ]
            },
            {
                nombre: "BROMURO DE IPRATROPIO",
                dosis: "250 mcg (<20kg) - 500 mcg (>20kg)",
                frecuencia: "C/ 4 - 6 H. Según esquema de crisis",
                observaciones: "No usar como monoterapia en crisis asmática aguda.",
                presentaciones: [
                    { tipo: "Inhalador (Puff)", concentracion: "20 mcg / dosis", calculo: (p) => 2, unidadResultado: "Puffs (con aerocámara)" },
                    { tipo: "Gotas Nebulizar", concentracion: "0.25 mg / 1 mL (20 gotas)", calculo: (p) => p < 20 ? 20 : 40, unidadResultado: "Gotas (en 3cc SSN)" }
                ]
            },
            {
                nombre: "BUDESÓNIDA (Nebulización)",
                dosis: "<12a: 1-2 mg/día. >12a: 2-4 mg/día",
                frecuencia: "C/ 12 H",
                presentaciones: [
                    { tipo: "Nebules", concentracion: "0.25 mg / 1 mL (viales 2mL)", calculo: (p) => 4, unidadResultado: "mL (1 mg total)" },
                    { tipo: "Inhalador", concentracion: "200 mcg / dosis", calculo: (p) => p < 20 ? 1 : 2, unidadResultado: "Puffs C/12H" }
                ]
            }
        ]
    },
    {
        categoria: "SOPORTE VITAL (ACLS / BLS)",
        medicamentos: [
            {
                nombre: "ADRENALINA (Epinefrina)",
                dosis: "0.01 mg/Kg/dosis",
                frecuencia: "C/ 3 - 5 Min (en RCP)",
                observaciones: "Dosis máxima absoluta: 1 mg. No diluir para IM en anafilaxia.",
                presentaciones: [
                    { tipo: "Ampolla", concentracion: "1 mg / 1 mL", calculo: (p) => Math.min(0.01 * p, 1), unidadResultado: "mL (EV/IM)" }
                ]
            },
            {
                nombre: "ATROPINA",
                dosis: "0.02 mg/Kg/dosis",
                frecuencia: "C/ 3 - 5 Min",
                observaciones: "Dosis mínima: 0.1 mg. Máxima: 0.5 mg (niño), 1 mg (adolescente).",
                presentaciones: [
                    { tipo: "Ampolla", concentracion: "1 mg / 1 mL", calculo: (p) => Math.min(Math.max(0.02 * p, 0.1), 0.5), unidadResultado: "mL (EV)" }
                ]
            },
            {
                nombre: "AMIODARONA",
                dosis: "5 mg/Kg/dosis",
                frecuencia: "Bolo EV (RCP). Máx 300mg",
                presentaciones: [
                    { tipo: "Ampolla", concentracion: "150 mg / 3 mL", calculo: (p) => (Math.min(5 * p, 300) / 150) * 3, unidadResultado: "mL (EV bolo)" }
                ]
            },
            {
                nombre: "ADENOSINA",
                dosis: "0.1 mg/Kg (1ra). 0.2 mg/Kg (2da)",
                frecuencia: "Bolo EV rápido + Flush SSN",
                observaciones: "Máximo 6 mg (1ra), 12 mg (2da). Administrar lo más rápido posible.",
                presentaciones: [
                    { tipo: "Ampolla", concentracion: "6 mg / 2 mL", calculo: (p) => (Math.min(0.1 * p, 6) / 6) * 2, unidadResultado: "mL (1ra dosis, EV)" }
                ]
            },
            {
                nombre: "BICARBONATO DE SODIO",
                dosis: "1 mEq/Kg/dosis",
                frecuencia: "Bolo lento (RCP)",
                presentaciones: [
                    { tipo: "Ampolla", concentracion: "1 mEq / 1 mL (8.4%)", calculo: (p) => 1 * p, unidadResultado: "mL (EV lento)" }
                ]
            }
        ]
    },
    {
        categoria: "INTOXICACIONES (ANTÍDOTOS)",
        medicamentos: [
            {
                nombre: "NALOXONA",
                dosis: "0.01 mg/Kg/dosis",
                frecuencia: "C/ 10 - 15 Min",
                observaciones: "Antídoto de opioides. Vigilar re-sedación.",
                presentaciones: [
                    { tipo: "Ampolla", concentracion: "0.4 mg / 1 mL", calculo: (p) => ((0.01 * p) / 0.4) * 1, unidadResultado: "mL (EV)" }
                ]
            },
            {
                nombre: "FLUMAZENIL",
                dosis: "0.01 mg/Kg/dosis",
                frecuencia: "C/ 1 Min (Máx 5 dosis)",
                observaciones: "Antídoto de benzodiacepinas. Riesgo de convulsiones si uso crónico.",
                presentaciones: [
                    { tipo: "Ampolla", concentracion: "0.5 mg / 5 mL", calculo: (p) => ((0.01 * p) / 0.5) * 5, unidadResultado: "mL (EV)" }
                ]
            },
            {
                nombre: "N-ACETILCISTEÍNA",
                dosis: "150 mg/Kg (carga)",
                frecuencia: "Protocolo de 21 horas (3 fases)",
                observaciones: "Antídoto de sobredosis de Acetaminofén. Iniciar lo antes posible.",
                presentaciones: [
                    { tipo: "Ampolla", concentracion: "200 mg / 1 mL", calculo: (p) => ((150 * p) / 200) * 1, unidadResultado: "mL (Dosis carga, EV)" }
                ]
            }
        ]
    },
    {
        categoria: "SNC",
        medicamentos: [
            {
                nombre: "AMITRIPTILINA",
                dosis: "1 mg/Kg/día",
                frecuencia: "C/ 8 H",
                observaciones: "Uso en dolor neuropático y enuresis. Precaución con QT prolongado.",
                presentaciones: [
                    { tipo: "Tableta 10mg", concentracion: "10 mg", calculo: (p) => (1 * p) / 3 / 10, unidadResultado: "Tab (C/8H)" },
                    { tipo: "Tableta 25mg", concentracion: "25 mg", calculo: (p) => (1 * p) / 3 / 25, unidadResultado: "Tab (C/8H)" }
                ]
            }
        ]
    },
    {
        categoria: "ANTIDIARREICOS",
        medicamentos: [
            {
                nombre: "LOPERAMIDA",
                dosis: "0.2 mg/Kg/día",
                frecuencia: "C/ 8 - 12 H",
                observaciones: "No recomendada en menores de 2 años ni en diarrea infecciosa invasiva.",
                presentaciones: [
                    { tipo: "Suspensión", concentracion: "1 mg / 5 mL", calculo: (p) => (((0.2 * p) / 3) / 1) * 5, unidadResultado: "mL (C/8H)" },
                    { tipo: "Tableta", concentracion: "2 mg", calculo: (p) => (0.2 * p) / 3 / 2, unidadResultado: "Tab (C/8H)" }
                ]
            }
        ]
    },
    {
        categoria: "ANTIPARASITARIOS",
        medicamentos: [
            {
                nombre: "ALBENDAZOL",
                dosis: "15 mg/Kg (o 400 mg dosis única)",
                frecuencia: "Dosis única",
                presentaciones: [
                    { tipo: "Suspensión", concentracion: "400 mg / 10 mL", calculo: (p) => ((15 * p) / 400) * 10, unidadResultado: "mL" },
                    { tipo: "Tableta", concentracion: "200 - 400 mg", calculo: (p) => (15 * p) / 400, unidadResultado: "Tab (400mg)" }
                ]
            },
            {
                nombre: "IVERMECTINA",
                dosis: "0.2 mg/Kg",
                frecuencia: "Dosis única",
                presentaciones: [
                    { tipo: "Gotas", concentracion: "6 mg / 30 gotas", calculo: (p) => Math.round((0.2 * p) / 6 * 30), unidadResultado: "Gotas" },
                    { tipo: "Cápsulas", concentracion: "3 mg", calculo: (p) => (0.2 * p) / 3, unidadResultado: "Caps" }
                ]
            },
            {
                nombre: "MEBENDAZOL",
                dosis: "100 mg fijo",
                frecuencia: "C/ 12 H x 3 días",
                presentaciones: [
                    { tipo: "Tableta", concentracion: "100 mg", calculo: () => 1, unidadResultado: "Tab (C/12H)" },
                    { tipo: "Suspensión", concentracion: "100 mg / 5 mL", calculo: () => 5, unidadResultado: "mL (C/12H)" }
                ]
            },
            {
                nombre: "METRONIDAZOL (Antiparasitario)",
                dosis: "5 mg/Kg/dosis",
                frecuencia: "C/ 8 H x 7 días",
                presentaciones: [
                    { tipo: "Suspensión", concentracion: "250 mg / 5 mL", calculo: (p) => ((5 * p) / 250) * 5, unidadResultado: "mL (C/8H)" },
                    { tipo: "Tableta", concentracion: "500 mg", calculo: (p) => (5 * p) / 500, unidadResultado: "Tab (C/8H)" }
                ]
            },
            {
                nombre: "PAMOATO DE PIRANTEL",
                dosis: "10 mg/Kg",
                frecuencia: "Dosis única",
                presentaciones: [
                    { tipo: "Suspensión", concentracion: "250 mg / 5 mL", calculo: (p) => ((10 * p) / 250) * 5, unidadResultado: "mL" }
                ]
            },
            {
                nombre: "SECNIDAZOL",
                dosis: "30 mg/Kg",
                frecuencia: "Dosis única",
                presentaciones: [
                    { tipo: "Suspensión", concentracion: "500 mg / 5 mL", calculo: (p) => ((30 * p) / 500) * 5, unidadResultado: "mL" },
                    { tipo: "Tableta", concentracion: "500 mg", calculo: (p) => (30 * p) / 500, unidadResultado: "Tab" }
                ]
            },
            {
                nombre: "TINIDAZOL",
                dosis: "60 mg/Kg",
                frecuencia: "Dosis única",
                presentaciones: [
                    { tipo: "Suspensión", concentracion: "200 mg / 1 mL", calculo: (p) => (60 * p) / 200, unidadResultado: "mL" },
                    { tipo: "Tableta", concentracion: "500 mg", calculo: (p) => (60 * p) / 500, unidadResultado: "Tab" }
                ]
            }
        ]
    },
    {
        categoria: "ANTIMICÓTICOS",
        medicamentos: [
            {
                nombre: "KETOCONAZOL",
                dosis: "5 mg/Kg/día",
                frecuencia: "Dosis única diaria",
                presentaciones: [
                    { tipo: "Suspensión", concentracion: "20 mg / 1 mL", calculo: (p) => (5 * p) / 20, unidadResultado: "mL" },
                    { tipo: "Tableta", concentracion: "200 mg", calculo: (p) => (5 * p) / 200, unidadResultado: "Tab" }
                ]
            },
            {
                nombre: "FLUCONAZOL",
                dosis: "2 mg/Kg/día",
                frecuencia: "C/ Día x 2 semanas",
                presentaciones: [
                    { tipo: "Suspensión", concentracion: "200 mg / 5 mL", calculo: (p) => ((2 * p) / 200) * 5, unidadResultado: "mL/Día" },
                    { tipo: "Cápsula", concentracion: "150 - 200 mg", calculo: (p) => (2 * p) / 150, unidadResultado: "Caps (150mg)" }
                ]
            },
            {
                nombre: "ANFOTERICINA B",
                dosis: "0.4 mg/Kg/dosis",
                frecuencia: "En 2 - 6 H (infusión)",
                observaciones: "Nefrotóxica. Monitoreo de función renal y electrolitos obligatorio.",
                presentaciones: [
                    { tipo: "Ampolla", concentracion: "50 mg / 10 mL", calculo: (p) => ((0.4 * p) / 50) * 10, unidadResultado: "mL (EV lento)" }
                ]
            },
            {
                nombre: "NISTATINA",
                dosis: "100,000 U/dosis",
                frecuencia: "C/ 6 H x 15 días",
                presentaciones: [
                    { tipo: "Suspensión", concentracion: "100,000 U / 1 mL", calculo: () => 1, unidadResultado: "mL (VO, tópico oral)" }
                ]
            }
        ]
    },
    {
        categoria: "ANTIHISTAMÍNICOS",
        medicamentos: [
            {
                nombre: "CETIRIZINA",
                dosis: "0.5 mg/Kg/día",
                frecuencia: "Cada día (dosis única)",
                presentaciones: [
                    { tipo: "Jarabe", concentracion: "5 mg / 5 mL", calculo: (p) => ((0.5 * p) / 5) * 5, unidadResultado: "mL/Día" },
                    { tipo: "Tableta", concentracion: "10 mg", calculo: (p) => (0.5 * p) / 10, unidadResultado: "Tab/Día" }
                ]
            },
            {
                nombre: "DESLORATADINA",
                dosis: "5 mg fijo (>12a) / 2.5 mg (<12a)",
                frecuencia: "Cada día",
                presentaciones: [
                    { tipo: "Jarabe", concentracion: "2.5 mg / 5 mL", calculo: (p) => p < 30 ? 5 : 10, unidadResultado: "mL/Día" },
                    { tipo: "Tableta", concentracion: "5 mg", calculo: () => 1, unidadResultado: "Tab/Día" }
                ]
            },
            {
                nombre: "HIDROXICINA",
                dosis: "2 mg/Kg/día",
                frecuencia: "C/ 8 - 12 H",
                presentaciones: [
                    { tipo: "Jarabe", concentracion: "2.5 mg / 1 mL", calculo: (p) => ((2 * p) / 3) / 2.5, unidadResultado: "mL (C/8H)" },
                    { tipo: "Tableta", concentracion: "25 mg", calculo: (p) => (2 * p) / 3 / 25, unidadResultado: "Tab (C/8H)" },
                    { tipo: "Ampolla", concentracion: "100 mg / 2 mL", calculo: (p) => (((2 * p) / 3) / 100) * 2, unidadResultado: "mL (C/8H, IM)" }
                ]
            }
        ]
    },
    {
        categoria: "ELECTROLITOS",
        medicamentos: [
            {
                nombre: "POTASIO (Hipokalemia)",
                dosis: "3 mEq/Kg/día",
                frecuencia: "Bolo lento (nunca en bolo rápido)",
                observaciones: "NUNCA administrar en bolo rápido EV. Monitoreo de ECG obligatorio. Máx concentración periférica: 40 mEq/L.",
                presentaciones: [
                    { tipo: "Ampolla KCl", concentracion: "2 mEq / 1 mL (10 mL)", calculo: (p) => (3 * p) / 2, unidadResultado: "mL/Día (diluido en LEV)" }
                ]
            },
            {
                nombre: "FUROSEMIDA (Hiperpotasemia)",
                dosis: "1 mg/Kg/dosis",
                frecuencia: "C/ 2 - 8 H",
                presentaciones: [
                    { tipo: "Ampolla", concentracion: "20 mg / 2 mL", calculo: (p) => ((1 * p) / 20) * 2, unidadResultado: "mL (EV)" }
                ]
            },
            {
                nombre: "SODIO (Hiponatremia)",
                dosis: "Cálculo especial (mEq = (Na deseado - Na actual) x 0.6 x Peso)",
                frecuencia: "Bolo lento / infusión",
                observaciones: "Corrección lenta: Máx 10-12 mEq/L en 24h para evitar mielinólisis pontina.",
                presentaciones: [
                    { tipo: "Ampolla NaCl 3%", concentracion: "0.5 mEq / 1 mL", calculo: (p) => p * 0.6, unidadResultado: "mL por cada mEq necesario" }
                ]
            }
        ]
    }
];

export default function VademecumView({ onBack }: { onBack: () => void }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('TODAS');
    const [pesoInput, setPesoInput] = useState<string>('12');

    // Estado para guardar la presentación seleccionada por cada medicamento (clave: nombre medicamento)
    const [presentacionesSeleccionadas, setPresentacionesSeleccionadas] = useState<Record<string, number>>({});

    const peso = useMemo(() => {
        const p = parseFloat(pesoInput);
        return isNaN(p) || p <= 0 ? 0 : p;
    }, [pesoInput]);

    const totalMedicamentos = useMemo(() => {
        return vademecumDataV2.reduce((acc, cat) => acc + cat.medicamentos.length, 0);
    }, []);

    const filteredVademecum = useMemo(() => {
        return vademecumDataV2
            .filter(cat => selectedCategory === 'TODAS' || cat.categoria === selectedCategory)
            .map(cat => ({
                ...cat,
                medicamentos: cat.medicamentos.filter(m =>
                    m.nombre.toLowerCase().includes(searchTerm.toLowerCase())
                )
            }))
            .filter(cat => cat.medicamentos.length > 0);
    }, [searchTerm, selectedCategory]);

    const formatNumber = (num: number | string | undefined) => {
        if (num === undefined) return '-';
        if (typeof num === 'string') return num;
        return Number.isInteger(num) ? num.toString() : num.toFixed(1);
    };

    const setPresIndex = (medNombre: string, idx: number) => {
        setPresentacionesSeleccionadas(prev => ({ ...prev, [medNombre]: idx }));
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">

            {/* Header Sticky con Peso */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 sm:p-8 text-white sticky top-0 z-20 shadow-md">
                <div className="flex items-center gap-4 mb-3">
                    <button onClick={onBack} className="p-2 bg-white/20 hover:bg-white/30 rounded-xl active:scale-95 transition-all">
                        <ChevronDown className="w-6 h-6 rotate-90" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-black shadow-sm">Pediadosis <span className="text-base font-bold bg-white/20 px-3 py-1 rounded-full ml-2">{totalMedicamentos} medicamentos</span></h2>
                        <p className="opacity-90 text-sm font-medium">Dosis de Medicamentos en Pediatría — Cálculos exactos por Presentación y Peso</p>
                    </div>
                </div>

                {/* Inventario por categoría */}
                <div className="flex flex-wrap gap-1.5 mb-4 bg-white/5 p-3 rounded-xl border border-white/10">
                    <button
                        onClick={() => setSelectedCategory('TODAS')}
                        className={`text-xs font-bold px-2.5 py-1 rounded-full transition-all ${selectedCategory === 'TODAS' ? 'bg-white text-green-700' : 'bg-white/15 hover:bg-white/25 text-white'}`}
                    >
                        📋 Todas ({totalMedicamentos})
                    </button>
                    {vademecumDataV2.map((cat, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedCategory(cat.categoria)}
                            className={`text-xs font-bold px-2.5 py-1 rounded-full transition-all ${selectedCategory === cat.categoria ? 'bg-white text-green-700' : 'bg-white/15 hover:bg-white/25 text-white'}`}
                        >
                            {cat.categoria.split(' ')[0]} ({cat.medicamentos.length})
                        </button>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-sm">
                    <label className="font-bold text-lg whitespace-nowrap min-w-max flex items-center gap-2">
                        <Activity className="w-5 h-5 text-green-200" />
                        Peso Paciente:
                    </label>
                    <div className="relative w-full sm:w-64">
                        <input
                            type="number"
                            value={pesoInput}
                            onChange={(e) => setPesoInput(e.target.value)}
                            className="w-full bg-white text-green-900 font-black text-2xl py-3 pl-4 pr-12 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-300 transition-all shadow-inner font-mono text-right"
                            placeholder="0.0"
                            step="0.1"
                            min="0"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 select-none">kg</span>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Controles de Filtros */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="w-5 h-5 text-green-600 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Buscar medicamento..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 font-medium"
                        />
                    </div>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="bg-white border text-sm font-bold border-gray-200 text-gray-700 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none min-w-[200px]"
                    >
                        <option value="TODAS">📜 Todas las Categorías</option>
                        {vademecumDataV2.map((cat, i) => (
                            <option key={i} value={cat.categoria}>{cat.categoria}</option>
                        ))}
                    </select>
                </div>

                {/* Resultados */}
                <div className="space-y-6">
                    {filteredVademecum.map((cat, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                                <h3 className="font-bold text-gray-800 text-sm tracking-widest uppercase">{cat.categoria}</h3>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {cat.medicamentos.map((med, midx) => {
                                    const presIdx = presentacionesSeleccionadas[med.nombre] || 0;
                                    const presenActual = med.presentaciones[presIdx];

                                    return (
                                        <div key={midx} className="p-4 sm:p-5 hover:bg-green-50/20 transition-colors">
                                            <div className="flex flex-col xl:flex-row justify-between gap-6">

                                                {/* Info Base */}
                                                <div className="flex-1 space-y-3">
                                                    <h4 className="font-black text-green-800 text-xl flex items-center gap-2">
                                                        <Pill className="text-green-500 w-5 h-5" /> {med.nombre}
                                                    </h4>

                                                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                                        <p><span className="font-semibold text-gray-500">Dosis Pediátrica:</span> <span className="text-gray-900 font-medium">{med.dosis}</span></p>
                                                        <p><span className="font-semibold text-gray-500">Frecuencia:</span> <span className="text-gray-900 font-medium">{med.frecuencia}</span></p>
                                                    </div>

                                                    {med.observaciones && (
                                                        <div className="bg-amber-50 text-amber-800 font-medium text-xs px-3 py-2 rounded-lg border border-amber-200 flex items-start gap-2">
                                                            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-500" />
                                                            <p>{med.observaciones}</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Calculadora Dinámica de Presentación */}
                                                <div className="xl:min-w-[320px] bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 shadow-inner">
                                                    <label className="block text-xs font-bold text-green-700 uppercase tracking-wider mb-2">Seleccionar Presentación:</label>
                                                    <select
                                                        className="w-full bg-white border border-green-200 text-sm font-semibold text-gray-800 p-2.5 rounded-lg mb-4 focus:ring-2 focus:ring-green-400 outline-none"
                                                        value={presIdx}
                                                        onChange={(e) => setPresIndex(med.nombre, Number(e.target.value))}
                                                    >
                                                        {med.presentaciones.map((p, i) => (
                                                            <option key={i} value={i}>{p.tipo} ({p.concentracion})</option>
                                                        ))}
                                                    </select>

                                                    <div className="text-center bg-white py-3 px-4 rounded-lg shadow-sm border border-green-100 relative">
                                                        {peso > 0 ? (
                                                            <>
                                                                <span className="block text-xs font-bold text-gray-400 mb-1">Dosis para {peso} kg</span>
                                                                <div className="text-3xl font-black text-green-600 font-mono">
                                                                    {presenActual.calculo ? formatNumber(presenActual.calculo(peso)) : '-'}
                                                                </div>
                                                                <span className="block text-sm font-bold text-green-800 mt-1 uppercase tracking-wider bg-green-100 rounded-full px-2 py-0.5 inline-block">
                                                                    {presenActual.unidadResultado}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <div className="py-4 text-gray-400 text-sm font-medium">Ingresa Peso Arriba</div>
                                                        )}
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {filteredVademecum.length === 0 && (
                        <div className="text-center py-12 text-green-600 bg-green-50 rounded-2xl border-2 border-dashed border-green-200">
                            No se encontraron medicamentos.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
