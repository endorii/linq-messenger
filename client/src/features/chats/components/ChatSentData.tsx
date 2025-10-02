"use client";

import { useCreateMessage } from "@/features/messages/hooks/useMessages";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { ClipIcon, MicrophoneIcon, SendIcon, EmojiIcon } from "@/shared/icons";

import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { useState } from "react";
import ChatTextarea from "./ChatTextarea";

function ChatSentData({ chatId }: { chatId: string }) {
    const [inputValue, setInputValue] = useState<string>("");

    const useCreateMessageMutation = useCreateMessage();

    const handleSend = (inputValue: string) => {
        if (inputValue.length > 0) {
            if (!inputValue.trim()) return;
            useCreateMessageMutation.mutateAsync({
                chatId,
                messagePayload: {
                    content: inputValue,
                },
            });
            setInputValue("");
        } else {
            //Recording voice
            console.log("Voice recording");
        }
    };

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setInputValue((prev: string) => `${prev + emojiData.emoji}`);
    };

    return (
        <div className="absolute bottom-0 w-full px-[15%] flex items-end gap-[10px] justify-between py-[15px] bg-transparent">
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
                <ChatTextarea
                    value={inputValue}
                    onChange={setInputValue}
                    onEnter={() => handleSend(inputValue)}
                />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="absolute top-[12px] right-[15px] transition-all duration-300 cursor-pointer">
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
