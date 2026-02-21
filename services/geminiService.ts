
import { GoogleGenAI } from "@google/genai";

export async function getSmartHospitalTip(): Promise<string> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate a short, reassuring one-sentence tip for relatives waiting in a hospital surgical department. Focus on comfort, patience, or health. Keep it under 15 words.",
    });
    return response.text || "Our medical team is committed to providing the best care for your loved ones.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Thank you for your patience. Your family's health is our priority.";
  }
}
