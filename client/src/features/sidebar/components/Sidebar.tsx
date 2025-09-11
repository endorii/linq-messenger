"use client";

import {
    AccountIcon,
    BurgerMenuIcon,
    CloseIcon,
    OptionsIcon,
    PlusIcon,
    SearchIcon,
    SettingsIcon,
    ThemeIcon,
} from "@/shared/icons";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "@/components/ui/dropdown-menu";
import ChatItem from "./ChatItem";

function Sidebar() {
    const [searchValue, setSearchValue] = useState<string>("");

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
                            <div>account name</div>
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

            <div className="flex-1 flex flex-col px-[10px] py-[5px] overflow-hidden">
                <Tabs
                    defaultValue="allChats"
                    className="flex-1 flex flex-col overflow-hidden"
                >
                    <TabsList className="flex w-full overflow-x-auto overflow-y-hidden mb-[5px]">
                        <TabsTrigger value="allChats">All chats</TabsTrigger>
                        <TabsTrigger value="university">University</TabsTrigger>
                        <TabsTrigger value="chats">Chats</TabsTrigger>
                        <TabsTrigger value="groups">Groups</TabsTrigger>
                    </TabsList>

                    <div className="flex-1 overflow-y-auto">
                        <TabsContent value="allChats" className="h-full">
                            <div className="flex flex-col gap-[2px] w-full">
                                {Array.from({ length: 30 }).map((_, i) => (
                                    <ChatItem key={i} />
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="university" className="h-full">
                            <div className="flex flex-col gap-[2px] w-full">
                                {Array.from({ length: 20 }).map((_, i) => (
                                    <ChatItem key={i} />
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="chats" className="h-full">
                            <div className="flex flex-col gap-[2px] w-full">
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <ChatItem key={i} />
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="groups" className="h-full">
                            <div className="flex flex-col gap-[2px] w-full">
                                {Array.from({ length: 50 }).map((_, i) => (
                                    <ChatItem key={i} />
                                ))}
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="absolute bottom-4 right-4 bg-neutral-950 rounded-xl border border-neutral-800 hover:bg-neutral-600 p-[10px] cursor-pointer">
                        <PlusIcon className="w-[30px] stroke-white stroke-2 fill-none" />
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56">
                    <DropdownMenuItem>New channel</DropdownMenuItem>
                    <DropdownMenuItem>New group</DropdownMenuItem>
                    <DropdownMenuItem>Add contact</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

export default Sidebar;
