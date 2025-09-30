import { ServerResponseWithMessage } from "@/features/auth/interfaces/auth.interfaces";
import { httpService } from "@/shared/api/httpService";
import { ContactPayload, IContact } from "@/shared/interfaces/IContact";

export async function fetchContacts(): Promise<IContact[]> {
    const { data } = await httpService.get("/contacts");
    return data;
}

export async function fetchAddContact(
    contactPayload: ContactPayload
): Promise<ServerResponseWithMessage<ServerResponseWithMessage<IContact>>> {
    const { data } = await httpService.post("/contacts", contactPayload);
    return data;
}
