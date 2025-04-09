
<?php
// Funciones para manejar contraseñas

// Crear hash de contraseña
function hashPassword($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}

// Verificar contraseña
function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

// Generar código de recuperación (6 dígitos)
function generateResetCode() {
    return str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
}
?>
