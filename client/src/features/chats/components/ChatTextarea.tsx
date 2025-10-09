"use client";

import { useRef, useEffect } from "react";

interface ChatTextareaProps {
    value: string;
    onChange: (value: string) => void;
    onEnter: () => void;
}

function ChatTextarea({ value, onChange, onEnter }: ChatTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const resize = () => {
        const el = textareaRef.current;
        if (el) {
            el.style.height = "40px"; // базова висота
            const newHeight = Math.min(el.scrollHeight, 500);
            el.style.height = `${Math.max(newHeight, 40)}px`;
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
        resize();
    };

    useEffect(() => {
        resize();
    }, [value]);

    return (
        <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            placeholder="Write your message..."
            className="py-[10px] px-[20px] rounded-xl w-full bg-neutral-950 focus:bg-neutral-950 border-none pr-[60px] outline-0 resize-none text-base overflow-y-auto h-[40px]"
            onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onEnter();
                }
            }}
        />
    );
}

export default ChatTextarea;
