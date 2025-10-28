import { GoogleGenAI } from "@google/genai";
import { type Message } from "@shared/schema";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function chatWithGemini(conversationHistory: Message[]): Promise<string> {
  try {
    const systemPrompt = `You are Chicho AI, a helpful and friendly AI assistant. 
You provide clear, concise, and accurate responses to user questions.
Be conversational and engaging while remaining professional and helpful.`;

    const contents = conversationHistory.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      config: {
        systemInstruction: systemPrompt,
      },
      contents,
    });

    const text = response.text;
    
    if (!text) {
      throw new Error("Empty response from Gemini");
    }
    
    return text;
  } catch (error) {
    console.error("Gemini API error:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to communicate with Chicho AI: ${error.message}`);
    }
    throw new Error("Failed to communicate with Chicho AI. Please try again.");
  }
}
