"use client";

import { ChatEnum } from "@/shared/enums/enums";
import { MuteIcon, PhoneIcon, PinIcon, SearchIcon } from "@/shared/icons";
import { IChat } from "@/shared/interfaces/IChat";
import { useProfile } from "@/features/auth/hooks/useAuth";
import { useEffect } from "react";
import { useToggleMuteChat } from "../../../chats-members/hooks/useChatMembers";
import { Button } from "@/shared/components/ui/button";
import { useToggleBlockUser } from "@/features/user-blocks/hooks/useBlockUser";
import { useChatSidebarStore, useModalStore, useSelectionStore } from "@/store";
import { usePrivateChat } from "@/shared/hooks/usePrivateChat";
import { ChatHeaderDropdownMenu } from "./components/ChatHeaderDropdownMenu";

export function ChatHeader({
    chat,
    isChatLoading,
}: {
    chat: IChat;
    isChatLoading: boolean;
}) {
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

    const { isPrivate, meMember, otherMember, chatName } = usePrivateChat(chat);

    const toggleBlockUserMutation = useToggleBlockUser();

    useEffect(() => {
        if (isPrivate && chatSidebarTab === "editChat") {
            setChatSidebarTab("info");
        }
    }, [isPrivate, chatSidebarTab, setChatSidebarTab]);

    const handleAddContact = async () => {
        if (otherMember?.user) {
            setSelectedUser(otherMember?.user);
            setActiveModal("addContact");
        }
    };

    const handleBlockUser = async () => {
        if (!otherMember?.user) return;
        toggleBlockUserMutation.mutateAsync({
            chatId: chat.id,
            blockUserPayload: {
                userIdBlock: otherMember?.user.id,
            },
        });
    };

    const handleEditContact = async () => {
        if (chat.privateChat?.contact) {
            setChatSidebarTab("editContact");
            setChatSidebarOpened(true);
        }
    };

    const contactActionLabel = chat.privateChat?.contact
        ? "Edit contact"
        : "Add contact";
    const contactActionHandler = chat.privateChat?.contact
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
    };

    const destructiveAction = DESTRUCTIVE_ACTIONS[chat.type];

    return (
        <div className="absolute top-0 w-full h-[65px] z-10 flex justify-between items-center text-white bg-neutral-950 px-[20px] py-[10px] pr-[50px] cursor-pointer">
            {isChatLoading ? (
                <div
                    className="flex gap-[20px] w-full"
                    onClick={() => {
                        setChatSidebarOpened(!chatSidebarOpened);
                    }}
                >
                    <div className="w-[45px] h-[45px] rounded-full bg-neutral-600"></div>
                    <div>
                        <div className="flex gap-[5px] items-center">
                            <div className="font-semibold bg-neutral-600 h-[20px] w-[60px]"></div>
                        </div>
                        <div className="text-sm text-neutral-600 h-[15px] w-[60px]"></div>
                    </div>
                </div>
            ) : (
                <div className="w-full flex justify-between items-center gap-[20px]">
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
                                {isPrivate &&
                                chat.blockingInfo?.isBlockedByOther
                                    ? "for a long time"
                                    : isPrivate && chat.blockingInfo?.isBlocked
                                    ? "blocked user"
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
                    {chat.pinnedMessages.length > 0 && (
                        <div className="flex justify-between px-[15px] py-[4px] bg-white/5 w-full max-w-[250px] rounded-xl border-l-4 ">
                            <div>
                                <div className="font-bold text-sm">
                                    {`Last pinned message`}
                                </div>
                                <div className="text-sm text-white">
                                    {chat.pinnedMessages[0]?.message?.content.slice(
                                        0,
                                        20
                                    ) +
                                        (chat.pinnedMessages[0]?.message
                                            ?.content.length! > 20
                                            ? "..."
                                            : "")}
                                </div>
                            </div>
                            <button>
                                <PinIcon className="w-[22px] stroke-neutral-300 stroke-[1] fill-neutral-300" />
                            </button>
                        </div>
                    )}

                    <div className="flex gap-[25px]">
                        {isPrivate ? (
                            <button>
                                <PhoneIcon className="w-[24px] stroke-neutral-300 stroke-[2.5]" />
                            </button>
                        ) : null}
                        <button>
                            <SearchIcon className="w-[24px] stroke-neutral-300 stroke-[2.5]" />
                        </button>
                        <ChatHeaderDropdownMenu
                            isPrivate={isPrivate}
                            meId={me?.id}
                            meMemberIsMuted={meMember?.isMuted ?? false}
                            chat={chat}
                            contactActionLabel={contactActionLabel}
                            contactActionHandler={contactActionHandler}
                            handleBlockUser={handleBlockUser}
                            toggleMuteChat={() =>
                                toggleMuteChatMutation.mutateAsync({
                                    chatId: chat.id,
                                    updateChatMemberPayload: {
                                        isMuted: !meMember?.isMuted,
                                        muteUntil: null,
                                    },
                                })
                            }
                            destructiveAction={destructiveAction}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
