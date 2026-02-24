# Descripción del archivo: DOSIS_PEDIATRICA_-_YOPAL.xlsx

## Propósito general

Este archivo Excel es una **calculadora de dosis pediátricas** utilizada en contexto clínico (Yopal, Colombia). Permite calcular la dosis final de medicamentos para niños basándose en el **peso del paciente**. La fuente de referencia es **Pediadosis**.

---

## Estructura del archivo

El archivo tiene 3 hojas:
- **Hoja1**: Contenido principal (calculadora completa de medicamentos)
- **Hoja2**: Solo contiene una celda con el valor `DOLEX` (sin uso funcional aparente)
- **Hoja3**: Vacía

---

## Hoja1 — Estructura detallada

### Bloque de cabecera (filas 1–3)

- **Fila 1 (encabezado de la mini-calculadora superior):** `MEDICAMENTOS | PESO (Kg) | DOSIS (mg/Kg) | TOTAL (mg) | FRECUENCIA (horas) | PRESENTACION (mg/mL) | DOSIS FINAL (cc) | PESO | DOSIS/DIA/MG | MG | ML | TOMAS | HORAS | DOSIS/ML | GOTAS | DOSIS GOTAS`
- **Fila 2:** Fila de entrada/cálculo rápido. El usuario ingresa peso (ej: 30 kg) y concentración; las columnas calculan automáticamente ml, gotas y dosis por toma con fórmulas Excel.
- **Fila 3:** Instrucciones al usuario:
  > "Las flechas indican las columnas en que se deben cambiar los datos. Obligatoria la amarilla, el resto son opcionales dependiendo de la patología. Leer todos los comentarios de cada celda. Confirmar en Pediadosis."

### Columnas principales (filas 4 en adelante)

| Columna | Contenido |
|---------|-----------|
| B | Nombre del medicamento (o categoría en filas de sección) |
| C | Peso del paciente en kg (referencia cruzada a C6, C7, etc. — una sola celda de peso se propaga) |
| D | Dosis en mg/kg |
| E | Total mg = `C * D` (fórmula) |
| F | Frecuencia de administración |
| G | Presentación comercial disponible (ej: "Jar. 150/5 – Fco 90mL") |
| H | Dosis final en cc/mL (fórmula derivada) o indicación de vía: `IV`, `IM`, `VO` |

### Lógica de peso

- **C6 es la celda maestra de peso.** La mayoría de medicamentos referencia `=C6`, `=C7`, `=C8`… que a su vez encadenan hacia C6.
- El clínico solo cambia el peso en C6 (o en la celda amarilla indicada) y todas las dosis se recalculan.

---

## Categorías de medicamentos incluidas (Hoja1)

Cada categoría tiene su propio encabezado de sección repetido (columnas B–H):

### 1. ANALGESICOS
| Medicamento | Dosis (mg/kg) | Frecuencia | Presentación | Dosis final (fórmula) |
|---|---|---|---|---|
| Acetaminofén | 15 | C/4–6 H | Jar. 150/5 (90mL) | `(peso×15×5)/150` cc |
| Diclofenaco | 1 | C/12 H | Amp 75mg/3mL, Grag 50mg, Sus 90/5 | `E/2` |
| Dipirona | 20 | C/8 H | Amp 2g/5mL, Tab 500mg, Jar 250/5 | IV |
| Hioscina | 10 | C/8 H | Amp 20mg/mL, Grag 10mg | IV |
| Ibuprofeno | 10 | C/8 H | Sus 100/5 (120mL) | `(peso×10×5)/100` cc |
| Morfina | 0.1 | Bolo IV | Amp 10mg/mL | IV |
| Naproxeno | 20 | C/8–12 H | Sus 125/5 (60mL) | `(E×5/125)/3` cc |
| Tramadol | 1 | C/6–8 H | Amp 50–100mg/mL, Gt 40=100mg | `E` mg |

