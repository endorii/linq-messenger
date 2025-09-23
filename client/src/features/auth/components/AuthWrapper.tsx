"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
    const fetchProfile = useAuthStore((state) => state.fetchProfile);
    const accessToken = useAuthStore((state) => state.accessToken);

    useEffect(() => {
        if (accessToken) {
            fetchProfile();
        }
    }, [accessToken, fetchProfile]);

    return <>{children}</>;
}
