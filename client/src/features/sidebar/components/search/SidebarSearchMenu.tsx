"use client";

import { useEffect, useRef } from "react";
import { Input } from "@/shared/components/ui/input";
import { SearchIcon, CloseIcon, BackIcon } from "@/shared/icons";
import { useNavigationStore } from "@/store";

function SidebarSearchMenu({
    searchValue,
    setSearchValue,
}: {
    searchValue: string;
    setSearchValue: React.Dispatch<React.SetStateAction<string>>;
}) {
    const { setSidebarTab } = useNavigationStore();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleClear = () => {
        setSearchValue("");
        inputRef.current?.focus();
    };

    return (
        <div className="text-white flex gap-[25px] justify-between items-center py-[10px] px-[25px]">
            <button onClick={() => setSidebarTab("chats")}>
                <BackIcon className="w-[24px] stroke-white stroke-3" />
            </button>

            <div className="w-full relative rounded-xl group">
                <Input
                    ref={inputRef}
                    className="py-[10px] px-[43px] rounded-xl w-full h-auto"
                    placeholder="Search"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />

                <SearchIcon className="absolute top-[50%] translate-y-[-50%] left-[15px] w-[20px] stroke-neutral-700 fill-none stroke-3 group-focus-within:stroke-neutral-400 transition-colors duration-300" />

                <button
                    onClick={handleClear}
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
    );
}

export default SidebarSearchMenu;
