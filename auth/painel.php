<?php
// auth/painel.php

session_start();
require('config.php');

// Verifica se o usuário está logado
if (!isset($_SESSION['user_id'])) {
    header("Location: ../public/index.html?status=error&message=" . urlencode("Faça login para acessar o painel."));
    exit();
}

$userId = $_SESSION['user_id'];
$username = $_SESSION['username'];
?>

<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Conversor de imagens para JPG, PNG, WEBP e ICO">
    <meta name="keywords" content="conversor, imagem, jpg, png, webp, ico">
    <title>Conversor de Imagens</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/choices.js/public/assets/styles/choices.min.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css">
    <link rel="stylesheet" href="style.css">

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
        crossorigin="anonymous"></script>
    <script src="https://unpkg.com/boxicons@2.1.4/dist/boxicons.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/choices.min.js"></script>
</head>

<body>
    
    <div class="container">
        <h1>Bem-vindo ao Painel,
            <?php echo htmlspecialchars($username); ?>!
        </h1>
        <p>Este é o seu painel de controle. Seu ID é:
            <?php echo htmlspecialchars($userId); ?>.
        </p>
        <a href="logout.php" class="btn">Sair</a>
    </div>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>
    <script>
        toastr.options = {
            "closeButton": true,
            "progressBar": true,
            "positionClass": "toast-top-right",
            "timeOut": "5000"
        };

        function getUrlParams() {
            const params = new URLSearchParams(window.location.search);
            return {
                status: params.get('status'),
                message: params.get('message')
            };
        }

        window.onload = function () {
            const { status, message } = getUrlParams();
            if (status === 'success' && message) {
                toastr.success(decodeURIComponent(message), 'Sucesso!');
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        };
    </script>
</body>

</html>