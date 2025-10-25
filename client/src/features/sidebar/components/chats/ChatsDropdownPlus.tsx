"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { PlusIcon } from "@/shared/icons";
import { useModalStore } from "@/store";

export function ChatsDropdownPlus() {
    const { setActiveModal } = useModalStore();

    const handleCreateFolder = () => setActiveModal("addFolder");
    const handleCreateChannel = () => setActiveModal("addNewChannel");
    const handleCreateGroup = () => setActiveModal("addNewGroup");

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="
                        absolute bottom-4 right-4 
                        p-2 rounded-xl 
                        bg-theme-gradient 
                        cursor-pointer transition-transform
                        hover:scale-105 active:scale-95
                    "
                    aria-label="Add new item"
                >
                    <PlusIcon className="w-[30px] stroke-2 stroke-neutral-900 dark:stroke-white fill-none" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56 font-medium">
                <DropdownMenuItem onClick={handleCreateFolder}>
                    New folder
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-neutral-700" />

                <DropdownMenuItem onClick={handleCreateChannel}>
                    New channel
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleCreateGroup}>
                    New group
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
