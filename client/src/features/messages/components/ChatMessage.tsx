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
    isGroup,
    avatarUrl,
    username,
}: {
    msg: IMessage;
    isSameSenderAsPrev: boolean;
    isSameSenderAsNext: boolean;
    me: IUser | undefined;
    isAdmin: boolean;
    isPrivate: boolean;
    isGroup: boolean;
    avatarUrl: string;
    username: string | undefined;
}) {
    return (
        <div
            className={`flex items-center gap-[20px] w-full ${
                msg.isMine ? "justify-end" : "justify-start"
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
                {isGroup && !isSameSenderAsNext && !msg.isMine && (
                    <div className="absolute bottom-0 left-[-40px]">
                        <Image
                            src={avatarUrl || ""}
                            alt={username || "avatar"}
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
