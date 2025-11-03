import {
    CreateMessagePayload,
    ForwardMessagePayload,
    ForwardMessagesPayload,
    IMessage,
} from "@/shared/interfaces/IMessage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
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

export function useMessages(chatId: string) {
    return useQuery<IMessage[], Error>({
        queryKey: ["messages", chatId],
        queryFn: () => fetchMessages(chatId),
    });
}

export function useCreateMessageWithFiles() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            chatId,
            messagePayload,
        }: {
            chatId: string;
            messagePayload: CreateMessagePayload & { files?: File[] };
        }) => fetchCreateMessage(chatId, messagePayload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["messages", variables.chatId] });
            queryClient.invalidateQueries({ queryKey: ["chats"] });
        },
        onError: (error: AxiosError<ServerResponseError>) => {
            const message = error.response?.data.message || error.message;
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
        onError: (error: AxiosError<ServerResponseError>) => {
            const message = error.response?.data.message || error.message;
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
        onError: (error: AxiosError<ServerResponseError>) => {
            const message = error.response?.data.message || error.message;
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
        onError: (error: AxiosError<ServerResponseError>) => {
            const message = error.response?.data.message || error.message;
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
            messagePayload: Partial<CreateMessagePayload>;
        }) => fetchUpdateMessage(messageId, messagePayload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["messages", variables.chatId] });
            queryClient.invalidateQueries({ queryKey: ["chats"] });
        },
        onError: (error: AxiosError<ServerResponseError>) => {
            const message = error.response?.data.message || error.message;
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
        onError: (error: AxiosError<ServerResponseError>) => {
            const message = error.response?.data.message || error.message;
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
        onError: (error: AxiosError<ServerResponseError>) => {
            const message = error.response?.data.message || error.message;
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
        onError: (error: AxiosError<ServerResponseError>) => {
            const message = error.response?.data.message || error.message;
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
        onError: (error: AxiosError<ServerResponseError>) => {
            const message = error.response?.data.message || error.message;
            toast.error(message || "An unknown error occurred");
        },
    });
}
