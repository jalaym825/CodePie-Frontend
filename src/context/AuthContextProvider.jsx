import { useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "sonner";
import getApi from "../helpers/API/getApi";
import postApi from "../helpers/API/postApi";
// import { UserContext } from "./UserContext";

export default function AuthContextProvider({children}) {
    const [credentials, setCredentials] = useState({
        ID: '',
        password: ''
    })

    // const { setUserInfo } = useContext(UserContext);
    
    async function handleLoginUser() {
        const res = await postApi("/auth/login", {
            enrollment_no: credentials.ID,
            password: credentials.password
        });
        if(res.status === 200){
            toast.success("User Logged in Successfully");
            // setUserInfo(res.data.data);
            return res.data.data;
        }
        return false;
    }
    
    async function handleSignUp(signUpCredentials) {
        const res = await postApi("/auth/register", signUpCredentials);
        if(res.status === 200){
            toast.success("User Signed Up Successfully");
            return true;
        }
        return false;
    }

    async function resetPassword(data) {
        const res = await postApi("/auth/reset", {
            newPassword: data
        });
        if(res.status === 200){
            return true;
        }
        return false;
    }

    async function getResetToken(email) {
        const res = await postApi("/auth/send-resetPassword", {
            email: email
        });
        if(res.status === 200){
            return true;
        }
        return false;
    }

    async function verifyToken(token) {
        const res = await getApi(`/auth/reset-password/${token}`);
        console.log(res);
        if(res.status === 200){
            return res.data;
        } else {
            return false;
        }
    }


    //Values to be passed to the context
    const ctxValue = {
        credentials: credentials,
        setCredentials: setCredentials,
        loginUser: handleLoginUser,
        signUpUser: handleSignUp,
        resetPassword: resetPassword,
        getResetToken: getResetToken,
        verifyToken: verifyToken
    }

    return (
        <AuthContext.Provider value={ctxValue}>
            { children }
        </AuthContext.Provider>
    )
}