<?php

function sql_conne(){
	$host = "localhost";
	$user = "mgformat";
	$pass = "79Ji6QgHSG60";
	$db_name = "mgformat_mgformat";

    $GLOBALS["db"] = new PDO("mysql:host=$host;dbname=$db_name", $user, $pass);
    $GLOBALS["db"]->exec("SET NAMES utf8");
    $GLOBALS["db"]->exec("SET CHARACTER SET utf8");
}

function sql_query($sql){
	return $GLOBALS["db"]->query($sql);
}

function sql_fetch($res){
	return $res->fetchAll(PDO::FETCH_ASSOC);
}

function sql_query_and_fetch($sql){
	return sql_fetch(sql_query($sql));
}

function sqaf($sql){
	return sql_fetch(sql_query($sql));
}
