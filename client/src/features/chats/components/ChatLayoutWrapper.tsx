"use client";

import { useChat } from "@/features/chats/hooks/useChats";
import { useSelectionStore, useModalStore, useNavigationStore } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ChatMessagesWrapper } from "./ChatMessagesWrapper";
import { ChatPinnedMessagesWrapper } from "./ChatPinnedMessagesWrapper";
import { useTheme } from "next-themes";

export function ChatLayoutWrapper({
    children,
    chatSlug,
}: {
    children: React.ReactNode;
    chatSlug: string;
}) {
    const router = useRouter();

    const { data: chat, isPending: isChatPending } = useChat(chatSlug);

    const { theme } = useTheme();

    const { setSelectedChat } = useSelectionStore();
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
                    backgroundImage: `url(${
                        chat?.background || theme === "dark"
                            ? "/bg-dark.png"
                            : "/bg-light.png"
                    } )`,
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
                </>
            )}
        </div>
    );
}
