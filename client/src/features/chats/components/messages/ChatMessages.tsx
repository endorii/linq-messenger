"use client";

import { IChat } from "@/shared/interfaces";

export function ChatMessages({
    children,
    chat,
}: {
    children: React.ReactNode;
    chat: IChat;
}) {
    return (
        <div
            className="h-full w-full pt-[65px]"
            // style={{
            //     backgroundImage: `url(${
            //         chat.background ||
            //         "https://cdn.pixabay.com/photo/2024/06/30/10/28/sky-8862862_1280.png"
            //     })`,
            //     backgroundSize: "cover",
            //     // backgroundPosition: "center",
            //     backgroundRepeat: "no-repeat",
            // }}
        >
            {children}
        </div>
    );
}
