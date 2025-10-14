"use client";
import { useSidebarStore } from "@/store/sidebarStore";
import SidebarProfile from "../profile/SidebarProfile";
import SidebarProfileMenu from "../profile/SidebarProfileMenu";
import SidebarProfileNotificationsTab from "../profile/tabs/SidebarProfileNotificationsTab";
import SidebarProfilePrivacyTab from "../profile/tabs/SidebarProfilePrivacyTab";
import SidebarProfileLanguageTab from "../profile/tabs/SidebarProfileLanguageTab";
import SidebarEditProfileTab from "../profile/tabs/SidebarEditProfileTab";

function ProfileTab() {
    const { profileTab } = useSidebarStore();

    return (
        <>
            {profileTab === "overview" && (
                <>
                    <SidebarProfileMenu />
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

export default ProfileTab;
