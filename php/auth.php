
<?php
// Incluir archivo de configuración
require_once 'config.php';

// Verificar si es una solicitud POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['error' => 'Método no permitido'], 405);
}

// Obtener datos enviados
$data = json_decode(file_get_contents('php://input'), true);

// Validar datos requeridos
if (!isset($data['email']) || !isset($data['password'])) {
    json_response(['error' => 'Email y contraseña son requeridos'], 400);
}

$email = $data['email'];
$password = $data['password'];

// Conectar a la base de datos
$conn = connect_db();

// Consultar usuario
$stmt = $conn->prepare("SELECT id, name, email, password, role FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

// Verificar si existe el usuario
if ($result->num_rows === 0) {
    $conn->close();
    json_response(['error' => 'Credenciales inválidas'], 401);
}

// Obtener datos del usuario
$user = $result->fetch_assoc();

// Verificar contraseña
if (!password_verify($password, $user['password'])) {
    $conn->close();
    json_response(['error' => 'Credenciales inválidas'], 401);
}

// Generar token de autenticación
$token = bin2hex(random_bytes(32));
$expires_at = date('Y-m-d H:i:s', strtotime('+30 days'));

// Guardar token en la base de datos
$stmt = $conn->prepare("INSERT INTO user_tokens (user_id, token, expires_at) VALUES (?, ?, ?)");
$stmt->bind_param("iss", $user['id'], $token, $expires_at);
$stmt->execute();

// Cerrar la conexión
$stmt->close();
$conn->close();

// Preparar respuesta
$response = [
    'user' => [
        'id' => $user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'role' => $user['role']
    ],
    'token' => $token
];

// Enviar respuesta
json_response($response);
?>
