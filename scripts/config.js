/**
 * Application Configuration
 * 
 * Configuraciones globales, constantes y parámetros
 * de la aplicación de códigos Hamming.
 * 
 * @author Facundo Sichi
 * @version 1.0.0
 */

const AppConfig = {
    // Configuración general
    APP_NAME: 'Simulador de Códigos Hamming',
    VERSION: '1.0.0',
    AUTHOR: 'Facundo Sichi',
    
    // Límites de la aplicación
    MAX_DATA_BITS: 12,
    MIN_DATA_BITS: 1,
    MAX_TOTAL_BITS: 16,
    
    // Configuración de interfaz
    LOADING_DELAY: 800, // ms
    ALERT_DURATION: 5000, // ms
    ANIMATION_DURATION: 300, // ms
    
    // Colores para bits de paridad
    PARITY_COLORS: [
        '#FF6B6B', // P1 - Rojo
        '#4ECDC4', // P2 - Turquesa
        '#45B7D1', // P3 - Azul
        '#96CEB4', // P4 - Verde
        '#FECA57', // P5 - Amarillo
        '#FF9FF3', // P6 - Rosa
        '#54A0FF'  // P7 - Azul claro
    ],
    
    // Tipos de error
    ERROR_MODES: {
        SINGLE: 'single',
        DOUBLE: 'double',
        TRIPLE: 'triple'
    },
    
    // Tipos de alerta
    ALERT_TYPES: {
        INFO: 'info',
        SUCCESS: 'success',
        WARNING: 'warning',
        DANGER: 'danger'
    },
    
    // Secciones de la aplicación
    SECTIONS: {
        SIMULATOR: 'simulator',
        TUTORIAL: 'tutorial',
        THEORY: 'theory',
        EXAMPLES: 'examples',
        ABOUT: 'about'
    },
    
    // Mensajes predefinidos
    MESSAGES: {
        EMPTY_INPUT: 'Por favor, ingrese una secuencia binaria',
        INVALID_INPUT: 'Solo se permiten 0s y 1s',
        ENCODE_SUCCESS: '✅ Datos codificados exitosamente',
        NO_DATA_TO_SIMULATE: 'Primero debe codificar algunos datos',
        NO_ERRORS_TO_CORRECT: 'No hay errores para corregir',
        CORRECTION_SUCCESS: '✅ Error corregido exitosamente',
        CORRECTION_FAILED: '⚠️ Corrección aplicada pero INCORRECTA',
        TRANSMISSION_RESET: 'Transmisión restablecida a datos originales',
        MULTIPLE_ERRORS_WARNING: 'El código Hamming solo puede corregir 1 error'
    },
    
    // Configuración de ejemplos
    EXAMPLES: {
        BASIC: '1011',
        INTERMEDIATE: '1101001',
        ADVANCED: '11010011'
    },
    
    // Configuración de tutorial
    TUTORIAL: {
        TOTAL_STEPS: 4,
        KEYBOARD_NAVIGATION: true,
        AUTO_PROGRESS: false
    },
    
    // Configuración responsive
    BREAKPOINTS: {
        MOBILE: 768,
        TABLET: 1024,
        DESKTOP: 1200
    },
    
    // URLs y referencias
    URLS: {
        GITHUB: 'https://github.com/FSichi/Hamming-Code',
        DOCUMENTATION: '#',
        UNIVERSITY: 'https://www.frt.utn.edu.ar/'
    },
    
    // Información académica
    ACADEMIC_INFO: {
        UNIVERSITY: 'Universidad Tecnológica Nacional - FRT',
        SUBJECT: 'Comunicaciones',
        YEAR: 2025,
        GPA: 8.95
    },
    
    // Configuración de performance
    PERFORMANCE: {
        DEBOUNCE_DELAY: 300,
        THROTTLE_DELAY: 100,
        MAX_CONCURRENT_ANIMATIONS: 3
    },
    
    // Configuración de accesibilidad
    ACCESSIBILITY: {
        HIGH_CONTRAST: false,
        KEYBOARD_NAVIGATION: true,
        SCREEN_READER_SUPPORT: true,
        REDUCED_MOTION: false
    },
    
    // Configuración de desarrollo
    DEBUG: {
        ENABLED: false,
        LOG_LEVEL: 'info', // 'debug', 'info', 'warn', 'error'
        SHOW_PERFORMANCE: false,
        MOCK_DELAYS: false
    }
};

// Funciones de utilidad para configuración
const ConfigUtils = {
    /**
     * Obtiene un color de paridad por índice
     * @param {number} index - Índice del color
     * @returns {string} Color hexadecimal
     */
    getParityColor(index) {
        return AppConfig.PARITY_COLORS[index % AppConfig.PARITY_COLORS.length];
    },
    
    /**
     * Verifica si está en modo debug
     * @returns {boolean} True si debug está habilitado
     */
    isDebugMode() {
        return AppConfig.DEBUG.ENABLED;
    },
    
    /**
     * Obtiene configuración específica de una sección
     * @param {string} section - Nombre de la sección
     * @returns {Object} Configuración de la sección
     */
    getSectionConfig(section) {
        const configs = {
            [AppConfig.SECTIONS.SIMULATOR]: {
                autoSave: true,
                realTimeValidation: true,
                showAdvancedOptions: false
            },
            [AppConfig.SECTIONS.TUTORIAL]: {
                autoProgress: AppConfig.TUTORIAL.AUTO_PROGRESS,
                keyboardNav: AppConfig.TUTORIAL.KEYBOARD_NAVIGATION,
                totalSteps: AppConfig.TUTORIAL.TOTAL_STEPS
            },
            [AppConfig.SECTIONS.EXAMPLES]: {
                showEfficiency: true,
                allowCustom: true,
                maxLength: AppConfig.MAX_DATA_BITS
            }
        };
        
        return configs[section] || {};
    },
    
    /**
     * Valida configuración de entrada
     * @param {Object} config - Configuración a validar
     * @returns {boolean} True si es válida
     */
    validateConfig(config) {
        if (!config || typeof config !== 'object') return false;
        
        // Validaciones básicas
        const required = ['APP_NAME', 'VERSION', 'AUTHOR'];
        return required.every(key => config.hasOwnProperty(key));
    },
    
    /**
     * Combina configuración por defecto con configuración custom
     * @param {Object} customConfig - Configuración personalizada
     * @returns {Object} Configuración combinada
     */
    mergeConfig(customConfig = {}) {
        return {
            ...AppConfig,
            ...customConfig,
            DEBUG: {
                ...AppConfig.DEBUG,
                ...(customConfig.DEBUG || {})
            }
        };
    }
};

// Logger configurado según configuración de debug
const Logger = {
    debug: (...args) => {
        if (AppConfig.DEBUG.ENABLED && AppConfig.DEBUG.LOG_LEVEL === 'debug') {
            console.debug('[HAMMING]', ...args);
        }
    },
    
    info: (...args) => {
        if (AppConfig.DEBUG.ENABLED && ['debug', 'info'].includes(AppConfig.DEBUG.LOG_LEVEL)) {
            console.info('[HAMMING]', ...args);
        }
    },
    
    warn: (...args) => {
        if (AppConfig.DEBUG.ENABLED && ['debug', 'info', 'warn'].includes(AppConfig.DEBUG.LOG_LEVEL)) {
            console.warn('[HAMMING]', ...args);
        }
    },
    
    error: (...args) => {
        if (AppConfig.DEBUG.ENABLED) {
            console.error('[HAMMING]', ...args);
        }
    }
};

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AppConfig, ConfigUtils, Logger };
}
