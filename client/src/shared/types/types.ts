export type ModalType =
    | "addNewChannel"
    | "addNewGroup"
    | "addContact"
    | "addFolder"
    | "deleteChat"
    | "deleteGroup"
    | "deleteChannel"
    | null;
export type SidebarTabType = "chats" | "contacts" | "settings";
export type MemberRole = "OWNER" | "ADMIN" | "MODERATOR" | "MEMBER";
export type MessageType = "TEXT" | "IMAGE" | "FILE" | "VOICE" | "VIDEO" | "SYSTEM";
