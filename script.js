class HammingCode {
    constructor() {
        this.originalData = '';
        this.encodedData = [];
        this.transmittedData = [];
        this.correctedData = [];
        this.errorPosition = 0;
        this.syndrome = [];
        
        this.init();
    }

    init() {
        // Referencias a elementos del DOM
        this.dataInput = document.getElementById('dataInput');
        this.encodeBtn = document.getElementById('encodeBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.addErrorBtn = document.getElementById('addErrorBtn');
        this.resetTransmissionBtn = document.getElementById('resetTransmissionBtn');
        this.correctErrorBtn = document.getElementById('correctErrorBtn');
        
        this.originalCodeContainer = document.getElementById('originalCode');
        this.transmittedCodeContainer = document.getElementById('transmittedCode');
        this.correctedCodeContainer = document.getElementById('correctedCode');
        this.syndromeContainer = document.getElementById('syndrome');
        this.errorStatus = document.getElementById('errorStatus');
        this.errorPositionDisplay = document.getElementById('errorPosition');

        // Event listeners
        this.encodeBtn.addEventListener('click', () => this.encodeData());
        this.clearBtn.addEventListener('click', () => this.clearAll());
        this.addErrorBtn.addEventListener('click', () => this.addRandomError());
        this.resetTransmissionBtn.addEventListener('click', () => this.resetTransmission());
        this.correctErrorBtn.addEventListener('click', () => this.correctError());
        
        // Validación de entrada en tiempo real
        this.dataInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^01]/g, '');
        });
        
        // Permitir codificar con Enter
        this.dataInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.encodeData();
            }
        });

        this.updateUI();
    }

    // Calcula cuántos bits de paridad se necesitan
    calculateParityBits(dataLength) {
        let parityBits = 0;
        while (Math.pow(2, parityBits) < dataLength + parityBits + 1) {
            parityBits++;
        }
        return parityBits;
    }

    // Codifica los datos con código Hamming
    encodeData() {
        const input = this.dataInput.value.trim();
        if (!input) {
            alert('Por favor, ingresa algunos datos binarios.');
            return;
        }

        if (!/^[01]+$/.test(input)) {
            alert('Solo se permiten bits (0 y 1).');
            return;
        }

        this.originalData = input;
        const dataLength = input.length;
        const parityBitsCount = this.calculateParityBits(dataLength);
        const totalLength = dataLength + parityBitsCount;

        // Inicializar array de bits codificados
        this.encodedData = new Array(totalLength + 1); // +1 porque empezamos desde posición 1
        
        // Colocar bits de datos en posiciones que no son potencias de 2
        let dataIndex = 0;
        for (let pos = 1; pos <= totalLength; pos++) {
            if (!this.isPowerOfTwo(pos)) {
                this.encodedData[pos] = parseInt(input[dataIndex]);
                dataIndex++;
            }
        }

        // Calcular y colocar bits de paridad
        for (let parityPos = 1; parityPos <= totalLength; parityPos *= 2) {
            let parity = 0;
            for (let checkPos = 1; checkPos <= totalLength; checkPos++) {
                if ((checkPos & parityPos) !== 0 && checkPos !== parityPos) {
                    parity ^= this.encodedData[checkPos] || 0;
                }
            }
            this.encodedData[parityPos] = parity;
        }

        // Copiar datos codificados a transmisión
        this.transmittedData = [...this.encodedData];
        this.correctedData = [];
        this.errorPosition = 0;
        this.syndrome = [];

        this.updateUI();
    }

    // Verifica si un número es potencia de 2
    isPowerOfTwo(n) {
        return n > 0 && (n & (n - 1)) === 0;
    }

    // Agrega un error aleatorio
    addRandomError() {
        if (this.transmittedData.length === 0) {
            alert('Primero debes codificar algunos datos.');
            return;
        }

        // Seleccionar posición aleatoria (excluyendo posición 0)
        const randomPos = Math.floor(Math.random() * (this.transmittedData.length - 1)) + 1;
        
        // Cambiar el bit
        this.transmittedData[randomPos] = this.transmittedData[randomPos] === 1 ? 0 : 1;
        
        this.calculateSyndrome();
        this.updateUI();
    }

    // Calcula el síndrome de error
    calculateSyndrome() {
        if (this.transmittedData.length === 0) return;

        let syndromeValue = 0;
        const totalLength = this.transmittedData.length - 1;

        // Calcular síndrome para cada bit de paridad
        for (let parityPos = 1; parityPos <= totalLength; parityPos *= 2) {
            let parity = 0;
            for (let checkPos = 1; checkPos <= totalLength; checkPos++) {
                if ((checkPos & parityPos) !== 0) {
                    parity ^= this.transmittedData[checkPos] || 0;
                }
            }
            if (parity !== 0) {
                syndromeValue += parityPos;
            }
        }

        this.errorPosition = syndromeValue;
        
        // Convertir síndrome a binario para visualización
        this.syndrome = [];
        let tempSyndrome = syndromeValue;
        const maxParityBits = this.calculateParityBits(this.originalData.length);
        
        for (let i = 0; i < maxParityBits; i++) {
            this.syndrome.unshift(tempSyndrome & 1);
            tempSyndrome >>= 1;
        }
    }

    // Corrige el error detectado
    correctError() {
        if (this.transmittedData.length === 0) {
            alert('Primero debes codificar algunos datos.');
            return;
        }

        this.calculateSyndrome();
        
        this.correctedData = [...this.transmittedData];
        
        if (this.errorPosition > 0 && this.errorPosition < this.correctedData.length) {
            // Corregir el bit erróneo
            this.correctedData[this.errorPosition] = this.correctedData[this.errorPosition] === 1 ? 0 : 1;
        }

        this.updateUI();
    }

    // Resetea la transmisión a los datos originales codificados
    resetTransmission() {
        if (this.encodedData.length === 0) {
            alert('Primero debes codificar algunos datos.');
            return;
        }

        this.transmittedData = [...this.encodedData];
        this.correctedData = [];
        this.errorPosition = 0;
        this.syndrome = [];
        
        this.updateUI();
    }

    // Limpia todos los datos
    clearAll() {
        this.dataInput.value = '';
        this.originalData = '';
        this.encodedData = [];
        this.transmittedData = [];
        this.correctedData = [];
        this.errorPosition = 0;
        this.syndrome = [];
        
        this.updateUI();
    }

    // Crea un elemento de bit visual
    createBitElement(value, position, type, isError = false, isCorrected = false) {
        const bitCard = document.createElement('div');
        bitCard.className = `bit-card ${type}`;
        
        if (isError) {
            bitCard.classList.add('error-bit');
        }
        
        if (isCorrected) {
            bitCard.classList.add('corrected-bit');
        }
        
        bitCard.textContent = value;
        
        // Agregar indicador de posición
        const positionIndicator = document.createElement('div');
        positionIndicator.className = 'bit-position';
        positionIndicator.textContent = position;
        bitCard.appendChild(positionIndicator);
        
        // Hacer clickeable para alternar bit en transmisión
        if (type === 'transmitted') {
            bitCard.style.cursor = 'pointer';
            bitCard.addEventListener('click', () => this.toggleBit(position));
        }
        
        return bitCard;
    }

    // Alterna un bit en la transmisión (para simular errores manuales)
    toggleBit(position) {
        if (this.transmittedData.length === 0) return;
        
        this.transmittedData[position] = this.transmittedData[position] === 1 ? 0 : 1;
        this.calculateSyndrome();
        this.updateUI();
    }

    // Actualiza toda la interfaz de usuario
    updateUI() {
        this.updateBitDisplay(this.originalCodeContainer, this.encodedData, 'original');
        this.updateBitDisplay(this.transmittedCodeContainer, this.transmittedData, 'transmitted');
        this.updateBitDisplay(this.correctedCodeContainer, this.correctedData, 'corrected');
        this.updateSyndromeDisplay();
        this.updateErrorStatus();
        this.updateButtonStates();
    }

    // Actualiza la visualización de bits
    updateBitDisplay(container, data, type) {
        container.innerHTML = '';
        
        if (data.length === 0) {
            container.innerHTML = '<p style="color: #718096; font-style: italic;">No hay datos para mostrar</p>';
            return;
        }

        for (let pos = 1; pos < data.length; pos++) {
            const value = data[pos];
            const isParity = this.isPowerOfTwo(pos);
            const bitType = isParity ? 'parity-bit' : 'data-bit';
            
            let isError = false;
            let isCorrected = false;
            
            if (type === 'transmitted' && this.errorPosition === pos) {
                isError = true;
            }
            
            if (type === 'corrected' && this.errorPosition === pos && this.correctedData.length > 0) {
                isCorrected = true;
            }
            
            const bitElement = this.createBitElement(value, pos, bitType, isError, isCorrected);
            container.appendChild(bitElement);
        }
    }

    // Actualiza la visualización del síndrome
    updateSyndromeDisplay() {
        this.syndromeContainer.innerHTML = '';
        
        if (this.syndrome.length === 0) {
            this.syndromeContainer.innerHTML = '<p style="color: #718096; font-style: italic;">No calculado</p>';
            return;
        }

        this.syndrome.forEach((bit, index) => {
            const syndromeElem = document.createElement('div');
            syndromeElem.className = `syndrome-bit ${bit === 1 ? 'active' : ''}`;
            syndromeElem.textContent = bit;
            this.syndromeContainer.appendChild(syndromeElem);
        });
    }

    // Actualiza el estado del error
    updateErrorStatus() {
        if (this.transmittedData.length === 0) {
            this.errorStatus.innerHTML = '';
            this.errorPositionDisplay.innerHTML = '';
            return;
        }

        this.calculateSyndrome();

        if (this.errorPosition === 0) {
            this.errorStatus.innerHTML = '<div class="status-message no-error">✅ No se detectaron errores</div>';
            this.errorPositionDisplay.innerHTML = '';
        } else {
            this.errorStatus.innerHTML = '<div class="status-message error-detected">⚠️ Error detectado</div>';
            this.errorPositionDisplay.innerHTML = `<strong>Posición del error:</strong> ${this.errorPosition}`;
        }
    }

    // Actualiza el estado de los botones
    updateButtonStates() {
        const hasEncodedData = this.encodedData.length > 0;
        const hasTransmittedData = this.transmittedData.length > 0;
        const hasError = this.errorPosition > 0;

        this.addErrorBtn.disabled = !hasTransmittedData;
        this.resetTransmissionBtn.disabled = !hasEncodedData;
        this.correctErrorBtn.disabled = !hasTransmittedData;

        // Actualizar estilos de botones deshabilitados
        [this.addErrorBtn, this.resetTransmissionBtn, this.correctErrorBtn].forEach(btn => {
            if (btn.disabled) {
                btn.style.opacity = '0.5';
                btn.style.cursor = 'not-allowed';
            } else {
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
            }
        });
    }
}

