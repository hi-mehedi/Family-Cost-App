export interface BazarItem {
  id: string;
  name: string;
  price: number;
}

export interface OtherItem {
  id: string;
  name: string;
  price: number;
}

export interface UnitLog {
  unitId: string;
  unitName: string;
  income: number;
  cost: number;
}

export interface DailyLog {
  id: string;
  date: string; // ISO format
  unitLogs: UnitLog[];
  bazarItems: BazarItem[];
  otherItems: OtherItem[]; // New field for miscellaneous costs
  buildingIncome: number; // New field for building-specific income
}

export interface AppState {
  logs: DailyLog[];
  units: string[];
  userId: string;
}

export enum Tab {
  STATS = 'stats',
  ADD = 'add',
  HISTORY = 'history',
  UNIT_DETAIL = 'unit_detail'
}