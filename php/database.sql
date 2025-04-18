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
    duration_hours DECIMAL(5,2) NOT NULL DEFAULT 0.00,
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
    completed_at TIMESTAMP NULL, -- Fecha de finalización del curso
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

-- Nueva tabla para estadísticas del dashboard
CREATE TABLE IF NOT EXISTS dashboard_stats (
    id INT AUTO_INCREMENT NOT NULL,
    user_id INT NOT NULL,
    total_study_hours DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    completed_quizzes INT NOT NULL DEFAULT 0,
    average_score DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    courses_in_progress INT NOT NULL DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Modificar la tabla de quizzes para agregar el campo de puntaje mínimo
ALTER TABLE quizzes ADD COLUMN min_passing_score INT NOT NULL DEFAULT 70;

-- Actualizar los quizzes existentes con valores de ejemplo
UPDATE quizzes SET min_passing_score = 70 WHERE id IN (1, 4, 6);
UPDATE quizzes SET min_passing_score = 75 WHERE id IN (2, 5);
UPDATE quizzes SET min_passing_score = 80 WHERE id = 3;

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

-- Cursos de ejemplo con duración en horas
INSERT INTO courses (title, description, image, level, category, instructor_id, duration_hours) VALUES 
('Introducción a la Programación Web', 'Aprende los fundamentos de HTML, CSS y JavaScript para crear tus primeras páginas web.', '/placeholder.svg', 'Principiante', 'Desarrollo Web', 2, 8.5),
('Desarrollo Frontend con React', 'Domina la biblioteca más popular para crear interfaces de usuario modernas y dinámicas.', '/placeholder.svg', 'Intermedio', 'Desarrollo Web', 2, 12.0),
('Análisis de Datos con Python', 'Aprende a procesar y analizar datos utilizando Python y sus librerías más populares.', '/placeholder.svg', 'Intermedio', 'Ciencia de Datos', 2, 15.0),
('Curso de PHP 1', 'Fundamentos de programación con PHP', '/placeholder.svg', 'Principiante', 'Desarrollo', 2, 10.5),
('Curso de PHP 2', 'Desarrollo avanzado con PHP y MySQL', '/placeholder.svg', 'Avanzado', 'Desarrollo', 2, 20.0);

-- Marcamos algunos cursos como completados
INSERT INTO course_progress (user_id, course_id, progress_percentage, completed_at) VALUES 
(3, 4, 100, '2023-04-15 00:00:00'),
(3, 5, 100, '2023-06-20 00:00:00'),
(3, 1, 35, NULL),
(3, 2, 75, NULL);

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

-- Quizzes de ejemplo con duración en minutos
INSERT INTO quizzes (title, description, course_id, duration_minutes, passing_score, difficulty_level, is_published) VALUES
('Fundamentos de Gestión de Proyectos', 'Pon a prueba tus conocimientos de HTML', 1, 30, 70, 'Fácil', 1),
('Scrum Master', 'Evalúa tu comprensión de los conceptos fundamentales de React', 2, 45, 75, 'Medio', 1),
('Preparación PMP', 'Comprueba tus habilidades con Python y Pandas', 3, 60, 80, 'Difícil', 1),
('PHP Básico', 'Evalúa tus conocimientos de PHP básico', 4, 35, 70, 'Fácil', 1),
('PHP Avanzado y MySQL', 'Evalúa tus conocimientos de PHP avanzado y MySQL', 5, 60, 75, 'Difícil', 1),
('JavaScript Fundamentals', 'Test your knowledge of JavaScript basics', NULL, 45, 70, 'Fácil', 1);

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

-- Agregar intentos de quizzes completados
INSERT INTO quiz_attempts (quiz_id, user_id, score, passed, completed_at) VALUES
(1, 3, 85, 1, '2023-03-10 14:30:00'),
(1, 3, 72, 1, '2023-02-20 10:15:00'),
(2, 3, 65, 0, '2023-04-25 16:45:00'),
(2, 3, 78, 1, '2023-03-15 11:20:00'),
(2, 3, 60, 0, '2023-02-28 09:50:00'),
(4, 3, 92, 1, '2023-04-25 13:10:00'),
(5, 3, 88, 1, '2023-07-05 15:35:00'),
(5, 3, 76, 1, '2023-06-30 14:25:00'),
(6, 3, 82, 1, '2023-05-15 10:50:00');

-- Estadísticas de dashboard para el usuario estudiante
INSERT INTO dashboard_stats (user_id, total_study_hours, completed_quizzes, average_score, courses_in_progress)
VALUES (3, 35.5, 4, 78, 2);
```

Write out the full new code that the AI meant to put in the file src/components/dashboard/StudyHoursChart.tsx, replacing the comments with the actual code.
I want to be able to copy and paste the new code directly into my codebase, so you must write out the full code, leaving no placeholders like "Keep existing code".
Write only the new code for `src/components/dashboard/StudyHoursChart.tsx` and **nothing** else. Expected output format:

```typescript
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format, subWeeks, addDays, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";

// Datos de ejemplo para cursos
const COURSES = [
  { id: 1, name: "Gestión de Proyectos" },
  { id: 2, name: "Metodologías Ágiles" },
  { id: 3, name: "PRINCE2" }
];

interface StudyHoursChartProps {
  data: Array<{ name: string; hours: number }>;
}

// Función para generar datos de semana simulados
const generateWeekData = (weekOffset: number) => {
  const weekStart = startOfWeek(subWeeks(new Date(), weekOffset), { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => {
    const day = addDays(weekStart, i);
    return {
      fullName: format(day, 'EEEE', { locale: es }),
      name: format(day, 'EEEEE', { locale: es }).toUpperCase(),
      date: format(day, 'yyyy-MM-dd'),
      hours: Math.random() * 5 + 0.5
    };
  });
};

const StudyHoursChart = ({ data: initialData }: StudyHoursChartProps) => {
  const [selectedCourse, setSelectedCourse] = useState("1");
  const [selectedWeeks, setSelectedWeeks] = useState<number[]>([0, 1]); // Últimas 2 semanas por defecto
  const [startDate, setStartDate] = useState<Date | undefined>(subWeeks(new Date(), 3));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [weekData, setWeekData] = useState<Record<number, any[]>>({
    0: generateWeekData(0),
    1: generateWeekData(1),
    2: generateWeekData(2),
    3: generateWeekData(3),
  });

  // Colores para las líneas
  const lineColors = ["#3B82F6", "#8B5CF6", "#EC4899", "#10B981"];

  const toggleWeekSelection = (week: number) => {
    if (selectedWeeks.includes(week)) {
      setSelectedWeeks(selectedWeeks.filter(w => w !== week));
    } else if (selectedWeeks.length < 4) {
      setSelectedWeeks([...selectedWeeks, week]);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-2">
          <h3 className="text-lg font-medium">Horas de estudio diarias</h3>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Seleccionar curso" />
              </SelectTrigger>
              <SelectContent>
                {COURSES.map(course => (
                  <SelectItem key={course.id} value={course.id.toString()}>{course.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    {startDate ? format(startDate, 'dd/MM/yyyy') : 'Inicio'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    {endDate ? format(endDate, 'dd/MM/yyyy') : 'Fin'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {[0, 1, 2, 3].map((week) => (
            <Button
              key={week}
              size="sm"
              variant={selectedWeeks.includes(week) ? "default" : "outline"}
              onClick={() => toggleWeekSelection(week)}
            >
              Sem {week + 1}
            </Button>
          ))}
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart margin={{ left: 0, right: 20, top: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                allowDuplicatedCategory={false}
                padding={{ left: 0, right: 0 }}
              />
              <YAxis label={{ value: 'Horas', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                formatter={(value) => [`${value} horas`]}
                labelFormatter={(label) => `${label}`}
              />
              <Legend />
              
              {selectedWeeks.map((week, index) => (
                <Line 
                  key={week}
                  name={`Semana ${week + 1}`}
                  data={weekData[week]}
                  type="linear"
                  dataKey="hours"
                  stroke={lineColors[index % lineColors.length]}
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyHoursChart;
```

Write out the full new code that the AI meant to put in the file src/components/dashboard/ScoreProgressChart.tsx, replacing the comments with the actual code.
I want to be able to copy and paste the new code directly into my codebase, so you must write out the full code, leaving no placeholders like "Keep existing code".
Write only the new code for `src/components/dashboard/ScoreProgressChart.tsx` and **nothing** else. Expected output format:

```typescript
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Datos de ejemplo para cuestionarios
const QUIZZES = [
  { id: 1, name: "PMP Project Management Knowledge Areas" },
  { id: 2, name: "Metodologías Ágiles y Scrum" },
  { id: 3, name: "Fundamentos de PRINCE2" }
];

// Función para generar intentos simulados
const generateAttemptData = (quizId: number) => {
  return Array.from({ length: 7 }, (_, i) => {
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() - (i * 5));
    
    return {
      name: `Intento ${i + 1}`,
      score: Math.floor(Math.random() * 30) + 65,
      date: format(dateObj, 'dd/MM/yyyy')
    };
  }).reverse();
};

interface ScoreProgressChartProps {
  data: Array<{ name: string; score: number }>;
}

import { format } from "date-fns";
import { es } from "date-fns/locale";

const ScoreProgressChart = ({ data: initialData }: ScoreProgressChartProps) => {
  const [selectedQuiz, setSelectedQuiz] = useState("1");
  const [quizData, setQuizData] = useState({
    1: { attempts: generateAttemptData(1), minScore: 70 },
    2: { attempts: generateAttemptData(2), minScore: 75 },
    3: { attempts: generateAttemptData(3), minScore: 80 },
  });

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-2">
          <h3 className="text-lg font-medium">Progreso de puntuación</h3>
          <Select value={selectedQuiz} onValueChange={setSelectedQuiz}>
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Seleccionar cuestionario" />
            </SelectTrigger>
            <SelectContent>
              {QUIZZES.map(quiz => (
                <SelectItem key={quiz.id} value={quiz.id.toString()}>{quiz.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart margin={{ left: 0, right: 20, top: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name"
                label={{ value: 'Intentos', position: 'bottom' }}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={(value, name) => [`${value}%`, 'Puntuación']}
                labelFormatter={(name, payload) => {
                  if (payload && payload.length > 0 && payload[0].payload) {
                    return `Intento ${name} - ${payload[0].payload.date}`;
                  }
                  return `Intento ${name}`;
                }}
              />
              
              {/* Línea base del puntaje mínimo */}
              <ReferenceLine
                y={quizData[parseInt(selectedQuiz)].minScore}
                stroke="#666"
                strokeDasharray="3 3"
                label={{ value: 'Puntaje mínimo', position: 'right' }}
              />
              
              <Line 
                type="linear"
                dataKey="score"
                data={quizData[parseInt(selectedQuiz)].attempts.slice(0, 7)}
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={(props) => {
                  const score = props.payload.score;
                  const minScore = quizData[parseInt(selectedQuiz)].minScore;
                  const diff = Math.abs(score - minScore);
                  let color = '#EF4444'; // rojo
                  
                  if (score >= minScore) {
                    color = diff <= 5 ? '#F59E0B' : '#10B981'; // ambar o verde
                  } else {
                    color = diff <= 5 ? '#F59E0B' : '#EF4444'; // ambar o rojo
                  }
                  
                  return (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={6}
                      fill={color}
                      stroke="none"
                    />
                  );
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreProgressChart;
