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
import useEscapeKeyNavigate from "@/shared/hooks/useEscapeKeyNavigate";

export default function MessengerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    useEscapeKeyNavigate();
    const { data: user, isLoading } = useProfile();

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace("/signin");
        }
    }, [isLoading, user, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center w-screen h-screen bg-purple-gradient text-white">
                <LinqIcon className="w-[100px] h-[100px] animate-ping" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="flex w-screen h-screen bg-neutral-900 text-white">
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel minSize={20} maxSize={30} defaultSize={20}>
                    <Sidebar user={user} />
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel
                    defaultSize={70}
                    className="bg-[url('https://i.pinimg.com/736x/a4/a4/61/a4a461c572891b4bf1f2e6af3d127428.jpg')]"
                >
                    {children}
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
