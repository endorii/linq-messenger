import { MemberRole } from "../types/types";
import { IMessage, IPinnedMessage } from "./IMessage";
import { IUser } from "./IUser";
import { ChatEnum } from "../enums/enums";
import { IFolderChat } from "./IFolder";
import { IChatMember } from "./IChatMember";
import { IContact } from "./IContact";

export interface IChat {
    id: string;
    name?: string;
    description?: string;
    avatar?: string;
    type: ChatEnum;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;

    uniqueLink?: string;
    background?: string;

    adminId?: string;
    admin?: IUser;

    members: IChatMember[];
    messages: IMessage[];

    pinnedMessages: IPinnedMessage[];

    folders: IFolderChat[];

    lastMessageId?: string;
    lastMessage?: IMessage;

    blockingInfo?: BlockInfo;
    privateChat?: IPrivateChatData | null;

    unreadCount: number;
}

export interface BlockInfo {
    isBlocked: boolean;
    isBlockedByOther: boolean;
    interlocutorId: string;
}

export interface IPrivateChatData {
    meMember: IChatMember;
    otherMember: IChatMember;
    contact: IContact | null;
}

export interface ChatPayload {
    name: string;
    type: ChatEnum;
    description?: string;
    avatar?: string;
    memberIds?: string[];
}
