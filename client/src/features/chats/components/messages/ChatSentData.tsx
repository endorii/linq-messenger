"use client";

import {
    useCreateMessage,
    useUpdateMessage,
} from "@/features/messages/hooks/useMessages";
import {
    ClipIcon,
    CloseIcon,
    EditIcon,
    EmojiIcon,
    MicrophoneIcon,
    ReplyIcon,
    SendIcon,
} from "@/shared/icons";
import { useChatInputStore } from "@/store";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { useState, useEffect } from "react";
import { ChatTextarea } from "./ChatTextarea";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { ButtonActive, ButtonIcon } from "@/shared/components/ui/buttons";
import { useTheme } from "next-themes";

interface ChatSentDataProps {
    chatId: string;
}

export function ChatSentData({ chatId }: ChatSentDataProps) {
    const [inputValue, setInputValue] = useState<string>("");
    const [isFocused, setIsFocused] = useState(false);

    const createMessageMutation = useCreateMessage();
    const { theme } = useTheme();

    const {
        chatSentType,
        messageForEdit,
        messageForReply,
        setChatSentType,
        setMessageForEdit,
        setMessageForReply,
    } = useChatInputStore();

    const updateMessageMutation = useUpdateMessage();

    useEffect(() => {
        if (chatSentType === "edit" && messageForEdit) {
            setInputValue(messageForEdit.content);
        }
    }, [chatSentType, messageForEdit]);

    useEffect(() => {
        setChatSentType("sent");
        setMessageForEdit(null);
        setMessageForReply(null);
        setInputValue("");
    }, [chatId]);

    const handleSend = (value: string) => {
        if (!value.trim()) return;

        if (chatSentType === "edit" && messageForEdit) {
            updateMessageMutation.mutateAsync({
                chatId,
                messageId: messageForEdit.id,
                messagePayload: { content: value },
            });
            setChatSentType("sent");
            setMessageForEdit(null);
        } else if (chatSentType === "reply" && messageForReply) {
            createMessageMutation.mutateAsync({
                chatId,
                messagePayload: {
                    content: value,
                    replyToId: messageForReply.id,
                },
            });
            setChatSentType("sent");
            setMessageForEdit(null);
        } else {
            createMessageMutation.mutateAsync({
                chatId,
                messagePayload: { content: value },
            });
        }

        setInputValue("");
    };

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setInputValue((prev) => prev + emojiData.emoji);
    };

    return (
        <div className="w-full px-[15%] flex items-end gap-[10px] justify-between py-[15px] bg-transparent ">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="bg-theme-gradient rounded-xl p-[11px] cursor-pointer">
                        <ClipIcon className="w-[24px] h-[24px] fill-white" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuItem>Photo or Video</DropdownMenuItem>
                    <DropdownMenuItem>Document</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <div className="w-full relative rounded-xl group bg-neutral-200 dark:bg-neutral-800 focus-within:bg-gradient-to-br focus-within:from-blue-600 focus-within:to-sky-600 dark:focus-within:from-violet-600 dark:focus-within:to-indigo-600 p-[2px] transition-all duration-300 flex items-center">
                <div className="flex flex-col w-full gap-[3px]">
                    {chatSentType === "reply" ? (
                        <div className="flex gap-[5px] px-[10px] py-[3px] ">
                            <ReplyIcon
                                className={`w-[30px] stroke-2 fill-none mx-[10px] ${
                                    isFocused
                                        ? "stroke-white"
                                        : "stroke-neutral-900 dark:stroke-white "
                                }`}
                            />
                            <div
                                className={`px-[15px] py-[4px] bg-blue-100/20 dark:bg-purple-100/20 w-full rounded-xl border-l-4 transition-colors duration-300 ${
                                    isFocused
                                        ? "text-white"
                                        : "text-neutral-900 dark:text-white"
                                }`}
                            >
                                <div className="font-bold text-sm">
                                    {messageForReply?.sender.username}
                                </div>
                                <div className="text-sm">
                                    {`${messageForReply?.content.slice(
                                        0,
                                        100
                                    )} ${
                                        messageForReply?.content.length! > 100
                                            ? "..."
                                            : ""
                                    }`}
                                </div>
                            </div>
                            <ButtonIcon
                                onClick={() => {
                                    setInputValue("");
                                    setMessageForEdit(null);
                                    setChatSentType("sent");
                                }}
                            >
                                <CloseIcon
                                    className={`w-[20px] stroke-3 fill-none mx-[4px] ${
                                        isFocused
                                            ? "stroke-white"
                                            : "stroke-neutral-900 dark:stroke-white "
                                    }`}
                                />
                            </ButtonIcon>
                        </div>
                    ) : null}
                    {chatSentType === "edit" ? (
                        <div className="flex gap-[5px] px-[10px] py-[3px] ">
                            <EditIcon className="w-[30px] stroke-2 stroke-neutral-900 dark:stroke-white fill-none mx-[10px]" />
                            <div className="px-[15px] py-[4px] dark:bg-neutral-950/40 w-full rounded-xl border-l-4">
                                <div className="font-bold text-sm">
                                    Edit message
                                </div>
                                <div className="text-sm">
                                    {`${messageForEdit?.content.slice(
                                        0,
                                        100
                                    )} ${
                                        messageForEdit?.content.length! > 100
                                            ? "..."
                                            : ""
                                    }`}
                                </div>
                            </div>
                            <ButtonIcon
                                onClick={() => {
                                    setInputValue("");
                                    setMessageForEdit(null);
                                    setChatSentType("sent");
                                }}
                            >
                                <CloseIcon className="w-[20px] stroke-3 stroke-neutral-900 dark:stroke-white fill-none mx-[4px]" />
                            </ButtonIcon>
                        </div>
                    ) : null}
                    <ChatTextarea
                        value={inputValue}
                        onChange={setInputValue}
                        onEnter={() => handleSend(inputValue)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="absolute bottom-[14px] right-[15px] transition-all duration-300 cursor-pointer">
                            <EmojiIcon className="w-[20px] h-[20px] fill-neutral-400 dark:fill-white group-focus-within:fill-neutral-800 dark:group-focus-within:fill-white" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="p-0 border-none shadow-lg">
                        <EmojiPicker
                            onEmojiClick={handleEmojiClick}
                            autoFocusSearch={false}
                            theme={
                                theme === "dark"
                                    ? Theme.DARK
                                    : theme === "light"
                                    ? Theme.LIGHT
                                    : Theme.AUTO
                            }
                        />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {inputValue.length > 0 ? (
                <ButtonActive
                    onClick={() => handleSend(inputValue)}
                    className="relative! flex items-center justify-center h-full w-full"
                >
                    <SendIcon
                        className={`w-[28px] fill-none stroke-2 stroke-white`}
                    />
                </ButtonActive>
            ) : (
                <ButtonActive
                    onClick={() => console.log("voice")}
                    className="relative! flex items-center justify-center h-full w-full"
                >
                    <MicrophoneIcon
                        className={`w-[28px] fill-none stroke-2 stroke-white`}
                    />
                </ButtonActive>
            )}
        </div>
    );
}
