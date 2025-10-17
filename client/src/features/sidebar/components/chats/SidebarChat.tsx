"use client";

import { useProfile } from "@/features/auth/hooks/useAuth";
import {
    useToggleMarkChat,
    useToggleMuteChat,
} from "@/features/chats-members/hooks/useChatMembers";
import { useContacts } from "@/features/contacts/hooks/useContacts";
import {
    useAddChatToFolder,
    useRemoveChatFromFolder,
} from "@/features/folders/hooks/useFolders";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
} from "@/shared/components/ui/context-menu";
import { ChatEnum } from "@/shared/enums/enums";
import { MuteIcon } from "@/shared/icons";
import { IChat, IFolder } from "@/shared/interfaces";
import { SafeLink } from "@/shared/ui/links/SafeLink";
import { formatSidebarLastMessageDateInChat } from "@/shared/utils/formatSidebarLastMessageDateInChat";
import { useModalStore, useSelectionStore } from "@/store";

import dayjs from "dayjs";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";

interface SidebarChatProps {
    chat: IChat;
    folders?: IFolder[];
    folderId?: string;
}

export function SidebarChat({ chat, folders, folderId }: SidebarChatProps) {
    if (!chat) return null;
    const params = useParams();
    const chatId = params?.chatSlug;

    const { setActiveModal } = useModalStore();
    const { setSelectedChat } = useSelectionStore();

    const { data: me } = useProfile();
    const { data: contacts } = useContacts();

    const addChatToFolderMutation = useAddChatToFolder();
    const removeChatFromFolderMutation = useRemoveChatFromFolder();
    const toggleMarkChatMutation = useToggleMarkChat();
    const toggleMuteMutation = useToggleMuteChat();

    const isPrivate = chat.type === ChatEnum.PRIVATE;
    const meMember = chat.members.find((m) => m.userId === me?.id);
    const otherMember = isPrivate
        ? chat.members.find((m) => m.userId !== me?.id)
        : null;

    const chatName = useMemo(() => {
        if (!isPrivate) return chat.name || "Unnamed Chat";
        if (!otherMember) return "Private Chat";

        if (contacts && contacts.length > 0) {
            const contact = contacts.find(
                (c) => c.contactId === otherMember.userId
            );

            if (contact) return contact.nickname || "Private Chat";
        }

        return (
            otherMember.user?.firstName ||
            otherMember.user?.username ||
            "Private Chat"
        );
    }, [isPrivate, otherMember, contacts, chat.name]);

    const handleDeleteModal = () => setActiveModal("deleteChat");
    const handleContextMenu = () => setSelectedChat(chat);

    if (meMember?.muteUntil && dayjs(meMember?.muteUntil).isBefore(dayjs())) {
        meMember.isMuted = false;
        meMember.muteUntil = null;

        toggleMuteMutation.mutateAsync({
            chatId: chat.id,
            updateChatMemberPayload: {
                isMuted: false,
                muteUntil: null,
            },
        });
    }

    const foldersWithNoChat = folders?.filter(
        (f) => !chat.folders?.some((cf) => cf.folderId === f.id)
    );

    return (
        <ContextMenu onOpenChange={(open) => open && handleContextMenu()}>
            <ContextMenuTrigger>
                <SafeLink href={`/${chat?.id}`}>
                    <div
                        className={`flex gap-[10px] text-white hover:bg-white/5 p-[10px] rounded-xl cursor-pointer ${
                            chatId === chat.id
                                ? "bg-purple-gradient"
                                : "bg-transparent"
                        }`}
                    >
                        <div className="w-[55px] h-[55px] bg-neutral-600 rounded-full flex-shrink-0 overflow-hidden">
                            <img
                                src={
                                    isPrivate
                                        ? otherMember?.user?.avatarUrl
                                        : chat.avatar
                                }
                                alt="avatar"
                                className="rounded-full w-full h-full object-cover"
                            />
                        </div>

                        <div className="flex flex-col justify-between flex-1 min-w-0">
                            <div className="flex justify-between gap-[5px]">
                                <div className="flex gap-[5px] font-semibold truncate items-center">
                                    <div className="truncate">{chatName}</div>
                                    {meMember?.isMuted && (
                                        <MuteIcon className="w-[15px] fill-neutral-500 stroke-2 stroke-neutral-500 flex-shrink-0 mb-[2px]" />
                                    )}
                                </div>
                                <div className="text-xs text-neutral-400">
                                    {formatSidebarLastMessageDateInChat(
                                        chat.lastMessage?.createdAt ?? ""
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-[10px] items-center justify-between">
                                <div
                                    className={`font-base truncate ${
                                        chatId === chat.id
                                            ? "text-white"
                                            : "text-neutral-400"
                                    }`}
                                >
                                    {chat.lastMessage?.content ?? ""}
                                </div>
                                {meMember?.isMarked ? (
                                    <div
                                        className={`min-w-[23px] h-[23px] mb-[2px] flex-shrink-0 ${
                                            meMember.isMuted
                                                ? "bg-neutral-500"
                                                : "bg-purple-gradient"
                                        } rounded-full text-xs flex items-center justify-center px-[3px]`}
                                    >
                                        <div className="mt-[1px] mr-[1px] font-semibold">
                                            {/* Якщо більше 999 то ставити 999+ */}
                                        </div>
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>
                        </div>
                    </div>
                </SafeLink>
            </ContextMenuTrigger>

            <ContextMenuContent className="w-[200px]">
                <ContextMenuItem asChild>
                    <Link href={`/${chat.id}`} target="_blank">
                        Open in New Tab
                    </Link>
                </ContextMenuItem>

                {folderId ? (
                    <ContextMenuItem
                        variant="destructive"
                        onClick={() =>
                            removeChatFromFolderMutation.mutateAsync({
                                chatId: chat.id,
                                folderId,
                            })
                        }
                    >
                        Remove From Folder
                    </ContextMenuItem>
                ) : (
                    folders &&
                    folders.length > 0 && (
                        <ContextMenuSub>
                            <ContextMenuSubTrigger>
                                Add to Folder
                            </ContextMenuSubTrigger>
                            <ContextMenuSubContent>
                                {foldersWithNoChat?.length ? (
                                    foldersWithNoChat.map((folder) => (
                                        <ContextMenuItem
                                            key={folder.id}
                                            onClick={() =>
                                                addChatToFolderMutation.mutateAsync(
                                                    {
                                                        chatId: chat.id,
                                                        folderId: folder.id,
                                                    }
                                                )
                                            }
                                        >
                                            {folder.name}
                                        </ContextMenuItem>
                                    ))
                                ) : (
                                    <ContextMenuItem disabled>
                                        No available folders
                                    </ContextMenuItem>
                                )}
                            </ContextMenuSubContent>
                        </ContextMenuSub>
                    )
                )}

                <ContextMenuItem
                    onClick={() =>
                        toggleMarkChatMutation.mutateAsync({
                            chatId: chat.id,
                            updateChatMemberPayload: {
                                isMarked: !meMember?.isMarked,
                            },
                        })
                    }
                >
                    {meMember?.isMarked ? "Unmark" : "Mark"}
                </ContextMenuItem>

                {meMember?.isMuted ? (
                    <ContextMenuItem
                        onClick={() =>
                            toggleMuteMutation.mutateAsync({
                                chatId: chat.id,
                                updateChatMemberPayload: {
                                    isMuted: false,
                                    muteUntil: null,
                                },
                            })
                        }
                    >
                        Unmute
                    </ContextMenuItem>
                ) : (
                    <ContextMenuItem onClick={() => setActiveModal("muteChat")}>
                        Mute
                    </ContextMenuItem>
                )}

                {chat.type === ChatEnum.GROUP ? (
                    <ContextMenuItem
                        variant="destructive"
                        onClick={handleDeleteModal}
                    >
                        Leave Group
                    </ContextMenuItem>
                ) : chat.type === ChatEnum.CHANNEL ? (
                    <ContextMenuItem
                        variant="destructive"
                        onClick={handleDeleteModal}
                    >
                        Leave Channel
                    </ContextMenuItem>
                ) : (
                    <ContextMenuItem
                        variant="destructive"
                        onClick={handleDeleteModal}
                    >
                        Delete Chat
                    </ContextMenuItem>
                )}
            </ContextMenuContent>
        </ContextMenu>
    );
}
