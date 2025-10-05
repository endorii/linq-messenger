import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FolderPayload, IFolder } from "@/shared/interfaces/IFolder";
import {
    fetchAddChatFolder,
    fetchAllUserFolders,
    fetchDeleteChatFolder,
    fetchUpdateChatFolder,
} from "../api/folders.api";
import { toast } from "sonner";
import { AxiosError } from "axios";

export function useFolders() {
    return useQuery<IFolder[], Error>({
        queryKey: ["folders"],
        queryFn: () => fetchAllUserFolders(),
        retry: 1,
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
export function useUpdateFolder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            folderId,
            folderPayload,
        }: {
            folderId: string;
            folderPayload: Partial<FolderPayload>;
        }) => fetchUpdateChatFolder(folderId, folderPayload),

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
export function useDeleteFolder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (folderId: string) => fetchDeleteChatFolder(folderId),
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
