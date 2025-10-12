import { BackIcon, EditIcon, OptionsIcon } from "@/shared/icons";
import { useSidebarStore } from "@/store/sidebarStore";

function SidebarSettingsMenu() {
    const { setSidebarTab } = useSidebarStore();
    return (
        <div className="text-white flex gap-[25px] justify-between items-center py-[10px] px-[25px]">
            <div className="flex gap-[20px] justify-between items-center min-h-[50px]">
                <button onClick={() => setSidebarTab("chats")}>
                    <BackIcon className="w-[24px] stroke-white stroke-3" />
                </button>
                <div className="text-xl font-semibold">Settings</div>
            </div>
            <div className="flex gap-[20px] justify-between items-center">
                <button className="">
                    <EditIcon className="w-[26px] fill-none stroke-2 stroke-white" />
                </button>
                <button>
                    <OptionsIcon className="w-[21px] fill-white" />
                </button>
            </div>
        </div>
    );
}

export default SidebarSettingsMenu;
