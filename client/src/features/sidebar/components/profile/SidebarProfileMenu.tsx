import { useLogoutUser } from "@/features/auth/hooks/useAuth";
import { ButtonIcon } from "@/shared/components/ui/buttons";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { BackIcon, EditIcon, OptionsIcon } from "@/shared/icons";
import { useNavigationStore } from "@/store";

export function SidebarSettingsMenu() {
    const { setSidebarTab, setProfileTab } = useNavigationStore();

    const logoutUserMutation = useLogoutUser();

    const handleLogout = async () => {
        setSidebarTab("chats");
        await logoutUserMutation.mutateAsync();
    };

    return (
        <div className="text-black dark:text-white flex gap-[25px] justify-between items-center py-[10px] px-[25px]">
            <div className="flex gap-[20px] justify-between items-center min-h-[50px]">
                <ButtonIcon onClick={() => setSidebarTab("chats")}>
                    <BackIcon className="w-[24px] stroke-neutral-900 dark:stroke-white stroke-[2.5] fill-none" />
                </ButtonIcon>
                <div className="text-xl font-semibold">Settings</div>
            </div>
            <div className="flex gap-[20px] justify-between items-center">
                <button className="" onClick={() => setProfileTab("edit")}>
                    <EditIcon className="w-[26px] fill-none stroke-2 stroke-neutral-900 dark:stroke-white" />
                </button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button>
                            <OptionsIcon className="w-[21px] fill-neutral-900 dark:fill-white" />
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-56">
                        <DropdownMenuItem
                            variant={"destructive"}
                            onClick={handleLogout}
                        >
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
