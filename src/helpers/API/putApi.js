import { axiosInstance } from "./axiosConfig";
import { toast } from "sonner";


async function putApi(path, data, parameters = {}) {
    let response;
    try {
        response = await axiosInstance.put(path, data, { ...parameters });
    } catch (err) {
        console.error(err);
        // toast.error(err.response?.data?.message || "An error occurred.");
        response = err;
    }
    return response;
}

export default putApi;