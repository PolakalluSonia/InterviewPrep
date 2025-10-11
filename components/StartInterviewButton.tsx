'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function StartInterviewButton() {
    const router = useRouter();

    const handleStartInterview = async () => {
        try {
            // Call your API route to create a new interview
            const res = await fetch('/api/vapi/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    role: 'Software Engineer',
                    type: 'technical',
                    level: 'entry',
                    techstack: 'React, Node.js, JavaScript',
                    amount: 5,
                    userid: 'demo-user', // replace with actual userId from session if available
                }),
            });

            const data = await res.json();

            if (data.success && data.interviewId) {
                console.log('✅ Interview created:', data.interviewId);
                router.push(`/interview/${data.interviewId}`); // go to interview page
            } else {
                console.error('❌ Failed to start interview:', data);
                alert('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Error creating interview:', error);
            alert('Failed to start interview.');
        }
    };

    return (
        <Button
            onClick={handleStartInterview}
            className="btn-primary max-sm:w-full"
        >
            Start an Interview
        </Button>
    );
}
