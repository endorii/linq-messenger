export interface IMessage {
    id: string;
    content: string;
    type: "TEXT" | "IMAGE" | "FILE" | "VOICE" | "VIDEO" | "SYSTEM";
    systemData: any | null;
    replyToId: string | null;
    editedAt: Date | null;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    senderId: string;
    chatId: string;
}
