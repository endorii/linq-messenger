import { IChat } from "@/shared/interfaces";
import { PinnedMessagesHeader } from "./header/PinnedMessagesHeader";
import PinnedChatMessages from "./messages/PinnedChatMessages";
import { usePinMessages } from "@/features/messages/hooks/usePinnedMessages";
import { ChatPinnedMessagesHeaderSkeleton } from "./skeletons/ChatPinnedMessagesHeaderSkeleton";
import { ChatPinnedMessagesSkeleton } from "./skeletons/ChatPinnedMessagesSkeleton";
import { UnpinAllMessages } from "@/features/sidebar/modals";
import { useModalStore } from "@/store";

export function ChatPinnedMessagesWrapper({ chat }: { chat: IChat }) {
    const { data: pinnedMessages, isPending: isPinnedMessagesPending } =
        usePinMessages(chat.id);

    const { activeModal, setActiveModal } = useModalStore();

    if (isPinnedMessagesPending) {
        return (
            <div className="flex-1 relative overflow-hidden">
                <ChatPinnedMessagesHeaderSkeleton />
                <ChatPinnedMessagesSkeleton />
            </div>
        );
    }

    if (!chat || !pinnedMessages) return null;

    const handleCloseModal = () => {
        setActiveModal(null);
    };

    return (
        <div className="flex-1 relative overflow-hidden">
            <PinnedMessagesHeader chat={chat} />
            <PinnedChatMessages chat={chat} pinnedMessages={pinnedMessages} />

            <UnpinAllMessages
                isOpen={activeModal === "unpinAll"}
                onClose={handleCloseModal}
                pinnedMessages={pinnedMessages}
                chatId={chat.id}
            />
        </div>
    );
}
