"use client";
import Sidebar from "@/features/sidebar/components/Sidebar";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex w-screen h-screen px-[5%] bg-neutral-950 text-white">
            <Sidebar />
            {children}
        </div>
    );
}
