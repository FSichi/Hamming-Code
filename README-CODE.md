# 📚 Documentación del Código - Simulador de Códigos Hamming

## 🏗️ Arquitectura del Proyecto

### Estructura de Archivos

```
Hamming-Code/
├── index.html                 # Página principal
├── styles.css                 # Estilos CSS
├── script.js                  # ⚠️ ARCHIVO LEGACY (en migracion)
├── scripts/                   # 📁 Módulos organizados
│   ├── config.js             # Configuraciones y constantes
│   ├── hamming-encoder.js     # Lógica de codificación Hamming
│   ├── error-simulator.js     # Simulación de errores
│   ├── ui-manager.js          # Manejo de interfaz de usuario
│   └── app.js                 # Controlador principal
└── README-CODE.md            # Esta documentación
```

## 🧩 Módulos del Sistema

### 1. **config.js** - Configuración Global
**Propósito:** Centralizar todas las configuraciones, constantes y parámetros de la aplicación.

```javascript
// Configuraciones principales
AppConfig.MAX_DATA_BITS = 12;
AppConfig.PARITY_COLORS = ['#FF6B6B', '#4ECDC4', ...];
AppConfig.ALERT_TYPES = { INFO: 'info', WARNING: 'warning', ... };
```

**Clases y Objetos:**
- `AppConfig`: Objeto con todas las configuraciones
- `ConfigUtils`: Utilidades para manejo de configuración
- `Logger`: Sistema de logging configurado

**Funcionalidades clave:**
- ✅ Límites de bits de datos (1-12)
- ✅ Colores para bits de paridad
- ✅ Tipos de error y alertas
- ✅ Mensajes predefinidos
- ✅ Configuración de desarrollo/debug

---

### 2. **hamming-encoder.js** - Codificación Hamming
**Propósito:** Implementar toda la lógica matemática de los códigos Hamming.

```javascript
// Uso básico
const encoded = HammingEncoder.encode('1011');
const syndrome = HammingEncoder.calculateSyndrome(receivedData);
const corrected = HammingEncoder.correctError(data, position);
```

**Métodos principales:**
- `encode(data)`: Codifica datos usando algoritmo Hamming
- `calculateSyndrome(data)`: Calcula síndrome de error
- `syndromeToPosition(syndrome)`: Convierte síndrome a posición
- `correctError(data, position)`: Corrige error en posición específica
- `validateInput(input)`: Valida entrada binaria
- `getEncodingInfo(original, encoded)`: Obtiene estadísticas

**Algoritmo implementado:**
1. **Cálculo de bits de paridad:** 2^r ≥ n + r + 1
2. **Posicionamiento:** Paridades en posiciones potencia de 2 (1, 2, 4, 8...)
3. **Cálculo XOR:** Para cada bit de paridad según patrón binario
4. **Detección:** Síndrome = recálculo ⊕ recibido
5. **Corrección:** Invertir bit en posición del síndrome

---

### 3. **error-simulator.js** - Simulación de Errores
**Propósito:** Simular diferentes tipos de errores para demostrar capacidades y limitaciones.

```javascript
// Uso básico
const simulator = new ErrorSimulator();
simulator.setErrorMode('double');
const result = simulator.simulate(transmittedData);
```

**Clases:**
- `ErrorSimulator`: Clase principal para simulación

**Métodos principales:**
- `setErrorMode(mode)`: Establece modo ('single', 'double', 'triple')
- `simulate(data)`: Simula errores según modo actual
- `simulateSingleError(data)`: Un error aleatorio
- `simulateDoubleError(data)`: Dos errores aleatorios
- `simulateTripleError(data)`: Tres errores aleatorios
- `simulateManualError(data, position)`: Error en posición específica
- `getErrorInfo()`: Información del estado actual

**Propósito educativo:**
- ✅ **1 error:** Demuestra corrección exitosa
- ⚠️ **2 errores:** Demuestra limitación (detección pero corrección incorrecta)
- 💥 **3 errores:** Demuestra falla extrema

---

### 4. **ui-manager.js** - Interfaz de Usuario
**Propósito:** Manejar toda la interacción con la interfaz, visualización y eventos del DOM.

```javascript
// Uso básico
const ui = new UIManager();
ui.displayBits(data, container, 'transmitted');
ui.showAlert('Mensaje', 'success');
ui.switchToSection('simulator');
```

**Clases:**
- `UIManager`: Clase principal para manejo de UI

**Métodos principales:**
- `displayBits(data, container, type)`: Visualiza bits con indicadores
- `displaySyndrome(syndrome)`: Muestra síndrome con headers
- `showAlert(message, type)`: Sistema de alertas
- `updateButtons(state)`: Actualiza estado de botones
- `switchToSection(id)`: Navegación entre secciones
- `toggleSections(sections)`: Mostrar/ocultar secciones

**Características visuales:**
- 🎨 **Bits de paridad:** Colores específicos por posición
- 🔍 **Indicadores:** Círculos que muestran qué paridades cubren cada bit
- 📱 **Responsive:** Menú móvil y diseño adaptativo
- ⚡ **Interactivo:** Click en bits para errores manuales

