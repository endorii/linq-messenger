"use client";

import { useChatEntity } from "@/shared/hooks/useChatEntity";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { ChatEnum } from "@/shared/enums/enums";
import { MuteIcon, OptionsIcon, PhoneIcon, SearchIcon } from "@/shared/icons";
import { IChat } from "@/shared/interfaces/IChat";
import { useProfile } from "@/features/auth/hooks/useAuth";
import { useEffect } from "react";
import { useToggleMuteChat } from "../hooks/useChatMembers";
import { Button } from "@/shared/components/ui/button";
import { useToggleBlockUser } from "@/features/user-blocks/hooks/useBlockUser";
import { useChatSidebarStore, useModalStore, useSelectionStore } from "@/store";

function ChatHeader({ chat }: { chat: IChat }) {
    const {
        entity,
        chatName,
        isContact,
        contactId,
        otherUserId,
        meMember,
        otherMember,
    } = useChatEntity(chat);

    console.log(otherMember?.userId);

    const { data: me } = useProfile();
    const toggleMuteChatMutation = useToggleMuteChat();

    const { setActiveModal } = useModalStore();
    const { setSelectedUser } = useSelectionStore();
    const {
        chatSidebarOpened,
        chatSidebarTab,
        setChatSidebarOpened,
        setChatSidebarTab,
    } = useChatSidebarStore();

    const isPrivate = chat.type === ChatEnum.PRIVATE;

    useEffect(() => {
        if (isPrivate && chatSidebarTab === "editChat") {
            setChatSidebarTab("info");
        }
    }, [isPrivate, chatSidebarTab, setChatSidebarTab]);

    const handleAddContact = async () => {
        if (otherUserId && "username" in entity) {
            setSelectedUser(entity);
            setActiveModal("addContact");
        }
    };

    const toggleBlockUserMutation = useToggleBlockUser();

    const handleBlockUser = async () => {
        if (!otherMember) return;
        toggleBlockUserMutation.mutateAsync({
            chatId: chat.id,
            blockUserPayload: {
                userIdBlock: otherMember?.userId,
            },
        });
    };

    const handleEditContact = async () => {
        if (contactId) {
            setChatSidebarTab("editContact");
            setChatSidebarOpened(true);
        }
    };

    const contactActionLabel = isContact ? "Edit contact" : "Add contact";
    const contactActionHandler = isContact
        ? handleEditContact
        : handleAddContact;

    const DESTRUCTIVE_ACTIONS = {
        [ChatEnum.PRIVATE]: {
            label: "Delete chat",
            onClick: () => {
                setActiveModal("deleteChat");
            },
        },
        [ChatEnum.GROUP]: {
            label: "Leave group",
            onClick: () => {
                setActiveModal("deleteChat");
            },
        },
        [ChatEnum.CHANNEL]: {
            label: "Leave channel",
            onClick: () => {
                setActiveModal("deleteChat");
            },
        },
    } as const;

    const destructiveAction = DESTRUCTIVE_ACTIONS[chat.type];

    return (
        <div className="absolute top-0 w-full h-[65px] z-10 flex justify-between items-center text-white bg-neutral-950 px-[20px] py-[10px] pr-[50px] cursor-pointer">
            <div
                className="flex gap-[20px] w-full"
                onClick={() => {
                    setChatSidebarOpened(!chatSidebarOpened);
                }}
            >
                <div className="w-[45px] h-[45px] rounded-full bg-neutral-600">
                    <img
                        src={
                            isPrivate
                                ? otherMember?.user?.avatarUrl
                                : chat.avatar
                        }
                        alt="avatar"
                        className="rounded-full"
                    />
                </div>
                <div>
                    <div className="flex gap-[5px] items-center">
                        <div className="font-semibold">{chatName}</div>
                        {meMember?.isMuted && (
                            <MuteIcon className="w-[15px] fill-neutral-500 stroke-2 stroke-neutral-500 flex-shrink-0 mb-[2px]" />
                        )}
                    </div>
                    <div className="text-sm text-neutral-400">
                        {isPrivate && chat.blockingInfo?.isBlockedByOther
                            ? "for a long time"
                            : isPrivate
                            ? "last seen recently"
                            : `${chat.members?.length || 0} members`}
                    </div>
                </div>
            </div>
            {chat.blockingInfo?.isBlocked && (
                <Button
                    className="mx-[20px] bg-purple-gradient"
                    onClick={handleBlockUser}
                >
                    Unblock User
                </Button>
            )}
            <div className="flex gap-[25px]">
                {chat.type === ChatEnum.PRIVATE ? (
                    <button>
                        <PhoneIcon className="w-[24px] stroke-neutral-300 stroke-[2.5]" />
                    </button>
                ) : null}
                <button>
                    <SearchIcon className="w-[24px] stroke-neutral-300 stroke-[2.5]" />
                </button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="cursor-pointer">
                            <OptionsIcon className="w-[21px] fill-neutral-300" />
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-56">
                        {isPrivate && (
                            <DropdownMenuItem onClick={contactActionHandler}>
                                {contactActionLabel}
                            </DropdownMenuItem>
                        )}

                        {!isPrivate &&
                            "adminId" in entity &&
                            entity.adminId === me?.id && (
                                <DropdownMenuItem
                                    onClick={() => {
                                        setChatSidebarOpened(true);
                                        setChatSidebarTab("editChat");
                                    }}
                                >
                                    Edit
                                </DropdownMenuItem>
                            )}

                        {chat.type === ChatEnum.PRIVATE && (
                            <>
                                <DropdownMenuItem>Video Call</DropdownMenuItem>
                                <DropdownMenuItem onClick={handleBlockUser}>
                                    {chat.blockingInfo?.isBlocked
                                        ? "Unblock user"
                                        : "Block user"}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                            </>
                        )}
                        {meMember?.isMuted ? (
                            <DropdownMenuItem
                                onClick={() => {
                                    toggleMuteChatMutation.mutateAsync({
                                        chatId: chat.id,
                                        updateChatMemberPayload: {
                                            isMuted: false,
                                            muteUntil: null,
                                        },
                                    });
                                }}
                            >
                                Unmute
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem
                                onClick={() => {
                                    setActiveModal("muteChat");
                                }}
                            >
                                Mute
                            </DropdownMenuItem>
                        )}

                        <DropdownMenuItem>Select messages</DropdownMenuItem>

                        {destructiveAction && (
                            <DropdownMenuItem
                                variant="destructive"
                                onClick={destructiveAction.onClick}
                            >
                                {destructiveAction.label}
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}

export default ChatHeader;
