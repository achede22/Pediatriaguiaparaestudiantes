# Descripción del archivo: dosis_ninos_Y_YOPAL_INTEGRADO.xlsx

## Propósito general

Este archivo es una **versión integrada y ampliada** de la calculadora de dosis pediátricas de Yopal. Combina dos calculadoras independientes en un solo libro, compartiendo el **mismo peso del paciente** entre todas las hojas. Incluye además una hoja auxiliar de referencia para Buscapina Compositum y una mini calculadora de cambio de divisas (uso personal del autor).

---

## Estructura del archivo — 4 hojas

| Hoja | Contenido |
|------|-----------|
| `Hoja1` | Calculadora de cambio de divisas (Dólar / Peso colombiano / Bolívar) |
| `dosis` | Calculadora avanzada de dosis pediátricas (hoja principal nueva) |
| `Hoja3` | Referencia de composición de Buscapina Compositum |
| `YOPAL` | Calculadora clásica de Yopal (idéntica al archivo DOSIS_PEDIATRICA_-_YOPAL.xlsx, pero ahora **enlazada** a `dosis`) |

---

## INTEGRACIÓN CLAVE: peso compartido entre hojas

- La **celda maestra de peso** es `dosis!C1` (valor por defecto: **9.5 kg**).
- La hoja `YOPAL` lee el peso con la fórmula `=dosis!C1` en su celda C6.
- Cambiar el peso en `dosis!C1` actualiza automáticamente **todas las dosis en ambas hojas**.

---

## Hoja1 — Calculadora de divisas

Pequeña tabla de conversión entre tres monedas. No tiene relación clínica.

| Sección | Descripción |
|---------|-------------|
| Tasas de cambio | `B2` = tasa Peso/Dólar (ej: 2500); `C2` = tasa Bolívar/Dólar (ej: 1000) |
| Bloque USD→ | Ingresa dólares → calcula Pesos y Bolívares |
| Bloque Bolívar→ | Ingresa Bolívares → calcula Pesos y Dólares |
| Bloque Peso→ | Ingresa Pesos → calcula Dólares y Bolívares |

---

## Hoja `dosis` — Calculadora avanzada (NUEVA)

Esta es la hoja central y más compleja. Cubre medicamentos con protocolos especiales que no estaban en el archivo YOPAL original.

### Fila de resumen rápido (fila 2, columnas Y–AG)

La fila 2 actúa como **panel de resultados** con referencias cruzadas a los valores calculados más usados:

| Columna | Valor mostrado |
|---------|----------------|
| Y | Peso del niño (`=C1`) |
| Z | DIPIRONA en ML |
| AA | DIPIRONA en MG |
| AB | DEXAMETASONA en ML |
| AC | DEXAMETASONA en MG |
| AD | HIOSCINA ML |
| AE | HIOSCINA MG |
| AF | DICLOFENAC MG |
| AG | DICLOFENAC ML |

---

### Medicamentos incluidos en la hoja `dosis`

#### 1. CLORFENIRAMINA
- **Dosis:** 0.2–0.4 mg/kg/día
- **Presentación:** Jar. 2mg/5mL | Amp 2G/5mL
- **Fórmula min cc:** `((0.2×peso×5)/2)/3`
- **Fórmula max cc:** `((0.4×peso×5)/2)/3`

#### 2. DIPIRONA (Metamizol)
- **Dosis:** 10 mg/kg/dosis
- **Presentación:** Amp 2G/5mL (1gr/2mL)
- **Fórmula ml:** `((10×peso)/1000)×2` cc
- **Fórmula mg:** `(1000×cc_calculado)/2`
- Incluye referencia a **Guía Colombiana de Deshidratación** (ver abajo)

#### 3. DEXAMETASONA
- **Uso principal:** CROUP (laringotraqueobronquitis)
- **Dosis:** 0.3–0.6 mg/kg/dosis única
- **Presentación:** Amp 4mg/mL
- **Fórmula min cc:** `((0.3/4)×peso)/3`
- **Fórmula max cc:** `((0.6/4)×peso)/3`
- **Dosis máxima:** 10 mg
- Incluye tabla comparativa de **equivalencias de corticoides** (filas 12–19):

