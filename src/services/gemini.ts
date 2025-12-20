// src/services/gemini.ts

// <--- BU YERGA O'ZINGIZNING API KEYINGIZNI YOZING! --->
const API_KEY = "AIzaSy..."; // Google AI Studio'dan olgan keyingizni shu yerga qo'ying!

export async function generateAIResponse(
  message: string,
  user: any,
  history: { role: string; text: string }[] = []
): Promise<string> {
  try {
    const contents = [
      ...history.map((msg) => ({
        role: msg.role === "model" ? "model" : "user",
        parts: [{ text: msg.text }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contents }),
      }
    );

    if (!response.ok) {
      return "AI javob bera olmadi. Internetni tekshiring.";
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Javob yo'q.";
  } catch (error) {
    return "Internet aloqasi yo'q. Sahifani yangilab ko'ring.";
  }
}
