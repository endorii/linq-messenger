import { CloseIcon, CopyIcon, ReplyIcon, TrashIcon } from "@/shared/icons";
import { useSelectionStore } from "@/store";

export function ChatSelectedMessagesPanel() {
    const { selectedMessages, clearSelectedMessages } = useSelectionStore();
    return (
        <div className="w-full px-[15%] flex items-center gap-[10px] justify-center py-[15px] bg-transparent ">
            <div className="flex justify-between items-center gap-[20px] px-[20px] p-[10px] min-h-[48px] bg-neutral-950 border-2 border-neutral-800 w-auto  rounded-xl">
                <div className="flex gap-[20px]">
                    <button
                        onClick={() => {
                            clearSelectedMessages();
                        }}
                    >
                        <CloseIcon className="w-[20px] fill-none stroke-3 stroke-white" />
                    </button>
                    <div className="font-semibold">
                        {selectedMessages.length} Messsages Selected
                    </div>
                </div>
                <div className="flex gap-[20px]">
                    <button>
                        <ReplyIcon className="rotate-270 w-[25px] fill-none stroke-3 stroke-white" />
                    </button>
                    <button>
                        <CopyIcon className="w-[30px] fill-white stroke-white" />
                    </button>
                    <button>
                        <TrashIcon className="w-[25px] fill-none stroke-[2.5] stroke-white" />
                    </button>
                </div>
            </div>
        </div>
    );
}
