"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useChat } from "@/features/chats/hooks/useChats";
import ChatHeader from "@/features/chats/components/ChatHeader";
import ChatSentData from "@/features/chats/components/ChatSentData";
import ChatSidebar from "@/features/chats/components/ChatSidebar";
import { useProfile } from "@/features/auth/hooks/useAuth";
import ChatMessages from "@/features/chats/components/ChatMessages";
import { ChatEnum } from "@/shared/enums/enums";

function ChatLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { chatSlug: chatId } = useParams<{ chatSlug: string }>();

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const { data: chat, isLoading: isChatLoading } = useChat(chatId);
    const { data: me, isLoading: isMeLoading } = useProfile();

    useEffect(() => {
        if (!isChatLoading && !chat) {
            router.push("/");
        }
    }, [isChatLoading, chat, router]);

    if (!chat) {
        return null;
    }

    const isAdmin = chat.members.some(
        (member) => member.user.id === me?.id && member.role === "ADMIN"
    );

    const canSendMessages =
        chat.type !== ChatEnum.CHANNEL ||
        (chat.type === ChatEnum.CHANNEL && isAdmin);

    return (
        <div className="flex w-full h-[100vh]">
            <div className="flex-1 relative">
                <ChatHeader chat={chat} setSidebarOpen={setSidebarOpen} />

                <ChatMessages>{children}</ChatMessages>

                {canSendMessages && <ChatSentData chatId={chat.id} />}
            </div>
            <ChatSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                chat={chat}
            />
        </div>
    );
}

export default ChatLayout;
