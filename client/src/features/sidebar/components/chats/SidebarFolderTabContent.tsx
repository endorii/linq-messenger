import { useFolderChats } from "@/features/chats/hooks/useChats";
import { IFolder } from "@/shared/interfaces/IFolder";
import { useMemo } from "react";
import SidebarChat from "./SidebarChat";
import { TabsContent } from "@/shared/components/ui/tabs";

function SidebarFolderTabContent({
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

export default SidebarFolderTabContent;
