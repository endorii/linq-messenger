"use client";

import { LinqIcon } from "@/shared/icons";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const [showPassword, setShowPassword] = useState(false);

    const handleSignIn = () => {
        console.log("Sign in with:", email, password);
        // Тут додати логіку авторизації
    };

    return (
        <div className="flex items-center justify-center min-h-screen text-white px-[30px]">
            <div className="flex flex-col gap-[10px] items-center w-full max-w-[500px] rounded-2xl shadow-lg bg-neutral-900 p-[20px] max-h-[90vh] overflow-y-auto">
                <div className="flex gap-[10px] items-center justify-center w-full p-[10px]">
                    <LinqIcon className="w-[150px] h-[150px]" />
                    <h2 className="text-3xl font-bold text-white text-center">
                        Welcome to Linq
                    </h2>
                </div>
                <hr className="border-t border-neutral-800 w-full" />
                <div className="text-center text-lg mt-[15px]">
                    <span className="font-semibold">Sign in</span> to continue
                    to your chats
                </div>

                <div className="flex flex-col gap-4 w-full p-[20px] text-white">
                    <Input
                        type="email"
                        id="email"
                        placeholder="Email"
                        className="h-[45px] border-neutral-800"
                    />

                    <Input
                        type="password"
                        id="password"
                        placeholder="Password"
                        className="h-[45px] border-neutral-800"
                    />

                    <Button
                        onClick={handleSignIn}
                        className="w-full bg-neutral-950 hover:bg-neutral-900 transition text-white p-3 rounded-xl font-semibold border border-neutral-800 h-[45px] cursor-pointer"
                    >
                        Sign In
                    </Button>
                </div>

                <div className="text-center text-neutral-400 my-4">
                    or sign in with
                </div>

                <div className="flex justify-center gap-4">
                    <button className="p-3 rounded-xl bg-neutral-700 hover:bg-neutral-600 transition text-white w-1/2">
                        Google
                    </button>
                    <button className="p-3 rounded-xl bg-neutral-700 hover:bg-neutral-600 transition text-white w-1/2">
                        Facebook
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
