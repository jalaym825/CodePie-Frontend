// axiosConfig.js
import axios from "axios";
import { toast } from 'sonner';
import apiInfo from "./apiInfo";

// Create an Axios instance with default configuration
const axiosInstance = axios.create({
    baseURL: apiInfo.URL, // Use the base URL from apiInfo
    withCredentials: true, // Enable sending cookies with requests
    headers: {
        "Content-Type": "application/json", // Default headers
    },
});

axios.defaults.debug = false;

// Function to set up interceptors
const setupAxiosInterceptors = (navigate) => {
    // Request interceptor
    axiosInstance.interceptors.request.use(
        (config) => {
            // You can modify the request config here (e.g., add an auth token)
            const token = localStorage.getItem("authToken");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            // Handle request errors
            return Promise.reject(error);
        }
    );

    axiosInstance.interceptors.request.use(config => {
        // Don't modify content-type if sending FormData
        if (config.data instanceof FormData) {
            // Let axios set the content type with boundary
            delete config.headers['Content-Type'];
        }
        return config;
    });

    // Response interceptor
    axiosInstance.interceptors.response.use(
        (response) => {
            // Handle successful responses
            return response;
        },
        (error) => {
            // Handle response errors globally
            toast.dismiss(); // Dismiss all toasts before showing a new one
            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        // Redirect to login page if unauthorized
                        toast.error("Session expired. Please log in again.");
                        navigate("/");
                        break;
                    case 403:
                        // Handle forbidden access
                        toast.error("You do not have permission to access this resource.");
                        break;
                    case 500:
                        // Handle server errors
                        toast.error("Server error. Please try again later.");
                        break;
                    default:
                        // Handle other errors
                        toast.error(error.response.data.message || "An error occurred.");
                }
            } else {
                // Handle network errors
                toast.error("Network error. Please check your connection.");
            }
            return Promise.reject(error);
        }
    );
};

export { axiosInstance, setupAxiosInterceptors };