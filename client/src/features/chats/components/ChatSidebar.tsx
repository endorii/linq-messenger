"use client";

import { IChat } from "@/shared/interfaces/IChat";
import ChatSidebarInfo from "./ChatSidebarInfo";
import ChatSidebarEditContact from "./ChatSidebarEditContact";
import ChatSidebarEditChat from "./ChatSidebarEditChat";
import { useChatSidebarStore } from "@/store";

function ChatSidebar({ chat }: { chat: IChat }) {
    const { chatSidebarOpened, chatSidebarTab } = useChatSidebarStore();

    return (
        <div
            className={`overflow-y-auto bg-neutral-950 border-l border-neutral-800 text-white transition-all duration-400 ease-in-out relative ${
                chatSidebarOpened ? "w-[450px]" : "w-0 border-none"
            }`}
        >
            {chatSidebarOpened &&
                (chatSidebarTab === "editContact" ? (
                    <ChatSidebarEditContact chat={chat} />
                ) : chatSidebarTab === "editChat" ? (
                    <ChatSidebarEditChat chat={chat} />
                ) : (
                    <ChatSidebarInfo chat={chat} />
                ))}
        </div>
    );
}

export default ChatSidebar;
