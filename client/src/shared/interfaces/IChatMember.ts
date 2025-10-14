import { MemberRole } from "../types/types";
import { IChat } from "./IChat";
import { IUser } from "./IUser";

export interface IChatMember {
    id: string;
    userId: string;
    chatId: string;
    role: MemberRole;
    joinedAt: Date;
    lastReadAt: Date;

    isMarked: boolean;
    isMuted: boolean;
    muteUntil: Date | null;

    user?: IUser;
    chat?: IChat;
}
