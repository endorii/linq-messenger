"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useChat } from "@/features/chats/hooks/useChats";
import ChatHeader from "@/features/chats/components/ChatHeader";
import ChatSidebar from "@/features/chats/components/ChatSidebar";
import ChatMessages from "@/features/chats/components/ChatMessages";
import DeleteMessage from "@/features/sidebar/modals/DeleteMessage";
import { useModalStore, useSelectionStore } from "@/store";

function ChatLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { chatSlug: chatId } = useParams<{ chatSlug: string }>();
    const { data: chat, isLoading: isChatLoading } = useChat(chatId);

    const { setSelectedChat, setSelectedMessage } = useSelectionStore();
    const { activeModal, setActiveModal } = useModalStore();

    useEffect(() => {
        if (isChatLoading) return;

        if (!chat) {
            router.push("/");
            return;
        }

        setSelectedChat(chat);
    }, [isChatLoading, chat, router, setSelectedChat]);

    if (isChatLoading) {
        return (
            <div className="flex w-full h-[100vh] items-center justify-center">
                <div className="text-gray-400">Loading chat...</div>
            </div>
        );
    }

    if (!chat) {
        return null;
    }

    return (
        <div className="flex w-full h-[100vh]">
            <div className="flex-1 relative">
                <ChatHeader chat={chat} />
                <ChatMessages>{children}</ChatMessages>
            </div>
            <ChatSidebar chat={chat} />
            <DeleteMessage
                isOpen={activeModal === "deleteMessage"}
                onClose={() => {
                    setActiveModal(null);
                    setSelectedMessage(null);
                }}
                chatId={chat.id}
            />
        </div>
    );
}

export default ChatLayout;
