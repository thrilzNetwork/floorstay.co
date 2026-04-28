import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getConciergeResponse(prompt: string, context: string, mode: 'owner' | 'guest') {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: mode === 'owner' 
          ? `You are the FloorStay Tenant AI Agent. Assist the property owner (merchant) in optimizing their business.
             KNOWLEDGE BASE & BRAND: ${context}
             Focus: Strategic optimization, SEO, and direct booking growth.`
          : `You are the Property Concierge. Assist the guest who is looking at the property storefront.
             KNOWLEDGE BASE & BRAND: ${context}
             Focus: Helpful, polite answers about property rules, amenities, and local tips to encourage booking.`
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I am having trouble connecting to my brain. Please try again in a moment.";
  }
}
