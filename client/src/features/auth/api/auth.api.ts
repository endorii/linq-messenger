import { CreateUserDto, ServerResponseWithMessage } from "../interfaces/auth.interfaces";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function registerUser(userData: CreateUserDto): Promise<ServerResponseWithMessage> {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
            const error: any = new Error(data.message || `Error ${response.status}`);
            error.status = response.status;
            throw error;
        }

        return data;
    } catch (error: any) {
        throw error;
    }
}

export async function verifyUser(token: string): Promise<ServerResponseWithMessage> {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/verify?token=${token}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (!response.ok) {
            const error: any = new Error(data.message || `Error ${response.status}`);
            error.status = response.status;
            throw error;
        }

        return data;
    } catch (error: any) {
        throw error;
    }
}

export async function resendVerifyUser(email: string): Promise<ServerResponseWithMessage> {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
            const error: any = new Error(data.message || `Error ${response.status}`);
            error.status = response.status;
            throw error;
        }

        return data;
    } catch (error: any) {
        throw error;
    }
}
