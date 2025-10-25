"use client";

import { LinqIcon } from "@/shared/icons";
import { useState } from "react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import { Label } from "@/shared/components/ui/label";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useLoginUser } from "@/features/auth/hooks/useAuth";

interface LoginFormData {
    username: string;
    password: string;
}

function SignIn() {
    const [formErrorMessage, setFormErrorMessage] = useState("");

    const useLoginUserMutation = useLoginUser();

    const {
        handleSubmit,
        register,
        reset,
        formState: { errors },
    } = useForm<LoginFormData>({
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            useLoginUserMutation.mutate({
                username: data.username,
                password: data.password,
            });
            setFormErrorMessage("");
            reset({ password: "" });
        } catch (error: any) {
            setFormErrorMessage(
                error?.message || "An error occurred during login"
            );
            console.log(error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen text-white px-[30px]">
            <div className="flex flex-col gap-[10px] items-center w-full max-w-[500px] rounded-2xl shadow-lg bg-neutral-200 dark:bg-neutral-900 p-[20px] max-h-[90vh] overflow-y-auto">
                <div className="flex gap-[10px] items-center justify-center w-full p-[10px]">
                    <LinqIcon className="w-[150px] h-[150px]" />
                    <h2 className="text-3xl font-bold text-white text-center">
                        Welcome to Linq
                    </h2>
                </div>
                <hr className="border-t border-neutral-300 dark:border-neutral-800 w-full" />
                <div className="text-center text-lg mt-[15px]">
                    <span className="font-semibold">Sign in</span> to continue
                    to your chats
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4 w-full p-[20px] text-white"
                >
                    <div className="flex flex-col gap-[7px] ">
                        <Label>Username *</Label>
                        <Input
                            type="text"
                            id="username"
                            placeholder="Username"
                            {...register("username", {
                                required: "Username required",
                            })}
                            errorMessage={errors.username?.message}
                            className="h-[45px]"
                        />
                    </div>

                    <div className="flex flex-col gap-[7px] ">
                        <Label>Password *</Label>
                        <Input
                            type="password"
                            id="password"
                            placeholder="Password"
                            {...register("password", {
                                required: "Password required",
                            })}
                            errorMessage={errors.password?.message}
                            className="h-[45px]"
                        />
                    </div>

                    {formErrorMessage && (
                        <div className="text-red-500 bg-red-500/5 p-[10px] border border-white/5 rounded-xl">
                            {formErrorMessage}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full dark:bg-neutral-950 hover:bg-neutral-900 transition text-white p-3 rounded-xl font-semibold border border-neutral-300 dark:border-neutral-800 h-[45px] cursor-pointer"
                        disabled={useLoginUserMutation.isPending}
                    >
                        {useLoginUserMutation.isPending
                            ? "Loading..."
                            : "Sign In"}
                    </Button>
                </form>

                <div className="relative flex items-center w-full p-[10px]">
                    <hr className="border-t border-neutral-300 dark:border-neutral-800 w-full" />

                    <div className="absolute top-0 left-[50%] translate-x-[-50%] text-center bg-neutral-200 dark:bg-neutral-900 px-[10px] text-neutral-500 dark:text-neutral-400">
                        OR
                    </div>
                </div>

                <div className="flex flex-col justify-center gap-4 p-[20px] w-full">
                    <button className="p-3 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-600 transition text-white border border-white/5">
                        Continue with Google
                    </button>
                    <button className="p-3 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-600 transition text-white border border-white/5">
                        Continue with Facebook
                    </button>
                </div>

                <div className="text-neutral-500 text-center mt-6">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-white hover:underline">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
