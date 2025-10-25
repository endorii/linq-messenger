import { ChatEnum } from "@/shared/enums/enums";
import { CloseIcon, CopyIcon, ReplyIcon, TrashIcon } from "@/shared/icons";
import { IChat, IUser } from "@/shared/interfaces";
import { useModalStore, useSelectionStore } from "@/store";

export function ChatSelectedMessagesPanel({
    chat,
    me,
}: {
    chat: IChat;
    me: IUser;
}) {
    const { selectedMessages, clearSelectedMessages } = useSelectionStore();
    const { setActiveModal } = useModalStore();

    const handleClearSelect = () => {
        clearSelectedMessages();
    };

    const handleForward = () => {
        setActiveModal("forwardMessages");
    };

    const handleDelete = () => {
        setActiveModal("deleteMessages");
    };

    return (
        <div className="w-full px-[15%] flex items-center gap-[10px] justify-center py-[15px] bg-transparent ">
            <div className="flex justify-between items-center gap-[100px] px-[20px] min-h-[48px] dark:bg-neutral-950 border-2 border-neutral-300 dark:border-neutral-800 w-auto rounded-xl">
                <div className="flex gap-[20px]">
                    <button onClick={handleClearSelect}>
                        <CloseIcon className="w-[20px] fill-none stroke-3 stroke-neutral-900 dark:stroke-white" />
                    </button>
                    <div className="font-semibold">
                        {selectedMessages.length} Messsages Selected
                    </div>
                </div>
                <div className="flex gap-[10px]">
                    <button onClick={handleForward}>
                        <ReplyIcon className="rotate-270 w-[25px] fill-none stroke-3 stroke-neutral-900 dark:stroke-white" />
                    </button>
                    {(chat.type === ChatEnum.PRIVATE ||
                        (chat.type === ChatEnum.GROUP &&
                            chat.adminId === me.id) ||
                        (chat.type === ChatEnum.CHANNEL &&
                            chat.adminId === me.id)) && (
                        <button onClick={handleDelete}>
                            <TrashIcon className="w-[25px] fill-none stroke-[2.5] stroke-red-600" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
