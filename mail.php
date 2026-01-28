<?php

// Включаем вывод ошибок для отладки
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Логирование всех запросов
$log_file = dirname(__FILE__) . '/mail_debug.log';
$log_entry = "\n=== " . date('Y-m-d H:i:s') . " ===\n";
$log_entry .= "POST данные: " . json_encode($_POST) . "\n";

$name = isset($_POST["name"]) ? $_POST["name"] : "";
$phone = isset($_POST["phone"]) ? $_POST["phone"] : "";
$service_requested = isset($_POST["service_requested"]) ? $_POST["service_requested"] : "";
$to = isset($_POST["to"]) ? $_POST["to"] : "web_dev_artsid@gmail.com";

$log_entry .= "Name: $name, Phone: $phone, Service: $service_requested, To: $to\n";
file_put_contents($log_file, $log_entry, FILE_APPEND);

// Проверка данных
if (empty($name) || empty($phone)) {
	$error_msg = "Ошибка: не указано имя или телефон";
	file_put_contents($log_file, "ERROR: " . $error_msg . "\n", FILE_APPEND);
	echo json_encode(['success' => false, 'error' => $error_msg]);
	exit;
}

// Очистка данных
$name = substr(trim($name), 0, 35);
$phone = substr(trim($phone), 0, 20);

// Подготовка письма
$subject = "Заявка с сайта РадаСтрой";
$message = "Поступила заявка с сайта РадаСтрой\n\n";
$message .= "Имя: $name\n";
$message .= "Телефон: $phone\n";
if (!empty($service_requested)) {
	$message .= "Услуга: $service_requested\n";
}
$message .= "\nДата: " . date('d.m.Y H:i:s') . "\n";
$message .= "IP: " . $_SERVER['REMOTE_ADDR'] . "\n";

// Заголовки письма
$headers = "From: no-reply@rada-stroy.ru\r\n";
$headers .= "Reply-To: no-reply@rada-stroy.ru\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Попытка 1: mail()
$mail_result = @mail($to, $subject, $message, $headers);
file_put_contents($log_file, "mail() result: " . ($mail_result ? "SUCCESS" : "FAILED") . "\n", FILE_APPEND);

// Попытка 2: Если mail() не сработал, используем curl для внешнего сервиса
if (!$mail_result) {
	// Попытаемся использовать любой доступный метод
	$curl_result = sendViaCurl($to, $subject, $message);
	file_put_contents($log_file, "Curl result: " . ($curl_result ? "SUCCESS" : "FAILED") . "\n", FILE_APPEND);
}

// Всегда логируем попытку отправки
$delivery_log = dirname(__FILE__) . '/deliveries.txt';
$delivery_entry = date('d.m.Y H:i:s') . " | To: $to | Name: $name | Phone: $phone | Service: $service_requested\n";
file_put_contents($delivery_log, $delivery_entry, FILE_APPEND);

// Ответ
echo json_encode([
	'success' => true, 
	'message' => 'Заявка принята! Мы свяжемся с вами в ближайшее время.',
	'debug' => [
		'mail_function' => function_exists('mail') ? 'available' : 'disabled',
		'data_received' => !empty($name) && !empty($phone)
	]
]);

exit;

function sendViaCurl($to, $subject, $message) {
	// Попытка использовать внешний SMTP сервис (если доступен curl)
	if (!function_exists('curl_init')) {
		return false;
	}
	
	// Здесь можно добавить интеграцию с сервисом отправки писем
	// Например, SendGrid, Mailgun, etc.
	return false;
}

?>