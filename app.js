const course = {
  action: "course_selected",
  category: "Бизнес",
  title: "Старт бизнеса с нуля",
  price_rub: 15000,
  start_date: "2026-09-15",
  duration_months: 2,
  type: "Курс",
  level: "Для новичков",
  full_price_rub: 15000,
  installment_months: 2,
  monthly_payment_rub: 7500,
  description:
    "Практический курс для тех, кто хочет превратить идею в работающий бизнес. " +
    "Вы определите целевую аудиторию, соберёте простую финансовую модель, " +
    "разберётесь с продвижением и подготовите понятный план запуска своего первого проекта."
};

const $ = (selector) => document.querySelector(selector);

let tg = null;

window.addEventListener("DOMContentLoaded", () => {
  if (window.Telegram && window.Telegram.WebApp) {
    tg = window.Telegram.WebApp;

    tg.ready();
    tg.expand();
  }

  initApp();
});

function initApp() {
  $("#open-directions").addEventListener("click", () => {
    show("directions");
  });

  $("#open-courses").addEventListener("click", () => {
    show("courses");
  });

  $("#open-course").addEventListener("click", () => {
    show("course");
  });

  document.querySelectorAll("[data-back]").forEach((button) => {
    button.addEventListener("click", () => {
      show(button.dataset.back);
    });
  });

  $("#choose").addEventListener("click", sendCourseToBot);
}

function show(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });

  $(`#${screenId}`).classList.add("active");

  $("#choose").classList.toggle(
    "hidden",
    screenId !== "course"
  );

  window.scrollTo(0, 0);
}

function toast(text) {
  const element = $("#toast");

  element.textContent = text;
  element.classList.add("show");

  setTimeout(() => {
    element.classList.remove("show");
  }, 3000);
}

function sendCourseToBot() {
  if (!tg) {
    toast(
      "Telegram WebApp API не загрузился. " +
      "Откройте приложение именно кнопкой из бота."
    );
    return;
  }

  const button = $("#choose");

  button.disabled = true;
  button.textContent = "Отправляем...";

  try {
    tg.HapticFeedback?.impactOccurred("medium");

    tg.sendData(JSON.stringify(course));

    // После sendData Telegram должен автоматически
    // закрыть Mini App и вернуть пользователя в чат.
  } catch (error) {
    console.error("Ошибка отправки данных:", error);

    toast("Не удалось передать курс боту.");

    button.disabled = false;
    button.textContent = "Выбрать курс";
  }
}
