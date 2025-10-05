export type ModalType =
    | "addNewChannel"
    | "addNewGroup"
    | "addContact"
    | "addFolder"
    | "editFolder"
    | "deleteChat"
    | "deleteGroup"
    | "deleteChannel"
    | null;
export type SidebarTabType = "chats" | "contacts" | "settings" | "profile";
export type ChatSidebarTabType = "info" | "editContact";
export type MemberRole = "OWNER" | "ADMIN" | "MODERATOR" | "MEMBER";
export type MessageType = "TEXT" | "IMAGE" | "FILE" | "VOICE" | "VIDEO" | "SYSTEM";
