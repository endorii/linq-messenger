"use client";

import { useProfile } from "@/features/auth/hooks/useAuth";
import { useDeleteChat } from "@/features/chats/hooks/useChats";
import SidebarChat from "@/features/sidebar/components/SidebarChat";
import { TabsContent } from "@/shared/components/ui/tabs";
import { IChat } from "@/shared/interfaces/IChat";
import { IChatFolder } from "@/shared/interfaces/IFolder";
import { ModalType } from "@/shared/types/types";
import { useState } from "react";
import DeleteChat from "../modals/DeleteChat";

function SidebarChatsList({
    folders,
    chats,
}: {
    folders: IChatFolder[] | undefined;
    chats: IChat[] | undefined;
}) {
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [selectedChat, setSelectedChat] = useState<IChat | null>(null);
    const { data: me } = useProfile();

    if (!chats || chats.length === 0) return null;

    return (
        <div className="flex-1 overflow-y-auto">
            <TabsContent value="allChats" className="h-full">
                <div className="flex flex-col gap-[3px] w-full">
                    {chats.map((chat: IChat, i: number) => (
                        <SidebarChat
                            setSelectedChat={setSelectedChat}
                            chat={chat}
                            setActiveModal={setActiveModal}
                            key={i}
                        />
                    ))}
                </div>
            </TabsContent>
            {folders && folders.length > 0
                ? folders.map((folder, i) => (
                      <TabsContent value={folder.name} key={i}>
                          <div className="flex flex-col gap-[3px] w-full">
                              {folder.chats.map((chat, i: number) => (
                                  <SidebarChat
                                      setSelectedChat={setSelectedChat}
                                      chat={chat}
                                      setActiveModal={setActiveModal}
                                      key={i}
                                  />
                              ))}
                          </div>
                      </TabsContent>
                  ))
                : null}

            <DeleteChat
                isOpen={activeModal === "deleteChat"}
                onClose={() => {
                    setActiveModal(null);
                    setSelectedChat(null);
                }}
                user={
                    selectedChat &&
                    selectedChat.members.filter(
                        (member) => member.id !== me?.id
                    )[0]
                }
                chat={selectedChat}
            />
        </div>
    );
}

export default SidebarChatsList;
