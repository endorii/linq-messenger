"use client";

import { useState, useEffect } from "react";
import {
    useCreateMessage,
    useUpdateMessage,
} from "@/features/messages/hooks/useMessages";
import {
    ClipIcon,
    MicrophoneIcon,
    SendIcon,
    EmojiIcon,
    EditIcon,
    CloseIcon,
} from "@/shared/icons";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/shared/components/ui/dropdown-menu";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import ChatTextarea from "./ChatTextarea";
import { useSidebarStore } from "@/store/sidebarStore";

interface ChatSentDataProps {
    chatId: string;
}

function ChatSentData({ chatId }: ChatSentDataProps) {
    const [inputValue, setInputValue] = useState<string>("");

    const createMessageMutation = useCreateMessage();
    const { chatSentType, messageForEdit, setChatSentType, setMessageForEdit } =
        useSidebarStore();

    const updateMessageMutation = useUpdateMessage();

    useEffect(() => {
        if (chatSentType === "edit" && messageForEdit) {
            setInputValue(messageForEdit.content);
        }
    }, [chatSentType, messageForEdit]);

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
                    <button className="bg-purple-gradient rounded-xl p-[11px] cursor-pointer">
                        <ClipIcon className="w-[24px] h-[24px] fill-white" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuItem>Photo or Video</DropdownMenuItem>
                    <DropdownMenuItem>Document</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <div className="w-full relative rounded-xl group bg-neutral-800 focus-within:bg-gradient-to-br focus-within:from-violet-600 focus-within:to-indigo-600 p-[2px] transition-all duration-300 flex items-center">
                <div className="flex flex-col w-full gap-[3px]">
                    {chatSentType === "edit" ? (
                        <div className="flex gap-[5px] px-[10px] py-[3px] ">
                            <EditIcon className="w-[30px] stroke-2 stroke-white fill-none mx-[10px]" />
                            <div className="px-[15px] py-[4px] bg-neutral-950/40 w-full rounded-xl border-l-4 border-violet-600">
                                <div className="font-bold text-sm">
                                    Edit message
                                </div>
                                <div className="text-sm">
                                    {messageForEdit?.content}
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setInputValue("");
                                    setMessageForEdit(null);
                                    setChatSentType("sent");
                                }}
                            >
                                <CloseIcon className="w-[20px] stroke-3 stroke-white fill-none mx-[10px]" />
                            </button>
                        </div>
                    ) : null}
                    <ChatTextarea
                        value={inputValue}
                        onChange={setInputValue}
                        onEnter={() => handleSend(inputValue)}
                    />
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="absolute bottom-[14px] right-[15px] transition-all duration-300 cursor-pointer">
                            <EmojiIcon className="w-[20px] h-[20px] fill-neutral-400 group-focus-within:fill-white" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="p-0 border-none shadow-lg">
                        <EmojiPicker
                            onEmojiClick={handleEmojiClick}
                            autoFocusSearch={false}
                            theme={Theme.DARK}
                        />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <button
                onClick={() => handleSend(inputValue)}
                className="bg-purple-gradient rounded-xl p-[23px] cursor-pointer flex items-center justify-center"
            >
                <SendIcon
                    className={`absolute w-[26px] h-[26px] fill-none stroke-2 stroke-white transition-all duration-200 ${
                        inputValue.length > 0
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-75"
                    }`}
                />
                <MicrophoneIcon
                    className={`absolute w-[26px] h-[26px] fill-none stroke-2 stroke-white transition-all duration-200 ${
                        inputValue.length === 0
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-75"
                    }`}
                />
            </button>
        </div>
    );
}

export default ChatSentData;
