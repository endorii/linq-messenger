import SharedSidebarMenu from "@/shared/components/SharedSidebarMenu";
import SidebarEditProfile from "../edit/SidebarEditProfile";
import { useNavigationStore } from "@/store";

function SidebarEditProfileTab() {
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

export default SidebarEditProfileTab;
