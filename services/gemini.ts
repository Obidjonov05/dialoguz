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
      history, // hozircha server ishlatmaydi, lekin zarar ham yo‘q
    }),
  });

  const data = await res.json();
  return data.reply || "No response from server";
};