### 2. ANTIBIOTICOS
| Medicamento | Dosis (mg/kg) | Frecuencia | Presentación | Dosis final |
|---|---|---|---|---|
| Ácido Nalidíxico | 55 | C/8 H | Sus 250/5 (120mL) | `(E×5/250)/3` cc |
| Amikacina | 15 | C/8–12 H | Amp 100–500/2mL | IV |
| Amoxicilina | 80 | C/8 H ×10d | Sus 250/5 (100mL) | `(E×5/250)/3` cc |
| Ampicilina | 100 | C/8 H | Amp 500mg–1g, Jar 125–500/5 | `(E×5/250)/3` cc |
| Ampicilina/Sulbactam | 50 | C/6–12 H | Sus 250/5, Tab, Amp | `(E×5/250)/2` cc |
| Azitromicina | 10 | C/día ×3d | Sus 200/5 (15–30mL) | `(E×5/200)` cc |
| Cefalotina | 150 | C/4–6 H | Fco-amp 1g/10mL | IV |
| Cefalexina | 30 | C/6 H | Sus 250/5 (100mL) | `(E×5/250)/3` cc |
| Cefazolina | 50 | C/8 H | Amp 500mg–1g | IV |
| Ceftriaxona | 50 | C/12–24 H | Amp 250mg–1g | IV |
| Ciprofloxacina | 20 | C/12 H | Sus 250/5, Tab 500mg | `(E×5/250)/2` cc |
| Claritromicina | 15 | C/12 H ×5–10d | Sus 250/5 (50mL) | `(E×5/250)/2` cc |
| Clindamicina | 30 | C/6 H | Caps 300mg, Amp 600/4mL | IV |
| Dicloxacilina | 50 | C/6 H | Sus 125mg (100mL) | `(E/125)/4` cc |
| Doxiciclina | 5 | C/12 H | Caps 100mg | VO |
| Eritromicina | 50 | C/6 H ×10d | Sus 250/5 (60mL) | `(E×5/250)/4` cc |
| Gentamicina | 6 | C/8 H | Amp 40–80mg/mL | IV |
| Metronidazol | 15 | C/6 H | Sol iny 100mg/500mL | IV |
| Oxacilina | 100 | C/6 H | Amp 1–2g | IV |
| Penicilina Benzatínica | 50.000 U/kg | Dosis única | Fco-amp 1.200.000–2.400.000 U | IM |
| Penicilina G Cristalina | 200 | C/6 H | Fco-amp 1.000.000 U | IV |
| Penicilina V Oral | 50 | C/6–8 H | Sus 250/5 (100mL) | `(E×5/250)/4` cc |
| Trimetoprim/Sulfametoxazol | 8 | C/12 H ×5–10d | Sus 40/200mg/5mL | VO |

### 3. ANTIVIRALES
| Medicamento | Dosis (mg/kg) | Frecuencia | Presentación | Dosis final |
|---|---|---|---|---|
| Aciclovir* | 30 | C/6 H ×7–10d | Sus 200/5, Tab 200–800mg, Amp 20mg/mL | `(E×5/200)` cc |

### 4. ANTIPARASITARIOS
| Medicamento | Dosis (mg/kg) | Frecuencia | Presentación | Dosis final |
|---|---|---|---|---|
| Albendazol | 15 | Dosis única | Sus 400/10 (10mL), Tab 200–400mg | `(E×10)/400` cc |
| Ivermectina | 1 | Dosis única | 30 gt=6mg, Fco 5mL, Cap 3mg | `E` mg |
| Mebendazol | 100 mg fijo | C/12 H ×3d | Tab 100mg, Sus 100/5 | — |
| Metronidazol | 5 | C/8 H ×7d | Sus 250/5, Tab 250–500mg | `(E×5/250)/3` cc |
| Pamoato de Pirantel | 10 | Dosis única | Sus 250/5 (15mL) | `(E×5)/250` cc |
| Secnidazol | 30 | Dosis única | Sus 500mg, Tab 250–500mg | VO |
| Tinidazol | 60 | Dosis única | Sus 200/mL, Tab 500mg | `(E)/200` cc |

