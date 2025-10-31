import { useQueryClient, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { fetchUploadAvatar, fetchUploadChatAvatar, fetchUploadChatFiles } from "../api/files.api";

export function usePostFiles() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            files,
            chatId,
            messageId,
        }: {
            files: File[];
            chatId: string;
            messageId: string;
        }) => fetchUploadChatFiles(files, messageId),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["messages", variables.chatId] });
        },
        onError: (error: AxiosError<any>) => {
            const message = (error.response?.data as any)?.message || error.message;
            toast.error(message || "An unknown error occurred");
        },
    });
}

export function usePostAvatar() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (avatar: File) => fetchUploadAvatar(avatar),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["me"] });
            queryClient.invalidateQueries({ queryKey: ["chats"] });
            toast.error(data.message);
        },
        onError: (error: AxiosError<any>) => {
            const message = (error.response?.data as any)?.message || error.message;
            toast.error(message || "An unknown error occurred");
        },
    });
}

export function usePostChatAvatar() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ avatar, chatId }: { avatar: File; chatId: string }) =>
            fetchUploadChatAvatar(avatar, chatId),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["chats"] });
            queryClient.invalidateQueries({ queryKey: ["chats", variables.chatId] });
            toast.error(data.message);
        },
        onError: (error: AxiosError<any>) => {
            const message = (error.response?.data as any)?.message || error.message;
            toast.error(message || "An unknown error occurred");
        },
    });
}
