
import { DailyLog } from './types';

export const PRIMARY_PURPLE = '#4F46E5';
export const BG_LIGHT = '#F8FAFC';

export const INITIAL_UNITS = [
  'Car',
  'Ris-Sharif-1',
  'Ris-Sharif-2',
  'Ris-Roman-1',
  'Ris-Roman-2',
  'Auto'
];

export const MOCK_LOGS: DailyLog[] = [
  {
    id: '1',
    date: new Date().toISOString().split('T')[0],
    unitLogs: [
      { unitId: 'Car', unitName: 'Car', income: 3000, cost: 200 },
      { unitId: 'Ris-Sharif-1', unitName: 'Ris-Sharif-1', income: 1500, cost: 100 },
    ],
    bazarItems: [
      { id: 'b1', name: 'Rice & Oil', price: 450 }
    ],
    // Fix: Added missing mandatory properties 'otherItems' and 'buildingIncome'
    otherItems: [],
    buildingIncome: 0
  }
];
