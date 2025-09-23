import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoginUserDto, RegisterUserDto } from "../interfaces/auth.interfaces";
import { loginUser, registerUser, resendVerifyUser, verifyUser } from "../api/auth.api";

export function useRegisterUser() {
    const router = useRouter();
    return useMutation({
        mutationFn: (userData: RegisterUserDto) => registerUser(userData),
        onSuccess: (data) => {
            toast.success(data.message);
            router.push("signin");
        },
        onError: (error: any) => {
            toast.error(error?.message || "An unknown error occurred");
        },
    });
}

export function useLoginUser() {
    const router = useRouter();
    return useMutation({
        mutationFn: (userData: LoginUserDto) => loginUser(userData),
        onSuccess: (data) => {
            const accessToken = data.data?.accessToken;
            if (accessToken) {
                localStorage.setItem("accessToken", accessToken);
            }
            toast.success(data.message);
            router.push("/");
        },
        onError: (error: any) => {
            toast.error(error?.message || "An unknown error occurred");
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
        onError: (error: any) => {
            toast.error(error?.message || "An unknown error occurred");
        },
    });
}

export function useResendVerification() {
    return useMutation({
        mutationFn: (email: string) => resendVerifyUser(email),
        onSuccess: (data) => {
            toast.success(data.message);
        },
        onError: (error: any) => {
            toast.error(error?.message || "An unknown error occurred");
        },
    });
}
