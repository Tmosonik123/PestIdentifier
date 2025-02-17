import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

if (!import.meta.env.VITE_GEMINI_API_KEY) {
  console.error("Missing VITE_GEMINI_API_KEY environment variable");
}

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

export async function getAgriResponse(
  prompt: string,
  location?: LocationInfo,
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      generationConfig: {
        temperature: 0.3,
        topP: 0.8,
        maxOutputTokens: 500,
      },
    });

    const result = await model.generateContent(
      `You are an agricultural expert. Provide a practical response to this farming/gardening question with the following structure:

1. Brief Problem Analysis (1-2 sentences)
2. Recommended Products (2-3 specific brands available in ${location?.country || "the user's"} region)
   For each product include:
   - Brand name and active ingredient
   - Application rate/dosage
   - Application method/procedure
   - Safe days before harvest
   - Safety precautions
3. Additional non-chemical control methods (if applicable)

Keep the total response under 200 words and focus on products legally approved in ${location?.country || "the user's"} region.

Question: ${prompt}`,
    );

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error getting AI response:", error);
    throw error;
  }
}

export async function identifyFromImage(
  imageBase64: string,
  location?: LocationInfo,
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
    const prompt = `You are an expert entomologist and plant pathologist. You are providing advice for a user in ${location?.country || "unknown location"}. First, analyze this garden image and determine if there are any visible pests or plant diseases present.

If NO pests or diseases are visible, respond with exactly:
{"error": "no_disease_found"}

If a pest or disease IS visible, respond with a valid JSON object in this format:
{
"type": "pest",
"name": "Common name",
"confidence": 85,
"description": "Brief description",
"threatLevel": "low",
"controlMethods": [
  {
    "method": "Chemical Control",
    "products": [
      {
        "brandName": "Specific commercial product name",
        "activeIngredient": "Chemical name and concentration",
        "applicationRate": "Exact measurement (e.g., 2.5ml/L water)",
        "applicationMethod": "Detailed application instructions",
        "safeDays": "Specific number of days before harvest",
        "safetyPrecautions": "List of required PPE and safety measures"
      },
      {
        "brandName": "Alternative commercial product",
        "activeIngredient": "Different chemical class for resistance management",
        "applicationRate": "Exact measurement",
        "applicationMethod": "Detailed instructions",
        "safeDays": "Days before harvest",
        "safetyPrecautions": "Safety requirements"
      }
    ]
  },
  {
    "method": "Organic Control",
    "products": [
      {
        "brandName": "Organic product name",
        "activeIngredient": "Natural active ingredient",
        "applicationRate": "Specific measurements",
        "applicationMethod": "Application instructions",
        "safeDays": "Days before harvest",
        "safetyPrecautions": "Safety measures"
      }
    ]
  },
  {
    "method": "Cultural Control",
    "description": "Prevention and management practices"
  }
],
"affectedPlants": ["plant 1", "plant 2"],
"symptoms": ["symptom 1", "symptom 2"]
}

IMPORTANT GUIDELINES:
1. For Chemical Control, ALWAYS include at least 2 different chemical class products for resistance management
2. Include SPECIFIC brand names of products that are legally registered and available
3. Provide EXACT application rates and measurements
4. List SPECIFIC safety equipment required (e.g., "nitrile gloves, N95 mask, goggles")
5. Include actual number of days for safe harvest intervals

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
