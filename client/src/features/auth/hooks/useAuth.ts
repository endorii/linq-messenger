import { IUser } from "@/shared/interfaces/IUser";
import { ServerResponseError } from "@/shared/interfaces/ServerResponseError";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    fetchProfile,
    loginUser,
    logout,
    registerUser,
    resendVerifyUser,
    verifyUser,
} from "../api/auth.api";
import { LoginUserDto, RegisterUserDto } from "../interfaces/auth.interfaces";

export function useRegisterUser() {
    const router = useRouter();
    return useMutation({
        mutationFn: (userData: RegisterUserDto) => registerUser(userData),
        onSuccess: (data) => {
            toast.success(data.message);
            router.push("/signin");
        },
        onError: (error: AxiosError<ServerResponseError>) => {
            const message = error.response?.data.message || error.message;
            toast.error(message || "An unknown error occurred");
        },
    });
}

export function useLoginUser() {
    const queryClient = useQueryClient();
    const router = useRouter();
    return useMutation({
        mutationFn: (userData: LoginUserDto) => loginUser(userData),
        onSuccess: (data) => {
            const accessToken = data.data?.accessToken;
            if (accessToken) localStorage.setItem("accessToken", accessToken);
            queryClient.invalidateQueries({ queryKey: ["me"] });
            toast.success(data.message);
            router.push("/");
        },
        onError: (error: AxiosError<ServerResponseError>) => {
            const message = error.response?.data.message || error.message;
            toast.error(message || "An unknown error occurred");
        },
    });
}

export function useVerifyUser() {
    const router = useRouter();
    return useMutation({
        mutationFn: (token: string) => verifyUser(token),
        onSuccess: (data) => {
            setTimeout(() => router.push("signin"), 2500);
            toast.success(data.message);
            return data.message;
        },
        onError: (error: AxiosError<ServerResponseError>) => {
            const message = error.response?.data.message || error.message;
            toast.error(message || "An unknown error occurred");
        },
    });
}

export function useResendVerification() {
    return useMutation({
        mutationFn: (email: string) => resendVerifyUser(email),
        onSuccess: (data) => {
            toast.success(data.message);
        },
        onError: (error: AxiosError<ServerResponseError>) => {
            const message = error.response?.data.message || error.message;
            toast.error(message || "An unknown error occurred");
        },
    });
}

export function useLogoutUser() {
    const queryClient = useQueryClient();
    const router = useRouter();
    return useMutation({
        mutationFn: () => logout(),
        onSuccess: (data) => {
            localStorage.removeItem("accessToken");

            queryClient.setQueryData(["me"], null);
            queryClient.clear();

            toast.success(data.message);

            router.push("/signin");
        },
        onError: (error: AxiosError<ServerResponseError>) => {
            const message = error.response?.data.message || error.message;
            toast.error(message || "An unknown error occurred");
        },
    });
}

export function useProfile() {
    return useQuery<IUser, Error>({
        queryKey: ["me"],
        queryFn: () => fetchProfile(),
        retry: false,
    });
}
