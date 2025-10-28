"use client";

import { useProfile } from "@/features/auth/hooks/useAuth";
import {
    useDeleteMessagesForMe,
    useDeleteMessages,
} from "@/features/messages/hooks/useMessages";
import { Button } from "@/shared/components/ui/button";
import { ButtonActive } from "@/shared/components/ui/buttons";
import { ModalWrapper } from "@/shared/components/wrappers/ModalWrapper";
import { useEscapeKeyClose } from "@/shared/hooks";
import { CloseIcon } from "@/shared/icons";
import { useSelectionStore } from "@/store";
import { createPortal } from "react-dom";

interface DeleteMessagesProps {
    isOpen: boolean;
    onClose: () => void;
    chatId: string;
}

export function DeleteMessages({
    isOpen,
    onClose,
    chatId,
}: DeleteMessagesProps) {
    const { selectedMessages } = useSelectionStore();
    const { data: me } = useProfile();

    const deleteMessagesForMeMutation = useDeleteMessagesForMe();
    const deleteMessagesMutation = useDeleteMessages();

    useEscapeKeyClose({ isOpen, onClose });
    if (!isOpen || !selectedMessages || !me) return null;

    const handleDeleteMessageForMe = () => {
        if (!selectedMessages) return;
        deleteMessagesForMeMutation.mutate({
            chatId,
            messageIds: selectedMessages,
        });
        onClose();
    };

    const handleDeleteMessage = () => {
        if (!selectedMessages) return;
        deleteMessagesMutation.mutate({ chatId, messageIds: selectedMessages });
        onClose();
    };

    const modalTitle = `Delete ${selectedMessages.length} messages`;

    const modalContent = (
        <ModalWrapper onClose={onClose} modalTitle={modalTitle}>
            <button
                onClick={onClose}
                className="absolute top-[10px] right-[10px] cursor-pointer"
            >
                <CloseIcon className="w-[20px] stroke-2 stroke-neutral-900 dark:stroke-white" />
            </button>

            <div className="flex flex-col gap-[15px]">
                <div className="max-w-[400px]">
                    The action cannot be undone, all data will be cleared in
                    relation to the selection.
                </div>
                <div className="flex gap-[10px] flex-wrap">
                    <Button
                        onClick={handleDeleteMessageForMe}
                        className="flex-1 text-white bg-red-700 hover:bg-red-800 transition-all duration-200"
                    >
                        Delete only for me
                    </Button>
                    <Button
                        onClick={handleDeleteMessage}
                        className="flex-1 text-white bg-red-700 hover:bg-red-800 transition-all duration-200"
                    >
                        Delete for all
                    </Button>
                </div>
            </div>
        </ModalWrapper>
    );

    return createPortal(modalContent, document.body);
}
