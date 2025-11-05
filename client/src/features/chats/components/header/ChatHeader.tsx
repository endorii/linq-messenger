"use client";

import { useProfile } from "@/features/auth/hooks/useAuth";
import { useToggleBlockUser } from "@/features/user-blocks/hooks/useBlockUser";
import { Button } from "@/shared/components/ui/button";
import { ButtonIcon } from "@/shared/components/ui/buttons";
import { ChatEnum } from "@/shared/enums/enums";
import { usePrivateChat } from "@/shared/hooks/usePrivateChat";
import { MuteIcon, PhoneIcon, PinIcon, SearchIcon } from "@/shared/icons";
import { IChat } from "@/shared/interfaces/IChat";
import {
    useChatSidebarStore,
    useModalStore,
    useNavigationStore,
    useSelectionStore,
} from "@/store";
import { useEffect } from "react";
import { useToggleMuteChat } from "../../../chats-members/hooks/useChatMembers";
import { ChatHeaderDropdownMenu } from "./components/ChatHeaderDropdownMenu";

export function ChatHeader({
    chat,
    isChatPending,
}: {
    chat: IChat;
    isChatPending: boolean;
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

    const { setChatView } = useNavigationStore();

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

    const handleSetChatView = (view: "pinned" | "messages") => {
        setChatView(view);
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
        <div className="absolute top-0 w-full h-[65px] z-10 flex justify-between items-center text-black bg-neutral-100 dark:text-white dark:dark:bg-neutral-950 px-[20px] py-[10px] pr-[50px] border-b border-neutral-200 dark:border-neutral-800">
            {isChatPending ? (
                <div className="flex gap-[20px] w-full">
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
                        className="flex gap-[20px] w-full items-center cursor-pointer"
                        onClick={() => {
                            setChatSidebarOpened(!chatSidebarOpened);
                        }}
                    >
                        <img
                            src={
                                isPrivate
                                    ? otherMember?.user?.avatarUrl
                                    : chat.avatar
                            }
                            alt="avatar"
                            className="rounded-full h-[45px] w-[45px] bg-neutral-600 object-cover"
                        />

                        <div>
                            <div className="flex gap-[5px] items-center">
                                <div className="font-semibold">{chatName}</div>
                                {meMember?.isMuted && (
                                    <MuteIcon className="w-[15px] fill-neutral-800 stroke-neutral-800 dark:fill-white dark:stroke-white flex-shrink-0 mb-[1px]" />
                                )}
                            </div>
                            <div className="text-sm text-neutral-500 dark:text-neutral-400">
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
                            className="mx-[20px] bg-theme-gradient"
                            onClick={handleBlockUser}
                        >
                            Unblock User
                        </Button>
                    )}
                    {chat.pinnedMessages.length > 0 && (
                        <div className="flex justify-between items-center px-[15px] py-[4px] bg-white/5 w-full max-w-[250px] rounded-xl border-l-4 ">
                            <div>
                                <div className="font-bold text-sm text-blue-500 dark:text-violet-400">
                                    {`Last pinned message`}
                                </div>
                                <div className="text-sm text-black dark:text-white">
                                    {(() => {
                                        const lastPinned =
                                            chat.pinnedMessages.at(-1)?.message
                                                ?.content;
                                        if (!lastPinned) return null;
                                        return (
                                            lastPinned.slice(0, 20) +
                                            (lastPinned.length > 20
                                                ? "..."
                                                : "")
                                        );
                                    })()}
                                </div>
                            </div>
                            <div className="relative flex group">
                                <ButtonIcon
                                    onClick={() => handleSetChatView("pinned")}
                                >
                                    <PinIcon className="w-[22px] stroke-neutral-800 fill-neutral-800 dark:stroke-neutral-300 stroke dark:fill-neutral-300" />
                                </ButtonIcon>
                                {chat.pinnedMessages.length > 1 && (
                                    <div className="text-white absolute top-[0px] right-[-2px] bg-theme-gradient rounded-full text-center text-xs w-[18px] h-[18px] pt-px">
                                        {chat.pinnedMessages.length}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-[5px]">
                        {isPrivate ? (
                            <ButtonIcon>
                                <PhoneIcon className="w-[24px] stroke-neutral-800 dark:stroke-neutral-300 stroke-[2.5] fill-none" />
                            </ButtonIcon>
                        ) : null}
                        <ButtonIcon>
                            <SearchIcon className="w-[24px] stroke-neutral-800 dark:stroke-neutral-300 stroke-[2.5] fill-none" />
                        </ButtonIcon>
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
