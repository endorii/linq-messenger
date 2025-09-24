import { IUser } from "@/shared/interfaces/IUser";
import {
    LoginResponse,
    LoginUserDto,
    RegisterUserDto,
    ServerResponseWithMessage,
} from "../interfaces/auth.interfaces";
import { httpService } from "@/shared/api/httpService";
import axios, { AxiosError } from "axios";

export async function registerUser(userData: RegisterUserDto): Promise<ServerResponseWithMessage> {
    const { data } = await axios.post("/auth/signup", userData);
    return data;
}

export async function loginUser(
    userData: LoginUserDto
): Promise<ServerResponseWithMessage<LoginResponse>> {
    const { data } = await httpService.post(`/auth/signin`, userData);
    localStorage.setItem("accessToken", data.accessToken);
    return data;
}

export async function verifyUser(token: string): Promise<ServerResponseWithMessage> {
    const { data } = await axios.get(`/auth/verify?token=${token}`);
    return data;
}

export async function resendVerifyUser(email: string): Promise<ServerResponseWithMessage> {
    const { data } = await axios.post("/auth/resend-verification", { email });
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

        if (!accessToken) {
            throw new Error("No access token returned from server");
        }

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
