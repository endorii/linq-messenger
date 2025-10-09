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

interface SidebarChatProps {
    chat: IChat;
}

function SidebarChat({ chat }: SidebarChatProps) {
    const params = useParams();
    const chatId = params?.chatSlug;

    const { chatName } = useChatEntity(chat);

    const { setSelectedChat, setActiveModal } = useSidebarStore();

    const isPrivateChat = chat.type === ChatEnum.PRIVATE;

    const handleSetChatAndDeleteModal = () => {
        setSelectedChat(chat);
        setActiveModal("deleteChat");
    };

    // TODO: Додати тут обробник для блокування користувача
    const handleBlockUser = () => {
        // Логіка для блокування
        console.log(`Block user in chat: ${chat.id}`);
    };

    return (
        <>
            <ContextMenu>
                <ContextMenuTrigger>
                    <SafeLink href={`/${chat?.id}`}>
                        <div
                            className={`flex gap-[10px] text-white hover:bg-white/5 p-[10px] rounded-xl cursor-pointer ${
                                chatId === chat.id
                                    ? "bg-purple-gradient"
                                    : "bg-transparent"
                            }`}
                        >
                            <div className="w-[55px] h-[55px] bg-neutral-600 rounded-full flex-shrink-0">
                                <img
                                    src={chat.avatar}
                                    alt="avatar"
                                    className="rounded-full"
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
                                    className={` font-base truncate ${
                                        chatId === chat.id
                                            ? "text-white"
                                            : "text-neutral-400"
                                    }`}
                                >
                                    {chat.lastMessage?.content ?? ""}
                                </div>
                                <div></div>
                            </div>
                        </div>
                    </SafeLink>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-[200px]">
                    <ContextMenuItem className="group">
                        Open in New Tab
                    </ContextMenuItem>
                    <ContextMenuItem>Add to Folder</ContextMenuItem>
                    <ContextMenuItem>Mark</ContextMenuItem>
                    <ContextMenuItem>Pin</ContextMenuItem>
                    <ContextMenuItem>Mute</ContextMenuItem>
                    <ContextMenuItem>Report</ContextMenuItem>

                    {isPrivateChat && (
                        <ContextMenuItem onClick={handleBlockUser}>
                            Block User
                        </ContextMenuItem>
                    )}

                    {chat.type === ChatEnum.GROUP ? (
                        <ContextMenuItem
                            variant="destructive"
                            onClick={handleSetChatAndDeleteModal}
                        >
                            Leave Group
                        </ContextMenuItem>
                    ) : chat.type === ChatEnum.CHANNEL ? (
                        <ContextMenuItem
                            variant="destructive"
                            onClick={handleSetChatAndDeleteModal}
                        >
                            Leave Channel
                        </ContextMenuItem>
                    ) : (
                        <ContextMenuItem
                            variant="destructive"
                            onClick={handleSetChatAndDeleteModal}
                        >
                            Delete Chat
                        </ContextMenuItem>
                    )}
                </ContextMenuContent>
            </ContextMenu>
        </>
    );
}

export default SidebarChat;
