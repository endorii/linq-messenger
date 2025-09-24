import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { refreshToken } from "@/features/auth/api/auth.api";

export const httpService = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
    withCredentials: true,
});

httpService.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

httpService.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (originalRequest.url?.includes("/auth/refresh")) {
                localStorage.removeItem("accessToken");
                return Promise.reject(error);
            }

            try {
                const { accessToken: newAccessToken } = await refreshToken();
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return httpService.request(originalRequest);
            } catch (err) {
                localStorage.removeItem("accessToken");
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);
