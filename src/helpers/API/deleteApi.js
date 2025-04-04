import { axiosInstance } from "./axiosConfig";
import { toast } from "sonner";


async function deleteApi(path, parameters) {
    let response;
    try {
        response = await axiosInstance.delete(path, { ...parameters });
    } catch (err) {
        console.error(err);
        // toast.error(err.response?.data?.message || "An error occurred.");
        response = err;
    }
    return response;
}

export default deleteApi;