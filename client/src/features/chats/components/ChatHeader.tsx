"use client";

import { useChatName } from "@/shared/hooks/useChatName";
import { useContacts } from "@/features/contacts/hooks/useContacts";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { ChatEnum } from "@/shared/enums/enums";
import { OptionsIcon, PhoneIcon, SearchIcon } from "@/shared/icons";
import { IChat } from "@/shared/interfaces/IChat";

function ChatHeader({
    chat,
    setSidebarOpen,
}: {
    chat: IChat;
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const chatName = useChatName(chat);
    const { data: contacts } = useContacts();

    const isPrivate = chat.type === ChatEnum.PRIVATE;

    const DESTRUCTIVE_ACTIONS = {
        [ChatEnum.PRIVATE]: { label: "Delete chat", onClick: () => {} },
        [ChatEnum.GROUP]: { label: "Leave group", onClick: () => {} },
        [ChatEnum.CHANNEL]: {
            label: "Leave channel",
            onClick: () => {},
        },
    } as const;

    const destructiveAction = DESTRUCTIVE_ACTIONS[chat.type];

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
                    <div className="font-semibold">{chatName}</div>
                    <div className="text-sm text-neutral-400">
                        {chat.type === ChatEnum.PRIVATE
                            ? "last seen recently"
                            : `${chat.members?.length || 0} members`}
                    </div>
                </div>
            </div>
            <div className="flex gap-[25px]">
                {chat.type === ChatEnum.PRIVATE ? (
                    <button>
                        <PhoneIcon className="w-[24px] stroke-neutral-300 stroke-[2.5]" />
                    </button>
                ) : null}
                <button>
                    <SearchIcon className="w-[24px] stroke-neutral-300 stroke-[2.5]" />
                </button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="cursor-pointer">
                            <OptionsIcon className="w-[21px] fill-neutral-300" />
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-56">
                        {isPrivate &&
                        contacts?.some(
                            (contact) =>
                                contact.contactId === chat.members[1]?.userId
                        ) ? (
                            <DropdownMenuItem>Edit contact</DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem>Add contact</DropdownMenuItem>
                        )}
                        {chat.type === ChatEnum.PRIVATE && (
                            <DropdownMenuItem>Video Call</DropdownMenuItem>
                        )}
                        <DropdownMenuItem>Mute</DropdownMenuItem>
                        <DropdownMenuItem>Select messages</DropdownMenuItem>
                        {chat.type === ChatEnum.PRIVATE && (
                            <DropdownMenuItem>Block user</DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {destructiveAction && (
                            <DropdownMenuItem
                                variant="destructive"
                                onClick={destructiveAction.onClick}
                            >
                                {destructiveAction.label}
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}

export default ChatHeader;
