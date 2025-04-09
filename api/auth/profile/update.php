
<?php
require_once '../../config/database.php';
require_once '../../config/cors.php';
require_once '../../utils/session.php';

// Solo aceptar peticiones PUT
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit();
}

// Obtener datos de la petición
$data = json_decode(file_get_contents('php://input'), true);
$id = isset($data['id']) ? $data['id'] : '';

if (!$id) {
    http_response_code(400);
    echo json_encode(['error' => 'ID de usuario es requerido']);
    exit();
}

// Conectar a la base de datos
$conn = getConnection();

// Verificar si el usuario existe
$stmt = $conn->prepare("SELECT id FROM profiles WHERE id = ?");
$stmt->bind_param("s", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(404);
    echo json_encode(['error' => 'Usuario no encontrado']);
    exit();
}

// Preparar campos actualizables
$updateFields = [];
$bindTypes = "s"; // Para el ID
$bindParams = [$id];
$allowedFields = ['first_name', 'last_name', 'avatar_url'];

foreach ($allowedFields as $field) {
    if (isset($data[$field])) {
        $updateFields[] = "$field = ?";
        $bindTypes .= "s";
        $bindParams[] = $data[$field];
    }
}

if (empty($updateFields)) {
    http_response_code(400);
    echo json_encode(['error' => 'No hay campos para actualizar']);
    exit();
}

// Actualizar perfil
$query = "UPDATE profiles SET " . implode(", ", $updateFields) . ", updated_at = NOW() WHERE id = ?";
$stmt = $conn->prepare($query);

// Bind dinámico de parámetros
$stmt->bind_param($bindTypes, ...$bindParams);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al actualizar el perfil: ' . $conn->error]);
    exit();
}

http_response_code(200);
echo json_encode(['message' => 'Perfil actualizado correctamente']);

$conn->close();
?>
