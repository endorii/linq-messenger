"use client";

import { SidebarTabType } from "@/shared/types/types";
import { SetStateAction, useState } from "react";
import SidebarContacts from "../SidebarContacts";
import SidebarContactsMenu from "../SidebarContactsMenu";
import SidebarContactsPlus from "../SidebarContactsPlus";

function ContactsTab({
    setActiveTab,
}: {
    setActiveTab: React.Dispatch<SetStateAction<SidebarTabType>>;
}) {
    const [searchValue, setSearchValue] = useState("");

    return (
        <>
            <SidebarContactsMenu
                setActiveTab={setActiveTab}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
            />
            <SidebarContacts
                searchValue={searchValue}
                setActiveTab={setActiveTab}
            />
            <SidebarContactsPlus />
        </>
    );
}

export default ContactsTab;
