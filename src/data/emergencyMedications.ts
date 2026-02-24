// Tipos
export interface Presentacion {
  nombre: string;
  concentracion: number; // unidades por mL (mg/mL, mEq/mL, mcg/mL)
  unidadConcentracion: string; // "mg/mL", "mEq/mL", etc.
}

export interface MedicamentoEmergencia {
  nombre: string;
  categoria: string;
  dosisMgKg: number | null; // null si es dosis fija o por rango
  dosisMinMgKg?: number;
  dosisMaxMgKg?: number;
  dosisTexto: string;
  unidadDosis: 'mg' | 'mEq' | 'mcg' | 'mg (fija)';
  frecuencia: string;
  numTomasDia: string;
  presentaciones: Presentacion[];
  maxDosisPorToma?: number;
  maxDosisPorDia?: number;
  minDosis?: number;
  via: string;
  notas?: string;
  fuente?: string;
  alertas?: string[];
  esDosiFija?: boolean;
  dosisFijaTexto?: string;
}

// Cálculo de dosis
export function calcularDosisEmergencia(
  med: MedicamentoEmergencia,
  pesoKg: number,
  presentacionIdx: number = 0
): {
  dosisMg: number;
  dosisMinMg?: number;
  dosisMaxMg?: number;
  dosisMl: number;
  dosisMinMl?: number;
  dosisMaxMl?: number;
  unidad: string;
  excedeDosisMax: boolean;
  excedeDosisMaxDia: boolean;
  porDebajoDosisMin: boolean;
  presentacion: Presentacion;
  esFija: boolean;
  textoFijo?: string;
} {
  const presentacion = med.presentaciones[presentacionIdx] || med.presentaciones[0];
  const concentracion = presentacion.concentracion;

  // Dosis fija (no depende de peso)
  if (med.esDosiFija && med.dosisMgKg !== null) {
    const dosisMg = med.dosisMgKg;
    return {
      dosisMg,
      dosisMl: concentracion > 0 ? dosisMg / concentracion : 0,
      unidad: med.unidadDosis,
      excedeDosisMax: false,
      excedeDosisMaxDia: false,
      porDebajoDosisMin: false,
      presentacion,
      esFija: true,
      textoFijo: med.dosisFijaTexto,
    };
  }

  // Dosis con rango (min-max mg/kg)
  if (med.dosisMinMgKg !== undefined && med.dosisMaxMgKg !== undefined) {
    const dosisMinMg = pesoKg * med.dosisMinMgKg;
    const dosisMaxMg = pesoKg * med.dosisMaxMgKg;
    let dosisMaxCalc = dosisMaxMg;

    const excedeDosisMax = !!(med.maxDosisPorToma && dosisMaxCalc > med.maxDosisPorToma);
    if (excedeDosisMax && med.maxDosisPorToma) dosisMaxCalc = med.maxDosisPorToma;

    return {
      dosisMg: (dosisMinMg + dosisMaxCalc) / 2,
      dosisMinMg: dosisMinMg,
      dosisMaxMg: dosisMaxCalc,
      dosisMl: concentracion > 0 ? ((dosisMinMg + dosisMaxCalc) / 2) / concentracion : 0,
      dosisMinMl: concentracion > 0 ? dosisMinMg / concentracion : 0,
      dosisMaxMl: concentracion > 0 ? dosisMaxCalc / concentracion : 0,
      unidad: med.unidadDosis,
      excedeDosisMax,
      excedeDosisMaxDia: !!(med.maxDosisPorDia && dosisMaxCalc > med.maxDosisPorDia),
      porDebajoDosisMin: !!(med.minDosis && dosisMinMg < med.minDosis),
      presentacion,
      esFija: false,
    };
  }

  // Dosis simple (un solo valor mg/kg)
  if (med.dosisMgKg === null) {
    return {
      dosisMg: 0,
      dosisMl: 0,
      unidad: med.unidadDosis,
      excedeDosisMax: false,
      excedeDosisMaxDia: false,
      porDebajoDosisMin: false,
      presentacion,
      esFija: false,
    };
  }

  let dosisMg = pesoKg * med.dosisMgKg;
  const porDebajoDosisMin = !!(med.minDosis && dosisMg < med.minDosis);
  if (porDebajoDosisMin && med.minDosis) dosisMg = med.minDosis;

  const excedeDosisMax = !!(med.maxDosisPorToma && dosisMg > med.maxDosisPorToma);
  if (excedeDosisMax && med.maxDosisPorToma) dosisMg = med.maxDosisPorToma;

  const excedeDosisMaxDia = !!(med.maxDosisPorDia && dosisMg > med.maxDosisPorDia);

  const dosisMl = concentracion > 0 ? dosisMg / concentracion : 0;

  return {
    dosisMg,
    dosisMl,
    unidad: med.unidadDosis,
    excedeDosisMax,
    excedeDosisMaxDia,
    porDebajoDosisMin,
    presentacion,
    esFija: false,
  };
}

