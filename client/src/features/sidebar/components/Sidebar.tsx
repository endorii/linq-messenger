"use client";

import { useState } from "react";
import CreateNewChannel from "../modals/CreateNewChannel";
import { ModalType } from "@/shared/types/types";
import CreateNewGroup from "../modals/CreateNewGroup";
import AddContact from "../modals/AddContact";
import { IUser } from "@/shared/interfaces/IUser";
import CreateFolder from "../modals/CreateFolder";
import SidebarMenu from "./SidebarMenu";
import SidebarChats from "./SidebarChats";
import SidebarDropdownPlus from "./SidebarDropdownPlus";

function Sidebar({ user }: { user: IUser }) {
    const [searchValue, setSearchValue] = useState<string>("");
    const [activeModal, setActiveModal] = useState<ModalType>(null);

    return (
        <div className={`relative bg-neutral-950 h-full flex flex-col`}>
            <SidebarMenu
                user={user}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
            />

            <SidebarChats />

            <SidebarDropdownPlus setActiveModal={setActiveModal} />

            <CreateFolder
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