---

### 5. **app.js** - Controlador Principal
**Propósito:** Coordinar todos los módulos y manejar el flujo principal de la aplicación.

```javascript
// Inicialización automática
document.addEventListener('DOMContentLoaded', () => {
    window.app = new HammingCodeApp();
});
```

**Clases:**
- `HammingCodeApp`: Clase principal de la aplicación

**Estado de la aplicación:**
```javascript
this.state = {
    originalData: '',      // Datos originales del usuario
    encodedData: [],       // Datos codificados con Hamming
    transmittedData: [],   // Datos transmitidos (con posibles errores)
    correctedData: [],     // Datos después de corrección
    syndrome: [],          // Síndrome calculado
    errorPosition: 0,      // Posición del error detectado
    currentSection: 'simulator'
};
```

**Métodos principales:**
- `encodeData()`: Proceso completo de codificación
- `simulateError()`: Coordina simulación de errores
- `detectError()`: Calcula síndrome y detecta errores
- `correctError()`: Proceso de corrección
- `updateDisplay()`: Actualiza toda la visualización
- `resetTransmission()`: Resetea a datos originales

**Flujo de la aplicación:**
1. **Entrada:** Usuario ingresa datos binarios
2. **Codificación:** Se calculan bits de paridad
3. **Transmisión:** Se muestran datos "transmitidos"
4. **Simulación:** Se agregan errores según modo
5. **Detección:** Se calcula síndrome
6. **Corrección:** Se intenta corregir (exitosa o fallida)
7. **Visualización:** Se muestra resultado y explicación

---

## 🔄 Flujo de Datos

```mermaid
graph TD
    A[Usuario ingresa datos] --> B[HammingEncoder.encode()]
    B --> C[UIManager.displayBits()]
    C --> D[Usuario selecciona modo error]
    D --> E[ErrorSimulator.simulate()]
    E --> F[HammingEncoder.calculateSyndrome()]
    F --> G[UIManager.displaySyndrome()]
    G --> H[Usuario presiona corregir]
    H --> I[HammingEncoder.correctError()]
    I --> J[UIManager.showAlert()]
```

## 🎯 Principios de Diseño

### **Separación de Responsabilidades**
- ✅ **Codificación:** Solo lógica matemática pura
- ✅ **Simulación:** Solo manejo de errores
- ✅ **UI:** Solo manipulación del DOM
- ✅ **App:** Solo coordinación de flujo

### **Modularidad**
- ✅ Cada módulo es independiente
- ✅ Interfaces bien definidas
- ✅ Fácil testing individual
- ✅ Reutilización de código

### **Documentación**
- ✅ JSDoc en todos los métodos
- ✅ Comentarios explicativos
- ✅ Ejemplos de uso
- ✅ Propósito educativo claro

## 🧪 Cómo Agregar Nuevas Funcionalidades

### **Nuevo Tipo de Error**
1. Agregar en `config.js` → `ERROR_MODES`
2. Implementar en `error-simulator.js` → nuevo método `simulate[X]Error()`
3. Actualizar `ui-manager.js` → descripción en `updateModeInfo()`
4. Agregar opción en HTML

### **Nueva Visualización**
1. Crear método en `ui-manager.js`
2. Agregar estilos CSS correspondientes
3. Llamar desde `app.js` en momento apropiado

### **Nueva Sección**
1. Agregar HTML structure
2. Agregar en `config.js` → `SECTIONS`
3. Actualizar navegación en `ui-manager.js`
4. Implementar lógica específica

## 🔧 Configuración de Desarrollo

### **Activar Modo Debug**
```javascript
// En config.js
AppConfig.DEBUG.ENABLED = true;
AppConfig.DEBUG.LOG_LEVEL = 'debug';
```

### **Logs Disponibles**
- `Logger.debug()`: Información detallada
- `Logger.info()`: Información general  
- `Logger.warn()`: Advertencias
- `Logger.error()`: Errores

### **Testing Manual**
```javascript
// En consola del navegador
app.encoder.encode('1011');           // Test codificación
app.errorSimulator.simulate(data);    // Test simulación
app.uiManager.showAlert('Test');      // Test UI
```

## 📋 Checklist de Mantenimiento

- [ ] **Actualizar versión** en `config.js`
- [ ] **Documentar cambios** en comentarios JSDoc
- [ ] **Probar en diferentes navegadores**
- [ ] **Verificar responsive design**
- [ ] **Validar accesibilidad**
- [ ] **Optimizar rendimiento**
- [ ] **Actualizar esta documentación**

## 🎓 Valor Educativo

Este código está diseñado para ser:
- ✅ **Comprensible:** Nombres descriptivos y lógica clara
- ✅ **Educativo:** Comentarios explican el "por qué"
- ✅ **Demostrable:** Cada limitación se muestra visualmente
- ✅ **Extensible:** Fácil agregar nuevas funcionalidades
- ✅ **Profesional:** Estructura empresarial estándar

---

**Autor:** Facundo Sichi  
**Versión:** 1.0.0  
**Fecha:** Agosto 2025  
**Propósito:** Herramienta educativa para códigos Hamming - UTN FRT
