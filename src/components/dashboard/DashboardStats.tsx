
import React from 'react';
import type { DashboardStats as DashboardStatsType } from '@/services/dashboardService';
import StudyHoursWidget from "./StudyHoursWidget";
import CompletedQuizzesWidget from "./CompletedQuizzesWidget";
import AverageScoreWidget from "./AverageScoreWidget";
import CoursesInProgressWidget from "./CoursesInProgressWidget";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStatsProps {
  loading: boolean;
  stats: DashboardStatsType | null;
}

const DashboardStats = ({ loading, stats }: DashboardStatsProps) => {
  // Use empty stats object when data is not available
  const displayStats = stats || {
    study_hours: { total: 0, by_course: [], by_quiz: [] },
    completed_quizzes: { total: 0, quizzes: [] },
    average_scores: { overall: 0, by_quiz: [] },
    courses_in_progress: { total: 0, courses: [] }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="bg-muted/40 h-[120px] rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StudyHoursWidget 
        total={displayStats.study_hours.total} 
        byCourse={displayStats.study_hours.by_course}
        byQuiz={displayStats.study_hours.by_quiz}
      />
      <CompletedQuizzesWidget 
        total={displayStats.completed_quizzes.total} 
        quizzes={displayStats.completed_quizzes.quizzes}
      />
      <AverageScoreWidget 
        overall={displayStats.average_scores.overall}
        quizzes={displayStats.average_scores.by_quiz}
      />
      <CoursesInProgressWidget 
        total={displayStats.courses_in_progress.total}
        courses={displayStats.courses_in_progress.courses}
      />
    </div>
  );
};

export default DashboardStats;
