"use client";
import { useMessages } from "@/features/messages/hooks/useMessages";
import { useParams } from "next/navigation";
import dayjs from "dayjs";

function ChatSlug() {
    const { chatSlug: chatId } = useParams<{ chatSlug: string }>();
    const { data: messages, isLoading } = useMessages(chatId);

    if (isLoading) return <div>Loading...</div>;

    if (!messages || messages.length === 0) return null;

    const groupedMessages = messages.reduce<Record<string, typeof messages>>(
        (acc, msg) => {
            const dateKey = dayjs(msg.createdAt).format("YYYY-MM-DD");
            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(msg);
            return acc;
        },
        {}
    );

    console.log(groupedMessages);

    return (
        <div className="flex flex-col-reverse gap-[10px] h-full w-full overflow-y-auto px-[15%] py-[20px]">
            {groupedMessages &&
                Object.entries(groupedMessages)
                    .reverse()
                    .map(([date, msgs]) => (
                        <div key={date} className="flex flex-col gap-[5px]">
                            <div className="sticky top-0 z-10 self-center bg-neutral-900 px-3 py-1 rounded-md text-sm text-gray-300 mb-2">
                                {dayjs(date).format("D MMMM")}
                            </div>
                            {msgs.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`px-[10px] py-[5px] text-white max-w-[500px] rounded-xl wrap-anywhere ${
                                        msg.isMine
                                            ? "bg-purple-gradient self-end rounded-br-none"
                                            : "bg-neutral-800 self-start rounded-bl-none"
                                    }`}
                                >
                                    {msg.content}
                                    <div className="text-xs text-gray-400 text-right">
                                        {dayjs(msg.createdAt).format("HH:mm")}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
        </div>
    );
}

export default ChatSlug;
