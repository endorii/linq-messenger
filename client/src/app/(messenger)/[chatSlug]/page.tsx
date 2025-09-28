"use client";

import { useMessages } from "@/features/messages/hooks/useMessages";
import { useParams } from "next/navigation";

function ChatSlug() {
    const { chatSlug: chatId } = useParams<{ chatSlug: string }>();
    const { data: messages, isLoading } = useMessages(chatId);

    return (
        <div className="flex flex-col h-full w-full bg-neutral-900 items-center justify-between"></div>
    );
}

export default ChatSlug;
