import { fetchUniqueUsername, fetchUpdateUser } from "@/features/users/api/users.api";
import { IUser } from "@/shared/interfaces";
import { ServerResponseError } from "@/shared/interfaces/ServerResponseError";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export function useUniqueUsername(username: string) {
    return useQuery({
        queryKey: ["unique-username", username],
        queryFn: () => fetchUniqueUsername(username),
        enabled: !!username && username.length > 0,
        retry: false,
        staleTime: 0,
    });
}

export function useUpdateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updateUserData: Partial<IUser>) => fetchUpdateUser(updateUserData),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["me"] });
            toast.success(data.message);
        },
        onError: (error: AxiosError<ServerResponseError>) => {
            const message = error.response?.data.message || error.message;
            toast.error(message || "An unknown error occurred");
        },
    });
}