### 5. ANTIMICÓTICOS
| Medicamento | Dosis (mg/kg) | Frecuencia | Presentación | Dosis final |
|---|---|---|---|---|
| Ketoconazol | 5 | Dosis única | Sus 20/1 (60mL), Tab 200mg | `E/20` cc |
| Fluconazol | 2 | Cada día ×2 sem | Sus 200/5, Cap 150–200mg | `(E×5/200)` cc |
| Anfotericina B | 0.4 | En 2–6 H | Amp 50/10mL | IV |
| Nistatina | 1 | C/6 H ×15d | Sus 100.000 U/mL (60mL) | VO |

### 6. ANTIHISTAMÍNICOS
| Medicamento | Dosis (mg/kg) | Frecuencia | Presentación | Dosis final |
|---|---|---|---|---|
| Cetirizina | 0.5 | Cada día | Jar 5/5 (60mL), Tab 10mg | `(E×5)/5` cc |
| Desloratadina | 5 mg fijo | Cada día | Jar 2.5/5, Tab 5mg | VO |
| Hidroxicina | 2 | C/8–12 H | Jar 2.5/mL (120mL), Tab 25mg, Amp 100/2mL | `(E/2.5)/3` cc |

### 7. ANTICONVULSIVANTES (sección implícita)
| Medicamento | Dosis (mg/kg) | Frecuencia | Presentación | Dosis final |
|---|---|---|---|---|
| Diazepam | 0.3 | Dosis única | Amp 5mg/mL (2mL), Tab 10mg | IV |
| Fenitoína | 10 | Bolo IV | Jar 125/5 (240mL), Amp 50/mL | IV |
| Fenobarbital | 3.5 | C/12 H | Amp 40–200mg/mL, Tab 10–50mg | IV |
| Midazolam | 0.05 | Bolo IV | Amp 5mg/5mL, Tab 7.5mg | IV |

### 8. CORTICOIDES
| Medicamento | Dosis (mg/kg) | Frecuencia | Presentación | Dosis final |
|---|---|---|---|---|
| Betametasona | 0.125 | C/6–12 H | Amp 4mg/mL, Tab 0.5–2mg | IV |
| Dexametasona | 0.3 | C/6 H | Amp 4mg/mL (2mL) | IV |
| Metilprednisolona | 10 | Bolo IV | Amp 40mg/mL, Tab 4–16mg | IV |

### 9. ANTIEMÉTICOS / GASTROPROTECCIÓN
| Medicamento | Dosis (mg/kg) | Frecuencia | Presentación | Dosis final |
|---|---|---|---|---|
| Alizaprida | 5 | C/8–12 H | Tab 50mg, Amp 50/2mL | IV |
| Dolasetrón | 1.8 | Dosis única | Tab 100mg, Sol 10mg/mL | IV |
| Metoclopramida | 0.4 | C/8 H | Tab 10mg, Amp 10/2mL, Jar 1mg/mL | `E/3` cc |
| Ranitidina* | 4 | C/12 H | Tab 150–300mg, Amp 50/2mL, Jar 75mg/5mL | `(E×5/75)/2` cc |

### 10. BRONCODILATADORES
| Medicamento | Dosis (mg/kg) | Frecuencia | Presentación | Dosis final |
|---|---|---|---|---|
| Montelukast | 4 mg fijo | Noche | Tab 4–10mg | VO |
| Prednisolona | 1 | C/12 H ×3–5d | Tab 5mg, Sol 1mg/mL (100mL) | `(E×1)/2` cc |
| Salbutamol | 0.15 | C/6 H | Jar 2/5 (170mL) | `(E×5)/2` cc |
| Terbutalina | 0.1 | C/6 H | Sol neb 10mg/mL, Jar 0.3mg/mL | `E/0.3` cc |