| Corticoide | Potencia relativa (mg) |
|---|---|
| Cortisona | 25 |
| Hidrocortisona | 20 |
| Prednisolona | 5 |
| Prednisona | 5 |
| Metilprednisolona | 5 |
| Triamcinolona | 5 |
| Dexametasona | 0.75 |
| Betametasona | 0.6 |

Las fórmulas calculan la dosis equivalente de cualquier corticoide respecto a la dexametasona.

#### 4. ACETAMINOFÉN
- **Dosis:** 10–15 mg/kg/dosis
- **Presentación:** 150mg/5mL
- **Fórmula min cc:** `((10×peso)/150)×5`
- **Fórmula max cc:** `((15×peso)/150)×5`

#### 5. TRAMADOL
- **Indicación:** Mayores de 12 años
- **Dosis:** 1–2 mg/kg, unidosis
- **Presentación:** Amp 50mg/mL
- **Fórmula cc:** `(1×peso)/50` a `(2×peso)/50`
- **Fórmula mg:** `cc × 50`

#### 6. ADRENALINA (anafilaxis)
- **Dosis:** 0.01 mg/kg (mín calculado), máx 0.3–0.5 mg (USA) / 0.5–1 mg (UE)
- **Presentación:** Amp 1mg/mL
- **Fórmula cc:** `peso × 0.01` (máx 0.3 cc automático en D26)
- **Nota:** Para niños de 10–15 kg

#### 7. METOCLOPRAMIDA
- **Restricción:** NO usar en menores de 1 año
- **Dosis <6 años:** 0.02 mg/kg → `0.02×peso` cc (Amp 10mg/2cc)
- **Dosis 6–14 años:** 0.5–1 cc (2.5–5 mg)
- **Fórmula mg:** `(10×cc)/2`

#### 8. LORATADINA
- Solo referencia textual (Medscape). Sin fórmula de cálculo.

#### 9. CETIRIZINA / HIOSCINA BUTIL BROMURO
- **Cetirizina:** referencia Medscape
- **Hioscina butil bromuro (Buscapina):** Amp 20mg/1mL
  - **>6–12 años:** 5–10 mg/dosis → 0.25–0.5 mL fijo (col D)
  - **<6 años:** 0.3–0.6 mg/kg/dosis → `peso×0.015` a `peso×0.03` ml (col F–G)
  - **Dosis máxima:** 1.5 mg/día
  - **Conversión a mg:** `ml×20`
  - **Conversión con amp 5mL:** `ml_calculado×5`

#### 10. ONDANSETRÓN
- **Presentación:** Amp 8mg/4mL | Vial 40mg/20mL
- **Protocolo por peso:**
  - `<15 kg` → 2 mg dosis única
  - `>15 kg ≤30 kg` → 4 mg o EV: 0.15 mg/kg → fórmula `0.15×peso` mg
  - **Máximo:** 8 mg/día
  - **Fórmula cc EV:** `(D52×4)/8` cc

#### 11. ZINC
- **Presentaciones:** Gotas 10mg/mL | Susp. oral 2mg/mL
- **Protocolos:**
  - `<6 meses` → 10 mg/día
  - `>6 meses <5 años` → 20 mg/día × 10–14 días

#### 12. SALBUTAMOL ENDOVENOSO (Asma Grave)
Sección de mayor complejidad del archivo. Tiene dos subbloques:

**A) Bolo de carga:**
- Dosis: 10–15 mcg/kg en solución 0.9%
- Amp 0.5mg/mL (200 mcg/mL)
- **Fórmula cc ampolla:** `D61 / (D63×1000)` (donde D61=peso×dosis_mcg, D63=0.5mg/mL)
- **Fórmula cc solución 0.9%:** `10 - cc_ampolla`

