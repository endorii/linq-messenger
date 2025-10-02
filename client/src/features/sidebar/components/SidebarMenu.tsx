"use client";

import { useLogoutUser } from "@/features/auth/hooks/useAuth";
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
import { Input } from "@/shared/components/ui/input";
import {
    BurgerMenuIcon,
    AccountIcon,
    OptionsIcon,
    ThemeIcon,
    LogoutIcon,
    CloseIcon,
    SettingsIcon,
    SearchIcon,
} from "@/shared/icons";
import { IUser } from "@/shared/interfaces/IUser";
import { SidebarTabType } from "@/shared/types/types";

function SidebarMenu({
    user,
    searchValue,
    setSearchValue,
    setActiveTab,
}: {
    user: IUser;
    searchValue: string;
    setSearchValue: React.Dispatch<React.SetStateAction<string>>;
    activeTab: SidebarTabType;
    setActiveTab: React.Dispatch<React.SetStateAction<SidebarTabType>>;
}) {
    const useLogoutUserMutation = useLogoutUser();
    return (
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
                    <DropdownMenuSeparator className="bg-neutral-700" />
                    <DropdownMenuItem
                        className="group"
                        onClick={() => setActiveTab("contacts")}
                    >
                        <AccountIcon className="stroke-2 stroke-white group-hover:stroke-black fill-none" />
                        <div>Contacts</div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="group"
                        onClick={() => setActiveTab("settings")}
                    >
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
                        variant="destructive"
                        className="group"
                        onClick={() => {
                            useLogoutUserMutation.mutate();
                        }}
                    >
                        <LogoutIcon className="stroke-2 stroke-red-600 fill-none" />
                        <div>Logout</div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <div className="w-full relative rounded-xl group">
                <Input
                    className="py-[10px] px-[43px] rounded-xl w-full h-auto"
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
    );
}

export default SidebarMenu;
