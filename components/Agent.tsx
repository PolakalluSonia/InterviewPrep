"use client"
import React, {useEffect, useState} from 'react'
import Image from 'next/image';
import {buttonVariants} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {useRouter} from "next/navigation";
import {vapi,workflowId} from "@/lib/vapi.sdk";

enum CallStatus
{
    INACTIVE='INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
}
interface SavedMessage{
    role: 'user' | 'system' | 'assistant';
    content: string;
}
const Agent = ({userName,userId,type}:AgentProps) => {
    // const callStatus = CallStatus.ACTIVE;
    const [isSpeaking, setIsSpeaking] = useState(false);
    const router = useRouter();
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);//use state
    const[messages,setMessages] = useState<SavedMessage[]>([]);
    useEffect(() => {
        const onCallStart = ()  => setCallStatus(CallStatus.ACTIVE);
        const onCallEnd = ()  => setCallStatus(CallStatus.FINISHED);
        const onMessage = (message:Message) => {

            if(message.type === 'transcript' && message.transcriptType === 'final')
            {
                const newMessage = {role: message.role,content:message.transcript};
                setMessages((prev)=>[...prev,newMessage]);
            }
        }
        const onSpeechStart = () => setIsSpeaking(true);
        const onSpeechEnd = () => setIsSpeaking(false);
        const onError = (error:Error) => console.log('Error',error);
        //vapi event listeners
        vapi.on('call-start', onCallStart);
        vapi.on('call-end', onCallEnd);
        vapi.on('message', onMessage);
        vapi.on('speech-start', onSpeechStart);
        vapi.on('speech-end', onSpeechEnd);
        vapi.on('error', onError);
        return () => {
            vapi.off('call-start', onCallStart);
            vapi.off('call-end', onCallEnd);
            vapi.off('message', onMessage);
            vapi.off('speech-start', onSpeechStart);
            vapi.off('speech-end', onSpeechEnd);
            vapi.off('error', onError);
        }
    },[] )
    useEffect(() => {
        if(callStatus === CallStatus.FINISHED) router.push('/');
    }, [messages,callStatus,type,userId]);
    // const handleCall = async () => {
    //     setCallStatus(CallStatus.CONNECTING);
    //     await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!,
    //         {
    //             variableValues:{
    //                 username: userName,
    //                 userId: userId,
    //             }
    //         })
    // }
   // -------chat gpt
    const handleCall = async () => {
        try {
            setCallStatus(CallStatus.CONNECTING);
            await vapi.start(workflowId, {
                variableValues: {
                    username: userName,
                    userId: userId,
                },
            });
        } catch (err) {
            console.error("Error starting Vapi call:", err);
            setCallStatus(CallStatus.INACTIVE);
        }
    };



    const handleDisconnect = async ()=>{
        setCallStatus(CallStatus.FINISHED);
        vapi.stop();
    }
    const latestMessage = messages[messages.length-1]?.content;
    const isCallInactiveOrFinished = callStatus == CallStatus.INACTIVE || callStatus==CallStatus.FINISHED;
    return (
        <>
            <div className = "call-view">
                <div className = "card-interviewer">
                    <div className="avatar">
                        <Image src="/covers/ai-avatar3.png"
                               alt="vapi"
                               width={60}
                               height={54}
                               className="object-cover" />
                        {isSpeaking && <span className="animate-speak" /> }
                    </div>
                    <h3>AI</h3>
                </div>
                <div className = "card-border">
                    <div className = "card-interviewer">
                        <Image src = "/covers/user-avatar2.png"
                               alt="user-avatar"
                               width={540}
                               height={540}
                               className="rounded-full object-cover size-[120px]"></Image>
                        <h3>{userName}</h3>
                    </div>
                </div>
            </div>
            {messages.length > 0 && (
                <div className="transcript-border">
                    <div className="transcript">
                        <p key = {latestMessage} className={cn('transcript-opacity duration-500 opacity-0','animate-speak opacity-100')}>
                            {latestMessage}
                        </p>
                    </div>
                </div>
            )}
            <div className="w-full flex justify-center">
                {callStatus !== CallStatus.ACTIVE ?(
                    <button className ="relative btn-call" onClick = {handleCall}>
                        <span className = {cn('absolute animate-ping rounded-full opacity=75', callStatus !== CallStatus.CONNECTING &&'hidden')}/>
                        <span>
                            {isCallInactiveOrFinished ? 'Call':'. . .'}
                        </span>

                    </button>


                ):(
                    <button className = "btn-disconnect" onClick = {handleDisconnect}>
                        END
                    </button>

                )}

            </div>
        </>
    )
}
export default Agent