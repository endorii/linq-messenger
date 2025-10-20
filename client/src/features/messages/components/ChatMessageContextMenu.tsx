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

import { CheckBothIcon, CheckIcon, PinIcon, ReplyIcon } from "@/shared/icons";
import {
    useCreatePinMessage,
    useDeletePinnedMessage,
} from "../hooks/usePinnedMessages";

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
        setMessageForEdit(msg);
        setChatSentType("edit");
    };

    const handleReply = () => {
        setMessageForReply(msg);
        setChatSentType("reply");
    };

    const handlePin = () => {
        createPinMessageMutation.mutateAsync({
            chatId: msg.chatId,
            messageId: msg.id,
        });
    };

    const handleUnpin = () => {
        if (!msg.pinnedMessages || msg.pinnedMessages.length < 0) return;

        deletePinnedMessageMutation.mutateAsync({
            chatId: msg.chatId,
            messageId: msg.pinnedMessages[0].id,
        });
    };

    const handleForward = () => {
        setActiveModal("forwardMessage");
        setSelectedMessage(msg);
    };

    const handleDelete = () => {
        setActiveModal("deleteMessage");
    };

    return (
        <ContextMenu>
            <ContextMenuTrigger
                onContextMenu={() => setSelectedMessage(msg)}
                className={`px-[7px] py-[5px] pb-[0px] max-w-[500px] rounded-xl wrap-anywhere ${
                    msg.isMine
                        ? "bg-purple-gradient self-end rounded-br-none"
                        : "bg-neutral-800 self-start rounded-bl-none"
                }`}
            >
                <div>
                    {msg.forwardedMessageId && (
                        <div className="p-[3px]">
                            <div className="flex items-center gap-[5px] text-sm">
                                <ReplyIcon className="w-[16px] fill-none stroke-white stroke-3 rotate-270" />
                                <div className="flex gap-[3px]">
                                    <div>forwarded from</div>
                                    <span className="font-semibold">
                                        {msg.forwardedMessage?.sender.username}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {msg.replyTo && (
                        <div className="px-[15px] py-[4px] bg-neutral-950/40 w-full rounded-xl border-l-4 mb-[10px]">
                            <div className="font-bold text-sm flex gap-[3px]">
                                {msg.replyTo?.sender.username}
                                {msg.replyTo?.forwardedMessageId && (
                                    <ReplyIcon className="w-[16px] fill-none stroke-white stroke-3 rotate-270" />
                                )}
                                {msg.replyTo.forwardedMessage?.sender.username}
                            </div>
                            <div className="text-sm">
                                {msg.replyTo?.content}
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
                            <div className="flex items-center gap-[1px]">
                                {msg.pinnedMessages &&
                                    msg?.pinnedMessages?.length > 0 && (
                                        <div className="text-xs text-gray-400 text-right">
                                            <PinIcon className="w-[13px] pr-[2px] fill-neutral-400 stroke-1 stroke-neutral-400" />
                                        </div>
                                    )}
                                <div className="text-xs text-gray-400 text-right">
                                    {dayjs(msg.createdAt).format("HH:mm")}
                                </div>
                                {msg.messagesRead &&
                                msg.messagesRead.length >= 2 ? (
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
                <ContextMenuItem onClick={handleReply}>Reply</ContextMenuItem>
                {msg.isMine && !msg.forwardedMessageId && (
                    <ContextMenuItem onClick={handleEdit}>Edit</ContextMenuItem>
                )}
                <ContextMenuItem
                    onClick={() => {
                        handleCopy(msg.content);
                    }}
                >
                    Copy
                </ContextMenuItem>
                {msg.pinnedMessages &&
                msg.pinnedMessages?.length > 0 &&
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
                <ContextMenuItem onClick={handleForward}>
                    Forward
                </ContextMenuItem>
                <ContextMenuItem>Select</ContextMenuItem>
                {(isPrivate || isAdmin || msg.senderId === me?.id) && (
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
