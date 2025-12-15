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

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: `${systemInstruction || ""}\n\nUser: ${message}` }
              ]
            }
          ]
        }),
      }
    );

    const data = await res.json();

    // 🔥 DEBUG (agar xato bo‘lsa ko‘rish uchun)
    if (data.error) {
      return new Response(
        JSON.stringify({ reply: "Gemini error: " + data.error.message }),
        { status: 200 }
      );
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Gemini javob bermadi";

    return new Response(
      JSON.stringify({ reply }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (e) {
    return new Response(
      JSON.stringify({ reply: "Server error: " + e.message }),
      { status: 500 }
    );
  }
}
