import { BackIcon } from "@/shared/icons";
import { useSidebarStore } from "@/store/sidebarStore";

function SidebarSettingsMenu() {
    const { setSidebarTab } = useSidebarStore();
    return (
        <div className="text-white flex gap-[25px] justify-between items-center py-[10px] px-[25px]">
            <button onClick={() => setSidebarTab("chats")}>
                <BackIcon className="w-[24px] stroke-white stroke-3" />
            </button>
        </div>
    );
}

export default SidebarSettingsMenu;
