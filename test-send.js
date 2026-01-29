// test-send.js — простая проверка /api/mail
// Запуск: NODE_OPTIONS=--experimental-fetch node test-send.js
// Или с Node 18+: node test-send.js

const url = process.env.DEPLOY_URL || process.env.LOCAL_API_URL || 'http://localhost:3000/api/mail';

const payload = {
  name: process.env.TEST_NAME || 'Тестовый пользователь',
  phone: process.env.TEST_PHONE || '+79001234567',
  service_requested: process.env.TEST_SERVICE || 'Демо'
};

console.log('Sending test request to', url);

(async () => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const text = await res.text();
    console.log('Status:', res.status);
    try { console.log('Response JSON:', JSON.parse(text)); }
    catch(e) { console.log('Response text:', text); }
  } catch (err) {
    console.error('Request error:', err);
  }
})();
