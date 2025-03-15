<?php
// auth/verificaLogin.php

session_start();
require('config.php');

if (isset($_SESSION['user_id'])) {
    header("Location: ../auth/painel.php?status=success&message=" . urlencode("Bem-vindo de volta!"));
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email']);
    $password = $_POST['password'];

    try {
        $conn = getDatabaseConnection();

        $stmt = $conn->prepare("SELECT id, username, email, password FROM users WHERE email = :email");
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['email'] = $user['email'];
            header("Location: ../auth/painel.php?status=success&message=" . urlencode("Login realizado com sucesso!"));
            exit();
        } else {
            header("Location: ../public/index.html?status=error&message=" . urlencode("Usuário ou senha incorretos."));
            exit();
        }
    } catch (PDOException $e) {
        header("Location: ../public/index.html?status=error&message=" . urlencode("Erro no banco de dados: " . $e->getMessage()));
        exit();
    }
} else {
    header("Location: ../public/index.html");
    exit();
}
?>