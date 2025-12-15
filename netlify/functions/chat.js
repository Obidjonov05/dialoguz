export default async function handler(req) {
  try {
    const API_KEY = process.env.API_KEY;

    if (!API_KEY) {
      return new Response(
        JSON.stringify({ error: "API_KEY missing" }),
        { status: 500 }
      );
    }

    const body = await req.json();
    const message = body.message;

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message required" }),
        { status: 400 }
      );
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: message }]
            }
          ]
        })
      }
    );

    const data = await res.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini";

    return new Response(
      JSON.stringify({ reply }),
      {
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}
