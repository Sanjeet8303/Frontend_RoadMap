import { GoogleGenAI, Type } from "@google/genai";
import { RoadmapStep } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is not set");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateRoadmap = async (topic: string): Promise<RoadmapStep[]> => {
  const ai = getClient();
  
  const systemInstruction = `
    You are a senior engineering mentor. 
    Create a structured learning roadmap for the given topic. 
    The roadmap should have exactly 7 steps.
    Each step needs a title, a short punchy description, an estimated duration, and a category.
    Use 'core', 'advanced', 'tooling', or 'soft-skills' for category.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Create a learning roadmap for: ${topic}`,
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            duration: { type: Type.STRING },
            category: { type: Type.STRING, enum: ['core', 'advanced', 'tooling', 'soft-skills'] }
          },
          required: ['id', 'title', 'description', 'duration', 'category']
        }
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");

  try {
    const rawSteps = JSON.parse(text) as RoadmapStep[];
    // Assign random icons locally as the AI might not know our icon set names perfectly
    const icons = ['Globe', 'Palette', 'Braces', 'Code2', 'Atom', 'Server', 'Rocket'];
    
    return rawSteps.map((step, index) => ({
      ...step,
      id: (index + 1).toString(), // Ensure sequential IDs
      iconName: icons[index % icons.length]
    }));
  } catch (error) {
    console.error("Failed to parse AI response", error);
    throw new Error("Failed to generate valid roadmap data");
  }
};