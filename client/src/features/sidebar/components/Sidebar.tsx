"use client";

import { useState } from "react";
import { SidebarTabType } from "@/shared/types/types";
import AddContact from "../modals/AddContact";
import CreateFolder from "../modals/CreateFolder";
import CreateGroupOrChannel from "../modals/CreateGroupOrChannel";
import { IUser } from "@/shared/interfaces/IUser";
import { ChatEnum } from "@/shared/enums/enums";
import ChatsTab from "./tabs/ChatsTab";
import ContactsTab from "./tabs/ContactsTab";
import SettingsTab from "./tabs/SettingsTab";
import EditFolder from "../modals/EditFolder";
import { useSidebarStore } from "@/store/sidebarStore";

function Sidebar({ user }: { user: IUser }) {
    const { activeModal, setActiveModal } = useSidebarStore();
    const [activeTab, setActiveTab] = useState<SidebarTabType>("chats");

    return (
        <div className="relative bg-neutral-950 h-full flex flex-col">
            {activeTab === "chats" && (
                <ChatsTab user={user} setActiveTab={setActiveTab} />
            )}
            {activeTab === "contacts" && (
                <ContactsTab setActiveTab={setActiveTab} />
            )}
            {activeTab === "settings" && (
                <SettingsTab setActiveTab={setActiveTab} />
            )}

            <CreateFolder
                isOpen={activeModal === "addFolder"}
                onClose={() => setActiveModal(null)}
            />
            <EditFolder
                isOpen={activeModal === "editFolder"}
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
