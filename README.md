# 🔧 Codificación Hamming - Visualizador Interactivo

Una aplicación web interactiva para aprender y visualizar cómo funcionan los códigos Hamming para la detección y corrección de errores en la transmisión de datos.

## 🚀 Características

- **Codificación automática**: Ingresa datos binarios y ve cómo se calculan automáticamente los bits de paridad
- **Visualización clara**: Bits de datos y paridad diferenciados por colores
- **Simulación de errores**: Agrega errores aleatorios o haz clic en los bits para simular errores de transmisión
- **Detección inteligente**: Visualiza el síndrome de error y la posición exacta del error
- **Corrección automática**: Corrige los errores detectados con un solo clic
- **Interfaz responsiva**: Funciona perfectamente en desktop, tablet y móvil

## 🎯 Cómo usar

### 1. Codificar datos
1. Ingresa una secuencia de bits binarios (por ejemplo: `1011`)
2. Haz clic en "Codificar" o presiona Enter
3. Observa cómo se calculan automáticamente los bits de paridad

### 2. Simular errores
- **Error aleatorio**: Haz clic en "Agregar Error Aleatorio"
- **Error manual**: Haz clic directamente en cualquier bit en la sección de transmisión

### 3. Detectar y corregir
1. Observa el síndrome de error que se calcula automáticamente
2. Ve la posición exacta donde se detectó el error
3. Haz clic en "Corregir Error" para ver la corrección automática

### 4. Resetear
- Usa "Resetear Transmisión" para volver a los datos originales
- Usa "Limpiar" para empezar desde cero

## 🔍 Entendiendo los códigos Hamming

### Bits de Paridad
Los bits de paridad se colocan en posiciones que son potencias de 2:
- Posición 1: Bit de paridad P1
- Posición 2: Bit de paridad P2  
- Posición 4: Bit de paridad P4
- Posición 8: Bit de paridad P8
- Y así sucesivamente...

### Bits de Datos
Los bits de datos originales se colocan en las posiciones restantes:
- Posición 3, 5, 6, 7, 9, 10, 11, 12, etc.

### Cálculo de Paridad
Cada bit de paridad verifica la paridad de un conjunto específico de bits:
- **P1** (posición 1): Verifica posiciones 1, 3, 5, 7, 9, 11, ...
- **P2** (posición 2): Verifica posiciones 2, 3, 6, 7, 10, 11, ...
- **P4** (posición 4): Verifica posiciones 4, 5, 6, 7, 12, 13, ...
- **P8** (posición 8): Verifica posiciones 8, 9, 10, 11, 12, 13, ...

### Detección de Errores
El síndrome de error se calcula verificando cada bit de paridad:
- Si el síndrome es 0: No hay error
- Si el síndrome es distinto de 0: El valor del síndrome indica la posición exacta del error

## ⌨️ Atajos de teclado

- **Ctrl/Cmd + Enter**: Codificar datos
- **Ctrl/Cmd + E**: Agregar error aleatorio
- **Ctrl/Cmd + R**: Resetear transmisión
- **Ctrl/Cmd + C**: Corregir error

## 🎨 Leyenda de colores

- 🟢 **Verde**: Bits de datos originales
- 🟠 **Naranja**: Bits de paridad calculados
- 🔴 **Rojo**: Bits con error (pulsando)
- 🔵 **Azul**: Bits corregidos

## 📱 Compatibilidad

La aplicación es completamente responsiva y funciona en:
- ✅ Navegadores de escritorio modernos
- ✅ Tablets
- ✅ Teléfonos móviles
- ✅ Chrome, Firefox, Safari, Edge

## 🛠️ Tecnologías utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con gradientes y animaciones
- **JavaScript ES6+**: Lógica de codificación Hamming
- **Responsive Design**: Grid y Flexbox para layouts adaptativos

## 📚 Casos de uso educativos

### Para estudiantes:
- Visualizar paso a paso cómo se construye un código Hamming
- Experimentar con diferentes secuencias de bits
- Entender la relación entre bits de datos y paridad

### Para profesores:
- Demostrar conceptos de teoría de códigos
- Mostrar ejemplos en tiempo real
- Explicar detección y corrección de errores

### Para profesionales:
- Repasar conceptos de codificación
- Validar implementaciones
- Entender aplicaciones prácticas

## 🔧 Estructura del proyecto

```
Hamming/
├── index.html          # Estructura principal de la aplicación
├── styles.css          # Estilos y animaciones
├── script.js           # Lógica de codificación Hamming
└── README.md           # Documentación (este archivo)
```

## 🚀 Cómo ejecutar

1. Abre `index.html` en cualquier navegador web moderno
2. ¡No necesitas servidor web ni instalación adicional!

## 💡 Ejemplos para probar

Prueba estos datos de ejemplo:
- `1011` - Ejemplo básico de 4 bits
- `1101001` - Ejemplo de 7 bits  
- `10110011` - Ejemplo más complejo
- `1` - Caso mínimo
- `11111111` - Todos unos

## 🤝 Contribuciones

¡Las mejoras son bienvenidas! Algunas ideas para futuras versiones:
- Soporte para códigos Hamming extendidos
- Animaciones de paso a paso
- Exportar/importar configuraciones
- Modo tutorial interactivo
- Estadísticas de errores

---

Creado con ❤️ para ayudar a entender los códigos Hamming de manera visual e interactiva.
