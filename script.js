class HammingCodeApp {
    constructor() {
        this.originalData = '';
        this.encodedData = [];
        this.transmittedData = [];
        this.correctedData = [];
        this.errorPosition = 0;
        this.errorPositions = []; // Para múltiples errores
        this.syndrome = [];
        this.isSecded = false; // Modo SECDED
        this.errorMode = 'single'; // 'single', 'double', 'secded'
        
        this.init();
    }

    init() {
        this.initializeElements();
        this.setupEventListeners();
        this.setupNavigation();
        this.showDefaultSection();
    }

    initializeElements() {
        // Navigation elements
        this.navItems = document.querySelectorAll('.nav-item');
        this.contentSections = document.querySelectorAll('.content-section');
        
        // Simulator elements
        this.dataInput = document.getElementById('dataInput');
        this.encodeBtn = document.getElementById('encodeBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.addErrorBtn = document.getElementById('addErrorBtn');
        this.addRandomErrorBtn = document.getElementById('addRandomErrorBtn');
        this.resetTransmissionBtn = document.getElementById('resetTransmissionBtn');
        this.correctErrorBtn = document.getElementById('correctErrorBtn');
        
        // Error mode controls
        this.errorModeRadios = document.querySelectorAll('input[name="errorMode"]');
        
        // Display containers
        this.originalBitsContainer = document.getElementById('originalCode');
        this.transmittedBitsContainer = document.getElementById('transmittedCode');
        this.correctedBitsContainer = document.getElementById('correctedCode');
        this.syndromeContainer = document.getElementById('syndrome');
        this.errorStatusContainer = document.getElementById('errorStatus');
        this.errorPositionContainer = document.getElementById('errorPosition');
        
        // New elements for loading and sections
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.encodingResults = document.getElementById('encodingResults');
        this.transmissionSection = document.getElementById('transmissionSection');
        this.detectionSection = document.getElementById('detectionSection');
        this.correctionSection = document.getElementById('correctionSection');
        
        // Mobile menu elements
        this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
        this.mobileOverlay = document.getElementById('mobileOverlay');
        this.sidebar = document.getElementById('sidebar');
        
        // Example buttons
        this.exampleButtons = document.querySelectorAll('.example-btn');
    }

    setupEventListeners() {
        // Main simulator buttons
        if (this.encodeBtn) {
            this.encodeBtn.addEventListener('click', () => this.encodeData());
        }
        
        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', () => this.clearAll());
        }
        
        if (this.addErrorBtn) {
            this.addErrorBtn.addEventListener('click', () => this.simulateError());
        }
        
        if (this.addRandomErrorBtn) {
            this.addRandomErrorBtn.addEventListener('click', () => this.simulateRandomError());
        }
        
        if (this.resetTransmissionBtn) {
            this.resetTransmissionBtn.addEventListener('click', () => this.resetTransmission());
        }
        
        if (this.correctErrorBtn) {
            this.correctErrorBtn.addEventListener('click', () => this.correctError());
        }

        // Error mode radio buttons
        this.errorModeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.errorMode = e.target.value;
                this.updateErrorModeInterface();
            });
        });

        // Quick example buttons
        document.querySelectorAll('.example-btn, .quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const example = btn.getAttribute('data-value');
                if (this.dataInput) {
                    this.dataInput.value = example;
                }
            });
        });

        // Try example buttons in the examples section
        document.querySelectorAll('.try-example').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const code = e.target.getAttribute('data-code');
                if (code && this.dataInput) {
                    this.dataInput.value = code;
                    this.switchToSection('simulator');
                    setTimeout(() => this.encodeData(), 100);
                }
            });
        });

        // Random generator button
        const generateRandomBtn = document.getElementById('generateRandom');
        if (generateRandomBtn) {
            generateRandomBtn.addEventListener('click', () => this.generateRandomData());
        }

        // Length slider
        const lengthSlider = document.getElementById('randomLength');
        const lengthValue = document.getElementById('lengthValue');
        if (lengthSlider && lengthValue) {
            lengthSlider.addEventListener('input', () => {
                lengthValue.textContent = lengthSlider.value;
            });
        }

        // Mobile menu toggle - SIMPLIFIED VERSION
        const mobileBtn = document.getElementById('mobileMenuToggle');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('mobileOverlay');
        
        if (mobileBtn && sidebar) {
            // Simple click handler
            mobileBtn.onclick = function(e) {
                e.preventDefault();
                console.log('Button clicked!');
                
                // Toggle classes
                mobileBtn.classList.toggle('active');
                sidebar.classList.toggle('mobile-open');
                if (overlay) {
                    overlay.classList.toggle('active');
                }
                
                console.log('Sidebar has mobile-open:', sidebar.classList.contains('mobile-open'));
            };
            
            // Close when clicking overlay
            if (overlay) {
                overlay.onclick = function() {
                    mobileBtn.classList.remove('active');
                    sidebar.classList.remove('mobile-open');
                    overlay.classList.remove('active');
                };
            }
            
            console.log('Mobile menu setup complete');
        } else {
            console.log('Elements not found:', { btn: !!mobileBtn, sidebar: !!sidebar });
        }

        // Close mobile menu when clicking nav items
        this.navItems.forEach(item => {
            item.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (this.sidebar && this.sidebar.classList.contains('mobile-open') && 
                !this.sidebar.contains(e.target) && 
                !this.mobileMenuToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Close sidebar when clicking overlay
        if (this.mobileOverlay) {
            this.mobileOverlay.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }
    }

    // Simplified mobile menu functions
    toggleMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('mobileOverlay');
        const btn = document.getElementById('mobileMenuToggle');
        
        if (sidebar) {
            btn.classList.toggle('active');
            sidebar.classList.toggle('mobile-open');
            if (overlay) {
                overlay.classList.toggle('active');
            }
        }
    }

    closeMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('mobileOverlay');
        const btn = document.getElementById('mobileMenuToggle');
        
        if (sidebar) {
            btn.classList.remove('active');
            sidebar.classList.remove('mobile-open');
            if (overlay) {
                overlay.classList.remove('active');
            }
        }
    }

    setupNavigation() {
        this.navItems.forEach(item => {
            item.addEventListener('click', () => {
                const targetSection = item.getAttribute('data-section');
                this.switchToSection(targetSection);
                
                // Update active nav item
                this.navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            });
        });
    }

    switchToSection(sectionId) {
        // Hide all sections
        this.contentSections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        // Update nav items
        this.navItems.forEach(nav => {
            nav.classList.remove('active');
            if (nav.getAttribute('data-section') === sectionId) {
                nav.classList.add('active');
            }
        });
    }

    showDefaultSection() {
        this.switchToSection('simulator');
    }

    // Hamming encoding functions
    encodeData() {
        const input = this.dataInput.value.trim();
        
        if (!this.validateInput(input)) {
            this.showAlert('Por favor ingrese solo 0s y 1s', 'error');
            return;
        }

        // Hide all sections and show loading
        this.hideAllSections();
        this.showLoading();

        // Simulate processing time
        setTimeout(() => {
            this.originalData = input;
            this.encodedData = this.hammingEncode(input);
            this.transmittedData = [...this.encodedData];
            this.correctedData = [];
            this.errorPosition = 0;
            this.errorPositions = [];
            this.syndrome = [];
            
            this.hideLoading();
            this.showAllSections();
            this.updateDisplay();
            this.updateButtons();
            this.updateModeInfo(); // Mostrar información del modo actual
            
            this.showAlert('Datos codificados exitosamente con código Hamming', 'success');
        }, 1500);
    }

    hideAllSections() {
        if (this.encodingResults) this.encodingResults.style.display = 'none';
        if (this.transmissionSection) this.transmissionSection.style.display = 'none';
        if (this.detectionSection) this.detectionSection.style.display = 'none';
        if (this.correctionSection) this.correctionSection.style.display = 'none';
    }

    showAllSections() {
        if (this.encodingResults) this.encodingResults.style.display = 'block';
        if (this.transmissionSection) this.transmissionSection.style.display = 'block';
        if (this.detectionSection) this.detectionSection.style.display = 'block';
        if (this.correctionSection) this.correctionSection.style.display = 'block';
    }

    showLoading() {
        if (this.loadingSpinner) this.loadingSpinner.style.display = 'flex';
    }

    hideLoading() {
        if (this.loadingSpinner) this.loadingSpinner.style.display = 'none';
    }

    validateInput(input) {
        return /^[01]+$/.test(input) && input.length > 0;
    }

    hammingEncode(data) {
        const n = data.length;
        let r = 0;
        
        // Calcular número de bits de paridad
        while ((1 << r) < (n + r + 1)) {
            r++;
        }
        
        const totalBits = n + r;
        const encoded = new Array(totalBits + 1).fill(0); // 1-indexed
        
        let dataIndex = 0;
        
        // Colocar bits de datos
        for (let i = 1; i <= totalBits; i++) {
            if (!this.isPowerOfTwo(i)) {
                encoded[i] = parseInt(data[dataIndex++]);
            }
        }
        
        // Calcular bits de paridad
        for (let i = 0; i < r; i++) {
            const parityPos = 1 << i;
            let parity = 0;
            
            for (let j = 1; j <= totalBits; j++) {
                if ((j & parityPos) !== 0) {
                    parity ^= encoded[j];
                }
            }
            
            encoded[parityPos] = parity;
        }
        
        return encoded.slice(1); // Convert back to 0-indexed
    }

    isPowerOfTwo(n) {
        return n > 0 && (n & (n - 1)) === 0;
    }

    simulateError() {
        if (this.encodedData.length === 0) {
            this.showAlert('Primero debe codificar algunos datos', 'warning');
            return;
        }

        if (this.errorMode === 'single') {
            this.simulateSingleError();
        } else if (this.errorMode === 'double') {
            this.simulateDoubleError();
        } else if (this.errorMode === 'triple') {
            this.simulateTripleError();
        }
    }

    simulateSingleError() {
        // Reset transmission to original encoded data first
        this.transmittedData = [...this.encodedData];
        this.correctedData = [];
        this.syndrome = [];
        this.errorPositions = [];

        // Generate random error position (1-indexed)
        const errorPos = Math.floor(Math.random() * this.encodedData.length) + 1;
        this.errorPosition = errorPos;
        this.errorPositions = [errorPos];
        
        // Apply error (0-indexed for array)
        this.transmittedData[errorPos - 1] = this.transmittedData[errorPos - 1] === 0 ? 1 : 0;
        
        this.updateDisplay();
        this.detectError();
        this.updateButtons();
        this.showAlert(`Error simulado en posición ${errorPos}`, 'info');
    }

    simulateDoubleError() {
        // Reset transmission to original encoded data first
        this.transmittedData = [...this.encodedData];
        this.correctedData = [];
        this.syndrome = [];
        this.errorPositions = [];

        // Generate two different random error positions
        const pos1 = Math.floor(Math.random() * this.encodedData.length) + 1;
        let pos2;
        do {
            pos2 = Math.floor(Math.random() * this.encodedData.length) + 1;
        } while (pos2 === pos1);

        this.errorPositions = [pos1, pos2];
        
        // Apply both errors (0-indexed for array)
        this.transmittedData[pos1 - 1] = this.transmittedData[pos1 - 1] === 0 ? 1 : 0;
        this.transmittedData[pos2 - 1] = this.transmittedData[pos2 - 1] === 0 ? 1 : 0;
        
        this.updateDisplay();
        this.detectError();
        this.updateButtons();
        this.showAlert(`⚠️ Dos errores simulados en posiciones ${pos1} y ${pos2} - ¡El código Hamming fallará!`, 'warning');
    }

    simulateTripleError() {
        // Reset transmission to original encoded data first
        this.transmittedData = [...this.encodedData];
        this.correctedData = [];
        this.syndrome = [];
        this.errorPositions = [];

        // Generate three different random error positions
        const positions = new Set();
        while (positions.size < 3) {
            const pos = Math.floor(Math.random() * this.encodedData.length) + 1;
            positions.add(pos);
        }
        
        this.errorPositions = Array.from(positions);
        
        // Apply all three errors (0-indexed for array)
        this.errorPositions.forEach(pos => {
            this.transmittedData[pos - 1] = this.transmittedData[pos - 1] === 0 ? 1 : 0;
        });
        
        this.updateDisplay();
        this.detectError();
        this.updateButtons();
        this.showAlert(`💥 Tres errores simulados en posiciones ${this.errorPositions.join(', ')} - ¡Detección pero corrección INCORRECTA!`, 'danger');
    }

    simulateRandomError() {
        this.simulateError(); // Usar el modo actual seleccionado
    }

    updateErrorModeInterface() {
        // Actualizar texto del botón según el modo
        if (this.addErrorBtn) {
            switch(this.errorMode) {
                case 'single':
                    this.addErrorBtn.textContent = 'Agregar Error';
                    break;
                case 'double':
                    this.addErrorBtn.textContent = 'Agregar 2 Errores';
                    break;
                case 'triple':
                    this.addErrorBtn.textContent = 'Agregar 3 Errores';
                    break;
            }
        }
        
        // Mostrar información del modo
        this.updateModeInfo();
        
        // Resetear estado actual
        if (this.transmittedData.length > 0) {
            this.resetTransmission();
        }
    }

    updateModeInfo() {
        const infoContainer = document.getElementById('errorModeInfo');
        const descriptionContainer = document.getElementById('modeDescription');
        
        if (!infoContainer || !descriptionContainer) return;
        
        let description = '';
        
        switch(this.errorMode) {
            case 'single':
                description = `
                    <p><span class="success">✓ Modo Normal:</span> El código de Hamming puede <strong>detectar y corregir</strong> un error individual.</p>
                    <p>Este es el funcionamiento estándar del código de Hamming.</p>
                `;
                break;
                
            case 'double':
                description = `
                    <p><span class="warning">⚠ Limitación del Código:</span> Con dos errores, el código Hamming <strong>NO puede corregir</strong> y dará una posición <strong>incorrecta</strong>.</p>
                    <p>Esto demuestra que el código de Hamming solo funciona correctamente con un error único.</p>
                `;
                break;
                
            case 'triple':
                description = `
                    <p><span class="danger">💥 Demostración Extrema:</span> Con tres errores, el código Hamming <strong>detecta anomalías</strong> pero cualquier "corrección" será <strong>INCORRECTA</strong>.</p>
                    <p><strong>Importante:</strong> El síndrome será ≠ 0 (detecta problemas) pero apuntará a una posición errónea. Si se "corrige", se empeoran los datos.</p>
                    <p>Esto refuerza que Hamming solo garantiza corrección con <strong>1 error máximo</strong>.</p>
                `;
                break;
        }
        
        descriptionContainer.innerHTML = description;
        infoContainer.style.display = this.encodedData.length > 0 ? 'block' : 'none';
    }

    detectError() {
        const syndrome = this.calculateSyndrome(this.transmittedData);
        this.syndrome = syndrome;
        
        const errorPos = this.syndromeToPosition(syndrome);
        this.errorPosition = errorPos;
        
        // Detectar si hay múltiples errores
        if (this.errorMode === 'double' && this.errorPositions.length === 2) {
            // En modo doble error, mostrar que el síndrome es incorrecto
            this.detectDoubleError();
        } else if (this.errorMode === 'triple' && this.errorPositions.length === 3) {
            // En modo triple error, mostrar que el síndrome es incorrecto
            this.detectTripleError();
        }
        
        this.updateErrorDisplay();
    }

    detectDoubleError() {
        // En caso de dos errores, el código Hamming dará un resultado incorrecto
        // El síndrome apuntará a una posición que no corresponde a ninguno de los errores reales
    }

    detectTripleError() {
        // En caso de tres errores, el código Hamming también dará un resultado incorrecto
        // Similar al caso de dos errores: detecta que hay problemas pero la "corrección" será errónea
    }

    calculateSyndrome(data) {
        const n = data.length;
        let r = 0;
        
        while ((1 << r) < (n + 1)) {
            r++;
        }
        
        const syndrome = [];
        const indexed = [0, ...data]; // Convert to 1-indexed
        
        for (let i = 0; i < r; i++) {
            const parityPos = 1 << i;
            let parity = 0;
            
            for (let j = 1; j <= n; j++) {
                if ((j & parityPos) !== 0) {
                    parity ^= indexed[j];
                }
            }
            
            syndrome[i] = parity;
        }
        
        return syndrome;
    }

    syndromeToPosition(syndrome) {
        let position = 0;
        for (let i = 0; i < syndrome.length; i++) {
            if (syndrome[i] === 1) {
                position += (1 << i);
            }
        }
        return position;
    }

    correctError() {
        if (this.errorPosition === 0) {
            this.showAlert('No se detectaron errores', 'info');
            return;
        }

        this.correctedData = [...this.transmittedData];
        const correctedPos = this.errorPosition - 1; // Convert to 0-indexed
        
        if (correctedPos >= 0 && correctedPos < this.correctedData.length) {
            this.correctedData[correctedPos] = this.correctedData[correctedPos] === 0 ? 1 : 0;
        }
        
        this.updateDisplay();
        this.updateButtons();
        
        this.showAlert(`Error corregido en la posición ${this.errorPosition}`, 'success');
    }

    resetTransmission() {
        this.transmittedData = [...this.encodedData];
        this.correctedData = [];
        this.errorPosition = 0;
        this.errorPositions = [];
        this.syndrome = [];
        
        this.updateDisplay();
        this.updateButtons();
        
        this.showAlert('Transmisión reiniciada', 'info');
    }

    clearAll() {
        this.originalData = '';
        this.encodedData = [];
        this.transmittedData = [];
        this.correctedData = [];
        this.errorPosition = 0;
        this.syndrome = [];
        
        if (this.dataInput) {
            this.dataInput.value = '';
        }
        
        this.updateDisplay();
        this.updateButtons();
        
        this.showAlert('Datos limpiados', 'info');
    }

    generateRandomData() {
        const lengthSlider = document.getElementById('randomLength');
        const length = lengthSlider ? parseInt(lengthSlider.value) : 4;
        
        let randomData = '';
        for (let i = 0; i < length; i++) {
            randomData += Math.random() < 0.5 ? '0' : '1';
        }
        
        if (this.dataInput) {
            this.dataInput.value = randomData;
        }
        
        this.showAlert(`Datos aleatorios generados: ${randomData}`, 'info');
    }

    updateDisplay() {
        this.displayBits(this.encodedData, this.originalBitsContainer, 'original');
        this.displayBits(this.transmittedData, this.transmittedBitsContainer, 'transmitted');
        this.displayBits(this.correctedData, this.correctedBitsContainer, 'corrected');
        this.updateErrorDisplay();
    }

    displayBits(data, container, type) {
        if (!container || data.length === 0) {
            if (container) {
                container.innerHTML = '<p style="text-align: center; color: var(--gray-500); font-style: italic;">No hay datos para mostrar</p>';
            }
            return;
        }

        let html = '';
        data.forEach((bit, index) => {
            const position = index + 1;
            const isParityBit = this.isPowerOfTwo(position);
            const isError = type === 'transmitted' && (
                this.errorPosition === position || 
                this.errorPositions.includes(position)
            );
            const isCorrected = type === 'corrected' && this.errorPosition === position;
            
            let cssClass = isParityBit ? 'parity-bit' : 'data-bit';
            if (isError) cssClass += ' error-bit';
            if (isCorrected) cssClass += ' corrected-bit';
            
            // Generar indicadores de paridad solo para la vista original
            const parityIndicators = type === 'original' ? this.generateParityIndicators(position) : '';
            
            html += `
                <div class="bit-card ${cssClass}" onclick="app.toggleBit(${index}, '${type}')">
                    <span class="bit-position">${position}</span>
                    <span class="bit-value">${bit}</span>
                    ${parityIndicators}
                </div>
            `;
        });

        container.innerHTML = html;
    }

    generateParityIndicators(position) {
        const parityBits = this.getParityBitsForPosition(position);
        if (parityBits.length === 0) return '';
        
        let indicators = '<div class="parity-indicators">';
        parityBits.forEach(parityBit => {
            indicators += `<div class="parity-indicator p${parityBit}">${parityBit}</div>`;
        });
        indicators += '</div>';
        
        return indicators;
    }

    getParityBitsForPosition(position) {
        const parityBits = [];
        let bit = 1;
        let parityIndex = 1;
        
        // Verificar qué bits de paridad cubren esta posición
        while (bit <= position) {
            if ((position & bit) !== 0) {
                parityBits.push(parityIndex);
            }
            bit <<= 1;
            parityIndex++;
        }
        
        return parityBits;
    }

    toggleBit(index, type) {
        if (type === 'transmitted' && this.transmittedData.length > 0) {
            // Reset to original data first, then apply single error
            this.transmittedData = [...this.encodedData];
            this.correctedData = [];
            
            // Set error position (1-indexed)
            this.errorPosition = index + 1;
            
            // Apply the error at the clicked position (0-indexed for array)
            this.transmittedData[index] = this.transmittedData[index] === 0 ? 1 : 0;
            
            this.updateDisplay();
            this.detectError();
            this.updateButtons();
            this.showAlert(`Error simulado en posición ${index + 1}`, 'info');
        }
    }

    updateErrorDisplay() {
        // Update syndrome headers and display
        if (this.syndromeContainer) {
            if (this.syndrome.length > 0) {
                // Generate headers (powers of 2)
                const headersContainer = document.getElementById('syndromeHeaders');
                if (headersContainer) {
                    let headersHtml = '';
                    for (let i = this.syndrome.length - 1; i >= 0; i--) {
                        const power = Math.pow(2, i);
                        headersHtml += `<div class="syndrome-header">${power}</div>`;
                    }
                    headersContainer.innerHTML = headersHtml;
                }
                
                // Generate syndrome bits
                let html = '';
                // Mostrar el síndrome en orden inverso para que el MSB aparezca primero
                for (let i = this.syndrome.length - 1; i >= 0; i--) {
                    const bit = this.syndrome[i];
                    html += `<div class="syndrome-bit ${bit === 1 ? 'active' : ''}">${bit}</div>`;
                }
                this.syndromeContainer.innerHTML = html;
                
                // Update syndrome decimal value
                const syndromeDecimalContainer = document.getElementById('syndromeDecimal');
                if (syndromeDecimalContainer) {
                    let decimalText = '';
                    
                    if (this.errorMode === 'double' && this.errorPositions.length === 2) {
                        const calculatedPos = this.syndromeToPosition(this.syndrome);
                        decimalText = `<strong>Valor decimal:</strong> ${calculatedPos} 
                                     <br><span style="color: #dc3545; font-weight: bold;">⚠️ INCORRECTO: Errores reales en posiciones ${this.errorPositions.join(' y ')}</span>
                                     <br><span style="color: #6c757d; font-size: 0.9em;">El código Hamming no puede corregir 2 errores</span>`;
                    } else if (this.errorMode === 'secded' && this.errorPosition === -1) {
                        decimalText = `<strong>SECDED:</strong> ⚠️ Dos errores detectados - No se puede corregir`;
                    } else {
                        const decimalValue = this.errorPosition;
                        decimalText = `<strong>Valor decimal:</strong> ${decimalValue} ${decimalValue === 0 ? '(Sin error)' : `(Error en posición ${decimalValue})`}`;
                    }
                    
                    syndromeDecimalContainer.innerHTML = decimalText;
                }
            } else {
                this.syndromeContainer.innerHTML = '<p style="color: var(--gray-500);">No calculado</p>';
                const headersContainer = document.getElementById('syndromeHeaders');
                if (headersContainer) {
                    headersContainer.innerHTML = '';
                }
                const syndromeDecimalContainer = document.getElementById('syndromeDecimal');
                if (syndromeDecimalContainer) {
                    syndromeDecimalContainer.innerHTML = '';
                }
            }
        }

        // Update error status
        if (this.errorStatusContainer) {
            if (this.errorPosition === 0) {
                this.errorStatusContainer.innerHTML = '<div class="error-status no-error">✓ No se detectaron errores</div>';
            } else if (this.errorPosition === -1) {
                this.errorStatusContainer.innerHTML = '<div class="error-status error-detected">⚠ SECDED: Dos errores detectados</div>';
            } else if (this.errorMode === 'double' && this.errorPositions.length === 2) {
                this.errorStatusContainer.innerHTML = '<div class="error-status error-detected">⚠ Error detectado (pero cálculo incorrecto)</div>';
            } else {
                this.errorStatusContainer.innerHTML = '<div class="error-status error-detected">⚠ Error detectado</div>';
            }
        }

        // Update error position
        if (this.errorPositionContainer) {
            if (this.errorPosition === 0) {
                this.errorPositionContainer.textContent = 'Ninguna';
            } else if (this.errorPosition === -1) {
                this.errorPositionContainer.textContent = 'Múltiples errores detectados';
            } else if (this.errorMode === 'double' && this.errorPositions.length === 2) {
                this.errorPositionContainer.textContent = `Calculada: ${this.errorPosition} (Real: ${this.errorPositions.join(', ')})`;
            } else {
                this.errorPositionContainer.textContent = `Posición ${this.errorPosition}`;
            }
        }
    }

    updateButtons() {
        const hasEncodedData = this.encodedData.length > 0;
        const hasTransmittedData = this.transmittedData.length > 0;
        const hasError = this.errorPosition > 0;

        if (this.addErrorBtn) {
            this.addErrorBtn.disabled = !hasEncodedData;
        }

        if (this.resetTransmissionBtn) {
            this.resetTransmissionBtn.disabled = !hasTransmittedData;
        }

        if (this.correctErrorBtn) {
            this.correctErrorBtn.disabled = !hasError;
        }
    }

    showAlert(message, type = 'info') {
        // Create alert element
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            color: white;
            font-weight: 600;
            z-index: 1000;
            max-width: 400px;
            box-shadow: var(--shadow-lg);
            animation: slideInRight 0.3s ease;
        `;

        // Set background color based on type
        switch (type) {
            case 'success':
                alert.style.background = 'var(--success-600)';
                break;
            case 'error':
                alert.style.background = 'var(--danger-500)';
                break;
            case 'warning':
                alert.style.background = 'var(--warning-500)';
                break;
            default:
                alert.style.background = 'var(--primary-600)';
        }

        alert.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span>${this.getAlertIcon(type)}</span>
                <span>${message}</span>
            </div>
        `;

        // Add to page
        document.body.appendChild(alert);

        // Auto remove after 3 seconds
        setTimeout(() => {
            alert.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(alert)) {
                    document.body.removeChild(alert);
                }
            }, 300);
        }, 3000);

        // Add CSS animations if not already present
        if (!document.querySelector('#alert-animations')) {
            const style = document.createElement('style');
            style.id = 'alert-animations';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    getAlertIcon(type) {
        switch (type) {
            case 'success': return '✓';
            case 'error': return '✗';
            case 'warning': return '⚠';
            default: return 'ℹ';
        }
    }

    // Tutorial Interactive Functions
    initializeTutorial() {
        this.currentTutorialStep = 1;
        this.totalTutorialSteps = 4;
        
        this.tutorialCards = document.querySelectorAll('.tutorial-step-card');
        this.tutorialPrevBtn = document.querySelector('.tutorial-prev');
        this.tutorialNextBtn = document.querySelector('.tutorial-next');
        this.progressFill = document.querySelector('.progress-fill');
        this.progressText = document.querySelector('.progress-text');
        
        if (this.tutorialPrevBtn && this.tutorialNextBtn) {
            this.tutorialPrevBtn.addEventListener('click', () => this.previousTutorialStep());
            this.tutorialNextBtn.addEventListener('click', () => this.nextTutorialStep());
        }

        // Add keyboard navigation
        this.setupTutorialKeyboardNavigation();

        this.updateTutorialDisplay();
        this.addTutorialAnimations();
    }

    setupTutorialKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Only work when tutorial section is active
            if (document.getElementById('tutorial').classList.contains('active')) {
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.nextTutorialStep();
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.previousTutorialStep();
                }
            }
        });
    }

    nextTutorialStep() {
        if (this.currentTutorialStep < this.totalTutorialSteps) {
            this.currentTutorialStep++;
            this.updateTutorialDisplay();
        }
    }

    previousTutorialStep() {
        if (this.currentTutorialStep > 1) {
            this.currentTutorialStep--;
            this.updateTutorialDisplay();
        }
    }

    updateTutorialDisplay() {
        // Update card visibility with smooth transition
        this.tutorialCards.forEach((card, index) => {
            const stepNumber = index + 1;
            if (stepNumber === this.currentTutorialStep) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });

        // Update navigation buttons
        if (this.tutorialPrevBtn) {
            this.tutorialPrevBtn.disabled = this.currentTutorialStep === 1;
        }
        if (this.tutorialNextBtn) {
            this.tutorialNextBtn.disabled = this.currentTutorialStep === this.totalTutorialSteps;
            
            // Change text for last step
            const btnText = this.tutorialNextBtn.querySelector('.btn-text');
            if (btnText) {
                btnText.textContent = this.currentTutorialStep === this.totalTutorialSteps ? 'Finalizar' : 'Siguiente';
            }
        }

        // Update progress bar
        const progressPercentage = (this.currentTutorialStep / this.totalTutorialSteps) * 100;
        if (this.progressFill) {
            this.progressFill.style.width = `${progressPercentage}%`;
        }
        if (this.progressText) {
            this.progressText.textContent = `Paso ${this.currentTutorialStep} de ${this.totalTutorialSteps}`;
        }

        // Add a small vibration effect to the progress bar
        if (this.progressFill) {
            this.progressFill.style.animation = 'none';
            setTimeout(() => {
                this.progressFill.style.animation = 'pulse 0.3s ease-in-out';
            }, 10);
        }
    }

    addTutorialAnimations() {
        // Add hover effects to position items
        const positionItems = document.querySelectorAll('.position-item');
        positionItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-4px) scale(1.05)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Add hover effects to calculation steps
        const calcSteps = document.querySelectorAll('.calc-step');
        calcSteps.forEach(step => {
            step.addEventListener('mouseenter', () => {
                step.style.transform = 'translateX(8px)';
                step.style.background = 'var(--primary-50)';
            });
            
            step.addEventListener('mouseleave', () => {
                step.style.transform = 'translateX(0)';
                step.style.background = step.classList.contains('result') ? 
                    'linear-gradient(135deg, var(--green-50) 0%, var(--green-100) 100%)' : 
                    'var(--gray-50)';
            });
        });

        // Add shimmer effect to step numbers
        const stepNumbers = document.querySelectorAll('.step-number');
        stepNumbers.forEach(stepNumber => {
            stepNumber.addEventListener('click', () => {
                stepNumber.style.animation = 'none';
                setTimeout(() => {
                    stepNumber.style.animation = 'pulse 1s ease-in-out';
                }, 10);
            });
        });
    }

    // Enhanced navigation with tutorial initialization
    setupNavigation() {
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.switchToSection(section);
            });
        });

        // Mobile menu functionality is handled in setupEventListeners()
    }

    switchToSection(sectionName) {
        // Update navigation
        this.navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.section === sectionName);
        });

        // Update content sections
        this.contentSections.forEach(section => {
            section.classList.toggle('active', section.id === sectionName);
        });

        // Initialize tutorial if switching to tutorial section
        if (sectionName === 'tutorial') {
            setTimeout(() => {
                this.initializeTutorial();
            }, 100);
        }

        // Close mobile menu
        if (this.sidebar) {
            this.sidebar.classList.remove('mobile-open');
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new HammingCodeApp();
});
// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new HammingCodeApp();
});
