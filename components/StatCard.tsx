
import React from 'react';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
  valueColor: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, iconBg, valueColor }) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
      <div className={`p-2.5 rounded-xl ${iconBg}`}>
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className="flex items-baseline gap-1">
          <span className={`text-xs font-bold ${valueColor}`}>TK</span>
          <span className={`text-lg font-bold ${valueColor}`}>{value.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
