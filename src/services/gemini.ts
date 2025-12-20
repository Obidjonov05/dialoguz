import { UserContext } from "../types";

interface HistoryItem {
  role: "user" | "model";
  text: string;
}

export async function generateAIResponse(
  message: string,
  user: UserContext,
  history: HistoryItem[]
): Promise<string> {
  // vaqtincha MOCK javob (API ulanguncha)
  if (message.toLowerCase().includes("ready")) {
    return "[CORRECT] Zo‘r! Keling birinchi savoldan boshlaymiz 😊";
  }

  if (message.toLowerCase().includes("math")) {
    return "2 + 2 nechaga teng?";
  }

  return "Savolingni aniqroq yozib ber 🙂";
}
