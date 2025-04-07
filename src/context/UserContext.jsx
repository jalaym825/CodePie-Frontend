import { createContext } from "react";

export const UserContext = createContext({
    userInfo: {},
    setUserInfo: () => { },
    getUserProfile: () => { },
    logoutUser: () => { },
    createContest: () => { },
    createContestProblems: () => { },
    createProblem: () => { },
    getProblem: () => { },
    getContest: () => { },
    joinContest: () => { },
    contestleaderBoard: () => { },
})