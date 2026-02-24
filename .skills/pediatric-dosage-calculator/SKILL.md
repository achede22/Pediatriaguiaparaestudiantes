---
name: Calculadora de Dosis Pediátricas
description: Calcula dosis de medicamentos pediátricos basándose en el peso del paciente. Cubre analgésicos, antibióticos, antivirales, antiparasitarios, antimicóticos, antihistamínicos, anticonvulsivantes, corticoides, antieméticos, broncodilatadores y más. Fuente de referencia Pediadosis (Yopal, Colombia).
---

# Calculadora de Dosis Pediátricas

## Propósito

Este skill permite calcular dosis pediátricas basadas en peso corporal. Utiliza datos de referencia clínica de Pediadosis usados en Yopal, Colombia.

## Cuándo activarse

Actívate cuando el usuario:
- Pida calcular una dosis de un medicamento para un niño/paciente pediátrico
- Pregunte por la dosis de un medicamento específico en mg/kg
- Necesite convertir dosis a mL/cc/gotas según la presentación comercial
- Pregunte por presentaciones disponibles de un medicamento pediátrico
- Necesite información sobre frecuencia de administración

## Datos de referencia

Lee el archivo `resources/formulario_dosis.md` en este directorio para acceder a la base de datos completa de medicamentos con sus dosis, fórmulas, presentaciones y alertas.

## Instrucciones de uso

### 1. Obtener datos del paciente
- **Peso (kg):** OBLIGATORIO. Si el usuario no lo proporciona, pregúntalo.
- **Edad:** Opcional pero importante para restricciones (ej: Metoclopramida NO en <1 año, Tramadol solo >12 años).

### 2. Buscar el medicamento
- Busca el medicamento en `resources/formulario_dosis.md` por nombre.
- Si el medicamento no está en la base de datos, informa al usuario y sugiere verificar en Pediadosis o Medscape.

### 3. Calcular la dosis
Aplica la fórmula general:

```
Total mg = Peso (kg) × Dosis (mg/kg)
```

Para convertir a mL/cc según presentación:

```
mL por toma = (Total mg × volumen_presentación) / (concentración_mg × número_de_tomas)
```

**Ejemplo — Amoxicilina para niño de 12 kg:**
```
Total mg/día = 12 × 80 = 960 mg
Presentación: Sus 250mg/5mL
mL por toma = (960 × 5) / (250 × 3) = 6.4 mL cada 8 horas × 10 días
```

### 4. Formato de respuesta

Siempre responde con este formato:

```
💊 MEDICAMENTO: [nombre]
👶 Peso: [X] kg
📏 Dosis: [X] mg/kg → Total: [X] mg/día
⏰ Frecuencia: cada [X] horas ([N] tomas/día)
💉 Vía: [VO / IV / IM]
📦 Presentación: [descripción comercial]
🧪 Dosis por toma: [X] mL (cc)
📅 Duración: [si aplica]

⚠️ ALERTAS:
- [Dosis máxima si existe]
- [Restricciones de edad si aplican]
- [Advertencias especiales]

📌 Confirmar siempre en Pediadosis antes de administrar.
```

### 5. Reglas críticas

> ⚠️ **ADVERTENCIA LEGAL**: Este skill es una herramienta de apoyo educativo. Toda dosis debe ser verificada por el profesional de salud antes de administrarse. Recomendar SIEMPRE confirmar en Pediadosis.

- Si la dosis calculada excede la dosis máxima documentada, **alertar inmediatamente**.
- Los medicamentos marcados con `*` son de **atención especial**.
- Cuando la vía es `IV`, `IM` o `VO` sin fórmula de conversión, indicar que la dilución debe calcularse aparte.
- Para dosis fijas (ej: Mebendazol 100 mg, Desloratadina 5 mg, Montelukast 4 mg), NO multiplicar por peso.
- La Penicilina Benzatínica se calcula en **Unidades/kg**, no mg/kg.

### 6. Categorías cubiertas

1. Analgésicos (Acetaminofén, Ibuprofeno, Dipirona, Diclofenaco, Tramadol, Morfina, Naproxeno)
2. Antibióticos (Amoxicilina, Ampicilina, Azitromicina, Ceftriaxona, Ciprofloxacina, Claritromicina, Clindamicina, Gentamicina, Metronidazol, Oxacilina, Penicilinas, TMP/SMX y más)
3. Antivirales (Aciclovir)
4. Antiparasitarios (Albendazol, Ivermectina, Mebendazol, Metronidazol, Pirantel, Secnidazol, Tinidazol)
5. Antimicóticos (Ketoconazol, Fluconazol, Anfotericina B, Nistatina)
6. Antihistamínicos (Cetirizina, Desloratadina, Hidroxicina, Loratadina, Ketotifeno, Clorfeniramina)
7. Anticonvulsivantes (Diazepam, Fenitoína, Fenobarbital, Midazolam, Ácido Valproico, Carbamazepina, Clonazepam)
8. Corticoides (Betametasona, Dexametasona, Metilprednisolona, Prednisolona)
9. Antieméticos / Gastroprotección (Metoclopramida, Ondansetrón, Ranitidina, Alizaprida, Dolasetrón)
10. Broncodilatadores (Salbutamol, Terbutalina, Montelukast)
11. SNC (Amitriptilina)
12. Diarrea (Bismuto, Difenoxilato, Loperamida)
13. Electrolitos (Potasio, Furosemida, Sodio)
14. Zinc (protocolos por edad)
