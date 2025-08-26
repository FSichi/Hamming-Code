/**
 * User Interface Manager Module
 * 
 * Este módulo maneja toda la interacción con la interfaz de usuario,
 * incluyendo la visualización de bits, actualización de displays,
 * navegación entre secciones y manejo de eventos.
 * 
 * @author Facundo Sichi
 * @version 1.0.0
 */

class UIManager {
    constructor() {
        this.elements = {};
        this.currentSection = 'simulator';
        this.initializeElements();
        this.setupEventListeners();
    }

    /**
     * Inicializa todos los elementos del DOM
     */
    initializeElements() {
        // Elementos de navegación
        this.elements.navItems = document.querySelectorAll('.nav-item');
        this.elements.contentSections = document.querySelectorAll('.content-section');
        
        // Elementos del simulador
        this.elements.dataInput = document.getElementById('dataInput');
        this.elements.encodeBtn = document.getElementById('encodeBtn');
        this.elements.addErrorBtn = document.getElementById('addErrorBtn');
        this.elements.addRandomErrorBtn = document.getElementById('addRandomErrorBtn');
        this.elements.resetTransmissionBtn = document.getElementById('resetTransmissionBtn');
        this.elements.correctErrorBtn = document.getElementById('correctErrorBtn');
        
        // Controles de modo de error
        this.elements.errorModeRadios = document.querySelectorAll('input[name="errorMode"]');
        
        // Contenedores de visualización
        this.elements.originalCode = document.getElementById('originalCode');
        this.elements.transmittedCode = document.getElementById('transmittedCode');
        this.elements.correctedCode = document.getElementById('correctedCode');
        this.elements.syndrome = document.getElementById('syndrome');
        this.elements.syndromeHeaders = document.getElementById('syndromeHeaders');
        this.elements.syndromeDecimal = document.getElementById('syndromeDecimal');
        this.elements.errorStatus = document.getElementById('errorStatus');
        this.elements.errorPosition = document.getElementById('errorPosition');
        
        // Secciones del simulador
        this.elements.loadingSpinner = document.getElementById('loadingSpinner');
        this.elements.encodingResults = document.getElementById('encodingResults');
        this.elements.transmissionSection = document.getElementById('transmissionSection');
        this.elements.detectionSection = document.getElementById('detectionSection');
        this.elements.correctionSection = document.getElementById('correctionSection');
        this.elements.errorModeInfo = document.getElementById('errorModeInfo');
        this.elements.modeDescription = document.getElementById('modeDescription');
        
        // Elementos móviles
        this.elements.mobileMenuToggle = document.getElementById('mobileMenuToggle');
        this.elements.mobileOverlay = document.getElementById('mobileOverlay');
        this.elements.sidebar = document.getElementById('sidebar');
    }

