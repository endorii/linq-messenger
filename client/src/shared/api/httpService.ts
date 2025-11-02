import { refreshToken } from "@/features/auth/api/auth.api";
import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";

export const httpService = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
    withCredentials: true,
});

// Зберігаємо Promise для refresh, щоб уникнути множинних викликів
let isRefreshing = false;
let refreshPromise: Promise<{ accessToken: string }> | null = null;

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
                isRefreshing = false;
                refreshPromise = null;
                return Promise.reject(error);
            }

            try {
                if (isRefreshing && refreshPromise) {
                    const { accessToken: newAccessToken } = await refreshPromise;
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return httpService.request(originalRequest);
                }

                isRefreshing = true;
                refreshPromise = refreshToken();

                const { accessToken: newAccessToken } = await refreshPromise;

                isRefreshing = false;
                refreshPromise = null;

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return httpService.request(originalRequest);
            } catch (err) {
                isRefreshing = false;
                refreshPromise = null;
                localStorage.removeItem("accessToken");
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);
