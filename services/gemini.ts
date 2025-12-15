// src/services/gemini.ts

export const generateAIResponse = async (
  message: string,
  systemInstruction: string,
  history: { role: 'user' | 'model'; text: string }[]
): Promise<string> => {
  const res = await fetch("/.netlify/functions/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      systemInstruction,
      history,
    }),
  });

  // ❗ server JSON bermasa shu yerda xato chiqadi
  if (!res.ok) {
    return "Server error";
  }

  const data = await res.json();
  return data.reply || "No response from server";
};
