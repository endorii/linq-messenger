import { PlusIcon } from "@/shared/icons";
import { ModalType } from "@/shared/types/types";
import React from "react";

function SidebarContactsPlus({
    setActiveModal,
}: {
    setActiveModal: React.Dispatch<React.SetStateAction<ModalType>>;
}) {
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
