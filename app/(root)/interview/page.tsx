import React from 'react'
import Agent from "@/components/Agent";
import {getCurrentUser} from "@/lib/actions/auth.action";

const Page = async() => {
   const user = await getCurrentUser();
    return (
        <>
            <div>Interview Generation</div>
            <Agent userName={user?.name} userId = {user?.id} type="generate">

            </Agent>
        </>

    )
}
export default Page
