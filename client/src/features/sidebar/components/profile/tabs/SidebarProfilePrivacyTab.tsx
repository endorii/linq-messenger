import { useNavigationStore } from "@/store";
import SidebarProfilePrivacy from "../privacy/SidebarProfilePrivacy";
import SharedSidebarMenu from "@/shared/components/SharedSidebarMenu";

function SidebarProfilePrivacyTab() {
    const { setProfileTab } = useNavigationStore();
    return (
        <>
            <SharedSidebarMenu
                title={"Privacy and Security"}
                onClose={() => setProfileTab("overview")}
            />
            <SidebarProfilePrivacy />
        </>
    );
}

export default SidebarProfilePrivacyTab;
