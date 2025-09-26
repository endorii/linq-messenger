import { IChat } from "./IChat";

export interface IChatFolder {
    id: string;
    name: string;
    icon?: string;
    order: number;
    createdAt: string;
    updatedAt: string;

    userId: string;
    chats: IChat[];
}

export interface FolderPayload {
    name: string;
    icon?: string | null;
}
