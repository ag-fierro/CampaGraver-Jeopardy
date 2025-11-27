// script.js - Carga de JSON y Construcción del Tablero
document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('jeopardyGrid');
    const modal = document.getElementById('questionModal');
    const closeBtn = document.querySelector('.close-button');
    const closeLockBtn = document.getElementById('closeAndLockBtn');
   

    let currentCard = null;

    // --- Funciones del Modal (Mantener iguales) ---
    const showModal = () => {

        modal.style.display = 'block';
    };

    const hideModal = () => {
        modal.style.display = 'none';
        if (currentCard) {
            currentCard.classList.remove('flipping');
        }
    };
    
    closeBtn.addEventListener('click', () => {
        if (currentCard) {
            currentCard.classList.add('used');
        }
        hideModal();
    });

    closeLockBtn.addEventListener('click', () => {
        if (currentCard) {
            currentCard.classList.add('used');
        }
        hideModal();
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            hideModal();
        }
    });

    // --- NUEVA LÓGICA: Cargar y Construir el Tablero ---
    
    async function loadJeopardyBoard() {
        try {
            // Intenta obtener los datos del archivo JSON
            const response = await fetch('preguntas.json');
            if (!response.ok) {
                throw new Error(`Error al cargar preguntas.json: ${response.statusText}`);
            }
            const data = await response.json();
            
            // 1. Construir Encabezados de Categoría
            data.Categorias.forEach(categoria => {
                const header = document.createElement('div');
                header.className = 'category-header';
                header.textContent = categoria.nombre;
                gridContainer.appendChild(header);
            });

            // 2. Construir Tarjetas de Pregunta
            const numPreguntas = data.Categorias[0].preguntas.length; // Asume 5 niveles

            // Bucle por niveles (filas)
            for (let i = 0; i < numPreguntas; i++) {
                // Bucle por categorías (columnas)
                data.Categorias.forEach((categoria, catIndex) => {
                    const preguntaData = categoria.preguntas[i];
                    
                    const card = document.createElement('div');
                    card.className = 'question-card ';
                    // Almacenar todos los datos importantes en atributos data-*
                    card.setAttribute('data-points', preguntaData.puntaje);
                    card.setAttribute('data-category', categoria.nombre);
                    card.setAttribute('data-icon', categoria.icono || '');
                    card.setAttribute('data-pregunta', preguntaData.pregunta);
                    card.setAttribute('data-respuesta', preguntaData.respuesta);

                    // Estructura de giro interna
                    card.innerHTML = `
                        <div class="card-inner">
                            <div class="card-face card-front">
                                ${preguntaData.titulo}
                            </div>
                            <div class="card-face card-back">
                                <span class="back-text">${categoria.icono || ''}</span>
                            </div>
                        </div>
                    `;

                    // Añadir el manejador de eventos a la tarjeta recién creada
                    card.addEventListener('click', handleCardClick);

                    gridContainer.appendChild(card);
                });
            }
        } catch (error) {
            console.error('Fallo al cargar el tablero:', error);
            gridContainer.innerHTML = '<p style="color:red;">Error al cargar los datos del juego. Revisa el archivo data.json.</p>';
        }
    }

    // 3. Función de Manejo de Clic (similar a la anterior, pero usando atributos data-*)
    function handleCardClick() {
        if (this.classList.contains('used')) return;

        currentCard = this;

        // Inicia la animación de giro
        this.classList.add('flipping');

        // Muestra el modal después del giro
        setTimeout(() => {

            if (currentCard.getAttribute('data-points') == 0) {
                mensaje = `Preparate para el desafío especial!`
            }
            else{
                mensaje = `${currentCard.getAttribute('data-points')} Puntos`
            }
            
            document.getElementById('modalCategory').textContent = currentCard.getAttribute('data-category') + " " + currentCard.getAttribute('data-icon');
            document.getElementById('modalPoints').textContent = mensaje;
            document.getElementById('modalQuestion').innerHTML = currentCard.getAttribute('data-pregunta');
            
            
            showModal();
        }, 600); // Coincide con la duración de la transición CSS
    }

    // Iniciar la carga del tablero al cargar la página
    loadJeopardyBoard();
});