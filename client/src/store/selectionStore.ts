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
    setSelectedFolder: (folder: IFolder | null) => void;
    setSelectedChat: (chat: IChat | null) => void;
    setSelectedUser: (user: IUser | null) => void;
    setSelectedMessage: (message: IMessage | null) => void;
}

export const useSelectionStore = create<SelectionState>()(
    devtools(
        (set) => ({
            selectedFolder: null,
            selectedChat: null,
            selectedUser: null,
            selectedMessage: null,
            setSelectedFolder: (folder) => set({ selectedFolder: folder }),
            setSelectedChat: (chat) => set({ selectedChat: chat }),
            setSelectedUser: (user) => set({ selectedUser: user }),
            setSelectedMessage: (message) => set({ selectedMessage: message }),
        }),
        { name: "SelectionStore" }
    )
);
