
<?php
// Incluir archivo de configuración
require_once 'config.php';

// Verificar si es una solicitud GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_response(['error' => 'Método no permitido'], 405);
}

// Autenticar usuario
$user_id = authenticate();

// Obtener parámetros de filtrado
$search = isset($_GET['search']) ? $_GET['search'] : '';
$difficulty = isset($_GET['difficulty']) ? $_GET['difficulty'] : '';
$course_id = isset($_GET['course_id']) ? intval($_GET['course_id']) : 0;
$page = isset($_GET['page']) ? intval($_GET['page']) : 1;
$per_page = isset($_GET['per_page']) ? intval($_GET['per_page']) : 10;

// Calcular offset para paginación
$offset = ($page - 1) * $per_page;

// Conectar a la base de datos
$conn = connect_db();

// Construir consulta base
$query = "SELECT q.*, c.title as course_title, c.category as category, 
          (SELECT COUNT(*) FROM quiz_questions WHERE quiz_id = q.id) as total_questions
          FROM quizzes q
          LEFT JOIN courses c ON q.course_id = c.id
          WHERE q.is_published = 1";
$params = [];
$types = "";

// Aplicar filtros
if (!empty($search)) {
    $query .= " AND (q.title LIKE ? OR q.description LIKE ?)";
    $search_param = "%$search%";
    $params[] = $search_param;
    $params[] = $search_param;
    $types .= "ss";
}

if (!empty($difficulty)) {
    $query .= " AND q.difficulty_level = ?";
    $params[] = $difficulty;
    $types .= "s";
}

if ($course_id > 0) {
    $query .= " AND q.course_id = ?";
    $params[] = $course_id;
    $types .= "i";
}

// Consulta para contar total de resultados
$count_query = "SELECT COUNT(*) as total FROM quizzes q WHERE q.is_published = 1";
$count_params = [];
$count_types = "";

if (!empty($search)) {
    $count_query .= " AND (q.title LIKE ? OR q.description LIKE ?)";
    $count_params[] = $search_param;
    $count_params[] = $search_param;
    $count_types .= "ss";
}

if (!empty($difficulty)) {
    $count_query .= " AND q.difficulty_level = ?";
    $count_params[] = $difficulty;
    $count_types .= "s";
}

if ($course_id > 0) {
    $count_query .= " AND q.course_id = ?";
    $count_params[] = $course_id;
    $count_types .= "i";
}

// Preparar y ejecutar consulta de conteo
$count_stmt = $conn->prepare($count_query);
if (!empty($count_types) && !empty($count_params)) {
    $count_stmt->bind_param($count_types, ...$count_params);
}
$count_stmt->execute();
$count_result = $count_stmt->get_result();
$count_row = $count_result->fetch_assoc();
$total = $count_row['total'];

// Aplicar paginación a la consulta principal
$query .= " ORDER BY q.created_at DESC LIMIT ? OFFSET ?";
$params[] = $per_page;
$params[] = $offset;
$types .= "ii";

// Preparar y ejecutar consulta principal
$stmt = $conn->prepare($query);
if (!empty($types) && !empty($params)) {
    $stmt->bind_param($types, ...$params);
}
$stmt->execute();
$result = $stmt->get_result();

// Obtener resultados
$quizzes = [];
while ($row = $result->fetch_assoc()) {
    // Consultar último intento del usuario para este quiz
    $attempt_stmt = $conn->prepare("
        SELECT score, passed, completed_at 
        FROM quiz_attempts 
        WHERE quiz_id = ? AND user_id = ? 
        ORDER BY completed_at DESC 
        LIMIT 1
    ");
    $attempt_stmt->bind_param("ii", $row['id'], $user_id);
    $attempt_stmt->execute();
    $attempt_result = $attempt_stmt->get_result();
    $attempt = $attempt_result->fetch_assoc();
    $attempt_stmt->close();
    
    // Consultar mejor puntaje
    $best_score_stmt = $conn->prepare("
        SELECT MAX(score) as best_score 
        FROM quiz_attempts 
        WHERE quiz_id = ? AND user_id = ? AND completed_at IS NOT NULL
    ");
    $best_score_stmt->bind_param("ii", $row['id'], $user_id);
    $best_score_stmt->execute();
    $best_score_result = $best_score_stmt->get_result();
    $best_score_row = $best_score_result->fetch_assoc();
    $best_score = $best_score_row['best_score'] ?? null;
    $best_score_stmt->close();
    
    $quizzes[] = [
        'id' => $row['id'],
        'title' => $row['title'],
        'description' => $row['description'],
        'course_id' => $row['course_id'],
        'course_title' => $row['course_title'],
        'duration_minutes' => $row['duration_minutes'],
        'passing_score' => $row['passing_score'],
        'total_questions' => $row['total_questions'],
        'difficulty_level' => $row['difficulty_level'],
        'category' => $row['category'],
        'is_published' => $row['is_published'],
        'last_score' => $attempt ? $attempt['score'] : null,
        'best_score' => $best_score,
        'passed' => $attempt ? $attempt['passed'] : null,
        'completed_at' => $attempt ? $attempt['completed_at'] : null,
        'created_at' => $row['created_at'],
        'updated_at' => $row['updated_at']
    ];
}

// Cerrar la conexión
$stmt->close();
$count_stmt->close();
$conn->close();

// Preparar metadatos de paginación
$meta = [
    'current_page' => $page,
    'per_page' => $per_page,
    'total' => $total,
    'last_page' => ceil($total / $per_page)
];

// Enviar respuesta
json_response([
    'data' => $quizzes,
    'meta' => $meta
]);
?>
