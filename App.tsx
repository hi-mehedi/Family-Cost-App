import React, { useState, useMemo, useEffect } from 'react';
import { Tab, DailyLog } from './types';
import { INITIAL_UNITS } from './constants';
import StatsPage from './pages/StatsPage';
import HistoryPage from './pages/HistoryPage';
import AddLogPage from './pages/AddLogPage';
import UnitDetailPage from './pages/UnitDetailPage';
import LoginPage from './pages/LoginPage';
import { Layout } from './components/Layout';
import { Save, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.STATS);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [editingLog, setEditingLog] = useState<DailyLog | null>(null);

  // Monitor Auth State (Local Only)
  useEffect(() => {
    const localUserSession = localStorage.getItem('fc_local_user');
    if (localUserSession) {
      setUser(JSON.parse(localUserSession));
    }
    setAuthLoading(false);
  }, []);

  // Monitor Database (LocalStorage Only)
  useEffect(() => {
    if (!user) return;
    const localLogs = localStorage.getItem('fc_local_logs');
    if (localLogs) {
      try {
        setLogs(JSON.parse(localLogs));
      } catch (e) {
        console.error("Failed to parse local logs", e);
        setLogs([]);
      }
    }
  }, [user]);

  const handleLogin = async (email: string, pass: string) => {
    // Local Authentication Bypass
    const mockUser = { email, uid: 'local-admin', isLocal: true };
    setUser(mockUser);
    localStorage.setItem('fc_local_user', JSON.stringify(mockUser));
  };

  const handleLogout = () => {
    localStorage.removeItem('fc_local_user');
    setUser(null);
    setActiveTab(Tab.STATS);
  };

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayLog = logs.find(log => log.date === today);
    
    const todayIncome = todayLog?.unitLogs.reduce((acc, curr) => acc + curr.income, 0) || 0;
    const todayCost = (todayLog?.unitLogs.reduce((acc, curr) => acc + curr.cost, 0) || 0) + 
                     (todayLog?.bazarItems.reduce((acc, curr) => acc + curr.price, 0) || 0);

    const monthlyIncome = logs.reduce((acc, log) => 
      acc + log.unitLogs.reduce((uAcc, u) => uAcc + u.income, 0), 0);
    const monthlyUnitCost = logs.reduce((acc, log) => 
      acc + log.unitLogs.reduce((uAcc, u) => uAcc + u.cost, 0), 0);
    const monthlyBazar = logs.reduce((acc, log) => 
      acc + log.bazarItems.reduce((bAcc, b) => bAcc + b.price, 0), 0);

    const monthlyCost = monthlyUnitCost + monthlyBazar;

    return {
      todayIncome,
      todayCost,
      monthlyIncome,
      monthlyCost,
      monthlyBazar,
      monthBalance: monthlyIncome - monthlyCost
    };
  }, [logs]);

  const handleSaveLog = (newLog: DailyLog) => {
    const updatedLogs = [...logs.filter(l => l.date !== newLog.date), newLog];
    setLogs(updatedLogs);
    localStorage.setItem('fc_local_logs', JSON.stringify(updatedLogs));
    
    setEditingLog(null);
    setActiveTab(Tab.STATS);
  };

  const startEdit = (log: DailyLog) => {
    setEditingLog(log);
    setActiveTab(Tab.ADD);
  };

  const openUnitDetail = (unitName: string) => {
    setSelectedUnit(unitName);
    setActiveTab(Tab.UNIT_DETAIL);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Tracker...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 relative pb-24 shadow-2xl overflow-hidden">
      {/* Local Mode Status Banner */}
      <div className="text-white text-[9px] font-black py-1.5 px-4 text-center sticky top-0 z-[100] uppercase tracking-widest flex items-center justify-center gap-2 bg-slate-800">
        <Save size={12} /> Local Storage Mode • Offline Ready
      </div>

      <Layout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
        {(() => {
          switch (activeTab) {
            case Tab.STATS:
              return <StatsPage stats={stats} units={INITIAL_UNITS} logs={logs} onUnitClick={openUnitDetail} />;
            case Tab.HISTORY:
              return <HistoryPage logs={logs} onEdit={startEdit} />;
            case Tab.ADD:
              return <AddLogPage 
                onSave={handleSaveLog} 
                units={INITIAL_UNITS} 
                editingLog={editingLog} 
                existingLogs={logs}
                onCancel={() => {
                  setEditingLog(null);
                  setActiveTab(Tab.STATS);
                }}
              />;
            case Tab.UNIT_DETAIL:
              return selectedUnit ? (
                <UnitDetailPage 
                  unitName={selectedUnit} 
                  logs={logs} 
                  onBack={() => setActiveTab(Tab.STATS)} 
                />
              ) : null;
            default:
              return <StatsPage stats={stats} units={INITIAL_UNITS} logs={logs} onUnitClick={openUnitDetail} />;
          }
        })()}
      </Layout>
      
      <div className="absolute bottom-24 left-0 right-0 px-8 opacity-20 pointer-events-none">
        <div className="flex items-center justify-center gap-2 grayscale">
          <ShieldCheck size={12} />
          <span className="text-[8px] font-black uppercase tracking-widest">Secure Local Database</span>
        </div>
      </div>
    </div>
  );
};

export default App;