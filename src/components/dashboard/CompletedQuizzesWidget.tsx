
import ExpandableWidget from "./ExpandableWidget";
import { FileQuestion } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface CompletedQuiz {
  id: number;
  title: string;
  completed_date: string;
  score: number;
}

interface CompletedQuizzesWidgetProps {
  total: number;
  quizzes: CompletedQuiz[];
}

const CompletedQuizzesWidget = ({ total, quizzes }: CompletedQuizzesWidgetProps) => {
  return (
    <ExpandableWidget
      title="Cuestionarios completados"
      value={total}
      subtitle="Cuestionarios completados"
      icon={FileQuestion}
      iconColor="text-purple-600"
      iconBgColor="bg-purple-100"
    >
      <ul className="space-y-2">
        {quizzes.map((quiz) => (
          <li key={quiz.id} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{quiz.title}</span>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">
                {format(new Date(quiz.completed_date), 'dd/MM/yyyy', { locale: es })}
              </span>
              <span className={`font-medium ${quiz.score >= 70 ? 'text-green-600' : 'text-amber-600'}`}>
                {quiz.score}%
              </span>
            </div>
          </li>
        ))}
      </ul>
    </ExpandableWidget>
  );
};

export default CompletedQuizzesWidget;
