import {
    ForwardMessagePayload,
    ForwardMessagesPayload,
    IMessage,
    MessagePayload,
} from "@/shared/interfaces/IMessage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    fetchCreateMessage,
    fetchDeleteMessage,
    fetchDeleteMessageForMe,
    fetchDeleteMessages,
    fetchDeleteMessagesForMe,
    fetchForwardMessage,
    fetchForwardMessages,
    fetchMessages,
    fetchUpdateMessage,
    fetchUpdateReadMessages,
} from "../api/messages.api";
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

export function useForwardMessage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ chatIds, messageId }: ForwardMessagePayload) =>
            fetchForwardMessage({ chatIds, messageId }),
        onSuccess: (_, variables) => {
            variables.chatIds.forEach((chatId) => {
                queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
            });
            queryClient.invalidateQueries({ queryKey: ["chats"] });
        },
        onError: (error: AxiosError<any>) => {
            const message = (error.response?.data as any)?.message || error.message;
            toast.error(message || "An unknown error occurred");
        },
    });
}

export function useForwardMessages() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ chatIds, messageIds }: ForwardMessagesPayload) =>
            fetchForwardMessages({ chatIds, messageIds }),
        onSuccess: (_, variables) => {
            variables.chatIds.forEach((chatId) => {
                queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
            });
            queryClient.invalidateQueries({ queryKey: ["chats"] });
        },
        onError: (error: AxiosError<any>) => {
            const message = (error.response?.data as any)?.message || error.message;
            toast.error(message || "An unknown error occurred");
        },
    });
}

export function useUpdateReadMessages() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            chatId,
            updateReadMessagesPayload,
        }: {
            chatId: string;
            updateReadMessagesPayload: { messageIds: string[] };
        }) => fetchUpdateReadMessages(updateReadMessagesPayload),
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

export function useDeleteMessageForMe() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ chatId, messageId }: { chatId: string; messageId: string }) =>
            fetchDeleteMessageForMe(messageId),
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

export function useDeleteMessage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ chatId, messageId }: { chatId: string; messageId: string }) =>
            fetchDeleteMessage(messageId),
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

export function useDeleteMessagesForMe() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ chatId, messageIds }: { chatId: string; messageIds: string[] }) =>
            fetchDeleteMessagesForMe(messageIds),
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

export function useDeleteMessages() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ chatId, messageIds }: { chatId: string; messageIds: string[] }) =>
            fetchDeleteMessages(messageIds),
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
