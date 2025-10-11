// components/Agent/hooks/useVapiEvents.ts
import { useEffect } from 'react';
import { CallStatus, SavedMessage } from './types';

export function useVapiEvents(vapi: any, setCallStatus: any, setMessages: any, setIsSpeaking: any) {
    useEffect(() => {
        if (!vapi) return;

        const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
        const onCallEnd = () => setCallStatus(CallStatus.FINISHED);
        const onMessage = (message: any) => {
            if (message.type === 'transcript' && message.transcriptType === 'final') {
                const newMessage: SavedMessage = { role: message.role, content: message.transcript };
                setMessages((prev: SavedMessage[]) => [...prev, newMessage]);
            }
        };
        const onSpeechStart = () => setIsSpeaking(true);
        const onSpeechEnd = () => setIsSpeaking(false);
        const onError = (error: Error) => console.error('Error', error);

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
        };
    }, [vapi]);
}
