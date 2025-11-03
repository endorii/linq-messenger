import { useProfile } from "@/features/auth/hooks/useAuth";
import { ChatEnum } from "@/shared/enums/enums";
import { IChat } from "@/shared/interfaces/IChat";

export function usePrivateChat(chat: IChat | null) {
    const { data: me } = useProfile();

    if (!chat) {
        return {
            isPrivate: false,
            meMember: null,
            otherMember: null,
            contact: null,
            chatName: "",
        };
    }

    const isPrivate = chat.type === ChatEnum.PRIVATE;

    const meMember =
        chat.privateChat?.meMember || chat.members.find((m) => m.userId === me?.id) || null;

    const otherMember = isPrivate ? chat.privateChat?.otherMember || null : null;
    const contact = isPrivate ? chat.privateChat?.contact || null : null;

    let chatName: string;

    if (isPrivate) {
        const user = otherMember?.user;

        if (contact) {
            const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
            chatName = contact.nickname || fullName || user?.username || "Private Chat";
        } else {
            const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
            chatName = fullName || user?.username || "Private Chat";
        }
    } else {
        chatName = chat.name ?? "Unnamed Chat";
    }

    return { isPrivate, meMember, otherMember, contact, chatName };
}
