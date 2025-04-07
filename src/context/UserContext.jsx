import { createContext } from "react";

export const UserContext = createContext({
    userInfo: {},
    setUserInfo: () => { },
    getUserProfile: () => { },
    logoutUser: () => { },
    createContest: () => { },
    createContestProblem: () => { },
    createProblem: () => { },
    getProblem: () => { },
    getContest: () => { },
    joinContest: () => { },
    contestleaderBoard: () => { },
})