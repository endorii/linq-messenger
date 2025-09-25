export interface IUser {
    id: string;
    username: string;
    email: string;
    phone: string | null;
    firstName: string;
    lastName: string | null;
    avatarUrl: string | null;
    lastSeenAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    isVerified: boolean;
}
