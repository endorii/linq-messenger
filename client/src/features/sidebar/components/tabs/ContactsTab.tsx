"use client";

import { useState } from "react";
import SidebarContacts from "../contacts/SidebarContacts";
import SidebarContactsMenu from "../contacts/SidebarContactsMenu";
import SidebarContactsPlus from "../contacts/SidebarContactsPlus";

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
