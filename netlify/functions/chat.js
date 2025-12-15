export default async function handler(request) {
  try {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
      return new Response("API_KEY missing", { status: 500 });
    }

    const { message, systemInstruction } = await request.json();

    if (!message) {
      return new Response("Message required", { status: 400 });
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${systemInstruction || ""}\n${message}` }],
            },
          ],
        }),
      }
    );

    const data = await res.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini";

    return new Response(
      JSON.stringify({ reply }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (e) {
    return new Response(
      JSON.stringify({ error: e.message }),
      { status: 500 }
    );
  }
}
