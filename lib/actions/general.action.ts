import {db} from "@/firebase/admin";

import {generateObject} from "ai";
import {feedbackSchema} from "@/constants";
import {google} from "@ai-sdk/google";
//import {google} from "@ai-sdk/google";
//import {id} from "zod/v4/locales";

export async function getInterviewsByUserId(userId:string):Promise<Interview[] | null>
{
    const interviews = await db
        .collection('interviews')
        .where('userId','==',userId)
        .orderBy('createdAt', 'desc')
        .get();
    return interviews.docs.map((doc)=>({
        id:doc.id,
        ...doc.data()

    })) as Interview[];


}
//
export async function getLatestInterviews(params:GetLatestInterviewsParams):Promise<Interview[] | null>
{
    const {userId,limit = 20} = params;
    const interviews = await db
        .collection('interviews')
        .where('userId','!=',userId)
        .where('finalized','==',true)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

    return interviews.docs.map((doc)=>({
        id:doc.id,
        ...doc.data()

    })) as Interview[];


}
//
export async function getInterviewsById(id:string):Promise<Interview | null>
{
    const interview = await db
        .collection('interviews')
        .doc(id)
        .get();
    return interview.data() as Interview | null;




}
//


export async function getFeedbackByInterviewId(interviewId: string) {
    try {
        console.log("🔎 Fetching feedback for interview:", interviewId);
        const snapshot = await db.collection("feedback")
            .where("interviewId", "==", interviewId)
            .get();

        if (snapshot.empty) {
            console.log("⚠️ No feedback found in Firestore");
            return null;
        }

        const data = snapshot.docs[0].data();
        console.log("✅ Feedback found:", data.feedbackText?.slice(0, 100));

        // Match the exact field name stored in Firestore
        return data.feedbackText || data.feedback || null;
    } catch (error) {
        console.error("❌ Error fetching feedback:", error);
        return null;
    }
}
