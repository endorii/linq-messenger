"use client";

import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

function authLayout({ children }: { children: ReactNode }) {
    const { accessToken } = useAuthStore();
    const router = useRouter();
    useEffect(() => {
        if (accessToken) {
            router.push("/");
        }
    }, [accessToken, router]);
    return <div>{children}</div>;
}

export default authLayout;
