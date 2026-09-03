// Перед публикацией замените значение на username своего Telegram-бота без символа @.
const BOT_USERNAME = 'YOUR_BOT_USERNAME';

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

const tg = window.Telegram && window.Telegram.WebApp;
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
  $('#install').classList.toggle('hidden', screenId !== 'catalog');
  window.scrollTo(0, 0);
}

function toast(text) {
  const element = $('#toast');
  element.textContent = text;
  element.classList.add('show');
  setTimeout(() => element.classList.remove('show'), 2600);
}

$('#open-category').addEventListener('click', () => show('catalog'));

document.querySelectorAll('[data-back]').forEach((button) => {
  button.addEventListener('click', () => show(button.dataset.back));
});

$('#search').addEventListener('input', (event) => {
  const value = event.target.value.trim().toLowerCase();
  if (value && !'бизнес старт бизнеса с нуля'.includes(value)) {
    toast('В демо доступен один курс из категории «Бизнес».');
  }
});

$('#install').addEventListener('click', () => {
  toast('Укажите username вашего бота в константе BOT_USERNAME в файле app.js.');
});

$('#choose').addEventListener('click', async () => {
  const payload = JSON.stringify(course);

  if (tg) {
    // Бот получает JSON в message.web_app_data.data, если Web App открыт через KeyboardButton.
    try {
      tg.sendData(payload);
    } catch (error) {
      console.warn('Не удалось передать данные через Telegram WebApp:', error);
    }

    if (BOT_USERNAME !== 'YOUR_BOT_USERNAME') {
      tg.openTelegramLink(`https://t.me/${BOT_USERNAME}?start=course_start_business`);
    } else {
      toast('Курс выбран. Укажите BOT_USERNAME, чтобы открыть чат с ботом.');
    }
    return;
  }

  try {
    await navigator.clipboard.writeText(payload);
    toast('Демо-режим: данные курса скопированы. Откройте страницу внутри Telegram.');
  } catch {
    toast('Откройте приложение внутри Telegram для передачи данных боту.');
  }
});