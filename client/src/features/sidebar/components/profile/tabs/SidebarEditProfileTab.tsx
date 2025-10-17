import { SharedSidebarMenu } from "@/shared/components/SharedSidebarMenu";
import { useNavigationStore } from "@/store";
import { SidebarEditProfile } from "../edit/SidebarEditProfile";

export function SidebarEditProfileTab() {
    const { setProfileTab } = useNavigationStore();
    return (
        <>
            <SharedSidebarMenu
                title={"Edit Profile"}
                onClose={() => setProfileTab("overview")}
            />
            <SidebarEditProfile />
        </>
    );
}
