/**
 * Hamming Code Application - Main Controller
 * 
 * Este es el módulo principal que coordina todos los demás módulos
 * de la aplicación de códigos Hamming. Maneja el flujo de la aplicación
 * y la comunicación entre módulos.
 * 
 * @author Facundo Sichi
 * @version 1.0.0
 */

class HammingCodeApp {
    constructor() {
        // Estado de la aplicación
        this.state = {
            originalData: '',
            encodedData: [],
            transmittedData: [],
            correctedData: [],
            syndrome: [],
            errorPosition: 0,
            currentSection: 'simulator'
        };

        // Inicializar módulos
        this.encoder = HammingEncoder;
        this.errorSimulator = new ErrorSimulator();
        this.uiManager = new UIManager();
        
        // Inicializar aplicación
        this.init();
    }

    /**
     * Inicializa la aplicación
     */
    init() {
        this.setupApplicationEvents();
        this.setupTutorialNavigation();
        this.setupExampleHandlers();
        this.showDefaultSection();
        console.log('🚀 Hamming Code App inicializada correctamente');
    }

    /**
     * Configura los event listeners específicos de la aplicación
     */
    setupApplicationEvents() {
        // Evento de codificación
        if (this.uiManager.elements.encodeBtn) {
            this.uiManager.elements.encodeBtn.addEventListener('click', () => this.encodeData());
        }

        // Eventos de simulación de errores
        if (this.uiManager.elements.addErrorBtn) {
            this.uiManager.elements.addErrorBtn.addEventListener('click', () => this.simulateError());
        }

        if (this.uiManager.elements.addRandomErrorBtn) {
            this.uiManager.elements.addRandomErrorBtn.addEventListener('click', () => this.simulateRandomError());
        }

        // Eventos de control
        if (this.uiManager.elements.resetTransmissionBtn) {
            this.uiManager.elements.resetTransmissionBtn.addEventListener('click', () => this.resetTransmission());
        }

        if (this.uiManager.elements.correctErrorBtn) {
            this.uiManager.elements.correctErrorBtn.addEventListener('click', () => this.correctError());
        }

        // Cambio de modo de error
        this.uiManager.elements.errorModeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.errorSimulator.setErrorMode(e.target.value);
                this.updateErrorModeInterface();
            });
        });

        // Toggle manual de bits
        document.addEventListener('bitToggle', (e) => {
            this.toggleBit(e.detail.index);
        });

        // Entrada de datos
        if (this.uiManager.elements.dataInput) {
            this.uiManager.elements.dataInput.addEventListener('input', (e) => {
                this.validateInput(e.target.value);
            });

            this.uiManager.elements.dataInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.encodeData();
                }
            });
        }
    }

    /**
     * Codifica los datos ingresados por el usuario
     */
    async encodeData() {
        const input = this.uiManager.elements.dataInput?.value.trim();
        
        if (!input) {
            this.uiManager.showAlert('Por favor, ingrese una secuencia binaria', 'warning');
            return;
        }

        if (!this.encoder.validateInput(input)) {
            this.uiManager.showAlert('Solo se permiten 0s y 1s', 'warning');
            return;
        }

        try {
            // Mostrar loading
            this.uiManager.showLoading();
            
            // Simular tiempo de procesamiento
            await new Promise(resolve => setTimeout(resolve, 800));

            // Codificar datos
            this.state.originalData = input;
            this.state.encodedData = this.encoder.encode(input);
            this.state.transmittedData = [...this.state.encodedData];
            
            // Resetear errores
            this.errorSimulator.reset();
            this.state.syndrome = [];
            this.state.correctedData = [];

            // Actualizar interfaz
            this.updateDisplay();
            this.updateButtons();
            this.showAllSections();
            
            // Mostrar información de codificación
            const info = this.encoder.getEncodingInfo(input, this.state.encodedData);
            this.uiManager.showAlert(
                `✅ Datos codificados: ${info.dataBits} bits → ${info.totalBits} bits (${info.efficiency} eficiencia)`,
                'success'
            );

        } catch (error) {
            this.uiManager.showAlert(`Error al codificar: ${error.message}`, 'danger');
        } finally {
            this.uiManager.hideLoading();
        }
    }

    /**
     * Simula errores según el modo seleccionado
     */
    simulateError() {
        if (this.state.encodedData.length === 0) {
            this.uiManager.showAlert('Primero debe codificar algunos datos', 'warning');
            return;
        }

        try {
            // Resetear a datos originales
            this.state.transmittedData = [...this.state.encodedData];
            
            // Simular errores
            const result = this.errorSimulator.simulate(this.state.transmittedData);
            
            // Actualizar estado
            this.state.transmittedData = result.data;
            
            // Detectar errores
            this.detectError();
            
            // Actualizar interfaz
            this.updateDisplay();
            this.updateButtons();
            
            // Mostrar mensaje
            this.uiManager.showAlert(result.message, result.type);

        } catch (error) {
            this.uiManager.showAlert(`Error al simular: ${error.message}`, 'danger');
        }
    }

    /**
     * Simula un error aleatorio (alias para compatibilidad)
     */
    simulateRandomError() {
        this.simulateError();
    }

    /**
     * Detecta errores calculando el síndrome
     */
    detectError() {
        // Calcular síndrome
        this.state.syndrome = this.encoder.calculateSyndrome(this.state.transmittedData);
        this.state.errorPosition = this.encoder.syndromeToPosition(this.state.syndrome);
        
        // Actualizar visualización del síndrome
        this.updateErrorDisplay();
    }

    /**
     * Corrige el error detectado
     */
    correctError() {
        if (this.state.syndrome.every(bit => bit === 0)) {
            this.uiManager.showAlert('No hay errores para corregir', 'info');
            return;
        }

        try {
            // Corregir error
            this.state.correctedData = this.encoder.correctError(
                this.state.transmittedData, 
                this.state.errorPosition
            );

            // Verificar si la corrección fue exitosa
            const errorInfo = this.errorSimulator.getErrorInfo();
            
            if (errorInfo.count > 1) {
                // Múltiples errores - la corrección será incorrecta
                this.uiManager.showAlert(
                    `⚠️ Corrección aplicada pero INCORRECTA debido a ${errorInfo.count} errores. ` +
                    `El código Hamming solo puede corregir 1 error.`,
                    'warning'
                );
            } else if (errorInfo.count === 1) {
                // Error simple - corrección exitosa
                this.uiManager.showAlert(
                    `✅ Error corregido exitosamente en posición ${this.state.errorPosition}`,
                    'success'
                );
            }

            // Actualizar visualización
            this.updateDisplay();
            this.updateButtons();
            
            // Mostrar sección de corrección
            this.uiManager.toggleSections({ correctionSection: true });

        } catch (error) {
            this.uiManager.showAlert(`Error al corregir: ${error.message}`, 'danger');
        }
    }

    /**
     * Toggle manual de un bit específico
     * @param {number} index - Índice del bit (0-indexed)
     */
    toggleBit(index) {
        if (index < 0 || index >= this.state.transmittedData.length) return;

        // Cambiar bit
        this.state.transmittedData[index] = this.state.transmittedData[index] === 0 ? 1 : 0;
        
        // Registrar como error manual
        const position = index + 1;
        try {
            const result = this.errorSimulator.simulateManualError(
                this.state.encodedData, 
                position
            );
            this.uiManager.showAlert(result.message, result.type);
        } catch (error) {
            // Si falla el registro, continuar con el cambio manual
        }

        // Detectar errores y actualizar
        this.detectError();
        this.updateDisplay();
        this.updateButtons();
    }

    /**
     * Resetea la transmisión a los datos originales codificados
     */
    resetTransmission() {
        if (this.state.encodedData.length === 0) return;

        this.state.transmittedData = [...this.state.encodedData];
        this.state.correctedData = [];
        this.state.syndrome = [];
        this.state.errorPosition = 0;
        
        this.errorSimulator.reset();
        
        this.updateDisplay();
        this.updateButtons();
        this.uiManager.toggleSections({ correctionSection: false });
        
        this.uiManager.showAlert('Transmisión restablecida a datos originales', 'info');
    }

    /**
     * Limpia todos los datos y resetea la aplicación
     */
    clearAll() {
        this.state = {
            originalData: '',
            encodedData: [],
            transmittedData: [],
            correctedData: [],
            syndrome: [],
            errorPosition: 0,
            currentSection: this.state.currentSection
        };

        this.errorSimulator.reset();
        
        if (this.uiManager.elements.dataInput) {
            this.uiManager.elements.dataInput.value = '';
        }

        this.updateDisplay();
        this.updateButtons();
        this.hideAllSections();
    }

    /**
     * Valida la entrada del usuario en tiempo real
     * @param {string} input - Entrada del usuario
     */
    validateInput(input) {
        const isValid = this.encoder.validateInput(input) || input === '';
        const inputElement = this.uiManager.elements.dataInput;
        
        if (inputElement) {
            if (isValid) {
                inputElement.classList.remove('invalid');
            } else {
                inputElement.classList.add('invalid');
            }
        }
    }

    /**
     * Actualiza toda la visualización
     */
    updateDisplay() {
        // Mostrar bits originales
        if (this.state.encodedData.length > 0) {
            this.uiManager.displayBits(
                this.state.encodedData, 
                this.uiManager.elements.originalCode, 
                'original'
            );
        }

        // Mostrar bits transmitidos
        if (this.state.transmittedData.length > 0) {
            this.uiManager.displayBits(
                this.state.transmittedData, 
                this.uiManager.elements.transmittedCode, 
                'transmitted'
            );
        }

        // Mostrar bits corregidos
        if (this.state.correctedData.length > 0) {
            this.uiManager.displayBits(
                this.state.correctedData, 
                this.uiManager.elements.correctedCode, 
                'corrected'
            );
        }
    }

    /**
     * Actualiza la visualización de errores y síndrome
     */
    updateErrorDisplay() {
        // Mostrar síndrome
        if (this.state.syndrome.length > 0) {
            this.uiManager.displaySyndrome(this.state.syndrome);
        }

        // Actualizar estado de error
        const errorInfo = this.errorSimulator.getErrorInfo();
        const syndromeValue = this.uiManager.syndromeToDecimal(this.state.syndrome);
        
        if (this.uiManager.elements.errorStatus) {
            if (syndromeValue === 0) {
                this.uiManager.elements.errorStatus.innerHTML = 
                    '<span class="status-ok">✅ Sin errores detectados</span>';
            } else {
                const statusClass = errorInfo.canCorrect ? 'status-correctable' : 'status-uncorrectable';
                this.uiManager.elements.errorStatus.innerHTML = 
                    `<span class="${statusClass}">⚠️ ${errorInfo.description} detectado(s)</span>`;
            }
        }

        if (this.uiManager.elements.errorPosition) {
            if (syndromeValue === 0) {
                this.uiManager.elements.errorPosition.innerHTML = '';
            } else if (errorInfo.canCorrect) {
                this.uiManager.elements.errorPosition.innerHTML = 
                    `<strong>Posición del error:</strong> ${this.state.errorPosition}`;
            } else {
                this.uiManager.elements.errorPosition.innerHTML = 
                    `<strong>Síndrome apunta a posición:</strong> ${this.state.errorPosition} ` +
                    '<em>(¡INCORRECTO debido a múltiples errores!)</em>';
            }
        }
    }

    /**
     * Actualiza el estado de los botones
     */
    updateButtons() {
        const hasData = this.state.encodedData.length > 0;
        const hasTransmission = this.state.transmittedData.length > 0;
        const hasErrors = this.errorSimulator.hasErrors();
        const errorMode = this.errorSimulator.errorMode;

        this.uiManager.updateButtons({
            hasData,
            hasTransmission,
            hasErrors,
            errorMode
        });
    }

    /**
     * Actualiza la interfaz según el modo de error seleccionado
     */
    updateErrorModeInterface() {
        const mode = this.errorSimulator.errorMode;
        
        // Actualizar texto del botón
        if (this.uiManager.elements.addErrorBtn) {
            const buttonTexts = {
                'single': 'Agregar Error',
                'double': 'Agregar 2 Errores', 
                'triple': 'Agregar 3 Errores'
            };
            this.uiManager.elements.addErrorBtn.textContent = buttonTexts[mode] || 'Agregar Error';
        }

        // Actualizar información del modo
        this.updateModeInfo();
        
        // Resetear transmisión si existe
        if (this.state.transmittedData.length > 0) {
            this.resetTransmission();
        }
    }

    /**
     * Actualiza la información descriptiva del modo actual
     */
    updateModeInfo() {
        if (!this.uiManager.elements.modeDescription) return;
        
        const descriptions = {
            'single': `
                <p><span class="success">✓ Modo Normal:</span> El código de Hamming puede <strong>detectar y corregir</strong> un error individual.</p>
                <p>Este es el funcionamiento estándar del código de Hamming.</p>
            `,
            'double': `
                <p><span class="warning">⚠ Limitación del Código:</span> Con dos errores, el código Hamming <strong>NO puede corregir</strong> y dará una posición <strong>incorrecta</strong>.</p>
                <p>Esto demuestra que el código de Hamming solo funciona correctamente con un error único.</p>
            `,
            'triple': `
                <p><span class="danger">💥 Demostración Extrema:</span> Con tres errores, el código Hamming <strong>detecta anomalías</strong> pero cualquier "corrección" será <strong>INCORRECTA</strong>.</p>
                <p><strong>Importante:</strong> El síndrome será ≠ 0 (detecta problemas) pero apuntará a una posición errónea. Si se "corrige", se empeoran los datos.</p>
                <p>Esto refuerza que Hamming solo garantiza corrección con <strong>1 error máximo</strong>.</p>
            `
        };

        const mode = this.errorSimulator.errorMode;
        this.uiManager.elements.modeDescription.innerHTML = descriptions[mode] || '';
        
        // Mostrar/ocultar información según estado
        if (this.uiManager.elements.errorModeInfo) {
            this.uiManager.elements.errorModeInfo.style.display = 
                this.state.encodedData.length > 0 ? 'block' : 'none';
        }
    }

    /**
     * Muestra todas las secciones del simulador
     */
    showAllSections() {
        this.uiManager.toggleSections({
            encodingResults: true,
            transmissionSection: true,
            detectionSection: true
        });
    }

    /**
     * Oculta todas las secciones del simulador
     */
    hideAllSections() {
        this.uiManager.toggleSections({
            encodingResults: false,
            transmissionSection: false,
            detectionSection: false,
            correctionSection: false
        });
    }

    /**
     * Muestra la sección por defecto
     */
    showDefaultSection() {
        this.uiManager.switchToSection('simulator');
    }

    /**
     * Configura la navegación del tutorial
     */
    setupTutorialNavigation() {
        // Tutorial navigation será implementado aquí
        // Por ahora, configuración básica
        console.log('📚 Tutorial navigation configurado');
    }

    /**
     * Configura los manejadores de ejemplos
     */
    setupExampleHandlers() {
        // Generador aleatorio
        const generateBtn = document.getElementById('generateRandom');
        const lengthSlider = document.getElementById('randomLength');
        const lengthValue = document.getElementById('lengthValue');

        if (lengthSlider && lengthValue) {
            lengthSlider.addEventListener('input', (e) => {
                lengthValue.textContent = e.target.value;
            });
        }

        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                const length = lengthSlider ? parseInt(lengthSlider.value) : 6;
                const randomData = this.generateRandomData(length);
                
                if (this.uiManager.elements.dataInput) {
                    this.uiManager.elements.dataInput.value = randomData;
                    this.uiManager.switchToSection('simulator');
                }
            });
        }
    }

    /**
     * Genera datos binarios aleatorios
     * @param {number} length - Longitud deseada
     * @returns {string} Cadena binaria aleatoria
     */
    generateRandomData(length = 6) {
        return Array.from({ length }, () => Math.floor(Math.random() * 2)).join('');
    }

    /**
     * Cambia a una sección específica (método público)
     * @param {string} sectionId - ID de la sección
     */
    switchToSection(sectionId) {
        this.uiManager.switchToSection(sectionId);
        this.state.currentSection = sectionId;
    }
}

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HammingCodeApp;
}
