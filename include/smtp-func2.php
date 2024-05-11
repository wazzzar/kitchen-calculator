<?php
header("Content-type: text/html; charset=utf-8");
require_once("PHPMailer/class.phpmailer.php"); //путь до класса phpmailer
require_once("PHPMailer/class.smtp.php");

function smtpmail($to, $subject, $content, $attach=false){
	$mail = new PHPMailer(true);
	$mail->IsSMTP();
	
	try {
	  $mail->SMTPDebug = 0;
	  
	  $mail->Host = "localhost";
	  $mail->Port = 25;
	  
	  $mail->SMTPAuth = true;
	  $mail->Username = "webmaster@mgformat.ru";
	  $mail->Password = "AR7zTzpRY7AA";
	  
	  $mail->AddAddress($to); //кому письмо
	  $mail->Subject = htmlspecialchars($subject); // тема
	  $mail->MsgHTML($content); // тело письма
	  
	  // от кого (желательно указывать свой реальный e-mail на используемом SMTP сервере
	  $mail->SetFrom("webmaster@mgformat.ru", "Конструктор на сайте");
	  $mail->AddReplyTo( $GLOBALS["e"], $GLOBALS["n"] );
	  
	  if($attach)  $mail->AddAttachment($attach);
	  
	  $res = $mail->Send() ? 1 : 0;
	  return $res;
	} catch (phpmailerException $e) {
	  echo $e->errorMessage();
	} catch (Exception $e) {
	  echo $e->getMessage();
	}
}