import { axiosInstance } from "./axiosConfig";

async function getApi(path, parameters = {}) {
    try {
        const response = await axiosInstance.get(path, {
            ...parameters,
            responseType: parameters.responseType || "json", // ✅ Default to JSON, but allow "blob"
        });

        return response;
    } catch (err) {
        console.error(err);
        return err.response;
    }
}

export default getApi;