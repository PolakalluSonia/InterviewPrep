import React from 'react'
import {Button} from "@/components/ui/button";
import Link from "next/link";

import Image from "next/image";
import {dummyInterviews} from "@/constants";
import InterviewCard from "@/components/InterviewCard";
import {getCurrentUser, getInterviewsByUserId, getLatestInterviews} from "@/lib/actions/auth.action";

const Page = async () => {
    const user = await getCurrentUser();
    //to fetch parallel requests
    const [userInterviews,latestInterviews] = await Promise.all([
        await getInterviewsByUserId(user?.id!),
        await getLatestInterviews({userId: user?.id! })
    ]);
    // const userInterviews = await getInterviewsByUserId(user?.id!);
    // const latestInterviews = await getLatestInterviews({userId: user?.id! });
    const hasPastInterview = userInterviews ?. length >0;
    const hasUpcomingInterview = latestInterviews?.length >0;


    return (
        <>
            <section className="card-cta">
                <div className = "flex flex-col gap-6 max-w-lg">

                    <h2>Practice your interviews with AI</h2>
                    <p className = "text-lg">
                        practice on real interview questions and get feed back
                    </p>
                    <Button asChild className="btn-primary max-sm:w-full">
                        <Link href="/interview">Strat an Interview</Link>
                    </Button>
                </div>
                <Image src ="/covers/robot3.png"
                       alt="robo-dude"
                       width={480}
                       height={480}
                       className="max-sm:hidden" ></Image>
            </section>
            <section className="flex flex-col gap-6 mt-8">
                <h2>Your Interviews</h2>

                <div className="interviews-section">
                    {
                        hasPastInterview ? (
                            userInterviews ?.map((interview) => (
                                <InterviewCard {...interview} key = {interview.id} />
                            ))) : (
                                <p>You have&apos;t taken any interviews yet</p>
                        )
                    }
                </div>
            </section>
            <section className="flex flex-col gap-6 mt-8">
                <h2>Take an interview </h2>
                <div className="interviews-section">
                    <div className="interviews-section">
                        {
                        hasUpcomingInterview ? (
                        latestInterviews?.map((interview) => (
                        <InterviewCard {...interview} key = {interview.id} />
                        ))) : (
                        <p>There are no new interviews available </p>
                        )
                        }
                    </div>
                    {/*<p>You have&apos;t taken any interviews yet</p>*/}
                </div>
            </section>
        </>
    )
}
export default Page
