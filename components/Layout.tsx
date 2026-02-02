
import React from 'react';
import { LayoutDashboard, ListOrdered, Plus, LogOut } from 'lucide-react';
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
      {/* Top Header Bar */}
      <header className="bg-white border-b px-4 py-3 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-black text-slate-800 italic tracking-tighter">Family Cost</h1>
        </div>
        <button 
          onClick={onLogout}
          className="flex items-center gap-1.5 bg-rose-50 text-rose-600 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider"
        >
           <LogOut size={14} />
           Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t flex justify-around items-center h-20 px-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <button 
          onClick={() => setActiveTab(Tab.STATS)}
          className={`flex flex-col items-center gap-1 flex-1 transition-colors ${activeTab === Tab.STATS ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <LayoutDashboard size={24} />
          <span className="text-[9px] font-black uppercase tracking-widest">Stats</span>
        </button>

        <div className="relative -top-6">
          <button 
            onClick={() => setActiveTab(Tab.ADD)}
            className="bg-indigo-600 text-white w-14 h-14 rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center justify-center transform active:scale-90 transition-transform"
          >
            <Plus size={32} strokeWidth={3} />
          </button>
        </div>

        <button 
          onClick={() => setActiveTab(Tab.HISTORY)}
          className={`flex flex-col items-center gap-1 flex-1 transition-colors ${activeTab === Tab.HISTORY ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <ListOrdered size={24} />
          <span className="text-[9px] font-black uppercase tracking-widest">History</span>
        </button>
      </nav>
    </div>
  );
};
