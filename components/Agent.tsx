// components/Agent/Agent.tsx
'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { vapi, workflowId } from '@/lib/vapi.sdk';
import { createFeedback } from '@/lib/actions/feedback.action';
import { CallStatus, AgentProps } from './agents/types';
import { useCallStatus } from './agents/useCallStatus';
import { useVapiEvents } from './agents/useVapiEvents';
import { handleCall } from './agents/handleCall';

const Agent: React.FC<AgentProps> = ({ userName, userId, type, interviewId, questions }) => {
    const router = useRouter();
    const { callStatus, setCallStatus, messages, setMessages, isSpeaking, setIsSpeaking } =
        useCallStatus();

    useVapiEvents(vapi, setCallStatus, setMessages, setIsSpeaking);

    const handleGenerateFeedback = async (messages: any) => {
        console.log('Generate feedback');
        const { success, feedbackId: id } = await createFeedback({
            interviewId: interviewId!,
            userId: userId!,
            transcript: messages,
        });

        if (success && id) router.push(`/interview/${interviewId}/feedback`);
        else {
            console.error(`Error generating feedback with id ${id}`);
            router.push('/');
        }
    };

    // useEffect(() => {
    //     if (callStatus === CallStatus.FINISHED) {
    //         if (type === 'generate') router.push('/');
    //         else handleGenerateFeedback(messages);
    //     }
    // }, [messages, callStatus, type, userId]);

    //feedback

    useEffect(() => {
        if (callStatus === CallStatus.FINISHED) {
            if (type === 'generate') router.push('/');
            else handleGenerateFeedback(messages);
        }
    }, [messages, callStatus, type, userId]);


    const latestMessage = messages[messages.length - 1]?.content;
    const isCallInactiveOrFinished =
        callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

    return (
        <>
            <div className="call-view">
                <div className="card-interviewer">
                    <div className="avatar">
                        <Image
                            src="/covers/ai-avatar3.png"
                            alt="vapi"
                            width={60}
                            height={54}
                            className="object-cover"
                        />
                        {isSpeaking && <span className="animate-speak" />}
                    </div>
                    <h3>AI</h3>
                </div>

                <div className="card-border">
                    <div className="card-interviewer">
                        <Image
                            src="/covers/user-avatar2.png"
                            alt="user-avatar"
                            width={540}
                            height={540}
                            className="rounded-full object-cover size-[120px]"
                        />
                        <h3>{userName}</h3>
                    </div>
                </div>
            </div>

            {messages.length > 0 && (
                <div className="transcript-border">
                    <div className="transcript">
                        <p
                            key={latestMessage}
                            className={cn(
                                'transcript-opacity duration-500 opacity-0',
                                'animate-speak opacity-100'
                            )}
                        >
                            {latestMessage}
                        </p>
                    </div>
                </div>
            )}

            <div className="w-full flex justify-center">
                {callStatus !== CallStatus.ACTIVE ? (
                    <button
                        className="relative btn-call"
                        onClick={() => handleCall(setCallStatus, vapi, workflowId, userName, userId, type)}
                    >
            <span
                className={cn(
                    'absolute animate-ping rounded-full opacity=75',
                    callStatus !== CallStatus.CONNECTING && 'hidden'
                )}
            />
                        <span>{isCallInactiveOrFinished ? 'Call' : '. . .'}</span>
                    </button>
                ) : (
                    // <button className="btn-disconnect" onClick={() => vapi.stop()}>
                    //     END
                    // </button>

                    //feedbackk
                    <button
                        className="btn-disconnect"
                        onClick={async () => {
                            try {
                                console.log("🎤 Ending interview...");
                                await vapi.stop();

                                console.log("📤 Sending transcript to feedback API...");
                                const response = await fetch("/api/feedback", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        interviewId: interviewId!,
                                        userId: userId!,
                                        transcript: messages,
                                    }),
                                });

                                const { success, feedbackId } = await response.json();

                                if (success && feedbackId) {
                                    console.log("✅ Feedback generated successfully!");
                                    router.push(`/interview/${interviewId}/feedback`);
                                } else {
                                    console.error("❌ Feedback creation failed");
                                }
                            } catch (error) {
                                console.error("❌ Error ending interview:", error);
                            }
                        }}
                    >
                        END
                    </button>


                )}
            </div>
        </>
    );
};

export default Agent;
