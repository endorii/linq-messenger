"use client";

import { useRef, useEffect } from "react";

function ChatTextarea({
    value,
    onChange,
    onEnter,
}: {
    value: string;
    onChange: (value: string) => void;
    onEnter: () => void;
}) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const resize = () => {
        const el = textareaRef.current;
        if (el) {
            el.style.height = "auto"; // завжди скидати
            el.style.height = Math.min(el.scrollHeight, 500) + "px";
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
        resize();
    };

    // якщо value скинули (наприклад, після відправки)
    useEffect(() => {
        resize();
    }, [value]);

    return (
        <div className="w-full relative rounded-xl group bg-transparent focus-within:bg-gradient-to-br focus-within:from-violet-600 focus-within:to-indigo-600 p-[2px] transition-all duration-300">
            <textarea
                ref={textareaRef}
                value={value}
                onChange={handleChange}
                placeholder="Write your message..."
                className="py-[10px] px-[20px] rounded-xl w-full bg-neutral-950 focus:bg-neutral-950 border-none pr-[60px] outline-0 resize-none text-base! overflow-y-auto"
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        onEnter();
                    }
                }}
            />
        </div>
    );
}

export default ChatTextarea;
