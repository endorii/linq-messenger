"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { useChat } from "@/features/chats/hooks/useChats";

import ChatHeader from "@/features/chats/components/ChatHeader";
import ChatSentData from "@/features/chats/components/ChatSentData";
import ChatSidebar from "@/features/chats/components/ChatSidebar";

function ChatLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { chatSlug: chatId } = useParams<{ chatSlug: string }>();

    const { data: chat, isLoading: isChatLoading } = useChat(chatId);

    if (!chat) return <div>Чат не знайдено</div>;

    return (
        <div className="flex w-full h-[100vh]">
            <div className="flex-1 relative">
                <ChatHeader chat={chat} setSidebarOpen={setSidebarOpen} />
                <div className="h-full pt-[65px] pb-[80px] w-full bg-[url('https://i.pinimg.com/736x/a4/a4/61/a4a461c572891b4bf1f2e6af3d127428.jpg')]">
                    {children}
                </div>
                <ChatSentData chatId={chat.id} />
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
