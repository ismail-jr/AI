import axios from "axios";

const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
const BASE_URL = "https://openrouter.ai/api/v1/chat/completions";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

//  Store chat history in an array
const chatHistory: ChatMessage[] = [
  {
    role: "system",
    content: `You are an **AI-powered student assistant**, designed to support students across all fields. You provide academic help, career guidance, technical support, and personal development tips.

       **Academic Support:**
      - Assist with study techniques, time management, and research guidance.
      - Explain difficult topics in a simplified way.
      - Provide insights on effective learning strategies.

       **Scholarship & Internship Assistance:**
      - Guide students on applying for scholarships, grants, and internships.
      - Help craft compelling applications and essays.
      - Share useful websites and opportunities.

       **Personal Development & Soft Skills:**
      - Improve communication, leadership, and teamwork skills.
      - Offer motivation and mental well-being tips for students.
      - Guide students on networking and public speaking.

       **Entrepreneurship & Startup Advice:**
      - Provide tips for starting a business as a student.
      - Suggest business ideas based on skills and interests.
      - Explain financial management and funding strategies.

       **Job Market Insights & Career Growth:**
      - Provide career guidance, resume-building tips, and interview prep.
      - Analyze job market trends and suggest relevant industries.
      - Recommend online courses and certifications.

      **Technical & Coding Assistance:**
      - Debug and fix code errors while explaining the issues.
      - Provide optimized coding solutions and best practices.
      - If the user message contains code, structure your response as:
         **Explanation of Errors**
         **Fixed Code (inside triple backticks for easy copying)**

       Always respond in a structured, easy-to-understand manner tailored to the student's needs.`,
  },
];

export const sendMessageToAI = async (message: string): Promise<string> => {
  // Validate API key
  if (!OPENROUTER_API_KEY) {
    console.error("OpenRouter API key is missing");
    return "API configuration error. Please check your environment variables.";
  }

  try {
    //  Add the user's message to history
    chatHistory.push({ role: "user", content: message });

    const response = await axios.post<OpenRouterResponse>(
      BASE_URL,
      {
        model: "openai/gpt-3.5-turbo",
        messages: chatHistory,
        max_tokens: 700,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer":
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          "X-Title": "Student Assistant App",
        },
        timeout: 30000, // 30 second timeout
      },
    );

    // Validate response structure
    if (!response.data?.choices?.[0]?.message?.content) {
      throw new Error("Invalid response structure from OpenRouter");
    }

    const aiResponse = response.data.choices[0].message.content;

    // Optionally add AI response to history for longer conversations
    // chatHistory.push({ role: "assistant", content: aiResponse });

    return aiResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });

      // Handle specific error cases
      if (error.response?.status === 401) {
        return "Authentication error. Please check your API key.";
      } else if (error.response?.status === 429) {
        return "Rate limit exceeded. Please try again later.";
      }
    } else {
      console.error("Unexpected error:", error);
    }

    return "Something went wrong. Please try again.";
  }
};

// Optional: Function to clear chat history
export const clearChatHistory = () => {
  chatHistory.length = 1; // Keep only the system message
};

// Optional: Function to get current chat history
export const getChatHistory = () => chatHistory;
