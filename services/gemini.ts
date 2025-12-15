import { UserContext } from "../types";

export const generateAIResponse = async (
  message: string,
  context: UserContext,
  history: { role: "user" | "model"; text: string }[]
): Promise<string> => {
  try {
    const systemInstruction = `You are Dialog.uz AI assistant.
Respond in ${context.language}.`;

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

    const data = await res.json();

    if (data.error) {
      return "Server error: " + data.error;
    }

    return data.reply || "No response";
  } catch (error) {
    console.error("Frontend error:", error);
    return "Connection error. Please try again.";
  }
};
