export type ModalType =
    | "addNewChannel"
    | "addNewGroup"
    | "addContact"
    | "addFolder"
    | "editFolder"
    | "deleteChat"
    | "deleteGroup"
    | "deleteChannel"
    | "deleteMessage"
    | null;
export type SidebarTabType = "chats" | "contacts" | "settings" | "profile" | "search";
export type ChatSidebarTabType = "info" | "editContact" | "editChat";
export type MemberRole = "OWNER" | "ADMIN" | "MODERATOR" | "MEMBER";
export type MessageType = "TEXT" | "IMAGE" | "FILE" | "VOICE" | "VIDEO" | "SYSTEM";
export type ChatSentType = "sent" | "edit" | "reply";
