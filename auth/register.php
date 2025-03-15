<?php
// auth/register.php

require('config.php');
require('../vendor/autoload.php'); // Inclua o autoload do Composer

use \Firebase\JWT\JWT;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $contact = trim($_POST['contact']);
    $passwd = $_POST['passwd'];
    $repeatPasswd = $_POST['repeatPasswd'];

    $errors = [];

    if (strlen($username) < 8) {
        $errors[] = "O nome de usuário deve ter no mínimo 8 caracteres.";
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Informe um e-mail válido.";
    }

    if (!preg_match('/^[0-9]{11}$/', $contact)) {
        $errors[] = "Informe um número de WhatsApp válido (DDD + número, 11 dígitos).";
    }

    if (strlen($passwd) < 12) {
        $errors[] = "A senha deve ter no mínimo 12 caracteres.";
    }

    if ($passwd !== $repeatPasswd) {
        $errors[] = "As senhas não coincidem.";
    }

    if (empty($errors)) {
        try {
            $conn = getDatabaseConnection();

            // Verifica se o usuário ou e-mail já existe
            $stmt = $conn->prepare("SELECT COUNT(*) FROM users WHERE username = :username OR email = :email");
            $stmt->bindParam(':username', $username);
            $stmt->bindParam(':email', $email);
            $stmt->execute();

            if ($stmt->fetchColumn() > 0) {
                $errors[] = "Usuário ou e-mail já cadastrado.";
            } else {
                $hashedPasswd = password_hash($passwd, PASSWORD_DEFAULT);

                // Geração do token JWT
                $jwtSecret = getenv('JWT_SECRET') ?: 'sua_chave_secreta_aqui'; // Defina isso no config.php ou em um .env
                $payload = [
                    'userId' => null, // Será preenchido após o INSERT
                    'username' => $username,
                    'iat' => time(), // Issued at
                    'exp' => time() + 3600 // Expira em 1 hora
                ];

                // Insere o usuário no banco (sem o token ainda)
                $stmt = $conn->prepare("INSERT INTO users (username, email, contact, password, token) VALUES (:username, :email, :contact, :password, :token)");
                $stmt->bindParam(':username', $username);
                $stmt->bindParam(':email', $email);
                $stmt->bindParam(':contact', $contact);
                $stmt->bindParam(':password', $hashedPasswd);
                $stmt->bindValue(':token', ''); // Temporariamente vazio

                if ($stmt->execute()) {
                    // Obtém o ID do usuário recém-criado
                    $userId = $conn->lastInsertId();
                    $payload['userId'] = $userId;

                    // Gera o token com o ID do usuário
                    $token = JWT::encode($payload, $jwtSecret, 'HS256');

                    // Atualiza o campo token no banco
                    $stmt = $conn->prepare("UPDATE users SET token = :token WHERE id = :id");
                    $stmt->bindParam(':token', $token);
                    $stmt->bindParam(':id', $userId);
                    $stmt->execute();

                    // Redireciona com o token na URL ou retorna como resposta
                    header("Location: ../public/index.html?status=success&message=" . urlencode("Usuário cadastrado com sucesso! Seu token: $token"));
                    exit();
                } else {
                    $errors[] = "Erro ao cadastrar o usuário.";
                }
            }
        } catch (PDOException $e) {
            $errors[] = "Erro no banco de dados: " . $e->getMessage();
        }
    }

    if (!empty($errors)) {
        $errorMessage = urlencode(implode("|", $errors));
        header("Location: ../public/index.html?status=error&message=$errorMessage");
        exit();
    }
} else {
    header("Location: ../public/index.html");
    exit();
}
?>