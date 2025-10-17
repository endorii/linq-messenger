import { BlockUserPayload } from "@/shared/interfaces/IBlockedUser";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
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
        onError: (error: AxiosError<any>) => {
            const message = (error.response?.data as any)?.message || error.message;
            toast.error(message || "An unknown error occurred");
        },
    });
}
