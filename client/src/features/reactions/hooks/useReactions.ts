import { ReactionPayload } from "@/shared/interfaces/IMessage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
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

        onError: (error: AxiosError<ServerResponseError>) => {
            const message = error.response?.data.message || error.message;
            toast.error(message || "An unknown error occurred");
        },
    });
}
