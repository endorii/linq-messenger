import { Chat, ChatMember, Contact, PinnedMessage } from "generated/prisma";

export interface IPrivateChatData {
    meMember: ChatMember;
    otherMember: ChatMember;
    contact: Contact | null;
}

export interface IBlockingInfo {
    isBlocked: boolean;
    isBlockedByOther: boolean;
    interlocutorId: string | null;
}

export interface IEnrichedChat extends Chat {
    pinnedMessages: PinnedMessage[];
    privateChat: IPrivateChatData | null;
    blockingInfo: IBlockingInfo;
}
