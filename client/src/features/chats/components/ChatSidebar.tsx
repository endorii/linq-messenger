"use client";

import { IChat } from "@/shared/interfaces/IChat";
import { useState } from "react";
import { ChatSidebarTabType } from "@/shared/types/types";
import ChatSidebarInfo from "./ChatSidebarInfo";
import ChatSidebarEditContact from "./ChatSidebarEditContact";

function ChatSidebar({
    sidebarOpen,
    setSidebarOpen,
    chat,
}: {
    sidebarOpen: boolean;
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    chat: IChat;
}) {
    const [chatSidebarTab, setChatSidebarTab] =
        useState<ChatSidebarTabType>("info");

    return (
        <div
            className={`overflow-y-auto bg-neutral-950 border-l border-neutral-800 text-white transition-all duration-400 ease-in-out ${
                sidebarOpen ? "w-[450px]" : "w-0 border-none"
            }`}
        >
            {sidebarOpen &&
                (chatSidebarTab === "editContact" ? (
                    <ChatSidebarEditContact
                        chat={chat}
                        setChatSidebarTab={setChatSidebarTab}
                    />
                ) : (
                    <ChatSidebarInfo
                        chat={chat}
                        setSidebarOpen={setSidebarOpen}
                        setChatSidebarTab={setChatSidebarTab}
                    />
                ))}
        </div>
    );
}

export default ChatSidebar;
