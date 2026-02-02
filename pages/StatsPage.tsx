import React from 'react';
import { Calendar, TrendingUp, TrendingDown, ShoppingBasket, Wallet, ChevronRight, LayoutGrid, List, Cloud, ArrowUpRight, ArrowDownRight, User, ReceiptText } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { DailyLog } from '../types';

interface StatsPageProps {
  stats: {
    todayIncome: number;
    todayCost: number;
    monthlyIncome: number;
    monthlyCost: number;
    monthlyBazar: number;
    monthBalance: number;
    filteredLogs: DailyLog[];
  };
  units: string[];
  logs: DailyLog[];
  onUnitClick: (unitName: string) => void;
  viewingMonth: number;
  viewingYear: number;
  setViewingMonth: (month: number) => void;
  setViewingYear: (year: number) => void;
}

const StatsPage: React.FC<StatsPageProps> = ({ 
  stats, 
  units, 
  logs, 
  onUnitClick,
  viewingMonth,
  viewingYear,
  setViewingMonth,
  setViewingYear
}) => {
  
  const getUnitTotals = (unitName: string) => {
    let income = 0;
    let cost = 0;
    stats.filteredLogs.forEach(log => {
      const uLog = log.unitLogs.find(ul => ul.unitName === unitName);
      if (uLog) {
        income += (uLog.income || 0);
        cost += (uLog.cost || 0);
      }
    });
    return { income, cost, net: income - cost };
  };

  // Filter logs that actually have bazar items and sort by date descending
  const logsWithBazar = stats.filteredLogs
    .filter(log => log.bazarItems && log.bazarItems.length > 0)
    .sort((a, b) => b.date.localeCompare(a.date));

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="pb-24 bg-slate-50">
      {/* Dynamic Header Section */}
      <div className="bg-indigo-600 px-6 pt-10 pb-16 relative overflow-hidden">
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-black text-white italic tracking-tighter flex items-center gap-2">
              DASHBOARD
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-[0.2em]">Live Financial Node</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <select 
              value={viewingMonth} 
              onChange={(e) => setViewingMonth(parseInt(e.target.value))}
              className="bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-xl border border-white/20 focus:outline-none appearance-none cursor-pointer"
            >
              {monthNames.map((name, idx) => (
                <option key={name} value={idx} className="text-slate-900">{name}</option>
              ))}
            </select>
            <select 
              value={viewingYear} 
              onChange={(e) => setViewingYear(parseInt(e.target.value))}
              className="bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-xl border border-white/20 focus:outline-none appearance-none cursor-pointer"
            >
              {years.map(y => (
                <option key={y} value={y} className="text-slate-900">{y}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Abstract Background Shapes */}
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/30 rounded-full blur-3xl"></div>
      </div>

      <div className="px-5 -mt-8 space-y-6">
        {/* Balance Overview Card */}
        <div className="bg-slate-900 rounded-[2.5rem] p-6 shadow-2xl shadow-indigo-200 relative overflow-hidden border border-slate-800">
           <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                 <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Net Monthly Balance</span>
                 <div className="bg-slate-800 px-3 py-1 rounded-full flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    <span className="text-[9px] font-bold text-slate-300 uppercase">{monthNames[viewingMonth]} {viewingYear}</span>
                 </div>
              </div>
              <div className="flex items-baseline gap-2 mb-8">
                 <span className="text-xl font-bold text-indigo-500">TK</span>
                 <h1 className="text-4xl font-black text-white tracking-tight tabular-nums">
                    {stats.monthBalance.toLocaleString()}
                 </h1>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-800/50 rounded-3xl p-4 border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-2">
                       <ArrowUpRight size={14} className="text-emerald-400" />
                       <span className="text-[9px] font-bold text-slate-400 uppercase">Total In</span>
                    </div>
                    <span className="text-lg font-black text-white">TK {stats.monthlyIncome.toLocaleString()}</span>
                 </div>
                 <div className="bg-slate-800/50 rounded-3xl p-4 border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-2">
                       <ArrowDownRight size={14} className="text-rose-400" />
                       <span className="text-[9px] font-bold text-slate-400 uppercase">Total Out</span>
                    </div>
                    <span className="text-lg font-black text-white">TK {stats.monthlyCost.toLocaleString()}</span>
                 </div>
              </div>
           </div>
           {/* Decorative elements */}
           <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl"></div>
        </div>

        {/* Stats Grid */}
        <div>
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">Daily Quick Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <StatCard title="Today Income" value={stats.todayIncome} icon={<TrendingUp size={18} />} iconBg="bg-emerald-50 text-emerald-600" valueColor="text-emerald-600" />
            <StatCard title="Today Cost" value={stats.todayCost} icon={<TrendingDown size={18} />} iconBg="bg-rose-50 text-rose-600" valueColor="text-rose-600" />
            <StatCard title="Bazar Total" value={stats.monthlyBazar} icon={<ShoppingBasket size={18} />} iconBg="bg-orange-50 text-orange-600" valueColor="text-orange-600" />
            <StatCard title="Remaining" value={stats.monthBalance} icon={<Wallet size={18} />} iconBg="bg-indigo-50 text-indigo-600" valueColor="text-indigo-600" />
          </div>
        </div>

        {/* Units Section */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
                <LayoutGrid size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Unit Fleet Breakdown</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase">Filtered for {monthNames[viewingMonth]}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {units.map((unit) => {
              const { income, cost, net } = getUnitTotals(unit);
              return (
                <button 
                  key={unit} 
                  onClick={() => onUnitClick(unit)}
                  className="group flex items-center justify-between p-5 rounded-3xl border border-slate-100 bg-white hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 text-left"
                >
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-colors ${net >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {unit.charAt(0)}
                    </div>
                    <div className="truncate">
                      <span className="block text-sm font-black text-slate-800 uppercase truncate">{unit}</span>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">+{income.toLocaleString()}</span>
                        <span className="text-[9px] font-bold text-rose-500 uppercase tracking-tighter">-{cost.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                       <span className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Profit</span>
                       <span className={`text-sm font-black tabular-nums ${net >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>
                          {net >= 0 ? '+' : ''}{net.toLocaleString()}
                       </span>
                    </div>
                    <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Date-Wise Bazar List */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-2xl">
                <ReceiptText size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Monthly Bazar Log</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase">Itemized Detail View</p>
              </div>
            </div>
            <div className="bg-rose-600 text-white px-3 py-1.5 rounded-2xl text-[10px] font-black uppercase shadow-lg shadow-rose-200">
              TK {stats.monthlyBazar.toLocaleString()}
            </div>
          </div>

          <div className="space-y-6">
            {logsWithBazar.length > 0 ? logsWithBazar.map((log) => {
              const dayTotal = log.bazarItems.reduce((sum, item) => sum + (item.price || 0), 0);
              const dateParts = log.date.split('-');
              
              return (
                <div key={log.id} className="group">
                  {/* Date Header */}
                  <div className="flex items-center gap-4 mb-3 px-2">
                    <div className="flex flex-col items-center justify-center w-10 h-10 rounded-xl bg-slate-900 text-white shadow-sm">
                      <span className="text-[7px] font-black uppercase leading-none mb-0.5">{monthNames[parseInt(dateParts[1]) - 1].substring(0, 3)}</span>
                      <span className="text-sm font-black leading-none">{dateParts[2]}</span>
                    </div>
                    <div className="flex-1 border-b border-slate-100 pb-2 flex justify-between items-end">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{log.date}</span>
                      <span className="text-xs font-black text-slate-900 tabular-nums">TK {dayTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="ml-14 space-y-2">
                    {log.bazarItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2 px-4 bg-slate-50 rounded-2xl border border-slate-100/50 group-hover:bg-white transition-colors">
                        <span className="text-[11px] font-black text-slate-700 uppercase tracking-tighter">{item.name}</span>
                        <span className="text-[10px] font-bold text-rose-600 tabular-nums">TK {item.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-16">
                 <ShoppingBasket size={48} className="mx-auto text-slate-100 mb-4" />
                 <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">No Bazar Items Recorded</p>
              </div>
            )}
          </div>
        </div>

        {/* Developed By Footer */}
        <div className="pt-8 pb-4 text-center">
            <div className="inline-flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <div className="w-6 h-6 bg-slate-800 rounded-lg flex items-center justify-center text-white">
                        <User size={14} />
                    </div>
                    <span className="text-[9px] font-black text-slate-800 uppercase tracking-widest">Mehedi Hasan Soumik</span>
                </div>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.3em]">SQA Engineer</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;