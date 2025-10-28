"use client";

import { ButtonIcon } from "@/shared/components/ui/buttons";
import { Input } from "@/shared/components/ui/input";
import { SearchIcon, CloseIcon, BackIcon } from "@/shared/icons";
import { useNavigationStore } from "@/store";

export function SidebarContactsMenu({
    searchValue,
    setSearchValue,
}: {
    searchValue: string;
    setSearchValue: React.Dispatch<React.SetStateAction<string>>;
}) {
    const { setSidebarTab } = useNavigationStore();
    return (
        <div className="text-black dark:text-white flex gap-[20px] justify-between items-center py-[10px] px-[20px]">
            <ButtonIcon onClick={() => setSidebarTab("chats")}>
                <BackIcon className="w-[24px] stroke-neutral-900 dark:stroke-white stroke-[2.5] fill-none" />
            </ButtonIcon>

            <div className="w-full relative rounded-xl group">
                <Input
                    className="py-[10px] px-[43px] rounded-xl w-full h-auto"
                    placeholder="Contacts search"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />

                <SearchIcon className="absolute top-[50%] translate-y-[-50%] left-4 w-[20px] stroke-neutral-600 fill-none stroke-3 group-focus-within:stroke-neutral-800 dark:group-focus-within:stroke-white/70 transition-colors duration-300" />

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
                    <CloseIcon className="w-[17px] stroke-neutral-700 group-focus-within:stroke-white/70 stroke-3" />
                </button>
            </div>
        </div>
    );
}
