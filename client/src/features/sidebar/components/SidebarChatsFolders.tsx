"use client";

import { TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { IFolder } from "@/shared/interfaces/IFolder";

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/shared/components/ui/context-menu";
import { useSidebarStore } from "@/store/sidebarStore";
import { useDeleteFolder } from "@/features/folders/hooks/useFolders";

function SidebarChatsFolders({ folders }: { folders: IFolder[] | undefined }) {
    const { setActiveModal, setSelectedFolder } = useSidebarStore();

    const useDeleteFolderMutation = useDeleteFolder();

    return (
        <TabsList className="flex w-full overflow-x-auto overflow-y-hidden mb-[5px]">
            <TabsTrigger value="allChats">All chats</TabsTrigger>
            {folders &&
                folders.length > 0 &&
                folders.map((folder) => (
                    <ContextMenu key={folder.id}>
                        <ContextMenuTrigger>
                            <TabsTrigger value={folder.name}>
                                {folder.name}
                            </TabsTrigger>
                        </ContextMenuTrigger>
                        <ContextMenuContent className="w-[200px]">
                            <ContextMenuItem
                                onClick={async () => {
                                    setSelectedFolder(folder);
                                    setActiveModal("editFolder");
                                }}
                            >
                                Edit Folder
                            </ContextMenuItem>
                            <ContextMenuItem
                                variant="destructive"
                                onClick={async () => {
                                    useDeleteFolderMutation.mutateAsync(
                                        folder.id
                                    );
                                }}
                            >
                                Delete Folder
                            </ContextMenuItem>
                        </ContextMenuContent>
                    </ContextMenu>
                ))}
        </TabsList>
    );
}

export default SidebarChatsFolders;
