import axios from "axios";

const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
const BASE_URL = "https://openrouter.ai/api/v1/chat/completions";

export const sendMessageToAI = async (message: string) => {
  try {
    const response = await axios.post(
      BASE_URL,
      {
        model: "openai/gpt-3.5-turbo-0125", // Latest OpenAI model via OpenRouter
        messages: [{ role: "user", content: message }],
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "Something went wrong. Please try again.";
  }
};
