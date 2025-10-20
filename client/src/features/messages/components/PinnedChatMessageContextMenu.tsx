import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/shared/components/ui/context-menu";
import { IUser } from "@/shared/interfaces";
import {
    useModalStore,
    useSelectionStore,
    useChatInputStore,
    useNavigationStore,
} from "@/store";
import dayjs from "dayjs";
import { toast } from "sonner";
import {
    useCreatePinMessage,
    useDeletePinnedMessage,
} from "../hooks/usePinnedMessages";
import { CheckBothIcon, CheckIcon, PinIcon, ReplyIcon } from "@/shared/icons";
import { IPinnedMessage } from "@/shared/interfaces/IMessage";

export function PinnedChatMessageContextMenu({
    msg,
    isPrivate,
    isAdmin,
    me,
}: {
    msg: IPinnedMessage;
    isPrivate: boolean;
    isAdmin: boolean;
    me: IUser | undefined;
}) {
    const { setActiveModal } = useModalStore();
    const { setSelectedMessage } = useSelectionStore();
    const { setChatSentType, setMessageForEdit } = useChatInputStore();
    const { setChatView } = useNavigationStore();

    const createPinMessageMutation = useCreatePinMessage();
    const deletePinnedMessageMutation = useDeletePinnedMessage();

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Copied!");
        } catch (err) {
            toast.error("Failed to copy");
            console.error(err);
        }
    };

    const handleEdit = () => {
        setChatView("messages");
        Promise.resolve().then(() => {
            setMessageForEdit(msg.message);
            setChatSentType("edit");
        });
    };

    const handlePin = () => {
        createPinMessageMutation.mutateAsync({
            chatId: msg.message.chatId,
            messageId: msg.message.id,
        });
    };

    const handleUnpin = () => {
        deletePinnedMessageMutation.mutateAsync({
            chatId: msg.message.chatId,
            messageId: msg.id,
        });
    };

    const handleDelete = () => {
        setActiveModal("deleteMessage");
    };

    return (
        <ContextMenu>
            <ContextMenuTrigger
                onContextMenu={() => setSelectedMessage(msg.message)}
                className={`px-[7px] py-[5px] pb-[0px] max-w-[500px] rounded-xl wrap-anywhere ${
                    msg.isMine
                        ? "bg-purple-gradient self-end rounded-br-none"
                        : "bg-neutral-800 self-start rounded-bl-none"
                }`}
            >
                <div>
                    {msg.message.forwardedMessageId && (
                        <div className="p-[3px]">
                            <div className="text-sm">
                                forwarded from{" "}
                                <span className="font-semibold">
                                    {
                                        msg.message.forwardedMessage?.sender
                                            .username
                                    }
                                </span>
                            </div>
                        </div>
                    )}
                    {msg.message.replyTo && (
                        <div className="px-[15px] py-[4px] bg-neutral-950/40 w-full rounded-xl border-l-4 mb-[10px]">
                            <div className="font-bold text-sm flex gap-[3px]">
                                {msg.message.replyTo?.sender.username}
                                {msg.message.replyTo?.forwardedMessageId && (
                                    <ReplyIcon className="w-[16px] fill-none stroke-white stroke-3 rotate-270" />
                                )}
                                {
                                    msg.message.replyTo.forwardedMessage?.sender
                                        .username
                                }
                            </div>
                            <div className="text-sm">
                                {msg.message.replyTo?.content}
                            </div>
                        </div>
                    )}

                    <div>
                        {msg.message.content}
                        <div className="flex gap-[3px] justify-end">
                            <div className="text-xs text-gray-400 ">
                                {msg.message.createdAt !==
                                msg.message.updatedAt ? (
                                    <div className="text-xs text-gray-400 text-right">
                                        edited
                                    </div>
                                ) : null}
                            </div>
                            <div className="flex items-center gap-[1px]">
                                {msg.message.pinnedMessages &&
                                    msg.message.pinnedMessages.length > 0 && (
                                        <div className="text-xs text-gray-400 text-right">
                                            <PinIcon className="w-[13px] pr-[2px] fill-neutral-400 stroke-1 stroke-neutral-400" />
                                        </div>
                                    )}
                                <div className="text-xs text-gray-400 text-right">
                                    {dayjs(msg.createdAt).format("HH:mm")}
                                </div>
                                {msg.message.messagesRead &&
                                msg.message.messagesRead.length >= 2 ? (
                                    <CheckBothIcon className="w-[20px] fill-none stroke-2 stroke-neutral-400" />
                                ) : (
                                    <CheckIcon className="w-[20px] fill-none stroke-2 stroke-neutral-400" />
                                )}
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
                {msg.isMine && (
                    <ContextMenuItem onClick={handleEdit}>Edit</ContextMenuItem>
                )}

                <ContextMenuItem
                    onClick={() => {
                        handleCopy(msg.message.content);
                    }}
                >
                    Copy
                </ContextMenuItem>
                {msg.message.pinnedMessages &&
                msg.message.pinnedMessages?.length > 0 &&
                (isAdmin || isPrivate) ? (
                    <ContextMenuItem
                        variant="destructive"
                        onClick={handleUnpin}
                    >
                        Unpin
                    </ContextMenuItem>
                ) : (
                    <ContextMenuItem onClick={handlePin}>Pin</ContextMenuItem>
                )}

                {(isPrivate || isAdmin || msg.message.senderId === me?.id) && (
                    <ContextMenuItem
                        variant="destructive"
                        onClick={handleDelete}
                    >
                        Delete
                    </ContextMenuItem>
                )}
            </ContextMenuContent>
        </ContextMenu>
    );
}
