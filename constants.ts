import { Dimensions, UnitPrices } from './types';

export const DEFAULT_DIMENSIONS: Dimensions = {
  length: 10,
  width: 5,
  wallHeight: 3,
};

// Average prices in BRL (approximation)
export const DEFAULT_PRICES: UnitPrices = {
  brick: 1.20,       // Tijolo 8 furos
  cement: 35.00,     // Saco 50kg
  sand: 120.00,      // Metro cúbico
  gravel: 110.00,    // Brita m3
  steel: 12.00,      // kg do aço CA-50
  paint: 350.00,     // Lata 18L Suvinil/Coral etc
  floor: 45.00,      // Porcelanato/Cerâmica m2
  labor: 600.00,     // Mão de obra m2 construído (estimativa básica)
};

export const CONSUMPTION_RATES = {
  bricksPerM2: 25, // with mortar joints
  cementPerM2Wall: 6, // kg (plaster + mortar)
  sandPerM2Wall: 0.02, // m3
  steelPerM3Concrete: 80, // kg
  concretePerLinearMeter: 0.04, // m3 (columns/beams avg)
  paintCoveragePerCan: 100, // m2 (2 coats)
  wasteMargin: 1.10, // 10% waste
};