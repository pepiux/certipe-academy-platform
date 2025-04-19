
<?php
// Necesitamos las configuraciones y conexión a la base de datos
require_once 'config.php';
require_once 'utils/auth_utils.php';

// Verificar autenticación
$user_id = validateAuthToken();
if (!$user_id) {
    http_response_code(401);
    echo json_encode(['error' => 'No autorizado']);
    exit;
}

try {
    $pdo = getDbConnection();
    
    // Estadísticas generales
    $stmt = $pdo->prepare("SELECT * FROM dashboard_stats WHERE user_id = :user_id");
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();
    $general_stats = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$general_stats) {
        // Si no hay estadísticas, crear un resultado vacío
        $general_stats = [
            'total_study_hours' => 0,
            'completed_quizzes' => 0,
            'average_score' => 0,
            'courses_in_progress' => 0
        ];
    }
    
    // Horas de estudio (cursos completados)
    $stmt = $pdo->prepare("
        SELECT c.id, c.title, c.duration_hours, cp.completed_at
        FROM courses c
        JOIN course_progress cp ON c.id = cp.course_id
        WHERE cp.user_id = :user_id AND cp.progress_percentage = 100
        ORDER BY cp.completed_at DESC
    ");
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();
    $completed_courses = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Horas de estudio (quizzes completados)
    $stmt = $pdo->prepare("
        SELECT q.id, q.title, (q.duration_minutes / 60) as duration_hours, 
               MAX(qa.completed_at) as completed_date
        FROM quizzes q
        JOIN quiz_attempts qa ON q.id = qa.quiz_id
        WHERE qa.user_id = :user_id AND qa.passed = 1
        GROUP BY q.id
        ORDER BY completed_date DESC
    ");
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();
    $completed_quizzes_hours = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Cuestionarios completados con detalle
    $stmt = $pdo->prepare("
        SELECT q.id, q.title, MAX(qa.completed_at) as completed_date, 
               MAX(qa.score) as score
        FROM quizzes q
        JOIN quiz_attempts qa ON q.id = qa.quiz_id
        WHERE qa.user_id = :user_id AND qa.passed = 1
        GROUP BY q.id
        ORDER BY completed_date DESC
    ");
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();
    $completed_quizzes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Puntuaciones medias por quiz
    $stmt = $pdo->prepare("
        SELECT q.id, q.title, AVG(qa.score) as avg_score
        FROM quizzes q
        JOIN quiz_attempts qa ON q.id = qa.quiz_id
        WHERE qa.user_id = :user_id
        GROUP BY q.id
    ");
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();
    $quiz_scores = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Detalles de intentos por quiz
    $quiz_attempts = [];
    foreach ($quiz_scores as $quiz) {
        $stmt = $pdo->prepare("
            SELECT completed_at as date, score
            FROM quiz_attempts
            WHERE user_id = :user_id AND quiz_id = :quiz_id
            ORDER BY completed_at DESC
        ");
        $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->bindParam(':quiz_id', $quiz['id'], PDO::PARAM_INT);
        $stmt->execute();
        $attempts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $quiz_attempts[$quiz['id']] = $attempts;
    }
    
    // Cursos en progreso
    $stmt = $pdo->prepare("
        SELECT c.id, c.title, c.duration_hours, cp.progress_percentage as progress
        FROM courses c
        JOIN course_progress cp ON c.id = cp.course_id
        WHERE cp.user_id = :user_id AND cp.progress_percentage > 0 AND cp.progress_percentage < 100
        ORDER BY cp.updated_at DESC
    ");
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();
    $courses_in_progress = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Formatear resultados para el frontend
    $result = [
        'study_hours' => [
            'total' => (float) $general_stats['total_study_hours'],
            'by_course' => array_map(function($course) {
                return [
                    'id' => (int) $course['id'],
                    'title' => $course['title'],
                    'hours' => (float) $course['duration_hours'],
                    'completed_date' => $course['completed_at']
                ];
            }, $completed_courses),
            'by_quiz' => array_map(function($quiz) {
                return [
                    'id' => (int) $quiz['id'],
                    'title' => $quiz['title'],
                    'hours' => (float) $quiz['duration_hours'],
                    'completed_date' => $quiz['completed_date']
                ];
            }, $completed_quizzes_hours)
        ],
        'completed_quizzes' => [
            'total' => count($completed_quizzes),
            'quizzes' => array_map(function($quiz) {
                return [
                    'id' => (int) $quiz['id'],
                    'title' => $quiz['title'],
                    'completed_date' => $quiz['completed_date'],
                    'score' => (int) $quiz['score']
                ];
            }, $completed_quizzes)
        ],
        'average_scores' => [
            'overall' => (int) $general_stats['average_score'],
            'by_quiz' => array_map(function($quiz) use ($quiz_attempts) {
                return [
                    'id' => (int) $quiz['id'],
                    'title' => $quiz['title'],
                    'avg_score' => (float) $quiz['avg_score'],
                    'attempts' => array_map(function($attempt) {
                        return [
                            'date' => $attempt['date'],
                            'score' => (int) $attempt['score']
                        ];
                    }, $quiz_attempts[$quiz['id']])
                ];
            }, $quiz_scores)
        ],
        'courses_in_progress' => [
            'total' => (int) $general_stats['courses_in_progress'],
            'courses' => array_map(function($course) {
                return [
                    'id' => (int) $course['id'],
                    'title' => $course['title'],
                    'progress' => (int) $course['progress'],
                    'duration_hours' => (float) $course['duration_hours']
                ];
            }, $courses_in_progress)
        ]
    ];
    
    header('Content-Type: application/json');
    echo json_encode($result);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error en el servidor: ' . $e->getMessage()]);
}
