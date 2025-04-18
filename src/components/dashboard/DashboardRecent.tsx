
import React from 'react';
import RecentQuiz from "./RecentQuiz";
import RecentActivity from "./RecentActivity";
import { Activity } from "./RecentActivity";

interface DashboardRecentProps {
  recentQuiz: {
    title: string;
    score: number;
    total: number;
    correct: number;
    incorrect: number;
    date: string;
    timeSpent: string;
  };
  recentActivities: Activity[];
}

const DashboardRecent = ({ recentQuiz, recentActivities }: DashboardRecentProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <RecentQuiz quiz={recentQuiz} />
      <RecentActivity activities={recentActivities} />
    </div>
  );
};

export default DashboardRecent;
