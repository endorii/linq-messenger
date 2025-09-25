import { useQuery } from "@tanstack/react-query";
import { IFolder } from "@/shared/interfaces/IFolder";
import { fetchAllUserFolders } from "../api/folders.api";

export function useAllFolders() {
    return useQuery<IFolder[], Error>({
        queryKey: ["folders"],
        queryFn: () => fetchAllUserFolders(),
        retry: 3,
    });
}
