import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { fetchUpdatePrivacy, fetchUserPrivacy } from "../api/privacy.api";
import { IPrivacySettings } from "@/shared/interfaces/IPrivacySettings";

export function useUserPrivacy() {
    return useQuery<IPrivacySettings, Error>({
        queryKey: ["me", "privacy"],
        queryFn: () => fetchUserPrivacy(),
        retry: 1,
    });
}
export function useUpdatePrivacy() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (privacyData: Partial<IPrivacySettings>) => fetchUpdatePrivacy(privacyData),

        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["me", "privacy"] });
            // toast.success(data.message);
        },

        onError: (error: AxiosError<any>) => {
            const message = (error.response?.data as any)?.message || error.message;
            toast.error(message || "An unknown error occurred");
        },
    });
}
