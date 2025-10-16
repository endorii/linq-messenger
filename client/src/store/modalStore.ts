import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ModalType } from "@/shared/types/types";

interface ModalState {
    activeModal: ModalType | null;
    setActiveModal: (modal: ModalType | null) => void;
}

export const useModalStore = create<ModalState>()(
    devtools(
        (set) => ({
            activeModal: null,
            setActiveModal: (modal) => set({ activeModal: modal }),
        }),
        { name: "ModalStore" }
    )
);
