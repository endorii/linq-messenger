import { useQuery } from "@tanstack/react-query";
import { fetchChat, fetchChats } from "../api/chats.api";
import { IChat } from "@/shared/interfaces/IChat";

export function useChats() {
    return useQuery<IChat[], Error>({
        queryKey: ["chats"],
        queryFn: () => fetchChats(),
        retry: 3,
    });
}

export function useChat(chatId: string) {
    return useQuery<IChat, Error>({
        queryKey: ["chats", chatId],
        queryFn: () => fetchChat(chatId),
        retry: false,
    });
}
