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
    activeTab: string;
}

export function SidebarChatsList({
    folders,
    activeTab,
}: SidebarChatsListProps) {
    const { data: chats, isPending: isChatsPending } = useChats();

    const sortedChats = useMemo(() => {
        if (!chats) return [];

        return chats.sort((a, b) => {
            const dateA = a.lastMessage
                ? new Date(a.lastMessage.createdAt).getTime()
                : 0;
            const dateB = b.lastMessage
                ? new Date(b.lastMessage.createdAt).getTime()
                : 0;
            return dateB - dateA;
        });
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
                        <div className="text-center text-neutral-600 py-4">
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
