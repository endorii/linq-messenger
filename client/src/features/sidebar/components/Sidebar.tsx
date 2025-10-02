"use client";

import { useState } from "react";
import { ModalType, SidebarTabType } from "@/shared/types/types";
import AddContact from "../modals/AddContact";
import CreateFolder from "../modals/CreateFolder";
import CreateGroupOrChannel from "../modals/CreateGroupOrChannel";
import { IUser } from "@/shared/interfaces/IUser";
import { ChatEnum } from "@/shared/enums/enums";

import ChatsTab from "./tabs/ChatsTab";
import ContactsTab from "./tabs/ContactsTab";
import SettingsTab from "./tabs/SettingsTab";

function Sidebar({ user }: { user: IUser }) {
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [activeTab, setActiveTab] = useState<SidebarTabType>("chats");

    return (
        <div className="relative bg-neutral-950 h-full flex flex-col">
            {activeTab === "chats" && (
                <ChatsTab
                    user={user}
                    setActiveTab={setActiveTab}
                    setActiveModal={setActiveModal}
                />
            )}
            {activeTab === "contacts" && (
                <ContactsTab
                    setActiveTab={setActiveTab}
                    setActiveModal={setActiveModal}
                />
            )}
            {activeTab === "settings" && (
                <SettingsTab setActiveTab={setActiveTab} />
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
