import { IContact } from "./IContact";
import { IPrivacySettings } from "./IPrivacySettings";

export interface IUser {
    id: string;
    username: string;
    email: string;
    biography?: string;
    phone?: string;
    firstName: string;
    lastName?: string;
    avatarUrl?: string;
    isOnline: boolean;
    lastSeenAt?: string;
    createdAt: string;
    updatedAt: string;
    isVerified: boolean;
    privacySettings?: IPrivacySettings;
    contacts?: IContact[];
}
