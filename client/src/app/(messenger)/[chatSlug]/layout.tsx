"use client";

import { useState } from "react";
import {
    BackIcon,
    InfoIcon,
    LinkIcon,
    NotifcationIcon,
    OptionsIcon,
    SearchIcon,
} from "@/shared/icons";
import { PhoneIcon } from "lucide-react";

function ChatLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex w-full h-[100vh]">
            <div className="flex-1 relative">
                <div className="absolute top-0 w-full z-10 flex justify-between text-white bg-neutral-900 px-[20px] py-[10px] pr-[50px] cursor-pointer">
                    <div className="flex gap-[20px]">
                        <div className="w-[45px] h-[45px] rounded-full bg-neutral-600"></div>
                        <div onClick={() => setSidebarOpen((prev) => !prev)}>
                            <div className="font-semibold">
                                New channel with the very long name
                            </div>
                            <div className="text-sm text-neutral-400">
                                30 454 subscribers
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-[25px]">
                        <button>
                            <PhoneIcon className="w-[24px] stroke-neutral-300 stroke-[2.5]" />
                        </button>
                        <button>
                            <SearchIcon className="w-[24px] stroke-neutral-300 stroke-[2.5]" />
                        </button>
                        <button>
                            <OptionsIcon className="w-[21px] fill-neutral-300" />
                        </button>
                    </div>
                </div>
                <div className="h-full pt-[70px]">{children}</div>
            </div>

            {/* Sidebar */}
            <div
                className={`overflow-hidden bg-neutral-900 border-l border-neutral-800 text-white transition-all duration-400 ease-in-out ${
                    sidebarOpen ? "w-[450px]" : "w-0"
                }`}
            >
                {sidebarOpen && (
                    <div className="flex flex-col h-full">
                        <div className="flex gap-[20px] items-center p-[18px]">
                            <button onClick={() => setSidebarOpen(false)}>
                                <BackIcon className="rotate-180 w-[26px] fill-none stroke-2 stroke-white cursor-pointer" />
                            </button>
                            <div className="text-xl font-semibold text-nowrap">
                                Channel information
                            </div>
                        </div>
                        <div className="flex flex-col gap-[20px] items-center p-[20px]">
                            <div className="w-[150px] h-[150px] bg-neutral-500 rounded-full"></div>
                            <div className="flex flex-col gap-[10px] items-center text-center">
                                <div className="text-xl font-semibold">
                                    New channel with the very long name
                                </div>
                                <div className="text-sm text-neutral-400">
                                    30 454 subscribers
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-[5px] px-[20px] py-[10px]">
                            <div className="p-[10px] hover:bg-white/5 rounded-xl cursor-pointer flex gap-[30px] items-center">
                                <InfoIcon className="w-[30px] stroke-2 stroke-neutral-400 fill-none" />
                                <div className="flex-1 flex flex-col gap-[3px]">
                                    <div>
                                        Here should be some text or description
                                        about this channel. A lot of information
                                        or just a simple text for filling.
                                        Bla-bla-bla.
                                    </div>
                                    <div className="text-sm text-neutral-400">
                                        Info
                                    </div>
                                </div>
                            </div>
                            <div className="p-[10px] hover:bg-white/5 rounded-xl cursor-pointer flex gap-[30px] items-center">
                                <LinkIcon className="w-[30px] stroke-2 stroke-neutral-400 fill-none" />
                                <div className="flex-1 flex flex-col gap-[3px]">
                                    <div>linq.com/channelid</div>
                                    <div className="text-sm text-neutral-400">
                                        Link
                                    </div>
                                </div>
                            </div>
                            <div className="p-[10px] hover:bg-white/5 rounded-xl cursor-pointer flex gap-[30px] items-center">
                                <NotifcationIcon className="w-[30px] stroke-2 stroke-neutral-400 fill-none" />
                                <div>Notifications</div>
                                <button>SwitchLikeOnIphone</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChatLayout;
