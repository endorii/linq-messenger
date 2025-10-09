import { IMessage, MessagePayload } from "@/shared/interfaces/IMessage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCreateMessage, fetchMessages, fetchUpdateMessage } from "../api/messages.api";
import { AxiosError } from "axios";
import { toast } from "sonner";

export function useMessages(chatId: string) {
    return useQuery<IMessage[], Error>({
        queryKey: ["messages", chatId],
        queryFn: () => fetchMessages(chatId),
    });
}

export function useCreateMessage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            chatId,
            messagePayload,
        }: {
            chatId: string;
            messagePayload: MessagePayload;
        }) => fetchCreateMessage(chatId, messagePayload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["messages", variables.chatId] });
            queryClient.invalidateQueries({ queryKey: ["chats"] });
        },
        onError: (error: AxiosError<any>) => {
            const message = (error.response?.data as any)?.message || error.message;
            toast.error(message || "An unknown error occurred");
        },
    });
}

export function useUpdateMessage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            chatId,
            messageId,
            messagePayload,
        }: {
            chatId: string;
            messageId: string;
            messagePayload: Partial<MessagePayload>;
        }) => fetchUpdateMessage(messageId, messagePayload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["messages", variables.chatId] });
            queryClient.invalidateQueries({ queryKey: ["chats"] });
        },
        onError: (error: AxiosError<any>) => {
            const message = (error.response?.data as any)?.message || error.message;
            toast.error(message || "An unknown error occurred");
        },
    });
}
