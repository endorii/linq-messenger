"use client";

import { ModalChatItem } from "@/features/chats/components/ModalChatItem";
import { useChatsForForwardMessage } from "@/features/chats/hooks/useChats";
import { useForwardMessage } from "@/features/messages/hooks/useMessages";
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

export function ForwardMessage({ isOpen, onClose }: CreateProps) {
    const { data: chats } = useChatsForForwardMessage();
    const { selectedMessage, setSelectedMessage } = useSelectionStore();

    const [selectedChats, setSelectedChats] = useState<string[]>([]);

    const forwardMessageMutation = useForwardMessage();

    useEscapeKeyClose({ isOpen, onClose });

    const handleClose = () => {
        onClose();
        setSelectedChats([]);
        setSelectedMessage(null);
    };

    const onSubmit = async () => {
        if (!selectedMessage || selectedChats.length === 0) return;

        forwardMessageMutation.mutateAsync({
            chatIds: selectedChats,
            messageId: selectedMessage.id,
        });

        handleClose();
    };

    if (!isOpen || !selectedMessage) return null;

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
                        className="flex items-center justify-center bg-neutral-200 dark:bg-neutral-800 border border-white/5 cursor-pointer"
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
