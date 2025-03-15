<?php
// login.php

session_start();

// Se já estiver logado, redireciona para o painel
if (isset($_SESSION['user_id'])) {
    header("Location: painel.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <style>
        .alert {
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 5px;
        }

        .alert-danger {
            background-color: #f8d7da;
            color: #721c24;
        }

        .form-group {
            margin-bottom: 15px;
        }

        .form-control {
            width: 100%;
            padding: 8px;
        }
    </style>
</head>

<body>
    <div class="modal__overlay" id="login">
        <div class="modal__content">
            <form action="verificaLogin.php" method="post" id="loginForm">
                <div class="modal__header">
                    <h2>Faça Login</h2>
                    <p class="paragrafo">Informe suas credenciais abaixo</p>
                </div>
                <div class="modal__body">
                    <?php
                    if (isset($_GET['error'])) {
                        echo '<div class="alert alert-danger"><p>' . htmlspecialchars($_GET['error']) . '</p></div>';
                    }
                    if (isset($_GET['success'])) {
                        echo '<div class="alert alert-success"><p>' . htmlspecialchars($_GET['success']) . '</p></div>';
                    }
                    ?>
                    <div class="form-group">
                        <label for="username">Usuário</label>
                        <input type="text" id="username" name="username" class="form-control" placeholder="Usuário"
                            required>
                    </div>
                    <div class="form-group">
                        <label for="password">Senha</label>
                        <input type="password" id="password" name="password" class="form-control" placeholder="Senha"
                            required>
                    </div>
                </div>
                <div class="modal__footer">
                    <button type="submit" class="btn btn-primary">Entrar</button>
                    <a href="index.html" class="btn btn-secondary">Cancelar</a>
                </div>
            </form>
        </div>
    </div>
</body>

</html>