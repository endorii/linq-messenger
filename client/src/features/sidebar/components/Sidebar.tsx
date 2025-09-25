"use client";

import {
    AccountIcon,
    BurgerMenuIcon,
    CloseIcon,
    LogoutIcon,
    OptionsIcon,
    PlusIcon,
    SearchIcon,
    SettingsIcon,
    ThemeIcon,
} from "@/shared/icons";
import { useState } from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/shared/components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import ChatItem from "./ChatItem";
import CreateNewChannel from "../modals/CreateNewChannel";
import { ModalType } from "@/shared/types/types";
import CreateNewGroup from "../modals/CreateNewGroup";
import AddContact from "../modals/AddContact";
import { IUser } from "@/shared/interfaces/IUser";
import { useLogoutUser } from "@/features/auth/hooks/useAuth";
import { useAllChats } from "../hooks/useChats";
import { IChat } from "@/shared/interfaces/IChat";
import AddFolder from "../modals/AddFolder";
import { useAllFolders } from "../hooks/useFolders";

function Sidebar({ user }: { user: IUser | undefined }) {
    const [searchValue, setSearchValue] = useState<string>("");
    const [activeModal, setActiveModal] = useState<ModalType>(null);

    const useLogoutUserMutation = useLogoutUser();
    const { data: chats, isLoading: isChatsLoading } = useAllChats();
    const { data: folders, isLoading: isFoldersLoading } = useAllFolders();

    return (
        <div className="relative bg-neutral-900 w-full max-w-[370px] h-full flex flex-col border-r border-neutral-800">
            <div className="text-white flex gap-[25px] justify-between items-center py-[10px] px-[25px]">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button>
                            <BurgerMenuIcon className="w-[24px] stroke-white stroke-3" />
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-56 font-semibold">
                        <DropdownMenuItem>
                            <div className="w-[30px] h-[30px] bg-neutral-600 rounded-full"></div>
                            <div>{user?.username}</div>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-neutral-800" />
                        <DropdownMenuItem className="group">
                            <AccountIcon className="stroke-2 stroke-white group-hover:stroke-black fill-none" />
                            <div>Contacts</div>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="group">
                            <SettingsIcon className="stroke-2 stroke-white group-hover:stroke-black fill-none" />
                            <div>Settings</div>
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="group">
                                <div className="flex gap-[10px] items-center">
                                    <OptionsIcon className="w-[16px] fill-white group-focus:fill-black" />
                                    <div>More</div>
                                </div>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem>
                                        <ThemeIcon className="stroke-2 stroke-black group-hover:stroke-white fill-none" />
                                        <div>Change theme</div>
                                    </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuItem
                            className="group"
                            onClick={() => {
                                useLogoutUserMutation.mutate();
                            }}
                        >
                            <LogoutIcon className="stroke-2 stroke-white group-hover:stroke-black fill-none" />
                            <div>Logout</div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="w-full relative border border-neutral-700 rounded-xl group focus-within:border-neutral-400 transition-all duration-300">
                    <input
                        type="text"
                        className="outline-0 p-[10px] px-[43px] rounded-xl w-full bg-transparent"
                        placeholder="Search"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />

                    <SearchIcon className="absolute top-[50%] translate-y-[-50%] left-[15px] w-[20px] stroke-neutral-700 fill-none stroke-3 group-focus-within:stroke-neutral-400 transition-colors duration-300" />

                    <button
                        onClick={() => setSearchValue("")}
                        className={`absolute top-[50%] translate-y-[-50%] right-[15px] flex items-center justify-center
                            w-[24px] h-[24px] rounded-full transition-all duration-300 cursor-pointer
                            ${
                                searchValue.length > 0
                                    ? "opacity-100 scale-100"
                                    : "opacity-0 scale-0"
                            }`}
                    >
                        <CloseIcon className="w-[17px] stroke-neutral-700 group-focus-within:stroke-neutral-400 stroke-3" />
                    </button>
                </div>
            </div>

            {chats && chats.length > 0 ? (
                <div className="flex-1 flex flex-col px-[10px] py-[5px] overflow-hidden">
                    <Tabs
                        defaultValue="allChats"
                        className="flex-1 flex flex-col overflow-hidden"
                    >
                        <TabsList className="flex w-full overflow-x-auto overflow-y-hidden mb-[5px]">
                            <TabsTrigger value="allChats">
                                All chats
                            </TabsTrigger>
                            {folders && folders.length > 0
                                ? folders.map((folder, i) => (
                                      <TabsTrigger value={folder.name} key={i}>
                                          {folder.name}
                                      </TabsTrigger>
                                  ))
                                : null}
                        </TabsList>

                        <div className="flex-1 overflow-y-auto">
                            <TabsContent value="allChats" className="h-full">
                                <div className="flex flex-col gap-[2px] w-full">
                                    {chats.map((chat: IChat, i: number) => (
                                        <ChatItem chat={chat} key={i} />
                                    ))}
                                </div>
                            </TabsContent>
                            {folders && folders.length > 0
                                ? folders.map((folder, i) => (
                                      <TabsContent value={folder.name} key={i}>
                                          <div className="flex flex-col gap-[2px] w-full">
                                              {folder.chats.map(
                                                  (chat, i: number) => (
                                                      <ChatItem
                                                          chat={chat}
                                                          key={i}
                                                      />
                                                  )
                                              )}
                                          </div>
                                      </TabsContent>
                                  ))
                                : null}
                        </div>
                    </Tabs>
                </div>
            ) : null}

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="absolute bottom-4 right-4 bg-neutral-950 rounded-xl border border-neutral-800 hover:bg-neutral-600 p-[10px] cursor-pointer">
                        <PlusIcon className="w-[30px] stroke-white stroke-2 fill-none" />
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56">
                    <DropdownMenuItem
                        onClick={() => setActiveModal("addFolder")}
                    >
                        New folder
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-neutral-800" />
                    <DropdownMenuItem
                        onClick={() => setActiveModal("addNewChannel")}
                    >
                        New channel
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setActiveModal("addNewGroup")}
                    >
                        New group
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setActiveModal("addContact")}
                    >
                        Add contact
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AddFolder
                isOpen={activeModal === "addFolder"}
                onClose={() => setActiveModal(null)}
            />
            <CreateNewChannel
                isOpen={activeModal === "addNewChannel"}
                onClose={() => setActiveModal(null)}
            />
            <CreateNewGroup
                isOpen={activeModal === "addNewGroup"}
                onClose={() => setActiveModal(null)}
            />
            <AddContact
                isOpen={activeModal === "addContact"}
                onClose={() => setActiveModal(null)}
            />
        </div>
    );
}

export default Sidebar;
