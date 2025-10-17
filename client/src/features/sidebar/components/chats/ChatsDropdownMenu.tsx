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
import {
    BurgerMenuIcon,
    AccountIcon,
    OptionsIcon,
    ThemeIcon,
    LogoutIcon,
    SettingsIcon,
} from "@/shared/icons";
import { IUser } from "@/shared/interfaces";
import { useNavigationStore } from "@/store";

export function ChatsDropdownMenu({ user }: { user: IUser }) {
    const { setSidebarTab } = useNavigationStore();
    const logoutUserMutation = useLogoutUser();

    const handleOpenProfile = () => setSidebarTab("profile");
    const handleOpenContacts = () => setSidebarTab("contacts");
    const handleOpenSettings = () => setSidebarTab("profile");
    const handleChangeTheme = () => {
        // TODO: реалізувати зміну теми
    };
    const handleLogout = () => logoutUserMutation.mutate();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button>
                    <BurgerMenuIcon className="w-[24px] stroke-3 stroke-white" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56 font-semibold">
                <DropdownMenuItem onClick={handleOpenProfile}>
                    <div className="flex items-center gap-3">
                        <div className="w-[30px] h-[30px] overflow-hidden rounded-full bg-neutral-600">
                            <img
                                src={user.avatarUrl}
                                alt="avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>{user?.username}</div>
                    </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-neutral-700" />

                <DropdownMenuItem
                    className="group"
                    onClick={handleOpenContacts}
                >
                    <AccountIcon className="stroke-2 stroke-white fill-none group-hover:stroke-black" />
                    <div>Contacts</div>
                </DropdownMenuItem>

                <DropdownMenuItem
                    className="group"
                    onClick={handleOpenSettings}
                >
                    <SettingsIcon className="stroke-2 stroke-white fill-none group-hover:stroke-black" />
                    <div>Settings</div>
                </DropdownMenuItem>

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="group">
                        <div className="flex items-center gap-[10px]">
                            <OptionsIcon className="w-[16px] fill-white group-focus:fill-black" />
                            <div>More</div>
                        </div>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem onClick={handleChangeTheme}>
                                <ThemeIcon className="stroke-2 stroke-black fill-none group-hover:stroke-white" />
                                <div>Change theme</div>
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuSeparator className="bg-neutral-700" />

                <DropdownMenuItem
                    variant="destructive"
                    className="group"
                    onClick={handleLogout}
                >
                    <LogoutIcon className="stroke-2 stroke-red-600 fill-none" />
                    <div>Logout</div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
