"use client";

import { Switch } from "@/shared/components/ui/switch";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/shared/components/ui/tabs";
import { ChatEnum } from "@/shared/enums/enums";
import { BackIcon, InfoIcon, LinkIcon, NotifcationIcon } from "@/shared/icons";
import { IChat } from "@/shared/interfaces/IChat";
import Image from "next/image";

function ChatSidebar({
    sidebarOpen,
    setSidebarOpen,
    chat,
}: {
    sidebarOpen: boolean;
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    chat: IChat;
}) {
    return (
        <div
            className={`overflow-y-auto bg-neutral-950 border-l border-neutral-800 text-white transition-all duration-400 ease-in-out ${
                sidebarOpen ? "w-[450px]" : "w-0 border-none"
            }`}
        >
            {sidebarOpen && (
                <div className="flex flex-col h-full">
                    <div className="flex gap-[20px] items-center p-[18px]">
                        <button onClick={() => setSidebarOpen(false)}>
                            <BackIcon className="rotate-180 w-[26px] fill-none stroke-2 stroke-white cursor-pointer" />
                        </button>
                        <div className="text-xl font-semibold text-nowrap">
                            {chat.type === ChatEnum.PRIVATE
                                ? "User information"
                                : chat.type === ChatEnum.GROUP
                                ? "Group information"
                                : chat.type === ChatEnum.CHANNEL
                                ? "Channel information"
                                : "Chat information"}
                        </div>
                    </div>
                    <div className="flex flex-col gap-[20px] items-center p-[20px]">
                        <div className="w-[150px] h-[150px] bg-neutral-600 rounded-full">
                            <img
                                src={chat.avatar}
                                alt="avatar"
                                className="rounded-full"
                            />
                        </div>
                        <div className="flex flex-col gap-[5px] items-center text-center">
                            <div className="text-xl font-semibold">
                                {chat.name}
                            </div>
                            <div className="text-sm text-neutral-400">
                                {chat.type === ChatEnum.PRIVATE
                                    ? "last seen recently"
                                    : `${chat.members?.length || 0} members`}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-[5px] px-[20px] py-[10px]">
                        {chat.description && (
                            <div className="p-[10px] hover:bg-white/5 rounded-xl cursor-pointer flex gap-[30px] items-center">
                                <InfoIcon className="w-[30px] stroke-2 stroke-neutral-400 fill-none" />
                                <div className="flex-1 flex flex-col gap-[3px]">
                                    <div>{chat.description}</div>
                                    <div className="text-sm text-neutral-400">
                                        Info
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="p-[10px] hover:bg-white/5 rounded-xl cursor-pointer flex gap-[30px] items-center">
                            <LinkIcon className="w-[30px] stroke-2 stroke-neutral-400 fill-none" />
                            <div className="flex-1 flex flex-col gap-[3px]">
                                <div>linq.com/{chat.id}</div>
                                <div className="text-sm text-neutral-400">
                                    Link
                                </div>
                            </div>
                        </div>
                        <div className="p-[10px] hover:bg-white/5 rounded-xl cursor-pointer flex gap-[30px] items-center justify-between">
                            <div className="flex gap-[30px] items-center">
                                <NotifcationIcon className="w-[30px] stroke-2 stroke-neutral-400 fill-none" />
                                <div>Notifications</div>
                            </div>
                            <Switch className="cursor-pointer" />
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col px-[10px] py-[5px]">
                        <Tabs
                            defaultValue={
                                chat.type === ChatEnum.PRIVATE
                                    ? "media"
                                    : "members"
                            }
                            className="flex-1 flex flex-col"
                        >
                            <TabsList className="flex w-full mb-[5px]">
                                {chat.type !== ChatEnum.PRIVATE && (
                                    <TabsTrigger value="members">
                                        Members
                                    </TabsTrigger>
                                )}
                                <TabsTrigger value="media">Media</TabsTrigger>
                                <TabsTrigger value="files">Files</TabsTrigger>
                                <TabsTrigger value="links">Links</TabsTrigger>
                                <TabsTrigger value="voice">Voice</TabsTrigger>
                                <TabsTrigger value="music">Music</TabsTrigger>
                                <TabsTrigger value="groups">Groups</TabsTrigger>
                            </TabsList>

                            <div className="flex-1">
                                <TabsContent value="members" className="h-full">
                                    <div className="flex flex-col gap-[2px] w-full">
                                        {chat.members.map((member, i) => (
                                            <div
                                                key={i}
                                                className="flex gap-[10px] p-[10px] items-center hover:bg-white/5 cursor-pointer rounded-xl"
                                            >
                                                <div className="w-[50px] h-[50px] bg-neutral-600 rounded-full"></div>
                                                <div className="flex flex-col">
                                                    <div className="font-semibold">
                                                        {member.user.username}
                                                    </div>
                                                    <div className="text-neutral-400 text-sm">
                                                        last seen recently
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="media" className="h-full">
                                    <div className="flex flex-wrap w-full">
                                        {Array.from({ length: 9 }).map(
                                            (_, i) => (
                                                <Image
                                                    key={i}
                                                    src="https://onetreeplanted.org/cdn/shop/articles/nature_facts_600x.jpg?v=1705008496"
                                                    alt="image"
                                                    width={500}
                                                    height={500}
                                                    className="object-cover w-1/3 aspect-square p-[1px]"
                                                />
                                            )
                                        )}
                                    </div>
                                </TabsContent>

                                <TabsContent value="files" className="h-full">
                                    <div className="flex flex-col gap-[2px] w-full">
                                        {Array.from({ length: 10 }).map(
                                            (_, i) => (
                                                <div key={i}>123</div>
                                            )
                                        )}
                                    </div>
                                </TabsContent>

                                <TabsContent value="links" className="h-full">
                                    <div className="flex flex-col gap-[2px] w-full">
                                        {Array.from({ length: 50 }).map(
                                            (_, i) => (
                                                <div key={i}>123</div>
                                            )
                                        )}
                                    </div>
                                </TabsContent>
                                <TabsContent value="voice" className="h-full">
                                    <div className="flex flex-col gap-[2px] w-full">
                                        {Array.from({ length: 50 }).map(
                                            (_, i) => (
                                                <div key={i}>123</div>
                                            )
                                        )}
                                    </div>
                                </TabsContent>
                                <TabsContent value="music" className="h-full">
                                    <div className="flex flex-col gap-[2px] w-full">
                                        {Array.from({ length: 50 }).map(
                                            (_, i) => (
                                                <div key={i}>123</div>
                                            )
                                        )}
                                    </div>
                                </TabsContent>
                                <TabsContent value="groups" className="h-full">
                                    <div className="flex flex-col gap-[2px] w-full">
                                        {Array.from({ length: 50 }).map(
                                            (_, i) => (
                                                <div key={i}>123</div>
                                            )
                                        )}
                                    </div>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChatSidebar;
