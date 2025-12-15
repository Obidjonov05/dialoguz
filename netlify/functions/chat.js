export default async function handler(event) {
  try {
    // 1. API KEY ni serverdan olish
    const API_KEY = process.env.API_KEY;

    if (!API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "API_KEY missing on server" }),
      };
    }

    // 2. Frontenddan kelgan ma'lumot
    const { message, systemInstruction, history } = JSON.parse(event.body);

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Message is required" }),
      };
    }

    // 3. Gemini API chaqiruvi
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
                  text: `${systemInstruction}\n\nUser: ${message}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI";

    // 4. Frontendga javob qaytarish
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
