import { BackIcon } from "@/shared/icons";
import { SidebarTabType } from "@/shared/types/types";
import React from "react";

function SidebarSettings({
    setActiveTab,
}: {
    setActiveTab: React.Dispatch<React.SetStateAction<SidebarTabType>>;
}) {
    return (
        <div className="flex flex-col px-[10px] py-[5px] overflow-hidden">
            123
        </div>
    );
}

export default SidebarSettings;
