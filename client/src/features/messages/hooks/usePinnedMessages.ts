import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { fetchTogglePinMessage } from "../api/pinned-messages.api";

export function useTogglePinMessage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ chatId, messageId }: { chatId: string; messageId: string }) =>
            fetchTogglePinMessage(chatId, messageId),
        onSuccess: (_, variables) => {
            toast.success("Message pin status changed");
            queryClient.invalidateQueries({ queryKey: ["messages", variables.chatId] });
            queryClient.invalidateQueries({ queryKey: ["chats", variables.chatId] });
        },
        onError: (error: AxiosError<any>) => {
            const message = (error.response?.data as any)?.message || error.message;
            toast.error(message || "An unknown error occurred");
        },
    });
}
