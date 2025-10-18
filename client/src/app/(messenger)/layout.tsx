"use client";

import { useProfile } from "@/features/auth/hooks/useAuth";
import { Sidebar } from "@/features/sidebar/components/Sidebar";
import {
    ResizablePanelGroup,
    ResizablePanel,
    ResizableHandle,
} from "@/shared/components/ui/resizable";
import { useEscapeKeyNavigate } from "@/shared/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MessengerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    useEscapeKeyNavigate();

    const { data: me, isPending: isMePending } = useProfile();

    const [sidebarSize, setSidebarSize] = useState({
        default: 23,
        min: 17,
        max: 35,
    });

    useEffect(() => {
        if (!me && !isMePending) {
            router.replace("/signin");
        }
    }, [isMePending, me, router]);

    useEffect(() => {
        function handleResize() {
            const width = window.innerWidth;

            if (width < 768) {
                setSidebarSize({ default: 70, min: 50, max: 90 });
            } else if (width < 1280) {
                setSidebarSize({ default: 25, min: 20, max: 35 });
            } else {
                setSidebarSize({ default: 23, min: 17, max: 35 });
            }
        }

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (isMePending) {
        return null;
        // return (
        //     <div className="flex items-center justify-center w-screen h-screen bg-purple-gradient text-white">
        //         <LinqIcon className="w-[100px] h-[100px] animate-ping" />
        //     </div>
        // );
    }

    if (!me && !isMePending) {
        return null;
    }

    return (
        <div className="flex w-screen h-screen bg-neutral-900 text-white overflow-hidden">
            <ResizablePanelGroup
                direction="horizontal"
                className="h-full w-full"
            >
                <ResizablePanel
                    defaultSize={sidebarSize.default}
                    minSize={sidebarSize.min}
                    maxSize={sidebarSize.max}
                    className="h-full overflow-hidden border-r border-neutral-800"
                >
                    <Sidebar user={me} />
                </ResizablePanel>

                <ResizableHandle className="bg-neutral-800 hover:bg-neutral-700 transition-colors duration-200" />

                <ResizablePanel className="h-full overflow-hidden flex-1 bg-neutral-950">
                    <div className="relative h-full w-full">{children}</div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
