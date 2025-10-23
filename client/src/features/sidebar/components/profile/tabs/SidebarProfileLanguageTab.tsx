import { SharedSidebarMenu } from "@/shared/components/SharedSidebarMenu";
import { useNavigationStore } from "@/store";
import { SidebarProfileLanguage } from "../components/SidebarProfileLanguage";

export function SidebarProfileLanguageTab() {
    const { setProfileTab } = useNavigationStore();
    return (
        <>
            <SharedSidebarMenu
                title={"Language"}
                onClose={() => setProfileTab("overview")}
            />
            <SidebarProfileLanguage />
        </>
    );
}
