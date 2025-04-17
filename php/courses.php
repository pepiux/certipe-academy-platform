
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
$level = isset($_GET['level']) ? $_GET['level'] : '';
$category_id = isset($_GET['category_id']) ? intval($_GET['category_id']) : 0;
$page = isset($_GET['page']) ? intval($_GET['page']) : 1;
$per_page = isset($_GET['per_page']) ? intval($_GET['per_page']) : 10;

// Calcular offset para paginación
$offset = ($page - 1) * $per_page;

// Conectar a la base de datos
$conn = connect_db();

// Construir consulta base
$query = "SELECT c.*, 
          i.id as instructor_id, i.name as instructor_name,
          COUNT(l.id) as lessons_count,
          SUM(l.duration_minutes) as total_duration
          FROM courses c
          LEFT JOIN users i ON c.instructor_id = i.id
          LEFT JOIN lessons l ON c.id = l.course_id
          WHERE 1=1";
$params = [];
$types = "";

// Aplicar filtros
if (!empty($search)) {
    $query .= " AND (c.title LIKE ? OR c.description LIKE ?)";
    $search_param = "%$search%";
    $params[] = $search_param;
    $params[] = $search_param;
    $types .= "ss";
}

if (!empty($level)) {
    $query .= " AND c.level = ?";
    $params[] = $level;
    $types .= "s";
}

if ($category_id > 0) {
    $query .= " AND c.category_id = ?";
    $params[] = $category_id;
    $types .= "i";
}

// Agrupar por curso
$query .= " GROUP BY c.id";

// Consulta para contar total de resultados
$count_query = "SELECT COUNT(DISTINCT c.id) as total FROM courses c WHERE 1=1";
$count_params = [];
$count_types = "";

if (!empty($search)) {
    $count_query .= " AND (c.title LIKE ? OR c.description LIKE ?)";
    $count_params[] = $search_param;
    $count_params[] = $search_param;
    $count_types .= "ss";
}

if (!empty($level)) {
    $count_query .= " AND c.level = ?";
    $count_params[] = $level;
    $count_types .= "s";
}

if ($category_id > 0) {
    $count_query .= " AND c.category_id = ?";
    $count_params[] = $category_id;
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
$query .= " LIMIT ? OFFSET ?";
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
$courses = [];
while ($row = $result->fetch_assoc()) {
    // Formatear duración en horas y minutos
    $duration_minutes = $row['total_duration'] ?? 0;
    $hours = floor($duration_minutes / 60);
    $minutes = $duration_minutes % 60;
    $duration = ($hours > 0 ? "$hours h " : "") . ($minutes > 0 ? "$minutes min" : "");
    if (empty($duration)) $duration = "0 min";
    
    $courses[] = [
        'id' => $row['id'],
        'title' => $row['title'],
        'description' => $row['description'],
        'image' => $row['image'],
        'lessons_count' => $row['lessons_count'] ?? 0,
        'duration' => $duration,
        'level' => $row['level'],
        'instructor' => [
            'id' => $row['instructor_id'],
            'name' => $row['instructor_name']
        ],
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
    'data' => $courses,
    'meta' => $meta
]);
?>
