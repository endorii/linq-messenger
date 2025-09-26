"use client";

import { PlusIcon } from "@/shared/icons";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import CreateNewChannel from "../modals/CreateNewChannel";
import { ModalType } from "@/shared/types/types";
import CreateNewGroup from "../modals/CreateNewGroup";
import AddContact from "../modals/AddContact";
import { IUser } from "@/shared/interfaces/IUser";
import AddFolder from "../modals/AddFolder";
import SidebarMenu from "./SidebarMenu";
import SidebarChats from "./SidebarChats";
import SidebarDropdownPlus from "./SidebarDropdownPlus";

function Sidebar({ user }: { user: IUser }) {
    const [searchValue, setSearchValue] = useState<string>("");
    const [activeModal, setActiveModal] = useState<ModalType>(null);

    return (
        <div className="relative bg-neutral-900 w-full max-w-[370px] h-full flex flex-col border-r border-neutral-800">
            <SidebarMenu
                user={user}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
            />

            <SidebarChats />

            <SidebarDropdownPlus setActiveModal={setActiveModal} />

            <AddFolder
                isOpen={activeModal === "addFolder"}
                onClose={() => setActiveModal(null)}
            />
            <CreateNewChannel
                isOpen={activeModal === "addNewChannel"}
                onClose={() => setActiveModal(null)}
            />
            <CreateNewGroup
                isOpen={activeModal === "addNewGroup"}
                onClose={() => setActiveModal(null)}
            />
            <AddContact
                isOpen={activeModal === "addContact"}
                onClose={() => setActiveModal(null)}
            />
        </div>
    );
}

export default Sidebar;
