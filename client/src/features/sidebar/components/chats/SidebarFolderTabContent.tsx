import { useFolderChats } from "@/features/chats/hooks/useChats";
import { IFolder } from "@/shared/interfaces";
import { useMemo } from "react";
import { SidebarChat } from "./SidebarChat";
import { TabsContent } from "@/shared/components/ui/tabs";
import { ChatListSkeleton } from "../../ui/skeletons/ChatsListSkeleton";

export function SidebarFolderTabContent({
    folder,
    isActive,
}: {
    folder: IFolder;
    isActive: boolean;
}) {
    const { data: folderChats, isPending: isFolderChatsPending } =
        useFolderChats(folder.id, {
            enabled: isActive,
        });

    const sortedFolderChats = useMemo(() => {
        if (!folderChats) return [];

        return folderChats.sort((a, b) => {
            const dateA = a.lastMessage
                ? new Date(a.lastMessage.createdAt).getTime()
                : 0;
            const dateB = b.lastMessage
                ? new Date(b.lastMessage.createdAt).getTime()
                : 0;
            return dateB - dateA;
        });
    }, [folderChats]);

    return (
        <TabsContent value={folder.id}>
            <div className="flex flex-col gap-[3px] w-full">
                {isFolderChatsPending ? (
                    <ChatListSkeleton />
                ) : sortedFolderChats.length > 0 ? (
                    sortedFolderChats.map((chat) => (
                        <SidebarChat
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
