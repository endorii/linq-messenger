import { BackIcon } from "@/shared/icons";
import { SidebarTabType } from "@/shared/types/types";
import React from "react";

function SidebarSettingsMenu({
    setActiveTab,
}: {
    setActiveTab: React.Dispatch<React.SetStateAction<SidebarTabType>>;
}) {
    return (
        <div className="text-white flex gap-[25px] justify-between items-center py-[10px] px-[25px]">
            <button onClick={() => setActiveTab("chats")}>
                <BackIcon className="w-[24px] stroke-white stroke-3" />
            </button>
        </div>
    );
}

export default SidebarSettingsMenu;
