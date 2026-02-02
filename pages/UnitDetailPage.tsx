
import React, { useMemo } from 'react';
import { X, Truck, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { DailyLog } from '../types';

interface UnitDetailPageProps {
  unitName: string;
  logs: DailyLog[];
  onBack: () => void;
}

const UnitDetailPage: React.FC<UnitDetailPageProps> = ({ unitName, logs, onBack }) => {
  
  const unitStats = useMemo(() => {
    let income = 0;
    let cost = 0;
    const history: any[] = [];

    // Filter logs for this unit and sort chronological for chart
    const sortedLogs = [...logs].sort((a, b) => a.date.localeCompare(b.date));

    sortedLogs.forEach(log => {
      const uLog = log.unitLogs.find(ul => ul.unitName === unitName);
      if (uLog) {
        income += uLog.income;
        cost += uLog.cost;
        history.push({
          date: new Date(log.date).getDate(),
          rawDate: log.date,
          income: uLog.income,
          cost: uLog.cost,
          net: uLog.income - uLog.cost
        });
      }
    });

    return { income, cost, net: income - cost, history };
  }, [logs, unitName]);

  const monthYearLabel = "February 2026"; 

  return (
    <div className="pb-10 min-h-screen bg-slate-50">
      <div className="px-4 pt-6 space-y-6">
        {/* Header Card with Totals */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative">
          <button 
            onClick={onBack}
            className="absolute top-6 right-6 p-2 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X size={24} />
          </button>

          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-indigo-600 text-white rounded-3xl shadow-lg shadow-indigo-600/20">
              <Truck size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">{unitName}</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monthly Summary Report</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 mb-8">
            <div className="flex justify-between items-center mb-4">
               <span className="text-[10px] font-black text-slate-400 uppercase">Monthly Period</span>
               <span className="text-[11px] font-bold text-indigo-600 uppercase">{monthYearLabel}</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <span className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Total In</span>
                <span className="text-lg font-black text-emerald-600">{unitStats.income.toLocaleString()}</span>
              </div>
              <div className="text-center border-x border-slate-200">
                <span className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Total Out</span>
                <span className="text-lg font-black text-rose-600">{unitStats.cost.toLocaleString()}</span>
              </div>
              <div className="text-center">
                <span className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Net Sum</span>
                <span className="text-lg font-black text-indigo-600">{unitStats.net.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Daily Logs (1-30 days)</h3>
          
          <div className="space-y-3">
             {unitStats.history.length > 0 ? unitStats.history.slice().reverse().map((h, i) => (
               <div key={i} className="flex items-center justify-between bg-white border border-slate-100 p-4 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-50 border border-slate-100 w-12 h-12 rounded-xl flex flex-col items-center justify-center">
                       <span className="text-[8px] font-bold text-slate-400 uppercase">FEB</span>
                       <span className="text-lg font-black text-slate-700">{h.date}</span>
                    </div>
                    <div className="flex gap-4">
                       <div>
                         <span className="block text-[8px] font-bold text-emerald-600 uppercase">In</span>
                         <span className="text-sm font-bold text-slate-700">{h.income.toLocaleString()}</span>
                       </div>
                       <div>
                         <span className="block text-[8px] font-bold text-rose-600 uppercase">Out</span>
                         <span className="text-sm font-bold text-slate-700">{h.cost.toLocaleString()}</span>
                       </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-[8px] font-bold text-slate-400 uppercase">Net</span>
                    <span className={`text-sm font-black ${h.net >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>{h.net.toLocaleString()}</span>
                  </div>
               </div>
             )) : (
               <div className="text-center py-6 text-slate-400 text-[10px] uppercase font-bold">No history available</div>
             )}
          </div>
        </div>

        {/* Trend Section */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-8">
            <BarChart2 size={20} className="text-indigo-600" />
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Profit Trend Analysis</h3>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={unitStats.history}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                />
                <Bar dataKey="net" radius={[4, 4, 0, 0]}>
                  {unitStats.history.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.net >= 0 ? '#10b981' : '#f43f5e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitDetailPage;
