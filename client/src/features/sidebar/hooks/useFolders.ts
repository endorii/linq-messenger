import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FolderPayload, IFolder } from "@/shared/interfaces/IFolder";
import { fetchAddChatFolder, fetchAllUserFolders } from "../api/folders.api";
import { toast } from "sonner";
import { AxiosError } from "axios";

export function useAllFolders() {
    return useQuery<IFolder[], Error>({
        queryKey: ["folders"],
        queryFn: () => fetchAllUserFolders(),
        retry: 3,
    });
}

export function usePostFolder() {
    const queryClient = useQueryClient();
    return useMutation({
        // mutationKey: ["post-folder"],
        mutationFn: (folderPayload: FolderPayload) => fetchAddChatFolder(folderPayload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["folders"] });
            toast.success(data.message);
        },
        onError: (error: AxiosError<any>) => {
            const message = (error.response?.data as any)?.message || error.message;
            toast.error(message || "An unknown error occurred");
        },
    });
}