**B) Infusión continua:**
- Dosis: 0.3 mcg/kg/min (G62), MAX 2 mcg/kg/min
- **Fórmula cc ampolla infusión:** `(peso × G63 × 60 × G62) / 500`
- **Fórmula cc SSN infusión:** `(G64 × 9.6) / (200 / (D63×1000))`
- **Total solución:** `G64 + G65`
- Incluye cálculo de **velocidad en ml/hora** y **gotas por minuto** (con drop factors 60, 20, 15, 10)

**C) Inhalación:**
- `0.15 mg/kg/dosis + 3 cc de SSN 0.9%`
- Presentación: Sol 5mg/mL o 0.5mg/mL
- **Fórmula mg:** `0.15 × peso`
- **Fórmula cc:** `mg / 5` (según concentración 5mg/mL)

#### 13. SULFATO DE MAGNESIO
- **Indicaciones:** Broncoespasmo / tocólisis
- **Presentación:** Amp 10mL al 15%–20% (2g/10cc)
- **Dosis bolo:** 25–40–75 mg/kg en 20 min (celda C70 seleccionable, default 40)
- **Fórmula mg total:** `peso × C70`
- **Fórmula cc:** `(mg_total × 10) / (C71 × 100)` — donde C71 = % de la ampolla
- **Máximo:** 2 g
- **Infusión tocólisis:** 5 amp en 500 cc → 55 cc/hora

#### 14. PENICILINA CRISTALINA
- **Dosis:** 250.000 U/kg/día EV
- **Esquema:** 6 dosis × 7 días (neumonía)
- Sin fórmula de cálculo en celda (referencia textual)

#### 15. AMPICILINA
- **Dosis:** 90–200 mg/kg/día
- **Esquema:** 4 dosis × 7 días (neumonía)
- Sin fórmula de cálculo en celda (referencia textual)

#### 16. DICLOFENAC SÓDICO
- **Presentación:** 75mg/3mL
- **Dosis:** 1 mg/kg
- **Fórmula mg:** `1 × peso`
- **Fórmula mL:** `(peso × 3) / 75`

---

### Protocolo de DESHIDRATACIÓN (columnas E–O, filas 4–15)

Calculadora integrada de reposición hídrica con dos fases:

**Fase 1 — Expansión:**
- Solución D5W o SSN
- 10–20–30 mL/kg en 30 min (seleccionable en F9, default 10)
- Fórmula cc bolo 30 min: `peso × F9`
- Protocolo alternativo: 70 mg/kg en 5.5 horas → `peso × 70` cc

**Fase 2 — Mantenimiento (Holliday-Segar implícito):**
- Distribución en 3 tiempos: 1ra hora (50 mL/kg), 2da hora (25), 3ra hora (25)
- Fórmulas: `peso × K4`, `peso × K5`, `peso × K6`
- Total: `M4 + M5 + M6`

**Cálculo de velocidad de infusión:**
- mL/hora: `(O4 × O7) / (O9 × 60)`
- Gotas/minuto (drop factor seleccionable): `(O4 / O9) × factor`
- Intervalo en segundos: `60 / gotas_por_minuto`
- Gotas en 5 seg: `5 / intervalo`
- Gotas en 10 seg: `10 / intervalo`

---

## Hoja3 — Buscapina Compositum (referencia)

Tabla de composición del medicamento combinado Hioscina + Metamizol (Dipirona):

| Presentación | Hioscina (mg) | Metamizol (mg) |
|---|---|---|
| 1 comprimido | 10 | 250 |
| 30 gotas | 10 | 500 |
| Amp 5cc | 20 | 2500 |
| Comp (franja) | 10 | 250 |
| Amp 1cc | 4 | 500 |
| 0.5 cc diluido | 10 mg rec. | — |

- Referencia cruzada al peso del paciente: `=dosis!C1` (celda K8)
- Cálculo de dipirona 10 mg/kg: `K8 × 10` mg → `(mg × 5) / 2500` cc
- Recomendación de Dipirona 0.5 cc y Buscapina 0.5 cc marcada

