"use client";

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/shared/components/ui/context-menu";
import { useChatEntity } from "@/shared/hooks/useChatEntity";
import { ChatEnum } from "@/shared/enums/enums";
import { SettingsIcon } from "@/shared/icons";
import { IChat } from "@/shared/interfaces/IChat";
import SafeLink from "@/shared/ui/links/SafeLink";
import formatSidebarLastMessageDateInChat from "@/shared/utils/formatSidebarLastMessageDateInChat";
import { useParams } from "next/navigation";
import { ModalType } from "@/shared/types/types";

interface SidebarChatProps {
    setSelectedChat: React.Dispatch<React.SetStateAction<IChat | null>>;
    chat: IChat;
    setActiveModal: React.Dispatch<React.SetStateAction<ModalType>>;
}

function SidebarChat({
    setSelectedChat,
    chat,
    setActiveModal,
}: SidebarChatProps) {
    const params = useParams();
    const chatId = params?.chatSlug;

    const { chatName } = useChatEntity(chat);

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
                        <SettingsIcon className="w-[30px] stroke-2 stroke-white fill-none group-hover:stroke-black" />
                        <div>Open in New Tab</div>
                    </ContextMenuItem>
                    <ContextMenuItem>Add to Folder</ContextMenuItem>
                    <ContextMenuItem>Mark</ContextMenuItem>
                    <ContextMenuItem>Pin</ContextMenuItem>
                    <ContextMenuItem>Mute</ContextMenuItem>
                    <ContextMenuItem>Roport</ContextMenuItem>

                    {isPrivateChat && (
                        <ContextMenuItem onClick={handleBlockUser}>
                            Block User
                        </ContextMenuItem>
                    )}

                    {/* 4. Деструктивні дії */}
                    {isPrivateChat ? (
                        <ContextMenuItem
                            variant="destructive"
                            onClick={handleSetChatAndDeleteModal}
                        >
                            Delete Chat
                        </ContextMenuItem>
                    ) : chat.type === ChatEnum.GROUP ? (
                        <ContextMenuItem
                            variant="destructive"
                            onClick={() => {}} // TODO: Add logic to leave group
                        >
                            Leave Group
                        </ContextMenuItem>
                    ) : (
                        <ContextMenuItem
                            variant="destructive"
                            onClick={() => {}} // TODO: Add logic to leave channel
                        >
                            Leave Channel
                        </ContextMenuItem>
                    )}
                </ContextMenuContent>
            </ContextMenu>
        </>
    );
}

export default SidebarChat;
