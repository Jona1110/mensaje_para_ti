document.addEventListener('DOMContentLoaded', () => {
    const preOpenContent = document.getElementById('pre-open-content');
    const envelopeArea = document.getElementById('envelope-area');
    const envelope = document.getElementById('envelope');
    const letterContent = document.getElementById('letter-content');
    const notification = document.getElementById('notification');
    const bellSound = document.getElementById('bell-sound');
    const testerButton = document.getElementById('tester-button');
    const pressText = document.getElementById('press-text');

    // Elementos del contador
    const daysSpan = document.getElementById('days');
    const hoursSpan = document.getElementById('hours');
    const minutesSpan = document.getElementById('minutes');
    const secondsSpan = document.getElementById('seconds');

    // La hora de apertura: 3 de Noviembre, 9:00 AM (Hora local de México)
    // Para mayor precisión en la zona horaria, se puede especificar.
    // Usaremos un formato que Date.parse pueda entender y configuraremos manualmente la zona horaria.
    // México central (CDT/CST) suele ser UTC-5 o UTC-6.
    // Ejemplo: '2025-11-03T09:00:00-06:00' (UTC-6)
    // Si la fecha es pasada, usa una futura para pruebas.
    const OPEN_DATE_STRING = '2025-11-03T09:00:00-06:00'; // Formato ISO 8601 con offset de zona horaria
    const OPEN_TIME = new Date(OPEN_DATE_STRING).getTime();
    
    let isOpened = false;
    let countdownInterval; // Variable para almacenar el ID del intervalo del contador

    /**
     * Muestra y oculta la notificación de manera elegante.
     * @param {string} message - Mensaje a mostrar.
     */
    function showNotification(message) {
        notification.innerHTML = message; // Usar innerHTML para el emoji y el negrita
        notification.classList.remove('hidden');
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.classList.add('hidden');
            }, 600); // Duración de la transición de ocultar
        }, 3000); // Muestra por 3 segundos
    }

    /**
     * Actualiza el contador regresivo.
     */
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = OPEN_TIME - now;

        // Si la cuenta regresiva ha terminado
        if (distance < 0) {
            clearInterval(countdownInterval);
            daysSpan.textContent = '00';
            hoursSpan.textContent = '00';
            minutesSpan.textContent = '00';
            secondsSpan.textContent = '00';
            // Mostrar el sobre como "listo para abrir" si aún no se ha abierto
            if (!isOpened) {
                envelopeArea.style.pointerEvents = 'auto'; // Habilitar clics
                pressText.textContent = "¡Ya es hora! Presiona el sobre 💌";
                pressText.classList.add('pulsate-ready'); // Clase para una animación especial si quieres
            }
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        daysSpan.innerHTML = `${String(days).padStart(2, '0')} <small>Días</small>`;
        hoursSpan.innerHTML = `${String(hours).padStart(2, '0')} <small>Horas</small>`;
        minutesSpan.innerHTML = `${String(minutes).padStart(2, '0')} <small>Minutos</small>`;
        secondsSpan.innerHTML = `${String(seconds).padStart(2, '0')} <small>Segundos</small>`;
    }

    /**
     * Abre la carta con la animación y el sonido.
     */
    function openLetter() {
        if (isOpened) return;
        isOpened = true; // Marca como abierta inmediatamente para evitar múltiples aperturas
        
        clearInterval(countdownInterval); // Detener el contador

        // 1. Reproducir sonido
        bellSound.play();

        // 2. Animación de apertura del sobre
        envelope.classList.add('opened');
        envelopeArea.classList.remove('opening');
        
        // Ocultar el contenido previo al sobre suavemente
        document.body.classList.add('opened'); // Activa las transiciones para ocultar 'pre-open-content'

        // 3. Mostrar la carta después de un breve retraso
        setTimeout(() => {
            letterContent.classList.remove('hidden');
            // Timeout para forzar la transición CSS
            setTimeout(() => {
                letterContent.classList.add('visible');
            }, 50); // Pequeño retraso para que CSS aplique 'display: block' antes de la transición
        }, 800); // Ajusta este tiempo para que coincida con la animación de la tapa
    }

    /**
     * Verifica la hora y abre la carta o muestra la notificación.
     */
    function handleEnvelopeClick() {
        if (isOpened) return;

        const currentTime = new Date().getTime();

        if (currentTime >= OPEN_TIME) {
            openLetter();
        } else {
            showNotification('💫 “Aún no es hora de abrir la carta, espera un poquito más...”');
        }
    }

    // --- Inicialización ---
    countdownInterval = setInterval(updateCountdown, 1000); // Inicia el contador
    updateCountdown(); // Llama una vez inmediatamente para evitar el parpadeo inicial

    // --- Event Listeners ---
    envelopeArea.addEventListener('click', handleEnvelopeClick);

    envelopeArea.addEventListener('mouseenter', () => {
        if (!isOpened) envelopeArea.classList.add('opening');
    });
    envelopeArea.addEventListener('mouseleave', () => {
        if (!isOpened) envelopeArea.classList.remove('opening');
    });

    // Botón Tester (Abre sin importar la hora)
    testerButton.addEventListener('click', () => {
        if (!isOpened) { // Solo si no está abierta ya
            openLetter();
            showNotification('✅ **Modo Tester:** ¡Carta Abierta!');
        }
    });
});