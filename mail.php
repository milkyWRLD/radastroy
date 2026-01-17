<?php

$name=$_POST["name"];
$phone=$_POST["phone"];
$service_requested = isset($_POST["service_requested"]) ? $_POST["service_requested"] : "";
$to = isset($_POST["to"]) ? $_POST["to"] : "K1Aleks@yandex.ru"; // Используем email из формы или по умолчанию

if (isset ($name))
{
$name = substr($name,0,35); //Не может быть более 35 символов
if (empty($name))
{
echo "<center><b>Не указано имя !!!<p>";
echo "<a href=index.html>Вернуться и правильно заполнить форму.</a>";
exit;
}
}
else
{
$name = "не указано";
}
if (isset ($phone))
{
$phone = substr($phone,0,20); //Не может быть более 20 символов
if (empty($phone))
{
echo "<center><b>Не указан телефон !!!<p>";
echo "<a href=index.html>Вернуться и правильно заполнить форму.</a>";
exit;
}
}
else
{
$phone = "не указано";
}

$i = "не указано";
if ($name == $i AND $phone == $i)
{
echo "Ошибка ! Скрипту не были переданы параметры !";
exit;
}

function sendMail($fname, $fphone, $recipient, $service = "") {
	$subject = "Заявка с сайта РадаСтрой";
	$message = "Поступила заявка с сайта РадаСтрой\n\n";
	$message .= "Имя: $fname\n";
	$message .= "Телефон: $fphone\n";
	if (!empty($service)) {
		$message .= "Услуга: $service\n";
	}
	$message .= "\nПисьмо сгенерировано автоматически\n";
	$header = "Content-type: text/plain; charset=\"utf-8\"\r\n";
	$header .= "From: no-reply@site.ru\r\n";

	mail($recipient, $subject, $message, $header) or print "Не могу отправить письмо !!!";
}

sendMail($name, $phone, $to, $service_requested); //Отправляем на почту

exit;

?>