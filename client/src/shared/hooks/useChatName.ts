import { useProfile } from "@/features/auth/hooks/useAuth";
import { useContacts } from "@/features/contacts/hooks/useContacts";
import { ChatEnum } from "@/shared/enums/enums";
import { IChat } from "@/shared/interfaces/IChat";
import { useMemo } from "react";

export function useChatName(chat: IChat) {
    const { data: me } = useProfile();
    const { data: contacts } = useContacts();

    return useMemo(() => {
        if (chat.type === ChatEnum.PRIVATE && me) {
            const otherMember = chat.members.find((m) => m.userId !== me.id);

            if (otherMember?.user) {
                const contact = contacts?.find((c) => c.contactId === otherMember.userId);
                return contact?.nickname || otherMember.user.username;
            }
        }

        return chat.name || "Unknown chat";
    }, [chat, me, contacts]);
}
