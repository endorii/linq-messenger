import { useQueryClient, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { fetchUploadChatFiles } from "../api/files.api";

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
