import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FolderPayload, IChatFolder } from "@/shared/interfaces/IFolder";
import { fetchAddChatFolder, fetchAllUserFolders } from "../api/folders.api";
import { toast } from "sonner";
import { AxiosError } from "axios";

export function useFolders() {
    return useQuery<IChatFolder[], Error>({
        queryKey: ["folders"],
        queryFn: () => fetchAllUserFolders(),
        retry: 3,
    });
}

export function useCreateFolder() {
    const queryClient = useQueryClient();
    return useMutation({
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
