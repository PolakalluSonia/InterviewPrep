import { NextResponse } from "next/server";
import { createFeedback } from "@/lib/actions/feedback.action";

export async function POST(request: Request) {
    try {
        const { interviewId, userId, transcript } = await request.json();

        if (!interviewId || !userId || !transcript) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        console.log("📩 Feedback request received:", interviewId);

        const result = await createFeedback({ interviewId, userId, transcript });

        if (result.success) {
            return NextResponse.json(
                { success: true, feedbackId: result.feedbackId },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { success: false, message: "Feedback creation failed" },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("❌ Error in POST /api/feedback:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
