import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchChat, fetchChats, fetchCreateChannel, fetchCreateGroupChat } from "../api/chats.api";
import { ChannelPayload, GroupChatPayload, IChat } from "@/shared/interfaces/IChat";
import { toast } from "sonner";
import { AxiosError } from "axios";

export function useChats() {
    return useQuery<IChat[], Error>({
        queryKey: ["chats"],
        queryFn: () => fetchChats(),
        retry: 3,
    });
}

export function useChat(chatId: string) {
    return useQuery<IChat, Error>({
        queryKey: ["chats", chatId],
        queryFn: () => fetchChat(chatId),
        retry: false,
    });
}

export function useCreateGroupChat() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (groupChatPayload: GroupChatPayload) => fetchCreateGroupChat(groupChatPayload),
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

export function useCreateChannel() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (channelPayload: ChannelPayload) => fetchCreateChannel(channelPayload),
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
