import { IUser } from "./IUser";

export interface IContact {
    id: string;
    userId: string;
    contactId: string;
    nickname?: string | null;
    isBlocked: boolean;
    createdAt: Date;

    user?: IUser;
    contact?: IUser;
}

export interface ContactPayload {
    username: string;
    nickname?: string;
}
