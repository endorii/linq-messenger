import { useProfile } from "@/features/auth/hooks/useAuth";
import { useContacts } from "@/features/contacts/hooks/useContacts";
import { ChatEnum } from "@/shared/enums/enums";
import { IChat } from "@/shared/interfaces/IChat";
import { IContact } from "@/shared/interfaces/IContact";
import { IUser } from "@/shared/interfaces/IUser";
import { useMemo } from "react";
import { IChatMember } from "../interfaces/IChatMember";

type Entity = IChat | IContact | IUser;

export function useChatEntity(chat: IChat): {
    entity: Entity;
    chatName: string;
    isContact: boolean;
    contactId: string | undefined;
    otherUserId: string | null;
    meMember: IChatMember | undefined;
    isMember: boolean;
    otherMembers: IChatMember[];
    otherMember: IChatMember | undefined;
} {
    const { data: me } = useProfile();
    const { data: contacts } = useContacts();

    return useMemo(() => {
        const defaultResult = {
            entity: chat,
            chatName: chat.name || "Unknown Chat",
            isContact: false,
            contactId: undefined,
            otherUserId: null,
            meMember: undefined,
            isMember: false,
            otherMembers: [],
            otherMember: undefined,
        };

        if (!chat || !me) return defaultResult;

        const meMember = chat.members.find((m) => m.userId === me.id);
        const isMember = !!meMember;
        const otherMembers = chat.members.filter((m) => m.userId !== me.id);
        const otherMember = otherMembers[0];

        if (chat.type !== ChatEnum.PRIVATE) {
            return {
                ...defaultResult,
                meMember,
                isMember,
                otherMembers,
                otherMember,
            };
        }

        const otherUser = otherMember?.user;
        const otherUserId = otherMember?.userId || null;

        if (!otherUser || !otherUserId) {
            return {
                ...defaultResult,
                meMember,
                isMember,
                otherMembers,
                otherMember,
            };
        }

        const contact = contacts?.find((c) => c.contactId === otherUserId);

        if (contact) {
            const name = contact.nickname || otherUser.username;

            return {
                entity: contact,
                chatName: name,
                isContact: true,
                contactId: contact.contactId,
                otherUserId,
                meMember,
                isMember,
                otherMembers,
                otherMember,
            };
        }

        return {
            entity: otherUser,
            chatName: otherUser.username,
            isContact: false,
            contactId: undefined,
            otherUserId,
            meMember,
            isMember,
            otherMembers,
            otherMember,
        };
    }, [chat, me, contacts]);
}
