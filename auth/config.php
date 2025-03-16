<?php
// config.php

function getDatabaseConnection() {
    $host = getenv('DB_HOST');
    $dbname = getenv('DB_NAME');
    $username = getenv('DB_USER');
    $password = getenv('DB_PASSWORD');

    return new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
}

// A chave da API para autenticação foi definida no no .env
putenv("JWT_SECRET=" . getenv('JWT_SECRET'));
?>
