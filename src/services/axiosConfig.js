import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8090/",
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken"); // Correct key
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
