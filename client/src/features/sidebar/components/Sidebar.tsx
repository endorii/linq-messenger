"use client";

import AddContact from "../modals/AddContact";
import CreateFolder from "../modals/CreateFolder";
import CreateGroupOrChannel from "../modals/CreateGroupOrChannel";
import { IUser } from "@/shared/interfaces/IUser";
import { ChatEnum } from "@/shared/enums/enums";
import ChatsTab from "./tabs/ChatsTab";
import ContactsTab from "./tabs/ContactsTab";
import ProfileTab from "./tabs/ProfileTab";
import EditFolder from "../modals/EditFolder";
import { useSidebarStore } from "@/store/sidebarStore";
import DeleteChat from "../modals/DeleteChat";
import { SearchTab } from "./tabs/SearchTab";

function Sidebar({ user }: { user: IUser }) {
    const { activeModal, setActiveModal, sidebarTab } = useSidebarStore();

    return (
        <div className="relative bg-neutral-950 h-full flex flex-col">
            {sidebarTab === "chats" && <ChatsTab user={user} />}
            {sidebarTab === "contacts" && <ContactsTab />}
            {sidebarTab === "profile" && <ProfileTab />}
            {sidebarTab === "search" && <SearchTab />}

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

            <DeleteChat
                isOpen={activeModal === "deleteChat"}
                onClose={() => {
                    setActiveModal(null);
                }}
            />
        </div>
    );
}

export default Sidebar;
