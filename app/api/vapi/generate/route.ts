// import { db } from "@/firebase/admin";
//
// export async function GET(req: Request) {
//     try {
//         const { searchParams } = new URL(req.url);
//         const interviewId = searchParams.get("interviewId");
//
//         if (!interviewId) {
//             return new Response(JSON.stringify({ error: "Missing interviewId" }), { status: 400 });
//         }
//
//         console.log("🔍 Fetching feedback for interview:", interviewId);
//
//         // Get the feedback document from Firestore
//         const doc = await db.collection("feedback").doc(interviewId).get();
//
//         if (!doc.exists) {
//             console.log("⚠️ No feedback found for interview:", interviewId);
//             return new Response(
//                 JSON.stringify({ success: true, feedback: null, message: "Feedback not found" }),
//                 { status: 200 }
//             );
//         }
//
//         const feedbackData = doc.data();
//         console.log("✅ Feedback found:", feedbackData.feedback?.slice(0, 200)); // log preview
//
//         return new Response(
//             JSON.stringify({
//                 success: true,
//                 feedback: feedbackData.feedback,
//                 message: "Feedback retrieved successfully",
//             }),
//             { status: 200 }
//         );
//     } catch (error) {
//         console.error("❌ Error fetching feedback:", error);
//         return new Response(JSON.stringify({ success: false, error: String(error) }), {
//             status: 500,
//         });
//     }
// }
//-----------working below
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";
import {NextResponse} from "next/server";

export async function POST(request: Request) {
    try {
        const { type, role, level, techstack, amount, userid } = await request.json();

        if (!userid || !role || !techstack) {
            console.error("❌ Missing required fields:", { userid, role, techstack });
            return Response.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        console.log("🧠 Generating interview for:", { type, role, level, techstack, amount });

        // 🧠 Generate AI questions
        const { text: questions } = await generateText({
            model: google("gemini-2.0-flash-001"),
            prompt: `Prepare ${amount || 5} interview questions for a ${role} position.
The experience level is ${level}.
Focus type: ${type}.
Tech stack: ${techstack}.
Return ONLY a JSON array like this:
["Question 1", "Question 2", "Question 3", ...]`,
        });

        let parsedQuestions: string[] = [];
        try {
            parsedQuestions = JSON.parse(questions);
        } catch (err) {
            console.warn("⚠️ Could not parse questions, fallback to text.");
            parsedQuestions = [questions];
        }

        // 🗂️ Create Firestore document
        const interviewData = {
            role,
            type,
            level,
            techstack: techstack.split(",").map((s) => s.trim()),
            questions: parsedQuestions,
            userId: userid,
            finalized: true,
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString(),
        };

        const newInterview = await db.collection("interviews").add(interviewData);

        console.log("✅ Interview saved with ID:", newInterview.id);

        return Response.json(
            { success: true, interviewId: newInterview.id },
            { status: 200 }
        );
    } catch (error) {
        console.error("❌ Error in POST /api/vapi/generate:", error);
        return Response.json(
            { success: false, message: "Internal Server Error", error: String(error) },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const interviewId = searchParams.get("interviewId");

    if (!interviewId) {
        return NextResponse.json({ error: "Missing interviewId" }, { status: 400 });
    }

    const feedbackDoc = await db.collection("feedback").doc(interviewId).get();

    if (!feedbackDoc.exists) {
        return NextResponse.json({ feedback: null, message: "Feedback not found" });
    }

    const feedbackData = feedbackDoc.data();

    console.log("✅ Feedback found:", feedbackData?.feedback); // <--- FIXED LINE

    return NextResponse.json({
        feedback: feedbackData?.feedback || "No feedback available",
        success: true,
    });
}


