import { createContext } from "react";

export const UserContext = createContext({
    userInfo: {},
    setUserInfo: () => { },
    getAccurateTime: () => { },
    getMe: () => { },
    logoutUser: () => { },
    createContest: () => { },
    createContestProblem: () => { },
    createProblem: () => { },
    getProblem: () => { },
    getContest: () => { },
    joinContest: () => { },
    contestleaderBoard: () => { },
    getProblemSubmissions: () => { },
})