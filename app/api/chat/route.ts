import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

const googleProvider = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

export async function POST(req: Request) {
    try {
        const { question } = await req.json();

        if (!question || question.trim() === "") {
            return Response.json({ answer: "Please enter a question first!" });
        }

        const { text } = await generateText({
            model: googleProvider("gemini-1.5-flash"),
            prompt: `
        You are a friendly and helpful AI chatbot. 
        Answer the question clearly and conversationally.

        User's question: ${question}
      `,
        });

        return Response.json({ answer: text });
    } catch (error: any) {
        console.error("❌ Gemini API Error:", error);
        return Response.json({
            answer: "⚠️ Gemini API error. Please try again later.",
        });
    }
}
