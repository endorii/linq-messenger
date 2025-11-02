import { httpService } from "@/shared/api/httpService";
import { IUser } from "@/shared/interfaces/IUser";
import axios, { AxiosError } from "axios";
import {
    LoginResponse,
    LoginUserDto,
    RegisterUserDto,
    ServerResponseWithMessage,
} from "../interfaces/auth.interfaces";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function registerUser(userData: RegisterUserDto): Promise<ServerResponseWithMessage> {
    const { data } = await axios.post(`${API_URL}/auth/signup`, userData, {
        withCredentials: true,
    });
    return data;
}

export async function loginUser(
    userData: LoginUserDto
): Promise<ServerResponseWithMessage<LoginResponse>> {
    const { data } = await axios.post(`${API_URL}/auth/signin`, userData, {
        withCredentials: true,
    });
    return data;
}

export async function verifyUser(token: string): Promise<ServerResponseWithMessage> {
    const { data } = await axios.get(`${API_URL}/auth/verify?token=${token}`, {
        withCredentials: true,
    });
    return data;
}

export async function resendVerifyUser(email: string): Promise<ServerResponseWithMessage> {
    const { data } = await axios.post(
        `${API_URL}/auth/resend-verification`,
        { email },
        {
            withCredentials: true,
        }
    );
    return data;
}

export async function fetchProfile(): Promise<IUser> {
    const { data } = await httpService.get("/auth/me");
    return data;
}

export async function logout(): Promise<ServerResponseWithMessage> {
    const { data } = await httpService.post("/auth/logout");
    return data;
}

export async function refreshToken(): Promise<{ accessToken: string }> {
    try {
        const { data } = await httpService.post("/auth/refresh");
        const accessToken: string = data.accessToken;

        if (!accessToken) throw new Error("No access token returned from server");

        localStorage.setItem("accessToken", accessToken);
        return data;
    } catch (err: unknown) {
        if (err instanceof AxiosError) {
            const message = err.response?.data?.message || err.message;
            throw new Error(message);
        }
        throw err;
    }
}
