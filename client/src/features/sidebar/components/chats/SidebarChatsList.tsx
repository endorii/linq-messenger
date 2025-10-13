"use client";

import { TabsContent } from "@/shared/components/ui/tabs";
import { IFolder } from "@/shared/interfaces/IFolder";
import SidebarChat from "./SidebarChat";
import { useChats, useFolderChats } from "@/features/chats/hooks/useChats";
import { useMemo } from "react";
import SidebarFolderChat from "./SidebarFolderChat";

interface SidebarChatsListProps {
    folders: IFolder[] | undefined;
    activeTab: string;
}

function SidebarChatsList({ folders, activeTab }: SidebarChatsListProps) {
    const { data: chats, isPending: isChatsPending } = useChats();

    const sortedChats = useMemo(() => {
        const filtered = chats?.filter((chat) => chat.messages?.length > 0);
        return filtered
            ?.map((chat) => ({
                ...chat,
                lastMessageDate: chat.messages?.[0]?.createdAt ?? 0,
            }))
            .sort(
                (a, b) =>
                    new Date(b.lastMessageDate).getTime() -
                    new Date(a.lastMessageDate).getTime()
            );
    }, [chats]);

    return (
        <div className="flex-1 overflow-y-auto">
            <TabsContent value="allChats">
                <div className="flex flex-col gap-[3px] w-full">
                    {isChatsPending ? (
                        <div className="text-center text-muted-foreground py-4">
                            Loading chats...
                        </div>
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
                    <FolderTabContent
                        key={folder.id}
                        folder={folder}
                        isActive={activeTab === folder.id}
                    />
                ))}
        </div>
    );
}

function FolderTabContent({
    folder,
    isActive,
}: {
    folder: IFolder;
    isActive: boolean;
}) {
    const { data: folderChats, isLoading } = useFolderChats(folder.id, {
        enabled: isActive,
    });

    const sortedFolderChats = useMemo(() => {
        if (!folderChats) return [];
        return folderChats
            .filter((chat) => chat.messages?.length > 0)
            .map((chat) => ({
                ...chat,
                lastMessageDate: chat.messages?.[0]?.createdAt ?? 0,
            }))
            .sort(
                (a, b) =>
                    new Date(b.lastMessageDate).getTime() -
                    new Date(a.lastMessageDate).getTime()
            );
    }, [folderChats]);

    return (
        <TabsContent value={folder.id}>
            <div className="flex flex-col gap-[3px] w-full">
                {sortedFolderChats.length > 0 ? (
                    sortedFolderChats.map((chat) => (
                        <SidebarFolderChat
                            key={chat.id}
                            chat={chat}
                            folderId={folder.id}
                        />
                    ))
                ) : (
                    <div className="text-center text-muted-foreground py-4">
                        No chats in this folder
                    </div>
                )}
            </div>
        </TabsContent>
    );
}

export default SidebarChatsList;
