import { useState } from "react";
import { UserContext } from "./UserContext";
import getApi from "../helpers/API/getApi";
import postApi from "../helpers/API/postApi";

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
        const res = await postApi("/auth/logout");
        if (res.status === 200) {
            setUserInfo({});
            return true;
        }
        return false;
    }

    async function handleCreateContest(newContest) {
        const res = await postApi("/contests/", newContest);
        console.log(res);
        if (res.status === 201) {
            return ({
                status: res.status,
                message: res.data.message
            })
        } else {
            return res.response;
        }
    }

    async function handlegetAllContests() {
        const res = await getApi("/contests/");
        console.log(res);
        if (res.status === 200) {
            return ({
                status: res.status,
                message: res.data.message,
                data: res.data
            })
        } else {
            return res.response;
        }
    }

    async function handleCreateProblem(newContest) {
        const res = await postApi("/problems/", newContest);
        console.log(res);
        if (res.status === 201) {
            return ({
                status: res.status,
                message: res.data.message
            })
        } else {
            return res.response;
        }
    }



    const ctxValue = {
        userInfo: userInfo,
        setUserInfo: setUserData,
        getUserProfile: handleGetUserProfile,
        logoutUser: handleLogout,
        createContest: handleCreateContest,
        getAllContests: handlegetAllContests,
        createProblem: handleCreateProblem
    }

    return (
        <UserContext.Provider value={ctxValue}>
            {children}
        </UserContext.Provider>
    )
}