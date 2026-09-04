const COURSE_TITLE = "Менеджер маркетплейсов: с нуля до первых продаж";

const options = {
  intensive: {
    id: "marketplace_manager_intensive",
    number: "01",
    format: "Интенсив",
    title: COURSE_TITLE,
    category: "Маркетинг",
    learning_format: "Полностью дистанционный",
    duration: "2 недели",
    academic_hours: 20,
    price_rub: 15000,
    level: "Для новичков",
    description: "Бюджетный, но качественный курс для новичков, который помогает понять, как устроены маркетплейсы, освоить базовые процессы и терминологию, а также попробовать типовые задания на учебных примерах."
  },
  basic: {
    id: "marketplace_manager_basic",
    number: "02",
    format: "Базовый курс",
    title: COURSE_TITLE,
    category: "Маркетинг",
    learning_format: "Полностью дистанционный",
    duration: "4 недели",
    academic_hours: 35,
    price_rub: 25000,
    level: "Для новичков",
    description: "Базовый курс для новичков, который даёт не только теорию, но и готовый набор инструментов для старта карьеры или бизнеса. Вы разберёте анализ ниши, базовую юнит-экономику, подготовку карточки товара, логистику, запуск, базовую аналитику, практические кейсы и шаблоны."
  }
};

const $ = (selector) => document.querySelector(selector);
let selectedCourse = null;
let tg = null;

window.addEventListener("DOMContentLoaded", () => {
  if (window.Telegram && window.Telegram.WebApp) {
    tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
  }

  $("#open-directions").addEventListener("click", () => show("directions"));
  $("#open-courses").addEventListener("click", () => show("courses"));

  document.querySelectorAll(".course-option").forEach((button) => {
    button.addEventListener("click", () => openCourse(button.dataset.option));
  });

  document.querySelectorAll("[data-back]").forEach((button) => {
    button.addEventListener("click", () => show(button.dataset.back));
  });

  $("#choose").addEventListener("click", sendCourseToBot);
});

function openCourse(optionId) {
  selectedCourse = options[optionId];

  $("#cover-number").textContent = selectedCourse.number;
  $("#detail-format").textContent = selectedCourse.format.toUpperCase();
  $("#detail-price").textContent = `${selectedCourse.price_rub.toLocaleString("ru-RU")} ₽`;
  $("#detail-duration").textContent = selectedCourse.duration;
  $("#detail-hours").textContent = `${selectedCourse.academic_hours} академических часов`;
  $("#detail-description").textContent = selectedCourse.description;

  show("course");
}

function show(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });

  $(`#${screenId}`).classList.add("active");
  $("#choose").classList.toggle("hidden", screenId !== "course");
  window.scrollTo(0, 0);
}

function toast(text) {
  const element = $("#toast");
  element.textContent = text;
  element.classList.add("show");
  setTimeout(() => element.classList.remove("show"), 3000);
}

function sendCourseToBot() {
  if (!selectedCourse) {
    toast("Сначала выберите вариант обучения.");
    return;
  }

  if (!tg) {
    toast("Telegram WebApp API не загрузился. Откройте приложение из Telegram-бота.");
    return;
  }

  const button = $("#choose");
  button.disabled = true;
  button.textContent = "Отправляем...";

  try {
    tg.HapticFeedback?.impactOccurred("medium");
    tg.sendData(JSON.stringify({
      action: "course_selected",
      course: selectedCourse
    }));
  } catch (error) {
    console.error("Ошибка отправки курса:", error);
    toast("Не удалось передать данные боту.");
    button.disabled = false;
    button.textContent = "Выбрать курс";
  }
}
