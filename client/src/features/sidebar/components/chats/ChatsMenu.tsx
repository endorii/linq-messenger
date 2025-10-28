"use client";

import { Input } from "@/shared/components/ui/input";
import { SearchIcon } from "@/shared/icons";
import { IUser } from "@/shared/interfaces";
import { useNavigationStore } from "@/store";
import { ChatsDropdownMenu } from "./ChatsDropdownMenu";

export function ChatsMenu({ user }: { user: IUser }) {
    const { setSidebarTab } = useNavigationStore();

    const handleOpenSearch = () => setSidebarTab("search");

    return (
        <div className="flex items-center justify-between gap-[20px] py-[10px] px-[20px] text-black dark:text-white">
            <ChatsDropdownMenu user={user} />

            <div className="relative w-full group">
                <Input
                    placeholder="Search"
                    onClick={handleOpenSearch}
                    className="w-full h-auto py-[10px] px-[43px]"
                />

                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 stroke-[3] stroke-neutral-600 fill-none transition-colors duration-300 group-focus-within:stroke-neutral-800 dark:group-focus-within:stroke-white/70" />
            </div>
        </div>
    );
}
