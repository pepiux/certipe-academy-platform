
<?php
require_once '../../../config/database.php';
require_once '../../../config/cors.php';
require_once '../../../utils/password.php';

// Solo aceptar peticiones POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit();
}

// Obtener datos de la petición
$data = json_decode(file_get_contents('php://input'), true);
$email = isset($data['email']) ? $data['email'] : '';
$code = isset($data['code']) ? $data['code'] : '';
$newPassword = isset($data['newPassword']) ? $data['newPassword'] : '';

if (!$email || !$code || !$newPassword) {
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

// Verificar el código de recuperación
$stmt = $conn->prepare("SELECT * FROM password_resets WHERE email = ? AND code = ? AND expires_at > NOW()");
$stmt->bind_param("ss", $email, $code);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Código inválido o expirado']);
    exit();
}

// Hash de la nueva contraseña
$hashedPassword = hashPassword($newPassword);

// Actualizar contraseña del usuario
$stmt = $conn->prepare("UPDATE profiles SET password = ?, updated_at = NOW() WHERE email = ?");
$stmt->bind_param("ss", $hashedPassword, $email);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al actualizar la contraseña']);
    exit();
}

// Eliminar código de recuperación
$stmt = $conn->prepare("DELETE FROM password_resets WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();

http_response_code(200);
echo json_encode(['message' => 'Contraseña actualizada correctamente']);

$conn->close();
?>
