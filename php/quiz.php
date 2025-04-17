
<?php
// Incluir archivo de configuración
require_once 'config.php';

// Verificar si es una solicitud GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_response(['error' => 'Método no permitido'], 405);
}

// Autenticar usuario
$user_id = authenticate();

// Obtener ID del quiz
if (!isset($_GET['id'])) {
    json_response(['error' => 'ID del quiz es requerido'], 400);
}

$quiz_id = intval($_GET['id']);

// Conectar a la base de datos
$conn = connect_db();

// Consultar información del quiz
$stmt = $conn->prepare("
    SELECT q.*, c.title as course_title, c.category as category 
    FROM quizzes q
    LEFT JOIN courses c ON q.course_id = c.id
    WHERE q.id = ?
");
$stmt->bind_param("i", $quiz_id);
$stmt->execute();
$result = $stmt->get_result();

// Verificar si existe el quiz
if ($result->num_rows === 0) {
    $conn->close();
    json_response(['error' => 'Quiz no encontrado'], 404);
}

// Obtener datos del quiz
$row = $result->fetch_assoc();

// Consultar preguntas del quiz
$question_stmt = $conn->prepare("
    SELECT id, quiz_id, text, type
    FROM quiz_questions
    WHERE quiz_id = ?
    ORDER BY id
");
$question_stmt->bind_param("i", $quiz_id);
$question_stmt->execute();
$question_result = $question_stmt->get_result();

// Obtener preguntas
$questions = [];
while ($question = $question_result->fetch_assoc()) {
    // Para cada pregunta, obtener sus opciones
    $option_stmt = $conn->prepare("
        SELECT id, question_id, text, is_correct
        FROM quiz_options
        WHERE question_id = ?
        ORDER BY id
    ");
    $option_stmt->bind_param("i", $question['id']);
    $option_stmt->execute();
    $option_result = $option_stmt->get_result();
    
    // Obtener opciones
    $options = [];
    while ($option = $option_result->fetch_assoc()) {
        $options[] = [
            'id' => $option['id'],
            'text' => $option['text'],
            'is_correct' => (bool) $option['is_correct']
        ];
    }
    
    // Si es una pregunta de tipo 'fill-blank', obtener la palabra y opciones
    $blank_word = null;
    $blank_options = null;
    if ($question['type'] === 'fill-blank') {
        $blank_stmt = $conn->prepare("
            SELECT blank_word, blank_options
            FROM quiz_fill_blanks
            WHERE question_id = ?
        ");
        $blank_stmt->bind_param("i", $question['id']);
        $blank_stmt->execute();
        $blank_result = $blank_stmt->get_result();
        if ($blank_row = $blank_result->fetch_assoc()) {
            $blank_word = $blank_row['blank_word'];
            $blank_options = json_decode($blank_row['blank_options'], true);
        }
        $blank_stmt->close();
    }
    
    $questions[] = [
        'id' => $question['id'],
        'quiz_id' => $question['quiz_id'],
        'text' => $question['text'],
        'type' => $question['type'],
        'options' => $options,
        'blank_word' => $blank_word,
        'blank_options' => $blank_options
    ];
    
    $option_stmt->close();
}

// Consultar intentos previos del usuario
$attempts_stmt = $conn->prepare("
    SELECT id, quiz_id, user_id, score, passed, completed_at
    FROM quiz_attempts
    WHERE quiz_id = ? AND user_id = ? AND completed_at IS NOT NULL
    ORDER BY completed_at DESC
");
$attempts_stmt->bind_param("ii", $quiz_id, $user_id);
$attempts_stmt->execute();
$attempts_result = $attempts_stmt->get_result();

// Obtener intentos
$attempts = [];
while ($attempt = $attempts_result->fetch_assoc()) {
    $attempts[] = [
        'id' => $attempt['id'],
        'quiz_id' => $attempt['quiz_id'],
        'user_id' => $attempt['user_id'],
        'score' => $attempt['score'],
        'passed' => (bool) $attempt['passed'],
        'completed_at' => $attempt['completed_at']
    ];
}

// Preparar respuesta
$quiz = [
    'id' => $row['id'],
    'title' => $row['title'],
    'description' => $row['description'],
    'course_id' => $row['course_id'],
    'course_title' => $row['course_title'],
    'category' => $row['category'],
    'duration_minutes' => $row['duration_minutes'],
    'passing_score' => $row['passing_score'],
    'total_questions' => count($questions),
    'difficulty_level' => $row['difficulty_level'],
    'is_published' => (bool) $row['is_published'],
    'questions' => $questions,
    'attempts' => $attempts,
    'created_at' => $row['created_at'],
    'updated_at' => $row['updated_at']
];

// Cerrar la conexión
$stmt->close();
$question_stmt->close();
$attempts_stmt->close();
$conn->close();

// Enviar respuesta
json_response($quiz);
?>
