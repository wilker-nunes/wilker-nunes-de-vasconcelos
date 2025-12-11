import React from 'react';
import { UnitPrices } from '../types';
import { Settings as SettingsIcon, Save, RefreshCw } from 'lucide-react';
import { DEFAULT_PRICES } from '../constants';

interface SettingsProps {
  prices: UnitPrices;
  setPrices: (p: UnitPrices) => void;
}

const Settings: React.FC<SettingsProps> = ({ prices, setPrices }) => {
  
  const handleChange = (key: keyof UnitPrices, value: string) => {
    setPrices({
      ...prices,
      [key]: parseFloat(value) || 0
    });
  };

  const handleReset = () => {
    if(confirm('Deseja restaurar os preços padrão?')) {
      setPrices(DEFAULT_PRICES);
    }
  };

  const priceLabels: Record<keyof UnitPrices, string> = {
    brick: "Tijolo (unidade)",
    cement: "Cimento (Saco 50kg)",
    sand: "Areia (m³)",
    gravel: "Brita (m³)",
    steel: "Aço (kg)",
    paint: "Tinta (Lata 18L)",
    floor: "Piso (m²)",
    labor: "Mão de Obra (m²)"
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-primary" />
          Configuração de Preços
        </h2>
        <button 
          onClick={handleReset}
          className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1 transition-colors"
        >
          <RefreshCw className="w-3 h-3" /> Restaurar Padrões
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.keys(prices).map((key) => {
          const k = key as keyof UnitPrices;
          return (
            <div key={k} className="relative">
              <label className="block text-sm font-medium text-gray-600 mb-1">{priceLabels[k]}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 font-semibold">R$</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={prices[k]}
                  onChange={(e) => handleChange(k, e.target.value)}
                  className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none font-medium text-gray-700"
                />
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="bg-gray-50 p-4 border-t border-gray-100 flex items-center justify-end">
         <span className="text-xs text-gray-400 mr-2">Alterações são salvas automaticamente</span>
         <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
            <Save className="w-4 h-4" /> Salvo
         </div>
      </div>
    </div>
  );
};

export default Settings;