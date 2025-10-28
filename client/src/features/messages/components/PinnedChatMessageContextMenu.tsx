"use client";

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
import { useToggleReaction } from "@/features/reactions/hooks/useReactions";
import { groupReactionsByEmoji } from "@/features/reactions/utils/groupReactionsByEmoji";
import Image from "next/image";

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
    const toggleReactionMutation = useToggleReaction();

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

    const handleToggleEmoji = (emoji: string) => {
        toggleReactionMutation.mutateAsync({
            chatId: msg.message.chatId,
            reactionPayload: {
                emoji,
                messageId: msg.message.id,
            },
        });
    };

    return (
        <ContextMenu>
            <ContextMenuTrigger
                onContextMenu={() => setSelectedMessage(msg.message)}
                className={`px-[7px] py-[5px] max-w-[500px] rounded-xl wrap-anywhere group relative ${
                    msg.isMine
                        ? "bg-theme-gradient self-end rounded-br-none"
                        : "bg-neutral-200 dark:bg-neutral-800 self-start rounded-bl-none"
                }`}
            >
                <div>
                    {msg.message.forwardedMessageId && (
                        <div className="p-[3px]">
                            <div className="flex items-center gap-[5px] text-sm">
                                <ReplyIcon className="w-[16px] fill-none stroke-neutral-900 dark:stroke-white stroke-3 rotate-270" />
                                <div className="flex gap-[3px]">
                                    <div>forwarded from</div>
                                    <span className="font-semibold">
                                        {
                                            msg.message.forwardedMessage?.sender
                                                .username
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {msg.message.replyTo && (
                        <div
                            className={`px-[15px] py-[4px] text-white  w-full rounded-xl border-l-4 mb-[10px] ${
                                msg.isMine
                                    ? " bg-blue-100/20 dark:bg-purple-100/20"
                                    : "bg-blue-500 dark:bg-indigo-500 "
                            }`}
                        >
                            <div className="font-bold text-sm flex gap-[3px]">
                                {msg.message.replyTo?.sender.username}
                                {msg.message.replyTo?.forwardedMessageId && (
                                    <ReplyIcon className="w-[16px] fill-none stroke-neutral-900 dark:stroke-white stroke-3 rotate-270" />
                                )}
                                {
                                    msg.message.replyTo.forwardedMessage?.sender
                                        .username
                                }
                            </div>
                            <div className="text-sm truncate">
                                {msg.message.replyTo?.content}
                            </div>
                        </div>
                    )}

                    <div>
                        <div className={`${msg.isMine ? "text-white" : ""}`}>
                            {msg.message.content}
                        </div>

                        <div className="flex gap-[5px] justify-between items-end">
                            <div className="flex gap-[5px] overflow-y-auto">
                                {msg.message.reactions &&
                                    groupReactionsByEmoji(
                                        msg.message.reactions
                                    ).map((group) => (
                                        <div
                                            key={group.emoji}
                                            className="flex gap-[5px] items-center px-[6px] py-[3px] bg-white/10 rounded-xl cursor-pointer hover:bg-white/20"
                                            onClick={() =>
                                                handleToggleEmoji(group.emoji)
                                            }
                                        >
                                            <div className="text-md">
                                                {group.emoji}
                                            </div>

                                            {group.users.length <= 3 ? (
                                                <div className="flex -space-x-2">
                                                    {group.users.map((user) => (
                                                        <Image
                                                            key={user.id}
                                                            src={
                                                                user.avatarUrl ||
                                                                ""
                                                            }
                                                            alt="avatar"
                                                            width={22}
                                                            height={22}
                                                            unoptimized
                                                            className="w-[22px] h-[22px] rounded-full border-[1px] border-neutral-300 dark:border-neutral-800"
                                                        />
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-sm text-white/70 font-medium">
                                                    +{group.users.length}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                            </div>

                            <div className="flex items-center gap-[5px]">
                                {msg.message.createdAt !==
                                msg.message.updatedAt ? (
                                    <div className="text-xs text-white/70 text-right">
                                        edited
                                    </div>
                                ) : null}

                                <div className="flex items-center gap-[1px]">
                                    {msg.message.pinnedMessages &&
                                        msg.message.pinnedMessages.length >
                                            0 && (
                                            <PinIcon
                                                className={`w-[13px] pr-[2px] stroke-1 ${
                                                    !msg.isMine
                                                        ? "fill-neutral-500 stroke-neutral-500 "
                                                        : "fill-white/70 stroke-white/70 dark:fill-neutral-100  dark:stroke-neutral-100"
                                                }`}
                                            />
                                        )}
                                    <div
                                        className={`text-xs text-white/70 text-right ${
                                            !msg.isMine && "text-neutral-500!"
                                        }`}
                                    >
                                        {dayjs(msg.createdAt).format("HH:mm")}
                                    </div>
                                    {msg.isMine ? (
                                        msg.message.messagesRead &&
                                        msg.message.messagesRead.length >= 2 ? (
                                            <CheckBothIcon className="w-[20px] fill-none stroke-2 stroke-white" />
                                        ) : (
                                            <CheckIcon className="w-[20px] fill-none stroke-2 stroke-white" />
                                        )
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    className="absolute -right-[10px] -bottom-[10px] opacity-0 group-hover:opacity-100 transition-all duration-200"
                    onClick={() => handleToggleEmoji("❤️")}
                >
                    ❤️
                </button>
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
                                onClick={() => handleToggleEmoji(emoji)}
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
                msg.message.pinnedMessages.length > 0 &&
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
