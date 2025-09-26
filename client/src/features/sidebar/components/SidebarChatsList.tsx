"use client";

import SidebarChat from "@/features/sidebar/components/SidebarChat";
import { TabsContent } from "@/shared/components/ui/tabs";
import { IChat } from "@/shared/interfaces/IChat";
import { IChatFolder } from "@/shared/interfaces/IFolder";

function SidebarChatsList({
    folders,
    chats,
}: {
    folders: IChatFolder[] | undefined;
    chats: IChat[];
}) {
    if (!folders || folders.length === 0) return null;

    return (
        <div className="flex-1 overflow-y-auto">
            <TabsContent value="allChats" className="h-full">
                <div className="flex flex-col gap-[2px] w-full">
                    {chats.map((chat: IChat, i: number) => (
                        <SidebarChat chat={chat} key={i} />
                    ))}
                </div>
            </TabsContent>
            {folders && folders.length > 0
                ? folders.map((folder, i) => (
                      <TabsContent value={folder.name} key={i}>
                          <div className="flex flex-col gap-[2px] w-full">
                              {folder.chats.map((chat, i: number) => (
                                  <SidebarChat chat={chat} key={i} />
                              ))}
                          </div>
                      </TabsContent>
                  ))
                : null}
        </div>
    );
}

export default SidebarChatsList;
