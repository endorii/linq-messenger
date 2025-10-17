"use client";

import { useProfile } from "@/features/auth/hooks/useAuth";
import { ChatSentData } from "@/features/chats/components/messages";
import { ChatMessagesSkeleton } from "@/features/chats/components/skeletons/ChatMessagesSkeleton";
import { useChat } from "@/features/chats/hooks/useChats";
import { ChatEmptyWindow } from "@/features/messages/components/ChatEmptyWindow";
import { ChatMessage } from "@/features/messages/components/ChatMessage";
import { ChatMessageSystem } from "@/features/messages/components/ChatMessageSystem";
import { useMessages } from "@/features/messages/hooks/useMessages";
import { ChatEnum } from "@/shared/enums/enums";
import { usePrivateChat } from "@/shared/hooks";

import dayjs from "dayjs";
import { useParams } from "next/navigation";

function ChatSlug() {
    const { chatSlug: chatId } = useParams<{ chatSlug: string }>();
    const { data: chat, isPending: isChatPending } = useChat(chatId);
    const { data: messages, isPending: isMessagesPending } =
        useMessages(chatId);

    const { data: me, isPending: isMePending } = useProfile();

    if (!chat) return null;

    const { isPrivate, meMember } = usePrivateChat(chat);
    const isGroup = chat?.type === ChatEnum.GROUP;
    const isChannel = chat?.type === ChatEnum.CHANNEL;
    const isAdmin = chat.adminId === meMember?.userId;

    const isLoading = isMessagesPending || isChatPending || isMePending;

    if (isLoading) return <ChatMessagesSkeleton />;

    const isGroupOrPrivate = isGroup || isPrivate;
    const noMessages = !messages || messages.length === 0;
    const shouldShowNoMessages =
        (isGroupOrPrivate && noMessages) ||
        (isChannel && isAdmin && noMessages);

    if (shouldShowNoMessages) {
        return <ChatEmptyWindow chatId={chatId} />;
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

    const canSendMessages =
        (chat.type === ChatEnum.PRIVATE && !chat.blockingInfo?.isBlocked) ||
        (chat.type === ChatEnum.CHANNEL && isAdmin) ||
        chat.type === ChatEnum.GROUP;

    return (
        <div className="flex flex-col h-full w-full relative">
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `url(${
                        chat.background ||
                        "https://cdn.pixabay.com/photo/2024/06/30/10/28/sky-8862862_1280.png"
                    })`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    filter: "blur(8px)", //додати перемикач для блюру
                    zIndex: 0,
                }}
            />

            <div className="relative flex flex-col h-full w-full pt-[65px] z-10">
                <div className="flex-1 flex flex-col-reverse gap-[10px] h-full w-full overflow-y-auto px-[15%] py-[20px]">
                    {groupedMessages &&
                        Object.entries(groupedMessages)
                            .reverse()
                            .map(([date, msgs]) => (
                                <div
                                    key={date}
                                    className="flex flex-col gap-[5px]"
                                >
                                    <div className="sticky top-0 z-10 self-center bg-neutral-900 px-3 py-1 rounded-md text-sm text-gray-300 mb-2">
                                        {dayjs(date).format("D MMMM")}
                                    </div>
                                    {msgs.map((msg, i) => {
                                        const prevMsg = msgs[i - 1];
                                        const nextMsg = msgs[i + 1];

                                        const isSameSenderAsPrev =
                                            prevMsg &&
                                            prevMsg.sender?.id ===
                                                msg.sender?.id;
                                        const isSameSenderAsNext =
                                            nextMsg &&
                                            nextMsg.sender?.id ===
                                                msg.sender?.id;

                                        const sender = msg.sender;
                                        const avatarUrl =
                                            sender?.avatarUrl || "";
                                        const username = sender?.username;

                                        if (msg.type === "SYSTEM") {
                                            return (
                                                <ChatMessageSystem
                                                    msg={msg}
                                                    key={msg.id}
                                                />
                                            );
                                        }

                                        return (
                                            <ChatMessage
                                                key={msg.id}
                                                msg={msg}
                                                isSameSenderAsPrev={
                                                    isSameSenderAsPrev
                                                }
                                                isSameSenderAsNext={
                                                    isSameSenderAsNext
                                                }
                                                isChannel={false}
                                                avatarUrl={avatarUrl}
                                                username={username}
                                                me={me}
                                                isAdmin={isAdmin}
                                                isPrivate={isPrivate}
                                            />
                                        );
                                    })}
                                </div>
                            ))}
                </div>

                {canSendMessages && <ChatSentData chatId={chatId} />}
            </div>
        </div>
    );
}

export default ChatSlug;
