import axios from "axios";

const deepSeekHttp = axios.create({
  baseURL: "https://api.deepseek.com",
  timeout: 60000,
});

export async function sendDeepSeekChat(messages) {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("Missing DeepSeek API key");
  }

  const model = import.meta.env.VITE_DEEPSEEK_MODEL || "deepseek-chat";
  const { data } = await deepSeekHttp.post(
    "/chat/completions",
    {
      model,
      messages,
      temperature: 0.3,
      max_tokens: 900,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    },
  );

  return data?.choices?.[0]?.message?.content?.trim() || "";
}
