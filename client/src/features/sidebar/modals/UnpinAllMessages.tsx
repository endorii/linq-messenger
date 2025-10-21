"use client";

import { useLeaveChat, useDeleteChat } from "@/features/chats/hooks/useChats";
import { useUnpinAllMessages } from "@/features/messages/hooks/usePinnedMessages";
import { Button } from "@/shared/components/ui/button";
import { ModalWrapper } from "@/shared/components/wrappers/ModalWrapper";
import { ChatEnum } from "@/shared/enums/enums";
import { useEscapeKeyClose } from "@/shared/hooks";
import { CloseIcon } from "@/shared/icons";
import { IPinnedMessage } from "@/shared/interfaces/IMessage";
import { useNavigationStore } from "@/store";
import { createPortal } from "react-dom";

interface UnpinAllMessagesProps {
    isOpen: boolean;
    onClose: () => void;
    pinnedMessages: IPinnedMessage[];
    chatId: string;
}

export function UnpinAllMessages({
    isOpen,
    onClose,
    pinnedMessages,
    chatId,
}: UnpinAllMessagesProps) {
    const unpinAllMeessagesMutation = useUnpinAllMessages();
    const { setChatView } = useNavigationStore();

    useEscapeKeyClose({ isOpen, onClose });
    if (!isOpen) return null;

    const handleUnpinAllMessages = () => {
        if (!chatId) return;
        unpinAllMeessagesMutation.mutateAsync(chatId);
        setChatView("messages");
        onClose();
    };

    const modalTitle = `Unpin All ${pinnedMessages.length} Messages`;

    const modalContent = (
        <ModalWrapper onClose={onClose} modalTitle={modalTitle}>
            <Button
                type="button"
                onClick={onClose}
                className="absolute top-[10px] right-[10px] cursor-pointer"
            >
                <CloseIcon className="w-[30px] stroke-3 stroke-white" />
            </Button>

            <div className="flex flex-col gap-[15px]">
                <div className="max-w-[400px]">
                    The action cannot be undone, all data will be cleared in
                    relation to the selection.
                </div>

                <div className="flex gap-[10px] flex-wrap">
                    <Button
                        type="button"
                        onClick={onClose}
                        className="flex items-center justify-center bg-neutral-800 border border-white/5 cursor-pointer"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUnpinAllMessages}
                        className="flex-1 border-2 border-red-900 text-red-500 hover:border-transparent hover:text-white hover:bg-red-700 transition-all duration-200"
                    >
                        Unpin All
                    </Button>
                </div>
            </div>
        </ModalWrapper>
    );

    return createPortal(modalContent, document.body);
}
