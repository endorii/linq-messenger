"use client";

import { IUser } from "@/shared/interfaces/IUser";
import { SidebarTabType } from "@/shared/types/types";
import { SetStateAction, useState } from "react";
import SidebarChats from "../SidebarChats";
import SidebarDropdownPlus from "../SidebarDropdownPlus";
import SidebarMenu from "../SidebarMenu";

function ChatsTab({
    user,
    setActiveTab,
}: {
    user: IUser;
    setActiveTab: React.Dispatch<SetStateAction<SidebarTabType>>;
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
            <SidebarDropdownPlus />
        </>
    );
}

export default ChatsTab;
