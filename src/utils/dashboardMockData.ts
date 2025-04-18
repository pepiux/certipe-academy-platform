// Datos mock para gráficos del dashboard
export const studyHoursData = [
  { date: '2023-05-08', hours: 2.5 }, // Lunes
  { date: '2023-05-09', hours: 1.8 }, // Martes
  { date: '2023-05-10', hours: 3.2 }, // Miércoles
  { date: '2023-05-11', hours: 2.0 }, // Jueves
  { date: '2023-05-12', hours: 2.8 }, // Viernes
  { date: '2023-05-13', hours: 4.5 }, // Sábado
  { date: '2023-05-14', hours: 3.6 }, // Domingo
];

export const scoreProgressData = [
  { date: '2023-04-08', score: 65 },
  { date: '2023-04-15', score: 68 },
  { date: '2023-04-22', score: 72 },
  { date: '2023-04-29', score: 78 },
  { date: '2023-05-06', score: 82 },
  { date: '2023-05-13', score: 78 },
  { date: '2023-05-20', score: 85 },
];

export const recentQuiz = {
  title: "PMP Project Management Knowledge Areas",
  score: 78,
  total: 100,
  correct: 39,
  incorrect: 11,
  date: "May 15, 2023",
  timeSpent: "45 minutes"
};

// Data for courses including favorites
export const coursesData = [
  {
    id: 1,
    title: "Fundamentos de Gestión de Proyectos",
    progress: 65,
    image: "https://placehold.co/300x200?text=Gestión+de+Proyectos",
    favorite: true
  },
  {
    id: 2,
    title: "Metodologías Ágiles",
    progress: 30,
    image: "https://placehold.co/300x200?text=Metodologías+Ágiles",
    favorite: false
  },
  {
    id: 3,
    title: "PRINCE2 Framework",
    progress: 15,
    image: "https://placehold.co/300x200?text=PRINCE2",
    favorite: true
  }
];
