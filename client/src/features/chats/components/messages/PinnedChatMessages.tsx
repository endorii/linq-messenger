import { useProfile } from "@/features/auth/hooks/useAuth";
import { PinnedChatMessage } from "@/features/messages/components/PinnedChatMesage";
import { usePinMessages } from "@/features/messages/hooks/usePinnedMessages";
import { ChatEnum } from "@/shared/enums/enums";
import { usePrivateChat } from "@/shared/hooks";
import { IChat } from "@/shared/interfaces";
import { IPinnedMessage } from "@/shared/interfaces/IMessage";
import dayjs from "dayjs";

export default function PinnedChatMessages({
    chat,
    pinedMessages,
}: {
    chat: IChat;
    pinedMessages: IPinnedMessage[];
}) {
    const { data: me } = useProfile();

    const { isPrivate, meMember } = usePrivateChat(chat);
    const isGroup = chat?.type === ChatEnum.GROUP;
    const isAdmin = chat.adminId === meMember?.userId;

    const groupedMessages = pinedMessages?.reduce<
        Record<string, typeof pinedMessages>
    >((acc, msg) => {
        const dateKey = dayjs(msg.createdAt).format("YYYY-MM-DD");
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(msg);
        return acc;
    }, {});

    return (
        <div className="h-full w-full pt-[65px] pb-[20px]">
            <div className="flex flex-col h-full w-full relative">
                <div className="relative flex flex-col h-full w-full pt-[65px] z-10">
                    <div className="flex-1 flex flex-col-reverse gap-[10px] h-full w-full overflow-y-auto px-[15%] py-[20px]">
                        {groupedMessages &&
                            Object.entries(groupedMessages)
                                .reverse()
                                .map(([date, msgs]) => (
                                    <div
                                        key={date}
                                        className="flex flex-col gap-[5px]"
                                    >
                                        <div className="sticky top-0 z-10 self-center bg-neutral-900 px-3 py-1 rounded-md text-sm text-gray-300 mb-2">
                                            {dayjs(date).format("D MMMM")}
                                        </div>
                                        {msgs.map((msg, i) => {
                                            const prevMsg = msgs[i - 1];
                                            const nextMsg = msgs[i + 1];

                                            const isSameSenderAsPrev =
                                                prevMsg &&
                                                prevMsg.message.sender.id ===
                                                    msg.message.sender.id;
                                            const isSameSenderAsNext =
                                                nextMsg &&
                                                nextMsg.message.sender.id ===
                                                    msg.message.sender.id;

                                            const sender = msg.message.sender;
                                            const avatarUrl =
                                                sender?.avatarUrl || "";
                                            const username = sender?.username;

                                            return (
                                                <PinnedChatMessage
                                                    key={msg.id}
                                                    msg={msg}
                                                    isSameSenderAsPrev={
                                                        isSameSenderAsPrev
                                                    }
                                                    isSameSenderAsNext={
                                                        isSameSenderAsNext
                                                    }
                                                    isGroup={isGroup}
                                                    avatarUrl={avatarUrl}
                                                    username={username}
                                                    me={me}
                                                    isAdmin={isAdmin}
                                                    isPrivate={isPrivate}
                                                />
                                            );
                                        })}
                                    </div>
                                ))}
                    </div>

                    <div className="w-full flex justify-center">
                        <button
                            className="font-semibold bg-purple-gradient px-[20px] py-[15px] rounded-xl"
                            onClick={() => {}}
                        >
                            Unpin All Messages
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
