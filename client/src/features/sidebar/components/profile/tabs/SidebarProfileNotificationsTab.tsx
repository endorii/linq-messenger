import SidebarProfileNotifications from "../notifications/SidebarProfileNotifications";
import SharedSidebarMenu from "@/shared/components/SharedSidebarMenu";
import { useSidebarStore } from "@/store/sidebarStore";

function SidebarProfileNotificationsTab() {
    const { setProfileTab } = useSidebarStore();
    return (
        <>
            <SharedSidebarMenu
                title={"Notifications"}
                onClose={() => setProfileTab("overview")}
            />
            <SidebarProfileNotifications />
        </>
    );
}

export default SidebarProfileNotificationsTab;
