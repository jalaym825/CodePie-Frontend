import MainHeader from "@/components/Header/MainHeader";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { UserContext } from "@/context/UserContext";
import { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router";

export default function HomeLayout() {
    const [loading, setLoading] = useState(true);
    const { getMe } = useContext(UserContext);

    async function fetchUser() {
        try {
            const user = await getMe();
            console.log(user)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUser();
    }, [])

    if (loading) {
        return (
            <LoadingScreen />
        )
    }

    return (
        <>
            <MainHeader />
            <main>
                <Outlet />
            </main>
        </>
    )
}