### 11. ACLS / BLS (Reanimación)
| Medicamento | Dosis (mg/kg) | Frecuencia | Presentación | Dosis final |
|---|---|---|---|---|
| Adenosina | 0.1 | Bolo IV | Amp 6mg/2mL | IV |
| Adrenalina | 0.01 | C/3–5 min | Amp 1mg/mL | IV |
| Atropina | 0.01 | Dosis única | Amp 1mg/mL | IV |
| Amiodarona | 10 | C/12 H ×10d | Tab 200mg | VO |
| Dobutamina | 2.5 | Bolo IV | Amp 12.5mg/mL | IV |
| Dopamina | 10 | Bolo IV | Amp 40mg/mL | IV |
| Norepinefrina | 0.05 | Bolo IV | Amp 1mg/mL | IV |

### 12. INTOXICACIONES (antídotos)
| Medicamento | Dosis (mg/kg) | Frecuencia | Presentación | Dosis final |
|---|---|---|---|---|
| Alcohol etílico | 1 | C/2–4 H | Alcohol etílico 96° | IV |
| Atropina | 0.05 | C/10–20 min | Amp 1mg/mL | IV |
| Carbón activado | 1 g/kg | C/2–4 H | Polvo bolsa 1 libra | VO |
| Flumazenil | 0.01 | Bolo IV | Amp 0.5mg/5mL | IV |
| Naloxona | 0.01 | C/10–15 min | Amp 0.4mg/mL | IV |
| Neostigmina | 0.01 | C/3–4 H | Amp 0.5mg/mL | IV |

### 13. SNC
| Medicamento | Dosis (mg/kg) | Frecuencia | Presentación |
|---|---|---|---|
| Amitriptilina | 1 | C/8 H | Tab 10–25mg VO |

### 14. DIARREA
| Medicamento | Dosis (mg/kg) | Frecuencia | Presentación | Dosis final |
|---|---|---|---|---|
| Bismuto subsalicilato | 100 | C/4 H | Sus 255/15 (12mL), Tab 262mg | `(E×15/255)/6` cc |
| Difenoxilato | 0.2 | C/6–8 H | Tab 2.5mg | VO |
| Loperamida | 0.2 | C/8–12 H | Sus 1/5 (60mL), Tab 2mg | `(E×5/1)/3` cc |

### 15. ELECTROLITOS
| Medicamento | Dosis | Frecuencia | Presentación |
|---|---|---|---|
| Hipopotasemia — Potasio | 3 mEq/kg | Bolo | Amp 2mEq=0.14g/mL (10mL) IV |
| Hiperpotasemia — Furosemida | 1 mg/kg | C/2–8 H | Amp 20mg/2mL IV |
| Hiponatremia — Sodio | Cálculo especial | Bolo | Amp 1mL=2mEq; 1g=17mEq IV |

---

## Convenciones del archivo

| Símbolo | Significado |
|---|---|
| `*` en col. A | Medicamento de atención especial |
| `IV` en col. H | Vía intravenosa (sin cálculo de cc) |
| `IM` en col. H | Vía intramuscular |
| `VO` en col. H | Vía oral sin cálculo automático |
| `…` en col. E | Dosis fija, no calculada por peso |
| Fórmulas `=C*D` | Calculan el total en mg según el peso actual |
| Fórmulas en col. H | Convierten mg totales a cc según presentación comercial |

---

## Notas importantes para el procesamiento

1. **Todas las celdas de peso (col. C) referencian a C6** — solo hay un peso activo por sesión de uso.
2. Las fórmulas en col. H dividen el total de mg por la concentración de la presentación y por el número de tomas, dando directamente los cc por toma.
3. Algunos medicamentos IV no tienen fórmula en col. H porque la dilución es calculada aparte.
4. El archivo contiene comentarios de celda (no extraíbles aquí) con información farmacológica adicional.
5. La celda `D61` de Desloratadina tiene valor `"5 mg"` (texto, no número) — dosis fija independiente del peso.