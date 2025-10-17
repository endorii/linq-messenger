"use client";

import { useFolders } from "@/features/folders/hooks/useFolders";
import { useState } from "react";
import { SidebarChatsFolders } from "./SidebarChatsFolders";
import { SidebarChatsList } from "./SidebarChatsList";
import { Tabs } from "@/shared/components/ui/tabs";

export function SidebarChats() {
    const [activeTab, setActiveTab] = useState<string>("allChats");

    const { data: folders = [], isPending: isFoldersPending } = useFolders();

    return (
        <div className="flex flex-col px-[10px] py-[5px] overflow-hidden ">
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                defaultValue="allChats"
                className="flex-1 flex flex-col overflow-hidden"
            >
                <SidebarChatsFolders
                    folders={folders}
                    isFoldersPending={isFoldersPending}
                />
                <SidebarChatsList
                    folders={folders}
                    isFoldersPending={isFoldersPending}
                    activeTab={activeTab}
                />
            </Tabs>
        </div>
    );
}
