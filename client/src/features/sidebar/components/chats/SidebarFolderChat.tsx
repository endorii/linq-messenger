"use client";

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/shared/components/ui/context-menu";
import { useChatEntity } from "@/shared/hooks/useChatEntity";
import { ChatEnum } from "@/shared/enums/enums";
import { IChat } from "@/shared/interfaces/IChat";
import SafeLink from "@/shared/ui/links/SafeLink";
import formatSidebarLastMessageDateInChat from "@/shared/utils/formatSidebarLastMessageDateInChat";
import { useParams } from "next/navigation";
import { useSidebarStore } from "@/store/sidebarStore";
import { useProfile } from "@/features/auth/hooks/useAuth";
import { useRemoveChatFromFolder } from "@/features/folders/hooks/useFolders";
import Link from "next/link";

interface SidebarFolderChatProps {
    chat: IChat;
    folderId: string;
}

function SidebarFolderChat({ chat, folderId }: SidebarFolderChatProps) {
    if (!chat) return null;
    const params = useParams();
    const chatId = params?.chatSlug;

    const { chatName } = useChatEntity(chat);
    const { data: me } = useProfile();

    const { setSelectedChat, setActiveModal } = useSidebarStore();

    const removeChatFromFolderMutation = useRemoveChatFromFolder();

    const isPrivateChat = chat.type === ChatEnum.PRIVATE;

    const handleDeleteModal = () => {
        setActiveModal("deleteChat");
    };

    const handleBlockUser = () => {
        console.log(`Block user in chat: ${chat.id}`);
    };

    const handleContextMenu = () => {
        setSelectedChat(chat);
    };

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
                                    isPrivateChat
                                        ? chat.members.find(
                                              (m) => m.userId !== me?.id
                                          )?.user.avatarUrl
                                        : chat.avatar
                                }
                                alt="avatar2"
                                className="rounded-full w-full h-full object-cover"
                            />
                        </div>

                        <div className="flex flex-col justify-between flex-1 min-w-0">
                            <div className="flex justify-between gap-[2px]">
                                <div className="font-semibold truncate">
                                    {chatName}
                                </div>
                                <div className="text-xs text-neutral-400">
                                    {formatSidebarLastMessageDateInChat(
                                        chat.lastMessage?.createdAt ?? ""
                                    )}
                                </div>
                            </div>

                            <div
                                className={`font-base truncate ${
                                    chatId === chat.id
                                        ? "text-white"
                                        : "text-neutral-400"
                                }`}
                            >
                                {chat.lastMessage?.content ?? ""}
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
                <ContextMenuItem>Mark</ContextMenuItem>
                <ContextMenuItem>Pin</ContextMenuItem>
                <ContextMenuItem>Mute</ContextMenuItem>
                {/* <ContextMenuItem>Report</ContextMenuItem> */}

                {isPrivateChat && (
                    <ContextMenuItem onClick={handleBlockUser}>
                        Block User
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

export default SidebarFolderChat;
