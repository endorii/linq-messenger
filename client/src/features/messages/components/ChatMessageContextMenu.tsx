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
import { useToggleReaction } from "@/features/reactions/hooks/useReactions";
import Image from "next/image";
import { groupReactionsByEmoji } from "@/features/reactions/utils/groupReactionsByEmoji";
import { useTheme } from "next-themes";
import { DownloadIcon, FileIcon } from "lucide-react";
import Link from "next/link";

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

    const { toggleSelectedMessage } = useSelectionStore();

    const createPinMessageMutation = useCreatePinMessage();
    const deletePinnedMessageMutation = useDeletePinnedMessage();
    const toggleReactionMutation = useToggleReaction();

    const { theme } = useTheme();

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

    const handleSelect = (msgId: string) => {
        toggleSelectedMessage(msgId);
    };

    const handleToggleEmoji = (emoji: string) => {
        toggleReactionMutation.mutateAsync({
            chatId: msg.chatId,
            reactionPayload: {
                emoji,
                messageId: msg.id,
            },
        });
    };

    return (
        <ContextMenu>
            <ContextMenuTrigger
                asChild
                onContextMenu={() => setSelectedMessage(msg)}
                className={`max-w-[500px] rounded-xl wrap-anywhere group relative ${
                    msg.isMine
                        ? "bg-theme-gradient self-end rounded-br-none"
                        : "bg-neutral-200 dark:bg-neutral-800 self-start rounded-bl-none"
                }`}
            >
                <div onDoubleClick={() => toggleSelectedMessage(msg.id)}>
                    {msg.forwardedMessageId && (
                        <div className="py-[5px] px-[10px]">
                            <div className="flex items-center gap-[5px] text-sm">
                                <ReplyIcon className="w-[16px] fill-none stroke-white stroke-3 rotate-270" />
                                <div className="text-white flex gap-[3px]">
                                    <div>forwarded from</div>
                                    <span className="font-semibold">
                                        {msg.forwardedMessage?.sender.username}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {msg.replyTo && (
                        <div
                            className={`px-[15px] py-[4px] text-white  w-full rounded-xl border-l-4 ${
                                msg.isMine
                                    ? "bg-blue-100/20 dark:bg-purple-100/20"
                                    : "bg-blue-500 dark:bg-indigo-500 "
                            }`}
                        >
                            <div className="font-bold text-sm flex gap-[3px]">
                                {msg.replyTo?.sender.username}
                                {msg.replyTo?.forwardedMessageId && (
                                    <ReplyIcon className="w-[16px] fill-none stroke-white stroke-3 rotate-270" />
                                )}
                                {msg.replyTo.forwardedMessage?.sender.username}
                            </div>
                            <div className="text-sm truncate">
                                {msg.replyTo?.content}
                            </div>
                        </div>
                    )}
                    {msg.attachments && msg.attachments.length > 0 && (
                        <div className="flex flex-wrap">
                            {msg.attachments.map((attachment) => {
                                if (attachment.mimetype?.startsWith("image/")) {
                                    return (
                                        <Image
                                            key={attachment.id}
                                            src={
                                                attachment.url ||
                                                "placeholder.png"
                                            }
                                            alt={attachment.fileName || ""}
                                            width={300}
                                            height={300}
                                            className="rounded-t-xl flex-1 w-full max-w-[400px] object-cover"
                                        />
                                    );
                                }
                                if (attachment.mimetype?.startsWith("video/")) {
                                    return (
                                        <video
                                            key={attachment.id}
                                            src={attachment.url}
                                            className="max-h-[400px]"
                                            controls
                                        />
                                    );
                                }

                                return (
                                    <Link
                                        href={attachment.url || ""}
                                        key={attachment.id}
                                        className="flex gap-[10px] items-center"
                                    >
                                        <FileIcon className="" />
                                        <div className="flex flex-col">
                                            <div>{attachment.fileName}</div>
                                            <div className="text-xs font-semibold">
                                                {attachment.fileSize} KB.
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    <div className="px-[7px] py-[5px]">
                        <div className={`${msg.isMine ? "text-white" : null}`}>
                            {msg.content}
                        </div>
                        <div className="flex gap-[5px] justify-between items-end">
                            <div className="flex gap-[5px] overflow-y-auto">
                                {msg.reactions &&
                                    groupReactionsByEmoji(msg.reactions).map(
                                        (group) => (
                                            <div
                                                key={group.emoji}
                                                className="flex gap-[5px] items-center px-[6px] py-[3px] bg-white/10 rounded-xl cursor-pointer hover:bg-white/20"
                                                onClick={() =>
                                                    handleToggleEmoji(
                                                        group.emoji
                                                    )
                                                }
                                            >
                                                <div className="text-md">
                                                    {group.emoji}
                                                </div>

                                                {group.users.length <= 3 ? (
                                                    <div className="flex -space-x-2">
                                                        {group.users.map(
                                                            (user) => (
                                                                <img
                                                                    key={
                                                                        user.id
                                                                    }
                                                                    src={
                                                                        user.avatarUrl
                                                                    }
                                                                    alt="avatar"
                                                                    className="w-[22px] h-[22px] rounded-full object-cover"
                                                                />
                                                            )
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="text-sm text-white/70 font-medium">
                                                        +{group.users.length}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    )}
                            </div>
                            <div className="flex items-center gap-[5px]">
                                {msg.editedAt ? (
                                    <div className="text-xs text-white/70 text-right">
                                        edited
                                    </div>
                                ) : null}
                                <div className="flex items-center gap-[1px]">
                                    {msg.pinnedMessages &&
                                        msg?.pinnedMessages?.length > 0 && (
                                            <div className="text-xs text-white/70 text-right">
                                                <PinIcon
                                                    className={`w-[13px] pr-[2px] stroke-1 ${
                                                        !msg.isMine
                                                            ? "fill-neutral-500 stroke-neutral-500 "
                                                            : "fill-white/70 stroke-white/70 dark:fill-neutral-100  dark:stroke-neutral-100"
                                                    }`}
                                                />
                                            </div>
                                        )}
                                    <div
                                        className={`text-xs text-white/70 text-right ${
                                            !msg.isMine && "text-neutral-500!"
                                        }`}
                                    >
                                        {dayjs(msg.createdAt).format("HH:mm")}
                                    </div>
                                    {msg.isMine ? (
                                        msg.messagesRead &&
                                        msg.messagesRead.length >= 2 ? (
                                            <CheckBothIcon className="w-[20px] fill-none stroke-2 stroke-white" />
                                        ) : (
                                            <CheckIcon className="w-[20px] fill-none stroke-2 stroke-white" />
                                        )
                                    ) : null}
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
                                onClick={() => handleToggleEmoji(emoji)}
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
                <ContextMenuItem onClick={() => handleSelect(msg.id)}>
                    Select
                </ContextMenuItem>
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
