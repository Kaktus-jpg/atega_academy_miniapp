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
  $('#choose').classList.toggle('hidden', screenId !== 'catalog');
  window.scrollTo(0, 0);
}

function toast(text) {
  const element = $('#toast');
  element.textContent = text;
  element.classList.add('show');
  setTimeout(() => element.classList.remove('show'), 2800);
}

$('#open-category').addEventListener('click', () => show('catalog'));

document.querySelectorAll('[data-back]').forEach((button) => {
  button.addEventListener('click', () => show(button.dataset.back));
});

$('#search').addEventListener('input', (event) => {
  const value = event.target.value.trim().toLowerCase();

  if (value && !'бизнес старт бизнеса с нуля'.includes(value)) {
    toast('В каталоге пока доступен один курс: «Старт бизнеса с нуля».');
  }
});

$('#choose').addEventListener('click', () => {
  if (!tg) {
    toast('Откройте Mini App из кнопки в Telegram-боте, чтобы выбрать курс.');
    return;
  }

  // sendData доступен для Mini App, открытого reply-кнопкой KeyboardButton с web_app.
  // Telegram отправит строку в message.web_app_data.data и автоматически закроет приложение.
  tg.sendData(JSON.stringify(course));
});
