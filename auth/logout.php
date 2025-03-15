<?php
// logout.php

session_start();
session_unset();
session_destroy();

header("Location: ../public/index.html?status=success&message=" . urlencode("Logout realizado com sucesso."));
exit();
?>