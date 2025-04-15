
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Award } from "lucide-react";

export interface Activity {
  id: number;
  type: 'course_progress' | 'quiz_completed' | 'certificate_earned';
  title: string;
  course: string;
  date: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

const RecentActivity = ({ activities }: RecentActivityProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Actividad reciente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0">
              <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                {activity.type === 'course_progress' && <BookOpen size={20} className="text-primary" />}
                {activity.type === 'quiz_completed' && <FileText size={20} className="text-primary" />}
                {activity.type === 'certificate_earned' && <Award size={20} className="text-primary" />}
              </div>
              <div>
                <div className="font-medium">{activity.title}</div>
                <div className="text-sm text-muted-foreground">{activity.course}</div>
                <div className="text-xs text-muted-foreground">{activity.date}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
