<?php
	$server = "localhost";
	$username = "root";
	$password = "";
	$database = "registro_database";

	try {
		$conn= new PDO("mysql:host=$server; dbname=$database;", $username, $password);

	} catch (Exception $e) {
		die("Conexion Fallida: " . $e->getMessage());
	}
?>