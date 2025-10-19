"use client";
import { useState } from "react";

export default function ScheduleInterviewPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        date: "",
        time: "",
        role: ""
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // const handleSubmit = (e: any) => {
    //     e.preventDefault();
    //
    //     // Validate required fields (role is optional)
    //     if (!form.name || !form.email || !form.date || !form.time) {
    //         alert("Please fill all the required fields");
    //         return;
    //     }
    //
    //     setSubmitted(true);
    // };
    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!form.name || !form.email || !form.date || !form.time) {
            alert("Please fill all the required fields");
            return;
        }

        const res = await fetch("/api/sendMail", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        const data = await res.json();
        if (data.success) {
            setSubmitted(true);
        } else {
            alert("Email failed. Try again.");
        }
    };


    return (
        <div className="w-full max-w-md mx-auto mt-20 text-white">
            <h2 className="text-2xl font-bold mb-6">Schedule Your Interview</h2>

            {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        name="name"
                        type="text"
                        placeholder="Full Name *"
                        className="w-full p-3 rounded bg-gray-800"
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="email"
                        type="email"
                        placeholder="Email *"
                        className="w-full p-3 rounded bg-gray-800"
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="date"
                        type="date"
                        className="w-full p-3 rounded bg-gray-800"
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="time"
                        type="time"
                        className="w-full p-3 rounded bg-gray-800"
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="role"
                        type="text"
                        placeholder="Interview Role (optional)"
                        className="w-full p-3 rounded bg-gray-800"
                        onChange={handleChange}
                    />

                    <button
                        type="submit"
                        className="w-full p-3 bg-purple-600 rounded hover:bg-purple-700"
                    >
                        Submit
                    </button>
                </form>
            ) : (
                <p className="text-green-400 font-semibold text-center mt-6">
                    ✅ You will be notified
                </p>
            )}
        </div>
    );
}
