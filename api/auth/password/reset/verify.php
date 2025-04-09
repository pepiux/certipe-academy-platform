
<?php
require_once '../../../config/database.php';
require_once '../../../config/cors.php';

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

if (!$email || !$code) {
    http_response_code(400);
    echo json_encode(['error' => 'Email y código son requeridos']);
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

// Código válido
http_response_code(200);
echo json_encode(['valid' => true]);

$conn->close();
?>
