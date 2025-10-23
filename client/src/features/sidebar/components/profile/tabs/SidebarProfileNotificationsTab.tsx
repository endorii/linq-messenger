import { useNavigationStore } from "@/store";
import { SidebarProfileNotifications } from "../components/SidebarProfileNotifications";
import { SharedSidebarMenu } from "@/shared/components/SharedSidebarMenu";

export function SidebarProfileNotificationsTab() {
    const { setProfileTab } = useNavigationStore();
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
