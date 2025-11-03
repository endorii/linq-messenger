import { BlockUserPayload } from "@/shared/interfaces/IBlockedUser";
import { ServerResponseError } from "@/shared/interfaces/ServerResponseError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { fetchToggleBlockUser } from "../api/user-blocks.api";

export function useToggleBlockUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            chatId,
            blockUserPayload,
        }: {
            chatId: string;
            blockUserPayload: BlockUserPayload;
        }) => fetchToggleBlockUser(blockUserPayload),
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
