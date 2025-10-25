import React from 'react'
import {Button} from "@/components/ui/button";
import Link from "next/link";
import StartInterviewButton from '@/components/StartInterviewButton';

import Image from "next/image";
import {dummyInterviews} from "@/constants";
import InterviewCard from "@/components/InterviewCard";
import {getInterviewsByUserId, getLatestInterviews} from "@/lib/actions/general.action";
import {getCurrentUser} from "@/lib/actions/auth.action";

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
            {/*INTERVIEWS*/}
            <section className="card-cta">
                <div className = "flex flex-col gap-6 max-w-lg">

                    <h2>Practice your interviews with AI</h2>
                    <p className = "text-lg">
                        practice on real interview questions and get feed back
                    </p>
                    {/*<Button asChild className="btn-primary max-sm:w-full">*/}
                    {/*    <Link href="/interview">Strat an Interview</Link>*/}
                    {/*</Button>*/}
                    <div className = "flex flex-row gap-4 max-sm:flex-cole">
                        <StartInterviewButton />

                    </div>

                </div>
                <Image src ="/covers/robot3.png"
                       alt="robo-dude"
                       width={480}
                       height={480}
                       className="max-sm:hidden" ></Image>
            </section>
            {/*RESUME ANALYSIS*/}
            <section className="card-cta">
                <div className = "flex flex-col gap-6 max-w-lg">

                    <h2>KNOW YOUR ATS SCORE</h2>
                    <p className = "text-lg">
                        UPLOAD YOUR RESUME AND KNOW YOUR ATS SCORE
                    </p>
                    <Button asChild className="btn-primary max-sm:w-full">
                        <Link href="https://ai-resume-analyser-steel-nine.vercel.app/\"
                              rel="noopener noreferrer"
                        >RESUME ANALYSIS</Link>
                    </Button>


                </div>
                <Image src ="/covers/ats2.png"
                       alt="ats-score-cover"
                       width={480}
                       height={480}
                       className="max-sm:hidden" ></Image>
            </section>
            <section className="flex flex-col gap-6 mt-8" >
                <h2 >Enhance Your Problem Solving skills by solving questions on these platforms</h2>
                <div className=" flex flex-wrap gap-3">
                    <a href="https://leetcode.com" target="_blank" rel="noopener noreferrer">
                        <Button  className="btn-primary max-sm:w-full">LeetCode</Button>
                    </a>
                    <a href="https://www.hackerrank.com/" target="_blank" rel="noopener noreferrer">
                        <Button  className="btn-primary max-sm:w-full">Hacker Ranker</Button>
                    </a>
                    <a href="https://www.codechef.com/" target="_blank" rel="noopener noreferrer">
                        <Button  className="btn-primary max-sm:w-full">Code chef</Button>
                    </a>
                    <a href="https://www.interviewbit.com/technical-interview-questions/" target="_blank" rel="noopener noreferrer">
                        <Button  className="btn-primary max-sm:w-full">Interviewbit</Button>
                    </a>

                </div>

            </section>
        </>
    )
}
export default Page