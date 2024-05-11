<?php
	header("Content-Type: application/json; charset=utf-8");
	include("include/db.php");
	echo json_encode(sqaf("SELECT * FROM `calculator_prices`"), JSON_PRETTY_PRINT);
?>