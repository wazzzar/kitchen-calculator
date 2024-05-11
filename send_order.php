<?php
	ob_start();
	header("Content-type: text/plain; charset=utf-8");
	
	$n = !empty($_POST["usr_name"] ) ? $_POST["usr_name"]  : "Дмитрий";
	$t = !empty($_POST["usr_tel"]  ) ? $_POST["usr_tel"]   : "+7 953 543 0277";
	$e = !empty($_POST["usr_email"]) ? $_POST["usr_email"] : "isakov.dmitriy@list.ru";
	$d = $_POST["kitchen_desc"];
	
	include("include/smtp-func2.php");

	$to = "newformat@bk.ru";
	$tm = "Оформление заказа (конструктор)";
	$ms = "<b>Имя клиента:</b> $n\n<b>Телефон:</b> $t\n<b>E-mail:</b> $e\n\n<b>Параметры кухни:</b>\n$d";

	if(!true) echo "debug";
	if(!true) $to = "isakov.dmitriy@list.ru";
	if( smtpmail($to, $tm, nl2br($ms) ) ) echo "1"; else echo "0";

	ob_flush();
?>