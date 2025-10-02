"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useProfile } from "@/features/auth/hooks/useAuth";
import Sidebar from "@/features/sidebar/components/Sidebar";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/shared/components/ui/resizable";
import { LinqIcon } from "@/shared/icons";

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
            <div className="flex items-center justify-center w-screen h-screen bg-neutral-950 text-white">
                <LinqIcon className="w-[100px] h-[100px] animate-spin" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="flex w-screen h-screen bg-neutral-900 text-white">
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel minSize={15} maxSize={30}>
                    <Sidebar user={user} />
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={80}>{children}</ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
