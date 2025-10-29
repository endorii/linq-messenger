"use client";

import { ButtonActive } from "@/shared/components/ui/buttons";
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
    const handleAddContact = () => setActiveModal("addContact");
    const handleCreateGroup = () => setActiveModal("addNewGroup");

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="
                        absolute bottom-4 right-4 p-2 rounded-xl bg-theme-gradient"
                >
                    <PlusIcon className="w-[30px] stroke-2 stroke-white fill-none" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56 font-medium">
                <DropdownMenuItem onClick={handleCreateFolder}>
                    New folder
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleAddContact}>
                    New contact
                </DropdownMenuItem>
                <DropdownMenuSeparator />

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
