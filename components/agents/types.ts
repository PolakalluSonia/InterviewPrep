// components/Agent/types.ts
export enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
}

export interface SavedMessage {
    role: 'user' | 'system' | 'assistant';
    content: string;
}

export interface AgentProps {
    userName: string;
    userId: string;
    type: 'generate' | 'interview';
    interviewId: string;
    questions?: string[];
}
