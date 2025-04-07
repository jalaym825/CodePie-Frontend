import { useState } from "react";
import { UserContext } from "./UserContext";
import getApi from "../helpers/API/getApi";
import postApi from "../helpers/API/postApi";

export default function UserContextProvider({ children }) {
    const [userInfo, setUserInfo] = useState({
        name: "",
        email: "",
        profilePic: "",
        id: "",
        isAdmin: false,
        isLoggedIn: false,
    });

    function setUserData(data) {
        setUserInfo(data);
    }

    async function handleGetUserProfile() {
        const res = await getApi("/users/profile");
        console.log(res);
        if (res.status === 200) {
            setUserInfo(prevData => {
                return {
                    ...prevData,
                    ...res.data.data,
                }
            });
            return res.data.data;
        }
        return false;
    }

    async function handleLogout() {
        const res = await postApi("/auth/logout");
        console.log(res);
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

    async function handlegetProblem(id) {
        console.log(id)
        const res = await getApi(`/problems/${id}`);
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

    async function handlegetContest(id, userId) {
        // console.log(id, userId)
        const res = await postApi(`/contests/${id}`, { userId: userId });
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

    async function handleCreateContestProblem(newContest) {
        const res = await postApi("/problems/", {
            ...newContest,
            isPractice: false,
        });
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

    async function handleCreateProblem(newContest) {
        const res = await postApi("/problems/", {
            ...newContest,
            isPractice: true,
        });
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

    async function handleContestJoin(id) {
        const res = await postApi(`/contests/${id}/join`);
        console.log(res);
        if (res.status === 201) {
            return {
                data: res.data.data,
                status: res.status,
                message: res.data.message
            };
        } else {
            return res.response;
        }
    }

    async function handleContestLeaderBoard(id) {
        const res = await getApi(`/contests/${id}/leaderboard`);
        console.log(res);
        if (res.status === 200) {
            return ({
                status: res.status,
                message: res.data.message,
                data: res.data.data

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
        createContestProblem: handleCreateContestProblem,
        createProblem: handleCreateProblem,
        getProblem: handlegetProblem,
        getContest: handlegetContest,
        joinContest: handleContestJoin,
        contestleaderBoard: handleContestLeaderBoard
    }

    return (
        <UserContext.Provider value={ctxValue}>
            {children}
        </UserContext.Provider>
    )
}