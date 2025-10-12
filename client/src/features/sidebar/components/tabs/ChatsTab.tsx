"use client";

import { IUser } from "@/shared/interfaces/IUser";
import SidebarChats from "../chats/SidebarChats";
import SidebarDropdownPlus from "../SidebarDropdownPlus";
import SidebarMenu from "../SidebarMenu";

function ChatsTab({ user }: { user: IUser }) {
    return (
        <>
            <SidebarMenu user={user} />
            <SidebarChats />
            <SidebarDropdownPlus />
        </>
    );
}

export default ChatsTab;
