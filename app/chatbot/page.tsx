"use client";

import React, { useState, useEffect, useRef } from "react";


// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import rehypeHighlight from "rehype-highlight";


interface Message {
    role: "user" | "assistant";
    text: string;
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>("");
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const chatEndRef = useRef<HTMLDivElement | null>(null);

    // 👇 Auto-scroll when new messages arrive
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    // 👇 Send user input to Gemini API
    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { role: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: input }),
            });

            const data = await response.json();
            const botMessage: Message = { role: "assistant", text: data.answer };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", text: "⚠️ Something went wrong. Please try again." },
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    // 👇 Handle Enter key
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") sendMessage();
    };

    return (
        <div className="flex flex-col min-h-screen bg-black text-white">
            {/* Header */}
            <div className="p-6 border-b border-gray-800">
                <h1 className="text-2xl font-bold text-center">AI-INTERVIEWER CHAT BOT</h1>
            </div>

            {/* Chat Window */}
            <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-950">
                {messages.length === 0 && (
                    <div className="text-center text-gray-400 mt-20">
                        💬 Start chatting with AI-INTERVIEWER about coding or general topics!
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex mb-3 ${
                            msg.role === "user" ? "justify-end" : "justify-start"
                        }`}
                    >
                        <div

                            className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                                msg.role === "user"
                                    ? "bg-violet-400 text-white"
                                    : "bg-gray-900 text-gray-100"
                            }`}
                        >
                            {msg.text}
                        </div>


                        {/*<div*/}
                        {/*    className={`max-w-[75%] px-4 py-2 rounded-2xl whitespace-pre-wrap ${*/}
                        {/*        msg.role === "user"*/}
                        {/*            ? "bg-purple-600 text-white"*/}
                        {/*            : "bg-gray-800 text-gray-100"*/}
                        {/*    }`}*/}
                        {/*>*/}
                        {/*    <ReactMarkdown*/}
                        {/*        remarkPlugins={[remarkGfm]}*/}
                        {/*        rehypePlugins={[rehypeHighlight]}*/}
                        {/*        className="prose prose-invert"*/}
                        {/*    >*/}
                        {/*        {msg.text}*/}
                        {/*    </ReactMarkdown>*/}
                        {/*</div>*/}

                    </div>
                ))}

                {/* Typing animation */}
                {isTyping && (
                    <div className="flex items-center gap-2 text-gray-400">
                        <div className="flex space-x-1 mt-2">
                            <span className="animate-bounce">•</span>
                            <span className="animate-bounce [animation-delay:0.2s]">•</span>
                            <span className="animate-bounce [animation-delay:0.4s]">•</span>
                        </div>
                        <p>AI is typing...</p>
                    </div>
                )}

                <div ref={chatEndRef} />
            </div>

            {/* Input Box */}
            <div className="flex gap-2 items-center p-4 border-t border-gray-800 bg-gray-900">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask Gemini anything..."
                    className="flex-1 p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                    onClick={sendMessage}
                    className="bg-violet-500 hover:bg-violet-600 px-5 py-2.5 rounded-lg font-semibold"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
