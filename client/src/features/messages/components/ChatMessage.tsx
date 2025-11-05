import { useCreatePrivateChat } from "@/features/chats/hooks/useChats";
import { IMessage, IUser } from "@/shared/interfaces";
import { ChatMessageContextMenu } from "./ChatMessageContextMenu";

export function ChatMessage({
    msg,

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
    const useGetOrCreatePrivateChatMutation = useCreatePrivateChat();

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
                    <button
                        className="absolute bottom-0 left-[-40px] w-[35px] h-[35px]"
                        onClick={() =>
                            useGetOrCreatePrivateChatMutation.mutateAsync(
                                msg.sender.id
                            )
                        }
                    >
                        <img
                            src={avatarUrl || ""}
                            alt={username || "avatar"}
                            className="w-full rounded-full object-cover "
                        />
                    </button>
                )}
            </div>
        </div>
    );
}
