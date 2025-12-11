import { Dimensions, UnitPrices, CalculationResult, MaterialItem } from '../types';
import { CONSUMPTION_RATES } from '../constants';

export const calculateMaterials = (
  dimensions: Dimensions,
  prices: UnitPrices
): CalculationResult => {
  const { length, width, wallHeight } = dimensions;
  const { wasteMargin } = CONSUMPTION_RATES;

  // 1. Geometry
  const area = length * width;
  const perimeter = 2 * (length + width);
  const wallArea = perimeter * wallHeight;
  
  // Exclude openings? For simplicity, we assume generic openings are covered by the waste margin or specific simple calc
  // Let's assume 15% reduction for doors/windows but 10% waste adds back.
  // We'll stick to raw wall area * waste for a "safe" estimate.
  const effectiveWallArea = wallArea; 

  const materials: MaterialItem[] = [];

  // 2. Structural - Bricks
  const numBricks = Math.ceil(effectiveWallArea * CONSUMPTION_RATES.bricksPerM2 * wasteMargin);
  materials.push({
    id: 'bricks',
    name: 'Tijolos Cerâmicos (8 furos)',
    quantity: numBricks,
    unit: 'un',
    unitPrice: prices.brick,
    totalCost: numBricks * prices.brick,
    category: 'structural',
  });

  // 3. Structural - Concrete Elements (Beams/Columns)
  // Rough estimate: Columns every 3m, Beams along perimeter
  const linearStructural = perimeter + (perimeter / 3) * wallHeight; 
  const volumeConcrete = linearStructural * CONSUMPTION_RATES.concretePerLinearMeter; // m3
  
  // Cement for Concrete + Mortar for walls
  // Mortar for laying bricks + plastering (both sides)
  const cementForWallsKg = effectiveWallArea * CONSUMPTION_RATES.cementPerM2Wall;
  // Concrete is roughly 350kg cement per m3
  const cementForConcreteKg = volumeConcrete * 350;
  
  const totalCementKg = (cementForWallsKg + cementForConcreteKg) * wasteMargin;
  const totalCementBags = Math.ceil(totalCementKg / 50);

  materials.push({
    id: 'cement',
    name: 'Cimento (Saco 50kg)',
    quantity: totalCementBags,
    unit: 'sc',
    unitPrice: prices.cement,
    totalCost: totalCementBags * prices.cement,
    category: 'structural',
  });

  // 4. Aggregates (Sand & Gravel)
  // Sand for mortar + concrete
  const sandForWalls = effectiveWallArea * CONSUMPTION_RATES.sandPerM2Wall;
  // Concrete is roughly 0.7 m3 sand per m3 concrete
  const sandForConcrete = volumeConcrete * 0.7;
  const totalSand = parseFloat(((sandForWalls + sandForConcrete) * wasteMargin).toFixed(2));

  materials.push({
    id: 'sand',
    name: 'Areia Média/Grossa',
    quantity: totalSand,
    unit: 'm³',
    unitPrice: prices.sand,
    totalCost: totalSand * prices.sand,
    category: 'structural',
  });

  // Gravel only for concrete (approx 0.8 m3 per m3 concrete)
  const totalGravel = parseFloat((volumeConcrete * 0.8 * wasteMargin).toFixed(2));
  materials.push({
    id: 'gravel',
    name: 'Brita 1',
    quantity: totalGravel,
    unit: 'm³',
    unitPrice: prices.gravel,
    totalCost: totalGravel * prices.gravel,
    category: 'structural',
  });

  // 5. Steel
  const totalSteel = Math.ceil(volumeConcrete * CONSUMPTION_RATES.steelPerM3Concrete * wasteMargin);
  materials.push({
    id: 'steel',
    name: 'Aço CA-50 (estimado)',
    quantity: totalSteel,
    unit: 'kg',
    unitPrice: prices.steel,
    totalCost: totalSteel * prices.steel,
    category: 'structural',
  });

  // 6. Finishing - Floor
  const floorArea = area * wasteMargin;
  materials.push({
    id: 'floor',
    name: 'Piso Cerâmico/Porcelanato',
    quantity: parseFloat(floorArea.toFixed(1)),
    unit: 'm²',
    unitPrice: prices.floor,
    totalCost: floorArea * prices.floor,
    category: 'finishing',
  });

  // 7. Finishing - Paint
  // Wall area x 2 (internal/external) - roughly. 
  // Let's assume we paint both sides of the walls.
  const paintArea = wallArea * 2;
  const paintCans = Math.ceil(paintArea / CONSUMPTION_RATES.paintCoveragePerCan);
  
  materials.push({
    id: 'paint',
    name: 'Tinta Acrílica (Lata 18L)',
    quantity: paintCans,
    unit: 'un',
    unitPrice: prices.paint,
    totalCost: paintCans * prices.paint,
    category: 'finishing',
  });

  // 8. Labor
  // Based on floor area mostly for rough estimate
  materials.push({
    id: 'labor',
    name: 'Mão de Obra (Estimativa)',
    quantity: area,
    unit: 'm²',
    unitPrice: prices.labor,
    totalCost: area * prices.labor,
    category: 'labor',
  });

  const totalCost = materials.reduce((acc, item) => acc + item.totalCost, 0);

  return {
    area,
    perimeter,
    wallArea,
    materials,
    totalCost,
  };
};