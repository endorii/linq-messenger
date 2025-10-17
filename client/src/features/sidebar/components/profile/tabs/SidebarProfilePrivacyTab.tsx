import { SharedSidebarMenu } from "@/shared/components/SharedSidebarMenu";
import { useNavigationStore } from "@/store";
import { SidebarProfilePrivacy } from "../privacy/SidebarProfilePrivacy";

export function SidebarProfilePrivacyTab() {
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
