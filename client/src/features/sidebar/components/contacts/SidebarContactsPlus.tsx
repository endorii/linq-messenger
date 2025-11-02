import { PlusIcon } from "@/shared/icons";
import { useModalStore } from "@/store";

export function SidebarContactsPlus() {
    const { setActiveModal } = useModalStore();
    return (
        <button
            className="absolute bottom-4 right-4 bg-theme-gradient rounded-xl p-[8px] cursor-pointer"
            onClick={() => setActiveModal("addContact")}
        >
            <PlusIcon className="w-[30px] stroke-white stroke-2 fill-none" />
        </button>
    );
}
