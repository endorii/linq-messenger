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
import Image from "next/image";
import { useSidebarStore } from "@/store/sidebarStore";

function ChatSlug() {
    const { chatSlug: chatId } = useParams<{ chatSlug: string }>();
    const { data: messages, isLoading } = useMessages(chatId);
    const { data: chat } = useChat(chatId);
    const { data: me } = useProfile();
    const useCreateMessageMutation = useCreateMessage();

    const { setMessageForEdit, setChatSentType } = useSidebarStore();

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
                            {msgs.map((msg, i) => {
                                const prevMsg = msgs[i - 1];
                                const nextMsg = msgs[i + 1];

                                const isSameSenderAsPrev =
                                    prevMsg &&
                                    prevMsg.sender?.id === msg.sender?.id;
                                const isSameSenderAsNext =
                                    nextMsg &&
                                    nextMsg.sender?.id === msg.sender?.id;

                                const sender = msg.sender;
                                const avatarUrl =
                                    sender?.avatarUrl ||
                                    "/images/default-avatar.png";
                                const username = sender?.username || "Unknown";

                                if (msg.type === "SYSTEM") {
                                    return (
                                        <div
                                            key={msg.id}
                                            className="self-center text-sm text-gray-400 my-3 bg-neutral-900/40 px-3 py-1 rounded-md"
                                        >
                                            {msg.content}
                                        </div>
                                    );
                                }

                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex ${
                                            msg.isMine
                                                ? "justify-end"
                                                : "justify-start"
                                        } ${!isSameSenderAsPrev ? "mt-3" : ""}`}
                                    >
                                        <div
                                            className={`flex flex-col ${
                                                msg.isMine
                                                    ? "items-end"
                                                    : "items-start"
                                            } relative`}
                                        >
                                            <ContextMenu>
                                                <ContextMenuTrigger
                                                    onContextMenu={() =>
                                                        setMessageForEdit(msg)
                                                    }
                                                    className={`px-[10px] py-[6px] max-w-[500px] rounded-xl wrap-anywhere ${
                                                        msg.isMine
                                                            ? "bg-purple-gradient self-end rounded-br-none"
                                                            : "bg-neutral-800 self-start rounded-bl-none"
                                                    } ${
                                                        isSameSenderAsPrev
                                                            ? "mt-[2px]"
                                                            : ""
                                                    }`}
                                                >
                                                    <div>
                                                        {msg.content}
                                                        <div className="flex gap-[3px] justify-end">
                                                            <div className="text-xs text-gray-400 ">
                                                                {msg.createdAt !==
                                                                msg.updatedAt ? (
                                                                    <div className="text-xs text-gray-400 text-right">
                                                                        edited
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                            <div className="text-xs text-gray-400 text-right">
                                                                {dayjs(
                                                                    msg.createdAt
                                                                ).format(
                                                                    "HH:mm"
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </ContextMenuTrigger>

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
                                                                    onClick={() =>
                                                                        console.log(
                                                                            "Clicked emoji:",
                                                                            emoji
                                                                        )
                                                                    }
                                                                >
                                                                    {emoji}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </ContextMenuItem>
                                                    <ContextMenuSeparator />
                                                    <ContextMenuItem>
                                                        Reply
                                                    </ContextMenuItem>
                                                    {msg.isMine && (
                                                        <ContextMenuItem
                                                            onClick={() => {
                                                                setChatSentType(
                                                                    "edit"
                                                                );
                                                            }}
                                                        >
                                                            Edit
                                                        </ContextMenuItem>
                                                    )}
                                                    <ContextMenuItem>
                                                        Copy
                                                    </ContextMenuItem>
                                                    <ContextMenuItem>
                                                        Pin
                                                    </ContextMenuItem>
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

                                            {!msg.isMine &&
                                                !isSameSenderAsNext && (
                                                    <div className="absolute bottom-0 left-[-40px]">
                                                        <Image
                                                            src={avatarUrl}
                                                            alt={username}
                                                            width={32}
                                                            height={32}
                                                            className="rounded-full object-cover"
                                                        />
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
        </div>
    );
}

export default ChatSlug;
