import { IChat } from "@/shared/interfaces";
import { ChatHeader } from "./header/ChatHeader";
import { ChatMessages } from "./messages";
import { ChatSidebar } from "./sidebar/ChatSidebar";
import { ChatHeaderSkeleton } from "./skeletons/ChatHeaderSkeleton";
import { ChatMessagesSkeleton } from "./skeletons/ChatMessagesSkeleton";

export function ChatMessagesWrapper({
    children,
    chat,
    isChatPending,
}: {
    children: React.ReactNode;
    chat: IChat;
    isChatPending: boolean;
}) {
    return (
        <>
            <div className="flex-1 relative overflow-hidden">
                {isChatPending || !chat ? (
                    <ChatHeaderSkeleton />
                ) : (
                    <ChatHeader chat={chat} isChatPending={isChatPending} />
                )}

                {isChatPending || !chat ? (
                    <ChatMessagesSkeleton />
                ) : (
                    <ChatMessages>{children}</ChatMessages>
                )}
            </div>

            {chat && <ChatSidebar chat={chat} />}
        </>
    );
}
