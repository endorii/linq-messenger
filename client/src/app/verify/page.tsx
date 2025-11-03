"use client";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

import {
    useResendVerification,
    useVerifyUser,
} from "@/features/auth/hooks/useAuth";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { LinqIcon } from "@/shared/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ResendFormData {
    email: string;
}

const VerifyPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token") || "";

    const verifyMutation = useVerifyUser();
    const resendMutation = useResendVerification();

    const {
        handleSubmit,
        register,
        reset,
        formState: { errors },
    } = useForm<ResendFormData>({
        defaultValues: { email: "" },
    });

    const onSubmit = (data: ResendFormData) => {
        try {
            resendMutation.mutate(data.email);
            reset();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!token) {
            toast.info("Verification token not found or it has expired");
            router.push("/signin");
            return;
        }

        verifyMutation.mutateAsync(token);
    }, [token, router]);

    return (
        <div className="flex items-center justify-center min-h-screen text-white px-[30px]">
            <div className="flex flex-col gap-[10px] items-center w-full max-w-[500px] rounded-2xl shadow-lg bg-neutral-200 dark:bg-neutral-900 p-[20px] max-h-[90vh] overflow-y-auto">
                <div className="flex gap-[10px] items-center justify-center w-full p-[10px]">
                    <LinqIcon className="w-[150px] h-[150px]" />
                    <h2 className="text-3xl font-bold text-white text-center">
                        Email Verification
                    </h2>
                </div>
                <hr className="border-t border-neutral-300 dark:border-neutral-800 w-full" />
                <div
                    className={`text-lg font-medium p-[15px] w-full text-center ${
                        verifyMutation.isPending
                            ? ""
                            : verifyMutation.isSuccess
                            ? "bg-green-500/5 border border-green-500 rounded-xl"
                            : verifyMutation.isError
                            ? "bg-red-500/5 border border-red-500 rounded-xl"
                            : ""
                    }`}
                >
                    {verifyMutation.isPending
                        ? "Verifying your email, please wait..."
                        : verifyMutation.isSuccess
                        ? "✅ Email successfully verified"
                        : verifyMutation.isError
                        ? "❌ Invalid or expired token. To request a new one, enter your email below"
                        : null}
                </div>

                {verifyMutation.isError && (
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col gap-4 w-full p-[20px]"
                    >
                        <div className="flex flex-col gap-[7px]">
                            <Label>Email *</Label>
                            <Input
                                type="email"
                                placeholder="Email"
                                {...register("email", {
                                    required: "Email required",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Invalid email address",
                                    },
                                })}
                                errorMessage={errors.email?.message}
                                className="h-[45px]"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full dark:bg-neutral-950 hover:bg-neutral-900 transition text-white p-3 rounded-xl font-semibold border border-neutral-300 dark:border-neutral-800 h-[45px]"
                        >
                            Resend Verification
                        </Button>
                    </form>
                )}

                <div className="text-center text-neutral-500 mt-6">
                    Remember your account?{" "}
                    <Button
                        onClick={() => router.push("/signin")}
                        className="text-white hover:underline p-0"
                    >
                        Sign In
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default VerifyPage;
