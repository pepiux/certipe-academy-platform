
<?php
// Incluir archivo de configuración
require_once 'config.php';

// Verificar si es una solicitud POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['error' => 'Método no permitido'], 405);
}

// Obtener token de autenticación
$headers = getallheaders();

if (!isset($headers['Authorization'])) {
    json_response(['error' => 'No autorizado'], 401);
}

$auth_header = $headers['Authorization'];
if (strpos($auth_header, 'Bearer ') !== 0) {
    json_response(['error' => 'Formato de token inválido'], 401);
}

$token = substr($auth_header, 7);

// Conectar a la base de datos
$conn = connect_db();

// Eliminar token
$stmt = $conn->prepare("DELETE FROM user_tokens WHERE token = ?");
$stmt->bind_param("s", $token);
$stmt->execute();

// Cerrar la conexión
$stmt->close();
$conn->close();

// Enviar respuesta
json_response(['message' => 'Sesión cerrada correctamente']);
?>
