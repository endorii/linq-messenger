export interface IUser {
    id: string;
    username: string;
    email: string;
    phone?: string;
    firstName: string;
    lastName?: string;
    avatarUrl?: string;
    isOnline: boolean;
    lastSeenAt?: string;
    createdAt: string;
    updatedAt: string;
    isVerified: boolean;
}
