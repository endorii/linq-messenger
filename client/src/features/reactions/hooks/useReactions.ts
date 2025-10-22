import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ReactionPayload } from "@/shared/interfaces/IMessage";
import { fetchToggleReaction } from "../api/reactions.api";

export function useToggleReaction() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            chatId,
            reactionPayload,
        }: {
            chatId: string;
            reactionPayload: ReactionPayload;
        }) => fetchToggleReaction(reactionPayload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["pinned-messages", variables.chatId] });
            queryClient.invalidateQueries({ queryKey: ["messages", variables.chatId] });
        },

        onError: (error: AxiosError<any>) => {
            const message = (error.response?.data as any)?.message || error.message;
            toast.error(message || "An unknown error occurred");
        },
    });
}
