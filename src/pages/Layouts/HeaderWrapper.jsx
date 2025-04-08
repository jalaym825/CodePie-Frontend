import MainHeader from "@/components/Header/MainHeader";
import { Outlet } from "react-router";

export default function HeaderWrapper(){
    return (
        <>
            <MainHeader />
            <main>
                <Outlet />
            </main>
        </>
    )
}