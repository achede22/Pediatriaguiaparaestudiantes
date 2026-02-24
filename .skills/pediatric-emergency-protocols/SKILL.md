---
name: Protocolos de Emergencia Pediátrica
description: Protocolos de urgencia pediátrica incluyendo ACLS/BLS (reanimación), antídotos para intoxicaciones, manejo de deshidratación, salbutamol IV para asma grave, anafilaxis con adrenalina, y sulfato de magnesio. Incluye fórmulas de infusión, bolos y velocidades de goteo.
---

# Protocolos de Emergencia Pediátrica

## Propósito

Este skill proporciona protocolos de emergencia pediátrica con fórmulas de cálculo paso a paso para situaciones de urgencia. Incluye reanimación (ACLS/BLS), antídotos, deshidratación, broncoespasmo severo y anafilaxis.

## Cuándo activarse

Actívate cuando el usuario:
- Pregunte sobre dosis de medicamentos de reanimación pediátrica
- Necesite calcular dosis de antídotos para intoxicaciones
- Requiera el protocolo de rehidratación o cálculo de líquidos IV
- Pregunte sobre salbutamol IV o sulfato de magnesio en asma grave
- Necesite dosis de adrenalina para anafilaxis
- Pregunte sobre velocidades de infusión, gotas/minuto o mL/hora

## Datos de referencia

Lee el archivo `resources/protocolos_urgencia.md` en este directorio para acceder a los protocolos completos con fórmulas.

## Instrucciones de uso

### 1. Identificar la emergencia

Clasifica la emergencia en una de estas categorías:
- **ACLS/BLS** — Paro cardíaco, bradicardia, taquicardia
- **Intoxicación** — Identificar tóxico para seleccionar antídoto
- **Deshidratación** — Calcular reposición hídrica
- **Broncoespasmo severo** — Salbutamol IV, sulfato de magnesio
- **Anafilaxis** — Adrenalina IM/IV
- **CROUP** — Dexametasona, adrenalina nebulizada

### 2. Obtener peso del paciente
- **OBLIGATORIO.** Si no se conoce, usar la estimación: `Peso (kg) = (edad en años × 2) + 8`

### 3. Formato de respuesta para emergencias

```
🚨 PROTOCOLO: [nombre de la emergencia]
👶 Peso: [X] kg

📋 PASO 1: [descripción]
   💊 Medicamento: [nombre]
   📏 Dosis: [cálculo detallado]
   💉 Vía: [IV/IM/INH]
   ⏰ Repetir: [cada cuánto]

📋 PASO 2: [siguiente acción]
   ...

⚠️ DOSIS MÁXIMAS:
- [listar límites]

🔴 ALERTAS CRÍTICAS:
- [contraindicaciones o precauciones]

📌 Confirmar en Pediadosis / guías institucionales.
```

### 4. Reglas críticas para emergencias

> 🔴 **CRÍTICO**: Este skill es EXCLUSIVAMENTE educativo. En una emergencia real, SIEMPRE seguir los protocolos institucionales y la supervisión del equipo médico.

- **Adrenalina en anafilaxis:** Máx 0.3 mL en niños (USA), 0.5 mL (UE). SIEMPRE alertar el máximo.
- **Salbutamol IV:** Protocolo complejo con bolo + infusión continua. Calcular ambos.
- **Sulfato de Magnesio:** Máximo 2 g. Infundir en 20 minutos mínimo.
- **Atropina en intoxicaciones:** Dosis diferente a la de ACLS (0.05 vs 0.01 mg/kg).
- **Líquidos IV:** Verificar que la velocidad de infusión sea apropiada para el peso.
- Para cálculos de **gotas/minuto**, preguntar el factor de goteo del equipo (60, 20, 15 o 10 gotas/mL).
