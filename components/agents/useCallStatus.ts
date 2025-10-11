// components/Agent/hooks/useCallStatus.ts
import { useState } from 'react';
import { CallStatus, SavedMessage } from './types';

export function useCallStatus() {
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [messages, setMessages] = useState<SavedMessage[]>([]);
    const [isSpeaking, setIsSpeaking] = useState(false);

    return {
        callStatus,
        setCallStatus,
        messages,
        setMessages,
        isSpeaking,
        setIsSpeaking,
    };
}
