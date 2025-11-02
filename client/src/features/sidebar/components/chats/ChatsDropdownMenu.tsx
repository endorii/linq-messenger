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
    AccountIcon,
    BurgerMenuIcon,
    LogoutIcon,
    SettingsIcon,
    ThemeIcon,
} from "@/shared/icons";
import { IUser } from "@/shared/interfaces";
import { useNavigationStore } from "@/store";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ChatsDropdownMenu({ user }: { user: IUser }) {
    const { setSidebarTab } = useNavigationStore();
    const logoutUserMutation = useLogoutUser();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleOpenProfile = () => setSidebarTab("profile");
    const handleOpenContacts = () => setSidebarTab("contacts");
    const handleOpenSettings = () => setSidebarTab("profile");
    const handleLogout = () => logoutUserMutation.mutate();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="p-[10px] hover:bg-neutral-900/5 dark:hover:bg-white/5 rounded-full">
                    <BurgerMenuIcon className="w-[24px] stroke-3 stroke-neutral-900 dark:stroke-white" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56 font-semibold">
                <DropdownMenuItem onClick={handleOpenProfile}>
                    <div className="flex items-center gap-3">
                        <img
                            src={user.avatarUrl}
                            alt="avatar"
                            className="w-[30px] h-[30px] rounded-full bg-neutral-600 object-cover"
                        />

                        <div>{user?.username}</div>
                    </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    className="group"
                    onClick={handleOpenContacts}
                >
                    <AccountIcon className="stroke-2 stroke-neutral-900 dark:stroke-white fill-none group-hover:stroke-black" />
                    <div>Contacts</div>
                </DropdownMenuItem>

                <DropdownMenuItem
                    className="group"
                    onClick={handleOpenSettings}
                >
                    <SettingsIcon className="stroke-2 stroke-neutral-900 dark:stroke-white fill-none group-hover:stroke-black" />
                    <div className="">Settings</div>
                </DropdownMenuItem>

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="group">
                        <div className="flex items-center gap-[10px]">
                            <ThemeIcon className="w-[16px] fill-neutral-900 dark:fill-white" />
                            <div>Theme</div>
                        </div>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem onClick={() => setTheme("light")}>
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">☀️</span>
                                    <span>Light</span>
                                    {mounted && theme === "light" && (
                                        <span className="ml-auto">✓</span>
                                    )}
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")}>
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">🌙</span>
                                    <span>Dark</span>
                                    {mounted && theme === "dark" && (
                                        <span className="ml-auto">✓</span>
                                    )}
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuSeparator />

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
