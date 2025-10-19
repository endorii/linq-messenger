import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { SidebarTabType, ProfileTabType } from "@/shared/types/types";

interface NavigationState {
    sidebarTab: SidebarTabType;
    profileTab: ProfileTabType;
    chatView: "messages" | "pinned";

    setSidebarTab: (tab: SidebarTabType) => void;
    setProfileTab: (tab: ProfileTabType) => void;
    setChatView: (view: "messages" | "pinned") => void;
}

export const useNavigationStore = create<NavigationState>()(
    devtools(
        (set) => ({
            sidebarTab: "chats",
            profileTab: "overview",
            chatView: "messages",

            setSidebarTab: (tab) => set({ sidebarTab: tab }),
            setProfileTab: (tab) => set({ profileTab: tab }),
            setChatView: (view) => set({ chatView: view }),
        }),
        { name: "NavigationStore" }
    )
);
