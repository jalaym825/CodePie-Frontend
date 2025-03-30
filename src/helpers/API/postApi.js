import { axiosInstance } from "./axiosConfig";
import toast from "react-hot-toast";

async function postApi(path, body) {
    let response;
    try {
        response = await axiosInstance.post(path, body);
    } catch (err) {
        console.error(err);
        // toast.error(err.response?.data?.message || "An error occurred.");
        response = err;
    }
    return response;
}

export default postApi;