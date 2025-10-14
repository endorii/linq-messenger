import { useQueryClient, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { IChatMember } from "@/shared/interfaces/IChatMember";
import { fetchToggleMarkChat, fetchToggleMuteChat } from "../api/chat-members.api";

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
        onError: (error: AxiosError<any>) => {
            const message = (error.response?.data as any)?.message || error.message;
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
        onError: (error: AxiosError<any>) => {
            const message = (error.response?.data as any)?.message || error.message;
            toast.error(message || "An unknown error occurred");
        },
    });
}
