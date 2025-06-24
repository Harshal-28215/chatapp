import UserSideBar from "@/components/Home/UserSideBar";
import React from "react"

const AppLayout = (wrappercomponent: React.ComponentType<any>) => {
    return (props: any) => (
        <main className="h-[calc(100vh-56px)] relative flex">
            <UserSideBar />
            {React.createElement(wrappercomponent, props)}
        </main>
    );
}

export default AppLayout
