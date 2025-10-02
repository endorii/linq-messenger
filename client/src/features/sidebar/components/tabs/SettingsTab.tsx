"use client";

import { SidebarTabType } from "@/shared/types/types";
import SidebarSettings from "../SidebarSettings";
import SidebarSettingsMenu from "../SidebarSettingsMenu";

function SettingsTab({
    setActiveTab,
}: {
    setActiveTab: React.Dispatch<React.SetStateAction<SidebarTabType>>;
}) {
    return (
        <>
            <SidebarSettingsMenu setActiveTab={setActiveTab} />
            <SidebarSettings setActiveTab={setActiveTab} />
        </>
    );
}

export default SettingsTab;