    /**
     * Configura los event listeners básicos de la interfaz
     */
    setupEventListeners() {
        // Navegación móvil
        if (this.elements.mobileMenuToggle) {
            this.elements.mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        if (this.elements.mobileOverlay) {
            this.elements.mobileOverlay.addEventListener('click', () => this.closeMobileMenu());
        }

        // Botones de ejemplo rápido
        document.querySelectorAll('.quick-btn, .try-example').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const value = e.target.getAttribute('data-code') || e.target.getAttribute('data-value');
                if (value && this.elements.dataInput) {
                    this.elements.dataInput.value = value;
                    this.elements.dataInput.dispatchEvent(new Event('input'));
                }
            });
        });

        // Navegación entre secciones
        this.elements.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = item.getAttribute('data-section');
                this.switchToSection(targetSection);
            });
        });
    }

    /**
     * Cambia a una sección específica
     * @param {string} sectionId - ID de la sección
     */
    switchToSection(sectionId) {
        // Ocultar todas las secciones
        this.elements.contentSections.forEach(section => {
            section.classList.remove('active');
        });

        // Mostrar la sección seleccionada
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;
        }

        // Actualizar navegación
        this.elements.navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === sectionId) {
                item.classList.add('active');
            }
        });

        // Cerrar menú móvil si está abierto
        this.closeMobileMenu();
    }

    /**
     * Muestra/oculta el menú móvil
     */
    toggleMobileMenu() {
        if (this.elements.sidebar) {
            this.elements.sidebar.classList.toggle('open');
        }
        if (this.elements.mobileOverlay) {
            this.elements.mobileOverlay.classList.toggle('active');
        }
    }

    /**
     * Cierra el menú móvil
     */
    closeMobileMenu() {
        if (this.elements.sidebar) {
            this.elements.sidebar.classList.remove('open');
        }
        if (this.elements.mobileOverlay) {
            this.elements.mobileOverlay.classList.remove('active');
        }
    }

    /**
     * Muestra bits en un contenedor específico
     * @param {number[]} data - Array de bits
     * @param {HTMLElement} container - Contenedor DOM
     * @param {string} type - Tipo de visualización ('original', 'transmitted', 'corrected')
     */
    displayBits(data, container, type = 'original') {
        if (!container || !data) return;

        container.innerHTML = '';
        
        data.forEach((bit, index) => {
            const bitElement = document.createElement('div');
            bitElement.className = 'bit';
            bitElement.textContent = bit;
            
            // Determinar si es bit de paridad o de datos
            const position = index + 1; // 1-indexed
            const isParityBit = this.isPowerOfTwo(position);
            
            if (isParityBit) {
                bitElement.classList.add('parity-bit');
            } else {
                bitElement.classList.add('data-bit');
            }
            
            // Agregar indicadores de paridad para bits transmitidos
            if (type === 'transmitted' || type === 'original') {
                const indicators = this.generateParityIndicators(position);
                bitElement.appendChild(indicators);
            }
            
            // Hacer clickeable para errores manuales
            if (type === 'transmitted') {
                bitElement.addEventListener('click', () => {
                    // Emitir evento personalizado para manejo externo
                    const event = new CustomEvent('bitToggle', {
                        detail: { index, position }
                    });
                    document.dispatchEvent(event);
                });
                bitElement.style.cursor = 'pointer';
                bitElement.title = `Clic para cambiar bit en posición ${position}`;
            }
            
            container.appendChild(bitElement);
        });
    }

    /**
     * Genera indicadores visuales de qué bits de paridad cubren cada posición
     * @param {number} position - Posición del bit (1-indexed)
     * @returns {HTMLElement} Elemento con los indicadores
     */
    generateParityIndicators(position) {
        const indicators = document.createElement('div');
        indicators.className = 'parity-indicators';
        
        const parityBits = this.getParityBitsForPosition(position);
        
        parityBits.forEach(parityBit => {
            const indicator = document.createElement('div');
            indicator.className = 'parity-indicator';
            indicator.textContent = parityBit;
            indicator.style.backgroundColor = this.getParityColor(parityBit);
            indicators.appendChild(indicator);
        });
        
        return indicators;
    }

    /**
     * Obtiene qué bits de paridad cubren una posición específica
     * @param {number} position - Posición (1-indexed)
     * @returns {number[]} Array con los números de paridad que cubren la posición
     */
    getParityBitsForPosition(position) {
        const parityBits = [];
        let parityIndex = 1;
        
        while (parityIndex <= position) {
            if ((position & parityIndex) !== 0) {
                const parityNumber = Math.log2(parityIndex) + 1;
                parityBits.push(parityNumber);
            }
            parityIndex <<= 1;
        }
        
        return parityBits;
    }

    /**
     * Obtiene el color para un bit de paridad específico
     * @param {number} parityNumber - Número del bit de paridad
     * @returns {string} Color hexadecimal
     */
    getParityColor(parityNumber) {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF'];
        return colors[(parityNumber - 1) % colors.length];
    }

    /**
     * Verifica si un número es potencia de 2
     * @param {number} n - Número a verificar
     * @returns {boolean} True si es potencia de 2
     */
    isPowerOfTwo(n) {
        return (n & (n - 1)) === 0 && n > 0;
    }

    /**
     * Muestra el síndrome de error
     * @param {number[]} syndrome - Array con el síndrome
     */
    displaySyndrome(syndrome) {
        if (!this.elements.syndrome || !this.elements.syndromeHeaders) return;

        // Limpiar contenedores
        this.elements.syndrome.innerHTML = '';
        this.elements.syndromeHeaders.innerHTML = '';

        // Mostrar encabezados (P1, P2, P4, P8...)
        for (let i = syndrome.length - 1; i >= 0; i--) {
            const header = document.createElement('div');
            header.className = 'syndrome-header';
            header.textContent = `P${1 << i}`;
            this.elements.syndromeHeaders.appendChild(header);
        }

        // Mostrar bits del síndrome (MSB primero)
        for (let i = syndrome.length - 1; i >= 0; i--) {
            const bit = document.createElement('div');
            bit.className = 'syndrome-bit';
            bit.textContent = syndrome[i];
            this.elements.syndrome.appendChild(bit);
        }

        // Mostrar valor decimal
        if (this.elements.syndromeDecimal) {
            const decimal = this.syndromeToDecimal(syndrome);
            this.elements.syndromeDecimal.textContent = 
                decimal === 0 ? 'Decimal: 0 (Sin errores)' : `Decimal: ${decimal}`;
        }
    }

    /**
     * Convierte síndrome a valor decimal
     * @param {number[]} syndrome - Array con el síndrome
     * @returns {number} Valor decimal
     */
    syndromeToDecimal(syndrome) {
        let decimal = 0;
        for (let i = 0; i < syndrome.length; i++) {
            decimal += syndrome[i] * (1 << i);
        }
        return decimal;
    }

    /**
     * Actualiza el estado de los botones
     * @param {Object} state - Estado actual de la aplicación
     */
    updateButtons(state) {
        const { hasData, hasTransmission, hasErrors, errorMode } = state;

        // Botón de codificación
        if (this.elements.encodeBtn) {
            this.elements.encodeBtn.disabled = false;
        }

        // Botones de error
        if (this.elements.addErrorBtn) {
            this.elements.addErrorBtn.disabled = !hasTransmission;
        }
        
        if (this.elements.addRandomErrorBtn) {
            this.elements.addRandomErrorBtn.disabled = !hasTransmission;
        }

        // Botón de reset
        if (this.elements.resetTransmissionBtn) {
            this.elements.resetTransmissionBtn.disabled = !hasTransmission;
        }

        // Botón de corrección
        if (this.elements.correctErrorBtn) {
            this.elements.correctErrorBtn.disabled = !hasErrors;
            
            // Cambiar texto según el número de errores
            if (hasErrors && errorMode !== 'single') {
                this.elements.correctErrorBtn.textContent = 'Intentar Corrección (Fallará)';
                this.elements.correctErrorBtn.classList.add('btn-warning');
                this.elements.correctErrorBtn.classList.remove('btn-success');
            } else {
                this.elements.correctErrorBtn.textContent = 'Corregir Error';
                this.elements.correctErrorBtn.classList.add('btn-success');
                this.elements.correctErrorBtn.classList.remove('btn-warning');
            }
        }
    }

    /**
     * Muestra/oculta secciones específicas
     * @param {Object} sections - Objeto con las secciones a mostrar/ocultar
     */
    toggleSections(sections) {
        Object.keys(sections).forEach(sectionKey => {
            const element = this.elements[sectionKey];
            if (element) {
                element.style.display = sections[sectionKey] ? 'block' : 'none';
            }
        });
    }

    /**
     * Muestra el spinner de carga
     */
    showLoading() {
        if (this.elements.loadingSpinner) {
            this.elements.loadingSpinner.style.display = 'flex';
        }
    }

    /**
     * Oculta el spinner de carga
     */
    hideLoading() {
        if (this.elements.loadingSpinner) {
            this.elements.loadingSpinner.style.display = 'none';
        }
    }

    /**
     * Muestra un mensaje de alerta
     * @param {string} message - Mensaje a mostrar
     * @param {string} type - Tipo de alerta ('info', 'warning', 'danger', 'success')
     */
    showAlert(message, type = 'info') {
        // Crear elemento de alerta
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <span>${message}</span>
            <button class="alert-close">&times;</button>
        `;

        // Agregar al DOM
        document.body.appendChild(alert);

        // Animar entrada
        setTimeout(() => alert.classList.add('show'), 100);

        // Configurar cierre automático
        setTimeout(() => this.closeAlert(alert), 5000);

        // Configurar cierre manual
        const closeBtn = alert.querySelector('.alert-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeAlert(alert));
        }
    }

    /**
     * Cierra una alerta específica
     * @param {HTMLElement} alert - Elemento de alerta
     */
    closeAlert(alert) {
        alert.classList.remove('show');
        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 300);
    }
}

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIManager;
}
