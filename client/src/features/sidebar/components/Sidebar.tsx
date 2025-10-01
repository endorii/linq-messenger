"use client";

import { useState } from "react";
import { ModalType, SidebarTabType } from "@/shared/types/types";
import AddContact from "../modals/AddContact";
import { IUser } from "@/shared/interfaces/IUser";
import CreateFolder from "../modals/CreateFolder";
import SidebarMenu from "./SidebarMenu";
import SidebarChats from "./SidebarChats";
import SidebarDropdownPlus from "./SidebarDropdownPlus";
import SidebarContacts from "./SidebarContacts";
import SidebarContactsMenu from "./SidebarContactsMenu";
import SidebarSettings from "./SidebarSettings";
import SidebarSettingsMenu from "./SidebarSettingsMenu";
import SidebarContactsPlus from "./SidebarContactsPlus";
import CreateGroupOrChannel from "../modals/CreateGroupOrChannel";
import { ChatEnum } from "@/shared/enums/enums";

function Sidebar({ user }: { user: IUser }) {
    const [searchValue, setSearchValue] = useState<string>("");
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [activeTab, setActiveTab] = useState<SidebarTabType>("chats");

    return (
        <div className={`relative bg-neutral-950 h-full flex flex-col`}>
            {activeTab === "chats" && (
                <SidebarMenu
                    user={user}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            )}
            {activeTab === "contacts" && (
                <SidebarContactsMenu setActiveTab={setActiveTab} />
            )}
            {activeTab === "settings" && (
                <SidebarSettingsMenu setActiveTab={setActiveTab} />
            )}

            {activeTab === "chats" && <SidebarChats />}
            {activeTab === "contacts" && <SidebarContacts />}
            {activeTab === "settings" && (
                <SidebarSettings setActiveTab={setActiveTab} />
            )}

            {activeTab === "chats" && (
                <SidebarDropdownPlus setActiveModal={setActiveModal} />
            )}
            {activeTab === "contacts" && (
                <SidebarContactsPlus setActiveModal={setActiveModal} />
            )}

            <CreateFolder
                isOpen={activeModal === "addFolder"}
                onClose={() => setActiveModal(null)}
            />
            <CreateGroupOrChannel
                isOpen={activeModal === "addNewChannel"}
                onClose={() => setActiveModal(null)}
                type={ChatEnum.CHANNEL}
            />
            <CreateGroupOrChannel
                isOpen={activeModal === "addNewGroup"}
                onClose={() => setActiveModal(null)}
                type={ChatEnum.GROUP}
            />
            <AddContact
                isOpen={activeModal === "addContact"}
                onClose={() => setActiveModal(null)}
            />
        </div>
    );
}

export default Sidebar;
