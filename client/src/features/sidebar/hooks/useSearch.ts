import { useQuery } from "@tanstack/react-query";
import { fetchGlobalSearch } from "../api/search.api";

export function useGlobalSearch(query: string) {
    return useQuery({
        queryKey: ["globalSearch", query],
        queryFn: () => fetchGlobalSearch(query),
        enabled: query.trim().length > 0,
        retry: false,
    });
}
