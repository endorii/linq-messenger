import { IChat } from "@/shared/interfaces";
import { PinnedMessagesHeader } from "./header/PinnedMessagesHeader";
import PinnedChatMessages from "./messages/PinnedChatMessages";
import { usePinMessages } from "@/features/messages/hooks/usePinnedMessages";
import { ChatPinnedMessagesHeaderSkeleton } from "./skeletons/ChatPinnedMessagesHeaderSkeleton";
import { ChatPinnedMessagesSkeleton } from "./skeletons/ChatPinnedMessagesSkeleton";

export function ChatPinnedMessagesWrapper({ chat }: { chat: IChat }) {
    const { data: pinedMessages, isPending: isPinnedMessagesPending } =
        usePinMessages(chat.id);

    if (isPinnedMessagesPending) {
        return (
            <div className="flex-1 relative overflow-hidden">
                <ChatPinnedMessagesHeaderSkeleton />
                <ChatPinnedMessagesSkeleton />
            </div>
        );
    }

    if (!chat || !pinedMessages) return null;

    return (
        <div className="flex-1 relative overflow-hidden">
            <PinnedMessagesHeader chat={chat} />
            <PinnedChatMessages chat={chat} pinedMessages={pinedMessages} />
        </div>
    );
}
