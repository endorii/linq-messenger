"use client";

import { TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { IFolder } from "@/shared/interfaces/IFolder";

import { useDeleteFolder } from "@/features/folders/hooks/useFolders";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/shared/components/ui/context-menu";
import { useModalStore, useSelectionStore } from "@/store";
import { FoldersListSkeleton } from "../../ui/skeletons/FoldersListSkeleton";

export function SidebarChatsFolders({
    folders,
    isFoldersPending,
}: {
    folders: IFolder[];
    isFoldersPending: boolean;
}) {
    const { setActiveModal } = useModalStore();
    const { setSelectedFolder } = useSelectionStore();

    const useDeleteFolderMutation = useDeleteFolder();

    return (
        <TabsList className="flex w-full overflow-x-auto overflow-y-hidden mb-[5px]">
            <TabsTrigger value="allChats">All chats</TabsTrigger>
            {folders && folders.length > 0 ? (
                folders.map((folder) => (
                    <ContextMenu key={folder.id}>
                        <ContextMenuTrigger>
                            <TabsTrigger value={folder.id}>
                                {folder.name}
                            </TabsTrigger>
                        </ContextMenuTrigger>
                        <ContextMenuContent className="w-[200px]">
                            <ContextMenuItem
                                onClick={() => {
                                    setSelectedFolder(folder);
                                    setActiveModal("editFolder");
                                }}
                            >
                                Edit Folder
                            </ContextMenuItem>
                            <ContextMenuItem
                                variant="destructive"
                                disabled={useDeleteFolderMutation.isPending}
                                onClick={() => {
                                    useDeleteFolderMutation.mutateAsync(
                                        folder.id
                                    );
                                }}
                            >
                                Delete Folder
                            </ContextMenuItem>
                        </ContextMenuContent>
                    </ContextMenu>
                ))
            ) : isFoldersPending ? (
                <FoldersListSkeleton />
            ) : null}
        </TabsList>
    );
}
