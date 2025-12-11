import React, { useState, useMemo } from 'react';
import Calculator from './components/Calculator';
import Settings from './components/Settings';
import AIAdvisor from './components/AIAdvisor';
import { Dimensions, UnitPrices, Tab, CalculationResult } from './types';
import { DEFAULT_DIMENSIONS, DEFAULT_PRICES } from './constants';
import { calculateMaterials } from './utils/calculations';
import { Calculator as CalcIcon, Settings as SettingsIcon, Bot, HardHat } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.CALCULATOR);
  const [dimensions, setDimensions] = useState<Dimensions>(DEFAULT_DIMENSIONS);
  const [prices, setPrices] = useState<UnitPrices>(DEFAULT_PRICES);

  // Memoize calculation so it updates efficiently when inputs change
  const results: CalculationResult = useMemo(
    () => calculateMaterials(dimensions, prices),
    [dimensions, prices]
  );

  const renderContent = () => {
    switch (activeTab) {
      case Tab.CALCULATOR:
        return <Calculator dimensions={dimensions} setDimensions={setDimensions} results={results} />;
      case Tab.SETTINGS:
        return <Settings prices={prices} setPrices={setPrices} />;
      case Tab.AI_ADVISOR:
        return <AIAdvisor dimensions={dimensions} results={results} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 pb-12">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <HardHat className="w-6 h-6 text-primary" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-800">CivilCalc <span className="text-primary">Pro</span></span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-8 bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm w-fit mx-auto sm:mx-0">
          <button
            onClick={() => setActiveTab(Tab.CALCULATOR)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === Tab.CALCULATOR
                ? 'bg-primary text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <CalcIcon className="w-4 h-4" /> Calculadora
          </button>
          
          <button
            onClick={() => setActiveTab(Tab.AI_ADVISOR)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === Tab.AI_ADVISOR
                ? 'bg-primary text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Bot className="w-4 h-4" /> IA Advisor
          </button>

          <button
            onClick={() => setActiveTab(Tab.SETTINGS)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === Tab.SETTINGS
                ? 'bg-primary text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <SettingsIcon className="w-4 h-4" /> Preços
          </button>
        </div>

        {/* Content Area */}
        <div className="min-h-[500px]">
           {renderContent()}
        </div>
      </main>

      <footer className="mt-12 text-center text-gray-400 text-sm pb-6">
        <p>© 2024 CivilCalc Pro. Ferramenta para estimativa de obras.</p>
      </footer>
    </div>
  );
};

export default App;