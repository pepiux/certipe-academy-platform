
<?php
// Incluir archivo de configuración
require_once 'config.php';

// Verificar si es una solicitud GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_response(['error' => 'Método no permitido'], 405);
}

// Autenticar usuario
$user_id = authenticate();

// Obtener ID del curso
if (!isset($_GET['id'])) {
    json_response(['error' => 'ID del curso es requerido'], 400);
}

$course_id = intval($_GET['id']);

// Conectar a la base de datos
$conn = connect_db();

// Consultar información del curso
$stmt = $conn->prepare("
    SELECT c.*, 
    i.id as instructor_id, i.name as instructor_name,
    COUNT(l.id) as lessons_count,
    SUM(l.duration_minutes) as total_duration
    FROM courses c
    LEFT JOIN users i ON c.instructor_id = i.id
    LEFT JOIN lessons l ON c.id = l.course_id
    WHERE c.id = ?
    GROUP BY c.id
");
$stmt->bind_param("i", $course_id);
$stmt->execute();
$result = $stmt->get_result();

// Verificar si existe el curso
if ($result->num_rows === 0) {
    $conn->close();
    json_response(['error' => 'Curso no encontrado'], 404);
}

// Obtener datos del curso
$row = $result->fetch_assoc();

// Formatear duración en horas y minutos
$duration_minutes = $row['total_duration'] ?? 0;
$hours = floor($duration_minutes / 60);
$minutes = $duration_minutes % 60;
$duration = ($hours > 0 ? "$hours h " : "") . ($minutes > 0 ? "$minutes min" : "");
if (empty($duration)) $duration = "0 min";

// Consultar lecciones del curso
$lessons_stmt = $conn->prepare("
    SELECT l.id, l.title, l.description, l.content_type, l.duration_minutes, 
    l.order_index, l.created_at, l.updated_at
    FROM lessons l
    WHERE l.course_id = ?
    ORDER BY l.order_index ASC
");
$lessons_stmt->bind_param("i", $course_id);
$lessons_stmt->execute();
$lessons_result = $lessons_stmt->get_result();

// Obtener lecciones
$lessons = [];
while ($lesson = $lessons_result->fetch_assoc()) {
    $lessons[] = [
        'id' => $lesson['id'],
        'title' => $lesson['title'],
        'description' => $lesson['description'],
        'content_type' => $lesson['content_type'],
        'duration_minutes' => $lesson['duration_minutes'],
        'order_index' => $lesson['order_index'],
        'created_at' => $lesson['created_at'],
        'updated_at' => $lesson['updated_at']
    ];
}

// Consultar progreso del usuario en el curso
$progress_stmt = $conn->prepare("
    SELECT COUNT(DISTINCT cl.lesson_id) as completed_lessons
    FROM course_lesson_completions cl
    WHERE cl.course_id = ? AND cl.user_id = ?
");
$progress_stmt->bind_param("ii", $course_id, $user_id);
$progress_stmt->execute();
$progress_result = $progress_stmt->get_result();
$progress_row = $progress_result->fetch_assoc();
$completed_lessons = $progress_row['completed_lessons'];

// Calcular porcentaje de progreso
$progress = $row['lessons_count'] > 0 ? round(($completed_lessons / $row['lessons_count']) * 100) : 0;

// Preparar respuesta
$course = [
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
    'category' => $row['category'],
    'lessons' => $lessons,
    'progress' => $progress,
    'completed_lessons' => $completed_lessons,
    'total_lessons' => $row['lessons_count'] ?? 0,
    'created_at' => $row['created_at'],
    'updated_at' => $row['updated_at']
];

// Cerrar la conexión
$stmt->close();
$lessons_stmt->close();
$progress_stmt->close();
$conn->close();

// Enviar respuesta
json_response($course);
?>
