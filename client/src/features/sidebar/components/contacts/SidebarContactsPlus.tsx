import { PlusIcon } from "@/shared/icons";
import { useModalStore } from "@/store";
import React from "react";

export function SidebarContactsPlus() {
    const { setActiveModal } = useModalStore();
    return (
        <button
            className="absolute bottom-4 right-4 bg-theme-gradient rounded-xl p-[8px] cursor-pointer"
            onClick={() => setActiveModal("addContact")}
        >
            <PlusIcon className="w-[30px] stroke-neutral-900 dark:stroke-white stroke-2 fill-none" />
        </button>
    );
}
