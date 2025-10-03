import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/shared/components/ui/context-menu";
import { SettingsIcon } from "@/shared/icons";
import { IChat } from "@/shared/interfaces/IChat";
import SafeLink from "@/shared/ui/links/SafeLink";
import formatSidebarLastMessageDateInChat from "@/shared/utils/formatSidebarLastMessageDateInChat";
import { useParams } from "next/navigation";

function SidebarChat({ chat }: { chat: IChat }) {
    const params = useParams();
    const chatId = params?.chatSlug;

    return (
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
                                    {chat?.name ?? "Chat name"}
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
                <ContextMenuItem variant="destructive">
                    Delete Chat
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
}

export default SidebarChat;
