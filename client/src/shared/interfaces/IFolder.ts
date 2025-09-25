import { IChat } from "./IChat";

export interface IFolder {
    id: string;
    name: string;
    icon?: string | null;
    createdAt: Date;
    updatedAt: Date;
    chats: IChat[];
}

export interface FolderPayload {
    name: string;
    icon?: string | null;
}
