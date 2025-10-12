import SidebarProfileLanguage from "../language/SidebarProfileLanguage";
import SharedSidebarMenu from "@/shared/components/SharedSidebarMenu";
import { useSidebarStore } from "@/store/sidebarStore";

function SidebarProfileLanguageTab() {
    const { setProfileTab } = useSidebarStore();
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

export default SidebarProfileLanguageTab;
