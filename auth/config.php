<?php
// config.php

function getDatabaseConnection() {
    $host = 'localhost';
    $dbname = 'db_convertter_api';
    $username = 'root';
    $password = '';

    return new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
}

// Defina a chave secreta do JWT
putenv('JWT_SECRET=sua_chave_secreta_aqui');
?>