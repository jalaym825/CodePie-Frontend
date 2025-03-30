import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, Mail, Code, Lock } from 'lucide-react';

const LoginContent = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-1/2 p-8 bg-white">
      <form>
        <div className="mb-4">
          <label className="block text-sm mb-2 font-medium text-gray-700">Email address</label>
          <div className="relative">
            <input
              type="email"
              className="w-full p-3 text-sm pl-10 border  border-gray-300 rounded-md  focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="your@email.com"
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm mb-2 font-medium text-gray-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "password" : "text"}
              className="w-full p-3 text-sm pl-10 border border-gray-300 rounded-md  focus:ring-blue-500 focus:border-blue-500 transition pr-10"
              placeholder="Enter your password"
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="sr-only">Toggle password visibility</span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-md transition shadow-md"
        >
          Log in
        </button>
      </form>
    </div>
  );
};

export default LoginContent;