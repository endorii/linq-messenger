import { useProfile } from "@/features/auth/hooks/useAuth";
import { useContacts } from "@/features/contacts/hooks/useContacts";
import { ChatEnum } from "@/shared/enums/enums";
import { IChat } from "@/shared/interfaces";
import { useMemo } from "react";

interface ChatItemProps {
    chat: IChat;
    isSelected: boolean;
    onSelect: (chatId: string) => void;
}

export const ModalChatItem = ({
    chat,
    isSelected,
    onSelect,
}: ChatItemProps) => {
    const { data: me } = useProfile();
    const { data: contacts } = useContacts();

    const isPrivate = chat.type === ChatEnum.PRIVATE;
    const otherMember = isPrivate
        ? chat.members.find((m) => m.userId !== me?.id)
        : null;

    const chatName = useMemo(() => {
        if (!isPrivate) return chat.name || "Unnamed Chat";

        const user = otherMember?.user;
        if (!user) return "Private Chat";

        const contact = contacts?.find(
            (c) => c.contactId === otherMember?.userId
        );

        if (contact) {
            const fullName = [user.firstName, user.lastName]
                .filter(Boolean)
                .join(" ");
            return contact.nickname || fullName || user.username;
        }

        const fullName = [user.firstName, user.lastName]
            .filter(Boolean)
            .join(" ");
        return fullName || user.username;
    }, [isPrivate, otherMember, contacts, chat.name]);

    return (
        <div
            className={`flex gap-[10px] text-white hover:bg-white/5 p-[10px] rounded-xl cursor-pointer ${
                isSelected ? "bg-purple-gradient" : "bg-transparent"
            }`}
            onClick={() => onSelect(chat.id)}
        >
            <div className="w-[55px] h-[55px] bg-neutral-600 rounded-full flex-shrink-0 overflow-hidden">
                <img
                    src={isPrivate ? otherMember?.user?.avatarUrl : chat.avatar}
                    alt="avatar"
                    className="rounded-full w-full h-full object-cover"
                />
            </div>

            <div className="flex flex-col justify-between flex-1 min-w-0">
                <div className="flex justify-between gap-[5px]">
                    <div className="flex gap-[5px] font-semibold truncate items-center">
                        <div className="truncate">{chatName}</div>
                    </div>
                </div>

                <div className="flex gap-[10px] items-center justify-between">
                    <div>123</div>
                </div>
            </div>
        </div>
    );
};
