RadaStroy 

Цель: удобная демонстрация работы формы и отправки писем через Vercel serverless функции.

Поддерживаемые провайдеры (в `api/mail.js`):
- RESEND_API_KEY — отправка через Resend API (рекомендуемый для демо)
- MAILGUN_API_KEY + MAILGUN_DOMAIN — отправка через Mailgun

Доп. переменные:
- MAIL_FROM — (опционально) адрес отправителя, например `no-reply@rada-stroy.com`
- MAIL_TO — (опционально) куда отправлять заявки, например `web_dev_artsid@gmail.com`

Развёртывание на Vercel
1. Закоммитьте репозиторий на GitHub.
2. На Vercel создайте проект из этого репозитория.
3. В Settings → Environment Variables добавьте (пример):
   - `RESEND_API_KEY` = (ваш ключ)  — рекомендую для демонстрации
   - `MAIL_FROM` = no-reply@rada-stroy.com
   - `MAIL_TO` = web_dev_artsid@gmail.com

4. Нажмите Deploy.

Тестирование локально (если хотите пробовать без Vercel):
- Для быстрого теста можно запустить статический сервер, но API-функции требуют Node/Vercel environment.

Тест через curl (после деплоя на Vercel):

```bash
curl -s -X POST https://<your-deploy-url>/api/mail \
  -H "Content-Type: application/json" \
  -d '{"name":"Тестовый", "phone":"+79001234567", "service_requested":"Бурение" }'
```

Что делать, если письма не приходят:
- Убедитесь, что добавлен `RESEND_API_KEY` или `MAILGUN_API_KEY` и `MAILGUN_DOMAIN`.
- Для продакшна настройте SPF/DKIM/DMARC на своём домене (если используете Mailgun/SES/Postmark).
- Для демонстрации Resend обычно достаточно API-ключа.

Примечание: если вы не хотите настраивать API ключи сейчас, функция вернёт `debug` ответ и залогирует заявку в Cloud logs Vercel.
 
Локальный тест с `test-send.js`:

1. Скопируйте `.env.example` в `.env` и заполните переменные (или экспортируйте их в окружение).
2. Установите Vercel CLI и запустите локально:

```bash
npm i -g vercel
export RESEND_API_KEY="your_key_here"    # или в PowerShell: $env:RESEND_API_KEY='your_key'
export MAIL_FROM='no-reply@your-domain.com'
export MAIL_TO='web_dev_artsid@gmail.com'
npx vercel dev
```

3. В другом терминале запустите тест:

```bash
node test-send.js
```

4. Результат запроса выведется в консоли; при успешной отправке вы получите JSON { success: true }.

Примечание про безопасность:
- Не храните API-ключи в публичном репозитории. Используйте переменные окружения на Vercel/GitHub Secrets.
- Если вы опубликовали ключ в чате (как вы делали ранее), немедленно удалите/ротацируйте ключ в панели Resend.

Если хотите — я могу запустить тестовую отправку сразу после того, как вы подтвердите, что ключ добавлен на Vercel (я могу инициировать запрос к `https://<your-vercel-url>/api/mail`, но для этого вам нужно прислать URL деплоя). 
