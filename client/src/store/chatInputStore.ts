import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ChatSentType } from "@/shared/types/types";
import { IMessage } from "@/shared/interfaces/IMessage";

interface ChatInputState {
    chatSentType: ChatSentType;
    messageForEdit: IMessage | null;
    messageForReply: IMessage | null;
    setChatSentType: (type: ChatSentType) => void;
    setMessageForEdit: (message: IMessage | null) => void;
    setMessageForReply: (message: IMessage | null) => void;
}

export const useChatInputStore = create<ChatInputState>()(
    devtools(
        (set) => ({
            chatSentType: "sent",
            messageForEdit: null,
            messageForReply: null,
            setChatSentType: (type) => set({ chatSentType: type }),
            setMessageForEdit: (message) => set({ messageForEdit: message }),
            setMessageForReply: (message) => set({ messageForReply: message }),
        }),
        { name: "ChatInputStore" }
    )
);
