"use client";

import Sidebar from "@/features/sidebar/components/Sidebar";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MessengerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { accessToken } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!accessToken) {
            router.push("/signin");
        }
    }, [accessToken, router]);

    if (!accessToken) return <div>Loading...</div>;

    return (
        <div className="flex w-screen h-screen px-[5%] bg-neutral-950">
            <Sidebar />
            {children}
        </div>
    );
}
