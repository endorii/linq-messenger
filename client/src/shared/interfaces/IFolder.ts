import { IChat } from "./IChat";

export interface IFolder {
    id: string;
    name: string;
    icon?: string;
    order: number;
    createdAt: string;
    updatedAt: string;

    userId: string;
    chats: IFolderChat[];
}

export interface IFolderChat {
    id: string;
    chatId: string;
    folderId: string;
    addedAt: string;

    chat: IChat;
    folder: IFolder;
}

export interface FolderPayload {
    name: string;
    icon?: string | null;
}
