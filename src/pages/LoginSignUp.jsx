import React, { useState } from 'react';
import { Mail, Code } from 'lucide-react';
import LoginContent from '../components/Login/LoginContent';
import SignUpContent from "../components/SignUp/SignUpContent";
import { useLocation } from 'react-router';

const LoginSignUp = () => {
    const location = useLocation();
    const isLoginActive = location.pathname.toLowerCase() === "/login";

    const [toggleActive, setToggleActive] = useState(isLoginActive ? 'login' : 'register');

    const handleTogglePage = () => {
        setToggleActive(toggleActive === 'login' ? 'register' : 'login');
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <main className="flex-1 flex flex-col items-center p-3">
                <div className="mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full w-16 h-16 flex items-center justify-center overflow-hidden shadow-lg">
                    <Code className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-10">
                    {toggleActive === 'login' ? 'Log in to' : 'Sign up for'}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">CodePi</span>
                </h2>

                <div className="w-full max-w-[60%] flex shadow-lg rounded-lg overflow-hidden">
                    {toggleActive === 'login' ? <LoginContent /> : <SignUpContent />}

                    <div className="w-1/2 p-8 flex flex-col justify-center bg-blue-50 border-l border-gray-100">
                        <div className="mb-6 flex justify-center items-center">
                            <span className="text-gray-500 text-sm font-medium">OR</span>
                        </div>

                        <div className="space-y-4">
                            <button className="w-full bg-white cursor-pointer border border-gray-300 rounded-md p-2 flex items-center justify-center hover:bg-gray-50 transition shadow-sm">
                                <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Continue with Google
                            </button>

                            <button className="w-full bg-white cursor-pointer border border-gray-300 rounded-md p-2 flex items-center justify-center hover:bg-gray-50 transition shadow-sm">
                                <svg className="h-5 w-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
                                    <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C18.34 21.21 22 17.06 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
                                </svg>
                                Continue with Facebook
                            </button>

                            <button className="w-full bg-white border cursor-pointer border-gray-300 rounded-md p-2 flex items-center justify-center hover:bg-gray-50 transition shadow-sm">
                                <Mail className="h-5 w-5 mr-3 text-gray-600" />
                                Sign up with email
                            </button>
                        </div>

                        <div className="mt-8 text-center">
                            <span className="text-sm text-gray-600">
                                {toggleActive === 'login' ? "Don't have an account?" : "Already have an account?"}
                            </span>
                            <button
                                type="button"
                                onClick={handleTogglePage}
                                className="text-sm cursor-pointer font-semibold text-gray-600 hover:text-blue-600 transition underline ml-1"
                            >
                                {toggleActive === 'login' ? 'Sign up' : 'Log in'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 max-w-md text-center">
                    <p className="text-sm text-gray-600">
                        Join thousands of programmers mastering Data Structures & Algorithms on
                        <span className="font-bold text-blue-600"> CodePi</span>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default LoginSignUp;


