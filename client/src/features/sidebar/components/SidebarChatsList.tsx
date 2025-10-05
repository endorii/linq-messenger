"use client";

import { useProfile } from "@/features/auth/hooks/useAuth";
import { useContacts } from "@/features/contacts/hooks/useContacts";
import SidebarChat from "@/features/sidebar/components/SidebarChat";
import { TabsContent } from "@/shared/components/ui/tabs";
import { IChat } from "@/shared/interfaces/IChat";
import { IFolder } from "@/shared/interfaces/IFolder";
import { ModalType } from "@/shared/types/types";
import { useMemo, useState } from "react";
import DeleteChat from "../modals/DeleteChat";

function SidebarChatsList({
    folders,
    chats,
}: {
    folders: IFolder[] | undefined;
    chats: IChat[] | undefined;
}) {
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [selectedChat, setSelectedChat] = useState<IChat | null>(null);
    const { data: me } = useProfile();

    if (!chats || chats.length === 0) return null;

    return (
        <div className="flex-1 overflow-y-auto">
            <TabsContent value="allChats" className="h-full mt-0">
                <div className="flex flex-col gap-[3px] w-full">
                    {chats.map((chat) => (
                        <SidebarChat
                            key={chat.id}
                            setSelectedChat={setSelectedChat}
                            chat={chat}
                            setActiveModal={setActiveModal}
                        />
                    ))}
                </div>
            </TabsContent>

            {folders?.map((folder) => (
                <TabsContent
                    value={folder.name}
                    key={folder.id}
                    className="mt-0"
                >
                    <div className="flex flex-col gap-[3px] w-full">
                        {folder.chats.map((chat) => (
                            <SidebarChat
                                key={chat.id}
                                setSelectedChat={setSelectedChat}
                                chat={chat}
                                setActiveModal={setActiveModal}
                            />
                        ))}
                    </div>
                </TabsContent>
            ))}

            <DeleteChat
                isOpen={activeModal === "deleteChat"}
                onClose={() => {
                    setActiveModal(null);
                    setSelectedChat(null);
                }}
                user={selectedChat?.members.find((m) => m.userId !== me?.id)}
                chat={selectedChat}
            />
        </div>
    );
}

export default SidebarChatsList;
