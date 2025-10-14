import SharedSidebarMenu from "@/shared/components/SharedSidebarMenu";
import { useSidebarStore } from "@/store/sidebarStore";
import SidebarEditProfile from "../edit/SidebarEditProfile";

function SidebarEditProfileTab() {
    const { setProfileTab } = useSidebarStore();
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

export default SidebarEditProfileTab;