// Base de datos de medicamentos
export const medicamentosEmergencia: MedicamentoEmergencia[] = [
  // ===================== ACLS / Reanimación =====================
  {
    nombre: 'Adrenalina (IM/SC)',
    categoria: 'ACLS / Anafilaxia',
    dosisMgKg: 0.01,
    dosisTexto: '0.01 mg/kg',
    unidadDosis: 'mg',
    frecuencia: 'Cada 5-15 min si es necesario',
    numTomasDia: 'Según respuesta clínica',
    presentaciones: [
      { nombre: 'Ampolla 1mg/1mL (1:1000)', concentracion: 1, unidadConcentracion: 'mg/mL' },
      { nombre: 'Jeringa precargada 0.3mg/0.3mL', concentracion: 1, unidadConcentracion: 'mg/mL' },
    ],
    maxDosisPorToma: 0.5,
    via: 'IM (cara anterolateral del muslo)',
    notas: 'Vía IM preferente. Repetir cada 5-15 min si persisten los síntomas.',
    fuente: 'https://www.guiafarmapediatrica.es/indice/farmacos-de-uso-en-emergencias/anafilaxia/adrenalina-im-o-sc',
    alertas: ['Dosis máx por toma: 0.5 mg'],
  },
  {
    nombre: 'Adrenalina (Nebulizada)',
    categoria: 'Urgencias Respiratorias',
    dosisMgKg: 5,
    dosisTexto: '3-5 mg/dosis (= 3-5 mL)',
    unidadDosis: 'mg (fija)',
    esDosiFija: true,
    dosisFijaTexto: '3 - 5 mg independiente del peso',
    frecuencia: 'Cada 30-60 min según clínica',
    numTomasDia: 'Según respuesta (máx 3 dosis)',
    presentaciones: [
      { nombre: 'Ampolla 1mg/1mL (1:1000)', concentracion: 1, unidadConcentracion: 'mg/mL' },
    ],
    maxDosisPorToma: 5,
    via: 'Nebulización',
    notas: 'Diluir con SSN hasta 4 mL. Flujo O₂: 4-6 L/min. Uso en croup y broncoespasmo.',
    fuente: 'https://www.guiafarmapediatrica.es/indice/farmacos-de-uso-en-emergencias/urgencias-respiratorias/adrenalina-nebulizada',
  },
  {
    nombre: 'Adrenalina (IV - Paro)',
    categoria: 'ACLS / Reanimación',
    dosisMgKg: 0.01,
    dosisTexto: '0.01 mg/kg (= 0.1 mL/kg de sol. 1:10.000)',
    unidadDosis: 'mg',
    frecuencia: 'Cada 3-5 min',
    numTomasDia: 'Hasta recuperación de ritmo',
    presentaciones: [
      { nombre: 'Sol. 1:10.000 (0.1mg/mL)', concentracion: 0.1, unidadConcentracion: 'mg/mL' },
      { nombre: 'Ampolla 1mg/1mL (1:1000) - diluir', concentracion: 1, unidadConcentracion: 'mg/mL' },
    ],
    maxDosisPorToma: 1,
    via: 'IV / IO',
    notas: 'En paro cardíaco. Usar solución 1:10.000 (diluida). Repetir cada 3-5 min.',
    alertas: ['Dosis máx por toma: 1 mg', 'NO usar 1:1000 sin diluir por vía IV'],
  },
  {
    nombre: 'Atropina',
    categoria: 'ACLS / Bradicardia',
    dosisMgKg: 0.02,
    dosisTexto: '0.02 mg/kg',
    unidadDosis: 'mg',
    frecuencia: 'Dosis única, repetir si es necesario',
    numTomasDia: 'Dosis única (repetible)',
    presentaciones: [
      { nombre: 'Ampolla 1mg/1mL', concentracion: 1, unidadConcentracion: 'mg/mL' },
      { nombre: 'Ampolla 0.5mg/1mL', concentracion: 0.5, unidadConcentracion: 'mg/mL' },
    ],
    maxDosisPorToma: 0.5,
    minDosis: 0.1,
    via: 'IV / IO',
    notas: 'Dosis mínima 0.1 mg (dosis menores pueden causar bradicardia paradójica).',
    fuente: 'https://www.guiafarmapediatrica.es/node/549',
    alertas: ['Dosis mín: 0.1 mg', 'Dosis máx por toma: 0.5 mg (niños), 1 mg (adolescentes)'],
  },

  // ===================== Convulsiones =====================
  {
    nombre: 'Midazolam',
    categoria: 'Convulsiones',
    dosisMinMgKg: 0.1,
    dosisMaxMgKg: 0.2,
    dosisMgKg: null,
    dosisTexto: '0.1-0.2 mg/kg',
    unidadDosis: 'mg',
    frecuencia: 'Si convulsión >5 min. Repetir una vez',
    numTomasDia: 'Máx 2 dosis',
    presentaciones: [
      { nombre: 'Ampolla 5mg/5mL (1mg/mL)', concentracion: 1, unidadConcentracion: 'mg/mL' },
      { nombre: 'Ampolla 15mg/3mL (5mg/mL)', concentracion: 5, unidadConcentracion: 'mg/mL' },
      { nombre: 'Ampolla 5mg/1mL (5mg/mL)', concentracion: 5, unidadConcentracion: 'mg/mL' },
    ],
    maxDosisPorToma: 10,
    via: 'IM / IV / Bucal / Intranasal',
    alertas: ['Dosis máx por toma: 10 mg'],
  },
  {
    nombre: 'Diazepam',
    categoria: 'Convulsiones',
    dosisMinMgKg: 0.3,
    dosisMaxMgKg: 0.5,
    dosisMgKg: null,
    dosisTexto: '0.3-0.5 mg/kg (rectal) | 0.1-0.3 mg/kg (IV)',
    unidadDosis: 'mg',
    frecuencia: 'Dosis única. Se puede repetir 1 vez',
    numTomasDia: 'Máx 2 dosis',
    presentaciones: [
      { nombre: 'Ampolla 10mg/2mL (5mg/mL)', concentracion: 5, unidadConcentracion: 'mg/mL' },
      { nombre: 'Microenema rectal 5mg', concentracion: 5, unidadConcentracion: 'mg/mL' },
      { nombre: 'Microenema rectal 10mg', concentracion: 10, unidadConcentracion: 'mg/mL' },
    ],
    maxDosisPorToma: 10,
    maxDosisPorDia: 20,
    via: 'Rectal / IV lento',
    alertas: ['Dosis máx por toma: 10 mg', 'Dosis máx por día: 20 mg', 'IV lento: riesgo depresión respiratoria'],
  },
  {
    nombre: 'Fenitoína',
    categoria: 'Convulsiones',
    dosisMinMgKg: 15,
    dosisMaxMgKg: 20,
    dosisMgKg: null,
    dosisTexto: '15-20 mg/kg IV (dosis de carga)',
    unidadDosis: 'mg',
    frecuencia: 'Infundir en 20-30 min. Dosis de mantenimiento: 5-8 mg/kg/día',
    numTomasDia: 'Carga: dosis única. Mantenimiento: cada 12h',
    presentaciones: [
      { nombre: 'Ampolla 250mg/5mL (50mg/mL)', concentracion: 50, unidadConcentracion: 'mg/mL' },
      { nombre: 'Ampolla 100mg/2mL (50mg/mL)', concentracion: 50, unidadConcentracion: 'mg/mL' },
      { nombre: 'Jarabe 125mg/5mL (25mg/mL)', concentracion: 25, unidadConcentracion: 'mg/mL' },
    ],
    maxDosisPorToma: 1000,
    via: 'IV lento (máx 1 mg/kg/min)',
    notas: 'Infundir en SSN (NO en dextrosa, precipita). Monitorizar ECG durante infusión. Usar filtro en línea.',
    alertas: [
      'Dosis máx de carga: 1000 mg (1 g)',
      'Velocidad máx: 1 mg/kg/min (50 mg/min en adultos)',
      'NO mezclar con dextrosa',
      'Monitorizar ECG y PA durante infusión',
    ],
  },
  {
    nombre: 'Fenobarbital',
    categoria: 'Convulsiones',
    dosisMinMgKg: 15,
    dosisMaxMgKg: 20,
    dosisMgKg: null,
    dosisTexto: '15-20 mg/kg IV (dosis de carga)',
    unidadDosis: 'mg',
    frecuencia: 'Infundir en 15-30 min. Mantenimiento: 3-5 mg/kg/día',
    numTomasDia: 'Carga: dosis única. Mantenimiento: cada 12-24h',
    presentaciones: [
      { nombre: 'Ampolla 200mg/mL (1mL)', concentracion: 200, unidadConcentracion: 'mg/mL' },
      { nombre: 'Ampolla 100mg/mL (2mL)', concentracion: 100, unidadConcentracion: 'mg/mL' },
      { nombre: 'Ampolla 40mg/mL', concentracion: 40, unidadConcentracion: 'mg/mL' },
    ],
    maxDosisPorToma: 1000,
    via: 'IV lento',
    notas: 'Tercera línea tras benzodiacepinas y fenitoína. Riesgo de depresión respiratoria, especialmente post-benzodiacepinas.',
    alertas: [
      'Dosis máx de carga: 1000 mg',
      'Velocidad máx: 2 mg/kg/min',
      '⚠️ Alto riesgo de depresión respiratoria con benzodiacepinas previas',
    ],
  },

  // ===================== Urgencias Respiratorias =====================
  {
    nombre: 'Bromuro de Ipratropio',
    categoria: 'Urgencias Respiratorias',
    dosisMgKg: 250,
    dosisTexto: '<20 kg: 250 mcg (1 mL) | ≥20 kg: 500 mcg (2 mL)',
    unidadDosis: 'mcg',
    esDosiFija: true,
    dosisFijaTexto: 'Dosis fija según peso: <20 kg = 250 mcg; ≥20 kg = 500 mcg',
    frecuencia: 'Cada 20 min (máx 3 dosis en 1 hora)',
    numTomasDia: 'Máx 3 dosis en la primera hora',
    presentaciones: [
      { nombre: 'Sol. para nebulizar 250mcg/mL (2mL)', concentracion: 250, unidadConcentracion: 'mcg/mL' },
      { nombre: 'Sol. para nebulizar 500mcg/2mL', concentracion: 250, unidadConcentracion: 'mcg/mL' },
    ],
    via: 'Nebulización',
    notas: 'Asociar SIEMPRE a salbutamol nebulizado. En crisis asmática moderada-severa.',
    fuente: 'https://www.guiafarmapediatrica.es/indice/farmacos-de-uso-en-emergencias/urgencias-respiratorias/bromuro-de-ipratropio-nebulizado',
  },

  // ===================== Cardiovascular / Metabólico =====================
  {
    nombre: 'Bicarbonato de Sodio',
    categoria: 'ACLS / Metabólico',
    dosisMgKg: 1,
    dosisTexto: '1 mEq/kg',
    unidadDosis: 'mEq',
    frecuencia: 'Dosis única, repetir según gasometría',
    numTomasDia: 'Según respuesta (gasometría)',
    presentaciones: [
      { nombre: 'Ampolla 1mEq/mL (8.4%)', concentracion: 1, unidadConcentracion: 'mEq/mL' },
      { nombre: 'Ampolla 0.5mEq/mL (4.2%) - neonatos', concentracion: 0.5, unidadConcentracion: 'mEq/mL' },
    ],
    maxDosisPorToma: 50,
    via: 'IV lento',
    notas: 'Diluir 1:1 con agua destilada en neonatos. Infundir lento (1-2 min). Verificar gasometría antes de repetir.',
    fuente: 'https://www.guiafarmapediatrica.es/indice/farmacos-de-uso-en-emergencias/urgencias-respiratorias/bicarbonato',
    alertas: ['Dosis máx por toma: 50 mEq', 'En neonatos usar concentración al 4.2%'],
  },
  {
    nombre: 'Lidocaína',
    categoria: 'ACLS / Arritmias',
    dosisMgKg: 1,
    dosisTexto: '1 mg/kg IV',
    unidadDosis: 'mg',
    frecuencia: 'Bolo IV. Se puede repetir cada 5-10 min',
    numTomasDia: 'Máx 3 dosis (3 mg/kg total)',
    presentaciones: [
      { nombre: 'Ampolla 100mg/5mL (20mg/mL)', concentracion: 20, unidadConcentracion: 'mg/mL' },
      { nombre: 'Ampolla 200mg/10mL (20mg/mL)', concentracion: 20, unidadConcentracion: 'mg/mL' },
      { nombre: 'Ampolla 2% (20mg/mL)', concentracion: 20, unidadConcentracion: 'mg/mL' },
    ],
    maxDosisPorToma: 100,
    maxDosisPorDia: 300,
    via: 'IV',
    alertas: ['Dosis máx por toma: 100 mg', 'Dosis máx acumulada: 3 mg/kg'],
  },
  {
    nombre: 'Adenosina',
    categoria: 'ACLS / Arritmias',
    dosisMgKg: 0.1,
    dosisTexto: '0.1 mg/kg (1ª dosis), 0.2 mg/kg (2ª dosis)',
    unidadDosis: 'mg',
    frecuencia: 'Bolo IV rápido seguido de flush SSN',
    numTomasDia: 'Máx 2 dosis',
    presentaciones: [
      { nombre: 'Ampolla 6mg/2mL (3mg/mL)', concentracion: 3, unidadConcentracion: 'mg/mL' },
      { nombre: 'Ampolla 12mg/4mL (3mg/mL)', concentracion: 3, unidadConcentracion: 'mg/mL' },
    ],
    maxDosisPorToma: 6,
    via: 'IV rápido (con flush)',
    notas: 'Administrar en bolo IV rápido seguido de 5-10 mL de SSN. Si no efecto, segunda dosis: 0.2 mg/kg (máx 12 mg).',
    alertas: ['1ª dosis máx: 6 mg', '2ª dosis máx: 12 mg'],
  },

  // ===================== Sedación / Intubación =====================
  {
    nombre: 'Ketamina',
    categoria: 'Sedación / Intubación',
    dosisMinMgKg: 1,
    dosisMaxMgKg: 2,
    dosisMgKg: null,
    dosisTexto: '1-2 mg/kg IV | 4-5 mg/kg IM',
    unidadDosis: 'mg',
    frecuencia: 'Dosis única para intubación',
    numTomasDia: 'Dosis única',
    presentaciones: [
      { nombre: 'Vial 500mg/10mL (50mg/mL)', concentracion: 50, unidadConcentracion: 'mg/mL' },
      { nombre: 'Vial 200mg/20mL (10mg/mL)', concentracion: 10, unidadConcentracion: 'mg/mL' },
    ],
    via: 'IV / IM',
    notas: 'Agente de inducción de elección en asma grave y shock (mantiene PA). Broncodilatador.',
    alertas: ['Contraindicada en HTE', 'Puede causar laringoespasmo en lactantes'],
  },
  {
    nombre: 'Succinilcolina',
    categoria: 'Sedación / Intubación',
    dosisMinMgKg: 1,
    dosisMaxMgKg: 2,
    dosisMgKg: null,
    dosisTexto: '1-2 mg/kg IV | 3-4 mg/kg IM',
    unidadDosis: 'mg',
    frecuencia: 'Dosis única para intubación',
    numTomasDia: 'Dosis única',
    presentaciones: [
      { nombre: 'Ampolla 200mg/10mL (20mg/mL)', concentracion: 20, unidadConcentracion: 'mg/mL' },
      { nombre: 'Ampolla 100mg/5mL (20mg/mL)', concentracion: 20, unidadConcentracion: 'mg/mL' },
    ],
    via: 'IV / IM',
    notas: 'Relajante muscular despolarizante. Inicio de acción: 30-60 seg IV.',
    alertas: [
      'Contraindicada en hiperpotasemia, quemados >24h, miopatías',
      'Riesgo de hipertermia maligna',
    ],
  },
];
