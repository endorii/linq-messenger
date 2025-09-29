"use client";

import { OptionsIcon, PhoneIcon, SearchIcon } from "@/shared/icons";
import { IChat } from "@/shared/interfaces/IChat";

function ChatHeader({
    chat,
    setSidebarOpen,
}: {
    chat: IChat;
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    return (
        <div className="absolute top-0 w-full h-[65px] z-10 flex justify-between text-white bg-neutral-950 px-[20px] py-[10px] pr-[50px] cursor-pointer">
            <div
                className="flex gap-[20px] w-full"
                onClick={() => setSidebarOpen((prev) => !prev)}
            >
                <div className="w-[45px] h-[45px] rounded-full bg-neutral-600">
                    <img
                        src={chat.avatar}
                        alt="avatar"
                        className="rounded-full"
                    />
                </div>
                <div>
                    <div className="font-semibold">{chat.name}</div>
                    <div className="text-sm text-neutral-400">
                        {chat.type === "PRIVATE"
                            ? "last seen recently"
                            : `${chat.members?.length || 0} members`}
                    </div>
                </div>
            </div>
            <div className="flex gap-[25px]">
                {chat.type === "PRIVATE" ? (
                    <button>
                        <PhoneIcon className="w-[24px] stroke-neutral-300 stroke-[2.5]" />
                    </button>
                ) : null}
                <button>
                    <SearchIcon className="w-[24px] stroke-neutral-300 stroke-[2.5]" />
                </button>
                <button>
                    <OptionsIcon className="w-[21px] fill-neutral-300" />
                </button>
            </div>
        </div>
    );
}

export default ChatHeader;
