"use client";

import { ChatHeader } from "@/features/chats/components/header/ChatHeader";
import { ChatMessages } from "@/features/chats/components/messages";
import { ChatSidebar } from "@/features/chats/components/sidebar/ChatSidebar";

import { useChat } from "@/features/chats/hooks/useChats";
import { DeleteMessage } from "@/features/sidebar/modals";
import { useSelectionStore, useModalStore } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ChatHeaderSkeleton } from "./skeletons/ChatHeaderSkeleton";
import { ChatMessagesSkeleton } from "./skeletons/ChatMessagesSkeleton";

export function ChatLayoutWrapper({
    children,
    chatSlug,
}: {
    children: React.ReactNode;
    chatSlug: string;
}) {
    const router = useRouter();

    const { data: chat, isLoading: isChatLoading } = useChat(chatSlug);

    const { setSelectedChat, setSelectedMessage } = useSelectionStore();
    const { activeModal, setActiveModal } = useModalStore();

    useEffect(() => {
        if (!chat && !isChatLoading) {
            router.push("/");
            return;
        }

        if (chat) {
            setSelectedChat(chat);
        }
    }, [chat, router, setSelectedChat, isChatLoading]);

    return (
        <div className="flex w-full h-[100vh]">
            <div className="flex-1 relative overflow-hidden">
                {isChatLoading || !chat ? (
                    <ChatHeaderSkeleton />
                ) : (
                    <ChatHeader chat={chat} isChatLoading={isChatLoading} />
                )}

                {isChatLoading || !chat ? (
                    <ChatMessagesSkeleton />
                ) : (
                    <ChatMessages chat={chat}>{children}</ChatMessages>
                )}
            </div>

            {chat && <ChatSidebar chat={chat} />}

            {chat && (
                <DeleteMessage
                    isOpen={activeModal === "deleteMessage"}
                    onClose={() => {
                        setActiveModal(null);
                        setSelectedMessage(null);
                    }}
                    chatId={chat.id}
                />
            )}
        </div>
    );
}
