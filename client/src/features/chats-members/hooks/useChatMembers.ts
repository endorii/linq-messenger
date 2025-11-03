import { IChatMember } from "@/shared/interfaces/IChatMember";
import { ServerResponseError } from "@/shared/interfaces/ServerResponseError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import {
    fetchAddMembersToChat,
    fetchToggleMarkChat,
    fetchToggleMuteChat,
} from "../api/chat-members.api";

export function useToggleMarkChat() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            chatId,
            updateChatMemberPayload,
        }: {
            chatId: string;
            updateChatMemberPayload: Partial<IChatMember>;
        }) => fetchToggleMarkChat(chatId, updateChatMemberPayload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["chats"] });
            toast.success(data.message);
        },
        onError: (error: AxiosError<ServerResponseError>) => {
            const message = error.response?.data.message || error.message;
            toast.error(message || "An unknown error occurred");
        },
    });
}

export function useToggleMuteChat() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            chatId,
            updateChatMemberPayload,
        }: {
            chatId: string;
            updateChatMemberPayload: Partial<IChatMember>;
        }) => fetchToggleMuteChat(chatId, updateChatMemberPayload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["chats"] });
            toast.success(data.message);
        },
        onError: (error: AxiosError<ServerResponseError>) => {
            const message = error.response?.data.message || error.message;
            toast.error(message || "An unknown error occurred");
        },
    });
}

export function useAddMembersToChat() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ chatId, newMembers }: { chatId: string; newMembers: string[] }) =>
            fetchAddMembersToChat(chatId, newMembers),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["chats", variables.chatId] });
            toast.success(data.message);
        },
        onError: (error: AxiosError<ServerResponseError>) => {
            const message = error.response?.data.message || error.message;
            toast.error(message || "An unknown error occurred");
        },
    });
}
