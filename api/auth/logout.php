
<?php
require_once '../config/database.php';
require_once '../config/cors.php';
require_once '../utils/session.php';

// Solo aceptar peticiones POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit();
}

// Obtener token de autorización
$headers = getallheaders();
$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';

if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    http_response_code(401);
    echo json_encode(['error' => 'Token no proporcionado']);
    exit();
}

$token = $matches[1];

// Conectar a la base de datos
$conn = getConnection();

// Eliminar sesión
if (deleteSession($token, $conn)) {
    http_response_code(200);
    echo json_encode(['message' => 'Sesión cerrada correctamente']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Error al cerrar sesión']);
}

$conn->close();
?>
