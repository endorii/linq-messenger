"use client";

import { useProfile } from "@/features/auth/hooks/useAuth";
import { useLeaveChat, useDeleteChat } from "@/features/chats/hooks/useChats";
import { Button } from "@/shared/components/ui/button";
import { ModalWrapper } from "@/shared/components/wrappers/ModalWrapper";
import { ChatEnum } from "@/shared/enums/enums";
import { usePrivateChat, useEscapeKeyClose } from "@/shared/hooks";
import { CloseIcon } from "@/shared/icons";
import { IChat } from "@/shared/interfaces";
import { createPortal } from "react-dom";

interface DeleteChatProps {
    isOpen: boolean;
    onClose: () => void;
    chat: IChat;
}

export function DeleteChat({ isOpen, onClose, chat }: DeleteChatProps) {
    const { otherMember } = usePrivateChat(chat);
    const { data: me } = useProfile();

    const leaveChatMutation = useLeaveChat();
    const deleteChatMutation = useDeleteChat();

    useEscapeKeyClose({ isOpen, onClose });
    if (!isOpen || !chat || !me) return null;

    const handleDeleteChat = () => {
        deleteChatMutation.mutateAsync(chat.id);
        onClose();
    };

    const handleLeaveChat = () => {
        leaveChatMutation.mutateAsync(chat.id);
        onClose();
    };

    const modalTitle =
        chat.type === ChatEnum.PRIVATE
            ? `Delete chat with ${otherMember?.user?.username ?? "User"}`
            : chat.type === ChatEnum.GROUP
            ? "Leave or Delete Group"
            : "Leave or Delete Channel";

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
                {chat.type === ChatEnum.PRIVATE && (
                    <div className="flex gap-[10px] flex-wrap">
                        <Button
                            onClick={handleLeaveChat}
                            className="flex-1 border-2 border-red-900 text-red-500 hover:border-transparent hover:text-white hover:bg-red-700 transition-all duration-200"
                        >
                            Leave chat
                        </Button>
                        <Button
                            onClick={handleDeleteChat}
                            className="flex-1 border-2 border-red-900 text-red-500 hover:border-transparent hover:text-white hover:bg-red-700 transition-all duration-200"
                        >
                            Delete for all
                        </Button>
                    </div>
                )}

                {(chat.type === ChatEnum.GROUP ||
                    chat.type === ChatEnum.CHANNEL) && (
                    <div className="flex flex-col w-full gap-[10px]">
                        <Button
                            onClick={handleLeaveChat}
                            className="flex-1 border-2 border-red-900 text-red-500 hover:border-transparent hover:text-white hover:bg-red-700 transition-all duration-200"
                        >
                            Leave
                            {chat.type === ChatEnum.GROUP ? "Group" : "Channel"}
                        </Button>

                        {chat?.adminId === me.id &&
                            (chat.type === ChatEnum.GROUP ||
                                chat.type === ChatEnum.CHANNEL) && (
                                <Button
                                    onClick={handleDeleteChat}
                                    className="flex-1 border-2 border-red-900 text-red-500 hover:border-transparent hover:text-white hover:bg-red-700 transition-all duration-200"
                                >
                                    Delete{" "}
                                    {chat.type === ChatEnum.GROUP
                                        ? "Group"
                                        : "Channel"}
                                </Button>
                            )}
                    </div>
                )}
            </div>
        </ModalWrapper>
    );

    return createPortal(modalContent, document.body);
}
