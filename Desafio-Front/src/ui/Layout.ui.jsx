import { Outlet } from "react-router-dom"

export const Layout = () => {

    return (
    <div className="bg-slate-800 h-[100vh] ">
        <Outlet />
    </div>
    )
}