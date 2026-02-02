
import { DailyLog } from './types';

export const PRIMARY_PURPLE = '#4F46E5';
export const BG_LIGHT = '#F8FAFC';

export const INITIAL_UNITS = [
  'Car',
  'Ris-new1',
  'Ris-Roman1',
  'Ris-Roman2',
  'Ris-2',
  'Auto'
];

export const MOCK_LOGS: DailyLog[] = [
  {
    id: '1',
    date: new Date().toISOString().split('T')[0],
    unitLogs: [
      { unitId: 'Car', unitName: 'Car', income: 3000, cost: 200 },
      { unitId: 'Ris-new1', unitName: 'Ris-new1', income: 1500, cost: 100 },
    ],
    bazarItems: [
      { id: 'b1', name: 'Rice & Oil', price: 450 }
    ]
  }
];
