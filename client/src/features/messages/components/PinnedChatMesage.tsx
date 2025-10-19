import Image from "next/image";
import { IUser } from "@/shared/interfaces";
import { PinnedChatMessageContextMenu } from "./PinnedChatMessageContextMenu";
import { IPinnedMessage } from "@/shared/interfaces/IMessage";

export function PinnedChatMessage({
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
    msg: IPinnedMessage;
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
            className={`flex ${msg.isMine ? "justify-end" : "justify-start"} ${
                !isSameSenderAsPrev ? "mt-3" : ""
            }`}
        >
            <div
                className={`flex flex-col ${
                    msg.isMine ? "items-end" : "items-start"
                } relative`}
            >
                <PinnedChatMessageContextMenu
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
