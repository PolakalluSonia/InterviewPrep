// components/Agent/lib/handleCall.ts
import { CallStatus } from './types';

export const handleCall = async (
    setCallStatus: any,
    vapi: any,
    workflowId: string,
    userName: string,
    userId: string,
    type: string
) => {
    try {
        setCallStatus(CallStatus.CONNECTING);

        await vapi.start(workflowId, {
            variableValues: { username: userName, userId: userId },
        });
    } catch (err) {
        console.error('Error starting Vapi call:', err);
        setCallStatus(CallStatus.INACTIVE);
    }
};
