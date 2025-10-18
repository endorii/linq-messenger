import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/shared/components/ui/context-menu";
import { IMessage, IUser } from "@/shared/interfaces";
import { useModalStore, useSelectionStore, useChatInputStore } from "@/store";
import dayjs from "dayjs";
import { toast } from "sonner";
import { useTogglePinMessage } from "../hooks/usePinnedMessages";
import { CheckIcon, MuteIcon, PinIcon } from "@/shared/icons";

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
    const { setChatSentType, setMessageForEdit, setMessageForReply } =
        useChatInputStore();

    const togglePinMessageMutation = useTogglePinMessage();

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
                className={`px-[7px] py-[5px] max-w-[500px] rounded-xl wrap-anywhere ${
                    msg.isMine
                        ? "bg-purple-gradient self-end rounded-br-none"
                        : "bg-neutral-800 self-start rounded-bl-none"
                }`}
            >
                <div>
                    {msg?.replyTo && (
                        <div className="px-[15px] py-[4px] bg-neutral-950/40 w-full rounded-xl border-l-4 mb-[10px]">
                            <div className="font-bold text-sm">
                                {msg?.replyTo?.sender.username}
                            </div>
                            <div className="text-sm">
                                {msg?.replyTo?.content}
                            </div>
                        </div>
                    )}

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
                            <div className="flex items-center gap-[3px]">
                                {msg?.pinnedMessages &&
                                    msg?.pinnedMessages?.length > 0 && (
                                        <div className="text-xs text-gray-400 text-right">
                                            <PinIcon className="w-[13px] fill-neutral-400 stroke-1 stroke-neutral-400" />
                                        </div>
                                    )}
                                <div className="text-xs text-gray-400 text-right">
                                    {dayjs(msg.createdAt).format("HH:mm")}
                                </div>
                            </div>
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
                <ContextMenuItem
                    onClick={() => {
                        setMessageForReply(msg);
                        setChatSentType("reply");
                    }}
                >
                    Reply
                </ContextMenuItem>
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
                {
                    <ContextMenuItem
                        onClick={() => {
                            togglePinMessageMutation.mutateAsync({
                                chatId: msg.chatId,
                                messageId: msg.id,
                            });
                        }}
                    >
                        Pin
                    </ContextMenuItem>
                }
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
