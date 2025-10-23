import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { SidebarTabType, ProfileTabType, PrivacyTabType } from "@/shared/types/types";

interface NavigationState {
    sidebarTab: SidebarTabType;
    profileTab: ProfileTabType;
    privacyTab: PrivacyTabType;
    chatView: "messages" | "pinned";

    setSidebarTab: (tab: SidebarTabType) => void;
    setProfileTab: (tab: ProfileTabType) => void;
    setPrivacyTab: (tab: PrivacyTabType) => void;
    setChatView: (view: "messages" | "pinned") => void;
}

export const useNavigationStore = create<NavigationState>()(
    devtools(
        (set) => ({
            sidebarTab: "chats",
            profileTab: "overview",
            privacyTab: "overview",
            chatView: "messages",

            setSidebarTab: (tab) => set({ sidebarTab: tab }),
            setProfileTab: (tab) => set({ profileTab: tab }),
            setPrivacyTab: (tab) => set({ privacyTab: tab }),
            setChatView: (view) => set({ chatView: view }),
        }),
        { name: "NavigationStore" }
    )
);
