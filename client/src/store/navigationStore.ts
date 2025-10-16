import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { SidebarTabType, ProfileTabType } from "@/shared/types/types";

interface NavigationState {
    sidebarTab: SidebarTabType;
    profileTab: ProfileTabType;
    setSidebarTab: (tab: SidebarTabType) => void;
    setProfileTab: (tab: ProfileTabType) => void;
}

export const useNavigationStore = create<NavigationState>()(
    devtools(
        (set) => ({
            sidebarTab: "chats",
            profileTab: "overview",
            setSidebarTab: (tab) => set({ sidebarTab: tab }),
            setProfileTab: (tab) => set({ profileTab: tab }),
        }),
        { name: "NavigationStore" }
    )
);
