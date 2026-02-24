# Protocolos de Urgencia Pediátrica — Referencia Rápida

> **Fuente:** Pediadosis, Yopal Colombia + Guía Colombiana de Deshidratación
> **Variable clave:** Peso del paciente en kg

---

## 1. ACLS/BLS — Reanimación Pediátrica

| Medicamento | Dosis (mg/kg) | Frecuencia | Presentación | Vía | Indicación |
|---|---|---|---|---|---|
| Adenosina | 0.1 | Bolo IV rápido | Amp 6mg/2mL | IV | TSV |
| Adrenalina | 0.01 | C/3–5 min | Amp 1mg/mL | IV/IO | Paro cardíaco |
| Atropina | 0.01 | Dosis única | Amp 1mg/mL | IV | Bradicardia |
| Amiodarona | 5 (bolo) / 10 (mantenimiento) | Bolo / C/12 H ×10d | Tab 200mg | IV/VO | FV/TV sin pulso |
| Dobutamina | 2.5 | Infusión continua | Amp 12.5mg/mL | IV | Shock cardiogénico |
| Dopamina | 2–20 mcg/kg/min | Infusión continua | Amp 40mg/mL | IV | Shock |
| Norepinefrina | 0.05–0.1 | Infusión continua | Amp 1mg/mL | IV | Shock séptico/vasodilatador |

### Secuencia de RCP pediátrica:
1. **Adrenalina 0.01 mg/kg IV** (máx 1 mg) cada 3–5 min
2. Si FV/TV: **Desfibrilación 2 J/kg** → 4 J/kg → repetir
3. **Amiodarona 5 mg/kg IV** tras 3er choque (máx 300 mg)
4. Evaluar causas reversibles (5H y 5T)

---

## 2. INTOXICACIONES — Antídotos

| Tóxico | Antídoto | Dosis (mg/kg) | Frecuencia | Presentación | Vía |
|---|---|---|---|---|---|
| Metanol/Etilenglicol | Alcohol etílico | 1 | C/2–4 H | Alcohol etílico 96° | IV |
| Organofosforados | Atropina | 0.05 | C/10–20 min | Amp 1mg/mL | IV |
| General (VO <2h) | Carbón activado | 1 g/kg | C/2–4 H | Polvo bolsa 1 libra | VO |
| Benzodiacepinas | Flumazenil | 0.01 | Bolo IV | Amp 0.5mg/5mL | IV |
| Opioides | Naloxona | 0.01 | C/10–15 min | Amp 0.4mg/mL | IV |
| Anticolinérgicos | Neostigmina | 0.01 | C/3–4 H | Amp 0.5mg/mL | IV |

> ⚠️ **ATENCIÓN:** La Atropina en intoxicaciones (0.05 mg/kg) es **5 veces mayor** que en ACLS (0.01 mg/kg). No confundir dosis.

---

## 3. ANAFILAXIS — Protocolo con Adrenalina

### Dosis de Adrenalina IM:
```
Dosis = 0.01 mg/kg (= 0.01 mL/kg de amp 1mg/mL)
```

| Parámetro | Valor |
|---|---|
| Dosis | 0.01 mg/kg |
| Presentación | Amp 1mg/1mL |
| Fórmula cc | `peso × 0.01` mL |
| Máximo USA | 0.3 mL (niños) |
| Máximo UE | 0.5 mL (niños) |
| Máximo adultos | 0.5–1.0 mL |
| Repetir | C/5–15 min si no responde |
| Vía preferida | IM (cara anterolateral del muslo) |

### Ejemplo — Niño 15 kg:
```
Dosis = 15 × 0.01 = 0.15 mL IM
Máx permitido: 0.3 mL → ✅ dentro de rango
```

---

## 4. DESHIDRATACIÓN — Protocolo de Reposición Hídrica

### Fase 1 — Expansión (Bolo)

| Parámetro | Valor | Fórmula |
|---|---|---|
| Solución | SSN 0.9% o D5W | — |
| Dosis estándar | 10–20–30 mL/kg | Seleccionable |
| Tiempo | 30 minutos | — |
| **cc a pasar** | — | `peso × mL_seleccionado` |
| Alternativa (OMS) | 70 mL/kg en 5.5 horas | `peso × 70` cc |

