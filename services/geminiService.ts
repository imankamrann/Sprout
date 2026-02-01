import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { Scenario } from "../types";

// Schema for the expected JSON response from Gemini
const scenarioSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    question: {
      type: Type.STRING,
      description: "The scenario description or question text.",
    },
    options: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 3 possible choices for the user.",
    },
    correctAnswerIndex: {
      type: Type.INTEGER,
      description: "The index (0-2) of the best financial choice.",
    },
    explanation: {
      type: Type.STRING,
      description: "A short, kid-friendly explanation of why the answer is correct.",
    },
    reward: {
      type: Type.OBJECT,
      properties: {
        xp: { type: Type.INTEGER },
        coins: { type: Type.INTEGER },
      },
      description: "The reward for getting this question right (e.g., 10-20 XP, 5-10 coins).",
    }
  },
  required: ["question", "options", "correctAnswerIndex", "explanation", "reward"],
};

export const generateFinancialScenario = async (): Promise<Scenario> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    // Fallback for demo purposes if no key is provided, so the UI doesn't break
    console.warn("No API_KEY found. Returning mock data.");
    return {
      question: "You earned $10 from your lemonade stand! What should you do first?",
      options: ["Spend it all on candy", "Save $5 and spend $5", "Hide it under your bed"],
      correctAnswerIndex: 1,
      explanation: "Saving half helps you buy something bigger later!",
      reward: { xp: 15, coins: 10 }
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate a fun financial scenario for a kid.",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: scenarioSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as Scenario;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback on error
    return {
      question: "Your grandma gave you $20 for your birthday. What is a smart move?",
      options: ["Buy 20 chocolate bars", "Put it in a savings jar", "Lose it in the park"],
      correctAnswerIndex: 1,
      explanation: "Saving money keeps it safe and helps it grow!",
      reward: { xp: 20, coins: 5 }
    };
  }
};