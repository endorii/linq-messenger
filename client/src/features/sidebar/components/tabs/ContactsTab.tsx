"use client";

import { useState } from "react";
import SidebarContacts from "../SidebarContacts";
import SidebarContactsMenu from "../SidebarContactsMenu";
import SidebarContactsPlus from "../SidebarContactsPlus";

function ContactsTab() {
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

export default ContactsTab;
