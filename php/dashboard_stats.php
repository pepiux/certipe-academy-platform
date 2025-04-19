
<?php
// Incluir archivo de configuración
require_once 'config.php';

// Verificar si es una solicitud GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_response(['error' => 'Método no permitido'], 405);
}

// Autenticar usuario
$user_id = authenticate();

// Conectar a la base de datos
$conn = connect_db();

// 1. Obtener horas de estudio
// Por cursos
$course_hours_stmt = $conn->prepare("
    SELECT st.id, c.title, st.hours, st.completed_date
    FROM study_time_records st
    JOIN courses c ON st.course_id = c.id
    WHERE st.user_id = ? AND st.course_id IS NOT NULL
    ORDER BY st.completed_date DESC
");
$course_hours_stmt->bind_param("i", $user_id);
$course_hours_stmt->execute();
$course_hours_result = $course_hours_stmt->get_result();

$course_hours = [];
while ($row = $course_hours_result->fetch_assoc()) {
    $course_hours[] = [
        'id' => $row['id'],
        'title' => $row['title'],
        'hours' => floatval($row['hours']),
        'completed_date' => $row['completed_date']
    ];
}

// Por cuestionarios
$quiz_hours_stmt = $conn->prepare("
    SELECT st.id, q.title, st.hours, st.completed_date
    FROM study_time_records st
    JOIN quizzes q ON st.quiz_id = q.id
    WHERE st.user_id = ? AND st.quiz_id IS NOT NULL
    ORDER BY st.completed_date DESC
");
$quiz_hours_stmt->bind_param("i", $user_id);
$quiz_hours_stmt->execute();
$quiz_hours_result = $quiz_hours_stmt->get_result();

$quiz_hours = [];
while ($row = $quiz_hours_result->fetch_assoc()) {
    $quiz_hours[] = [
        'id' => $row['id'],
        'title' => $row['title'],
        'hours' => floatval($row['hours']),
        'completed_date' => $row['completed_date']
    ];
}

// Total de horas
$total_hours_stmt = $conn->prepare("
    SELECT SUM(hours) as total_hours
    FROM study_time_records
    WHERE user_id = ?
");
$total_hours_stmt->bind_param("i", $user_id);
$total_hours_stmt->execute();
$total_hours_result = $total_hours_stmt->get_result()->fetch_assoc();
$total_hours = $total_hours_result['total_hours'] ? floatval($total_hours_result['total_hours']) : 0;

// 2. Obtener cuestionarios completados
$completed_quizzes_stmt = $conn->prepare("
    SELECT qa.id, q.id as quiz_id, q.title, qa.completed_at, qa.score
    FROM quiz_attempts qa
    JOIN quizzes q ON qa.quiz_id = q.id
    WHERE qa.user_id = ? AND qa.passed = 1
    ORDER BY qa.completed_at DESC
");
$completed_quizzes_stmt->bind_param("i", $user_id);
$completed_quizzes_stmt->execute();
$completed_quizzes_result = $completed_quizzes_stmt->get_result();

$completed_quizzes = [];
while ($row = $completed_quizzes_result->fetch_assoc()) {
    $completed_quizzes[] = [
        'id' => $row['quiz_id'],
        'title' => $row['title'],
        'completed_date' => $row['completed_at'],
        'score' => intval($row['score'])
    ];
}

// 3. Obtener puntuaciones promedio
$avg_scores_stmt = $conn->prepare("
    SELECT q.id, q.title, AVG(qa.score) as avg_score
    FROM quiz_attempts qa
    JOIN quizzes q ON qa.quiz_id = q.id
    WHERE qa.user_id = ?
    GROUP BY q.id, q.title
");
$avg_scores_stmt->bind_param("i", $user_id);
$avg_scores_stmt->execute();
$avg_scores_result = $avg_scores_stmt->get_result();

$quiz_scores = [];
while ($row = $avg_scores_result->fetch_assoc()) {
    $quiz_id = $row['id'];
    
    // Obtener todos los intentos para este quiz
    $attempts_stmt = $conn->prepare("
        SELECT completed_at as date, score
        FROM quiz_attempts
        WHERE user_id = ? AND quiz_id = ?
        ORDER BY completed_at ASC
    ");
    $attempts_stmt->bind_param("ii", $user_id, $quiz_id);
    $attempts_stmt->execute();
    $attempts_result = $attempts_stmt->get_result();
    
    $attempts = [];
    while ($attempt = $attempts_result->fetch_assoc()) {
        $attempts[] = [
            'date' => $attempt['date'],
            'score' => intval($attempt['score'])
        ];
    }
    $attempts_stmt->close();
    
    $quiz_scores[] = [
        'id' => intval($row['id']),
        'title' => $row['title'],
        'avg_score' => round(floatval($row['avg_score']), 1),
        'attempts' => $attempts
    ];
}

// Calcular puntuación promedio general
$overall_score_stmt = $conn->prepare("
    SELECT AVG(score) as overall_avg
    FROM quiz_attempts
    WHERE user_id = ?
");
$overall_score_stmt->bind_param("i", $user_id);
$overall_score_stmt->execute();
$overall_score_result = $overall_score_stmt->get_result()->fetch_assoc();
$overall_score = $overall_score_result['overall_avg'] ? round(floatval($overall_score_result['overall_avg'])) : 0;

// 4. Obtener cursos en progreso
$courses_in_progress_stmt = $conn->prepare("
    SELECT c.id, c.title, cp.progress_percentage as progress, c.duration_hours
    FROM course_progress cp
    JOIN courses c ON cp.course_id = c.id
    WHERE cp.user_id = ? AND cp.progress_percentage < 100 AND cp.progress_percentage > 0
    ORDER BY cp.updated_at DESC
");
$courses_in_progress_stmt->bind_param("i", $user_id);
$courses_in_progress_stmt->execute();
$courses_in_progress_result = $courses_in_progress_stmt->get_result();

$courses_in_progress = [];
while ($row = $courses_in_progress_result->fetch_assoc()) {
    $courses_in_progress[] = [
        'id' => intval($row['id']),
        'title' => $row['title'],
        'progress' => intval($row['progress']),
        'duration_hours' => floatval($row['duration_hours'])
    ];
}

// Preparar la respuesta
$response = [
    'study_hours' => [
        'total' => $total_hours,
        'by_course' => $course_hours,
        'by_quiz' => $quiz_hours
    ],
    'completed_quizzes' => [
        'total' => count($completed_quizzes),
        'quizzes' => $completed_quizzes
    ],
    'average_scores' => [
        'overall' => $overall_score,
        'by_quiz' => $quiz_scores
    ],
    'courses_in_progress' => [
        'total' => count($courses_in_progress),
        'courses' => $courses_in_progress
    ]
];

// Cerrar la conexión
$conn->close();

// Enviar respuesta
json_response($response);
?>
