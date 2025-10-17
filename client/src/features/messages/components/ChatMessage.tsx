import Image from "next/image";
import { ChatMessageContextMenu } from "./ChatMessageContextMenu";
import { IMessage, IUser } from "@/shared/interfaces";

export function ChatMessage({
    msg,
    isSameSenderAsPrev,
    isSameSenderAsNext,
    me,
    isAdmin,
    isPrivate,
    isChannel,
    avatarUrl,
    username,
}: {
    msg: IMessage;
    isSameSenderAsPrev: boolean;
    isSameSenderAsNext: boolean;
    me: IUser | undefined;
    isAdmin: boolean;
    isPrivate: boolean;
    isChannel: boolean;
    avatarUrl: string;
    username: string;
}) {
    return (
        <div
            className={`flex ${msg.isMine ? "justify-end" : "justify-start"} ${
                !isSameSenderAsPrev ? "mt-3" : ""
            }`}
        >
            <div
                className={`flex flex-col ${
                    msg.isMine ? "items-end" : "items-start"
                } relative`}
            >
                <ChatMessageContextMenu
                    msg={msg}
                    isPrivate={isPrivate}
                    isAdmin={isAdmin}
                    me={me}
                />

                {!msg.isMine && !isSameSenderAsNext && isChannel && (
                    <div className="absolute bottom-0 left-[-40px]">
                        <Image
                            src={avatarUrl || ""}
                            alt={username}
                            width={32}
                            height={32}
                            unoptimized
                            className="rounded-full object-cover"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
