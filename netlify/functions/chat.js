import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(event) {
  try {
    // 1. API KEY olish
    const API_KEY = process.env.GEMINI_API_KEY; // Environment variable nomi o'zgartirdim – aniqroq

    if (!API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "GEMINI_API_KEY missing on server" }),
      };
    }

    // 2. Frontenddan kelgan ma'lumot
    const body = JSON.parse(event.body || "{}");
    const { message, history = [], systemInstruction } = body;

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Message is required" }),
      };
    }

    // 3. Google Generative AI klientini yaratish
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // yoki "gemini-1.5-pro"
      systemInstruction: systemInstruction || undefined, // System prompt shu yerdan beriladi
    });

    // 4. History ni to'g'ri formatga o'tkazish
    const chatHistory = history.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user", // Gemini "model" deb ataydi assistantni
      parts: [{ text: msg.text }],
    }));

    // 5. Yangi suhbat boshlash va javob olish
    const chat = model.startChat({
      history: chatHistory,
    });

    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    // 6. Javob qaytarish
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // CORS uchun (productionda o'zingizning domenni qo'ying)
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    console.error("Error:", err);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        error: "AI javob bera olmadi",
        details: err.message,
      }),
    };
  }
}

// Netlify Functions uchun export
export const config = {
  path: "/api/chat", // ixtiyoriy: /api/chat orqali chaqiriladi
};
