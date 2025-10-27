"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function FeedbackPage() {
    const { id: interviewId } = useParams();
    const [feedback, setFeedback] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                if (!interviewId) return;

                console.log("🔎 Fetching feedback for interview:", interviewId);

                const res = await fetch(`/api/vapi/generate?interviewId=${interviewId}`);
                const data = await res.json();

                console.log("📨 Full Feedback API Response:", data);

                // ✅ Handle both string and JSON cases
                const rawFeedback =
                    typeof data.feedback === "string"
                        ? data.feedback
                        : data.feedback?.feedback || data.feedback;

                if (!rawFeedback) {
                    console.warn("⚠️ No feedback data found");
                    setFeedback(null);
                    return;
                }

                // ✅ Parse JSON safely
                // ✅ Parse JSON safely
                try {
                    let cleaned = rawFeedback;

                    // 🧹 Step 1: Extract only the JSON part if Gemini added extra text
                    const jsonMatch = rawFeedback.match(/{[\s\S]*}/);
                    if (jsonMatch) {
                        cleaned = jsonMatch[0];
                    }

                    // 🧠 Step 2: Try parsing again
                    const parsed =
                        typeof cleaned === "string" ? JSON.parse(cleaned) : cleaned;

                    setFeedback(parsed);
                } catch (err) {
                    console.warn("⚠️ Could not parse feedback JSON, showing as plain text.", err);
                    setFeedback({ overall_feedback: rawFeedback });
                }

            } catch (err) {
                console.error("❌ Error fetching feedback:", err);
                setFeedback(null);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedback();
    }, [interviewId]);

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-gray-600">
                Loading feedback...
            </div>
        );
    }

    // No feedback
    if (!feedback) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-700 p-6">
                <div className="max-w-2xl w-full shadow-lg rounded-2xl bg-gray-700 border border-gray-700 p-6 text-center">
                    <h1 className="text-2xl font-bold mb-4 text-gray-700">Interview Feedback</h1>
                    <p className="text-gray-600">No feedback found for this interview.</p>
                    <button
                        onClick={() => (window.location.href = "/")}
                        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    // Render feedback content
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 p-8">
            <div className="max-w-3xl w-full shadow-lg rounded-2xl bg-gray-800 border border-gray-800 p-8">
                <h1 className="text-3xl font-bold text-center mb-8 text-slate-100"> Interview Feedback</h1>

                {feedback.communication && (
                    <Section title="🗣 Communication" text={feedback.communication} color="text-violet-400" />
                )}

                {feedback.technical_knowledge && (
                    <Section title="💻 Technical Knowledge" text={feedback.technical_knowledge} color="text-blue-400" />
                )}

                {feedback.problem_solving && (
                    <Section title="🧩 Problem Solving" text={feedback.problem_solving} color="text-orange-400" />
                )}

                {feedback.strengths && (
                    <ListSection title="💪 Strengths" items={feedback.strengths} color="text-green-400" />
                )}

                {feedback.improvements && (
                    <ListSection title="⚠️ Areas for Improvement" items={feedback.improvements} color="text-red-400" />
                )}

                {feedback.final_assessment && (
                    <Section title="🧠 Final Assessment" text={feedback.final_assessment} color="text-indigo-400" />
                )}

                {feedback.rating && (
                    <div className="text-center mt-8">
                        <span className="text-lg font-semibold text-slate-100">⭐ Overall Rating: </span>
                        <span className="text-xl font-bold text-green-400">{feedback.rating}</span>
                    </div>
                )}

                <div className="flex justify-center mt-10">
                    <button
                        onClick={() => (window.location.href = "/")}
                        className="px-5 py-2 bg-violet-500 text-slate-100 font-medium rounded-md hover:bg-violet-400"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}

function Section({ title, text, color }: any) {
    return (
        <div className="mb-6">
            <h2 className={`text-xl font-semibold mb-3 ${color}`}>{title}</h2>
            <p className="text-gray-200 leading-relaxed">{text}</p>
        </div>
    );
}

function ListSection({ title, items, color }: any) {
    return (
        <div className="mb-6">
            <h2 className={`text-xl font-semibold mb-3 ${color}`}>{title}</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                {items.map((point: string, i: number) => (
                    <li key={i}>{point}</li>
                ))}
            </ul>
        </div>
    );
}


