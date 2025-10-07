import { useProfile } from "@/features/auth/hooks/useAuth";
import { useContacts } from "@/features/contacts/hooks/useContacts";
import { ChatEnum } from "@/shared/enums/enums";
import { IChat } from "@/shared/interfaces/IChat";
import { IContact } from "@/shared/interfaces/IContact";
import { IUser } from "@/shared/interfaces/IUser";
import { useMemo } from "react";

type Entity = IChat | IContact | IUser;

export function useChatEntity(chat: IChat): {
    entity: Entity;
    chatName: string;
    isContact: boolean;
    contactId: string | undefined;
    otherUserId: string | null;
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
        };

        if (chat.type !== ChatEnum.PRIVATE || !me) {
            return defaultResult;
        }

        // 1. Знаходимо іншого учасника чату
        const otherMember = chat.members.find((m) => m.userId !== me.id);
        const otherUser = otherMember?.user;
        const otherUserId = otherMember?.userId || null;

        if (!otherUser || !otherUserId) {
            return defaultResult;
        }

        // 2. Шукаємо запис контакту
        const contact = contacts?.find((c) => c.contactId === otherUserId);

        if (contact) {
            // Це контакт
            const name = contact.nickname || otherUser.username;

            return {
                entity: contact,
                chatName: name,
                isContact: true,
                contactId: contact.contactId,
                otherUserId: otherUserId,
            };
        }

        // 3. Це не контакт, але користувач знайдений
        const name = otherUser.username;

        return {
            entity: otherUser,
            chatName: name,
            isContact: false,
            contactId: undefined,
            otherUserId: otherUserId,
        };
    }, [chat, me, contacts]);
}
