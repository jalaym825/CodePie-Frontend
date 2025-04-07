import { createContext } from "react";

export const UserContext = createContext({
    userInfo: {},
    setUserInfo: () => { },
    getMe: () => { },
    logoutUser: () => { },
    createContest: () => { },
    createProblem: () => { },
    getProblem: () => { },
    getContest: () => { },
    joinContest: () => { },
    contestleaderBoard: () => { },
})