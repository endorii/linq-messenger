"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { useChat } from "@/features/chats/hooks/useChats";
import ChatHeader from "@/features/chats/components/ChatHeader";
import ChatSentData from "@/features/chats/components/ChatSentData";
import ChatSidebar from "@/features/chats/components/ChatSidebar";
import { useProfile } from "@/features/auth/hooks/useAuth";
import ChatMessages from "@/features/chats/components/ChatMessages";
import { ChatEnum } from "@/shared/enums/enums";
import DeleteMessage from "@/features/sidebar/modals/DeleteMessage";
import { useSidebarStore } from "@/store/sidebarStore";

function ChatLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { chatSlug: chatId } = useParams<{ chatSlug: string }>();
    const { data: chat, isLoading: isChatLoading } = useChat(chatId);
    const { data: me, isLoading: isMeLoading } = useProfile();
    const { activeModal, setSelectedMessage, setActiveModal, setSelectedChat } =
        useSidebarStore();

    useEffect(() => {
        if (!isChatLoading && !chat) {
            router.push("/");
        }

        setSelectedChat(chat ?? null);
    }, [isChatLoading, chat, router]);

    if (!chat) return null;

    const isAdmin = chat.adminId === me?.id;
    const canSendMessages =
        chat.type !== ChatEnum.CHANNEL ||
        (chat.type === ChatEnum.CHANNEL && isAdmin);

    return (
        <div className="flex w-full h-[100vh]">
            <div className="flex-1 relative">
                <ChatHeader chat={chat} />

                <ChatMessages>{children}</ChatMessages>

                {canSendMessages && <ChatSentData chatId={chat.id} />}
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
