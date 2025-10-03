"use client";

import { TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { IChatFolder } from "@/shared/interfaces/IFolder";
("");

function SidebarChatsFolders({
    folders,
}: {
    folders: IChatFolder[] | undefined;
}) {
    return (
        <>
            <TabsList className="flex w-full overflow-x-auto overflow-y-hidden mb-[5px]">
                <TabsTrigger value="allChats">All chats</TabsTrigger>
                {folders && folders.length > 0
                    ? folders.map((folder, i) => (
                          <TabsTrigger value={folder.name} key={i}>
                              {folder.name}
                          </TabsTrigger>
                      ))
                    : null}
            </TabsList>
        </>
    );
}

export default SidebarChatsFolders;
