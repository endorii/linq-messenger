import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { IFolder } from "@/shared/interfaces/IFolder";
import { IUser } from "@/shared/interfaces/IUser";
import { IChat } from "@/shared/interfaces/IChat";
import { IMessage } from "@/shared/interfaces/IMessage";

interface SelectionState {
    selectedFolder: IFolder | null;
    selectedChat: IChat | null;
    selectedUser: IUser | null;
    selectedMessage: IMessage | null;
    selectedMessages: string[];

    setSelectedFolder: (folder: IFolder | null) => void;
    setSelectedChat: (chat: IChat | null) => void;
    setSelectedUser: (user: IUser | null) => void;
    setSelectedMessage: (message: IMessage | null) => void;

    toggleSelectedMessage: (messageId: string) => void;
    clearSelectedMessages: () => void;
}

export const useSelectionStore = create<SelectionState>()(
    devtools(
        (set) => ({
            selectedFolder: null,
            selectedChat: null,
            selectedUser: null,
            selectedMessage: null,
            selectedMessages: [],

            setSelectedFolder: (folder) => set({ selectedFolder: folder }),
            setSelectedChat: (chat) => {
                set({ selectedChat: chat, selectedMessages: [] });
            },
            setSelectedUser: (user) => set({ selectedUser: user }),
            setSelectedMessage: (message) => set({ selectedMessage: message }),

            toggleSelectedMessage: (messageId) =>
                set((state) => {
                    const exists = state.selectedMessages.includes(messageId);
                    return {
                        selectedMessages: exists
                            ? state.selectedMessages.filter((id) => id !== messageId)
                            : [...state.selectedMessages, messageId],
                    };
                }),

            clearSelectedMessages: () => set({ selectedMessages: [] }),
        }),
        { name: "SelectionStore" }
    )
);
