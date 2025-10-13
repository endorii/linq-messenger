"use client";

import { useFolders } from "@/features/folders/hooks/useFolders";
import SidebarChatsFolders from "./SidebarChatsFolders";
import { Tabs } from "@/shared/components/ui/tabs";
import SidebarChatsList from "./SidebarChatsList";
import { useState } from "react";

function SidebarChats() {
    const [activeTab, setActiveTab] = useState<string>("allChats");

    const { data: folders, isPending: isFoldersPending } = useFolders();

    return (
        <div className="flex flex-col px-[10px] py-[5px] overflow-hidden">
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                defaultValue="allChats"
                className="flex-1 flex flex-col overflow-hidden"
            >
                <SidebarChatsFolders folders={folders} />
                <SidebarChatsList folders={folders} activeTab={activeTab} />
            </Tabs>
        </div>
    );
}

export default SidebarChats;
