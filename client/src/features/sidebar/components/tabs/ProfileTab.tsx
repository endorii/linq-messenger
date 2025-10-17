"use client";

import { useNavigationStore } from "@/store";
import { SidebarProfile } from "../profile/SidebarProfile";
import {
    SidebarEditProfileTab,
    SidebarProfileNotificationsTab,
    SidebarProfilePrivacyTab,
    SidebarProfileLanguageTab,
} from "../profile/tabs";

export function ProfileTab() {
    const { profileTab } = useNavigationStore();

    return (
        <>
            {profileTab === "overview" && (
                <>
                    <SidebarProfile />
                    <SidebarProfile />
                </>
            )}

            {profileTab === "edit" && <SidebarEditProfileTab />}
            {profileTab === "notifications" && (
                <SidebarProfileNotificationsTab />
            )}
            {profileTab === "privacy" && <SidebarProfilePrivacyTab />}
            {profileTab === "language" && <SidebarProfileLanguageTab />}
        </>
    );
}
