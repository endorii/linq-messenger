"use client";

import { useState } from "react";
import {
    BackIcon,
    ClipIcon,
    InfoIcon,
    LinkIcon,
    NotifcationIcon,
    OptionsIcon,
    PhoneIcon,
    SearchIcon,
    SendIcon,
} from "@/shared/icons";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Switch } from "@/shared/components/ui/switch";
import Image from "next/image";
import { useChat } from "@/features/chats/hooks/useChats";
import { useParams } from "next/navigation";
import { useCreateMessage } from "@/features/messages/hooks/useMessages";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import EmojiIcon from "@/shared/icons/EmojiIcon";
import { Input } from "@/shared/components/ui/input";
import MicrophoneIcon from "@/shared/icons/MicrophoneIcon";

function ChatLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { chatSlug: chatId } = useParams<{ chatSlug: string }>();
    const [inputValue, setInputValue] = useState<string>("");

    const { data: chat, isLoading: isChatLoading } = useChat(chatId);
    const useCreateMessageMutation = useCreateMessage();

    const handleSend = (inputValue: string) => {
        if (inputValue.length > 0) {
            if (!inputValue.trim()) return;
            useCreateMessageMutation.mutateAsync({
                chatId,
                messagePayload: {
                    content: inputValue,
                },
            });
            setInputValue("");
        } else {
            //Recording voice
            console.log("Voice recording");
        }
    };

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setInputValue((prev: string) => `${prev + emojiData.emoji}`);
    };

    if (!chat) return <div>Чат не знайдено</div>;

    return (
        <div className="flex w-full h-[100vh]">
            <div className="flex-1 relative">
                <div className="absolute top-0 w-full h-[65px] z-10 flex justify-between text-white bg-neutral-950 px-[20px] py-[10px] pr-[50px] cursor-pointer">
                    <div className="flex gap-[20px]">
                        <div className="w-[45px] h-[45px] rounded-full bg-neutral-600">
                            <img
                                src={chat.avatar}
                                alt="avatar"
                                className="rounded-full"
                            />
                        </div>
                        <div onClick={() => setSidebarOpen((prev) => !prev)}>
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
                <div className="h-full pt-[65px] pb-[70px] w-full">
                    {children}
                </div>
                <div className="absolute bottom-0 w-full px-[15%] flex gap-[10px] justify-between items-center py-[15px] bg-transparent">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="bg-purple-gradient rounded-xl p-[11px] cursor-pointer">
                                <ClipIcon className="w-[24px] h-[24px] fill-white" />
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-56">
                            <DropdownMenuItem>Photo or Video</DropdownMenuItem>
                            <DropdownMenuItem>Document</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="w-full relative rounded-xl group bg-transparent focus-within:bg-gradient-to-br focus-within:from-violet-600 focus-within:to-indigo-600 p-[2px] transition-all duration-300">
                        <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Write your message..."
                            className="py-[10px] px-[20px] rounded-xl w-full bg-neutral-950 focus:bg-neutral-950 focus:border-white border-none h-auto pr-[60px]"
                        />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="absolute top-[12px] right-[15px] transition-all duration-300 cursor-pointer">
                                    <EmojiIcon className="w-[20px] h-[20px] fill-neutral-400 group-focus-within:fill-white" />
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="p-0 border-none shadow-lg">
                                <EmojiPicker
                                    onEmojiClick={handleEmojiClick}
                                    autoFocusSearch={false}
                                    theme={Theme.DARK}
                                />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <button
                        onClick={() => handleSend(inputValue)}
                        className="bg-purple-gradient rounded-xl p-[23px] cursor-pointer flex items-center justify-center"
                    >
                        <SendIcon
                            className={`absolute w-[26px] h-[26px] fill-none stroke-2 stroke-white transition-all duration-200 ${
                                inputValue.length > 0
                                    ? "opacity-100 scale-100"
                                    : "opacity-0 scale-75"
                            }`}
                        />

                        <MicrophoneIcon
                            className={`absolute w-[26px] h-[26px] fill-none stroke-2 stroke-white transition-all duration-200 ${
                                inputValue.length === 0
                                    ? "opacity-100 scale-100"
                                    : "opacity-0 scale-75"
                            }`}
                        />
                    </button>
                </div>
            </div>

            <div
                className={`overflow-y-auto bg-neutral-950 border-l border-neutral-800 text-white transition-all duration-400 ease-in-out ${
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
                                {chat.type === "PRIVATE"
                                    ? "User information"
                                    : chat.type === "GROUP"
                                    ? "Group information"
                                    : chat.type === "CHANNEL"
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
                                    {chat.type === "PRIVATE"
                                        ? "last seen recently"
                                        : `${
                                              chat.members?.length || 0
                                          } members`}
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
                                    chat.type === "PRIVATE"
                                        ? "media"
                                        : "members"
                                }
                                className="flex-1 flex flex-col"
                            >
                                <TabsList className="flex w-full mb-[5px]">
                                    {chat.type !== "PRIVATE" && (
                                        <TabsTrigger value="members">
                                            Members
                                        </TabsTrigger>
                                    )}
                                    <TabsTrigger value="media">
                                        Media
                                    </TabsTrigger>
                                    <TabsTrigger value="files">
                                        Files
                                    </TabsTrigger>
                                    <TabsTrigger value="links">
                                        Links
                                    </TabsTrigger>
                                    <TabsTrigger value="voice">
                                        Voice
                                    </TabsTrigger>
                                    <TabsTrigger value="music">
                                        Music
                                    </TabsTrigger>
                                    <TabsTrigger value="groups">
                                        Groups
                                    </TabsTrigger>
                                </TabsList>

                                <div className="flex-1">
                                    <TabsContent
                                        value="members"
                                        className="h-full"
                                    >
                                        <div className="flex flex-col gap-[2px] w-full">
                                            {chat.members.map((member, i) => (
                                                <div
                                                    key={i}
                                                    className="flex gap-[10px] p-[10px] items-center hover:bg-white/5 cursor-pointer rounded-xl"
                                                >
                                                    <div className="w-[50px] h-[50px] bg-neutral-600 rounded-full"></div>
                                                    <div className="flex flex-col">
                                                        <div className="font-semibold">
                                                            {
                                                                member.user
                                                                    .username
                                                            }
                                                        </div>
                                                        <div className="text-neutral-400 text-sm">
                                                            last seen recently
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </TabsContent>

                                    <TabsContent
                                        value="media"
                                        className="h-full"
                                    >
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

                                    <TabsContent
                                        value="files"
                                        className="h-full"
                                    >
                                        <div className="flex flex-col gap-[2px] w-full">
                                            {Array.from({ length: 10 }).map(
                                                (_, i) => (
                                                    <div key={i}>123</div>
                                                )
                                            )}
                                        </div>
                                    </TabsContent>

                                    <TabsContent
                                        value="links"
                                        className="h-full"
                                    >
                                        <div className="flex flex-col gap-[2px] w-full">
                                            {Array.from({ length: 50 }).map(
                                                (_, i) => (
                                                    <div key={i}>123</div>
                                                )
                                            )}
                                        </div>
                                    </TabsContent>
                                    <TabsContent
                                        value="voice"
                                        className="h-full"
                                    >
                                        <div className="flex flex-col gap-[2px] w-full">
                                            {Array.from({ length: 50 }).map(
                                                (_, i) => (
                                                    <div key={i}>123</div>
                                                )
                                            )}
                                        </div>
                                    </TabsContent>
                                    <TabsContent
                                        value="music"
                                        className="h-full"
                                    >
                                        <div className="flex flex-col gap-[2px] w-full">
                                            {Array.from({ length: 50 }).map(
                                                (_, i) => (
                                                    <div key={i}>123</div>
                                                )
                                            )}
                                        </div>
                                    </TabsContent>
                                    <TabsContent
                                        value="groups"
                                        className="h-full"
                                    >
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
        </div>
    );
}

export default ChatLayout;
