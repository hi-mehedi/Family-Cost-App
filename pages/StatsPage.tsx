import React from 'react';
import { Calendar, TrendingUp, TrendingDown, ShoppingBasket, Wallet, ChevronRight, LayoutGrid, List, Cloud, ArrowUpRight, ArrowDownRight } from 'lucide-react';
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
  };
  units: string[];
  logs: DailyLog[];
  onUnitClick: (unitName: string) => void;
}

const StatsPage: React.FC<StatsPageProps> = ({ stats, units, logs, onUnitClick }) => {
  
  const getUnitTotals = (unitName: string) => {
    let income = 0;
    let cost = 0;
    logs.forEach(log => {
      const uLog = log.unitLogs.find(ul => ul.unitName === unitName);
      if (uLog) {
        income += (uLog.income || 0);
        cost += (uLog.cost || 0);
      }
    });
    return { income, cost, net: income - cost };
  };

  const bazarByDate = logs
    .filter(log => log.bazarItems && log.bazarItems.length > 0)
    .map(log => ({
      date: log.date,
      total: log.bazarItems.reduce((sum, item) => sum + (item.price || 0), 0)
    }))
    .sort((a, b) => b.date.localeCompare(a.date));

  const currentMonth = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date());

  return (
    <div className="pb-12 bg-slate-50">
      {/* Dynamic Header Section */}
      <div className="bg-indigo-600 px-6 pt-10 pb-16 relative overflow-hidden">
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-black text-white italic tracking-tighter flex items-center gap-2">
              DASHBOARD
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-[0.2em]">Active Cloud Node: BOS-01</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20">
             <LayoutGrid size={20} className="text-white" />
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
                 <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Net Capital Balance</span>
                 <div className="bg-slate-800 px-3 py-1 rounded-full flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    <span className="text-[9px] font-bold text-slate-300 uppercase">{currentMonth}</span>
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
                       <span className="text-[9px] font-bold text-slate-400 uppercase">Monthly In</span>
                    </div>
                    <span className="text-lg font-black text-white">TK {stats.monthlyIncome.toLocaleString()}</span>
                 </div>
                 <div className="bg-slate-800/50 rounded-3xl p-4 border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-2">
                       <ArrowDownRight size={14} className="text-rose-400" />
                       <span className="text-[9px] font-bold text-slate-400 uppercase">Monthly Out</span>
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
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">Daily Quick Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <StatCard title="Today Income" value={stats.todayIncome} icon={<TrendingUp size={18} />} iconBg="bg-emerald-50 text-emerald-600" valueColor="text-emerald-600" />
            <StatCard title="Today Cost" value={stats.todayCost} icon={<TrendingDown size={18} />} iconBg="bg-rose-50 text-rose-600" valueColor="text-rose-600" />
            <StatCard title="Monthly Bazar" value={stats.monthlyBazar} icon={<ShoppingBasket size={18} />} iconBg="bg-orange-50 text-orange-600" valueColor="text-orange-600" />
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
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Unit Summaries</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase">Real-time Node Status</p>
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
                       <span className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Net Profit</span>
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

        {/* Recent Bazar List */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 mb-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-2xl">
              <List size={20} />
            </div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Recent Bazar Activity</h3>
          </div>

          <div className="space-y-4">
            {bazarByDate.length > 0 ? bazarByDate.slice(0, 5).map((b, idx) => (
              <div key={idx} className="flex justify-between items-center p-5 bg-slate-50/50 rounded-3xl border border-slate-100/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex flex-col items-center justify-center">
                    <span className="text-[8px] font-black text-slate-400 uppercase">{b.date.split('-')[1]}</span>
                    <span className="text-xs font-black text-slate-700">{b.date.split('-')[2]}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-black text-slate-500 uppercase">{b.date}</span>
                    <span className="text-xs font-bold text-slate-900">Total Purchase</span>
                  </div>
                </div>
                <span className="text-sm font-black text-rose-600 tabular-nums">TK {b.total.toLocaleString()}</span>
              </div>
            )) : (
              <div className="text-center py-10">
                 <ShoppingBasket size={32} className="mx-auto text-slate-200 mb-3" />
                 <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">No Bazar Data Records</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;