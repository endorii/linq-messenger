import { MessageType } from "../types/types";
import { IChat } from "./IChat";
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
    messageId: string;
    createdAt: string;
    userId: string;
    user: IUser;
}

export interface ReactionPayload {
    emoji: string;
    messageId: string;
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

    chat: IChat;
    chatId: string;

    forwardedMessageId?: string | null;
    forwardedMessage?: IMessage;

    attachments: IAttachment[];
    reactions: IMessageReaction[];
    messagesRead: IMessageRead[];

    pinnedMessages?: IPinnedMessage[];

    isMine: boolean;
}

export interface IPinnedMessage {
    id: string;
    chatId: string;
    messageId: string;
    createdAt: string;
    userId: string;

    message: IMessage;
    isMine: boolean;
}
export interface ForwardMessagePayload {
    chatIds: string[];
    messageId: string;
}

export interface ForwardMessagesPayload {
    chatIds: string[];
    messageIds: string[];
}

export interface Attachment {
    url: string;
    fileName: string;
    fileSize: number;
    mimetype: string;
}

export interface CreateMessagePayload {
    content: string;
    type?: MessageType;
    replyToId?: string;
    attachments?: Attachment[];
}
