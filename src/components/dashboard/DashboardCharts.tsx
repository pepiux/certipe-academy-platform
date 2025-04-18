
import React from 'react';
import StudyHoursChart from "./StudyHoursChart";
import ScoreProgressChart from "./ScoreProgressChart";

interface DashboardChartsProps {
  studyHoursData: Array<{ name: string; hours: number }>;
  scoreProgressData: Array<{ name: string; score: number }>;
}

const DashboardCharts = ({ studyHoursData, scoreProgressData }: DashboardChartsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <StudyHoursChart data={studyHoursData} />
      <ScoreProgressChart data={scoreProgressData} />
    </div>
  );
};

export default DashboardCharts;
