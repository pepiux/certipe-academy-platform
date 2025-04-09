
<?php
// Configuración de la base de datos
define('DB_HOST', 'localhost'); // Cambia esto según tu hosting
define('DB_USER', 'tu_usuario'); // Cambia esto según tu hosting
define('DB_PASS', 'tu_password'); // Cambia esto según tu hosting
define('DB_NAME', 'tu_base_de_datos'); // Cambia esto según tu hosting

// Función para conectar a la base de datos
function getConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    if ($conn->connect_error) {
        die("Error de conexión: " . $conn->connect_error);
    }
    
    $conn->set_charset("utf8");
    return $conn;
}

// Función para escapar strings (prevenir SQL injection)
function sanitize($conn, $string) {
    return $conn->real_escape_string($string);
}
?>
