import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ChatSidebarTabType } from "@/shared/types/types";

interface ChatSidebarState {
    chatSidebarOpened: boolean;
    chatSidebarTab: ChatSidebarTabType;
    setChatSidebarOpened: (state: boolean) => void;
    setChatSidebarTab: (tab: ChatSidebarTabType) => void;
}

export const useChatSidebarStore = create<ChatSidebarState>()(
    devtools(
        (set) => ({
            chatSidebarOpened: false,
            chatSidebarTab: "info",
            setChatSidebarOpened: (state) => set({ chatSidebarOpened: state }),
            setChatSidebarTab: (tab) => set({ chatSidebarTab: tab }),
        }),
        { name: "ChatSidebarStore" }
    )
);
