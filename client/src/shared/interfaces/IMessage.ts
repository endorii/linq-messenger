import { MessageType } from "../types/types";
import { IUser } from "./IUser";

export interface IAttachment {
    id: string;
    url: string;
    fileName?: string;
    fileSize?: number;
    mimetype?: string;
}

export interface IMessageReaction {
    id: string;
    emoji: string;
    createdAt: string;
    userId: string;
    user: IUser;
}

export interface IMessageRead {
    id: string;
    userId: string;
    readAt: string;
    user: IUser;
}

export interface IMessage {
    id: string;
    content: string;
    type: MessageType;
    systemData?: Record<string, unknown>;
    replyToId?: string;
    replyTo?: IMessage;
    editedAt?: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;

    senderId: string;
    sender: IUser;

    chatId: string;

    attachments: IAttachment[];
    reactions: IMessageReaction[];
    messagesRead: IMessageRead[];

    isMine: boolean;
}

export interface MessagePayload {
    content: string;
    type?: MessageType;
    replyToId?: string;
}
