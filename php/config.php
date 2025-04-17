
<?php
// Configuración de la base de datos
define('DB_HOST', 'localhost');
define('DB_USER', 'root');           // Cambiar según su configuración
define('DB_PASSWORD', '');           // Cambiar según su configuración
define('DB_NAME', 'certipe_db');     // Nombre de la base de datos

// Función para crear una conexión a la base de datos
function connect_db() {
    $connection = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
    
    // Verificar conexión
    if ($connection->connect_error) {
        die("Error de conexión: " . $connection->connect_error);
    }
    
    // Establecer conjunto de caracteres UTF-8
    $connection->set_charset("utf8");
    
    return $connection;
}

// Función para manejar errores y devolver respuesta JSON
function json_response($data, $status = 200) {
    // Asegurar que los headers no se han enviado ya
    if (!headers_sent()) {
        header('Content-Type: application/json');
        http_response_code($status);
    }
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// Función para verificar autenticación mediante token
function authenticate() {
    $headers = getallheaders();
    
    // Verificar si existe el encabezado de autorización
    if (!isset($headers['Authorization'])) {
        json_response(['error' => 'No autorizado'], 401);
    }
    
    // Extraer el token del encabezado
    $auth_header = $headers['Authorization'];
    if (strpos($auth_header, 'Bearer ') !== 0) {
        json_response(['error' => 'Formato de token inválido'], 401);
    }
    
    $token = substr($auth_header, 7);
    
    // Conectar a la base de datos
    $conn = connect_db();
    
    // Verificar el token en la base de datos
    $stmt = $conn->prepare("SELECT user_id FROM user_tokens WHERE token = ? AND expires_at > NOW()");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        $conn->close();
        json_response(['error' => 'Token inválido o expirado'], 401);
    }
    
    $row = $result->fetch_assoc();
    $user_id = $row['user_id'];
    
    // Cerrar la conexión
    $stmt->close();
    $conn->close();
    
    return $user_id;
}

// Habilitar CORS para desarrollo local
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Manejar OPTIONS request (para preflight CORS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>
