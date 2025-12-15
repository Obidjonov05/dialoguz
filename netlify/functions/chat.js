export default async function handler(event) {
  try {
    // 1️⃣ API KEY ni Netlify Environment Variables dan olish
    const API_KEY = process.env.API_KEY;

    if (!API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "API_KEY missing on server" }),
      };
    }

    // 2️⃣ Faqat POST ruxsat beramiz
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    // 3️⃣ Frontenddan kelgan data
    const body = JSON.parse(event.body || "{}");
    const message = body.message;
    const systemInstruction = body.systemInstruction || "";
    const history = body.history || [];

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Message is required" }),
      };
    }

    // 4️⃣ Gemini API ga to‘g‘ri formatda so‘rov
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${systemInstruction}\n\nUser message:\n${message}`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Gemini API error",
          details: errorText,
        }),
      };
    }

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI";

    // 5️⃣ Frontendga toza javob
    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Function crashed",
        details: err.message,
      }),
    };
  }
}
