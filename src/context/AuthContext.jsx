import { createContext } from "react";

export const AuthContext = createContext({
    credentials: {
        ID: '',
        password: ''
    },
    signUpCredentials: {
        username: '',
        email: '',
        password: '',
    },
    setCredentials: () => {},
    setSignUpCredentials: () => {},
    loginUser: () => {},
    signUpUser: () => {},
    resetPassword: () => {},
    getResetToken: () => {},
    verifyToken: () => {},
})