# AI Context - Pediatría Guía para Estudiantes

## Descripción del Proyecto
Esta aplicación es una herramienta educativa y de referencia rápida para estudiantes de medicina y residentes de pediatría. Su objetivo es proporcionar acceso rápido a algoritmos de emergencia, calculadoras de dosis, guías de procedimientos y un ayudante de diagnóstico.

## Estructura del Proyecto
El proyecto es una aplicación React construida con Vite y TypeScript. Utiliza TailwindCSS para los estilos y Framer Motion para las animaciones.

### Directorios Principales
- `src/components`: Contiene los componentes principales de la UI.
  - `EmergenciaMedico.tsx`: Sección de emergencias (algoritmos, calculadora de dosis, procedimientos).
  - `DiagnosticHelper.tsx`: Ayudante de diagnóstico interactivo (árboles de decisión).
  - `NoEmergenciaMedico.tsx`: Sección de consulta general (no mostrada en el análisis inicial pero existente).
  - `ui`: Componentes de UI reutilizables.
- `src/data`: (Actualmente vacío, los datos están hardcodeados en los componentes, se recomienda moverlos aquí).
- `src/pages`: Páginas de la aplicación.
- `src/styles`: Estilos globales y configuraciones.

## Características Clave
1.  **Emergencia**:
    *   Algoritmos interactivos (RCP, Anafilaxia, Asma, etc.).
    *   Calculadora de dosis críticas (Adrenalina, Atropina, etc.).
    *   Guías de procedimientos (Intubación, Accesos vasculares).
2.  **Consulta General**:
    *   Búsqueda por síntomas.
    *   Vademécum.
    *   Calculadoras clínicas.
3.  **Ayudante Diagnóstico**:
    *   Árboles de decisión para síntomas comunes (Fiebre, Respiratorio).

## Estilo y Diseño
- **Tema**: Limpio, profesional y amigable.
- **Colores**: Se prefiere una paleta de colores suaves relacionados con la salud (Aqua Marina, Azules, Verdes).
- **Iconos**: Lucide React.
- **Animaciones**: Transiciones suaves entre pantallas y secciones.

## Puntos de Mejora Identificados
- **Base de Datos**: Los datos de diagnósticos y medicamentos están hardcodeados en los componentes. Sería ideal moverlos a archivos JSON o constantes separadas en `src/data`.
- **Diagnósticos**: Ampliar la base de datos de diagnósticos diferenciales (ej. causas de estridor).
- **Buscador de Medicación**: Implementar un buscador en la calculadora de dosis para facilitar el acceso rápido en emergencias.
- **Accesibilidad**: Asegurar que los colores y contrastes sean adecuados.

## Recursos Externos
- Se recomienda enlazar a fuentes confiables como la AEPED (Asociación Española de Pediatría) o similares para complementar la información.
