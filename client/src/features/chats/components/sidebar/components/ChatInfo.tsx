"use client";
import { useProfile } from "@/features/auth/hooks/useAuth";
import { useCreatePrivateChat } from "@/features/chats/hooks/useChats";
import { ButtonActive, ButtonIcon } from "@/shared/components/ui/buttons";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/shared/components/ui/tabs";
import { ChatEnum } from "@/shared/enums/enums";
import { usePrivateChat } from "@/shared/hooks";
import {
    AtSignIcon,
    BackIcon,
    EditIcon,
    InfoIcon,
    LinkIcon,
} from "@/shared/icons";
import { AddContactIcon } from "@/shared/icons/AddContactIcon";
import { OwnerIcon } from "@/shared/icons/OwnerIcon";
import { IChat } from "@/shared/interfaces";
import { useChatSidebarStore, useModalStore, useSelectionStore } from "@/store";
import { NotificationSwitch } from "../ui/NotificationSwitch";

export function ChatInfo({ chat }: { chat: IChat }) {
    const { isPrivate, meMember, otherMember, contact, chatName } =
        usePrivateChat(chat);

    const { data: me } = useProfile();

    const { setActiveModal } = useModalStore();
    const { setSelectedUser } = useSelectionStore();
    const { setChatSidebarOpened, setChatSidebarTab } = useChatSidebarStore();
    const createPrivateChatMutation = useCreatePrivateChat();

    const isGroupChat = chat.type === ChatEnum.GROUP;
    const isChannel = chat.type === ChatEnum.CHANNEL;
    const isAdmin = chat.adminId === me?.id;

    const canViewMembers =
        !isPrivate && ((!isChannel && chat.members.length < 50) || isAdmin);

    const showBio =
        isPrivate &&
        otherMember?.user?.biography &&
        (otherMember.user.privacySettings?.bioVisibility === "EVERYBODY" ||
            (otherMember.user.privacySettings?.bioVisibility ===
                "MY_CONTACTS" &&
                otherMember.user.contacts?.some(
                    (contact) => contact.contactId === meMember?.userId
                )));

    const handleAddContact = () => {
        if (otherMember?.user) {
            setSelectedUser(otherMember.user);
            setActiveModal("addContact");
        }
    };

    const handleEditContact = () => {
        setChatSidebarTab("editContact");
    };

    const handleEditChat = () => {
        setChatSidebarTab("editChat");
    };

    const handleOpenOrCreatePrivateChat = (otherMemberId: string) => {
        createPrivateChatMutation.mutateAsync(otherMemberId);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex gap-[20px] justify-between p-[10px]">
                <div className="flex gap-[20px] items-center">
                    <ButtonIcon onClick={() => setChatSidebarOpened(false)}>
                        <BackIcon className="w-[24px] stroke-neutral-900 dark:stroke-white stroke-[2.5] rotate-180 fill-none" />
                    </ButtonIcon>
                    <div className="text-xl font-semibold text-nowrap">
                        {isPrivate
                            ? "User information"
                            : isGroupChat
                            ? "Group information"
                            : isChannel
                            ? "Channel information"
                            : "Chat information"}
                    </div>
                </div>

                {isPrivate && contact ? (
                    <ButtonIcon onClick={handleEditContact}>
                        <EditIcon className="w-[26px] h-[26px] stroke-2 stroke-neutral-900 dark:stroke-white fill-none " />
                    </ButtonIcon>
                ) : isPrivate ? (
                    <ButtonIcon onClick={handleAddContact}>
                        <AddContactIcon className="w-[26px] h-[26px] stroke-2 stroke-neutral-900 dark:stroke-white fill-none " />
                    </ButtonIcon>
                ) : !isPrivate && isAdmin ? (
                    <ButtonIcon onClick={handleEditChat}>
                        <EditIcon className="w-[26px] h-[26px] stroke-2 stroke-neutral-900 dark:stroke-white fill-none " />
                    </ButtonIcon>
                ) : null}
            </div>

            <div className="flex flex-col gap-[20px] items-center p-[20px]">
                <img
                    src={isPrivate ? otherMember?.user?.avatarUrl : chat.avatar}
                    alt="avatar"
                    className="w-[150px] h-[150px] bg-neutral-600 rounded-full object-cover"
                />

                <div className="flex flex-col gap-[5px] items-center text-center">
                    <div className="text-xl font-semibold">{chatName}</div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        {isPrivate
                            ? "last seen recently"
                            : `${chat.members?.length || 0} members`}
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-[5px] px-[20px] py-[10px]">
                {chat.description ? (
                    <div className="p-[10px] hover:bg-neutral-900/5 dark:hover:bg-white/5 rounded-xl cursor-pointer flex gap-[30px] items-center">
                        <InfoIcon className="w-[30px] stroke-2 stroke-neutral-400 dark:stroke-white/70 fill-none" />
                        <div className="flex-1 flex flex-col gap-[3px]">
                            <div>{chat.description}</div>
                            <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                Info
                            </div>
                        </div>
                    </div>
                ) : showBio ? (
                    <div className="p-[10px] hover:bg-neutral-900/5 dark:hover:bg-white/5 rounded-xl cursor-pointer flex gap-[30px] items-center">
                        <InfoIcon className="w-[30px] stroke-2 stroke-neutral-400 dark:stroke-white/70 fill-none" />
                        <div className="flex-1 flex flex-col gap-[3px]">
                            <div>{otherMember.user?.biography}</div>
                            <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                Bio
                            </div>
                        </div>
                    </div>
                ) : null}

                {chat.type === ChatEnum.CHANNEL ? (
                    <div className="p-[10px] hover:bg-neutral-900/5 dark:hover:bg-white/5 rounded-xl cursor-pointer flex gap-[30px] items-center">
                        <LinkIcon className="w-[30px] stroke-2 stroke-neutral-400 dark:stroke-white/70 fill-none" />
                        <div className="flex-1 flex flex-col gap-[3px]">
                            <div>linq.com/{chat.id}</div>
                            <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                Link
                            </div>
                        </div>
                    </div>
                ) : isPrivate && otherMember ? (
                    <div className="p-[10px] hover:bg-neutral-900/5 dark:hover:bg-white/5 rounded-xl cursor-pointer flex gap-[30px] items-center">
                        <AtSignIcon className="w-[30px] stroke-2 stroke-neutral-400 dark:stroke-white/70 fill-none" />
                        <div className="flex-1 flex flex-col gap-[3px]">
                            <div>@{otherMember.user?.username}</div>
                            <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                username
                            </div>
                        </div>
                    </div>
                ) : null}
                {meMember && (
                    <NotificationSwitch chatId={chat.id} meMember={meMember} />
                )}
            </div>

            <div className="flex-1 flex flex-col px-[10px] py-[5px] overflow-y-auto">
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
                                        className="flex gap-[10px] p-[10px] items-center hover:bg-neutral-900/5 dark:hover:bg-white/5 cursor-pointer rounded-xl"
                                        onClick={() =>
                                            handleOpenOrCreatePrivateChat(
                                                member.userId
                                            )
                                        }
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
                                                    <OwnerIcon className="w-[20px] stroke-2 stroke-blue-500 dark:stroke-violet-500 fill-none" />
                                                )}
                                            </div>
                                            <div className="text-neutral-500 dark:text-neutral-400 text-sm">
                                                last seen recently
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                    )}

                    <TabsContent value="media" className="h-full">
                        <div className="flex flex-wrap w-full">media</div>
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
                {!isPrivate && (
                    <ButtonActive
                        className="bottom-4 left-4"
                        onClick={() => setActiveModal("addMembers")}
                    >
                        <AddContactIcon className="w-[30px] stroke-white stroke-2 fill-none" />
                    </ButtonActive>
                )}
            </div>
        </div>
    );
}
