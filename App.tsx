
import React, { useState, useMemo, useEffect } from 'react';
import { Tab, DailyLog } from './types';
import { INITIAL_UNITS } from './constants';
import StatsPage from './pages/StatsPage';
import HistoryPage from './pages/HistoryPage';
import AddLogPage from './pages/AddLogPage';
import UnitDetailPage from './pages/UnitDetailPage';
import LoginPage from './pages/LoginPage';
import { Layout } from './components/Layout';
// Import missing Database icon
import { Database } from 'lucide-react';

// Firebase
import { auth, db, isFirebaseConfigured } from './firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { collection, onSnapshot, setDoc, doc, query, orderBy } from 'firebase/firestore';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.STATS);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [editingLog, setEditingLog] = useState<DailyLog | null>(null);

  // Monitor Auth State
  useEffect(() => {
    // Check local session first (for Demo/Local mode)
    const localUserSession = localStorage.getItem('fc_local_user');
    if (localUserSession && !isFirebaseConfigured()) {
      setUser(JSON.parse(localUserSession));
      setAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  // Monitor Database (Real-time Firestore or LocalStorage)
  useEffect(() => {
    if (!user) return;

    if (isFirebaseConfigured()) {
      try {
        const q = query(collection(db, "logs"), orderBy("date", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const logsData = snapshot.docs.map(doc => doc.data() as DailyLog);
          setLogs(logsData);
        }, (error) => {
          console.error("Firestore Listen Error:", error);
        });
        return unsubscribe;
      } catch (e) {
        console.error("Firebase Initialization Error:", e);
      }
    } else {
      // Local Mode: Load from localStorage
      const localLogs = localStorage.getItem('fc_local_logs');
      if (localLogs) {
        setLogs(JSON.parse(localLogs));
      }
    }
  }, [user]);

  const handleLogin = async (email: string, pass: string) => {
    if (!isFirebaseConfigured()) {
      // Local Bypass for testing when keys are missing
      const mockUser = { email, uid: 'local-admin', isLocal: true };
      setUser(mockUser);
      localStorage.setItem('fc_local_user', JSON.stringify(mockUser));
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      if (
        (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') &&
        email === 'mehedi.admin@gmail.com'
      ) {
        await createUserWithEmailAndPassword(auth, email, pass);
        return;
      }
      throw error;
    }
  };

  const handleLogout = async () => {
    if (!isFirebaseConfigured()) {
      localStorage.removeItem('fc_local_user');
      setUser(null);
    } else {
      await signOut(auth);
    }
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

  const handleSaveLog = async (newLog: DailyLog) => {
    if (isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, "logs", newLog.date), newLog);
      } catch (e) {
        console.error("Error saving to Firebase:", e);
        alert("Cloud save failed. Check your Firestore rules.");
      }
    } else {
      // Save locally
      const updatedLogs = [...logs.filter(l => l.date !== newLog.date), newLog];
      setLogs(updatedLogs);
      localStorage.setItem('fc_local_logs', JSON.stringify(updatedLogs));
    }
    
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
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initialising Tracker...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 relative pb-24 shadow-2xl">
      {!isFirebaseConfigured() && (
        <div className="bg-amber-500 text-white text-[9px] font-black py-1.5 px-4 text-center sticky top-0 z-[100] uppercase tracking-widest flex items-center justify-center gap-2">
          <Database size={12} />
          Local Database (Unsynced)
        </div>
      )}
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
    </div>
  );
};

export default App;
