import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    fetchAddContact,
    fetchContacts,
    fetchDeleteContact,
    fetchUpdateContact,
} from "../api/contacts.api";
import { toast } from "sonner";
import { ContactPayload, IContact } from "@/shared/interfaces/IContact";
import { AxiosError } from "axios";

export function useContacts() {
    return useQuery<IContact[], Error>({
        queryKey: ["contacts"],
        queryFn: () => fetchContacts(),
        retry: 1,
    });
}

export function useCreateContact() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ contactPayload }: { contactPayload: ContactPayload }) =>
            fetchAddContact(contactPayload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
            toast.success(data.message);
        },
    });
}

export function useUpdateContact() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            chatId,
            contactId,
            updateContactPayload,
        }: {
            chatId: string;
            contactId: string;
            updateContactPayload: Partial<ContactPayload>;
        }) => fetchUpdateContact(contactId, updateContactPayload),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["chats", variables.chatId] });
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
            toast.success(data.message);
        },
    });
}

export function useDeleteContact() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ chatId, contactId }: { chatId: string; contactId: string }) =>
            fetchDeleteContact(contactId),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["chats", variables.chatId] });
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
            toast.success(data.message);
        },
        onError: (error: AxiosError<any>) => {
            const message = (error.response?.data as any)?.message || error.message;
            toast.error(message || "An unknown error occurred");
        },
    });
}
