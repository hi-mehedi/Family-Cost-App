import React, { useState, useMemo, useEffect } from 'react';
import { Tab, DailyLog } from './types';
import { INITIAL_UNITS } from './constants';
import StatsPage from './pages/StatsPage';
import HistoryPage from './pages/HistoryPage';
import AddLogPage from './pages/AddLogPage';
import UnitDetailPage from './pages/UnitDetailPage';
import LoginPage from './pages/LoginPage';
import { Layout } from './components/Layout';
import { Cloud, Loader2, AlertTriangle } from 'lucide-react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.STATS);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [editingLog, setEditingLog] = useState<DailyLog | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter state for Dashboard
  const now = new Date();
  const [viewingMonth, setViewingMonth] = useState(now.getMonth());
  const [viewingYear, setViewingYear] = useState(now.getFullYear());

  // Monitor Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    }, (err) => {
      console.error("Auth observer error:", err);
      setError("Authentication system failure. Check your connection.");
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Monitor Database (Firestore Sync)
  useEffect(() => {
    if (!user) return;
    
    setIsSyncing(true);
    const q = query(collection(db, 'users', user.uid, 'logs'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const syncedLogs = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as DailyLog));
      setLogs(syncedLogs);
      setIsSyncing(false);
      setError(null);
    }, (err) => {
      console.error("Firestore sync error:", err);
      setError("Cloud synchronization interrupted.");
      setIsSyncing(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogin = async (email: string, pass: string) => {
    setError(null);
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setLogs([]);
    setActiveTab(Tab.STATS);
  };

  const stats = useMemo(() => {
    // Current BD Date for "Today" stats
    const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka' }).format(new Date());
    const todayLog = logs.find(log => log.date === todayStr);
    
    const todayUnitIncome = todayLog?.unitLogs.reduce((acc, curr) => acc + (curr.income || 0), 0) || 0;
    const todayBuildingIncome = todayLog?.buildingIncome || 0;
    const todayIncome = todayUnitIncome + todayBuildingIncome;

    const todayCost = (todayLog?.unitLogs.reduce((acc, curr) => acc + (curr.cost || 0), 0) || 0) + 
                     (todayLog?.bazarItems.reduce((acc, curr) => acc + (curr.price || 0), 0) || 0) +
                     (todayLog?.otherItems?.reduce((acc, curr) => acc + (curr.price || 0), 0) || 0);

    // Filter logs by selected viewing month/year
    const filteredLogs = logs.filter(log => {
      const logDate = new Date(log.date);
      return logDate.getMonth() === viewingMonth && logDate.getFullYear() === viewingYear;
    });

    const monthlyUnitIncome = filteredLogs.reduce((acc, log) => 
      acc + log.unitLogs.reduce((uAcc, u) => uAcc + (u.income || 0), 0), 0);
    const monthlyBuildingIncome = filteredLogs.reduce((acc, log) => acc + (log.buildingIncome || 0), 0);
    const monthlyIncome = monthlyUnitIncome + monthlyBuildingIncome;

    const monthlyUnitCost = filteredLogs.reduce((acc, log) => 
      acc + log.unitLogs.reduce((uAcc, u) => uAcc + (u.cost || 0), 0), 0);
    const monthlyBazar = filteredLogs.reduce((acc, log) => 
      acc + log.bazarItems.reduce((bAcc, b) => bAcc + (b.price || 0), 0), 0);
    const monthlyOther = filteredLogs.reduce((acc, log) => 
      acc + (log.otherItems?.reduce((oAcc, o) => oAcc + (o.price || 0), 0) || 0), 0);

    const monthlyCost = monthlyUnitCost + monthlyBazar + monthlyOther;

    return {
      todayIncome,
      todayCost,
      monthlyIncome,
      monthlyCost,
      monthlyBazar,
      monthlyOther,
      monthBalance: monthlyIncome - monthlyCost,
      filteredLogs 
    };
  }, [logs, viewingMonth, viewingYear]);

  const handleSaveLog = async (newLog: DailyLog) => {
    if (!user) return;
    setIsSyncing(true);
    try {
      const logRef = doc(db, 'users', user.uid, 'logs', newLog.date);
      await setDoc(logRef, newLog);
      setEditingLog(null);
      setActiveTab(Tab.STATS);
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save to cloud. Please check your permissions.");
    } finally {
      setIsSyncing(false);
    }
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
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <Loader2 className="animate-spin text-indigo-600" size={48} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-ping"></div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verifying Security</p>
            <p className="text-xs font-bold text-slate-300 mt-1">Connecting to Firebase Cloud...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 relative pb-24 shadow-2xl overflow-hidden flex flex-col">
      {/* Cloud Status Banner */}
      <div className={`text-white text-[9px] font-black py-2 px-4 text-center sticky top-0 z-[100] uppercase tracking-widest flex items-center justify-center gap-2 transition-colors duration-500 ${error ? 'bg-rose-600' : isSyncing ? 'bg-amber-500' : 'bg-indigo-700'}`}>
        {error ? (
          <>
            <AlertTriangle size={10} />
            {error}
          </>
        ) : isSyncing ? (
          <>
            <Loader2 size={10} className="animate-spin" />
            Synchronizing...
          </>
        ) : (
          <>
            <Cloud size={10} />
            Encrypted & Cloud Synced
          </>
        )}
      </div>

      <Layout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
        {(() => {
          switch (activeTab) {
            case Tab.STATS:
              return (
                <StatsPage 
                  stats={stats} 
                  units={INITIAL_UNITS} 
                  logs={logs} 
                  onUnitClick={openUnitDetail} 
                  viewingMonth={viewingMonth}
                  viewingYear={viewingYear}
                  setViewingMonth={setViewingMonth}
                  setViewingYear={setViewingYear}
                />
              );
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
              return <StatsPage 
                stats={stats} 
                units={INITIAL_UNITS} 
                logs={logs} 
                onUnitClick={openUnitDetail} 
                viewingMonth={viewingMonth}
                viewingYear={viewingYear}
                setViewingMonth={setViewingMonth}
                setViewingYear={setViewingYear}
              />;
          }
        })()}
      </Layout>
    </div>
  );
};

export default App;