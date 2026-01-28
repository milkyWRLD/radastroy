// Vercel Serverless Function для отправки писем через Mailgun
// Установка: npm install mailgun.js

const formData = require('form-data');
const Mailgun = require('mailgun.js');

export default async function handler(req, res) {
  // Разрешаем CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, service_requested } = req.body;

  // Проверка данных
  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }

  try {
    // Способ 1: Отправка через Mailgun API (нужна переменная окружения)
    if (process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN) {
      return await sendViaMailgun(name, phone, service_requested, res);
    }

    // Способ 2: Отправка через Resend API (новый способ)
    if (process.env.RESEND_API_KEY) {
      return await sendViaResend(name, phone, service_requested, res);
    }

    // Способ 3: Сохранение в файл для отладки (если нет API ключей)
    return await saveToFile(name, phone, service_requested, res);

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
}

// Отправка через Mailgun
async function sendViaMailgun(name, phone, service, res) {
  const mailgun = new Mailgun(formData);
  const client = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });
  
  const messageData = {
    from: 'noreply@rada-stroy.com',
    to: 'web_dev_artsid@gmail.com',
    subject: 'Заявка с сайта РадаСтрой',
    text: `Новая заявка с сайта!\n\nИмя: ${name}\nТелефон: ${phone}\n${service ? `Услуга: ${service}` : ''}\nДата: ${new Date().toLocaleString('ru-RU')}`
  };

  try {
    const result = await client.messages.create(process.env.MAILGUN_DOMAIN, messageData);
    return res.status(200).json({ success: true, message: 'Заявка отправлена! Мы вскоре свяжемся с вами.' });
  } catch (error) {
    throw error;
  }
}

// Отправка через Resend
async function sendViaResend(name, phone, service, res) {
  const fetch = (await import('node-fetch')).default;
  
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from: 'onboarding@resend.dev',
      to: 'web_dev_artsid@gmail.com',
      subject: 'Заявка с сайта РадаСтрой',
      html: `
        <h2>Новая заявка с сайта РадаСтрой</h2>
        <p><strong>Имя:</strong> ${name}</p>
        <p><strong>Телефон:</strong> ${phone}</p>
        ${service ? `<p><strong>Услуга:</strong> ${service}</p>` : ''}
        <p><small>Дата: ${new Date().toLocaleString('ru-RU')}</small></p>
      `
    })
  });

  if (response.ok) {
    return res.status(200).json({ success: true, message: 'Заявка отправлена! Мы вскоре свяжемся с вами.' });
  } else {
    throw new Error('Failed to send via Resend');
  }
}

// Сохранение в файл (fallback для тестирования)
async function saveToFile(name, phone, service, res) {
  // На Vercel нельзя писать в файловую систему, поэтому просто логируем
  console.log(`Заявка: ${name}, ${phone}, ${service}, ${new Date().toISOString()}`);
  
  return res.status(200).json({ 
    success: true, 
    message: 'Заявка принята! Настройте API ключ для отправки писем.',
    debug: true
  });
}
