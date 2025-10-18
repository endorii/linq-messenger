import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    fetchChat,
    fetchChats,
    fetchChatsByFolder,
    fetchCreateChat,
    fetchCreatePrivateChat,
    fetchDeleteChat,
    fetchLeaveChat,
    fetchUpdateChat,
} from "../api/chats.api";
import { ChatPayload, IChat } from "@/shared/interfaces/IChat";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { usePathname, useRouter } from "next/navigation";

export function useChats() {
    return useQuery<IChat[], Error>({
        queryKey: ["chats"],
        queryFn: () => fetchChats(),
        retry: 3,
    });
}

export function useFolderChats(folderId: string, options?: { enabled?: boolean }) {
    return useQuery<IChat[], Error>({
        queryKey: ["chats", "folder", folderId],
        queryFn: () => fetchChatsByFolder(folderId),
        enabled: (options?.enabled ?? true) && !!folderId,
    });
}

export function useChat(chatId: string) {
    return useQuery<IChat, Error>({
        queryKey: ["chats", chatId],
        queryFn: () => fetchChat(chatId),
        retry: false,
    });
}

export function useCreatePrivateChat() {
    const queryClient = useQueryClient();
    const router = useRouter();
    return useMutation({
        mutationFn: (otherUserId: string | undefined) => fetchCreatePrivateChat(otherUserId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["chats"] });
            // toast.success(data.message);
            router.push(`/${data.data?.id}`);
        },
        onError: (error: AxiosError<any>) => {
            const message = (error.response?.data as any)?.message || error.message;
            toast.error(message || "An unknown error occurred");
        },
    });
}

export function useCreateChat() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (chatPayload: ChatPayload) => fetchCreateChat(chatPayload),
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

export function useUpdateChat() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            chatId,
            updateChatPayload,
        }: {
            chatId: string;
            updateChatPayload: Partial<ChatPayload>;
        }) => fetchUpdateChat(chatId, updateChatPayload),
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

export function useLeaveChat() {
    const router = useRouter();
    const pathname = usePathname();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (chatId: string) => fetchLeaveChat(chatId),
        onSuccess: (data, chatId) => {
            queryClient.invalidateQueries({ queryKey: ["chats"] });
            toast.success(data.message);

            // Перевірка: якщо користувач зараз на сторінці чату
            if (pathname === `/${chatId}`) {
                router.push("/");
            }
        },
        onError: (error: AxiosError<any>) => {
            const message = (error.response?.data as any)?.message || error.message;
            toast.error(message || "An unknown error occurred");
        },
    });
}

export function useDeleteChat() {
    const router = useRouter();
    const pathname = usePathname();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (chatId: string) => fetchDeleteChat(chatId),
        onSuccess: (data, chatId) => {
            queryClient.invalidateQueries({ queryKey: ["chats"] });
            toast.success(data.message);

            // Перевірка: якщо користувач зараз на сторінці чату
            if (pathname === `/${chatId}`) {
                router.push("/");
            }
        },
        onError: (error: AxiosError<any>) => {
            const message = (error.response?.data as any)?.message || error.message;
            toast.error(message || "An unknown error occurred");
        },
    });
}