### Fase 2 — Mantenimiento (Holliday-Segar implícito)

| Tiempo | mL/kg | Fórmula |
|---|---|---|
| 1ra hora | 50 | `peso × 50` cc |
| 2da hora | 25 | `peso × 25` cc |
| 3ra hora | 25 | `peso × 25` cc |
| **Total** | 100 mL/kg | `suma de las 3 fases` |

### Cálculo de velocidad de infusión

| Cálculo | Fórmula |
|---|---|
| mL/hora | `volumen_total / horas` |
| Gotas/minuto | `(volumen_total / (horas × 60)) × factor_goteo` |
| Intervalo (seg) | `60 / gotas_por_minuto` |
| Gotas en 5 seg | `5 / intervalo` |
| Gotas en 10 seg | `10 / intervalo` |

**Factores de goteo comunes:**
| Equipo | Gotas/mL |
|---|---|
| Macrogotero | 10, 15 o 20 |
| Microgotero | 60 |

---

## 5. SALBUTAMOL IV — Asma Grave

### A) Bolo de carga

| Parámetro | Valor | Fórmula |
|---|---|---|
| Dosis | 10–15 mcg/kg | — |
| Presentación | Amp 0.5mg/mL (= 500 mcg/mL) | — |
| **mcg totales** | — | `peso × dosis_mcg` |
| **cc ampolla** | — | `mcg_totales / 500` |
| **cc SSN 0.9%** | — | `10 - cc_ampolla` |
| Administrar en | Bolo lento | — |

### B) Infusión continua

| Parámetro | Valor | Fórmula |
|---|---|---|
| Dosis inicio | 0.3 mcg/kg/min | — |
| Dosis máxima | 2 mcg/kg/min | — |
| **cc ampolla/hora** | — | `(peso × dosis × 60) / 500` |
| **cc SSN** | — | Calcular para completar volumen |
| **Velocidad mL/hora** | — | Según dilución |

### C) Inhalación (Nebulización)

| Parámetro | Valor | Fórmula |
|---|---|---|
| Dosis | 0.15 mg/kg/dosis | — |
| Presentación | Sol 5mg/mL o 0.5mg/mL | — |
| **mg totales** | — | `0.15 × peso` |
| **cc** (5mg/mL) | — | `mg / 5` |
| Diluir en | 3 cc SSN 0.9% | — |

---

## 6. SULFATO DE MAGNESIO — Broncoespasmo / Tocólisis

| Parámetro | Valor | Fórmula |
|---|---|---|
| Presentación | Amp 10mL al 15–20% (2g/10cc) | — |
| Dosis bolo | 25–40–75 mg/kg (default 40) | — |
| **mg totales** | — | `peso × dosis_seleccionada` |
| **cc** | — | `(mg_total × 10) / (% × 100)` |
| Máximo | 2 g (= 2000 mg) | — |
| Infundir en | ≥20 minutos | — |
| Infusión tocólisis | 5 amp en 500 cc SSN → 55 cc/hora | — |

### Ejemplo — Niño 10 kg, 40 mg/kg, amp 20%:
```
mg totales = 10 × 40 = 400 mg
cc = (400 × 10) / (20 × 100) = 2 cc
Máx 2g → 400 mg ✅ dentro de rango
Infundir en 20 min mínimo
```

---

## 7. CROUP — Dexametasona

| Parámetro | Valor | Fórmula |
|---|---|---|
| Dosis | 0.3–0.6 mg/kg (dosis única) | — |
| Presentación | Amp 4mg/mL | — |
| **cc mínimo** | — | `(0.3 × peso) / 4` |
| **cc máximo** | — | `(0.6 × peso) / 4` |
| Máximo absoluto | 10 mg | — |
| Vía | VO/IM/IV | — |

---

## Convenciones

| Abreviatura | Significado |
|---|---|
| IV | Intravenoso |
| IO | Intraóseo |
| IM | Intramuscular |
| VO | Vía oral |
| INH | Inhalación/Nebulización |
| SSN | Solución Salina Normal 0.9% |
| D5W | Dextrosa al 5% en agua |
| FV | Fibrilación ventricular |
| TV | Taquicardia ventricular |
| TSV | Taquicardia supraventricular |
| PRN | Por razón necesaria (a demanda) |
