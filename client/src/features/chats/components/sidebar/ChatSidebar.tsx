"use client";

import { IChat } from "@/shared/interfaces";
import { useChatSidebarStore } from "@/store";
import { ChatInfo, EditChat, EditContact } from "./components";

export function ChatSidebar({ chat }: { chat: IChat }) {
    const { chatSidebarOpened, chatSidebarTab } = useChatSidebarStore();

    return (
        <div
            className={`overflow-y-auto bg-neutral-100 dark:bg-neutral-950 border-l border-neutral-300 dark:border-neutral-300 dark:border-neutral-800 text-black dark:text-white transition-all duration-400 ease-in-out relative ${
                chatSidebarOpened ? "w-[450px]" : "w-0 border-none"
            }`}
        >
            {chatSidebarOpened &&
                (chatSidebarTab === "editContact" ? (
                    <EditContact chat={chat} />
                ) : chatSidebarTab === "editChat" ? (
                    <EditChat chat={chat} />
                ) : (
                    <ChatInfo chat={chat} />
                ))}
        </div>
    );
}
