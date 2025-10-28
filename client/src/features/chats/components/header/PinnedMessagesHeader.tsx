"use client";

import { ButtonIcon } from "@/shared/components/ui/buttons";
import { BackIcon } from "@/shared/icons";
import { IChat } from "@/shared/interfaces/IChat";
import { useNavigationStore } from "@/store";

export function PinnedMessagesHeader({ chat }: { chat: IChat }) {
    const { setChatView } = useNavigationStore();

    const handleSetChatView = (view: "pinned" | "messages") => {
        setChatView(view);
    };

    return (
        <div className="absolute top-0 w-full h-[65px] z-10 flex justify-between items-center text-black dark:text-white bg-neutral-100 border-b border-neutral-200 dark:border-neutral-800 dark:bg-neutral-950 px-[20px] py-[10px] pr-[50px]">
            <div className="flex items-center gap-[20px]">
                <ButtonIcon onClick={() => handleSetChatView("messages")}>
                    <BackIcon className="w-[24px] stroke-neutral-900 dark:stroke-white stroke-[2.5] fill-none" />
                </ButtonIcon>

                <div className="text-xl font-semibold">
                    {chat.pinnedMessages.length} Pinned Messages
                </div>
            </div>
        </div>
    );
}
