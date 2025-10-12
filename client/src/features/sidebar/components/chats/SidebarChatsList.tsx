"use client";

import { TabsContent } from "@/shared/components/ui/tabs";
import { IChat } from "@/shared/interfaces/IChat";
import { IFolder } from "@/shared/interfaces/IFolder";
import SidebarChat from "./SidebarChat";

function SidebarChatsList({
    folders,
    chats,
}: {
    folders: IFolder[] | undefined;
    chats: IChat[] | undefined;
}) {
    const filteredChats = chats?.filter((chat) => chat.messages?.length > 0);

    if (!filteredChats || filteredChats.length === 0) return null;

    const sortedChats = filteredChats
        .map((chat) => ({
            ...chat,
            lastMessageDate: chat.messages?.[0]?.createdAt ?? 0,
        }))
        .sort(
            (a, b) =>
                new Date(b.lastMessageDate).getTime() -
                new Date(a.lastMessageDate).getTime()
        );

    return (
        <div className="flex-1 overflow-y-auto">
            <TabsContent value="allChats" className="h-full mt-0">
                <div className="flex flex-col gap-[3px] w-full">
                    {sortedChats.map((chat) => (
                        <SidebarChat key={chat.id} chat={chat} />
                    ))}
                </div>
            </TabsContent>

            {folders?.map((folder) => {
                const sortedFolderChats = folder.chats
                    .map((chat) => ({
                        ...chat,
                        lastMessageDate: chat.messages?.[0]?.createdAt ?? 0,
                    }))
                    .sort(
                        (a, b) =>
                            new Date(b.lastMessageDate).getTime() -
                            new Date(a.lastMessageDate).getTime()
                    );

                return (
                    <TabsContent
                        value={folder.name}
                        key={folder.id}
                        className="mt-0"
                    >
                        <div className="flex flex-col gap-[3px] w-full">
                            {sortedFolderChats.map((chat) => (
                                <SidebarChat key={chat.id} chat={chat} />
                            ))}
                        </div>
                    </TabsContent>
                );
            })}
        </div>
    );
}

export default SidebarChatsList;
