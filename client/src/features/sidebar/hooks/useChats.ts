import { useQuery } from "@tanstack/react-query";
import { fetchAllUserChats } from "../api/chats.api";
import { IChat } from "@/shared/interfaces/IChat";

export function useAllChats() {
    return useQuery<IChat[], Error>({
        queryKey: ["chats"],
        queryFn: () => fetchAllUserChats(),
        retry: 3,
    });
}