// Función para mostrar información al cargar la página
function showWelcomeInfo() {
    // Mostrar ejemplo automático después de 2 segundos
    setTimeout(() => {
        const hammingCode = window.hammingCodeInstance;
        if (hammingCode && hammingCode.dataInput.value === '') {
            hammingCode.dataInput.value = '1011';
            hammingCode.encodeData();
            
            // Mostrar una pequeña animación de bienvenida
            const sections = document.querySelectorAll('section');
            sections.forEach((section, index) => {
                section.style.opacity = '0';
                section.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    section.style.transition = 'all 0.6s ease';
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0)';
                }, index * 200);
            });
        }
    }, 2000);
}

// Inicializar la aplicación cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    window.hammingCodeInstance = new HammingCode();
    showWelcomeInfo();
    
    // Agregar algunos eventos adicionales para mejorar la experiencia
    document.addEventListener('keydown', (e) => {
        // Atajos de teclado
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'Enter':
                    e.preventDefault();
                    window.hammingCodeInstance.encodeData();
                    break;
                case 'e':
                    e.preventDefault();
                    window.hammingCodeInstance.addRandomError();
                    break;
                case 'r':
                    e.preventDefault();
                    window.hammingCodeInstance.resetTransmission();
                    break;
                case 'c':
                    e.preventDefault();
                    window.hammingCodeInstance.correctError();
                    break;
            }
        }
    });
    
    console.log('🔧 Aplicación de Codificación Hamming cargada correctamente!');
    console.log('💡 Atajos de teclado disponibles:');
    console.log('   - Ctrl/Cmd + Enter: Codificar');
    console.log('   - Ctrl/Cmd + E: Agregar error');
    console.log('   - Ctrl/Cmd + R: Resetear transmisión');
    console.log('   - Ctrl/Cmd + C: Corregir error');
});
