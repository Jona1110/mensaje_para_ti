// --- Configuración de hora (mañana 9:00 am) ---
const targetTime = new Date();
targetTime.setHours(9, 0, 0, 0);
if (new Date() > targetTime) targetTime.setDate(targetTime.getDate() + 1);

const countdown = document.getElementById("countdown");
const envelope = document.getElementById("envelope");
const letter = document.getElementById("letter");
const message = document.getElementById("message");
const sound = document.getElementById("bell-sound");
const notification = document.getElementById("notification");

// --- Mensaje ---
const loveMessage = `
Mi amor, sé que en este momento estás disfrutando de la playa, del sol y de momentos bonitos, pero quiero que sepas que te pienso en cada instante, 
no importa la distancia ni el tiempo, porque mi corazón sigue contigo, estoy contando los días para volver a verte, abrazarte y decirte todo lo que te he guardado, e
sta carta es solo un pequeño recordatorio de cuánto te amo, de lo feliz que soy contigo, y de que aunque estemos lejos, siempre hay un pedacito de mí allá contigo.

Te adoro con todo mi ser, mi vida. 💖
Con todo mi amor,
— Jony
`;

// --- Mostrar notificación suave ---
function showNotification(text) {
  notification.textContent = text;
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

// --- Corazones flotando ---
function createHearts() {
  const container = document.getElementById("hearts");
  setInterval(() => {
    const heart = document.createElement("div");
    heart.classList.add("heart");
    heart.innerHTML = "❤";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = Math.random() * 20 + 10 + "px";
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 6000);
  }, 400);
}
createHearts();

// --- Cuenta regresiva ---
function updateCountdown() {
  const now = new Date();
  const diff = targetTime - now;

  if (diff <= 0) {
    countdown.textContent = "💌 ¡Ya puedes abrir tu carta, mi amor! 💌";
    return;
  }

  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);

  countdown.textContent = `Faltan ${h}h ${m}m ${s}s para abrir tu carta 💖`;
}
setInterval(updateCountdown, 1000);
updateCountdown();

// --- Abrir carta ---
function openLetter() {
  const now = new Date();
  if (now < targetTime && !forceMode) {
    showNotification("⏳ Aún no es hora, mi amor. Espera un poquito más 💕");
    return;
  }

  sound.play();
  envelope.classList.add("hidden");
  letter.classList.remove("hidden");
  setTimeout(() => letter.classList.add("show"), 200);

  typeWriter(loveMessage, message, 25);
}

// --- Máquina de escribir ---
function typeWriter(text, element, speed) {
  let i = 0;
  element.innerHTML = "";
  (function typing() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    }
  })();
}

// --- Botón tester ---
let forceMode = false;
function forceOpen() {
  forceMode = true;
  openLetter();
}
