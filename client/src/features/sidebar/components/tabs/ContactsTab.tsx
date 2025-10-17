"use client";

import { useState } from "react";
import {
    SidebarContactsMenu,
    SidebarContacts,
    SidebarContactsPlus,
} from "../contacts";

export function ContactsTab() {
    const [searchValue, setSearchValue] = useState("");

    return (
        <>
            <SidebarContactsMenu
                searchValue={searchValue}
                setSearchValue={setSearchValue}
            />
            <SidebarContacts searchValue={searchValue} />
            <SidebarContactsPlus />
        </>
    );
}
