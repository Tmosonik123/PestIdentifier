import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

interface IdentificationResult {
  type: "pest" | "disease";
  name: string;
  confidence: number;
  description: string;
  threatLevel: "low" | "medium" | "high";
  controlMethods: string[];
  affectedPlants: string[];
  symptoms?: string[];
}

export async function identifyFromImage(
  imageBase64: string,
): Promise<IdentificationResult> {
  try {
    // Remove the data URL prefix to get just the base64 data
    const base64Data = imageBase64.split(",")[1];

    // Get the model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature: 0.4,
        topP: 0.8,
        maxOutputTokens: 1024,
      },
    });

    // Create the prompt
    const prompt = `You are an expert entomologist and plant pathologist. First, analyze this garden image and determine if there are any visible pests or plant diseases present.

If NO pests or diseases are visible, respond with exactly:
{"error": "no_disease_found"}

If a pest or disease IS visible, respond with a valid JSON object in this format:
{
"type": "pest",
"name": "Common name",
"confidence": 85,
"description": "Brief description",
"threatLevel": "low",
"controlMethods": ["method 1", "method 2"],
"affectedPlants": ["plant 1", "plant 2"],
"symptoms": ["symptom 1", "symptom 2"]
}

Respond ONLY with the JSON - no additional text or markdown.`;

    // Generate content
    const result = await model.generateContent([
      {
        text: prompt,
      },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    // Clean the response text to ensure valid JSON
    let cleanText = text.trim();
    // Remove any markdown code blocks if present
    cleanText = cleanText.replace(/```json\n?|```/g, "");
    // Remove any trailing commas before closing braces/brackets
    cleanText = cleanText.replace(/,([\s\r\n]*[}\]])/g, "$1");

    try {
      return JSON.parse(cleanText);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.log("Attempted to parse:", cleanText);
      throw new Error("Failed to parse AI response as JSON");
    }
  } catch (error) {
    console.error("Error identifying image:", error);
    throw error;
  }
}
