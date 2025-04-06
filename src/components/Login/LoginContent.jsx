import React, { useContext, useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router';
import { MdError } from 'react-icons/md';
import { toast } from 'sonner';

const LoginContent = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { credentials, setCredentials, loginUser } = useContext(AuthContext);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState({
    field: "",
    message: ""
  });
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setCredentials(prevValue => ({
      ...prevValue,
      [name]: value
    }));
  }

  function checkEmptyFields() {
    for (let key in credentials) {
      if (!credentials[key] || credentials[key].trim() === "") {
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
    const res = await loginUser();
    console.log(res);
    if (res?.status === 200) {
      toast.success(res.message);
      setCredentials({})
      setIsPending(false);
      navigate('/');
      return true;
    } else {
      console.log(res)
      toast.error(res.data.message || "An error occurred");
      setIsPending(false);
      return false;
    }
  }

  return (
    <div className="w-1/2 p-8 bg-white">
      <div className="mb-4">
        <label className="block text-sm mb-2 font-medium text-gray-700">Email address</label>
        <div className="relative">
          <input
            className="w-full p-3 text-sm pl-10 border  border-gray-300 rounded-md  focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="your@email.com"
            type="email"
            name="email"
            id="email"
            value={credentials.email}
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
            className="w-full p-3 text-sm pl-10 border border-gray-300 rounded-md  focus:ring-blue-500 focus:border-blue-500 transition pr-10"
            placeholder="Enter your password"
            type={showPassword ? "password" : "text"}
            name='password'
            id='password'
            value={credentials.password}
            onChange={handleChange}
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
        {error.field === "password" && <p className=" top-16 px-[4px] pt-[2px] text-sm text-red-500">
          <MdError className="inline-block mt-[-3px] mr-[2px]" />
          {error.field === "password" && error.message}
        </p>}
      </div>

      <button
        type="submit"
        onClick={handleSubmit}
        disabled={isPending}
        className="w-full flex cursor-pointer justify-center items-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-md transition shadow-md relative"
      >
        {isPending ? (
          <>
            <span className="opacity-0">Login</span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          </>
        ) : (
          "Login"
        )}
      </button>
    </div>
  );
};

export default LoginContent;