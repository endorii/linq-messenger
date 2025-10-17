"use client";

import { useMemo } from "react";
import { useChats } from "@/features/chats/hooks/useChats";
import { IFolder } from "@/shared/interfaces";
import { SidebarChat } from "./SidebarChat";
import { SidebarFolderTabContent } from "./SidebarFolderTabContent";
import { TabsContent } from "@/shared/components/ui/tabs";
import { ChatListSkeleton } from "../../ui/skeletons/ChatsListSkeleton";

interface SidebarChatsListProps {
    folders: IFolder[];
    isFoldersPending: boolean;
    activeTab: string;
}

export function SidebarChatsList({
    folders,
    isFoldersPending,
    activeTab,
}: SidebarChatsListProps) {
    const { data: chats, isPending: isChatsPending } = useChats();

    const sortedChats = useMemo(() => {
        if (!chats) return [];

        return chats
            .filter((chat) => chat.lastMessage)
            .sort(
                (a, b) =>
                    new Date(b.lastMessage?.createdAt ?? 0).getTime() -
                    new Date(a.lastMessage?.createdAt ?? 0).getTime()
            );
    }, [chats]);

    return (
        <div className="flex-1 overflow-y-auto">
            <TabsContent value="allChats">
                <div className="flex flex-col gap-[3px] w-full">
                    {isChatsPending ? (
                        <ChatListSkeleton />
                    ) : sortedChats && sortedChats.length > 0 ? (
                        sortedChats.map((chat) => (
                            <SidebarChat
                                key={chat.id}
                                chat={chat}
                                folders={folders}
                            />
                        ))
                    ) : (
                        <div className="text-center text-muted-foreground py-4">
                            No chats yet
                        </div>
                    )}
                </div>
            </TabsContent>

            {folders &&
                folders.map((folder) => (
                    <SidebarFolderTabContent
                        key={folder.id}
                        folder={folder}
                        isActive={activeTab === folder.id}
                    />
                ))}
        </div>
    );
}
