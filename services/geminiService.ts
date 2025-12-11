import { GoogleGenAI } from "@google/genai";
import { CalculationResult, Dimensions } from "../types";

// Safety check for API Key
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const generateConstructionAdvice = async (
  dimensions: Dimensions,
  results: CalculationResult
): Promise<string> => {
  if (!apiKey) {
    return "API Key not configured. Please check your environment variables.";
  }

  const prompt = `
    Atue como um Engenheiro Civil Sênior experiente. Analise os seguintes dados de uma pequena obra/reforma:

    Dimensões: ${dimensions.length}m x ${dimensions.width}m (Área: ${results.area}m²)
    Perímetro: ${results.perimeter}m
    Altura Paredes: ${dimensions.wallHeight}m
    Custo Estimado: R$ ${results.totalCost.toFixed(2)}
    
    Materiais Principais Calculados:
    - Tijolos: ${results.materials.find(m => m.id === 'bricks')?.quantity} un
    - Cimento: ${results.materials.find(m => m.id === 'cement')?.quantity} sacos
    - Areia: ${results.materials.find(m => m.id === 'sand')?.quantity} m³

    Por favor, forneça um relatório curto e profissional em formato Markdown cobrindo:
    1. **Análise de Viabilidade**: Comentário sobre a proporção de materiais para o tamanho.
    2. **Dicas de Logística**: Como armazenar esse cimento e areia no canteiro.
    3. **Cronograma Estimado**: Quanto tempo levaria essa obra com 2 pedreiros e 1 servente.
    4. **Sugestões de Economia**: Onde o cliente pode economizar sem perder qualidade.

    Mantenha o tom profissional, direto e útil.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Não foi possível gerar o conselho no momento.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Erro ao conectar com a IA. Tente novamente mais tarde.";
  }
};