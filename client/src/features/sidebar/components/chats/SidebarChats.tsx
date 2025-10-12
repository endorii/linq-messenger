"use client";

import { useChats } from "@/features/chats/hooks/useChats";
import { useFolders } from "@/features/folders/hooks/useFolders";
import SidebarChatsFolders from "./SidebarChatsFolders";
import { Tabs } from "@/shared/components/ui/tabs";
import SidebarChatsList from "./SidebarChatsList";

function SidebarChats() {
    const { data: chats, isPending: isChatsPending } = useChats();
    const { data: folders, isPending: isFoldersPending } = useFolders();

    return (
        <div className="flex flex-col px-[10px] py-[5px] overflow-hidden">
            <Tabs
                defaultValue="allChats"
                className="flex-1 flex flex-col overflow-hidden"
            >
                <SidebarChatsFolders folders={folders} />
                <SidebarChatsList folders={folders} chats={chats} />
            </Tabs>
        </div>
    );
}

export default SidebarChats;
