"use client";

import { IUser } from "@/shared/interfaces";
import { ChatsMenu } from "../chats/ChatsMenu";
import { SidebarChats } from "../chats/SidebarChats";
import { ChatsDropdownPlus } from "../chats/ChatsDropdownPlus";

export function ChatsTab({ user }: { user: IUser }) {
    return (
        <>
            <ChatsMenu user={user} />
            <SidebarChats />
            <ChatsDropdownPlus />
        </>
    );
}
