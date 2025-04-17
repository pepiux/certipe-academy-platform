
-- Crear base de datos
CREATE DATABASE IF NOT EXISTS certipe_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE certipe_db;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'instructor', 'admin') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de tokens de usuario (para autenticación)
CREATE TABLE IF NOT EXISTS user_tokens (
    id INT AUTO_INCREMENT NOT NULL,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY (token),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de cursos
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(255),
    level ENUM('Principiante', 'Intermedio', 'Avanzado') NOT NULL,
    category VARCHAR(100) NOT NULL,
    instructor_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de lecciones
CREATE TABLE IF NOT EXISTS lessons (
    id INT AUTO_INCREMENT NOT NULL,
    course_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    content_type ENUM('video', 'audio', 'reading', 'test') NOT NULL,
    content_data JSON,
    duration_minutes INT NOT NULL DEFAULT 0,
    order_index INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para registrar lecciones completadas
CREATE TABLE IF NOT EXISTS course_lesson_completions (
    id INT AUTO_INCREMENT NOT NULL,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    lesson_id INT NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY (user_id, lesson_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de progreso de curso
CREATE TABLE IF NOT EXISTS course_progress (
    id INT AUTO_INCREMENT NOT NULL,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    progress_percentage INT NOT NULL DEFAULT 0,
    last_accessed_lesson_id INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY (user_id, course_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (last_accessed_lesson_id) REFERENCES lessons(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de quizzes
CREATE TABLE IF NOT EXISTS quizzes (
    id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    course_id INT,
    duration_minutes INT NOT NULL,
    passing_score INT NOT NULL DEFAULT 70,
    difficulty_level ENUM('Fácil', 'Medio', 'Difícil', 'Experto') NOT NULL,
    is_published TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de preguntas de quiz
CREATE TABLE IF NOT EXISTS quiz_questions (
    id INT AUTO_INCREMENT NOT NULL,
    quiz_id INT NOT NULL,
    text TEXT NOT NULL,
    type ENUM('single', 'multiple', 'fill-blank') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de opciones de pregunta
CREATE TABLE IF NOT EXISTS quiz_options (
    id INT AUTO_INCREMENT NOT NULL,
    question_id INT NOT NULL,
    text VARCHAR(255) NOT NULL,
    is_correct TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para preguntas tipo "rellenar el espacio"
CREATE TABLE IF NOT EXISTS quiz_fill_blanks (
    id INT AUTO_INCREMENT NOT NULL,
    question_id INT NOT NULL,
    blank_word VARCHAR(100) NOT NULL,
    blank_options JSON NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (question_id),
    FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de intentos de quiz
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id INT AUTO_INCREMENT NOT NULL,
    quiz_id INT NOT NULL,
    user_id INT NOT NULL,
    score INT NOT NULL DEFAULT 0,
    passed TINYINT(1) NOT NULL DEFAULT 0,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de respuestas de intento
CREATE TABLE IF NOT EXISTS quiz_attempt_answers (
    id INT AUTO_INCREMENT NOT NULL,
    attempt_id INT NOT NULL,
    question_id INT NOT NULL,
    option_id INT,
    text_answer VARCHAR(255),
    is_correct TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    FOREIGN KEY (attempt_id) REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE,
    FOREIGN KEY (option_id) REFERENCES quiz_options(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar datos de ejemplo
-- Usuario administrador
INSERT INTO users (name, email, password, role) VALUES 
('Admin', 'admin@certipe.com', '$2y$10$YlBmGiKyY9Q1nGH3UOgf3eBmSzlGHvFOA5LovVwwL..225Ws2V0f6', 'admin');
-- Contraseña: admin123

-- Usuario instructor
INSERT INTO users (name, email, password, role) VALUES 
('Profesor Demo', 'profesor@certipe.com', '$2y$10$6x6EYRhC0Q2VUM1Dt1G9Fe4mKRZO08tB81YO..CXZE/g4zbUc27bm', 'instructor');
-- Contraseña: profesor123

-- Usuario alumno
INSERT INTO users (name, email, password, role) VALUES 
('Estudiante Demo', 'estudiante@certipe.com', '$2y$10$7AjtB3ZA7DA4tSCfGvSKu.oQK7OldXVGWbMyG4grRd1bh2AK.XsnG', 'user');
-- Contraseña: estudiante123

-- Cursos de ejemplo
INSERT INTO courses (title, description, image, level, category, instructor_id) VALUES 
('Introducción a la Programación Web', 'Aprende los fundamentos de HTML, CSS y JavaScript para crear tus primeras páginas web.', '/placeholder.svg', 'Principiante', 'Desarrollo Web', 2),
('Desarrollo Frontend con React', 'Domina la biblioteca más popular para crear interfaces de usuario modernas y dinámicas.', '/placeholder.svg', 'Intermedio', 'Desarrollo Web', 2),
('Análisis de Datos con Python', 'Aprende a procesar y analizar datos utilizando Python y sus librerías más populares.', '/placeholder.svg', 'Intermedio', 'Ciencia de Datos', 2);

-- Lecciones para el curso de Introducción a la Programación Web
INSERT INTO lessons (course_id, title, description, content_type, content_data, duration_minutes, order_index) VALUES
(1, 'Introducción a HTML', 'Conoce los fundamentos del lenguaje de marcado más utilizado en la web', 'video', '{"url": "https://example.com/video1.mp4", "transcript": "En esta lección aprenderemos..."}', 15, 1),
(1, 'Estructura básica de una página web', 'Aprende a crear la estructura básica de cualquier página web', 'reading', '{"content": "<h1>Estructura básica</h1><p>Una página web básica consta de...</p>"}', 10, 2),
(1, 'CSS: Dando estilo a tu página', 'Aprende a aplicar estilos a tus páginas web con CSS', 'video', '{"url": "https://example.com/video2.mp4", "transcript": "CSS nos permite..."}', 20, 3),
(1, 'Introducción a JavaScript', 'Conoce los conceptos básicos de JavaScript', 'video', '{"url": "https://example.com/video3.mp4", "transcript": "JavaScript es un lenguaje..."}', 25, 4),
(1, 'Proyecto final: Crea tu primera página web', 'Aplica lo aprendido para crear tu primera página web completa', 'test', '{"instructions": "En este proyecto final, crearás..."}', 30, 5);

-- Lecciones para el curso de Desarrollo Frontend con React
INSERT INTO lessons (course_id, title, description, content_type, content_data, duration_minutes, order_index) VALUES
(2, '¿Qué es React?', 'Introducción a React y sus conceptos fundamentales', 'video', '{"url": "https://example.com/react1.mp4", "transcript": "React es una biblioteca..."}', 15, 1),
(2, 'Componentes en React', 'Aprende a crear y utilizar componentes en React', 'video', '{"url": "https://example.com/react2.mp4", "transcript": "Los componentes son..."}', 20, 2),
(2, 'Estado y ciclo de vida', 'Entiende el estado y el ciclo de vida de los componentes', 'reading', '{"content": "<h1>Estado y ciclo de vida</h1><p>El estado en React es...</p>"}', 15, 3),
(2, 'Hooks en React', 'Conoce los hooks más utilizados en React', 'video', '{"url": "https://example.com/react3.mp4", "transcript": "Los hooks son..."}', 25, 4),
(2, 'Proyecto: Aplicación de tareas', 'Crea una aplicación de tareas completa con React', 'test', '{"instructions": "En este proyecto, crearás una aplicación..."}', 40, 5);

-- Lecciones para el curso de Análisis de Datos con Python
INSERT INTO lessons (course_id, title, description, content_type, content_data, duration_minutes, order_index) VALUES
(3, 'Introducción a Python', 'Conceptos básicos de Python para análisis de datos', 'video', '{"url": "https://example.com/python1.mp4", "transcript": "Python es un lenguaje..."}', 20, 1),
(3, 'Manipulación de datos con Pandas', 'Aprende a procesar datos con la biblioteca Pandas', 'video', '{"url": "https://example.com/python2.mp4", "transcript": "Pandas es una biblioteca..."}', 30, 2),
(3, 'Visualización de datos', 'Técnicas para visualizar datos con Matplotlib y Seaborn', 'reading', '{"content": "<h1>Visualización de datos</h1><p>La visualización es fundamental...</p>"}', 25, 3),
(3, 'Análisis estadístico básico', 'Conceptos estadísticos esenciales para el análisis de datos', 'audio', '{"url": "https://example.com/python3.mp3", "transcript": "La estadística nos permite..."}', 20, 4),
(3, 'Proyecto final: Análisis de un conjunto de datos', 'Aplica lo aprendido en un proyecto de análisis completo', 'test', '{"instructions": "En este proyecto final, analizarás..."}', 45, 5);

-- Quizzes de ejemplo
INSERT INTO quizzes (title, description, course_id, duration_minutes, passing_score, difficulty_level, is_published) VALUES
('Quiz de HTML básico', 'Pon a prueba tus conocimientos de HTML', 1, 15, 70, 'Fácil', 1),
('Quiz de React', 'Evalúa tu comprensión de los conceptos fundamentales de React', 2, 20, 75, 'Medio', 1),
('Quiz de Python y Pandas', 'Comprueba tus habilidades con Python y Pandas', 3, 25, 80, 'Difícil', 1);

-- Preguntas para el Quiz de HTML
INSERT INTO quiz_questions (quiz_id, text, type) VALUES
(1, '¿Qué significa HTML?', 'single'),
(1, '¿Cuál de estas etiquetas se utiliza para crear un enlace?', 'single'),
(1, '¿Qué etiquetas se utilizan para crear listas en HTML? (Selecciona todas las correctas)', 'multiple'),
(1, 'Complete la frase: La etiqueta <___> se utiliza para definir el título de una página web.', 'fill-blank');

-- Opciones para la pregunta 1
INSERT INTO quiz_options (question_id, text, is_correct) VALUES
(1, 'HyperText Markup Language', 1),
(1, 'High Technical Modern Language', 0),
(1, 'Hyper Technical Meta Language', 0),
(1, 'Home Tool Markup Language', 0);

-- Opciones para la pregunta 2
INSERT INTO quiz_options (question_id, text, is_correct) VALUES
(2, '<a>', 1),
(2, '<link>', 0),
(2, '<href>', 0),
(2, '<url>', 0);

-- Opciones para la pregunta 3
INSERT INTO quiz_options (question_id, text, is_correct) VALUES
(3, '<ul>', 1),
(3, '<ol>', 1),
(3, '<li>', 1),
(3, '<dl>', 1),
(3, '<list>', 0);

-- Configuración para la pregunta 4 (fill-blank)
INSERT INTO quiz_fill_blanks (question_id, blank_word, blank_options) VALUES
(4, 'title', '["title", "head", "header", "h1"]');

-- Preguntas para el Quiz de React
INSERT INTO quiz_questions (quiz_id, text, type) VALUES
(2, '¿Qué es JSX en React?', 'single'),
(2, '¿Cuál de estos hooks NO existe en React?', 'single'),
(2, 'Selecciona los conceptos que forman parte del ciclo de vida de un componente en React:', 'multiple');

-- Opciones para las preguntas de React
-- (Continuar con inserciones similares para los demás quizzes)

-- Añadir más datos de ejemplo según sea necesario
