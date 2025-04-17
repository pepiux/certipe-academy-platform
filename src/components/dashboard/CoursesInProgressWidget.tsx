
import ExpandableWidget from "./ExpandableWidget";
import { BookOpen } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface CourseProgress {
  id: number;
  title: string;
  progress: number;
  duration_hours: number;
}

interface CoursesInProgressWidgetProps {
  total: number;
  courses: CourseProgress[];
}

const CoursesInProgressWidget = ({ total, courses }: CoursesInProgressWidgetProps) => {
  return (
    <ExpandableWidget
      title="Cursos en progreso"
      value={total}
      subtitle="Cursos activos"
      icon={BookOpen}
      iconColor="text-amber-600"
      iconBgColor="bg-amber-100"
    >
      <ul className="space-y-3">
        {courses.map((course) => (
          <li key={course.id} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{course.title}</span>
              <span className="font-medium">{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-1.5" />
            <div className="text-xs text-right text-muted-foreground">
              {course.duration_hours} horas
            </div>
          </li>
        ))}
      </ul>
    </ExpandableWidget>
  );
};

export default CoursesInProgressWidget;
