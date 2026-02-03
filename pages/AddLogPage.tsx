import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ShoppingBasket, Save, Plus, Trash2, X, AlertCircle, Home, ListPlus } from 'lucide-react';
import { DailyLog, UnitLog, BazarItem, OtherItem } from '../types';

interface AddLogPageProps {
  onSave: (log: DailyLog) => void;
  units: string[];
  editingLog?: DailyLog | null;
  onCancel?: () => void;
  existingLogs: DailyLog[]; 
}

const AddLogPage: React.FC<AddLogPageProps> = ({ onSave, units, editingLog, onCancel, existingLogs }) => {
  const getBDDate = () => {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Dhaka',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());
  };

  const [date, setDate] = useState(editingLog?.date || getBDDate());
  const [unitLogs, setUnitLogs] = useState<UnitLog[]>(
    units.map(u => ({ unitId: u, unitName: u, income: 0, cost: 0 }))
  );
  const [buildingIncome, setBuildingIncome] = useState<string>(editingLog?.buildingIncome?.toString() || '0');
  
  // Bazar Items State
  const [bazarItems, setBazarItems] = useState<BazarItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');

  // Other Items State
  const [otherItems, setOtherItems] = useState<OtherItem[]>([]);
  const [newOtherName, setNewOtherName] = useState('');
  const [newOtherPrice, setNewOtherPrice] = useState('');

  const [isAutoLoaded, setIsAutoLoaded] = useState(false);

  useEffect(() => {
    const existingEntry = editingLog || existingLogs.find(l => l.date === date);

    if (existingEntry) {
      setBazarItems([...existingEntry.bazarItems]);
      setOtherItems([...(existingEntry.otherItems || [])]);
      setBuildingIncome(existingEntry.buildingIncome?.toString() || '0');
      setUnitLogs(units.map(u => {
        const found = existingEntry.unitLogs.find(ul => ul.unitName === u);
        return found ? { ...found } : { unitId: u, unitName: u, income: 0, cost: 0 };
      }));
      setIsAutoLoaded(true);
    } else {
      setBazarItems([]);
      setOtherItems([]);
      setBuildingIncome('0');
      setUnitLogs(units.map(u => ({ unitId: u, unitName: u, income: 0, cost: 0 })));
      setIsAutoLoaded(false);
    }
  }, [date, editingLog, existingLogs, units]);

  const handleUnitChange = (unitName: string, field: 'income' | 'cost', value: string) => {
    const num = parseInt(value) || 0;
    setUnitLogs(prev => prev.map(ul => ul.unitName === unitName ? { ...ul, [field]: num } : ul));
  };

  const addBazarItem = () => {
    if (newItemName && newItemPrice) {
      setBazarItems(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        name: newItemName,
        price: parseInt(newItemPrice) || 0
      }]);
      setNewItemName('');
      setNewItemPrice('');
    }
  };

  const addOtherItem = () => {
    if (newOtherName && newOtherPrice) {
      setOtherItems(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        name: newOtherName,
        price: parseInt(newOtherPrice) || 0
      }]);
      setNewOtherName('');
      setNewOtherPrice('');
    }
  };

  const removeBazarItem = (id: string) => {
    setBazarItems(prev => prev.filter(item => item.id !== id));
  };

  const removeOtherItem = (id: string) => {
    setOtherItems(prev => prev.filter(item => item.id !== id));
  };

  const totalBazarPrice = bazarItems.reduce((acc, curr) => acc + curr.price, 0);
  const totalOtherPrice = otherItems.reduce((acc, curr) => acc + curr.price, 0);

  const handleSave = () => {
    onSave({
      id: editingLog?.id || Math.random().toString(36).substr(2, 9),
      date,
      unitLogs: unitLogs.filter(ul => ul.income > 0 || ul.cost > 0),
      buildingIncome: parseInt(buildingIncome) || 0,
      bazarItems,
      otherItems
    });
  };

  return (
    <div className="pb-24">
      <div className="bg-indigo-600 px-6 py-10 relative overflow-hidden flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-black text-white italic">
            {isAutoLoaded ? 'UPDATE ENTRY' : 'NEW ENTRY'}
          </h2>
          <p className="text-indigo-200 text-[10px] font-bold mt-1 uppercase tracking-[0.2em]">
            Timezone: Asia/Dhaka (GMT+6)
          </p>
        </div>
        {(editingLog || isAutoLoaded) && (
          <button onClick={onCancel} className="bg-white/10 p-2 rounded-xl text-white">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="px-4 -mt-6">
        {/* Date Selector */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Transaction Date</h3>
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-indigo-600">
               <CalendarIcon size={20} />
            </div>
            <input 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          {isAutoLoaded && (
            <div className="mt-3 flex items-center gap-2 text-indigo-700 bg-indigo-50 px-3 py-2 rounded-xl border border-indigo-100">
              <AlertCircle size={14} />
              <p className="text-[10px] font-bold uppercase tracking-tight">Existing record detected. Values are auto-populated.</p>
            </div>
          )}
        </div>

        {/* Building Income Section */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 rounded-xl">
              <Home size={22} className="text-indigo-600" />
            </div>
            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Building Income</h4>
          </div>
          <div className="relative">
             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">TK</span>
             <input 
               type="number"
               placeholder="0"
               value={buildingIncome}
               onChange={(e) => setBuildingIncome(e.target.value)}
               className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
             />
          </div>
        </div>

        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Unit Performance Data</h3>
        
        <div className="space-y-4 mb-8">
          {units.map((unit) => {
            const currentLog = unitLogs.find(ul => ul.unitName === unit);
            return (
              <div key={unit} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 bg-indigo-500 h-6 rounded-full"></div>
                  <h4 className="text-lg font-black text-slate-900 tracking-tight">{unit}</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-[10px] font-black text-emerald-600 uppercase mb-2">Income</span>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">TK</span>
                      <input 
                        type="number"
                        placeholder="0"
                        value={currentLog?.income || ''}
                        onChange={(e) => handleUnitChange(unit, 'income', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                  </div>
                  <div>
                    <span className="block text-[10px] font-black text-rose-600 uppercase mb-2">Expense</span>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">TK</span>
                      <input 
                        type="number"
                        placeholder="0"
                        value={currentLog?.cost || ''}
                        onChange={(e) => handleUnitChange(unit, 'cost', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bazar Section */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
          <div className="flex justify-between items-center mb-6">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-rose-50 rounded-xl">
                <ShoppingBasket size={22} className="text-rose-600" />
               </div>
               <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Bazar List</h4>
             </div>
             <div className="bg-slate-900 text-white px-4 py-2 rounded-2xl font-black text-sm shadow-lg shadow-slate-200">
               TK {totalBazarPrice.toLocaleString()}
             </div>
          </div>

          <div className="mb-6">
            {bazarItems.length > 0 && (
               <div className="space-y-3 mb-6">
                 {bazarItems.map((item) => (
                   <div key={item.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div>
                        <span className="block text-sm font-black text-slate-900 uppercase tracking-tighter">{item.name}</span>
                        <span className="text-[11px] font-bold text-slate-500 uppercase">Cost: TK {item.price.toLocaleString()}</span>
                      </div>
                      <button onClick={() => removeBazarItem(item.id)} className="bg-white p-2 rounded-xl text-rose-500 shadow-sm border border-slate-100 active:scale-90 transition-transform">
                        <Trash2 size={18} />
                      </button>
                   </div>
                 ))}
               </div>
            )}

            <div className="flex gap-2">
              <input 
                type="text"
                placeholder="Item"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="flex-[2] bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <input 
                type="number"
                placeholder="Price"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <button 
                onClick={addBazarItem}
                className="bg-indigo-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
              >
                <Plus size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Other Details Section */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-12">
          <div className="flex justify-between items-center mb-6">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-amber-50 rounded-xl">
                <ListPlus size={22} className="text-amber-600" />
               </div>
               <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Other Details</h4>
             </div>
             <div className="bg-slate-900 text-white px-4 py-2 rounded-2xl font-black text-sm shadow-lg shadow-slate-200">
               TK {totalOtherPrice.toLocaleString()}
             </div>
          </div>

          <div className="mb-6">
            {otherItems.length > 0 && (
               <div className="space-y-3 mb-6">
                 {otherItems.map((item) => (
                   <div key={item.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div>
                        <span className="block text-sm font-black text-slate-900 uppercase tracking-tighter">{item.name}</span>
                        <span className="text-[11px] font-bold text-slate-500 uppercase">Cost: TK {item.price.toLocaleString()}</span>
                      </div>
                      <button onClick={() => removeOtherItem(item.id)} className="bg-white p-2 rounded-xl text-rose-500 shadow-sm border border-slate-100 active:scale-90 transition-transform">
                        <Trash2 size={18} />
                      </button>
                   </div>
                 ))}
               </div>
            )}

            <div className="flex gap-2">
              <input 
                type="text"
                placeholder="Description"
                value={newOtherName}
                onChange={(e) => setNewOtherName(e.target.value)}
                className="flex-[2] bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <input 
                type="number"
                placeholder="Price"
                value={newOtherPrice}
                onChange={(e) => setNewOtherPrice(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <button 
                onClick={addOtherItem}
                className="bg-indigo-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
              >
                <Plus size={24} />
              </button>
            </div>
          </div>

          <button 
            onClick={handleSave}
            className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black flex items-center justify-center gap-3 uppercase text-sm tracking-widest shadow-xl shadow-slate-900/20 active:scale-[0.98] transition-all"
          >
            <Save size={20} />
            {isAutoLoaded ? 'Update Entry' : 'Post to Cloud'}
          </button>
        </div>
        
        <div className="text-center py-4">
           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Secured by Mehedi Hasan Soumik</p>
        </div>
      </div>
    </div>
  );
};

export default AddLogPage;