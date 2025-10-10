import { httpService } from "@/shared/api/httpService";

export async function fetchGlobalSearch(query: string) {
    const { data } = await httpService.get(`/search?q=${query}`);
    return data;
}
