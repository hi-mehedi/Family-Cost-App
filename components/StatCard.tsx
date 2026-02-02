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
    <div className="bg-white p-5 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50 flex flex-col justify-between group hover:border-indigo-100 transition-all duration-300">
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${iconBg}`}>
        {icon}
      </div>
      <div>
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">
          {title}
        </span>
        <div className="flex items-baseline gap-1">
          <span className={`text-[10px] font-black ${valueColor} opacity-70`}>TK</span>
          <span className={`text-xl font-black ${valueColor} tabular-nums tracking-tighter`}>
            {value.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};