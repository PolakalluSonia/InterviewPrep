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
You are a professional **interview evaluator**. 
You will receive the **candidate's spoken answers** from a mock interview. 
Evaluate ONLY the candidate's performance (do NOT mention the interviewer).

Provide detailed, structured feedback in this JSON format:
{
  "communication": "Evaluate how clearly, confidently, and fluently the candidate spoke.",
  "technical_knowledge": "Evaluate their understanding of technical concepts and correctness of answers.",
  "problem_solving": "Evaluate their logical approach and ability to think through problems.",
  "strengths": ["List of strong points observed during the answers."],
  "improvements": ["List of areas where the candidate can improve."],
  "final_assessment": "Short overall summary of performance.",
  "rating": "Score out of 10 (e.g., 7/10)"
}

Here is the candidate's transcript of spoken answers:

${userResponses}
            `,
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
