import { createContext } from "react";

export const UserContext = createContext({
    userInfo: {},
    setUserInfo: () => { },
    getUserProfile: () => { },
    logoutUser: () => { },
    createContest: () => { },
    createProblem: () => { },
    getProblem: () => { },
    getContest: () => { },
    joinContest: () => { },
})