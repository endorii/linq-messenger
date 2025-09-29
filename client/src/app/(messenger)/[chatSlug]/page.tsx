"use client";
import { useMessages } from "@/features/messages/hooks/useMessages";
import { useParams } from "next/navigation";

function ChatSlug() {
    const { chatSlug: chatId } = useParams<{ chatSlug: string }>();
    const { data: messages, isLoading } = useMessages(chatId);

    return (
        <div className="flex flex-col-reverse gap-[3px] h-full w-full overflow-y-auto px-[15%] py-[20px]">
            {messages
                ?.slice()
                .reverse()
                .map((msg) => (
                    <div
                        key={msg.id}
                        className={`px-[10px] py-[5px] text-white max-w-[500px] rounded-xl wrap-anywhere ${
                            msg.isMine
                                ? "bg-purple-gradient self-end rounded-br-none"
                                : "bg-neutral-800 self-start rounded-bl-none"
                        }`}
                    >
                        {msg.content}
                    </div>
                ))}
        </div>
    );
}

export default ChatSlug;
