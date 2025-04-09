
<?php
require_once '../config/database.php';
require_once '../config/cors.php';
require_once '../utils/session.php';

// Gestionar POST para obtener perfil por email
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
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

    // Buscar usuario por email
    $stmt = $conn->prepare("SELECT id, email, first_name, last_name, is_admin, avatar_url, created_at, updated_at FROM profiles WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Usuario no encontrado']);
        exit();
    }

    $profile = $result->fetch_assoc();

    // Devolver datos del perfil
    http_response_code(200);
    echo json_encode([
        'profile' => $profile
    ]);

    $conn->close();
    exit();
}

// En caso de otro método, devolver error
http_response_code(405);
echo json_encode(['error' => 'Método no permitido']);
?>
