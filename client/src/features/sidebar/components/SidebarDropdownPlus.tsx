"use client";

import PlusIcon from "@/shared/icons/PlusIcon";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";
import { useModalStore } from "@/store";

function SidebarDropdownPlus() {
    const { setActiveModal } = useModalStore();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="absolute bottom-4 right-4 bg-purple-gradient rounded-xl p-[8px] cursor-pointer">
                    <PlusIcon className="w-[30px] stroke-white stroke-2 fill-none" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56">
                <DropdownMenuItem onClick={() => setActiveModal("addFolder")}>
                    New folder
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-neutral-700" />
                <DropdownMenuItem
                    onClick={() => setActiveModal("addNewChannel")}
                >
                    New channel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveModal("addNewGroup")}>
                    New group
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default SidebarDropdownPlus;
