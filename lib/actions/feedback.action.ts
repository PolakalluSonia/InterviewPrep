"use server";

import { db } from "@/firebase/admin";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function createFeedback({ interviewId, userId, transcript }: any) {
    try {
        if (!interviewId || !userId || !transcript) {
            throw new Error("Missing required fields");
        }

        console.log("🧠 Creating feedback for interview:", interviewId);

        // ✅ Extract only the candidate's spoken responses (user messages)
        const userResponses = Array.isArray(transcript)
            ? transcript
                .filter((msg: any) => msg.role === "user")
                .map((msg: any) => msg.content)
                .join("\n\n")
            : transcript;

        console.log("🎤 Extracted candidate responses:", userResponses.slice(0, 100));

        // ✅ Ask Gemini to evaluate the candidate's performance
        const { text } = await generateText({
            model: google("gemini-2.0-flash-001"),
            prompt: `
You are a **supportive and fair interview evaluator**. 
You will receive the candidate's spoken answers from a mock interview.

Your goal is to give **balanced feedback** — it should sound **motivating, polite, and professional**, 
not harsh or discouraging. 

✅ Emphasize their **strengths and positive qualities** first.  
⚠️ Then, gently highlight **specific mistakes or areas to improve**, phrased as advice, not criticism.  
⭐ End with an encouraging note about their potential for growth.  

Use this JSON format exactly:
{
  "communication": "Evaluate how clearly, confidently, and fluently the candidate spoke. Mention positives first, then suggest specific improvements.",
  "technical_knowledge": "Comment on their understanding of technical topics. Appreciate what they knew, and explain what to strengthen.",
  "problem_solving": "Assess their logic and reasoning ability. Mention good attempts, then add improvement tips.",
  "strengths": ["Positive qualities observed during answers."],
  "improvements": ["Specific mistakes or habits to correct."],
  "final_assessment": "Encouraging summary that motivates them to improve.",
  "rating": "Score out of 10 (balanced and fair, not extreme)."
}

Here is the candidate's transcript of spoken answers:

${userResponses}
`

        });

        console.log("✅ Gemini feedback generated successfully!");

        // ✅ Save the feedback into Firestore
        const feedbackDoc = {
            interviewId,
            userId,
            feedback: text,
            createdAt: new Date().toISOString(),
        };

        const ref = db.collection("feedback").doc(interviewId);
        await ref.set(feedbackDoc);

        console.log("🔥 Feedback saved in Firestore for:", ref.id);
        return { success: true, feedbackId: ref.id };
    } catch (error) {
        console.error("❌ Feedback generation failed:", error);
        return { success: false, error: String(error) };
    }
}


