"use client";

import {
    BurgerMenuIcon,
    CloseIcon,
    PlusIcon,
    SearchIcon,
} from "@/shared/icons";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ChatItem from "./ChatItem";

function Sidebar() {
    const [searchValue, setSearchValue] = useState<string>("");

    return (
        <div className="relative bg-neutral-900 w-full max-w-[370px] h-full flex flex-col border-r border-neutral-800 ">
            <div className="text-white flex gap-[25px] justify-between items-center py-[10px] px-[25px]">
                <BurgerMenuIcon className="w-[24px] stroke-white stroke-3" />

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
                        className={`
                            absolute top-[50%] translate-y-[-50%] right-[15px] flex items-center justify-center
                            w-[24px] h-[24px] rounded-full transition-all duration-300 cursor-pointer
                            ${
                                searchValue.length > 0
                                    ? "opacity-100 scale-100"
                                    : "opacity-0 scale-0"
                            }
                        `}
                    >
                        <CloseIcon className="w-[17px] stroke-neutral-700 group-focus-within:stroke-neutral-400 stroke-3" />
                    </button>
                </div>
            </div>

            <div className="px-[10px] py-[5px]">
                <Tabs defaultValue="allChats">
                    <TabsList className="flex w-full overflow-x-auto overflow-y-hidden mb-[15px]">
                        <TabsTrigger value="allChats">All chats</TabsTrigger>
                        <TabsTrigger value="university">University</TabsTrigger>
                        <TabsTrigger value="chats">Chats</TabsTrigger>
                        <TabsTrigger value="groups">Groups</TabsTrigger>
                    </TabsList>

                    <TabsContent value="allChats">
                        <div className="flex flex-col gap-[2px] w-full">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <ChatItem key={i} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="university">
                        <div className="flex flex-col gap-[2px] w-full">
                            {Array.from({ length: 7 }).map((_, i) => (
                                <ChatItem key={i} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="chats">
                        <div className="flex flex-col gap-[2px] w-full">
                            {Array.from({ length: 2 }).map((_, i) => (
                                <ChatItem key={i} />
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="groups">
                        <div className="flex flex-col gap-[2px] w-full">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <ChatItem key={i} />
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            <DropdownMenu>
                {/* Використовуємо кастомну кнопку як тригер */}
                <DropdownMenuTrigger asChild>
                    <button className="absolute bottom-4 right-4 bg-neutral-950 rounded-xl border border-neutral-800 p-[10px]">
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
