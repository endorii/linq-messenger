"use client";

import { useChat } from "@/features/chats/hooks/useChats";
import { DeleteMessage } from "@/features/sidebar/modals";
import { useSelectionStore, useModalStore, useNavigationStore } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ChatMessagesWrapper } from "./ChatMessagesWrapper";
import { ChatPinnedMessagesWrapper } from "./ChatPinnedMessagesWrapper";
import { DeleteMessages } from "@/features/sidebar/modals/DeletedMessages";

export function ChatLayoutWrapper({
    children,
    chatSlug,
}: {
    children: React.ReactNode;
    chatSlug: string;
}) {
    const router = useRouter();

    const { data: chat, isPending: isChatPending } = useChat(chatSlug);

    const { setSelectedChat, setSelectedMessage, clearSelectedMessages } =
        useSelectionStore();
    const { activeModal, setActiveModal } = useModalStore();
    const { chatView } = useNavigationStore();

    const { setChatView } = useNavigationStore();

    useEffect(() => {
        setChatView("messages");
    }, [chatSlug]);

    useEffect(() => {
        if (!chat && !isChatPending) {
            router.push("/");
            return;
        }

        if (chat) {
            setSelectedChat(chat);
        }
    }, [chat, router, setSelectedChat, isChatPending]);

    return (
        <div className="flex w-full h-[100vh] relative">
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `url(${chat?.background || "/BG.png"})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    filter: "blur(0px)", // TODO: зробити перемикач для блюру
                    zIndex: 0,
                }}
            />
            {chat && (
                <>
                    {chatView === "messages" ? (
                        <ChatMessagesWrapper
                            chat={chat}
                            isChatPending={isChatPending}
                        >
                            {children}
                        </ChatMessagesWrapper>
                    ) : chatView === "pinned" ? (
                        <ChatPinnedMessagesWrapper chat={chat} />
                    ) : null}

                    {chat && (
                        <>
                            <DeleteMessage
                                isOpen={activeModal === "deleteMessage"}
                                onClose={() => {
                                    setActiveModal(null);
                                    setSelectedMessage(null);
                                }}
                                chatId={chat.id}
                            />
                            <DeleteMessages
                                isOpen={activeModal === "deleteMessages"}
                                onClose={() => {
                                    setActiveModal(null);
                                    clearSelectedMessages();
                                }}
                                chatId={chat.id}
                            />
                        </>
                    )}
                </>
            )}
        </div>
    );
}
