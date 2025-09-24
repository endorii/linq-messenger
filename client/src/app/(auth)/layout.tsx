"use client";

import { useProfile } from "@/features/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function AuthLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { data: user, isLoading } = useProfile();

    useEffect(() => {
        if (!isLoading && user) {
            router.replace("/");
        }
    }, [isLoading, user, router]);

    if (isLoading || user) {
        return null;
    }

    return <>{children}</>;
}

export default AuthLayout;
