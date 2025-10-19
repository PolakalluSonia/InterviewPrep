import React ,{ReactNode}from 'react'
import Link from "next/link";
import Image from "next/image";
import {isAuthenticated} from "@/lib/actions/auth.action";
import {redirect} from "next/navigation";
import {async} from "@firebase/util";
import {Button} from "@/components/ui/button";

 const RootLayout = async ({children}:{children:ReactNode}) => {
    const isUserAuthenticated = await isAuthenticated();
    if(!isUserAuthenticated) redirect('/sign-in');
    return (
        <div className="root-layout">
            <nav>
                {/*<Link href="/" className = "flex items-center gap-2">*/}
                {/*    <Image src = "/covers/logo3w.png"*/}
                {/*           alt="Logo"*/}
                {/*           width={80}*/}
                {/*           height={50}></Image>*/}
                {/*    <h2 className = "text-primary-100">INTERVIEWPREP AI</h2>*/}
                {/*</Link>*/}
                <nav className="flex items-center justify-between px-8 py-4">
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/covers/logo3w.png" alt="Logo" width={80} height={50} />
                        <h2 className="text-primary-100">INTERVIEWPREP AI</h2>
                    </Link>

                    <Button asChild className="btn-primary">
                        <Link href="/chatbot">Ask Your Questions</Link>
                    </Button>
                </nav>

            </nav>
            {children}
        </div>
    )
}
export default RootLayout
