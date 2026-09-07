const screens = {
  countdown: document.getElementById("countdown"),
  greeting: document.getElementById("greeting"),
  cat: document.getElementById("cat-screen"),
  letter: document.getElementById("letter-screen"),
  final: document.getElementById("final-screen")
};

const number = document.getElementById("number");
const pages = [...document.querySelectorAll(".page")];
const pageCount = document.getElementById("pageCount");
const hint = document.getElementById("hint");
let currentPage = 0;
let touchStartX = 0;
let touchStartY = 0;

function showScreen(screen) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screen.classList.add("active");
}

function countdown() {
  let n = 3;
  number.textContent = n;

  const timer = setInterval(() => {
    n--;

    if (n > 0) {
      number.textContent = n;
      number.style.animation = "none";
      void number.offsetWidth;
      number.style.animation = "pop .8s ease";
    } else {
      clearInterval(timer);
      showScreen(screens.greeting);
      setTimeout(() => showScreen(screens.cat), 2800);
    }
  }, 1000);
}

function openLetter() {
  showScreen(screens.letter);
}

function updatePage(direction) {
  if (direction > 0 && currentPage < pages.length - 1) {
    pages[currentPage].classList.remove("current");
    pages[currentPage].classList.add("out");
    currentPage++;
    pages[currentPage].classList.remove("out");
    pages[currentPage].classList.add("current");
  } else if (direction < 0 && currentPage > 0) {
    pages[currentPage].classList.remove("current");
    currentPage--;
    pages[currentPage].classList.remove("out");
    pages[currentPage].classList.add("current");
  }

  pageCount.textContent = `${currentPage + 1} / ${pages.length}`;

  if (currentPage === pages.length - 1) {
    hint.textContent = "Continúa →";
  } else {
    hint.textContent = "Desliza para continuar →";
  }

  if (direction > 0 && currentPage === pages.length - 1) {
    setTimeout(() => showScreen(screens.final), 900);
  }
}

document.getElementById("openLetter").addEventListener("click", openLetter);

document.addEventListener("keydown", e => {
  if (!screens.letter.classList.contains("active")) return;
  if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
    e.preventDefault();
    updatePage(1);
  }
  if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
    e.preventDefault();
    updatePage(-1);
  }
});

const letterScreen = document.getElementById("letter-screen");

letterScreen.addEventListener("touchstart", e => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

letterScreen.addEventListener("touchend", e => {
  const endX = e.changedTouches[0].screenX;
  const endY = e.changedTouches[0].screenY;
  const dx = endX - touchStartX;
  const dy = endY - touchStartY;

  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
    updatePage(dx < 0 ? 1 : -1);
  }
}, { passive: true });

countdown();
