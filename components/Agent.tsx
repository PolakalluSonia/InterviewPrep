"use client"
import React, {useState} from 'react'
import Image from 'next/image';
import {buttonVariants} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {useRouter} from "next/navigation";

enum CallStatus
{
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
}
const Agent = ({userName}:AgentProps) => {
  // const callStatus = CallStatus.ACTIVE;
   const isSpeaking = true;
    const router = useRouter();
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.ACTIVE);//use state
   const messages =
       [
           'What is your name ?',
           'My name is abc , nice to meet you'
       ];
   const lastMessage = messages[messages.length - 1];
   const handleEnd = () => {
       setCallStatus(CallStatus.FINISHED);
       router.push('/sign-up')
   }
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
                        <p key = {lastMessage} className={cn('transcript-opacity duration-500 opacity-0','animate-speak opacity-100')}>
                            {lastMessage}
                        </p>
                    </div>
                </div>
            )}
            <div className="w-full flex justify-center">
                {callStatus !== CallStatus.ACTIVE ?(
                    <button className ="relative btn-call">
                        <span className = {cn('absolute animate-ping rounded-full opacity=75', callStatus !== CallStatus.CONNECTING &&'hidden')}/>
                        <span>
                            {callStatus === 'INACTIVE' || callStatus ==='FINISHED' ? 'Call':'. . .'}
                        </span>

                    </button>


                ):(
                    <button className = "btn-disconnect" onClick = {handleEnd}>
                        END
                    </button>

                )}

            </div>
        </>
    )
}
export default Agent
