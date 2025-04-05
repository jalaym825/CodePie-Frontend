import { useState } from "react";
import { UserContext } from "./UserContext";
import getApi from "../helpers/API/getApi";

export default function UserContextProvider({ children }) {
    const [userInfo, setUserInfo] = useState({});

    function setUserData(data) {
        setUserInfo(data);
    }

    async function handleGetUserProfile() {
        const res = await getApi("/users/profile");
        console.log(res);
        if (res.status === 200) {
            setUserInfo(res.data.data);
            return res.data.data;
        }
        return false;
    }

    async function handleLogout() {
        const res = await getApi("/auth/logout");
        if (res.status === 200) {
            setUserInfo({});
            return true;
        }
        return false;
    }



    const ctxValue = {
        userInfo: userInfo,
        setUserInfo: setUserData,
        getUserProfile: handleGetUserProfile,
        logoutUser: handleLogout,
    }

    return (
        <UserContext.Provider value={ctxValue}>
            {children}
        </UserContext.Provider>
    )
}