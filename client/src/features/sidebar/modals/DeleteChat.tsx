"use client";

import { Button } from "@/shared/components/ui/button";
import useEscapeKeyClose from "@/shared/hooks/useEscapeKeyClose";
import ModalWrapper from "@/shared/components/wrappers/ModalWrapper";
import { createPortal } from "react-dom";
import { IChat, IChatMember } from "@/shared/interfaces/IChat";
import { CloseIcon } from "@/shared/icons";
import { useDeleteChat } from "@/features/chats/hooks/useChats";

interface CreateNewChannelProps {
    isOpen: boolean;
    onClose: () => void;
    user: IChatMember | null;
    chat: IChat | null;
}

export default function DeleteChat({
    isOpen,
    onClose,
    user,
    chat,
}: CreateNewChannelProps) {
    const useDeleteChatMutation = useDeleteChat();

    useEscapeKeyClose({ isOpen, onClose });

    if (!isOpen) return null;

    const modalContent = (
        <ModalWrapper
            onClose={onClose}
            modalTitle={`Delete chat with ${user?.user.username}`}
        >
            <div className="flex flex-col gap-[15px]">
                <Button
                    type="button"
                    onClick={() => {
                        onClose();
                    }}
                    className="absolute top-[10px] right-[10px] cursor-pointer"
                >
                    <CloseIcon className="w-[30px] stroke-3 stroke-white" />
                </Button>
                <div>Choose how you want to delete this chat.</div>
                <div className="flex flex-col w-full gap-[10px]">
                    <div className="flex gap-[10px]">
                        <Button
                            onClick={() => {
                                onClose();
                                //Логіка видалення тільки для мене
                            }}
                            className="flex-1 cursor-pointer border-2 border-red-900 transition-all duration-200 text-red-500 hover:border-transparent hover:text-white hover:bg-red-700"
                        >
                            Delete only for me
                        </Button>
                        <Button
                            onClick={() => {
                                if (!chat) return;
                                useDeleteChatMutation.mutateAsync(chat.id);
                                onClose();
                            }}
                            className="flex-1 cursor-pointer border-2 border-red-900 transition-all duration-200 text-red-500 hover:border-transparent hover:text-white hover:bg-red-700"
                        >
                            Delete for all
                        </Button>
                    </div>
                </div>
            </div>
        </ModalWrapper>
    );

    return createPortal(modalContent, document.body);
}
