"use client";

import { IUser } from "@/shared/interfaces/IUser";
import { IChat } from "@/shared/interfaces/IChat";
import { IMessage } from "@/shared/interfaces/IMessage";
import { ChatEnum } from "@/shared/enums/enums";
import { useProfile } from "@/features/auth/hooks/useAuth";
import { highlightMatch } from "@/shared/utils/highlightMatch";
import { useGlobalSearch } from "../../hooks/useSearch";
import { useCreatePrivateChat } from "@/features/chats/hooks/useChats";
import { useRouter } from "next/navigation";
import { useNavigationStore } from "@/store";

export function SidebarSearch({ searchValue }: { searchValue: string }) {
    const { setSidebarTab } = useNavigationStore();
    const { data: searchData, isLoading } = useGlobalSearch(searchValue);
    const { data: me } = useProfile();
    const router = useRouter();

    const createPrivateChatMutation = useCreatePrivateChat();

    if (!searchValue) {
        return (
            <div className="text-neutral-400 text-center mt-4">
                Type something to search
            </div>
        );
    }

    // if (isLoading) {
    //     return (
    //         <div className="text-neutral-400 text-center mt-4">Search...</div>
    //     );
    // }

    if (!searchData) return null;

    const { users, chats, messages } = searchData;

    return (
        <div className="flex flex-col px-[10px] py-[5px] overflow-y-auto">
            {users.length > 0 && (
                <>
                    <div className="text-neutral-400 text-sm px-2 mb-1 mt-2">
                        Users
                    </div>
                    {users.map((user: IUser) => (
                        <div
                            key={user.id}
                            className="flex gap-[13px] text-white hover:bg-white/5 p-[10px] rounded-xl cursor-pointer"
                            onClick={() => {
                                createPrivateChatMutation.mutateAsync(user.id);
                                setSidebarTab("chats");
                            }}
                        >
                            <div className="w-[55px] h-[55px] bg-neutral-600 rounded-full flex-shrink-0 overflow-hidden">
                                {user.avatarUrl && (
                                    <img
                                        src={user.avatarUrl}
                                        alt="avatar"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                )}
                            </div>

                            <div className="flex flex-col justify-center gap-[3px] flex-1 min-w-0">
                                <div className="font-semibold truncate">
                                    {user.firstName + " " + user.lastName ||
                                        user.username}
                                </div>
                                <div className="text-sm text-neutral-400 truncate">
                                    {user.isOnline
                                        ? "Online"
                                        : "last seen recently"}
                                </div>
                            </div>
                        </div>
                    ))}
                </>
            )}

            {chats.length > 0 && (
                <>
                    <div className="text-neutral-400 text-sm px-2 mb-1 mt-2">
                        Chats
                    </div>
                    {chats.map((chat: IChat) => (
                        <div
                            key={chat.id}
                            className="flex gap-[13px] text-white hover:bg-white/5 p-[10px] rounded-xl cursor-pointer"
                            onClick={() => {
                                router.push(`/${chat.id}`);
                                setSidebarTab("chats");
                            }}
                        >
                            <div className="w-[55px] h-[55px] bg-neutral-600 rounded-full flex-shrink-0 overflow-hidden">
                                {chat.avatar && (
                                    <img
                                        src={chat.avatar}
                                        alt="avatar"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                )}
                            </div>

                            <div className="flex flex-col justify-center gap-[3px] flex-1 min-w-0">
                                <div className="font-semibold truncate">
                                    {chat.name}
                                </div>
                                <div className="text-sm text-neutral-400 truncate">
                                    {chat.type
                                        ? "Online"
                                        : "last seen recently"}
                                </div>
                            </div>
                        </div>
                    ))}
                </>
            )}

            {messages.length > 0 && (
                <>
                    <div className="text-neutral-400 text-sm px-2 mb-1 mt-2">
                        Messages
                    </div>

                    {messages.map((message: IMessage) => {
                        let avatar = "";
                        let displayName = "";

                        if (message.chat.type === ChatEnum.PRIVATE) {
                            const otherUser = message.chat.members?.find(
                                (m) => m.user?.id !== me?.id
                            )?.user;

                            avatar = otherUser?.avatarUrl || "";
                            displayName =
                                otherUser?.firstName ||
                                otherUser?.username ||
                                "Unknown";
                        } else {
                            avatar = message.chat.avatar || "";
                            displayName = message.chat.name || "";
                        }

                        return (
                            <div
                                key={message.id}
                                className="flex gap-[13px] text-white hover:bg-white/5 p-[10px] rounded-xl cursor-pointer"
                                onClick={() => {
                                    // функція, яка приймає message.id, по chatId вона шукає чат, якому належить перекидає туди і викликає getChats з параметрами

                                    router.push(
                                        `/${message.chat.id}?focus=${message.id}`
                                    );
                                    setSidebarTab("chats");
                                }}
                            >
                                <div className="w-[55px] h-[55px] bg-neutral-600 rounded-full flex-shrink-0 overflow-hidden">
                                    {avatar ? (
                                        <img
                                            src={avatar}
                                            alt="avatar"
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-neutral-700 rounded-full" />
                                    )}
                                </div>

                                <div className="flex flex-col justify-center gap-[3px] flex-1 min-w-0">
                                    <div className="font-semibold truncate">
                                        {displayName}
                                    </div>
                                    <div className="text-sm text-neutral-400 truncate">
                                        {highlightMatch(
                                            message.content,
                                            searchValue
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </>
            )}
        </div>
    );
}
