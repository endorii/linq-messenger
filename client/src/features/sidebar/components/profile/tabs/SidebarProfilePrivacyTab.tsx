import SidebarProfilePrivacy from "../privacy/SidebarProfilePrivacy";
import SharedSidebarMenu from "@/shared/components/SharedSidebarMenu";
import { useSidebarStore } from "@/store/sidebarStore";

function SidebarProfilePrivacyTab() {
    const { setProfileTab } = useSidebarStore();
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
