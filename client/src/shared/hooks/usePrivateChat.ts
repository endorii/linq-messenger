import { useProfile } from "@/features/auth/hooks/useAuth";
import { ChatEnum } from "@/shared/enums/enums";
import { IChat } from "@/shared/interfaces/IChat";

export function usePrivateChat(chat: IChat) {
    const { data: me } = useProfile();
    const isPrivate = chat.type === ChatEnum.PRIVATE;
    const meMember = chat.privateChat?.meMember || chat.members.find((m) => m.userId === me?.id);
    const otherMember = isPrivate ? chat.privateChat?.otherMember : null;
    const contact = isPrivate ? chat.privateChat?.contact : null;
    const chatName = isPrivate
        ? contact?.nickname ||
          otherMember?.user?.firstName ||
          otherMember?.user?.username ||
          "Private Chat"
        : chat.name ?? "Unnamed Chat";

    return { isPrivate, meMember, otherMember, contact, chatName };
}
