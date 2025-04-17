
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
if (!isset($data['name']) || !isset($data['email']) || !isset($data['password'])) {
    json_response(['error' => 'Nombre, email y contraseña son requeridos'], 400);
}

$name = $data['name'];
$email = $data['email'];
$password = $data['password'];

// Validar email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(['error' => 'Email inválido'], 400);
}

// Validar longitud de contraseña
if (strlen($password) < 6) {
    json_response(['error' => 'La contraseña debe tener al menos 6 caracteres'], 400);
}

// Conectar a la base de datos
$conn = connect_db();

// Verificar si el email ya existe
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $conn->close();
    json_response(['error' => 'El email ya está registrado'], 409);
}

// Hash de la contraseña
$password_hash = password_hash($password, PASSWORD_DEFAULT);

// Insertar nuevo usuario
$stmt = $conn->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')");
$stmt->bind_param("sss", $name, $email, $password_hash);
$stmt->execute();

// Obtener ID del nuevo usuario
$user_id = $conn->insert_id;

// Generar token de autenticación
$token = bin2hex(random_bytes(32));
$expires_at = date('Y-m-d H:i:s', strtotime('+30 days'));

// Guardar token en la base de datos
$stmt = $conn->prepare("INSERT INTO user_tokens (user_id, token, expires_at) VALUES (?, ?, ?)");
$stmt->bind_param("iss", $user_id, $token, $expires_at);
$stmt->execute();

// Cerrar la conexión
$stmt->close();
$conn->close();

// Preparar respuesta
$response = [
    'user' => [
        'id' => $user_id,
        'name' => $name,
        'email' => $email,
        'role' => 'user'
    ],
    'token' => $token
];

// Enviar respuesta
json_response($response);
?>
