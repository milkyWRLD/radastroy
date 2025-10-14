<?php

$name=$_POST["name"];
$phone=$_POST["phone"];

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

function sendMail($fname, $fphone) {
	$to = "vash-montag24@mail.ru";
	$subject = "Заявка с сайта РадаСтрой\n";
	$message = "Поступила заявка с сайта РадаСтрой\n";
	$message .= "Имя: $fname\n";
	$message .= "Телефон: $fphone\n";
	$message .= "Письмо сгенерированно автоматический\n";
	$header = "Content-type: text/plain; charset=\"utf-8\"";

	mail ($to,$subject,$message,$header) or print "Не могу отправить письмо !!!";
}

sendMail($name, $phone); //Отправляем на почту

exit;

?>