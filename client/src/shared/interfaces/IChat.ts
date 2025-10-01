import { MemberRole } from "../types/types";
import { IMessage } from "./IMessage";
import { IUser } from "./IUser";
import { ChatEnum } from "../enums/enums";

export interface IChatMember {
    id: string;
    userId: string;
    chatId: string;
    role: MemberRole;
    joinedAt: string;
    lastReadAt: string;
    user: IUser;
}

export interface IChat {
    id: string;
    name?: string;
    description?: string;
    avatar?: string;
    type: ChatEnum;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;

    adminId?: string;
    admin?: IUser;

    members: IChatMember[];
    messages: IMessage[];

    lastMessageId?: string;
    lastMessage?: IMessage;
}

export interface GroupChatPayload {
    name: string;
    description?: string;
    avatar?: string;
    memberIds: string[];
}

export interface ChannelPayload extends GroupChatPayload {}
