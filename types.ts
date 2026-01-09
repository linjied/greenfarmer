
export enum ViewType {
  DASHBOARD = 'dashboard',
  CROP_MANAGEMENT = 'crops',
  AI_ADVISOR = 'advisor',
  WEATHER = 'weather',
  MARKET = 'market'
}

export interface FarmingRecord {
  id: string;
  type: '施肥' | '喷药' | '灌溉' | '除草' | '采收' | '其他';
  date: string;
  note: string;
}

export interface SensorData {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  icon: string;
}

export interface Crop {
  id: string;
  name: string;
  variety: string;
  plantedDate: string;
  status: 'Growing' | 'Harvested' | 'Dormant' | 'Sprouting';
  health: number; // 0-100
  area: number; // hectares
  records?: FarmingRecord[];
}

export interface WeatherInfo {
  temp: number;
  humidity: number;
  condition: string;
  windSpeed: number;
  forecast: { day: string; temp: number; condition: string }[];
}

export interface MarketPrice {
  crop: string;
  price: number;
  change: number; // percentage
  trend: 'up' | 'down' | 'stable';
}
