
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

if (!$email) {
    http_response_code(400);
    echo json_encode(['error' => 'Email es requerido']);
    exit();
}

// Conectar a la base de datos
$conn = getConnection();

// Verificar si el email existe
$stmt = $conn->prepare("SELECT id FROM profiles WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(404);
    echo json_encode(['error' => 'Email no encontrado']);
    exit();
}

// Generar código de recuperación
$resetCode = generateResetCode();
$expiryTime = date('Y-m-d H:i:s', strtotime('+30 minutes'));

// Guardar código en la base de datos
$stmt = $conn->prepare("INSERT INTO password_resets (email, code, expires_at) VALUES (?, ?, ?) 
                       ON DUPLICATE KEY UPDATE code = VALUES(code), expires_at = VALUES(expires_at)");
$stmt->bind_param("sss", $email, $resetCode, $expiryTime);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al generar código de recuperación']);
    exit();
}

// Aquí deberías enviar el email con el código de recuperación
// Para este ejemplo, simplemente devolvemos éxito

http_response_code(200);
echo json_encode([
    'message' => 'Código de recuperación enviado',
    // En un entorno de desarrollo, podemos mostrar el código para probar
    'debugCode' => $resetCode
]);

$conn->close();
?>
