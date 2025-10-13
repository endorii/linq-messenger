import { MemberRole } from "../types/types";
import { IMessage } from "./IMessage";
import { IUser } from "./IUser";
import { ChatEnum } from "../enums/enums";
import { IFolder, IFolderChat } from "./IFolder";

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

    folders: IFolderChat[];

    lastMessageId?: string;
    lastMessage?: IMessage;
}

export interface ChatPayload {
    name: string;
    type: ChatEnum;
    description?: string;
    avatar?: string;
    memberIds?: string[];
}
