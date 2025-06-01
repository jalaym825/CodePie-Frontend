import React, { useContext, useEffect, useState } from 'react';
import { MdError } from "react-icons/md";
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const SignUpContent = ({ handleTogglePage }) => {
    const [showPassword, setShowPassword] = useState(false);
    const { signUpCredentials, setSignUpCredentials, signUpUser } = useContext(AuthContext);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState({
        field: "",
        message: ""
    });
    function handleChange(e) {
        const { name, value } = e.target;
        setSignUpCredentials(prevValue => ({
            ...prevValue,
            [name]: value
        }));
    }

    function checkEmptyFields() {
        for (let key in signUpCredentials) {
            if (!signUpCredentials[key] || signUpCredentials[key].trim() === "") {
                setError({
                    field: key,
                    message: "This field is required!"
                });
                return true;
            }
        }
        return false;
    }

    async function handleSubmit() {
        if (checkEmptyFields()) return;

        setIsPending(true);
        const res = await signUpUser(signUpCredentials);
        if (res?.status === 201) {
            toast.success(res.data.message);
            handleTogglePage();
            setSignUpCredentials({})
            setIsPending(false);
            return true;
        } else {
            toast.error(res?.data?.message || "An error occurred");
            setIsPending(false);
            return false;
        }
    }

    return (
        <div className="w-full p-8 bg-white">
            <div className="mb-4">
                <label className="block text-sm mb-2 font-medium text-gray-700">Student Name</label>
                <div className="relative">
                    <input
                        type="text"
                        name='username'
                        id="username"
                        className="w-full p-3 text-sm h-9  pl-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="Your Name"
                        value={signUpCredentials?.username || ""}
                        onChange={handleChange}
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                {error.field === "username" && <p className="px-[4px] pt-[2px] text-sm text-red-500">
                    <MdError className="inline-block mt-[-3px] mr-[2px]" />
                    {error.field === "username" && error.message}
                </p>}
            </div>
            <div className="mb-4">
                <label className="block text-sm mb-2 font-medium text-gray-700">Email address</label>
                <div className="relative">
                    <input
                        type="email"
                        name='email'
                        id="email"
                        className="w-full p-3 h-9 text-sm pl-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="your@email.com"
                        value={signUpCredentials?.email || ""}
                        onChange={handleChange}
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                {error.field === "email" && <p className="absolute top-16 px-[4px] pt-[2px] text-sm text-red-500">
                    <MdError className="inline-block mt-[-3px] mr-[2px]" />
                    {error.field === "email" && error.message}
                </p>}
            </div>

            <div className="mb-6">
                <label className="block text-sm mb-2 font-medium text-gray-700">Password</label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        name='password'
                        id='password'
                        className="w-full p-3 h-9 text-sm pl-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition pr-10"
                        placeholder="Enter your password"
                        value={signUpCredentials?.password || ""}
                        onChange={handleChange}
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <button
                        type="button"
                        className="absolute right-3  top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">Toggle password visibility</span>
                    </button>
                </div>
                {error.field === "password" && <p className=" top-16 px-[4px] pt-[2px] text-sm text-red-500">
                    <MdError className="inline-block mt-[-3px] mr-[2px]" />
                    {error.field === "password" && error.message}
                </p>}
            </div>

            <button
                type="submit"
                onClick={handleSubmit}
                disabled={isPending}
                className="w-full flex justify-center items-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white h-9 font-medium py-2 px-4 rounded-lg transition shadow-md relative"
            >
                {isPending ? (
                    <>
                        <span className="opacity-0">Sign Up</span>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    </>
                ) : (
                    "Sign Up"
                )}
            </button>
        </div>
    );
};

export default SignUpContent;