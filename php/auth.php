
<?php
// Incluir archivo de configuración
require_once 'config.php';

// Verificar si es una solicitud POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['error' => 'Método no permitido'], 405);
}

// Obtener datos enviados
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Log para debug
error_log("Datos recibidos: " . print_r($data, true));

// Validar datos requeridos
if (!isset($data['email']) || !isset($data['password'])) {
    error_log("Email o contraseña no proporcionados");
    json_response(['error' => 'Email y contraseña son requeridos'], 400);
}

$email = $data['email'];
$password = $data['password'];

// Conectar a la base de datos
try {
    $conn = connect_db();
    error_log("Conexión a la base de datos exitosa");
} catch (Exception $e) {
    error_log("Error de conexión a la base de datos: " . $e->getMessage());
    json_response(['error' => 'Error de conexión a la base de datos'], 500);
}

// Consultar usuario
try {
    $stmt = $conn->prepare("SELECT id, name, email, password, role FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    // Verificar si existe el usuario
    if ($result->num_rows === 0) {
        error_log("Usuario no encontrado: $email");
        $conn->close();
        json_response(['error' => 'Credenciales inválidas'], 401);
    }
    
    // Obtener datos del usuario
    $user = $result->fetch_assoc();
    error_log("Usuario encontrado: " . print_r($user, true));
    
    // Verificar contraseña (usando password_verify para contraseñas hasheadas)
    if (password_verify($password, $user['password'])) {
        // Generar token de autenticación
        $token = bin2hex(random_bytes(32));
        $expires_at = date('Y-m-d H:i:s', strtotime('+30 days'));
        
        // Guardar token en la base de datos
        $stmt = $conn->prepare("INSERT INTO user_tokens (user_id, token, expires_at) VALUES (?, ?, ?)");
        $stmt->bind_param("iss", $user['id'], $token, $expires_at);
        $stmt->execute();
        
        // Preparar respuesta (excluyendo la contraseña)
        $userResponse = [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role']
        ];
        
        // Enviar respuesta
        json_response([
            'user' => $userResponse,
            'token' => $token
        ]);
    } else {
        error_log("Contraseña incorrecta para el usuario: $email");
        json_response(['error' => 'Credenciales inválidas'], 401);
    }
} catch (Exception $e) {
    error_log("Error al procesar la autenticación: " . $e->getMessage());
    json_response(['error' => 'Error en el servidor'], 500);
} finally {
    // Cerrar recursos
    if (isset($stmt)) $stmt->close();
    if (isset($conn)) $conn->close();
}
?>
