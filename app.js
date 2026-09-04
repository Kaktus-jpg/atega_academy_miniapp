const programs = [
  {
    id: "marketplace_intensive",
    label: "ИНТЕНСИВ",
    number: "01",
    name: "Интенсив",
    course_title: "Менеджер маркетплейсов: с нуля до первых продаж",
    duration: "2 недели",
    hours: 20,
    price_rub: 15000,
    description: "Бюджетный, но качественный курс для новичков, который помогает понять, как устроены маркетплейсы, освоить базовые процессы и терминологию, а также попробовать типовые задания на учебных примерах."
  },
  {
    id: "marketplace_basic",
    label: "БАЗОВЫЙ КУРС",
    number: "02",
    name: "Базовый курс",
    course_title: "Менеджер маркетплейсов: с нуля до первых продаж",
    duration: "4 недели",
    hours: 35,
    price_rub: 25000,
    description: "Базовый курс для новичков, который даёт не просто теорию, а готовый набор инструментов для старта карьеры или бизнеса. Вы освоите анализ ниши, расчёт базовой юнит-экономики, подготовку карточки, логистику, запуск и базовую аналитику, а также разберёте больше практических кейсов и шаблонов."
  },
  {
    id: "marketplace_advanced",
    label: "С КУРАТОРОМ",
    number: "03",
    name: "Углублённый курс с куратором",
    course_title: "Менеджер маркетплейсов: с нуля до первых продаж",
    duration: "8 недель",
    hours: 70,
    price_rub: 45000,
    description: "Продвинутый основной курс с полным спектром знаний: от первого шага и выбора ниши до выбора модели отгрузки и расчёта юнит-экономики. На каждом уроке вас ждут реальные примеры из практики, общение с куратором и живое сопровождение экспертов."
  }
];

const $ = (selector) => document.querySelector(selector);
let tg = null;
let selectedProgram = null;

window.addEventListener("DOMContentLoaded", () => {
  if (window.Telegram && window.Telegram.WebApp) {
    tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
  }

  renderPrograms();
  bindEvents();
});

function bindEvents() {
  $("#open-directions").addEventListener("click", () => show("directions"));
  $("#open-courses").addEventListener("click", () => show("courses"));
  $("#choose").addEventListener("click", chooseProgram);

  document.querySelectorAll("[data-back]").forEach((button) => {
    button.addEventListener("click", () => show(button.dataset.back));
  });
}

function renderPrograms() {
  $("#course-list").innerHTML = programs.map((program) => `
    <button class="course-preview" data-program-id="${program.id}">
      <div class="course-preview-art">
        <span>${program.number}</span>
        <div class="chart"><i></i><i></i><i></i></div>
      </div>
      <div class="preview-content">
        <span class="course-label">${program.label} · ДЛЯ НОВИЧКОВ</span>
        <h2>${program.name}</h2>
        <p>${program.duration} · ${program.hours} академических часов</p>
        <strong>${formatPrice(program.price_rub)} <small>за курс</small></strong>
      </div>
      <span class="preview-link">Подробнее <b>→</b></span>
    </button>
  `).join("");

  document.querySelectorAll("[data-program-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.programId;
      selectedProgram = programs.find((program) => program.id === id);
      renderCourseDetails();
      show("course");
    });
  });
}

function renderCourseDetails() {
  $("#cover-kicker").textContent = `MARKETPLACE / ${selectedProgram.number}`;
  $("#course-title").textContent = selectedProgram.name;
  $("#course-price").innerHTML = `${formatPrice(selectedProgram.price_rub)} <span>полная стоимость</span>`;
  $("#course-duration").textContent = selectedProgram.duration;
  $("#course-hours").textContent = `${selectedProgram.hours} академических часов`;
  $("#course-description").textContent = selectedProgram.description;
}

function show(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });

  $(`#${screenId}`).classList.add("active");
  $("#choose").classList.toggle("hidden", screenId !== "course");
  window.scrollTo(0, 0);
}

function formatPrice(price) {
  return `${price.toLocaleString("ru-RU")} ₽`;
}

function toast(text) {
  const element = $("#toast");
  element.textContent = text;
  element.classList.add("show");
  setTimeout(() => element.classList.remove("show"), 3000);
}

function chooseProgram() {
  if (!selectedProgram) {
    toast("Сначала выберите программу.");
    return;
  }

  if (!tg) {
    toast("Откройте Mini App внутри Telegram-бота.");
    return;
  }

  const payload = {
    action: "course_selected",
    category: "Маркетплейсы",
    format: "Полностью дистанционный",
    level: "Для новичков",
    ...selectedProgram
  };

  try {
    tg.HapticFeedback?.impactOccurred("medium");
    tg.sendData(JSON.stringify(payload));
  } catch (error) {
    console.error("Ошибка отправки данных:", error);
    toast("Не удалось передать выбор боту.");
  }
}
