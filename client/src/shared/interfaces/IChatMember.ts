import { IChat } from "./IChat";
import { IUser } from "./IUser";

export interface IChatMember {
    id: string;
    userId: string;
    chatId: string;
    role: MemberRole;
    joinedAt: Date;
    lastReadAt: Date;
    user: IUser;
    chat: IChat;
}

enum MemberRole {
    MEMBER = "MEMBER",
    ADMIN = "ADMIN",
    OWNER = "OWNER",
}
