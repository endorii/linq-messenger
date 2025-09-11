"use client";

import { ClipIcon, SendIcon } from "@/shared/icons";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import EmojiIcon from "@/shared/icons/EmojiIcon";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import ChatMessages from "@/features/chat/ChatMessages";

function ChatSlug() {
    const [inputValue, setInputValue] = useState<string>("");

    const handleSend = () => {
        if (!inputValue.trim()) return;
        console.log("Відправлено:", inputValue);
        setInputValue("");
        setMessagesList((prev) =>
            prev.concat({
                id: Math.random(),
                author: "me",
                text: inputValue,
                time: "14:33",
            })
        );

        console.log(messagesList);
    };

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setInputValue((prev: string) => `${prev + emojiData.emoji}`);
    };

    const messages = [
        { id: 1, author: "me", text: "Hey! How are you?", time: "14:32" },
        {
            id: 2,
            author: "other",
            text: "Hi! I'm good, just working on a project. What about you?",
            time: "14:33",
        },
        {
            id: 3,
            author: "me",
            text: "Not bad 😅 What exactly are you working on?",
            time: "14:34",
        },
        {
            id: 4,
            author: "other",
            text: "I'm building a messenger interface and testing the message styles.",
            time: "14:35",
        },
        {
            id: 5,
            author: "me",
            text: "Oh, nice! I can help you test it if you want.",
            time: "14:36",
        },
        {
            id: 6,
            author: "other",
            text: "That would be great! Thanks a lot.",
            time: "14:37",
        },
        {
            id: 7,
            author: "me",
            text: "No problem! By the way, are you also adding dark mode?",
            time: "14:38",
        },
        {
            id: 8,
            author: "other",
            text: "Yes, I plan to. Dark mode is a must these days!",
            time: "14:39",
        },
        {
            id: 9,
            author: "me",
            text: "Haha, true! I can’t use apps without it anymore.",
            time: "14:40",
        },
        {
            id: 10,
            author: "other",
            text: "Same here. Let’s make this chat app modern and clean.",
            time: "14:41",
        },
        {
            id: 11,
            author: "me",
            text: "Totally agree! Do you also want to add reactions to messages?",
            time: "14:42",
        },
        {
            id: 12,
            author: "other",
            text: "Yes, that’s on my list. Emojis make chats so much more fun.",
            time: "14:43",
        },
        {
            id: 13,
            author: "me",
            text: "Nice! Also, maybe a file sharing option like Telegram?",
            time: "14:44",
        },
        {
            id: 14,
            author: "other",
            text: "Exactly. I’m adding photo, video, and document upload support.",
            time: "14:45",
        },
        {
            id: 15,
            author: "me",
            text: "Perfect. This is going to look awesome!",
            time: "14:46",
        },
        {
            id: 16,
            author: "other",
            text: "Yeah, can’t wait to finish it and test with friends.",
            time: "14:47",
        },
        {
            id: 17,
            author: "me",
            text: "We should also add group chats later, what do you think?",
            time: "14:48",
        },
        {
            id: 18,
            author: "other",
            text: "Great idea! But first, let’s make one-on-one chats stable.",
            time: "14:49",
        },
        {
            id: 19,
            author: "me",
            text: "Sure! Step by step. I’ll focus on the design while you code.",
            time: "14:50",
        },
        {
            id: 20,
            author: "other",
            text: "Deal! This is going to be fun 😎",
            time: "14:51",
        },
    ];

    const [messagesList, setMessagesList] = useState(messages);

    return (
        <div className="flex flex-col h-full bg-neutral-800 w-full items-center">
            <ChatMessages messages={messagesList} />

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
