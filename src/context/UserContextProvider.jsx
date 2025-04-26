import { useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import getApi from "../helpers/API/getApi";
import postApi from "../helpers/API/postApi";
import putApi from "@/helpers/API/putApi";

export default function UserContextProvider({ children }) {
    const [userInfo, setUserInfo] = useState({
        name: "",
        email: "",
        profilePic: "",
        id: "",
        isAdmin: false,
        isLoggedIn: false,
    });

    const [syncedTime, setSyncedTime] = useState(null);
    const [syncedAt, setSyncedAt] = useState(null);

    useEffect(() => {
        async function syncTime() {
            try {
                const res = await getApi("/users/api/time");
                
                setSyncedTime(new Date(res.data.data.serverTime).getTime());
                setSyncedAt(performance.now());
            } catch (err) {
                console.error("Failed to sync time:", err);
            }
        }
        syncTime();
    }, []);

    function getAccurateTime() {
        if (!syncedTime || !syncedAt) return new Date(); // fallback
        const elapsed = performance.now() - syncedAt;
        return new Date(syncedTime + elapsed);
    }

    async function handleGetUserProfile() {
        const res = await getApi("/auth/me");
        console.log(res.data.data)
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
        const res = await getApi(`/problems/${id}`);
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

    async function handleGetContest(id) {
        const res = await getApi(`/contests/${id}`);
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


    async function handleGetProblemSubmissions(id) {
        const res = await getApi(`/submissions/problem/${id}`);
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

    async function handleUpdateContestProblem(id, data) {
        const res = await putApi(`/problems/${id}`, data);
        if (res.status === 200) {
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
        setUserInfo: setUserInfo,
        getAccurateTime: getAccurateTime,
        getMe: handleGetUserProfile,
        logoutUser: handleLogout,
        createContest: handleCreateContest,
        getAllContests: handlegetAllContests,
        createContestProblem: handleCreateContestProblem,
        createProblem: handleCreateProblem,
        getProblem: handlegetProblem,
        getContest: handleGetContest,
        joinContest: handleContestJoin,
        contestleaderBoard: handleContestLeaderBoard,
        getProblemSubmissions: handleGetProblemSubmissions,
        updateContestProblem: handleUpdateContestProblem
    }

    return (
        <UserContext.Provider value={ctxValue}>
            {children}
        </UserContext.Provider>
    )
}