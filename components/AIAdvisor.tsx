import React, { useState } from 'react';
import { Dimensions, CalculationResult } from '../types';
import { generateConstructionAdvice } from '../services/geminiService';
import { Sparkles, Loader2, MessageSquare, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; // Assuming react-markdown is allowed or I'll parse simply. 
// Since "popular libraries" are allowed, I'll assume basic rendering or text-pre-wrap. 
// For safety without extra deps in this strict env, I will use CSS whitespace-pre-wrap for formatting.

interface AIAdvisorProps {
  dimensions: Dimensions;
  results: CalculationResult;
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ dimensions, results }) => {
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const text = await generateConstructionAdvice(dimensions, results);
    setAdvice(text);
    setLoading(false);
    setHasGenerated(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl shadow-lg text-white p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-300" />
            Engenheiro Virtual (IA)
          </h2>
          <p className="text-indigo-100 mb-6 leading-relaxed">
            Use nossa Inteligência Artificial para analisar sua obra. Receba dicas sobre cronograma, 
            logística de materiais e pontos de atenção antes de começar a construir.
          </p>
          
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 active:scale-95 transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Analisando Dados...
              </>
            ) : (
              <>
                <MessageSquare className="w-5 h-5" /> Gerar Relatório Profissional
              </>
            )}
          </button>
        </div>
      </div>

      {hasGenerated && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-4">Análise Técnica</h3>
            <div className="prose prose-slate max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
                {advice}
            </div>
            {!process.env.API_KEY && (
               <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm border border-red-100">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Atenção: A chave da API Gemini não foi detectada. O relatório acima pode ser uma mensagem de erro simulada.</span>
               </div>
            )}
        </div>
      )}
    </div>
  );
};

export default AIAdvisor;