"use client";

import { useProfile } from "@/features/auth/hooks/useAuth";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function AuthLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { data: user, isLoading } = useProfile();
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        if (!isLoading && user) {
            router.replace("/");
        }
    }, [isLoading, user, router]);

    if (isLoading || user) {
        return null;
    }

    return (
        <div className="relative">
            <button
                className="absolute top-3 right-3 p-[5px] rounded-md bg-neutral-200 dark:bg-neutral-900"
                onClick={() => {
                    if (theme === "dark") {
                        setTheme("light");
                    } else {
                        setTheme("dark");
                    }
                }}
            >
                {theme === "light" ? (
                    <MoonIcon className="w-[27px] h-[27px] stroke-none fill-neutral-700" />
                ) : (
                    <SunIcon className="w-[27px] h-[27px] fill-white" />
                )}
            </button>
            {children}
        </div>
    );
}

export default AuthLayout;
