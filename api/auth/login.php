
<?php
require_once '../config/database.php';
require_once '../config/cors.php';
require_once '../utils/password.php';
require_once '../utils/session.php';

// Solo aceptar peticiones POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Método no permitido']);
    exit();
}

// Obtener datos de la petición
$data = json_decode(file_get_contents('php://input'), true);
$email = isset($data['email']) ? $data['email'] : '';
$password = isset($data['password']) ? $data['password'] : '';

if (!$email || !$password) {
    http_response_code(400);
    echo json_encode(['error' => 'Email y contraseña son requeridos']);
    exit();
}

// Conectar a la base de datos
$conn = getConnection();

// Buscar usuario por email
$stmt = $conn->prepare("SELECT id, email, password, first_name, last_name, is_admin, avatar_url, created_at, updated_at FROM profiles WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(401);
    echo json_encode(['error' => 'Credenciales inválidas']);
    exit();
}

$user = $result->fetch_assoc();

// Verificar contraseña
if (!verifyPassword($password, $user['password'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Credenciales inválidas']);
    exit();
}

// Crear sesión para el usuario
$token = createSession($user['id'], $conn);

if (!$token) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al crear la sesión']);
    exit();
}

// Eliminar contraseña del objeto usuario
unset($user['password']);

// Devolver datos del usuario y token
http_response_code(200);
echo json_encode([
    'user' => $user,
    'token' => $token
]);

$conn->close();
?>
