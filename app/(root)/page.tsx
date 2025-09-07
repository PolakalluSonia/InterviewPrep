import React from 'react'
import {Button} from "@/components/ui/button";
import Link from "next/link";

import Image from "next/image";
import {dummyInterviews} from "@/constants";
import InterviewCard from "@/components/InterviewCard";

const Page = () => {
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
                    {dummyInterviews.map((interview)=>(
                        <InterviewCard {...interview} key={interview.id}></InterviewCard>
                    ))}
                </div>
            </section>
            <section className="flex flex-col gap-6 mt-8">
                <h2>Take an interview </h2>
                <div className="interviews-section">
                    <div className="interviews-section">
                        {dummyInterviews.map((interview)=>(
                            <InterviewCard {...interview} key={interview.id}></InterviewCard>
                        ))}
                    </div>
                    {/*<p>You have&apos;t taken any interviews yet</p>*/}
                </div>
            </section>
        </>
    )
}
export default Page
