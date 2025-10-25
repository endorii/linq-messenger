"use client";

import { useToggleMuteChat } from "@/features/chats-members/hooks/useChatMembers";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { ModalWrapper } from "@/shared/components/wrappers/ModalWrapper";
import { usePrivateChat, useEscapeKeyClose } from "@/shared/hooks";
import { IChat } from "@/shared/interfaces";
import { useSelectionStore } from "@/store";
import dayjs from "dayjs";
import { useState } from "react";
import { createPortal } from "react-dom";

interface CreateNewChannelProps {
    isOpen: boolean;
    onClose: () => void;
    chat: IChat;
}

const muteOptions = [
    { value: 1, label: "Mute for 1 hour" },
    { value: 3, label: "Mute for 3 hours" },
    { value: 6, label: "Mute for 6 hours" },
    { value: 12, label: "Mute for 12 hours" },
    { value: 24, label: "Mute for 1 day" },
    { value: 72, label: "Mute for 3 days" },
    { value: 168, label: "Mute for 1 week" },
    { value: 0, label: "Mute Forever" },
];

export function MuteChat({ isOpen, onClose }: CreateNewChannelProps) {
    const [selectedOption, setSelectedOption] = useState<number>(0);
    const handleClose = () => onClose();

    const { selectedChat } = useSelectionStore();

    if (!selectedChat) return null;

    const { otherMember, isPrivate, contact } = usePrivateChat(selectedChat);

    const toggleMuteMutation = useToggleMuteChat();

    const onSubmit = async () => {
        const muteUntil =
            selectedOption > 0
                ? dayjs().add(selectedOption, "hour").toDate()
                : null;

        await toggleMuteMutation.mutateAsync({
            chatId: selectedChat.id,
            updateChatMemberPayload: {
                isMuted: true,
                muteUntil,
            },
        });

        handleClose();
    };

    useEscapeKeyClose({ isOpen, onClose });

    if (!isOpen) return null;

    const modalContent = (
        <ModalWrapper
            onClose={onClose}
            modalTitle={`Mute Chat "${
                selectedChat.name ||
                (isPrivate && contact?.nickname) ||
                otherMember?.user?.username
            }"`}
        >
            <div className="flex flex-col gap-[15px]">
                <RadioGroup
                    value={selectedOption.toString()}
                    onValueChange={(val) => setSelectedOption(Number(val))}
                    className="flex flex-col gap-2 w-full"
                >
                    {muteOptions.map(({ value, label }) => (
                        <Label
                            key={value}
                            htmlFor={value.toString()}
                            className="flex items-center gap-[20px] p-[15px] hover:bg-neutral-900/5 dark:hover:bg-white/5 cursor-pointer rounded-xl"
                        >
                            <RadioGroupItem
                                value={value.toString()}
                                id={value.toString()}
                            />
                            <span className="font-semibold text-base">
                                {label}
                            </span>
                        </Label>
                    ))}
                </RadioGroup>

                <div className="flex justify-end gap-[5px]">
                    <Button
                        type="button"
                        onClick={handleClose}
                        className="cursor-pointer"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onSubmit}
                        className="cursor-pointer bg-theme-gradient border-none transition-all duration-200"
                    >
                        Mute
                    </Button>
                </div>
            </div>
        </ModalWrapper>
    );

    return createPortal(modalContent, document.body);
}
