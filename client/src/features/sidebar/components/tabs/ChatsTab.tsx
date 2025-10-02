"use client";

import { IUser } from "@/shared/interfaces/IUser";
import { ModalType, SidebarTabType } from "@/shared/types/types";
import { SetStateAction, useState } from "react";
import SidebarChats from "../SidebarChats";
import SidebarDropdownPlus from "../SidebarDropdownPlus";
import SidebarMenu from "../SidebarMenu";

function ChatsTab({
    user,
    setActiveTab,
    setActiveModal,
}: {
    user: IUser;
    setActiveTab: React.Dispatch<SetStateAction<SidebarTabType>>;
    setActiveModal: React.Dispatch<SetStateAction<ModalType>>;
}) {
    const [searchValue, setSearchValue] = useState("");

    return (
        <>
            <SidebarMenu
                user={user}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                activeTab="chats"
                setActiveTab={setActiveTab}
            />
            <SidebarChats />
            <SidebarDropdownPlus setActiveModal={setActiveModal} />
        </>
    );
}

export default ChatsTab;
