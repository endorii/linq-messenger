"use client";

import SidebarChat from "@/features/sidebar/components/SidebarChat";
import { TabsContent } from "@/shared/components/ui/tabs";
import { IChat } from "@/shared/interfaces/IChat";
import { IFolder } from "@/shared/interfaces/IFolder";

function SidebarChatsList({
    folders,
    chats,
}: {
    folders: IFolder[] | undefined;
    chats: IChat[] | undefined;
}) {
    const filteredChats = chats?.filter((chat) => chat.messages?.length > 0);

    if (!filteredChats || filteredChats.length === 0) return null;

    return (
        <div className="flex-1 overflow-y-auto">
            <TabsContent value="allChats" className="h-full mt-0">
                <div className="flex flex-col gap-[3px] w-full">
                    {filteredChats.map((chat) => (
                        <SidebarChat key={chat.id} chat={chat} />
                    ))}
                </div>
            </TabsContent>

            {folders?.map((folder) => (
                <TabsContent
                    value={folder.name}
                    key={folder.id}
                    className="mt-0"
                >
                    <div className="flex flex-col gap-[3px] w-full">
                        {folder.chats.map((chat) => (
                            <SidebarChat key={chat.id} chat={chat} />
                        ))}
                    </div>
                </TabsContent>
            ))}
        </div>
    );
}

export default SidebarChatsList;
