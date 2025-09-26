"use client";

import PlusIcon from "@/shared/icons/PlusIcon";
import { ModalType } from "@/shared/types/types";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";

function SidebarDropdownPlus({
    setActiveModal,
}: {
    setActiveModal: React.Dispatch<React.SetStateAction<ModalType>>;
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="absolute bottom-4 right-4 bg-neutral-950 rounded-xl border border-neutral-800 hover:bg-neutral-600 p-[10px] cursor-pointer">
                    <PlusIcon className="w-[30px] stroke-white stroke-2 fill-none" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56">
                <DropdownMenuItem onClick={() => setActiveModal("addFolder")}>
                    New folder
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-neutral-800" />
                <DropdownMenuItem
                    onClick={() => setActiveModal("addNewChannel")}
                >
                    New channel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveModal("addNewGroup")}>
                    New group
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveModal("addContact")}>
                    Add contact
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default SidebarDropdownPlus;
