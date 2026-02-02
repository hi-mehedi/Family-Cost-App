import React from 'react';
import { LayoutDashboard, ListOrdered, Plus, LogOut, User, Cpu } from 'lucide-react';
import { Tab } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, onLogout }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Premium Header */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center sticky top-0 z-50 glass">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Cpu size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-800 italic tracking-tighter leading-tight">Family Cost</h1>
            <div className="flex items-center gap-1.5">
               <span className="text-[7px] font-black bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded uppercase tracking-widest">v3.0</span>
               <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">By Mehedi Hasan Soumik</p>
            </div>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 px-3 py-2 rounded-xl transition-colors duration-300"
        >
           <LogOut size={16} />
           <span className="text-[10px] font-black uppercase tracking-wider hidden sm:block">Exit</span>
        </button>
      </header>

      {/* Main Scrollable Content */}
      <main className="flex-1 overflow-y-auto hide-scrollbar">
        {children}
      </main>

      {/* Tab Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-100 flex justify-around items-center h-24 px-6 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.04)] glass">
        <button 
          onClick={() => setActiveTab(Tab.STATS)}
          className={`flex flex-col items-center gap-1.5 flex-1 transition-all duration-300 ${activeTab === Tab.STATS ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}
        >
          <div className={`p-2 rounded-xl transition-colors ${activeTab === Tab.STATS ? 'bg-indigo-50' : 'bg-transparent'}`}>
            <LayoutDashboard size={22} />
          </div>
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">Dashboard</span>
        </button>

        <div className="relative -top-8 px-4">
          <button 
            onClick={() => setActiveTab(Tab.ADD)}
            className="bg-indigo-600 text-white w-16 h-16 rounded-[1.75rem] shadow-[0_12px_30px_rgba(79,70,229,0.4)] flex items-center justify-center transform active:scale-90 transition-all duration-300 border-4 border-white"
          >
            <Plus size={32} strokeWidth={3} />
          </button>
        </div>

        <button 
          onClick={() => setActiveTab(Tab.HISTORY)}
          className={`flex flex-col items-center gap-1.5 flex-1 transition-all duration-300 ${activeTab === Tab.HISTORY ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}
        >
          <div className={`p-2 rounded-xl transition-colors ${activeTab === Tab.HISTORY ? 'bg-indigo-50' : 'bg-transparent'}`}>
            <ListOrdered size={22} />
          </div>
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">Records</span>
        </button>
      </nav>
    </div>
  );
};