
<?php
require_once '../config/database.php';
require_once '../config/cors.php';
require_once '../utils/password.php';

// Solo aceptar peticiones POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit();
}

// Obtener datos de la petición
$data = json_decode(file_get_contents('php://input'), true);
$email = isset($data['email']) ? $data['email'] : '';
$password = isset($data['password']) ? $data['password'] : '';
$firstName = isset($data['firstName']) ? $data['firstName'] : '';
$lastName = isset($data['lastName']) ? $data['lastName'] : '';

if (!$email || !$password || !$firstName || !$lastName) {
    http_response_code(400);
    echo json_encode(['error' => 'Todos los campos son requeridos']);
    exit();
}

// Validar email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Email inválido']);
    exit();
}

// Conectar a la base de datos
$conn = getConnection();

// Verificar si el email ya existe
$stmt = $conn->prepare("SELECT id FROM profiles WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    http_response_code(400);
    echo json_encode(['error' => 'El email ya está registrado']);
    exit();
}

// Hash de la contraseña
$hashedPassword = hashPassword($password);

// Generar UUID para el usuario
$userId = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
    mt_rand(0, 0xffff), mt_rand(0, 0xffff),
    mt_rand(0, 0xffff),
    mt_rand(0, 0x0fff) | 0x4000,
    mt_rand(0, 0x3fff) | 0x8000,
    mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
);

// Crear nuevo usuario
$stmt = $conn->prepare("INSERT INTO profiles (id, email, password, first_name, last_name, is_admin, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 0, NOW(), NOW())");
$stmt->bind_param("sssss", $userId, $email, $hashedPassword, $firstName, $lastName);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al registrar el usuario: ' . $conn->error]);
    exit();
}

// Obtener datos del usuario creado
$stmt = $conn->prepare("SELECT id, email, first_name, last_name, is_admin, avatar_url, created_at, updated_at FROM profiles WHERE id = ?");
$stmt->bind_param("s", $userId);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

// Devolver datos del usuario
http_response_code(201);
echo json_encode([
    'user' => $user
]);

$conn->close();
?>
