import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import {
    fetchCreatePinMessage,
    fetchDeletePinnedMessage,
    fetchPinMessages,
    fetchUnpinAllMessages,
} from "../api/pinned-messages.api";
import { IPinnedMessage } from "@/shared/interfaces/IMessage";

export function usePinMessages(chatId: string) {
    return useQuery<IPinnedMessage[], Error>({
        queryKey: ["pinned-messages", chatId],
        queryFn: () => fetchPinMessages(chatId),
        retry: 1,
    });
}

export function useCreatePinMessage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ chatId, messageId }: { chatId: string; messageId: string }) =>
            fetchCreatePinMessage(chatId, messageId),
        onSuccess: (data, variables) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ["pinned-messages", variables.chatId] });
            queryClient.invalidateQueries({ queryKey: ["messages", variables.chatId] });
            queryClient.invalidateQueries({ queryKey: ["chats", variables.chatId] });
        },
        onError: (error: AxiosError<any>) => {
            const message = (error.response?.data as any)?.message || error.message;
            toast.error(message || "An unknown error occurred");
        },
    });
}

export function useDeletePinnedMessage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ chatId, messageId }: { chatId: string; messageId: string }) =>
            fetchDeletePinnedMessage(chatId, messageId),
        onSuccess: (data, variables) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ["pinned-messages", variables.chatId] });
            queryClient.invalidateQueries({ queryKey: ["messages", variables.chatId] });
            queryClient.invalidateQueries({ queryKey: ["chats", variables.chatId] });
        },
        onError: (error: AxiosError<any>) => {
            const message = (error.response?.data as any)?.message || error.message;
            toast.error(message || "An unknown error occurred");
        },
    });
}

export function useUnpinAllMessages() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (chatId: string) => fetchUnpinAllMessages(chatId),
        onSuccess: (data, chatId) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ["pinned-messages", chatId] });
            queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
            queryClient.invalidateQueries({ queryKey: ["chats", chatId] });
        },
        onError: (error: AxiosError<any>) => {
            const message = (error.response?.data as any)?.message || error.message;
            toast.error(message || "An unknown error occurred");
        },
    });
}
