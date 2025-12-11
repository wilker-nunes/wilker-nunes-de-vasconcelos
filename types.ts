export interface Dimensions {
  length: number;
  width: number;
  wallHeight: number;
}

export interface UnitPrices {
  brick: number; // per unit
  cement: number; // per 50kg bag
  sand: number; // per m3
  gravel: number; // per m3
  steel: number; // per kg
  paint: number; // per 18L can
  floor: number; // per m2
  labor: number; // per m2 (estimate)
}

export interface MaterialItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalCost: number;
  category: 'structural' | 'finishing' | 'labor';
}

export interface CalculationResult {
  area: number; // m2
  perimeter: number; // m
  wallArea: number; // m2
  materials: MaterialItem[];
  totalCost: number;
}

export enum Tab {
  CALCULATOR = 'calculator',
  SETTINGS = 'settings',
  AI_ADVISOR = 'ai_advisor',
}