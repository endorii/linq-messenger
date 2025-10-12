import { PlusIcon } from "@/shared/icons";
import { useSidebarStore } from "@/store/sidebarStore";
import React from "react";

function SidebarContactsPlus() {
    const { setActiveModal } = useSidebarStore();
    return (
        <div>
            <button
                className="absolute bottom-4 right-4 bg-purple-gradient rounded-xl p-[8px] cursor-pointer"
                onClick={() => setActiveModal("addContact")}
            >
                <PlusIcon className="w-[30px] stroke-white stroke-2 fill-none" />
            </button>
        </div>
    );
}

export default SidebarContactsPlus;
