"use client";

import { useChatEntity } from "@/shared/hooks/useChatEntity";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/shared/components/ui/tabs";
import { ChatEnum } from "@/shared/enums/enums";
import {
    AtSignIcon,
    BackIcon,
    EditIcon,
    InfoIcon,
    LinkIcon,
    NotifcationIcon,
} from "@/shared/icons";
import AddContactIcon from "@/shared/icons/AddContactIcon";
import { IChat } from "@/shared/interfaces/IChat";
import { Switch } from "@/shared/components/ui/switch";
import { useSidebarStore } from "@/store/sidebarStore";
import { useProfile } from "@/features/auth/hooks/useAuth";
import OwnerIcon from "@/shared/icons/OwnerIcon";
import NotificationSwitch from "./NotificationSwitch";

function ChatSidebarInfo({ chat }: { chat: IChat }) {
    const { entity, chatName, isContact, otherUserId, meMember } =
        useChatEntity(chat);
    const { data: me } = useProfile();

    const {
        setChatSidebarOpened,
        setChatSidebarTab,
        setActiveModal,
        setSelectedUser,
    } = useSidebarStore();

    const isPrivateChat = chat.type === ChatEnum.PRIVATE;
    const isGroupChat = chat.type === ChatEnum.GROUP;
    const isChannel = chat.type === ChatEnum.CHANNEL;
    const isAdmin = chat.adminId === me?.id;
    const canViewMembers = !isChannel || chat.members.length < 50 || isAdmin;

    const otherMember = isPrivateChat
        ? chat.members.find((m) => m.userId === otherUserId)
        : null;

    const handleAddContact = () => {
        if (otherUserId && "username" in entity) {
            setSelectedUser(entity);
            setActiveModal("addContact");
        }
    };

    return (
        <div className="flex flex-col h-full relative">
            <div className="flex gap-[20px] justify-between p-[18px]">
                <div className="flex gap-[20px] items-center">
                    <button onClick={() => setChatSidebarOpened(false)}>
                        <BackIcon className="rotate-180 w-[26px] fill-none stroke-2 stroke-white cursor-pointer" />
                    </button>
                    <div className="text-xl font-semibold text-nowrap">
                        {isPrivateChat
                            ? "User information"
                            : isGroupChat
                            ? "Group information"
                            : isChannel
                            ? "Channel information"
                            : "Chat information"}
                    </div>
                </div>

                {isPrivateChat && isContact ? (
                    <button
                        onClick={() => {
                            setChatSidebarTab("editContact");
                        }}
                    >
                        <EditIcon className="w-[26px] h-[26px] stroke-2 stroke-white fill-none " />
                    </button>
                ) : isPrivateChat ? (
                    <button onClick={handleAddContact}>
                        <AddContactIcon className="w-[26px] h-[26px] stroke-2 stroke-white fill-none " />
                    </button>
                ) : null}
            </div>

            <div className="flex flex-col gap-[20px] items-center p-[20px]">
                <div className="w-[150px] h-[150px] bg-neutral-600 rounded-full overflow-hidden">
                    <img
                        src={
                            isPrivateChat
                                ? otherMember?.user?.avatarUrl
                                : chat.avatar
                        }
                        alt="avatar2"
                        className="rounded-full"
                    />
                </div>
                <div className="flex flex-col gap-[5px] items-center text-center">
                    <div className="text-xl font-semibold">{chatName}</div>
                    <div className="text-sm text-neutral-400">
                        {isPrivateChat
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
                            <div className="text-sm text-neutral-400">Info</div>
                        </div>
                    </div>
                )}
                {chat.type === ChatEnum.CHANNEL ? (
                    <div className="p-[10px] hover:bg-white/5 rounded-xl cursor-pointer flex gap-[30px] items-center">
                        <LinkIcon className="w-[30px] stroke-2 stroke-neutral-400 fill-none" />
                        <div className="flex-1 flex flex-col gap-[3px]">
                            <div>linq.com/{chat.id}</div>
                            <div className="text-sm text-neutral-400">Link</div>
                        </div>
                    </div>
                ) : isPrivateChat && otherMember ? (
                    <div className="p-[10px] hover:bg-white/5 rounded-xl cursor-pointer flex gap-[30px] items-center">
                        <AtSignIcon className="w-[30px] stroke-2 stroke-neutral-400 fill-none" />
                        <div className="flex-1 flex flex-col gap-[3px]">
                            <div>@{otherMember.user?.username}</div>
                            <div className="text-sm text-neutral-400">
                                username
                            </div>
                        </div>
                    </div>
                ) : null}
                {meMember && (
                    <NotificationSwitch chatId={chat.id} meMember={meMember} />
                )}
            </div>

            <div className="flex-1 flex flex-col px-[10px] py-[5px]">
                <Tabs
                    defaultValue={canViewMembers ? "members" : "media"}
                    className="flex-1 flex flex-col"
                >
                    <TabsList className="flex w-full mb-[5px]">
                        {canViewMembers && (
                            <TabsTrigger value="members">Members</TabsTrigger>
                        )}
                        <TabsTrigger value="media">Media</TabsTrigger>
                        <TabsTrigger value="files">Files</TabsTrigger>
                        <TabsTrigger value="links">Links</TabsTrigger>
                        <TabsTrigger value="voice">Voice</TabsTrigger>
                        <TabsTrigger value="music">Music</TabsTrigger>
                    </TabsList>

                    {canViewMembers && (
                        <TabsContent value="members" className="h-full">
                            <div className="flex flex-col gap-[2px] w-full">
                                {chat.members?.map((member, i) => (
                                    <div
                                        key={member.userId || i}
                                        className="flex gap-[10px] p-[10px] items-center hover:bg-white/5 cursor-pointer rounded-xl"
                                    >
                                        <div className="w-[50px] h-[50px] bg-neutral-600 rounded-full overflow-hidden">
                                            <img
                                                src={member.user?.avatarUrl}
                                                alt="a"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex gap-[7px] font-semibold items-center">
                                                <div>
                                                    {member.user?.username}
                                                </div>
                                                {member.role === "OWNER" && (
                                                    <OwnerIcon className="w-[20px] stroke-2 stroke-violet-500 fill-none" />
                                                )}
                                            </div>
                                            <div className="text-neutral-400 text-sm">
                                                last seen recently
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                    )}

                    <TabsContent value="media" className="h-full">
                        <div className="flex flex-wrap w-full">
                            {/* {Array.from({ length: 9 }).map((_, i) => (
                                <Image
                                    key={i}
                                    src="https://onetreeplanted.org/cdn/shop/articles/nature_facts_600x.jpg?v=1705008496"
                                    alt="image"
                                    width={500}
                                    height={500}
                                    className="object-cover w-1/3 aspect-square p-[1px]"
                                />
                            ))} */}
                            media
                        </div>
                    </TabsContent>
                    <TabsContent value="files" className="h-full">
                        <div className="flex flex-wrap w-full">files</div>
                    </TabsContent>
                    <TabsContent value="links" className="h-full">
                        <div className="flex flex-wrap w-full">links</div>
                    </TabsContent>
                    <TabsContent value="voice" className="h-full">
                        <div className="flex flex-wrap w-full">voice</div>
                    </TabsContent>
                    <TabsContent value="music" className="h-full">
                        <div className="flex flex-wrap w-full">music</div>
                    </TabsContent>
                </Tabs>
            </div>
            <button
                className="absolute bottom-4 left-4 bg-purple-gradient rounded-xl p-[8px] cursor-pointer"
                onClick={() => setActiveModal("addMembers")}
            >
                <AddContactIcon className="w-[30px] stroke-white stroke-2 fill-none" />
            </button>
        </div>
    );
}

export default ChatSidebarInfo;
