
import ExpandableWidget from "./ExpandableWidget";
import { Clock } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface StudyHour {
  id: number;
  title: string;
  hours: number;
  completed_date: string | null;
}

interface StudyHoursWidgetProps {
  total: number;
  byCourse: StudyHour[];
  byQuiz: StudyHour[];
}

const StudyHoursWidget = ({ total, byCourse, byQuiz }: StudyHoursWidgetProps) => {
  return (
    <ExpandableWidget
      title="Horas de estudio"
      value={total.toFixed(1)}
      subtitle="Horas totales"
      icon={Clock}
      iconColor="text-blue-600"
      iconBgColor="bg-blue-100"
    >
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Cursos</h4>
          <ul className="space-y-2">
            {byCourse.map((course) => (
              <li key={course.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{course.title}</span>
                <div className="flex items-center gap-4">
                  {course.completed_date && (
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(course.completed_date), 'dd/MM/yyyy', { locale: es })}
                    </span>
                  )}
                  <span className="font-medium">{course.hours}h</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Cuestionarios</h4>
          <ul className="space-y-2">
            {byQuiz.map((quiz) => (
              <li key={quiz.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{quiz.title}</span>
                <div className="flex items-center gap-4">
                  {quiz.completed_date && (
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(quiz.completed_date), 'dd/MM/yyyy', { locale: es })}
                    </span>
                  )}
                  <span className="font-medium">{quiz.hours.toFixed(2)}h</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ExpandableWidget>
  );
};

export default StudyHoursWidget;
