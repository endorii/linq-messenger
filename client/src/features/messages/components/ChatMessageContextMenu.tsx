import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/shared/components/ui/context-menu";
import { ChatEnum } from "@/shared/enums/enums";
import { IChatMember, IMessage, IUser } from "@/shared/interfaces";
import { useModalStore, useSelectionStore, useChatInputStore } from "@/store";
import dayjs from "dayjs";
import { toast } from "sonner";

export function ChatMessageContextMenu({
    msg,
    isPrivate,
    isAdmin,
    me,
}: {
    msg: IMessage;
    isPrivate: boolean;
    isAdmin: boolean;
    me: IUser | undefined;
}) {
    const { setActiveModal } = useModalStore();
    const { setSelectedMessage } = useSelectionStore();
    const { setChatSentType, setMessageForEdit } = useChatInputStore();

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Copied!");
        } catch (err) {
            toast.error("Failed to copy");
            console.error(err);
        }
    };

    return (
        <ContextMenu>
            <ContextMenuTrigger
                onContextMenu={() => setSelectedMessage(msg)}
                className={`px-[10px] py-[6px] max-w-[500px] rounded-xl wrap-anywhere ${
                    msg.isMine
                        ? "bg-purple-gradient self-end rounded-br-none"
                        : "bg-neutral-800 self-start rounded-bl-none"
                }`}
            >
                <div>
                    {msg.content}
                    <div className="flex gap-[3px] justify-end">
                        <div className="text-xs text-gray-400 ">
                            {msg.createdAt !== msg.updatedAt ? (
                                <div className="text-xs text-gray-400 text-right">
                                    edited
                                </div>
                            ) : null}
                        </div>
                        <div className="text-xs text-gray-400 text-right">
                            {dayjs(msg.createdAt).format("HH:mm")}
                        </div>
                    </div>
                </div>
            </ContextMenuTrigger>

            <ContextMenuContent className="w-[200px]">
                <ContextMenuItem className="p-0 focus:bg-transparent">
                    <div className="flex gap-2 overflow-x-auto max-w-full p-2">
                        {[
                            "👍",
                            "❤️",
                            "😂",
                            "🔥",
                            "🎉",
                            "😢",
                            "😡",
                            "🤔",
                            "🙏",
                        ].map((emoji) => (
                            <button
                                key={emoji}
                                className="text-2xl hover:scale-110 transition-transform flex-shrink-0"
                                onClick={() =>
                                    console.log("Clicked emoji:", emoji)
                                }
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem>Reply</ContextMenuItem>
                {msg.isMine && (
                    <ContextMenuItem
                        onClick={() => {
                            setMessageForEdit(msg);
                            setChatSentType("edit");
                        }}
                    >
                        Edit
                    </ContextMenuItem>
                )}
                <ContextMenuItem
                    onClick={() => {
                        handleCopy(msg.content);
                    }}
                >
                    Copy
                </ContextMenuItem>
                <ContextMenuItem>Pin</ContextMenuItem>
                <ContextMenuItem>Forward</ContextMenuItem>
                <ContextMenuItem>Select</ContextMenuItem>
                {(isPrivate || isAdmin || msg.senderId === me?.id) && (
                    <ContextMenuItem
                        variant="destructive"
                        onClick={() => {
                            setActiveModal("deleteMessage");
                        }}
                    >
                        Delete
                    </ContextMenuItem>
                )}
            </ContextMenuContent>
        </ContextMenu>
    );
}
