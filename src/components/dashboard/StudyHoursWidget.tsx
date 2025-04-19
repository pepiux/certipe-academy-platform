
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
  infoTooltip?: string; // Keep in props but not pass it to ExpandableWidget
}

const StudyHoursWidget = ({ total, byCourse, infoTooltip }: StudyHoursWidgetProps) => {
  return (
    <ExpandableWidget
      title="Horas de estudio"
      value={total.toFixed(1)}
      icon={Clock}
      iconColor="text-blue-600"
      iconBgColor="bg-blue-100"
    >
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Cursos</h4>
          <ul className="space-y-2">
            {byCourse.map((course) => (
              <li key={course.id} className="grid grid-cols-12 gap-2 text-sm">
                <div className="col-span-8">
                  <p>{course.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {course.completed_date ? 
                      format(new Date(course.completed_date), 'dd/MM/yyyy', { locale: es }) : 
                      'En progreso'}
                  </p>
                </div>
                <div className="col-span-4 flex justify-end items-center">
                  <span className="font-medium">{course.hours}h</span>
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
