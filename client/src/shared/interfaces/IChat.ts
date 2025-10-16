import { MemberRole } from "../types/types";
import { IMessage } from "./IMessage";
import { IUser } from "./IUser";
import { ChatEnum } from "../enums/enums";
import { IFolderChat } from "./IFolder";
import { IChatMember } from "./IChatMember";

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

    blockingInfo?: BlockInfo;
}

interface BlockInfo {
    isBlocked: boolean;
    isBlockedByOther: boolean;
    interlocutorId: string;
}

export interface ChatPayload {
    name: string;
    type: ChatEnum;
    description?: string;
    avatar?: string;
    memberIds?: string[];
}
