import { useNavigationStore } from "@/store";
import SidebarProfileLanguage from "../language/SidebarProfileLanguage";
import SharedSidebarMenu from "@/shared/components/SharedSidebarMenu";

function SidebarProfileLanguageTab() {
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

export default SidebarProfileLanguageTab;
