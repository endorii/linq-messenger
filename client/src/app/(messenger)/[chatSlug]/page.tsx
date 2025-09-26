"use client";

import { ClipIcon, SendIcon } from "@/shared/icons";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useState } from "react";
import EmojiIcon from "@/shared/icons/EmojiIcon";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import ChatMessages from "@/features/chats/components/ChatMessages";
import { useMessages } from "@/features/messages/hooks/useMessages";
import { useParams } from "next/navigation";

function ChatSlug() {
    const [inputValue, setInputValue] = useState<string>("");
    const { chatSlug: chatId } = useParams<{ chatSlug: string }>();
    const { data: messages, isLoading } = useMessages(chatId);

    const handleSend = () => {
        if (!inputValue.trim()) return;
        console.log("Відправлено:", inputValue);
        setInputValue("");
    };

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setInputValue((prev: string) => `${prev + emojiData.emoji}`);
    };

    return (
        <div className="flex flex-col h-full bg-neutral-800 w-full items-center">
            <ChatMessages messages={messages} />

            <div className="w-full flex gap-[10px] justify-between items-center px-[15%] py-[15px] border-t border-neutral-700">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="p-[15px] rounded-full bg-neutral-950 border border-neutral-800 hover:bg-neutral-600 transition cursor-pointer">
                            <ClipIcon className="w-[23px] h-[23px] fill-white" />
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-56">
                        <DropdownMenuItem>Photo or Video</DropdownMenuItem>
                        <DropdownMenuItem>Document</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="relative w-full group">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Write your message..."
                        className="outline-0 p-[10px] px-[20px] rounded-xl bg-transparent w-full text-white border border-neutral-700 group focus-within:border-neutral-400 transition-all duration-300 flex gap-2 items-center "
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
                    onClick={handleSend}
                    className="p-[15px] rounded-full bg-neutral-950 border border-neutral-800 hover:bg-neutral-600 transition-all duration-300 cursor-pointer"
                >
                    <SendIcon className="w-[25px] h-[25px] fill-none stroke-2 stroke-white" />
                </button>
            </div>
        </div>
    );
}

export default ChatSlug;
