
<?php
// Configuración de CORS para permitir peticiones desde tu frontend
header("Access-Control-Allow-Origin: *"); // Cambia * por tu dominio en producción
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Para manejar la petición OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>
