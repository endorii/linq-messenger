"use client";

import { Button } from "@/shared/components/ui/button";
import useEscapeKeyClose from "@/shared/hooks/useEscapeKeyClose";
import ModalWrapper from "@/shared/components/wrappers/ModalWrapper";
import { createPortal } from "react-dom";
import { CloseIcon } from "@/shared/icons";
import { useSidebarStore } from "@/store/sidebarStore";
import { ChatEnum } from "@/shared/enums/enums";
import { useProfile } from "@/features/auth/hooks/useAuth";
import { useDeleteChat, useLeaveChat } from "@/features/chats/hooks/useChats";

interface DeleteChatProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function DeleteChat({ isOpen, onClose }: DeleteChatProps) {
    const { selectedChat } = useSidebarStore();
    const { data: me } = useProfile();

    const leaveChatMutation = useLeaveChat();
    const deleteChatMutation = useDeleteChat();

    useEscapeKeyClose({ isOpen, onClose });
    if (!isOpen || !selectedChat || !me) return null;

    const otherUser =
        selectedChat.type === ChatEnum.PRIVATE
            ? selectedChat.members.find((m) => m.user.id !== me.id)
            : undefined;

    const handleDeleteChat = () => {
        if (!selectedChat) return;
        deleteChatMutation.mutateAsync(selectedChat.id);
        onClose();
    };

    const handleLeaveChat = () => {
        if (!selectedChat) return;
        leaveChatMutation.mutateAsync(selectedChat.id);
        onClose();
    };

    const modalTitle =
        selectedChat.type === ChatEnum.PRIVATE
            ? `Delete chat with ${otherUser?.user.username ?? "User"}`
            : selectedChat.type === ChatEnum.GROUP
            ? "Leave or Delete Group"
            : "Leave or Delete Channel";

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
                {selectedChat.type === ChatEnum.PRIVATE && (
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

                {(selectedChat.type === ChatEnum.GROUP ||
                    selectedChat.type === ChatEnum.CHANNEL) && (
                    <div className="flex flex-col w-full gap-[10px]">
                        <Button
                            onClick={handleLeaveChat}
                            className="flex-1 border-2 border-red-900 text-red-500 hover:border-transparent hover:text-white hover:bg-red-700 transition-all duration-200"
                        >
                            Leave
                            {selectedChat.type === ChatEnum.GROUP
                                ? "Group"
                                : "Channel"}
                        </Button>

                        {selectedChat?.adminId === me.id &&
                            (selectedChat.type === ChatEnum.GROUP ||
                                selectedChat.type === ChatEnum.CHANNEL) && (
                                <Button
                                    onClick={handleDeleteChat}
                                    className="flex-1 border-2 border-red-900 text-red-500 hover:border-transparent hover:text-white hover:bg-red-700 transition-all duration-200"
                                >
                                    Delete{" "}
                                    {selectedChat.type === ChatEnum.GROUP
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
