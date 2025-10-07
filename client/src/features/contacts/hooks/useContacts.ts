import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    fetchAddContact,
    fetchContacts,
    fetchDeleteContact,
    fetchUpdateContact,
} from "../api/contacts.api";
import { toast } from "sonner";
import { ContactPayload, IContact } from "@/shared/interfaces/IContact";

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
        mutationFn: (contactPayload: ContactPayload) => fetchAddContact(contactPayload),
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
            contactId,
            updateContactPayload,
        }: {
            contactId: string;
            updateContactPayload: Partial<ContactPayload>;
        }) => fetchUpdateContact(contactId, updateContactPayload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
            toast.success(data.message);
        },
    });
}

export function useDeleteContact() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (contactId: string) => fetchDeleteContact(contactId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
            toast.success(data.message);
        },
    });
}
