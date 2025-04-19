
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
  infoTooltip?: string;
}

const CompletedQuizzesWidget = ({ total, quizzes, infoTooltip }: CompletedQuizzesWidgetProps) => {
  return (
    <ExpandableWidget
      title="Cuestionarios completados"
      value={total.toString()}
      icon={FileQuestion}
      iconColor="text-purple-600"
      iconBgColor="bg-purple-100"
    >
      {quizzes && quizzes.length > 0 ? (
        <ul className="space-y-2">
          {quizzes.map((quiz) => (
            <li key={quiz.id} className="grid grid-cols-12 gap-2 text-sm">
              <div className="col-span-8">
                <p>{quiz.title}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(quiz.completed_date), 'dd/MM/yyyy', { locale: es })}
                </p>
              </div>
              <div className="col-span-4 flex justify-end items-center">
                <span className={`font-medium ${quiz.score >= 70 ? 'text-green-600' : 'text-amber-600'}`}>
                  {quiz.score}%
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-2 text-sm text-muted-foreground">
          No hay cuestionarios completados
        </div>
      )}
    </ExpandableWidget>
  );
};

export default CompletedQuizzesWidget;
