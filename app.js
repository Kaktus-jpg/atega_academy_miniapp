const course = {
  action: 'course_selected',
  category: 'Бизнес',
  title: 'Старт бизнеса с нуля',
  price_rub: 15000,
  start_date: '2026-09-15',
  duration_months: 2,
  type: 'Курс',
  level: 'Для новичков',
  full_price_rub: 15000,
  installment_months: 2,
  monthly_payment_rub: 7500,
  description: 'Практический курс для тех, кто хочет превратить идею в работающий бизнес. Вы определите целевую аудиторию, соберёте простую финансовую модель, разберётесь с продвижением и подготовите понятный план запуска своего первого проекта.'
};

const tg = window.Telegram?.WebApp;
const $ = (selector) => document.querySelector(selector);

if (tg) {
  tg.ready();
  tg.expand();
}

function show(screenId) {
  document.querySelectorAll('.screen').forEach((screen) => {
    screen.classList.remove('active');
  });

  $(`#${screenId}`).classList.add('active');
  $('#choose').classList.toggle('hidden', screenId !== 'course');
  window.scrollTo(0, 0);
}

function toast(text) {
  const element = $('#toast');
  element.textContent = text;
  element.classList.add('show');
  setTimeout(() => element.classList.remove('show'), 2800);
}

$('#open-directions').addEventListener('click', () => show('directions'));
$('#open-courses').addEventListener('click', () => show('courses'));
$('#open-course').addEventListener('click', () => show('course'));

document.querySelectorAll('[data-back]').forEach((button) => {
  button.addEventListener('click', () => show(button.dataset.back));
});

$('#choose').addEventListener('click', () => {
  if (!tg) {
    toast('Откройте Mini App через кнопку в Telegram-боте.');
    return;
  }

  try {
    // ВАЖНО: sendData работает только для Web App, открытого из ReplyKeyboardMarkup / KeyboardButton.
    // Telegram сам закроет приложение и вернёт пользователя в чат с ботом.
    tg.sendData(JSON.stringify(course));
  } catch (error) {
    console.error(error);
    toast('Не удалось отправить заявку. Откройте приложение кнопкой клавиатуры бота.');
  }
});
