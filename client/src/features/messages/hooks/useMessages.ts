import { IMessage } from "@/shared/interfaces/IMessage";
import { useQuery } from "@tanstack/react-query";
import { fetchMessages } from "../api/messages.api";

export function useMessages(chatId: string) {
    return useQuery<IMessage[], Error>({
        queryKey: ["messages", chatId],
        queryFn: () => fetchMessages(chatId),
    });
}
