"use client";
import SidebarProfile from "../profile/SidebarProfile";
import SidebarProfileMenu from "../profile/SidebarProfileMenu";
import SidebarProfileNotificationsTab from "../profile/tabs/SidebarProfileNotificationsTab";
import SidebarProfilePrivacyTab from "../profile/tabs/SidebarProfilePrivacyTab";
import SidebarProfileLanguageTab from "../profile/tabs/SidebarProfileLanguageTab";
import SidebarEditProfileTab from "../profile/tabs/SidebarEditProfileTab";
import { useNavigationStore } from "@/store";

function ProfileTab() {
    const { profileTab } = useNavigationStore();

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
