export interface IChat {
    id: string;
    name: string | null;
    description: string | null;
    avatar: string | null;
    type: "PRIVATE" | "GROUP" | "CHANNEL";
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    adminId: string | null;
    lastMessageId: string | null;
}
