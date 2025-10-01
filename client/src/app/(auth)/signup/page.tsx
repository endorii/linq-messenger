"use client";

import { BackIcon, LinqIcon } from "@/shared/icons";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Label } from "@/shared/components/ui/label";
import { useRegisterUser } from "@/features/auth/hooks/useAuth";

interface RegisterFormData {
    email: string;
    username: string;
    phone: string;
    firstName: string;
    lastName: string;
    password: string;
    confirmPassword: string;
}

function SignUp() {
    const [step, setStep] = useState(1);
    const [formErrorMessage, setFormErrorMessage] = useState("");

    const useRegisterUserMutation = useRegisterUser();

    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
        trigger,
    } = useForm<RegisterFormData>({
        defaultValues: {
            email: "",
            username: "",
            phone: "",
            firstName: "",
            lastName: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = (data: RegisterFormData) => {
        if (data.password !== data.confirmPassword) {
            setFormErrorMessage("Passwords do not match");
            return;
        }
        try {
            useRegisterUserMutation.mutate({
                email: data.email,
                username: data.username,
                phone: data.phone,
                firstName: data.firstName,
                lastName: data.lastName,
                password: data.password,
            });
            setFormErrorMessage("");
            reset();
        } catch (error: any) {
            setStep(1);
            setFormErrorMessage(
                error?.message || "An error occurred during registration"
            );
            console.log(error);
        }
    };

    const nextStep = async () => {
        const valid = await trigger(["email", "username", "phone"]);
        if (valid) {
            setStep((prev) => prev + 1);
        }
    };

    const prevStep = () => setStep((prev) => prev - 1);

    return (
        <div className="flex items-center justify-center min-h-screen text-white px-[30px]">
            <div className="flex flex-col gap-[10px] items-center w-full max-w-[500px] rounded-2xl shadow-lg bg-neutral-900 p-[20px] max-h-[90vh] overflow-y-auto">
                <div className="flex gap-[10px] items-center justify-center w-full p-[10px]">
                    <LinqIcon className="w-[150px] h-[150px]" />
                    <h2 className="text-3xl font-bold text-white text-center">
                        Create your account
                    </h2>
                </div>
                <hr className="border-t border-neutral-800 w-full" />

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4 w-full p-[20px] text-white"
                >
                    {step === 1 && (
                        <>
                            <div className="flex flex-col gap-[7px] ">
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

                            <div className="flex flex-col gap-[7px] ">
                                <Label>Username *</Label>
                                <Input
                                    type="text"
                                    placeholder="Username"
                                    {...register("username", {
                                        required: "Username required",
                                    })}
                                    errorMessage={errors.username?.message}
                                    className="h-[45px]"
                                />
                            </div>
                            <div className="flex flex-col gap-[7px] ">
                                <Label>Phone number</Label>
                                <Input
                                    type="text"
                                    placeholder="Phone number (optional)"
                                    {...register("phone")}
                                    className="h-[45px]"
                                />
                            </div>
                            <Button
                                type="button"
                                onClick={nextStep}
                                className="w-full bg-neutral-950 hover:bg-neutral-900 transition text-white p-3 rounded-xl font-semibold border border-neutral-800 h-[45px] cursor-pointer"
                            >
                                Next
                            </Button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className="flex flex-col gap-[7px] ">
                                <Label>First Name *</Label>
                                <Input
                                    type="text"
                                    placeholder="First Name"
                                    {...register("firstName", {
                                        required: "First name required",
                                    })}
                                    errorMessage={errors.firstName?.message}
                                    className="h-[45px]"
                                />
                            </div>
                            <div className="flex flex-col gap-[7px] ">
                                <Label>Last Name</Label>
                                <Input
                                    type="text"
                                    placeholder="Last Name (optional)"
                                    {...register("lastName")}
                                    className="h-[45px]"
                                />
                            </div>
                            <div className="flex flex-col gap-[7px] ">
                                <Label>Password *</Label>
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    {...register("password", {
                                        required: "Password required",
                                        minLength: {
                                            value: 7,
                                            message:
                                                "Password length should be at least 7 symbols",
                                        },
                                    })}
                                    errorMessage={errors.password?.message}
                                    className="h-[45px]"
                                />
                            </div>

                            <div className="flex flex-col gap-[7px] ">
                                <Label>Confirm Password *</Label>
                                <Input
                                    type="password"
                                    placeholder="Confirm Password"
                                    {...register("confirmPassword", {
                                        required: "Password required",
                                        minLength: {
                                            value: 7,
                                            message:
                                                "Password length should be at least 7 symbols",
                                        },
                                    })}
                                    errorMessage={
                                        errors.confirmPassword?.message
                                    }
                                    className="h-[45px]"
                                />
                            </div>

                            {formErrorMessage && (
                                <div className="text-red-500 bg-red-500/5 p-[10px] border border-white/5 rounded-xl">
                                    {formErrorMessage}
                                </div>
                            )}

                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    onClick={prevStep}
                                    className="w-1/7 items-center bg-neutral-950 hover:bg-neutral-900 transition text-white p-3 rounded-xl border border-neutral-800 h-[45px]"
                                >
                                    <BackIcon className="fill-none stroke-4 stroke-white mb-[1px]" />
                                </Button>
                                <Button
                                    type="submit"
                                    className="w-6/7 bg-neutral-950 hover:bg-neutral-900 transition text-white p-3 rounded-xl font-semibold border border-neutral-800 h-[45px]"
                                >
                                    Sign Up
                                </Button>
                            </div>
                        </>
                    )}
                </form>

                <div className="relative flex items-center w-full p-[10px]">
                    <hr className="border-t border-neutral-800 w-full" />

                    <div className="absolute top-0 left-[50%] translate-x-[-50%] text-center bg-neutral-900 px-[10px] text-neutral-400">
                        OR
                    </div>
                </div>

                <div className="flex flex-col justify-center gap-4 p-[20px] w-full">
                    <button className="p-3 rounded-xl bg-neutral-800 hover:bg-neutral-600 transition text-white border border-white/5">
                        Continue with Google
                    </button>
                    <button className="p-3 rounded-xl bg-neutral-800 hover:bg-neutral-600 transition text-white border border-white/5">
                        Continue with Facebook
                    </button>
                </div>

                <div className="text-neutral-500 text-center mt-6">
                    Already have an account?{" "}
                    <Link href="/signin" className="text-white hover:underline">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
