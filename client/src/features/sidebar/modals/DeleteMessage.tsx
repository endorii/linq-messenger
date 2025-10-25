"use client";

import { useProfile } from "@/features/auth/hooks/useAuth";
import {
    useDeleteMessageForMe,
    useDeleteMessage,
} from "@/features/messages/hooks/useMessages";
import { Button } from "@/shared/components/ui/button";
import { ModalWrapper } from "@/shared/components/wrappers/ModalWrapper";
import { useEscapeKeyClose } from "@/shared/hooks";
import { CloseIcon } from "@/shared/icons";
import { useSelectionStore } from "@/store";
import { createPortal } from "react-dom";

interface DeleteMessageProps {
    isOpen: boolean;
    onClose: () => void;
    chatId: string;
}

export function DeleteMessage({ isOpen, onClose, chatId }: DeleteMessageProps) {
    const { selectedMessage } = useSelectionStore();
    const { data: me } = useProfile();

    const deleteMessageForMeMutation = useDeleteMessageForMe();
    const deleteMessageMutation = useDeleteMessage();

    useEscapeKeyClose({ isOpen, onClose });
    if (!isOpen || !selectedMessage || !me) return null;

    const handleDeleteMessageForMe = () => {
        if (!selectedMessage) return;
        deleteMessageForMeMutation.mutate({
            chatId,
            messageId: selectedMessage.id,
        });
        onClose();
    };

    const handleDeleteMessage = () => {
        if (!selectedMessage) return;
        deleteMessageMutation.mutate({ chatId, messageId: selectedMessage.id });
        onClose();
    };

    const modalTitle = "Delete message";

    const modalContent = (
        <ModalWrapper onClose={onClose} modalTitle={modalTitle}>
            <Button
                type="button"
                onClick={onClose}
                className="absolute top-[10px] right-[10px] cursor-pointer"
            >
                <CloseIcon className="w-[30px] stroke-3 stroke-neutral-900 dark:stroke-white" />
            </Button>

            <div className="flex flex-col gap-[15px]">
                <div className="max-w-[400px]">
                    The action cannot be undone, all data will be cleared in
                    relation to the selection.
                </div>
                <div className="flex gap-[10px] flex-wrap">
                    <Button
                        onClick={handleDeleteMessageForMe}
                        className="flex-1 border-2 border-red-900 text-red-500 hover:border-transparent hover:text-white hover:bg-red-700 transition-all duration-200"
                    >
                        Delete only for me
                    </Button>
                    <Button
                        onClick={handleDeleteMessage}
                        className="flex-1 border-2 border-red-900 text-red-500 hover:border-transparent hover:text-white hover:bg-red-700 transition-all duration-200"
                    >
                        Delete for all
                    </Button>
                </div>
            </div>
        </ModalWrapper>
    );

    return createPortal(modalContent, document.body);
}