---

## Hoja `YOPAL` — Calculadora clásica (integrada)

**Contenido idéntico** al archivo `DOSIS_PEDIATRICA_-_YOPAL.xlsx` descrito anteriormente, con una diferencia clave:

> La celda C6 (peso) ya no es entrada manual. Ahora lee `=dosis!C1`, tomando el peso de la hoja `dosis`.

Incluye exactamente las mismas 15 categorías del archivo original, **más una categoría adicional**:

### Categoría adicional en YOPAL (respecto al archivo original):

**ANTICONVULSIVANTES** (expandida):
| Medicamento | Dosis (mg/kg) | Frecuencia | Presentación |
|---|---|---|---|
| Ácido Valproico | 15 | C/12 H | Jar 250/5 (120mL), Sol Iny 100/mL |
| Carbamazepina | 10 | C/8 H | Sus 100/5 (120mL), Tab 200–400mg |
| Clonazepam | 0.03 | C/8 H | Amp 1mg/mL, Tab 0.5–2mg |
| Diazepam | 0.3 | Dosis única | Amp 5mg/mL |
| Fenitoína | 10 | Bolo IV | Jar 125/5, Amp 50/mL |
| Fenobarbital | 3.5 | C/12 H | Amp 40–200mg/mL |
| Midazolam | 0.05 | Bolo IV | Amp 5mg/5mL |

**ANTIHISTAMÍNICOS** (ampliados con):
| Medicamento | Dosis (mg/kg) | Frecuencia | Presentación |
|---|---|---|---|
| Ketotifeno | 0.05 | C/12 H | Jar 1/5mL (100mL), Tab 1mg, Got 20=1mg |
| Loratadina | 0.2 | Cada día | Jar 5/5 (100mL), Tab 10mg |

---

## Resumen de diferencias vs. DOSIS_PEDIATRICA_-_YOPAL.xlsx

| Aspecto | YOPAL original | INTEGRADO (este archivo) |
|---|---|---|
| Hojas | 3 (Hoja1, Hoja2, Hoja3) | 4 (Hoja1, dosis, Hoja3, YOPAL) |
| Peso compartido | No (cada hoja independiente) | Sí (`dosis!C1` →  `YOPAL!C6`) |
| Calculadora avanzada | No | Sí (hoja `dosis`) |
| Protocolos especiales | No | Sí (deshidratación, croup, salbutamol IV, sulfato Mg, anafilaxis, ondansetrón) |
| Equivalencias corticoides | No | Sí (tabla 8 corticoides) |
| Buscapina Compositum | No | Sí (Hoja3) |
| Calculadora de divisas | No | Sí (Hoja1) |
| Anticonvulsivantes | 4 fármacos | 7 fármacos (+ valproico, carbamazepina, clonazepam) |
| Antihistamínicos | 3 fármacos | 5 fármacos (+ ketotifeno, loratadina) |

---

## Notas técnicas para el procesamiento

1. **Peso de entrada único:** `dosis!C1` — todo el libro se recalcula al cambiar este valor.
2. Las fórmulas en la hoja `dosis` usan referencias relativas (`C1`, `C8`, etc.) sin anclar a C6 como celda maestra — la estructura es más libre que en YOPAL.
3. Algunas celdas contienen **fórmulas anidadas complejas** para salbutamol IV que dependen de múltiples parámetros (G62, G63, D63) — cambiar cualquiera de esas celdas afecta la infusión.
4. La columna H de la hoja YOPAL contiene `IV`, `IM`, `VO` como texto cuando el medicamento no tiene conversión a cc automática.
5. `Hoja3!K8` referencia al peso con `=dosis!C1` — también integrada.
6. El valor de Penicilina Benzatínica en YOPAL (col L36) tiene un número suelto `24228203` — parece un artefacto o anotación residual, no es funcional.