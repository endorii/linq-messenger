import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ModalType } from "@/shared/types/types";
import { IFolder } from "@/shared/interfaces/IFolder";

interface SidebarState {
    activeModal: ModalType | null;
    selectedFolder: IFolder | null;
    setActiveModal: (modal: ModalType | null) => void;
    setSelectedFolder: (folder: IFolder | null) => void;
}

export const useSidebarStore = create<SidebarState>()(
    devtools(
        (set) => ({
            activeModal: null,
            selectedFolder: null,
            setActiveModal: (modal) => set({ activeModal: modal }),
            setSelectedFolder: (folder) => set({ selectedFolder: folder }),
        }),
        { name: "SidebarStore" }
    )
);
