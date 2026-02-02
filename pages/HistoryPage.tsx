import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, FileText, Calendar, Edit3, Database } from 'lucide-react';
import { DailyLog } from '../types';

interface HistoryPageProps {
  logs: DailyLog[];
  onEdit: (log: DailyLog) => void;
}

const HistoryPage: React.FC<HistoryPageProps> = ({ logs, onEdit }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getDayName = (dateStr: string) => {
    return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date(dateStr));
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return {
      day: d.getDate(),
      month: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(d).toUpperCase()
    };
  };

  return (
    <div className="pb-10">
      <div className="bg-indigo-600 px-6 py-10 relative overflow-hidden">
        <h2 className="text-2xl font-black text-white italic">FAMILY COST</h2>
        <p className="text-indigo-200 text-xs font-medium mt-1 uppercase tracking-widest">ID: bos123</p>
        <div className="absolute top-10 right-6">
          <div className="bg-slate-900/40 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 uppercase backdrop-blur-sm">
            <Database size={10} />
            Offline
          </div>
        </div>
      </div>

      <div className="px-4 -mt-6">
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 mb-6">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Search size={20} />
             </div>
             <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">History Lookup</h3>
          </div>
          <div className="flex gap-3">
            <select className="flex-1 appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-bold focus:outline-none">
              <option>February 2026</option>
            </select>
            <button className="bg-indigo-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 font-bold text-sm">
              <FileText size={18} />
              CSV
            </button>
          </div>
        </div>

        <p className="text-[10px] font-black text-slate-400 mb-4 uppercase tracking-widest">{logs.length} Records Found</p>

        <div className="space-y-4">
          {logs.length === 0 ? (
            <div className="text-center py-20">
               <Calendar size={48} className="mx-auto text-slate-200 mb-4" />
               <p className="text-slate-400 font-bold uppercase text-xs">No records saved locally</p>
            </div>
          ) : logs.map((log) => {
            const isExpanded = expandedId === log.id;
            const dayParts = formatDate(log.date);
            const totalIncome = log.unitLogs.reduce((acc, curr) => acc + curr.income, 0);
            const totalCost = log.unitLogs.reduce((acc, curr) => acc + curr.cost, 0) + 
                             log.bazarItems.reduce((acc, curr) => acc + curr.price, 0);
            const balance = totalIncome - totalCost;

            return (
              <div key={log.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div 
                  onClick={() => setExpandedId(isExpanded ? null : log.id)}
                  className="p-5 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl w-14 h-14 flex flex-col items-center justify-center">
                       <span className="text-[9px] font-bold text-slate-400 uppercase leading-none mb-1">{dayParts.month}</span>
                       <span className="text-xl font-black text-slate-700 leading-none">{dayParts.day}</span>
                    </div>
                    <div>
                       <h4 className="font-bold text-slate-800">{getDayName(log.date)}</h4>
                       <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-bold text-emerald-600 uppercase">In: {totalIncome.toLocaleString()}</span>
                          <span className="text-[10px] font-bold text-rose-600 uppercase">Out: {totalCost.toLocaleString()}</span>
                       </div>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Balance</span>
                      <span className="text-sm font-black text-indigo-600">TK {balance.toLocaleString()}</span>
                    </div>
                    {isExpanded ? <ChevronUp size={20} className="text-slate-300" /> : <ChevronDown size={20} className="text-slate-300" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-slate-50 pt-4">
                    <div className="mb-6">
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Unit Breakdown</h5>
                      <div className="space-y-4">
                        {log.unitLogs.map((u, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <span className="text-sm font-bold text-slate-700">{u.unitName}</span>
                            <div className="flex gap-6">
                              <div className="text-center">
                                <span className="block text-[8px] font-bold text-emerald-600 uppercase">In</span>
                                <span className="text-xs font-bold text-slate-700">{u.income}</span>
                              </div>
                              <div className="text-center">
                                <span className="block text-[8px] font-bold text-rose-600 uppercase">Out</span>
                                <span className="text-xs font-bold text-slate-700">{u.cost}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Daily Bazar</h5>
                      {log.bazarItems.length > 0 ? (
                        <div className="space-y-2">
                           {log.bazarItems.map((item) => (
                             <div key={item.id} className="flex justify-between text-sm">
                               <span className="text-slate-600">{item.name}</span>
                               <span className="font-bold text-slate-800">TK {item.price}</span>
                             </div>
                           ))}
                        </div>
                      ) : (
                        <div className="bg-slate-50 rounded-xl p-4 text-center">
                          <p className="text-[11px] font-medium text-slate-400 italic">No items recorded.</p>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(log);
                      }}
                      className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 uppercase text-xs tracking-wider"
                    >
                       <Edit3 size={16} />
                       Update Record
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;