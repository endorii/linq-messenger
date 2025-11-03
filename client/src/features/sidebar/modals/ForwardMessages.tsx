"use client";

import { ModalChatItem } from "@/features/chats/components/ModalChatItem";
import { useChatsForForwardMessage } from "@/features/chats/hooks/useChats";
import { useForwardMessages } from "@/features/messages/hooks/useMessages";
import { Button } from "@/shared/components/ui/button";
import { ModalWrapper } from "@/shared/components/wrappers/ModalWrapper";
import { useEscapeKeyClose } from "@/shared/hooks";
import { useSelectionStore } from "@/store";
import { useState } from "react";
import { createPortal } from "react-dom";

interface CreateProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ForwardMessages({ isOpen, onClose }: CreateProps) {
    const { data: chats } = useChatsForForwardMessage();
    const { selectedMessages, clearSelectedMessages } = useSelectionStore();

    const [selectedChats, setSelectedChats] = useState<string[]>([]);

    const forwardMessagesMutation = useForwardMessages();

    useEscapeKeyClose({ isOpen, onClose });

    const handleClose = () => {
        onClose();
        setSelectedChats([]);
        clearSelectedMessages();
    };

    const onSubmit = async () => {
        if (!selectedMessages || selectedChats.length === 0) return;

        forwardMessagesMutation.mutateAsync({
            chatIds: selectedChats,
            messageIds: selectedMessages,
        });

        handleClose();
    };

    if (!isOpen || !selectedMessages) return null;

    const toggleChatSelection = (chatId: string) => {
        setSelectedChats((prev) =>
            prev.includes(chatId)
                ? prev.filter((id) => id !== chatId)
                : [...prev, chatId]
        );
    };

    const modalContent = (
        <ModalWrapper onClose={handleClose} modalTitle="Forward Message">
            <div className="flex flex-col gap-[15px]">
                <div className="flex flex-col gap-[5px]">
                    {!chats || chats.length === 0 ? (
                        <div className="text-neutral-500 dark:text-neutral-400">
                            No chats found
                        </div>
                    ) : (
                        chats.map((chat) => (
                            <ModalChatItem
                                key={chat.id}
                                chat={chat}
                                isSelected={selectedChats.includes(chat.id)}
                                onSelect={() => toggleChatSelection(chat.id)}
                            />
                        ))
                    )}
                </div>

                <div className="flex justify-end gap-[5px]">
                    <Button
                        type="button"
                        onClick={handleClose}
                        className="text-black dark:text-white hover:bg-neutral-900/5 dark:hover:bg-white/5"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onSubmit}
                        className="cursor-pointer bg-theme-gradient border-none transition-all duration-200"
                    >
                        Forward
                    </Button>
                </div>
            </div>
        </ModalWrapper>
    );

    return createPortal(modalContent, document.body);
}
