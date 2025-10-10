import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ChatSentType, ChatSidebarTabType, ModalType, SidebarTabType } from "@/shared/types/types";
import { IFolder } from "@/shared/interfaces/IFolder";
import { IUser } from "@/shared/interfaces/IUser";
import { IChat } from "@/shared/interfaces/IChat";
import { IMessage } from "@/shared/interfaces/IMessage";

interface SidebarState {
    activeModal: ModalType | null;
    selectedFolder: IFolder | null;
    selectedChat: IChat | null;
    chatSidebarOpened: boolean;
    chatSidebarTab: ChatSidebarTabType;
    activeSidebarFolder: string;
    selectedUser: IUser | null;
    selectedMessage: IMessage | null;
    chatSentType: ChatSentType;
    sidebarTab: SidebarTabType;

    setActiveModal: (modal: ModalType | null) => void;
    setSelectedFolder: (folder: IFolder | null) => void;
    setSelectedChat: (chat: IChat | null) => void;
    setChatSidebarOpened: (state: boolean) => void;
    setChatSidebarTab: (tab: ChatSidebarTabType) => void;
    setSelectedUser: (user: IUser | null) => void;
    setSelectedMessage: (message: IMessage | null) => void;
    setChatSentType: (type: ChatSentType) => void;
    setSidebarTab: (tab: SidebarTabType) => void;
}

export const useSidebarStore = create<SidebarState>()(
    devtools(
        (set) => ({
            activeModal: null,
            selectedFolder: null,
            chatSidebarOpened: false,
            chatSidebarTab: "info",
            activeSidebarFolder: "allChats",
            selectedChat: null,
            selectedUser: null,
            selectedMessage: null,
            chatSentType: "sent",
            sidebarTab: "chats",

            setActiveModal: (modal) => set({ activeModal: modal }),
            setSelectedFolder: (folder) => set({ selectedFolder: folder }),
            setSelectedChat: (chat) => set({ selectedChat: chat }),
            setChatSidebarOpened: (state) => set({ chatSidebarOpened: state }),
            setChatSidebarTab: (tab) => set({ chatSidebarTab: tab }),
            setSelectedUser: (user) => set({ selectedUser: user }),
            setSelectedMessage: (message) => set({ selectedMessage: message }),
            setChatSentType: (type) => set({ chatSentType: type }),
            setSidebarTab: (tab) => set({ sidebarTab: tab }),
        }),
        { name: "SidebarStore" }
    )
);
