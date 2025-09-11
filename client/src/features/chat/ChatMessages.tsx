import { useEffect, useRef, useState } from "react";

export default function ChatMessages({
    messages,
}: {
    messages: {
        id: number;
        author: string;
        text: string;
        time: string;
    }[];
}) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div
            ref={containerRef}
            className="flex flex-col overflow-y-auto flex-1 px-[15%] py-[20px] gap-[7px] w-full"
        >
            <div className="flex-1" />

            {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={`flex gap-2 px-3 py-2 rounded-2xl text-sm relative ${
                        msg.author === "me"
                            ? "ml-auto bg-neutral-900 text-white rounded-br-none"
                            : "mr-auto bg-neutral-700/50 text-white rounded-bl-none"
                    }`}
                >
                    <div>{msg.text}</div>
                    <div className="text-xs text-neutral-400 self-end">
                        {msg.time}
                    </div>
                </div>
            ))}
        </div>
    );
}
