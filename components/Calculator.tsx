import React, { useRef } from 'react';
import { Dimensions, CalculationResult } from '../types';
import { Download, Ruler, BrickWall, Square, Hammer, Info } from 'lucide-react';

interface CalculatorProps {
  dimensions: Dimensions;
  setDimensions: (d: Dimensions) => void;
  results: CalculationResult;
}

// Declare jsPDF types globally for this file since we loaded via CDN
declare const jspdf: any;

const Calculator: React.FC<CalculatorProps> = ({ dimensions, setDimensions, results }) => {

  const handleExportPDF = () => {
    const { jsPDF } = jspdf;
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(14, 165, 233); // Primary color
    doc.text("CivilCalc Pro - Relatório de Materiais", 14, 22);

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Data: ${new Date().toLocaleDateString()}`, 14, 32);

    // Dimensions Summary
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Resumo da Obra", 14, 45);
    
    const summaryData = [
      ["Dimensões", `${dimensions.length}m x ${dimensions.width}m`],
      ["Área Total", `${results.area.toFixed(2)} m²`],
      ["Perímetro", `${results.perimeter.toFixed(2)} m`],
      ["Área de Paredes", `${results.wallArea.toFixed(2)} m²`],
      ["Custo Total Estimado", `R$ ${results.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`]
    ];

    doc.autoTable({
      startY: 50,
      head: [['Item', 'Valor']],
      body: summaryData,
      theme: 'striped',
      headStyles: { fillColor: [14, 165, 233] },
    });

    // Material List
    doc.text("Quantitativo de Materiais", 14, doc.lastAutoTable.finalY + 15);

    const materialsData = results.materials.map(m => [
      m.name,
      `${m.quantity} ${m.unit}`,
      `R$ ${m.unitPrice.toFixed(2)}`,
      `R$ ${m.totalCost.toFixed(2)}`
    ]);

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 20,
      head: [['Material', 'Qtd', 'Unitário', 'Total']],
      body: materialsData,
      theme: 'grid',
      headStyles: { fillColor: [71, 85, 105] }, // Slate 600
    });

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Calculado via CivilCalc Pro. Os valores são estimativas e podem variar.", 14, doc.lastAutoTable.finalY + 20);

    doc.save("orcamento_obra.pdf");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDimensions({
      ...dimensions,
      [name]: parseFloat(value) || 0,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Input Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
          <Ruler className="w-5 h-5 text-primary" />
          Dimensões do Terreno
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-600 mb-1">Comprimento (m)</label>
            <input
              type="number"
              name="length"
              value={dimensions.length}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
              placeholder="Ex: 10"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-600 mb-1">Largura (m)</label>
            <input
              type="number"
              name="width"
              value={dimensions.width}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
              placeholder="Ex: 5"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-600 mb-1">Altura Muro/Parede (m)</label>
            <input
              type="number"
              name="wallHeight"
              value={dimensions.wallHeight}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
              placeholder="Ex: 2.8"
            />
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-xl shadow-md text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 text-sm font-medium">Custo Total Estimado</p>
              <h3 className="text-2xl font-bold mt-1">R$ {results.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            </div>
            <div className="p-2 bg-white/20 rounded-lg">
              <span className="text-xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Área Construída</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{results.area.toFixed(2)} <span className="text-sm text-gray-400 font-normal">m²</span></h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <Square className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Perímetro Linear</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{results.perimeter.toFixed(2)} <span className="text-sm text-gray-400 font-normal">m</span></h3>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <BrickWall className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Materials Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Hammer className="w-5 h-5 text-secondary" />
            Quantitativo de Materiais
          </h2>
          <button 
            onClick={handleExportPDF}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-sm active:scale-95 transform"
          >
            <Download className="w-4 h-4" />
            Exportar PDF
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Material</th>
                <th className="p-4 font-semibold">Quantidade</th>
                <th className="p-4 font-semibold">Unidade</th>
                <th className="p-4 font-semibold text-right">Custo Unit.</th>
                <th className="p-4 font-semibold text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {results.materials.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-800">{item.name}</td>
                  <td className="p-4 text-gray-700 font-bold">{item.quantity}</td>
                  <td className="p-4 text-gray-500 text-sm">{item.unit}</td>
                  <td className="p-4 text-gray-600 text-right">R$ {item.unitPrice.toFixed(2)}</td>
                  <td className="p-4 text-gray-800 font-bold text-right">R$ {item.totalCost.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50">
                <td colSpan={4} className="p-4 text-right font-bold text-gray-700 uppercase text-xs tracking-wider">Total Geral Estimado</td>
                <td className="p-4 text-right font-black text-primary text-lg">R$ {results.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="p-4 bg-amber-50 text-amber-800 text-xs flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>Os valores apresentados incluem uma margem de segurança (perda) de 10%. Os custos unitários podem variar por região. Ajuste na aba Configurações.</p>
        </div>
      </div>
    </div>
  );
};

export default Calculator;