"use client";

import {
    useCreateMessage,
    useMessages,
} from "@/features/messages/hooks/useMessages";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import { MessageIcon } from "@/shared/icons";
import { useProfile } from "@/features/auth/hooks/useAuth";
import { useChat } from "@/features/chats/hooks/useChats";
import { ChatEnum } from "@/shared/enums/enums";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
    ContextMenuSeparator,
} from "@/shared/components/ui/context-menu";

function ChatSlug() {
    const { chatSlug: chatId } = useParams<{ chatSlug: string }>();
    const { data: messages, isLoading } = useMessages(chatId);
    const { data: chat } = useChat(chatId);
    const { data: me } = useProfile();
    const useCreateMessageMutation = useCreateMessage();

    const handleSend = (msg: string) => {
        useCreateMessageMutation.mutateAsync({
            chatId,
            messagePayload: { content: msg },
        });
    };

    const messagesForEmptyChat = ["Hi👋", "Welcome", ":)"];

    if (isLoading) return <div>Loading...</div>;

    const isAdmin = chat?.members.some(
        (member) => member.user.id === me?.id && member.role === "ADMIN"
    );
    const isChannel = chat?.type === ChatEnum.CHANNEL;

    const shouldShowNoMessages =
        !messages || (messages.length === 0 && !(isChannel && !isAdmin));

    if (shouldShowNoMessages) {
        return (
            <div className="flex w-full flex-col items-center justify-center h-full ">
                <div className="flex flex-col p-[20px] border border-white/5 rounded-xl backdrop-blur-[5px] max-w-[300px]">
                    <div className="font-bold text-center">
                        No messages here yet...
                    </div>
                    <div className="text-center">
                        Sent a message or choose one below
                    </div>
                    <div className="flex flex-col gap-[10px] mt-[20px]">
                        {messagesForEmptyChat.map((msg, i) => (
                            <div
                                className="group flex gap-[10px] items-center border-2 border-white/5 hover:border-violet-500 p-[10px] rounded-xl transition-all duration-200 cursor-pointer hover:bg-neutral-950"
                                key={i}
                                onClick={() => handleSend(msg)}
                            >
                                <MessageIcon className="w-[25px] fill-none stroke-2 stroke-white/60 group-hover:stroke-white" />
                                <div>{`"${msg}"`}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const groupedMessages = messages?.reduce<Record<string, typeof messages>>(
        (acc, msg) => {
            const dateKey = dayjs(msg.createdAt).format("YYYY-MM-DD");
            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(msg);
            return acc;
        },
        {}
    );

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
                                <ContextMenu key={msg.id}>
                                    {msg.type === "TEXT" ? (
                                        <ContextMenuTrigger
                                            className={`px-[10px] py-[5px] max-w-[500px] rounded-xl wrap-anywhere ${
                                                msg.isMine
                                                    ? "bg-purple-gradient self-end rounded-br-none"
                                                    : "bg-neutral-800 self-start rounded-bl-none"
                                            }`}
                                        >
                                            <div key={msg.id}>
                                                {msg.content}
                                                <div className="text-xs text-gray-400 text-right">
                                                    {dayjs(
                                                        msg.createdAt
                                                    ).format("HH:mm")}
                                                </div>
                                            </div>
                                        </ContextMenuTrigger>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            <ContextMenuTrigger className="flex items-center justify-center p-[2px] bg-purple-gradient rounded-xl">
                                                <div
                                                    key={msg.id}
                                                    className={
                                                        "px-[15px] py-[3px] border border-white/5 bg-neutral-900 rounded-xl backdrop-blur-[5px] font-medium text-neutral-300"
                                                    }
                                                >
                                                    {msg.content}
                                                </div>
                                            </ContextMenuTrigger>
                                        </div>
                                    )}

                                    <ContextMenuContent className="w-[200px]">
                                        <ContextMenuItem className="p-0 focus:bg-transparent">
                                            <div className="flex gap-2 overflow-x-auto max-w-full p-2">
                                                {[
                                                    "👍",
                                                    "❤️",
                                                    "😂",
                                                    "🔥",
                                                    "🎉",
                                                    "😢",
                                                    "😡",
                                                    "🤔",
                                                    "🙏",
                                                ].map((emoji) => (
                                                    <button
                                                        key={emoji}
                                                        className="text-2xl hover:scale-110 transition-transform flex-shrink-0"
                                                        onClick={() => {
                                                            console.log(
                                                                "Clicked emoji:",
                                                                emoji
                                                            );
                                                            // тут треба викликати мутацію для реакції
                                                        }}
                                                    >
                                                        {emoji}
                                                    </button>
                                                ))}
                                            </div>
                                        </ContextMenuItem>

                                        <ContextMenuSeparator />

                                        <ContextMenuItem className="group">
                                            <div>Reply</div>
                                        </ContextMenuItem>

                                        {msg.isMine && (
                                            <ContextMenuItem>
                                                Edit
                                            </ContextMenuItem>
                                        )}

                                        <ContextMenuItem>Copy</ContextMenuItem>
                                        <ContextMenuItem>Pin</ContextMenuItem>
                                        <ContextMenuItem>
                                            Forward
                                        </ContextMenuItem>
                                        <ContextMenuItem>
                                            Select
                                        </ContextMenuItem>
                                        <ContextMenuItem variant="destructive">
                                            Delete
                                        </ContextMenuItem>
                                    </ContextMenuContent>
                                </ContextMenu>
                            ))}
                        </div>
                    ))}
        </div>
    );
}

export default ChatSlug;
