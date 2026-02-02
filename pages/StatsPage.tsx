
import React from 'react';
import { Calendar, TrendingUp, TrendingDown, ShoppingBasket, Wallet, ChevronRight, LayoutGrid, List, Database } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { DailyLog } from '../types';

interface StatsPageProps {
  stats: {
    todayIncome: number;
    todayCost: number;
    // Fix: Removed duplicate 'monthlyIncome' property
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
        income += uLog.income;
        cost += uLog.cost;
      }
    });
    return { income, cost, net: income - cost };
  };

  const bazarByDate = logs
    .filter(log => log.bazarItems.length > 0)
    .map(log => ({
      date: log.date,
      total: log.bazarItems.reduce((sum, item) => sum + item.price, 0)
    }))
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="pb-10">
      {/* Banner Section */}
      <div className="bg-indigo-600 px-6 py-10 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-black text-white italic">FAMILY COST</h2>
          <p className="text-indigo-200 text-xs font-medium mt-1 uppercase tracking-widest">ID: bos123</p>
        </div>
        <div className="absolute top-10 right-6 z-10">
          <div className="bg-slate-900/40 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 uppercase backdrop-blur-sm">
            <Database size={10} />
            Offline
          </div>
        </div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500 rounded-full opacity-20"></div>
      </div>

      <div className="px-4 -mt-6 space-y-4">
        {/* Monthly View Header */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <Calendar size={24} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 uppercase">Monthly Report Summary</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Total sum of 1-30 days</p>
            </div>
          </div>
          
          <div className="relative">
            <select className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
              <option>February 2026</option>
              <option>January 2026</option>
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
               <ChevronRight className="rotate-90" size={20} />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard title="Today Income" value={stats.todayIncome} icon={<Calendar size={18} />} iconBg="bg-emerald-50 text-emerald-500" valueColor="text-emerald-600" />
          <StatCard title="Today Cost" value={stats.todayCost} icon={<Calendar size={18} />} iconBg="bg-rose-50 text-rose-500" valueColor="text-rose-600" />
          <StatCard title="Monthly Income" value={stats.monthlyIncome} icon={<TrendingUp size={18} />} iconBg="bg-emerald-50 text-emerald-500" valueColor="text-emerald-600" />
          <StatCard title="Monthly Cost" value={stats.monthlyCost} icon={<TrendingDown size={18} />} iconBg="bg-rose-50 text-rose-500" valueColor="text-rose-600" />
          <StatCard title="Monthly Bazar" value={stats.monthlyBazar} icon={<ShoppingBasket size={18} />} iconBg="bg-orange-50 text-orange-500" valueColor="text-orange-600" />
          <StatCard title="Month Balance" value={stats.monthBalance} icon={<Wallet size={18} />} iconBg="bg-indigo-50 text-indigo-500" valueColor="text-indigo-600" />
        </div>

        {/* Units Monthly All Report */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
              <LayoutGrid size={20} />
            </div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Monthly Unit Sums (1-30)</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {units.map((unit) => {
              const { income, cost, net } = getUnitTotals(unit);
              return (
                <div 
                  key={unit} 
                  onClick={() => onUnitClick(unit)}
                  className="relative p-4 rounded-2xl border border-slate-100 bg-white hover:border-indigo-300 transition-all cursor-pointer shadow-sm"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black text-indigo-700 uppercase tracking-tighter truncate pr-2">{unit}</span>
                    <ChevronRight size={14} className="text-slate-300" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-bold text-slate-500 uppercase">Income</span>
                      <span className="text-[11px] font-bold text-emerald-600">{income.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-bold text-slate-500 uppercase">Cost</span>
                      <span className="text-[11px] font-bold text-rose-600">{cost.toLocaleString()}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex justify-between items-center mt-1">
                      <span className="text-[9px] font-black text-slate-500 uppercase">Net</span>
                      <span className={`text-[11px] font-black ${net >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>
                        {net.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Date Wise Bazar Breakdown */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <List size={20} />
            </div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Bazar Date Wise Report</h3>
          </div>

          <div className="space-y-3">
            {bazarByDate.length > 0 ? bazarByDate.map((b, idx) => (
              <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <span className="block text-[10px] font-bold text-slate-500 uppercase">{b.date}</span>
                  <span className="text-xs font-black text-slate-900">Daily Bazar Total</span>
                </div>
                <span className="text-sm font-black text-rose-600">TK {b.total.toLocaleString()}</span>
              </div>
            )) : (
              <div className="text-center py-6 text-slate-400 text-xs font-bold uppercase">No bazar records found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
