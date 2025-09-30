"use client";

import { Input } from "@/shared/components/ui/input";
import { SearchIcon, CloseIcon, BackIcon } from "@/shared/icons";
import { SidebarTabType } from "@/shared/types/types";
import { useState } from "react";

function SidebarContactsMenu({
    setActiveTab,
}: {
    setActiveTab: React.Dispatch<React.SetStateAction<SidebarTabType>>;
}) {
    const [inputSearchContacts, setInputSearchContacts] = useState<string>("");

    return (
        <div className="text-white flex gap-[25px] justify-between items-center py-[10px] px-[25px]">
            <button onClick={() => setActiveTab("chats")}>
                <BackIcon className="w-[24px] stroke-white stroke-3" />
            </button>

            <div className="w-full relative rounded-xl group bg-transparent focus-within:bg-gradient-to-br focus-within:from-violet-600 focus-within:to-indigo-600 p-[2px] transition-all duration-300">
                <Input
                    className="py-[10px] px-[43px] rounded-xl w-full bg-neutral-900 focus:bg-neutral-950 focus:border-white border-none h-auto"
                    placeholder="Contacts search"
                    value={inputSearchContacts}
                    onChange={(e) => setInputSearchContacts(e.target.value)}
                />

                <SearchIcon className="absolute top-[50%] translate-y-[-50%] left-[15px] w-[20px] stroke-neutral-700 fill-none stroke-3 group-focus-within:stroke-neutral-400 transition-colors duration-300" />

                <button
                    onClick={() => setInputSearchContacts("")}
                    className={`absolute top-[50%] translate-y-[-50%] right-[15px] flex items-center justify-center
                            w-[24px] h-[24px] rounded-full transition-all duration-300 cursor-pointer
                            ${
                                inputSearchContacts.length > 0
                                    ? "opacity-100 scale-100"
                                    : "opacity-0 scale-0"
                            }`}
                >
                    <CloseIcon className="w-[17px] stroke-neutral-700 group-focus-within:stroke-neutral-400 stroke-3" />
                </button>
            </div>
        </div>
    );
}

export default SidebarContactsMenu;
