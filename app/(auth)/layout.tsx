//common layout for all auth pages
import React, {ReactNode} from 'react'

const AuthLayout = ({children}:{children :ReactNode }) => {
    return (
        <div>{children}</div>
    )
}
export default AuthLayout
