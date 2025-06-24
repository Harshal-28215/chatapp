import { memo } from "react"
import { Navigate, Outlet } from "react-router"

const ProtectedRoutes = memo(({ children,message, navigate }: { children: React.ReactNode,message:string, navigate: string })=> {
    if(message !== 'user logedin' || !message) return <Navigate to={navigate} />
    return children ? children : <Outlet />
})

export default ProtectedRoutes
