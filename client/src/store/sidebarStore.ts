import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ChatSidebarTabType, ModalType } from "@/shared/types/types";
import { IFolder } from "@/shared/interfaces/IFolder";
import { IUser } from "@/shared/interfaces/IUser";

interface SidebarState {
    activeModal: ModalType | null;
    selectedFolder: IFolder | null;
    chatSidebarOpened: boolean;
    chatSidebarTab: ChatSidebarTabType;
    activeSidebarFolder: string;
    selectedUser: IUser | null;
    setActiveModal: (modal: ModalType | null) => void;
    setSelectedFolder: (folder: IFolder | null) => void;
    setChatSidebarOpened: (state: boolean) => void;
    setChatSidebarTab: (chatTab: ChatSidebarTabType) => void;
    setSelectedUser: (selectedUser: IUser | null) => void;
}

export const useSidebarStore = create<SidebarState>()(
    devtools(
        (set) => ({
            activeModal: null,
            selectedFolder: null,
            chatSidebarOpened: false,
            chatSidebarTab: "info",
            activeSidebarFolder: "allChats",
            selectedUser: null,
            setActiveModal: (modal) => set({ activeModal: modal }),
            setSelectedFolder: (folder) => set({ selectedFolder: folder }),
            setChatSidebarOpened: (state) => set({ chatSidebarOpened: state }),
            setChatSidebarTab: (chatTab) => set({ chatSidebarTab: chatTab }),
            setSelectedUser: (selectedUser: IUser) => set({ selectedUser: selectedUser }),
        }),
        { name: "SidebarStore" }
    )
);
