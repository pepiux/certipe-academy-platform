
<?php
require_once '../../config/database.php';
require_once '../../config/cors.php';
require_once '../../utils/password.php';

// Solo aceptar peticiones POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit();
}

// Obtener datos de la petición
$data = json_decode(file_get_contents('php://input'), true);
$id = isset($data['id']) ? $data['id'] : '';
$currentPassword = isset($data['currentPassword']) ? $data['currentPassword'] : '';
$newPassword = isset($data['newPassword']) ? $data['newPassword'] : '';

if (!$id || !$currentPassword || !$newPassword) {
    http_response_code(400);
    echo json_encode(['error' => 'Todos los campos son requeridos']);
    exit();
}

// Validar nueva contraseña
if (strlen($newPassword) < 8) {
    http_response_code(400);
    echo json_encode(['error' => 'La nueva contraseña debe tener al menos 8 caracteres']);
    exit();
}

// Conectar a la base de datos
$conn = getConnection();

// Obtener contraseña actual del usuario
$stmt = $conn->prepare("SELECT password FROM profiles WHERE id = ?");
$stmt->bind_param("s", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(404);
    echo json_encode(['error' => 'Usuario no encontrado']);
    exit();
}

$user = $result->fetch_assoc();

// Verificar contraseña actual
if (!verifyPassword($currentPassword, $user['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'La contraseña actual es incorrecta']);
    exit();
}

// Hash de la nueva contraseña
$hashedPassword = hashPassword($newPassword);

// Actualizar contraseña
$stmt = $conn->prepare("UPDATE profiles SET password = ?, updated_at = NOW() WHERE id = ?");
$stmt->bind_param("ss", $hashedPassword, $id);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al actualizar la contraseña']);
    exit();
}

http_response_code(200);
echo json_encode(['message' => 'Contraseña actualizada correctamente']);

$conn->close();
?>
