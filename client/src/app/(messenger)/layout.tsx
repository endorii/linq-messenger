"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useProfile } from "@/features/auth/hooks/useAuth";
import Sidebar from "@/features/sidebar/components/Sidebar";

export default function MessengerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { data: user, isLoading } = useProfile();

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace("/signin");
        }
    }, [isLoading, user, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center w-screen h-screen text-white">
                Loading...
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="flex w-screen h-screen px-[5%] bg-neutral-950 text-white">
            <Sidebar user={user} />
            {children}
        </div>
    );
}
