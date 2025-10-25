"use client";

import { ChatEnum } from "@/shared/enums/enums";
import { IUser } from "@/shared/interfaces";
import { useModalStore, useSelectionStore, useNavigationStore } from "@/store";
import {
    CreateFolder,
    EditFolder,
    CreateGroupOrChannel,
    AddContact,
    AddMembersToChat,
    MuteChat,
    DeleteChat,
    DeleteMessage,
    DeleteMessages,
    ForwardMessages,
} from "../modals";
import { ChatsTab, ContactsTab, ProfileTab, SearchTab } from "./tabs";
import { ForwardMessage } from "../modals";

export function Sidebar({ user }: { user: IUser }) {
    const { activeModal, setActiveModal } = useModalStore();
    const {
        selectedChat,
        setSelectedChat,
        setSelectedMessage,
        clearSelectedMessages,
    } = useSelectionStore();
    const { sidebarTab } = useNavigationStore();

    const handleCloseModal = () => setActiveModal(null);

    const handleCloseChatModal = () => {
        handleCloseModal();
        setSelectedChat(null);
    };

    return (
        <div className="relative flex flex-col h-full bg-neutral-100 dark:dark:bg-neutral-950 ">
            {sidebarTab === "chats" && <ChatsTab user={user} />}
            {sidebarTab === "contacts" && <ContactsTab />}
            {sidebarTab === "profile" && <ProfileTab />}
            {sidebarTab === "search" && <SearchTab />}

            <CreateFolder
                isOpen={activeModal === "addFolder"}
                onClose={handleCloseModal}
            />
            <EditFolder
                isOpen={activeModal === "editFolder"}
                onClose={handleCloseModal}
            />
            {["addNewChannel", "addNewGroup"].map((modal) => (
                <CreateGroupOrChannel
                    key={modal}
                    isOpen={activeModal === modal}
                    onClose={handleCloseModal}
                    type={
                        modal === "addNewChannel"
                            ? ChatEnum.CHANNEL
                            : ChatEnum.GROUP
                    }
                />
            ))}

            <AddContact
                isOpen={activeModal === "addContact"}
                onClose={handleCloseModal}
            />
            <AddMembersToChat
                isOpen={activeModal === "addMembers"}
                onClose={handleCloseModal}
            />

            <ForwardMessage
                isOpen={activeModal === "forwardMessage"}
                onClose={handleCloseModal}
            />

            <ForwardMessages
                isOpen={activeModal === "forwardMessages"}
                onClose={handleCloseModal}
            />

            {selectedChat && (
                <>
                    <MuteChat
                        isOpen={activeModal === "muteChat"}
                        onClose={handleCloseChatModal}
                        chat={selectedChat}
                    />
                    <DeleteChat
                        isOpen={activeModal === "deleteChat"}
                        onClose={handleCloseChatModal}
                        chat={selectedChat}
                    />
                    <DeleteMessage
                        isOpen={activeModal === "deleteMessage"}
                        onClose={() => {
                            setActiveModal(null);
                            setSelectedMessage(null);
                        }}
                        chatId={selectedChat.id}
                    />
                    <DeleteMessages
                        isOpen={activeModal === "deleteMessages"}
                        onClose={() => {
                            setActiveModal(null);
                            clearSelectedMessages();
                        }}
                        chatId={selectedChat.id}
                    />
                </>
            )}
        </div>
    );
}
