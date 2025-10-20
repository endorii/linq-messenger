"use client";

import { useProfile } from "@/features/auth/hooks/useAuth";
import { ChatSentData } from "@/features/chats/components/messages";
import { ChatSelectedMessagesPanel } from "@/features/chats/components/messages/ChatSelectedMessagesPanel";
import { ChatMessagesSkeleton } from "@/features/chats/components/skeletons/ChatMessagesSkeleton";
import { useChat } from "@/features/chats/hooks/useChats";
import { ChatEmptyWindow } from "@/features/messages/components/ChatEmptyWindow";
import { ChatMessage } from "@/features/messages/components/ChatMessage";
import { ChatMessageSystem } from "@/features/messages/components/ChatMessageSystem";
import { useMessages } from "@/features/messages/hooks/useMessages";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { ChatEnum } from "@/shared/enums/enums";
import { usePrivateChat } from "@/shared/hooks";
import { useSelectionStore } from "@/store";

import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useEffect } from "react";

function ChatSlug() {
    const { chatSlug: chatId } = useParams<{ chatSlug: string }>();
    const { data: chat, isPending: isChatPending } = useChat(chatId);
    const { data: messages, isPending: isMessagesPending } =
        useMessages(chatId);

    const { data: me, isPending: isMePending } = useProfile();
    const {
        selectedMessages,
        toggleSelectedMessage,
        clearSelectedMessages,
        setSelectedMessage,
    } = useSelectionStore();

    if (!chat) return null;

    useEffect(() => {
        clearSelectedMessages();
        setSelectedMessage(null);
    }, [chatId, clearSelectedMessages]);

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
        (selectedMessages.length <= 0 &&
            chat.type === ChatEnum.PRIVATE &&
            !chat.blockingInfo?.isBlocked) ||
        (chat.type === ChatEnum.CHANNEL && isAdmin) ||
        chat.type === ChatEnum.GROUP;

    return (
        <div className="flex flex-col h-full w-full relative">
            <div className="flex-1 flex flex-col-reverse gap-[10px] h-full w-full overflow-y-auto px-[15%] py-[20px]">
                {shouldShowNoMessages && <ChatEmptyWindow chatId={chatId} />}
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
                                    const avatarUrl = sender?.avatarUrl || "";
                                    const username = sender?.username;

                                    if (msg.type === "SYSTEM") {
                                        return (
                                            <ChatMessageSystem
                                                msg={msg}
                                                key={msg.id}
                                            />
                                        );
                                    }

                                    const isSelected =
                                        selectedMessages.includes(msg.id);

                                    return (
                                        <div
                                            key={msg.id}
                                            className={`relative flex items-center gap-[20px] p-[5px] ${
                                                (isSelected &&
                                                    "bg-white/3 rounded-md") ||
                                                (selectedMessages &&
                                                    selectedMessages.length >
                                                        0 &&
                                                    " cursor-pointer")
                                            }`}
                                            onClick={() => {
                                                if (
                                                    selectedMessages &&
                                                    selectedMessages.length > 0
                                                ) {
                                                    toggleSelectedMessage(
                                                        msg.id
                                                    );
                                                }
                                            }}
                                        >
                                            {selectedMessages &&
                                                selectedMessages.length > 0 && (
                                                    <Checkbox
                                                        className="absolute left-[-70px]"
                                                        checked={isSelected}
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                        onCheckedChange={() =>
                                                            toggleSelectedMessage(
                                                                msg.id
                                                            )
                                                        }
                                                    />
                                                )}

                                            <ChatMessage
                                                msg={msg}
                                                isSameSenderAsPrev={
                                                    isSameSenderAsPrev
                                                }
                                                isSameSenderAsNext={
                                                    isSameSenderAsNext
                                                }
                                                isGroup={isGroup}
                                                avatarUrl={avatarUrl}
                                                username={username}
                                                me={me}
                                                isAdmin={isAdmin}
                                                isPrivate={isPrivate}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
            </div>

            {canSendMessages && selectedMessages.length <= 0 ? (
                <ChatSentData chatId={chatId} />
            ) : selectedMessages.length > 0 ? (
                <ChatSelectedMessagesPanel />
            ) : null}
        </div>
    );
}

export default ChatSlug;
