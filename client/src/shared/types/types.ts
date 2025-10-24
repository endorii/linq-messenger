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
    | "muteChat"
    | "addMembers"
    | "forwardMessage"
    | "deleteMessages"
    | "forwardMessages"
    | "unpinAll"
    | null;
export type SidebarTabType = "chats" | "contacts" | "profile" | "search";
export type ChatSidebarTabType = "info" | "editContact" | "editChat";
export type MemberRole = "OWNER" | "ADMIN" | "MODERATOR" | "MEMBER";
export type MessageType = "TEXT" | "IMAGE" | "FILE" | "VOICE" | "VIDEO" | "SYSTEM";
export type ChatSentType = "sent" | "edit" | "reply";
export type ProfileTabType = "overview" | "notifications" | "privacy" | "language" | "edit";
export type PrivacyTabType =
    | "phoneVisibility"
    | "lastSeenVisibility"
    | "bioVisibility"
    | "voiceMessagesAndVideo"
    | "messages"
    | "addMe"
    | "usernameVisibility"
    | "overview";

export type PrivacyLevel = "NOBODY" | "MY_CONTACTS" | "EVERYBODY";
