"use client";

import { SidebarTabType, ModalType } from "@/shared/types/types";
import { SetStateAction, useState } from "react";
import SidebarContacts from "../SidebarContacts";
import SidebarContactsMenu from "../SidebarContactsMenu";
import SidebarContactsPlus from "../SidebarContactsPlus";

function ContactsTab({
    setActiveTab,
    setActiveModal,
}: {
    setActiveTab: React.Dispatch<SetStateAction<SidebarTabType>>;
    setActiveModal: React.Dispatch<SetStateAction<ModalType>>;
}) {
    const [searchValue, setSearchValue] = useState("");

    return (
        <>
            <SidebarContactsMenu
                setActiveTab={setActiveTab}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
            />
            <SidebarContactsPlus setActiveModal={setActiveModal} />
            <SidebarContacts searchValue={searchValue} />
        </>
    );
}

export default ContactsTab;
